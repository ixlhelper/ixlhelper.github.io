const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename } = JSON.parse(event.body);  // Parse the file and filename from the event body
  
  const form = new FormData();
  form.append('image', file);
  form.append('filename', filename);

  try {
    const response = await fetch('generativelanguage.googleapis.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      body: form
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
