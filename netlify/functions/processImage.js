const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiEndpoint = 'https://generativelanguage.googleapis.com/';

  const formData = new FormData();
  formData.append('file', event.body.file);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
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
