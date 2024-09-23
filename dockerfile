# Use the official Node.js image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 4173

# Run the app
CMD [ "npm", "run", "serve" ]