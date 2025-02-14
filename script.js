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
  const textInput = document.getElementById('text-input').value.trim();
  const prompt = textInput ? textInput : 'Please provide an image or text to analyze.';

  if (!file && !textInput) {
    alert('Please upload an image or type an issue.');
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = async function() {
    const base64data = reader.result.split(',')[1];
    const filename = file ? file.name : '';

    try {
      const response = await fetch(`${window.location.origin}/.netlify/functions/processImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: base64data, filename: filename, prompt: prompt })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${errorText}`);
      }

      const result = await response.json();
      displayResult(result.solution);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to process the image: ${error.message}`);
    }
  };
}

function displayResult(solution) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';  // Clear previous results

  const solutionText = document.createElement('div');
  solutionText.className = 'text-bubble';
  solutionText.textContent = solution.replace('{solution}', '');  // Remove {solution} tag
  resultDiv.appendChild(solutionText);
}

document.querySelectorAll('.switch').forEach(button => {
  button.addEventListener('click', function() {
    const subject = this.dataset.subject;
    document.body.className = '';
    document.body.classList.add(subject);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Clear previous results

    const prompt = `Switched to ${subject.toUpperCase()}`;
    const switchText = document.createElement('div');
    switchText.className = 'text-bubble';
    switchText.textContent = prompt;
    resultDiv.appendChild(switchText);
  });
});
