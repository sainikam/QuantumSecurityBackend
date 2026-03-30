# API Integration Guide

## 🔗 Connecting to Real Backend

This guide shows how to replace mock data with actual API calls.

---

## Option 1: REST API Integration

### Step 1: Update `script.js`

Replace the `generateMockData()` function:

```javascript
async function generateMockData(domain) {
  try {
    const response = await fetch(`/api/scan?domain=${domain}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Scan Error:', error);
    showError('Failed to scan domain. Please try again.');
    return null;
  }
}
```

### Step 2: Expected API Response Format

```json
{
  "domain": "google.com",
  "score": 85,
  "risk": "Elite",
  "vulnerabilities": [
    {
      "type": "SSL Certificate",
      "status": "Valid until 2026",
      "severity": "PASS"
    },
    {
      "type": "TLS Version",
      "status": "TLS 1.3",
      "severity": "PASS"
    },
    {
      "type": "PQC Readiness",
      "status": "Post-Quantum Cryptography Compatible",
      "severity": "PASS"
    },
    {
      "type": "DNS Security",
      "status": "DNSSEC Enabled",
      "severity": "PASS"
    }
  ],
  "assets": {
    "domains": 25,
    "ssl": 8,
    "ips": 42,
    "software": 57
  }
}
```

---

## Option 2: GraphQL Integration

### Using GraphQL Query:

```javascript
async function scanWithGraphQL(domain) {
  const query = `
    query {
      securityScan(domain: "${domain}") {
        score
        risk
        vulnerabilities {
          type
          status
          severity
        }
        assets {
          domains
          ssl
          ips
          software
        }
      }
    }
  `;

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const { data } = await response.json();
    return data.securityScan;

  } catch (error) {
    console.error('GraphQL Error:', error);
    return null;
  }
}
```

---

## Option 3: Backend-Specific Examples

### Node.js/Express Backend

```javascript
app.get('/api/scan', async (req, res) => {
  const domain = req.query.domain;

  // Validation
  if (!isValidDomain(domain)) {
    return res.status(400).json({ error: 'Invalid domain' });
  }

  try {
    // Your security scan logic
    const result = await performSecurityScan(domain);
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: 'Scan failed' });
  }
});
```

### Python/Flask Backend

```python
@app.route('/api/scan')
def scan():
    domain = request.args.get('domain')
    
    if not is_valid_domain(domain):
        return jsonify({'error': 'Invalid domain'}), 400
    
    try:
        result = perform_security_scan(domain)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Go Backend

```go
func ScanHandler(w http.ResponseWriter, r *http.Request) {
    domain := r.URL.Query().Get("domain")
    
    if !isValidDomain(domain) {
        http.Error(w, "Invalid domain", http.StatusBadRequest)
        return
    }
    
    result := performSecurityScan(domain)
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}
```

---

## Option 4: Authentication (JWT)

### Add Bearer Token:

```javascript
async function scanWithAuth(domain, token) {
  const response = await fetch(`/api/scan?domain=${domain}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}
```

---

## Option 5: WebSocket Real-Time Updates

```javascript
function connectWebSocket(domain) {
  const ws = new WebSocket('wss://api.example.com/scan');

  ws.onopen = () => {
    ws.send(JSON.stringify({ action: 'scan', domain }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'progress') {
      console.log(`Progress: ${data.percent}%`);
    } else if (data.type === 'complete') {
      // Update UI with complete data
      showResults(data);
    }
  };

  ws.onerror = (error) => {
    showError('WebSocket error: ' + error);
  };
}
```

---

## Testing Your Integration

### Using cURL:

```bash
curl -X GET "http://localhost:8000/api/scan?domain=google.com" \
  -H "Content-Type: application/json"
```

### Using Postman:

1. Create new GET request
2. URL: `http://localhost:8000/api/scan?domain=google.com`
3. Send request
4. Verify response matches expected format

### Using JavaScript Console:

```javascript
fetch('/api/scan?domain=google.com')
  .then(r => r.json())
  .then(data => console.log(data));
```

---

## Error Handling Best Practices

```javascript
async function robustScan(domain) {
  try {
    // 1. Validate input
    if (!isValidDomain(domain)) {
      throw new Error('Invalid domain format');
    }

    // 2. Set timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    // 3. Fetch with timeout
    const response = await fetch(`/api/scan?domain=${domain}`, {
      signal: controller.signal
    });

    clearTimeout(timeout);

    // 4. Check response status
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 5. Parse JSON
    const data = await response.json();

    // 6. Validate response structure
    if (!data.score || !data.risk) {
      throw new Error('Invalid response structure');
    }

    return data;

  } catch (error) {
    if (error.name === 'AbortError') {
      showError('Request timeout - server not responding');
    } else {
      showError(`Scan failed: ${error.message}`);
    }
    return null;
  }
}
```

---

## Environment Configuration

### Create `config.js`:

```javascript
const API_CONFIG = {
  production: {
    baseURL: 'https://api.example.com',
    timeout: 30000
  },
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 10000
  }
};

const env = process.env.NODE_ENV || 'development';
const config = API_CONFIG[env];

export default config;
```

### Update `script.js`:

```javascript
import config from './config.js';

async function generateMockData(domain) {
  const response = await fetch(
    `${config.baseURL}/api/scan?domain=${domain}`,
    { timeout: config.timeout }
  );
  return response.json();
}
```

---

## CORS Handling

If frontend and backend are on different domains:

### Backend CORS Setup (Node.js):

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### Frontend Request with Credentials:

```javascript
async function scanWithCreds(domain) {
  const response = await fetch(`/api/scan?domain=${domain}`, {
    method: 'GET',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

---

## Caching & Performance

```javascript
const scanCache = new Map();

async function cachedScan(domain, maxAge = 3600000) {
  const cached = scanCache.get(domain);
  
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.data;
  }

  const data = await generateMockData(domain);
  scanCache.set(domain, { data, timestamp: Date.now() });
  
  return data;
}
```

---

## Rate Limiting Handling

```javascript
const requestQueue = [];
let lastRequest = 0;
const MIN_INTERVAL = 1000; // 1 second between requests

async function rateLimitedScan(domain) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequest;

  if (timeSinceLastRequest < MIN_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequest = Date.now();
  return generateMockData(domain);
}
```

---

## Production Checklist

- [ ] Remove console.log statements
- [ ] Add request timeouts
- [ ] Implement retry logic
- [ ] Add API key handling
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Implement caching
- [ ] Add error tracking (Sentry)
- [ ] Monitor performance
- [ ] Add loading timeouts
- [ ] Validate all responses

---

**Ready to connect? Message your backend team with the API format above! 🚀**
