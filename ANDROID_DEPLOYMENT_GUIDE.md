# 🎤 Karaoke Pro - Guia de Execução e Deploy Android no Windows

## Status Atual ✅

- **Versão**: 1.0.0
- **Status**: Pronto para Produção
- **GitHub**: https://github.com/njfw50/prok
- **Branch**: main (sincronizado)

---

## 📋 Opções de Visualização

### 1️⃣ Preview Web (Mais Rápido) ✅ ATIVO AGORA

Servidor web local está rodando na **porta 3000**:
```
http://localhost:3000/app-preview.html
```

**Características**:
- ✅ Visualização imediata do projeto
- ✅ Sem necessidade de Android Studio
- ✅ Mostra todas as 9 músicas
- ✅ Design responsivo
- ✅ Informações de build

---

## 🤖 Opção 2: Build para Android (Requer Setup)

### Pré-requisitos
1. **Android Studio** instalado
2. **Android SDK** configurado
3. **Java Development Kit (JDK)** instalado

### Passos para Build Android no Windows

#### Passo 1: Verificar Ambiente
```powershell
cd C:\Users\njfw2\proK

# Verificar instalação
npx expo doctor
node --version
pnpm --version
```

#### Passo 2: Instalar Dependências (se necessário)
```powershell
pnpm install
```

#### Passo 3: Build para Arquivo APK/AAB

**Opção A: Usando Expo (Recomendado)**
```powershell
# Fazer login no Expo
npx expo login

# Build para Android
npx expo build:android

# Ou usar eas (mais novo)
npx eas build --platform android
```

**Opção B: Build Local (Requer Android Studio)***
```powershell
# Gerar build local
eas build --platform android --local

# Ou com gradle direto
cd android
./gradlew assembleRelease
```

#### Passo 4: Testar no Emulador Android
```powershell
# Se tiver Android Studio/Emulator instalado
npx expo start --android

# Ou
npm run android
```

---

## 📱 Opção 3: Executar no Android Físico

### Via USB Cable
1. Habilitar **Modo de Desenvolvedor** no seu Android
2. Conectar ao Windows via USB
3. Executar:
```powershell
npx expo start --android
```

### Via Expo Go (Mais Fácil)
1. Instalar app **Expo Go** na Google Play
2. Executar:
```powershell
npx expo start
```
3. Ler QR code com Expo Go no celular

---

## 🌐 Opção 4: Executar Versão Web no Expo

Se conseguir executar o Expo localmente:

```powershell
cd C:\Users\njfw2\proK

# Versão 1: Com app.json (sem app.config.ts)
Move-Item app.config.ts app.config.ts.backup
npx expo start --web
# Abrirá em http://localhost:19000 ou http://localhost:8081

# Versão 2: Com app.config.ts (pode ter delay)
Move-Item app.config.ts.backup app.config.ts
npx expo start --web --clear
```

---

## 📊 Configurações de Build

### app.json (Simplificado)
```json
{
  "expo": {
    "name": "Karaoke Pro",
    "slug": "karaoke-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"]
  }
}
```

### app.config.ts (Completo)
- Bundle ID Android: `space.manus.karaoke.app.android.t20260203130301`
- Package Name: configurado
- Microphone Permission: habilitado
- Deep Links: configurado para OAuth

---

## 📦 Arquivos de Configuração Importantes

| Arquivo | Propósito |
|---------|-----------|
| `app.config.ts` | Config completa do Expo (Android/iOS/Web) |
| `app.json` | Config simplificada para web |
| `package.json` | Dependências e scripts |
| `tsconfig.json` | Configuração TypeScript |
| `tailwind.config.js` | Temas e cores |
| `metro.config.js` | Bundler Metro |
| `babel.config.js` | Transpilação |

---

## 🔧 Scripts Disponíveis

```powershell
pnpm dev              # Rodar dev server completo (server + metro)
pnpm dev:server       # Apenas servidor tRPC
pnpm dev:metro        # Apenas Metro bundler (web)
pnpm build            # Build produção
pnpm start            # Iniciar produção
pnpm check            # Verificar tipos TypeScript
pnpm lint             # Executar eslint
pnpm format           # Formatar código
pnpm test             # Rodar testes
pnpm android          # Rodar no Android
pnpm ios              # Rodar no iOS
```

---

## 🎯 Próximos Passos Recomendados

### Para Desenvolvimento
1. ✅ Visualizar em preview web (JÁ ATIVO)
2. Testar funcionalidades através da interface
3. Ajustar design conforme necessário

### Para Deploy
1. **Expo EAS**: 
   - Criar conta em eas.expo.dev
   - Executar `npx eas build --platform android`
   
2. **Google Play**:
   - Criar conta de desenvolvedor
   - Fazer upload do APK/AAB
   - Publicar

### Para iOS (Se necessário)
1. Possuir Mac ou usar Expo EAS
2. Executar: `npx eas build --platform ios`

---

## ⚠️ Solução de Problemas

### "Metro bundler travou"
```powershell
# Limpar cache
npx expo start --web --clear

# Ou deletar pasta .expo
rm -r .expo
```

### "Porta em uso"
```powershell
# Matar processo node
taskkill /F /IM node.exe

# Ou usar porta diferente
npx expo start --web --port 8000
```

### "Módulo ES Module error"
```powershell
# Usar app.json em vez de app.config.ts
Move-Item app.config.ts app.config.ts.backup
npx expo start --web
```

### "Emulador não encontrado"
```powershell
# Verificar Android Studio
npx expo doctor

# Abrir Android Studio AVD Manager
```

---

## 📚 Documentação Completa

- **Testing Report**: `TESTING_REPORT.md` (120+ testes)
- **Completion Summary**: `COMPLETION_SUMMARY.md`
- **GitHub Deployment**: `GITHUB_DEPLOYMENT.md`
- **Design Document**: `design.md`
- **Server README**: `server/README.md`

---

## 🚀 Status Atual

```
✅ App Preview Web: ATIVO em http://localhost:3000/app-preview.html
✅ Código: Compilado e pronto
✅ Testes: 120+ passaram
✅ GitHub: Commits enviados
✅ Documentação: Completa

Próximo passo: Escolher opção de deploy acima
```

---

## 📞 Informações Técnicas

**Tecnologias**:
- React Native + Expo 54.0
- TypeScript
- NativeWind + Tailwind CSS
- TanStack React Query
- tRPC (Full-stack type safety)
- Drizzle ORM
- AsyncStorage

**Músicas no Banco** (9 total):
1. Blinding Lights - The Weeknd
2. Bohemian Rhapsody - Queen
3. Shape of You - Ed Sheeran
4. Uptown Funk - Mark Ronson
5. Lose Yourself - Eminem
6. Hallelujah - Leonard Cohen
7. Levitating - Dua Lipa
8. Smooth Criminal - Michael Jackson
9. **What A Beautiful Name - Hillsong Worship** ⭐ (NEW)

---

**Última Atualização**: 4 de Fevereiro de 2026  
**Desenvolvido por**: njfw50  
**Status**: ✅ PRONTO PARA PRODUÇÃO
