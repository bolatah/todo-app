const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist/angular-todo-probearbeit/browser')));

// Serve index.html for all other routes to support Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-todo-probearbeit/browser/index.html'));
});



// Set the PORT environment variable for the Go server
process.env.PORT = process.env.PORT || '9002';  // Default to '9002' if not set

// Start the Go server
const goServer = exec('./goServer', { env: process.env });

goServer.stdout.on('data', (data) => {
  console.log(`Go server stdout: ${data}`);
});

goServer.stderr.on('data', (data) => {
  console.error(`Go server stderr: ${data}`);
});

goServer.on('close', (code) => {
  console.log(`Go server process exited with code ${code}`);
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
