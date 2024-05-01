#!/bin/bash

# Lancement de start_back en arrière-plan
echo "Lancement de start_back..."
./start_back.sh &

# Attente de 15 secondes
echo "Attente de 15 secondes avant de lancer start_ionic..."
sleep 15

# Lancement de start_ionic en arrière-plan après l'attente
echo "Lancement de start_ionic..."
./start_ionic.sh &
