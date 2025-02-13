const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const apiEndpoint = 'https://generativelanguage.googleapis.com/';  // Verify this endpoint

  const { file, filename } = JSON.parse(event.body);  // Parse the file and filename from the event body
  const formData = new FormData();
  formData.append('file', Buffer.from(file, 'base64'), {
    filename: filename,  // Use the original filename
    contentType: 'image/png'  // Adjust the content type based on the file type
  });

  // Delay logging the API key and filename by 5 seconds
  setTimeout(() => {
    console.log(`API Key: ${apiKey}`);
    console.log(`Filename: ${filename}`);
  }, 5000);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
