const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Importing functions from /netlify/functions
const { listTabs, captureTab } = require('./netlify/functions/processimage');

// Define routes for functions
app.get('/.netlify/functions/listTabs', listTabs);
app.post('/.netlify/functions/captureTab', captureTab);

app.post('/.netlify/functions/processImage', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename } = req.body;  // Parse the file and filename from the request body

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = 'Solve this math problem:';
  const image = {
    inlineData: {
      data: file,  // The base64 content of the image
      mimeType: 'image/png'  // Adjust the content type based on the file type
    }
  };

  try {
    const result = await model.generateContent([prompt, image]);
    console.log(result.response.text());
    res.json({ solution: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Failed to process the image: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
