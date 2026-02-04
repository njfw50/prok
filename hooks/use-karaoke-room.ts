import { useEffect, useRef, useState, useCallback } from 'react';
import { generateToken } from '@/server/auth';

interface RoomState {
  roomId: string | null;
  roomName: string | null;
  isHost: boolean;
  participants: string[];
  isPlaying: boolean;
  currentSongId: string | null;
  currentTime: number;
}

export function useKaraokeRoom(userId: string, username: string) {
  const ws = useRef<WebSocket | null>(null);
  const [roomState, setRoomState] = useState<RoomState>({
    roomId: null,
    roomName: null,
    isHost: false,
    participants: [],
    isPlaying: false,
    currentSongId: null,
    currentTime: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${typeof window !== 'undefined' ? window.location.host : 'localhost:8080'}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      // Authenticate
      const token = generateToken(userId, username, 'user');
      ws.current?.send(
        JSON.stringify({
          type: 'authenticate',
          token,
          userId,
          username,
        })
      );
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.current.onerror = (error) => {
      setError('WebSocket connection error');
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId, username]);

  const handleMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'authenticated':
        setError(null);
        break;
      case 'room_created':
        setRoomState((prev) => ({
          ...prev,
          roomId: data.roomId,
          roomName: data.roomName,
          isHost: true,
          participants: [userId],
        }));
        break;
      case 'room_joined':
        setRoomState((prev) => ({
          ...prev,
          roomId: data.roomId,
          roomName: data.roomName,
          isPlaying: data.isPlaying,
          currentSongId: data.currentSongId,
          currentTime: data.currentTime,
        }));
        break;
      case 'user_joined':
        setRoomState((prev) => ({
          ...prev,
          participants: [...prev.participants, data.userId],
        }));
        break;
      case 'user_left':
        setRoomState((prev) => ({
          ...prev,
          participants: prev.participants.filter((id) => id !== data.userId),
        }));
        break;
      case 'song_playing':
        setRoomState((prev) => ({
          ...prev,
          isPlaying: true,
          currentSongId: data.songId,
          currentTime: 0,
        }));
        break;
      case 'time_sync':
        setRoomState((prev) => ({
          ...prev,
          currentTime: data.currentTime,
        }));
        break;
      case 'song_stopped':
        setRoomState((prev) => ({
          ...prev,
          isPlaying: false,
          currentSongId: null,
          currentTime: 0,
        }));
        break;
      case 'error':
        setError(data.message);
        break;
    }
  }, [userId]);

  const createRoom = useCallback((roomName: string) => {
    if (!isConnected) {
      setError('Not connected to server');
      return;
    }
    ws.current?.send(JSON.stringify({ type: 'create_room', roomName }));
  }, [isConnected]);

  const joinRoom = useCallback((roomId: string) => {
    if (!isConnected) {
      setError('Not connected to server');
      return;
    }
    ws.current?.send(JSON.stringify({ type: 'join_room', roomId }));
  }, [isConnected]);

  const playSong = useCallback((songId: string) => {
    if (!roomState.isHost) {
      setError('Only host can play songs');
      return;
    }
    ws.current?.send(JSON.stringify({ type: 'play_song', songId }));
  }, [roomState.isHost]);

  const stopSong = useCallback(() => {
    if (!roomState.isHost) {
      setError('Only host can stop songs');
      return;
    }
    ws.current?.send(JSON.stringify({ type: 'stop_song' }));
  }, [roomState.isHost]);

  const syncTime = useCallback(() => {
    ws.current?.send(JSON.stringify({ type: 'sync_time' }));
  }, []);

  const leaveRoom = useCallback(() => {
    ws.current?.send(JSON.stringify({ type: 'leave_room' }));
    setRoomState({
      roomId: null,
      roomName: null,
      isHost: false,
      participants: [],
      isPlaying: false,
      currentSongId: null,
      currentTime: 0,
    });
  }, []);

  return {
    roomState,
    isConnected,
    error,
    createRoom,
    joinRoom,
    playSong,
    stopSong,
    syncTime,
    leaveRoom,
  };
}
