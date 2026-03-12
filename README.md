# 🎯 Base Sniper - dApp Edition

Une plateforme Web3 ultra-rapide pour la blockchain Base avec une interface moderne, sombre ("dark mode") et esthétique (glassmorphism violet).
Elle détecte automatiquement les nouveaux tokens, analyse les risques de rug-pull en temps réel, et permet un sniping direct via Uniswap/Aerodrome de manière sécurisée en connectant votre propre portefeuille (MetaMask, Rabby, etc.).

---

## 🚀 Fonctionnalités Principales

- **Dashboard Temps Réel** : Auto-refresh toutes les 15s des nouveaux pairs sur la blockchain Base (via DexScreener & GeckoTerminal).
- **Analyse Anti-Rug (GoPlus Security)** : 
  - 🔴 **Élevé** (Honeypot, Mintable, Blacklist, Taxes > 50%)
  - 🟡 **Moyen** (Owner non-renoncé, Taxes > 15%, Faible liquidité)
  - 🟢 **Faible** (Safe)
- **Web3 DApp Sécurisée** : Zéro clé privée sur le serveur. Connectez votre wallet (Wagmi + RainbowKit) pour signer les transactions.
- **Leaderboard 🏆** : Suivi des snipes et du volume tradé, classant les utilisateurs (Propulsé par SQLite & Prisma).

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), TailwindCSS, TypeScript, RainbowKit, Wagmi.
- **Backend / APIs** : API Routes Next.js, Prisma ORM, SQLite.
- **Données** : DexScreener / GeckoTerminal (marché), GoPlus Labs (sécurité), KyberSwap Aggregator (Routes API).

---

## 📦 Installation & Déploiement

### 1. Prérequis
- **Node.js** (v18+)
- **Git**

### 2. Cloner et Installer
```bash
git clone <votre_depot>
cd Sniper
npm install
```

### 3. Configurer l'environnement
Copiez le fichier d'exemple et remplissez vos informations :

```bash
cp .env.example .env
```
*(Vous aurez uniquement besoin de clés RPC Alchemy/Infura si vous ne voulez pas utiliser le mode public lent. L'API WalletConnect est optionnelle).*

### 4. Déploiement Automatique (Serveur Linux / VPS)
Si vous déployez sur un VPS (Debian/Ubuntu), un script a été préparé pour tout automatiser (vérification Docker, bases de données SQLite persistantes, etc.) :

```bash
# Donnez les droits au script
chmod +x deploy.sh

# Lancez le déploiement
./deploy.sh
```

L'application sera compilée, optimisée pour la production et tournera en arrière-plan sur le port `3000`.

### 5. Lancer l'Application en Local (Dev)
Si vous souhaitez juste développer ou tester localement sans Docker :
```bash
npx prisma db push
npm run dev
```

---

## 🛑 Sécurité & Avertissements

- **Sécurité** : C'est une dApp. Vous signez les transactions vous-même. Vérifiez toujours la transaction dans votre portefeuille avant validation.
- **Risques inhérents** : Même avec le niveau de risque 🟢 Faible, le trading très précoce (sniping) comporte de forts risques de volatilité ou de dev dumping. N'investissez que ce que vous êtes prêt à perdre !

---
*Développé pour l'écosystème Base 🔵.*
