const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;  // Ensure your API key is set in Netlify
  const { file, filename, prompt } = JSON.parse(event.body);  // Parse the file, filename, and prompt from the event body

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const image = file ? {
    inlineData: {
      data: file,  // The base64 content of the image
      mimeType: 'image/png'  // Adjust the content type based on the file type
    }
  } : null;

  try {
    const result = image 
      ? await model.generateContent([prompt, image]) 
      : await model.generateContent([prompt]);

    // Replace markdown with HTML tags and symbols
    let cleanText = result.response.text()
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')  // Italic text
      .replace(/`([^`]+)`/g, '<code>$1</code>')  // Inline code
      .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')  // Code blocks
      .replace(/^\#{1} (.+)$/gm, '<h1>$1</h1>')  // Heading 1
      .replace(/^\#{2} (.+)$/gm, '<h2>$1</h2>')  // Heading 2
      .replace(/^\#{3} (.+)$/gm, '<h3>$1</h3>')  // Heading 3
      .replace(/

\[(.+?)\]

\((.+?)\)/g, '<a href="$2">$1</a>')  // Links
      .replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>')  // Lists
      .replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')  // Blockquotes
      .replace(/&/g, '&amp;')  // Escape &
      .replace(/</g, '&lt;')  // Escape <
      .replace(/>/g, '&gt;')  // Escape >
      .replace(/\*/g, '×');  // Replace asterisks with multiplication symbol

    console.log(cleanText);
    return {
      statusCode: 200,
      body: JSON.stringify({ solution: cleanText }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
