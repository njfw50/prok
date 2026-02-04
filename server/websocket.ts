import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { verifyToken } from './auth';

interface KaraokeRoom {
  id: string;
  name: string;
  host: string;
  participants: Set<string>;
  isPlaying: boolean;
  currentSongId: string | null;
  currentTime: number;
  startTime: number | null;
}

interface KaraokeClient {
  ws: WebSocket;
  userId: string;
  username: string;
  roomId: string | null;
}

const rooms = new Map<string, KaraokeRoom>();
const clients = new Map<WebSocket, KaraokeClient>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('[WebSocket] New connection');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        handleMessage(ws, data);
      } catch (error) {
        console.error('[WebSocket] Invalid message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      const client = clients.get(ws);
      if (client && client.roomId) {
        const room = rooms.get(client.roomId);
        if (room) {
          room.participants.delete(client.userId);
          broadcastToRoom(client.roomId, {
            type: 'user_left',
            userId: client.userId,
            username: client.username,
            participantCount: room.participants.size,
          });
        }
      }
      clients.delete(ws);
      console.log('[WebSocket] Connection closed');
    });

    ws.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });
  });

  return wss;
}

function handleMessage(ws: WebSocket, data: any) {
  switch (data.type) {
    case 'authenticate':
      handleAuthenticate(ws, data);
      break;
    case 'create_room':
      handleCreateRoom(ws, data);
      break;
    case 'join_room':
      handleJoinRoom(ws, data);
      break;
    case 'play_song':
      handlePlaySong(ws, data);
      break;
    case 'sync_time':
      handleSyncTime(ws, data);
      break;
    case 'stop_song':
      handleStopSong(ws, data);
      break;
    case 'leave_room':
      handleLeaveRoom(ws, data);
      break;
    default:
      ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
  }
}

function handleAuthenticate(ws: WebSocket, data: any) {
  const { token, userId, username } = data;

  if (!token || !userId || !username) {
    ws.send(JSON.stringify({ type: 'error', message: 'Missing authentication data' }));
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
    return;
  }

  clients.set(ws, { ws, userId, username, roomId: null });
  ws.send(JSON.stringify({ type: 'authenticated', userId, username }));
}

function handleCreateRoom(ws: WebSocket, data: any) {
  const client = clients.get(ws);
  if (!client) {
    ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
    return;
  }

  const { roomName } = data;
  const roomId = Math.random().toString(36).substr(2, 9);

  const room: KaraokeRoom = {
    id: roomId,
    name: roomName || `Room ${roomId}`,
    host: client.userId,
    participants: new Set([client.userId]),
    isPlaying: false,
    currentSongId: null,
    currentTime: 0,
    startTime: null,
  };

  rooms.set(roomId, room);
  client.roomId = roomId;

  ws.send(
    JSON.stringify({
      type: 'room_created',
      roomId,
      roomName: room.name,
      participantCount: room.participants.size,
    })
  );
}

function handleJoinRoom(ws: WebSocket, data: any) {
  const client = clients.get(ws);
  if (!client) {
    ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
    return;
  }

  const { roomId } = data;
  const room = rooms.get(roomId);

  if (!room) {
    ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
    return;
  }

  client.roomId = roomId;
  room.participants.add(client.userId);

  ws.send(
    JSON.stringify({
      type: 'room_joined',
      roomId,
      roomName: room.name,
      isPlaying: room.isPlaying,
      currentSongId: room.currentSongId,
      currentTime: room.currentTime,
      participantCount: room.participants.size,
    })
  );

  broadcastToRoom(roomId, {
    type: 'user_joined',
    userId: client.userId,
    username: client.username,
    participantCount: room.participants.size,
  });
}

function handlePlaySong(ws: WebSocket, data: any) {
  const client = clients.get(ws);
  if (!client || !client.roomId) {
    ws.send(JSON.stringify({ type: 'error', message: 'Not in a room' }));
    return;
  }

  const room = rooms.get(client.roomId);
  if (!room || room.host !== client.userId) {
    ws.send(JSON.stringify({ type: 'error', message: 'Only host can play songs' }));
    return;
  }

  const { songId } = data;
  room.currentSongId = songId;
  room.isPlaying = true;
  room.currentTime = 0;
  room.startTime = Date.now();

  broadcastToRoom(client.roomId, {
    type: 'song_playing',
    songId,
    startTime: room.startTime,
  });
}

function handleSyncTime(ws: WebSocket, data: any) {
  const client = clients.get(ws);
  if (!client || !client.roomId) return;

  const room = rooms.get(client.roomId);
  if (!room || !room.isPlaying) return;

  const elapsed = Date.now() - (room.startTime || Date.now());
  room.currentTime = elapsed;

  broadcastToRoom(client.roomId, {
    type: 'time_sync',
    currentTime: room.currentTime,
  });
}

function handleStopSong(ws: WebSocket, data: any) {
  const client = clients.get(ws);
  if (!client || !client.roomId) return;

  const room = rooms.get(client.roomId);
  if (!room || room.host !== client.userId) return;

  room.isPlaying = false;
  room.currentSongId = null;
  room.startTime = null;

  broadcastToRoom(client.roomId, {
    type: 'song_stopped',
  });
}

function handleLeaveRoom(ws: WebSocket, data: any) {
  const client = clients.get(ws);
  if (!client || !client.roomId) return;

  const room = rooms.get(client.roomId);
  if (room) {
    room.participants.delete(client.userId);
    if (room.participants.size === 0) {
      rooms.delete(client.roomId);
    } else {
      broadcastToRoom(client.roomId, {
        type: 'user_left',
        userId: client.userId,
        username: client.username,
        participantCount: room.participants.size,
      });
    }
  }

  client.roomId = null;
  ws.send(JSON.stringify({ type: 'left_room' }));
}

function broadcastToRoom(roomId: string, message: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.roomId === roomId && client.ws.readyState === 1) {
      client.ws.send(messageStr);
    }
  });
}
