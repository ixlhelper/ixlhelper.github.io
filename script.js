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

let tabs = [];

async function listTabs() {
  try {
    const response = await fetch(`${window.location.origin}/.netlify/functions/listTabs`, {
      method: 'GET'
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }
    const allTabs = await response.json();
    tabs = allTabs.filter(tab => tab.url.includes('ixl.com'));  // Filter for ixl.com tabs

    const tabSelect = document.getElementById('tab-select');
    tabSelect.innerHTML = '';  // Clear previous options
    tabs.forEach((tab, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = tab.title;
      tabSelect.appendChild(option);
    });

    if (tabs.length === 0) {
      alert('No IXL tabs found.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`Failed to list tabs: ${error.message}`);
  }
}

async function captureTab() {
  const tabSelect = document.getElementById('tab-select');
  const selectedIndex = tabSelect.value;

  if (selectedIndex === '') {
    alert('Please select a tab.');
    return;
  }

  const selectedTab = tabs[selectedIndex];

  try {
    const response = await fetch(`${window.location.origin}/.netlify/functions/captureTab`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: selectedTab.url, prompt: 'Analyze this tab:' })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    const result = await response.json();
    displayResult(result.solution);
  } catch (error) {
    console.error('Error:', error);
    alert(`Failed to capture tab: ${error.message}`);
  }
}

function displayResult(solution) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';  // Clear previous results

  const solutionText = document.createElement('div');
  solutionText.className = 'text-bubble';
  solutionText.innerHTML = solution;  // Use innerHTML instead of textContent
  resultDiv.appendChild(solutionText);
}
