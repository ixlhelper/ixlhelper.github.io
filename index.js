const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Define routes for functions
app.get('/.netlify/functions/listTabs', require('./netlify/functions/listTabs').handler);
app.post('/.netlify/functions/captureTab', require('./netlify/functions/captureTab').handler);
app.post('/.netlify/functions/processImage', require('./netlify/functions/processImage').handler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
