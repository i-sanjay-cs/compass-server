// server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080}); // Change the port number to 9090 or any other available port


// Define a set to store connected clients
const clients = new Set();

// Event listener for connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Add the new client to the set
  clients.add(ws);

  // Event listener for receiving messages
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Event listener for disconnection
  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove the disconnected client from the set
    clients.delete(ws);
  });
});

// Example of broadcasting a message at regular intervals
setInterval(() => {
  const degree = Math.floor(Math.random() * 360); // Generate a random degree value
  const message = JSON.stringify({ degree });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 5000); // Broadcast every 5 seconds
