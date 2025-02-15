const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let browser;

async function getBrowserInstance() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true  // Run in headless mode
    });
  }
  return browser;
}

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename } = JSON.parse(event.body);  // Parse the file and filename from the request body

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
    return {
      statusCode: 200,
      body: JSON.stringify({ solution: result.response.text() })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await browser.close();  // Make sure to close the browser instance
  }
};
