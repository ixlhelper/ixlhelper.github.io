const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.post('/.netlify/functions/processImage', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename } = req.body;  // Parse the file and filename from the request body

  const client = new GoogleGenerativeAI({ apiKey });

  try {
    const response = await client.annotateImage({
      image: {
        content: file,
      },
      features: [{ type: 'LABEL_DETECTION' }],
    });

    if (!response) {
      throw new Error('API request failed');
    }

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Failed to process the image: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
