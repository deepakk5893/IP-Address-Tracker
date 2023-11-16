let map;

async function trackIP() {
  const ipAddress = document.getElementById('ipAddressInput').value;

  try {
    const response = await fetch(`https://ipinfo.io/${ipAddress}?token=2d2c074fefaf76`);
    if (response.ok) {
      const data = await response.json();
      addToHistory(data.ip);
      displayIPInfo(data);
    } else {
      displayError('IP address not found');
    }
  } catch (error) {
    displayError(error.message);
  }
}

function displayIPInfo(data) {
  const resultSection = document.getElementById('resultSection');
  resultSection.innerHTML = `
    <p>IP Address: ${data.ip}</p>
    <p>Location: ${data.city}</p>
    <p>Region: ${data.region}</p>
    <p>Country: ${data.country}</p>
    <p>ISP: ${data.org}</p>
  `;

  displayMap(data.loc.split(','));
}

function displayMap(coordinates) {
  if (!map) {
    map = L.map('map').setView(coordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
  } else {
    map.setView(coordinates, 13); // Update the view if map already exists
  }

  L.marker(coordinates).addTo(map);
}

function displayError(errorMessage) {
  const resultSection = document.getElementById('resultSection');
  resultSection.innerHTML = `<p>${errorMessage}</p>`;
}

function addToHistory(ip) {
  let trackedIPs = JSON.parse(localStorage.getItem('previouslyTrackedIPs')) || [];
  trackedIPs.push(ip);
  localStorage.setItem('previouslyTrackedIPs', JSON.stringify(trackedIPs));
  displayHistory()
}

function displayHistory() {
  const trackedIPs = JSON.parse(localStorage.getItem('previouslyTrackedIPs')) || [];
  const historyContainer = document.getElementById('historyContainer');

  // Clear previous history if any
  historyContainer.innerHTML = '';

  // Display each tracked IP in the history container
  trackedIPs.forEach(ip => {
    const historyItem = document.createElement('div');
    historyItem.textContent = ip;
    historyContainer.appendChild(historyItem);
  });
}

window.addEventListener('DOMContentLoaded', displayHistory);





function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}