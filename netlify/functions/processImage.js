const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiEndpoint = 'generativelanguage.googleapis.com';

  const formData = new FormData();
  formData.append('file', event.body.file);

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
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Failed to process the image.'
    };
  }
};
