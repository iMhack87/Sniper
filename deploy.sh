#!/bin/bash

# Configuration
PROJECT_NAME="sniper-bot"
DB_FILE="dev.db"
ENV_FILE=".env"

echo "🚀 Début du déploiement de Base Sniper..."

# 1. Vérification des prérequis
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "❌ 'docker compose' n'est pas installé. Veuillez l'installer d'abord (plugin docker-compose-plugin)."
    exit 1
fi

# 2. Préparation des fichiers locaux
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️ Le fichier .env est introuvable."
    if [ -f "$ENV_FILE.example" ]; then
        echo "✅ Création automatique de .env à partir de .env.example..."
        cp "$ENV_FILE.example" "$ENV_FILE"
        echo "👉 IMPORTANT : Pensez à éditer le fichier .env si vous souhaitez utiliser votre propre API Key ou RPC."
    else
        echo "❌ Le fichier .env.example est aussi introuvable ! Téléchargement incomplet."
        exit 1
    fi
fi

if [ ! -f "$DB_FILE" ]; then
    echo "🗄️ Initialisation du fichier de base de données SQLite (dev.db)..."
    touch "$DB_FILE"
fi

# 3. Arrêt des anciens conteneurs
echo "🛑 Arrêt des conteneurs précédents (le cas échéant)..."
docker compose down

# 4. Construction et Démarrage
echo "🏗️ Construction de la nouvelle image Docker (cela peut prendre quelques minutes)..."
docker compose up -d --build

# 5. Vérification du statut
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DÉPLOIEMENT RÉUSSI !"
    echo "🔗 L'application est disponible sur : http://localhost:3000 (ou l'IP de votre serveur:3000)"
    echo "📝 Pour voir les logs en temps réel : docker logs -f $PROJECT_NAME"
    echo "🛑 Pour arrêter l'application : docker compose down"
else
    echo "❌ Une erreur est survenue lors du démarrage de Docker."
    exit 1
fi
