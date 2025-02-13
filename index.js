const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/.netlify/functions/processImage', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiEndpoint = 'https://generativelanguage.googleapis.com';

  const formData = new FormData();
  formData.append('file', req.body.file);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to process the image.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
