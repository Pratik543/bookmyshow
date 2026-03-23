# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only the dependency files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React application (Vite uses 'build' directory as per vite.config.js)
RUN npm run build

# Stage 2: Serve the application using a lightweight web server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to the outside
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
