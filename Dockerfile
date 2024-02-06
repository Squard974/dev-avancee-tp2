# Utiliser l'image de base Node.js (LTS) sur Debian Bullseye
FROM node:lts-bullseye-slim

# Créer l'arborescence de destination /home/node/app/node_modules
RUN mkdir -p /home/node/app/node_modules

# Définir le propriétaire et le groupe propriétaire sur node
RUN chown -R node:node /home/node/app

# Définir le répertoire de travail
WORKDIR /home/node/app

# Copier les fichiers package*.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances définies dans package.json
RUN npm install

# Copier les fichiers sources dans le répertoire de travail
COPY src/ ./src/
COPY templates/ ./templates/
COPY package*.json ./

# CMD pour lancer la commande de démarrage de l'application node
CMD ["npm", "start"]
