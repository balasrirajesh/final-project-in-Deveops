# Use official Node.js 18-alpine base image for a small footprint
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package files first to leverage Docker build cache for npm install
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Copy the rest of the application files (ignoring those in .dockerignore)
COPY . .

# Expose the application port (matching the env and composer settings)
EXPOSE 3000

# Start the application using node
CMD ["node", "app.js"]
