const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post('/.netlify/functions/processImage', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename } = req.body;  // Parse the file and filename from the request body

  const form = new FormData();
  form.append('image', Buffer.from(file, 'base64'), filename);  // Convert file content to Buffer and append it to the form

  try {
    const response = await fetch('generativelanguage.googleapis.com', {  // Replace with the correct API endpoint
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Failed to process the image: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
