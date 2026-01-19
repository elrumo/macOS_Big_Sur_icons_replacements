# Use the official Bun image as a parent image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and bun.lockb (if available)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN bun run build

# Expose the port the app runs on
EXPOSE 4173

# Run the app
CMD [ "bun", "run", "serve" ]