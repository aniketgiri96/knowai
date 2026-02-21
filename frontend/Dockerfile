FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
# With docker-compose volume mount (./frontend:/app), node_modules is a separate volume
# and may be empty. Install deps at startup so PostCSS/Tailwind are available.
CMD ["sh", "-c", "npm install && npm run dev"]
