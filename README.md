# 🎯 OptiScore Sniper - Base Network Edition

Un bot de sniping ultra-rapide pour la blockchain Base avec une interface Web (WebUI) moderne, sombre ("dark mode") et esthétique (glassmorphism violet).
Il détecte automatiquement les nouveaux tokens, analyse les risques de rug-pull en temps réel, et permet un sniping direct via Uniswap/Aerodrome.

![WebUI Screenshot](https://images.unsplash.com/photo-1640826514546-9d332d9d1ee5?q=80&w=1200&auto=format&fit=crop) *(Screenshot d'illustration du Dashboard)*

---

## 🚀 Fonctionnalités Principales

- **Dashboard Temps Réel** : Auto-refresh toutes les 15s des nouveaux pairs sur la blockchain Base (via DexScreener).
- **Analyse Anti-Rug (GoPlus Security)** : 
  - 🔴 **Élevé** (Honeypot, Mintable, Blacklist, Taxes > 50%)
  - 🟡 **Moyen** (Owner non-renoncé, Taxes > 15%, Faible liquidité)
  - 🟢 **Faible** (Safe)
- **Sniper Intégré** : Exécution de transactions directement depuis l'interface (Amount ETH, Slippage, Gas Priority).
- **Zéro Connexion Wallet Requise** : Le bot utilise la clé privée configurée sur le serveur.
- **Déploiement Ultra-Simple** : 100% Dockerisé, prêt pour la production.

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), TailwindCSS, TypeScript, Lucide Icons, SWR.
- **Backend / APIs** : API Routes Next.js, viem/ethers.
- **Données** : DexScreener (données de marché), GoPlus Labs (sécurité & analyse de contrats).
- **Infrastructure** : Docker & Docker Compose.

---

## 📦 Installation & Déploiement (Pour Serveur)

Tu n'as besoin que de **Docker** et **Docker Compose** installés sur ton serveur.

### 1. Cloner ou upload les fichiers
Copie l'intégralité de ce dossier sur ton serveur (via `git clone`, `scp` ou FileZilla).

### 2. Configurer les variables d'environnement
Copie le fichier d'exemple et remplis tes informations :

```bash
cp .env.example .env
nano .env
```

**Exemple de fichier `.env` :**
```env
# URL RPC Base (Utilise Alchemy, Infura ou le public par défaut)
BASE_RPC_URL="https://mainnet.base.org"

# TA CLÉ PRIVÉE (SANS le "0x" devant ou AVEC, les deux fonctionnent). 
# /!\ CE WALLET SERT AUX ACHATS AUTOMATIQUES /!\
PRIVATE_KEY="ta_cle_privee_secrete_ici"

# Limite de sécurité max d'achat par transaction (en ETH)
MAX_BUY_ETH="0.1"
```

### 3. Lancer avec Docker
Une seule commande suffit pour builder et lancer le bot en tâche de fond :

```bash
docker-compose up -d --build
```

### 4. Accéder à l'interface
Ouvre ton navigateur et va sur :
`http://IP_DE_TON_SERVEUR:3000`

> 💡 **Astuce** : Si tu veux exposer ça sur un domaine public de manière sécurisée, tu peux mettre un Reverse Proxy (Nginx / Caddy / Traefik) devant le port `3000` avec un certificat SSL Let's Encrypt et une authentification (Basic Auth).

---

## 🛑 Sécurité & Avertissements

- **Mock Mode / Sécurité** : Par défaut, si tu ne mets pas de clé privée, l'interface fonctionnera en mode "simulation" pour tester l'UI en toute sécurité.
- **Fonds** : Ne mets sur ce wallet que les fonds que tu es prêt à utiliser pour snip.
- **Risques inhérents** : Même avec le niveau de risque 🟢 Faible, le trading de shitcoins comporte de forts risques (dev dumping, etc.). Sois prudent !

---
*Fait pour OptiScore.*
