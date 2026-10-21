FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
COPY public ./public
COPY db ./db
EXPOSE 3000
USER node
CMD ["npm", "start"]
