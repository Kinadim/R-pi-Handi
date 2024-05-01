#!/bin/bash

# Se déplacer dans le répertoire sae_back s'il existe
if [ -d "sae_back" ]; then
    cd sae_back || exit
else
    echo "Le répertoire sae_back n'existe pas."
    exit 1
fi

# Installer les dépendances avec npm install
echo "Installation des dépendances avec npm install..."
npm install

# Démarrer l'application avec node index.js
echo "Démarrage de l'application avec 'node index.js'..."
node index.js
