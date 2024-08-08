FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the application (if you have a build step)
# RUN npm run build

# Stage 2: Create the runtime image
FROM node:18-slim

# Create and change to the app directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app .

# Run the app as a non-root user for security
USER node

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
