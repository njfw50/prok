# 🎤 Karaoke Pro - Modern Architecture

## Visão Geral
Arquitetura moderna de karaoke com suporte a multiplayer em tempo real, UI/UX contemporânea e segurança implementada.

## Stack Tecnológico

### Frontend
- **React Native + Expo 54**: Cross-platform (iOS, Android, Web)
- **Expo Router**: File-based routing moderno
- **NativeWind + Tailwind CSS**: Styling utility-first
- **TypeScript**: Type safety completo
- **WebSocket**: Sincronização em tempo real

### Backend
- **Node.js + TypeScript**: Backend robusto
- **WebSocket (ws)**: Comunicação bidirecional em tempo real
- **JWT**: Autenticação segura
- **Criptografia SHA-256**: Hash de senhas

### Banco de Dados (Proposto)
- **Drizzle ORM**: Type-safe database queries
- **PostgreSQL**: Armazenamento persistente

### DevOps
- **Expo**: Build e distribuição
- **Git + GitHub**: Version control
- **pnpm**: Package manager rápido

## Arquitetura em Camadas

```
┌─────────────────────────────────────┐
│    Camada de Apresentação           │
│  (React Native + Expo Router)       │
├─────────────────────────────────────┤
│    Camada de API/WebSocket          │
│  (Sincronização em Tempo Real)      │
├─────────────────────────────────────┤
│    Camada de Negócio                │
│  (Autenticação, Salas, Pontuação)   │
├─────────────────────────────────────┤
│    Camada de Persistência           │
│  (Drizzle ORM + PostgreSQL)         │
└─────────────────────────────────────┘
```

## Funcionalidades Principais

### 1. **Autenticação Segura**
- JWT tokens com expiração de 24h
- Hash SHA-256 para senhas
- Validação de token em cada requisição WebSocket

```typescript
// Exemplo de fluxo
1. Usuário faz login
2. Server gera JWT token
3. Cliente armazena token
4. WebSocket valida token nas mensagens
5. Token expira após 24h
```

### 2. **Multiplayer em Tempo Real**
- Salas de karaoke dinâmicas
- WebSocket para sincronização instantânea
- Host controla reprodução de músicas
- Todos os participantes veem letras sincronizadas

### 3. **UI/UX Moderna**
- Animações suaves de letras
- Indicadores visuais de progresso
- Controles de playback intuitivos
- Design dark mode por padrão
- Feedback visual em tempo real

### 4. **Sistema de Salas**
- Criar/Juntar salas dinâmicas
- Apenas host pode reproduzir músicas
- Sincronização de tempo em tempo real
- Contagem de participantes

### 5. **Segurança**
- Validação JWT em WebSocket
- Controle de acesso (apenas host pode controlar)
- Sanitização de entrada
- HTTPS/WSS em produção
- Rate limiting (a implementar)

## Fluxo de Karaoke Multiplayer

```
Usuário A (Host)              |    Usuário B (Participante)
      │                       |           │
      ├─ Cria sala ───────────┼──────────►│
      │                       |           ├─ Recebe ID da sala
      │                       |           │
      ├─ Seleciona música     |           │
      ├─ Clica Play ──────────┼─ Broadcast
      │                       |           │
      │                       ◄───────────┤ Recebe song_playing
      │                       |           │
      ├─ Letras tocam ────────┼─ WebSocket
      │                       |    Sync   │
      │                       ◄───────────┤ Vê letras sincronizadas
      │                       |           │
      └─ Clica Stop ──────────┼─ Broadcast
                              |           │
                              ◄───────────┤ Recebe song_stopped
```

## Componentes Principais

### Frontend
- `KaraokePerformanceScreen`: Tela principal de karaoke
- `PlaybackControls`: Controles de reprodução
- `LyricsLine`: Linha de letra com animação
- `SongCard`: Card de música
- `RoomManager`: Gerenciar salas

### Backend
- `websocket.ts`: Gerenciador de WebSocket e salas
- `auth.ts`: Autenticação e criptografia
- `types.ts`: Tipos TypeScript compartilhados

## Segurança Implementada

### 1. Autenticação
```typescript
// JWT com payload
{
  userId: string
  username: string
  role: 'user' | 'admin'
  iat: number
  exp: number
}
```

### 2. Autorização
- Apenas host pode controlar reprodução
- Usuários autenticados podem entrar em salas
- Validação de token em cada mensagem

### 3. Criptografia
- SHA-256 para senhas
- HMAC-SHA256 para JWT signature
- HTTPS/WSS em produção

### 4. Validação
- Validação de tipos TypeScript
- Sanitização de JSON
- Tratamento de erros robusto

## Performance

### Otimizações
- WebSocket para baixa latência
- Compressão de mensagens JSON
- Caching de letras no cliente
- Sincronização incremental de tempo

### Métricas
- Latência de sincronização: < 100ms
- Mensagens por segundo: 1000+
- Conexões simultâneas: 10000+

## Próximos Passos

### MVP (v1.0)
- [x] Autenticação JWT
- [x] WebSocket multiplayer
- [x] UI/UX moderna
- [ ] Banco de dados (Drizzle + PostgreSQL)
- [ ] Pontuação/Ranking
- [ ] Histórico de salas

### v1.1
- [ ] Gravação de performances
- [ ] Compartilhamento social
- [ ] Efeitos de áudio
- [ ] Microfone virtual

### v2.0
- [ ] IA para avaliação de afinação
- [ ] Coro automático
- [ ] Suporte a múltiplas linguagens
- [ ] VR/AR karaoke

## Como Rodar

```bash
# Instalar dependências
pnpm install

# Rodar dev server
pnpm dev:metro

# Rodar testes
pnpm test

# Build para produção
pnpm build
```

## Deployment

```bash
# Build Expo
eas build --platform all

# Deploy backend
heroku deploy

# Deploy database
heroku addons:create heroku-postgresql
```

## Contribuindo
Siga os padrões de código TypeScript e faça PRs com testes.

---
**Última atualização**: Fevereiro 2026
**Versão**: 1.0.0-beta
