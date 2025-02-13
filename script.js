async function processImage() {
  const fileInput = document.getElementById('upload');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload an image.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/.netlify/functions/processImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    const result = await response.json();
    displayResult(result);
  } catch (error) {
    console.error('Error:', error);
    alert(`Failed to process the image: ${error.message}`);
  }
}

function displayResult(result) {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = JSON.stringify(result, null, 2);
}
