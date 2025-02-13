const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify

  // Temporary console log to verify the API key
  setTimeout(() => {
    console.log(`API Key: ${apiKey}`);
  }, 5000);

  const { file, filename } = JSON.parse(event.body);  // Parse the file and filename from the event body
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

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
