# Use stable LTS version of Node
FROM node:20

# Create a working directory in container
WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Expose port
EXPOSE 8080

# Run your server
CMD ["node", "server.js"]
