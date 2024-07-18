const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist/angular-todo-probearbeit/browser')));

// Serve index.html for all other routes to support Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular-todo-probearbeit/browser/index.html'));
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
