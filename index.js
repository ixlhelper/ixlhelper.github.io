// Initialize Eruda toggle
let erudaToggleText = '';
const erudaSequence = 'eruda';

document.addEventListener('keypress', (event) => {
  erudaToggleText += event.key;
  if (erudaToggleText === erudaSequence) {
    if (!window.erudaInitialized) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      document.body.appendChild(script);
      script.onload = function() {
        eruda.init();
        window.erudaInitialized = true;
      };
    } else {
      eruda.destroy();
      window.erudaInitialized = false;
    }
    erudaToggleText = '';
  }
  // Reset sequence if more than needed keys are pressed
  if (erudaToggleText.length > erudaSequence.length) {
    erudaToggleText = '';
  }
});

async function processImage() {
  const fileInput = document.getElementById('upload');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload an image.');
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async function() {
    const base64data = reader.result.split(',')[1];

    try {
      const response = await fetch('/.netlify/functions/processImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: base64data })
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
  };
}

function displayResult(result) {
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = JSON.stringify(result, null, 2);
}
