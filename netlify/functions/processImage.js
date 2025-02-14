const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename, prompt } = JSON.parse(event.body);  // Parse the file, filename, and prompt from the event body

  console.log('Received API request with prompt:', prompt);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const image = file ? {
    inlineData: {
      data: file,  // The base64 content of the image
      mimeType: 'image/png'  // Adjust the content type based on the file type
    }
  } : null;

  console.log('File data:', file ? 'File provided' : 'No file provided');
  console.log('Image object:', image);

  try {
    const result = image 
      ? await model.generateContent([prompt, image]) 
      : await model.generateContent([prompt]);

    let cleanText = result.response.text();
    console.log('Raw response text:', cleanText);

    // Replace markdown with HTML tags and symbols
    try {
      cleanText = cleanText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
        .replace(/`([^`]+)`/g, '<code>$1</code>')  // Inline code
        .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')  // Code blocks
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')  // Heading 1
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')  // Heading 2
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')  // Heading 3
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')  // Links
        .replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>')  // Lists
        .replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')  // Blockquotes
        .replace(/&amp;/g, '&')  // Decode &
        .replace(/&lt;/g, '<')  // Decode <
        .replace(/&gt;/g, '>')  // Decode >
        .replace(/(\d) \*(\d)/g, '$1 × $2')  // Correct multiplication
        .replace(/\*(.*?)\*/g, '<em>$1</em>');  // Italicize text

      console.log('Cleaned response text:', cleanText);
    } catch (regexError) {
      console.error('Error during text cleaning:', regexError);
      throw regexError;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ solution: cleanText }),
    };
  } catch (error) {
    console.error('Error during API request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
