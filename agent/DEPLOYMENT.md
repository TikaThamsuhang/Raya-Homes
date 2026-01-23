# Deployment Guide for Agent Subdomain

## Folder Structure on Hosting

```
public_html/
├── agent/                          # Agent subdomain folder (agents.teamraya.com)
│   ├── .htaccess                   # Path-based routing configuration
│   ├── index.html                  # Agent profile page
│   ├── css/
│   │   ├── agent.css
│   │   ├── global.css
│   │   └── index.css
│   ├── js/
│   │   ├── agent.js                # Contains commented routing code
│   │   ├── agents-data.json        # Agent data with slug fields
│   │   └── properties-data.js
│   └── imgs/
│       └── Agents/
│           ├── agent-1.jpg
│           ├── agent-2.jpg
│           └── agent-3.avif
```

## Agent URLs

After deployment, agents will be accessible via:

- `https://agents.teamraya.com/sarah-jenkins`
- `https://agents.teamraya.com/michael-chang`
- `https://agents.teamraya.com/elena-rodriguez`

## Deployment Steps

### Step 1: Subdomain Setup

1. Log into cPanel
2. Create subdomain: `agents`
3. Point Document Root to: `public_html/agent`
4. This creates `agents.teamraya.com`

### Step 2: Upload Files

1. Upload entire `agent` folder contents to `public_html/agent/`
2. **Crucial**: Ensure `.htaccess` is uploaded
3. Verify folder permissions (755) and file permissions (644)

### Step 3: Activate Routing in Code

Open `agent/js/agent.js` and make these changes:

**UNCOMMENT THIS SECTION** (around line 30):

```javascript
const pathSlug = window.location.pathname.replace(/^\/|\/$/g, "");
const paramSlug = urlParams.get("agent");
const lookupSlug = pathSlug && pathSlug !== "index.html" ? pathSlug : paramSlug;

let agentBySlug = null;
if (lookupSlug) {
  agentBySlug = agentsData.find((a) => a.slug === lookupSlug);
}
```

**REPLACE THIS CODE** (around line 60):

```javascript
// OLD CODE - DELETE THIS:
const agent = agentId
  ? agentsData.find((a) => a.id === agentId)
  : agentsData[0];

// NEW CODE - USE THIS:
const agent =
  agentBySlug ||
  (agentId ? agentsData.find((a) => a.id === agentId) : null) ||
  agentsData[0];
```

## .htaccess Features

### 1. **Path-Based Routing**

- Captures paths like `/sarah-jenkins`
- Rewrites them internally to `index.html?agent=sarah-jenkins`
- Keeps the URL clean in the browser bar

### 2. **Security & Performance**

- Directory protection
- Security headers
- Caching and compression enabled

## Troubleshooting

### 1. URL returns 404 Not Found

- Verify `.htaccess` is uploaded and valid
- Ensure "RewriteEngine On" works on your host
- Check if file permissions are correct

### 2. Agent loads generic/wrong profile

- Check browser console for errors
- Verify `slug` in `agents-data.json` matches URL path exactly
- Ensure you uncommented the logic in `agent.js`

### 3. CSS/JS not loading

- Ensure paths in HTML are relative or absolute correct
- Check `.htaccess` isn't blocking static files (rules exclude existing files)
