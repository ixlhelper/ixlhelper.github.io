const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post('/.netlify/functions/processImage', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename } = req.body;  // Parse the file and filename from the request body

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = 'Does this look store-bought or homemade?';
  const image = {
    inlineData: {
      data: Buffer.from(file, 'base64').toString('base64'),  // Convert file content to base64
      mimeType: 'image/png'  // Adjust the content type based on the file type
    }
  };

  try {
    const result = await model.generateContent([prompt, image]);
    res.json(result.response.text());
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Failed to process the image: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
