function loadEruda() {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
  document.body.appendChild(script);
  script.onload = function () {
      eruda.init();
  };
}

(function () {
  var keyword = '';
  document.addEventListener('keypress', function (event) {
      keyword += event.key.toLowerCase();
      if (keyword.endsWith('eruda')) {
          loadEruda();
          keyword = '';
      }
      if (keyword.length > 5) {
          keyword = keyword.slice(-5);
      }
  });
})();

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
