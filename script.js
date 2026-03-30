/* ========================================
   QUANTUM SECURITY ASSESSMENT - SCRIPT
   Professional Hackathon-Grade Logic
   ======================================== */

/**
 * Mock data simulator - Replace with actual API calls
 */
function generateMockData(domain) {
  const random = Math.floor(Math.random() * 100);
  
  const risks = {
    high: random > 75 ? 'Elite' : random > 50 ? 'Standard' : random > 25 ? 'Legacy' : 'Critical',
  };

  return {
    domain,
    score: Math.floor(Math.random() * 40) + 60, // 60-100
    risk: risks.high,
    vulnerabilities: [
      {
        type: 'SSL Certificate',
        status: 'Valid until 2026',
        severity: 'PASS'
      },
      {
        type: 'TLS Version',
        status: 'TLS 1.3',
        severity: 'PASS'
      },
      {
        type: 'PQC Readiness',
        status: 'Post-Quantum Cryptography Compatible',
        severity: 'PASS'
      },
      {
        type: 'DNS Security',
        status: 'DNSSEC Enabled',
        severity: 'PASS'
      }
    ],
    assets: {
      domains: Math.floor(Math.random() * 50) + 10,
      ssl: Math.floor(Math.random() * 15) + 2,
      ips: Math.floor(Math.random() * 100) + 20,
      software: Math.floor(Math.random() * 80) + 20
    }
  };
}

/**
 * Main scan function
 */
function scan() {
  const target = document.getElementById('target').value.trim();
  const errorBox = document.getElementById('errorMessage');
  const loading = document.getElementById('loading');
  const scoreSection = document.getElementById('scoreSection');
  const assetsSection = document.getElementById('assetsSection');
  const pqcStatus = document.getElementById('pqcStatus');

  // Validation
  if (!target) {
    showError('Please enter a domain to scan');
    return;
  }

  if (!isValidDomain(target)) {
    showError('Please enter a valid domain (e.g., google.com)');
    return;
  }

  // Reset UI
  errorBox.style.display = 'none';
  scoreSection.style.display = 'none';
  assetsSection.style.display = 'none';
  pqcStatus.style.display = 'none';
  loading.style.display = 'flex';

  // Simulate API call with delay
  setTimeout(() => {
    try {
      const data = generateMockData(target);
      
      loading.style.display = 'none';
      scoreSection.style.display = 'flex';
      assetsSection.style.display = 'block';
      pqcStatus.style.display = 'flex';

      animateScore(data.score);
      showRisk(data.risk);
      showDetails(data);
      updateAssets(data.assets);

    } catch (error) {
      showError('Scan failed. Please try again.');
      loading.style.display = 'none';
    }
  }, 2000);
}

/**
 * Validate domain format
 */
function isValidDomain(domain) {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
}

/**
 * Animate the score circle with progress ring
 */
function animateScore(score) {
  const scoreText = document.getElementById('scoreText');
  const circle = document.querySelector('.progress-ring__circle');
  const circumference = circle.getAttribute('r').baseVal.value * 2 * Math.PI;

  circle.setAttribute('stroke-dasharray', circumference);
  circle.setAttribute('stroke-dashoffset', circumference);

  let count = 0;
  const increment = Math.max(Math.floor(score / 30), 1);
  const animationSpeed = 20;

  const interval = setInterval(() => {
    count += increment;
    
    if (count >= score) {
      count = score;
      clearInterval(interval);
    }

    scoreText.innerText = count;
    
    // Update progress ring
    const offset = circumference - (count / 100) * circumference;
    circle.setAttribute('stroke-dashoffset', offset);

  }, animationSpeed);
}

/**
 * Display risk badge with appropriate styling
 */
function showRisk(risk) {
  const badge = document.getElementById('riskBadge');
  badge.innerText = risk;
  badge.className = `badge ${risk}`;
}

/**
 * Show vulnerability details in grid
 */
function showDetails(data) {
  const detailsGrid = document.getElementById('details');
  detailsGrid.innerHTML = '';

  data.vulnerabilities.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${0.4 + index * 0.1}s`;
    
    const statusClass = item.severity === 'PASS' ? 'pass' : 'warning';
    
    card.innerHTML = `
      <h3 style="margin-bottom: 12px; color: #00D4FF;">${item.type}</h3>
      <p style="margin-bottom: 15px; font-size: 14px; color: #b0b0b0;">${item.status}</p>
      <span style="
        display: inline-block;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        background: ${item.severity === 'PASS' ? 'rgba(0, 255, 159, 0.2)' : 'rgba(255, 212, 0, 0.2)'};
        color: ${item.severity === 'PASS' ? '#00FF9F' : '#FFD700'};
        border: 1px solid ${item.severity === 'PASS' ? '#00FF9F' : '#FFD700'};
      ">${item.severity}</span>
    `;
    
    detailsGrid.appendChild(card);
  });
}

/**
 * Update asset counters with animation
 */
function updateAssets(assets) {
  const assetData = [
    { id: 'domains', value: assets.domains },
    { id: 'ssl', value: assets.ssl },
    { id: 'ips', value: assets.ips },
    { id: 'software', value: assets.software }
  ];

  assetData.forEach(asset => {
    animateCounter(asset.id, asset.value);
  });
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  let currentValue = 0;
  const increment = Math.ceil(targetValue / 30);
  const speed = 30;

  const interval = setInterval(() => {
    currentValue += increment;
    
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(interval);
    }

    element.innerText = currentValue;
  }, speed);
}

/**
 * Display error message
 */
function showError(message) {
  const errorBox = document.getElementById('errorMessage');
  errorBox.innerText = message;
  errorBox.style.display = 'block';
}

/**
 * Handle Enter key on input field
 */
document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('target');
  
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      scan();
    }
  });

  // Demo mode - Pre-fill for development
  // Uncomment next line for demo
  // inputField.value = 'google.com';
});

/* ========================================
   ADVANCED UTILITIES (OPTIONAL ENHANCEMENTS)
   ======================================== */

/**
 * Export scan results
 */
function exportResults() {
  const target = document.getElementById('target').value;
  if (!target) return;

  const results = {
    domain: target,
    timestamp: new Date().toISOString(),
    score: document.getElementById('scoreText').innerText,
    risk: document.getElementById('riskBadge').innerText
  };

  console.log('Export:', results);
  // Implement file download logic here
}

/**
 * Reset form
 */
function resetForm() {
  document.getElementById('target').value = '';
  document.getElementById('scoreSection').style.display = 'none';
  document.getElementById('assetsSection').style.display = 'none';
  document.getElementById('pqcStatus').style.display = 'none';
  document.getElementById('details').innerHTML = '';
}
