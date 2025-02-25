FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

# Utiliser nodemon si disponible pour le développement
CMD ["npm", "run", "dev"]
# Ou si vous n'avez pas de script dev:
# CMD ["node", "server.js"]