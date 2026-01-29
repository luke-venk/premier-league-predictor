##### Build: use Node to build static assets.
# Using "AS" to avoid including Node or node_modules in container.
# Just want to include the static assets.
FROM node:20-slim AS build
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm ci

# Copy remaining files over into directory.
COPY . .

# Build the static files.
RUN npm run build

##### Serve: use NGINX to serve the static files.
# Use Alpine since it's lightweight and efficient.
FROM nginx:1.26-alpine

# Copy NGINX configuration into default location.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets into default web root directory.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default HTTP port 80.
EXPOSE 80