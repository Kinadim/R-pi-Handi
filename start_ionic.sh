#!/bin/bash

# Se déplacer dans le répertoire sae_ionic s'il existe
if [ -d "sae_ionic" ]; then
    cd sae_ionic || exit
else
    echo "Le répertoire sae_ionic n'existe pas."
    exit 1
fi

# Installer les dépendances avec npm install
echo "Installation des dépendances avec npm install..."
npm install

# Lancer ionic serve
echo "Lancement de 'ionic serve'..."
ionic serve
