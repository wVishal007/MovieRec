FROM node:20

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Remove any potentially broken lock files / node_modules
RUN rm -rf node_modules package-lock.json pnpm-lock.yaml \
    && npm install

# Copy frontend source code
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "dev"]
