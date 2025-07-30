# Document Management System - Network Access Guide

## Current Setup Analysis

### MinIO Server Status ✅
- **Address**: `192.168.1.229:9768`
- **Network**: Local network accessible
- **External Access**: Available to any device on your network
- **File Access**: Direct presigned URLs work externally

### Next.js API Server Status ❌
- **Address**: `localhost:3000` (development mode)
- **Network**: Localhost only
- **External Access**: Blocked - only accessible from the same machine
- **API Access**: Document management APIs not available externally

## Access Scenarios

### Scenario 1: Same Machine Access ✅
```
Your Computer → localhost:3000 → API → MinIO (192.168.1.229:9768)
Status: ✅ WORKS - Full document management functionality
```

### Scenario 2: Other Devices on Network ❌
```
Other Device → localhost:3000 (BLOCKED)
Status: ❌ FAILS - Cannot reach the API server
```

### Scenario 3: Direct MinIO Access ✅
```
Any Device → 192.168.1.229:9768 → Files directly
Status: ✅ WORKS - But no document management features
```

## Making the System Network Accessible

### Option 1: Development Server Network Access (Quick Solution)

Make the Next.js development server accessible on the network:

```bash
# Instead of: pnpm dev
# Use this to bind to all network interfaces:
pnpm dev --host 0.0.0.0
```

**Result**: API accessible at `http://YOUR_MACHINE_IP:3000`

**Find your machine's IP**:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr "IPv4"
```

### Option 2: Production Deployment (Recommended for Real Use)

Deploy the application properly:

```bash
# Build for production
pnpm build

# Start production server on network
pnpm start --host 0.0.0.0 --port 3000
```

### Option 3: Docker Deployment (Enterprise Solution)

Create a docker-compose setup:

```yaml
# docker-compose.yml
version: '3.8'
services:
  payroll-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MINIO_ENDPOINT=192.168.1.229
      - MINIO_PORT=9768
    networks:
      - payroll-network
```

## Security Considerations

### Current Security Status
- **MinIO**: Exposed on network with admin credentials
- **Next.js**: Protected by Clerk authentication
- **File Access**: Presigned URLs provide time-limited access

### Recommendations

#### 1. Network Security
```bash
# Only allow specific IPs to access MinIO
# Configure firewall rules on 192.168.1.229
sudo ufw allow from 192.168.1.0/24 to any port 9768
```

#### 2. MinIO Security Hardening
```bash
# Create restricted user instead of using admin
# Add to your MinIO setup:
mc admin user add myminio document-user SecurePassword123!
mc admin policy set myminio readwrite user=document-user
```

#### 3. Environment Variables for Production
```env
# .env.production
MINIO_ENDPOINT="192.168.1.229"
MINIO_PORT=9768
MINIO_ACCESS_KEY="document-user"  # Not admin
MINIO_SECRET_KEY="SecurePassword123!"
MINIO_USE_SSL=true  # Enable SSL in production
```

## Quick Setup for Network Access

### Step 1: Start Development Server on Network
```bash
# Get your machine's IP first
ipconfig getifaddr en0  # macOS WiFi
# or
hostname -I | cut -d' ' -f1  # Linux

# Then start server accessible on network
pnpm dev -- --hostname 0.0.0.0
```

### Step 2: Update Environment Variables
Add your machine's IP to the allowed origins if needed.

### Step 3: Test from Another Device
```bash
# From another device on your network
curl -X GET "http://YOUR_MACHINE_IP:3000/api/documents/health"
```

## Production Deployment Recommendations

### For Internal Company Use:
1. **Deploy on a server** with fixed IP address
2. **Use reverse proxy** (nginx) for SSL termination
3. **Configure proper DNS** (e.g., payroll.company.local)
4. **Set up SSL certificates** for HTTPS

### For External Access:
1. **Use a VPN** for secure access
2. **Configure proper firewall rules**
3. **Set up domain with SSL** (Let's Encrypt)
4. **Use environment-specific configurations**

## Testing Network Access

### Test Script for Network Access
```bash
#!/bin/bash
# test-network-access.sh

MACHINE_IP="YOUR_MACHINE_IP"
API_BASE="http://${MACHINE_IP}:3000"

echo "Testing network access to document management system..."

# Test 1: API Health
curl -s "${API_BASE}/api/documents/health" && echo "✅ API accessible" || echo "❌ API not accessible"

# Test 2: MinIO Direct
curl -s "http://192.168.1.229:9768/minio/health/live" && echo "✅ MinIO accessible" || echo "❌ MinIO not accessible"

# Test 3: Application Loading
curl -s "${API_BASE}/" | grep -q "html" && echo "✅ App accessible" || echo "❌ App not accessible"
```

## Immediate Action Items

### For Development/Testing:
1. **Start server with network access**: `pnpm dev -- --hostname 0.0.0.0`
2. **Find your machine's IP**: `ipconfig getifaddr en0`
3. **Test from another device**: Access `http://YOUR_IP:3000`

### For Production Use:
1. **Deploy properly** (not development server)
2. **Configure SSL/HTTPS**
3. **Set up proper authentication**
4. **Use environment-specific configs**

## Current Status Summary

- **MinIO**: ✅ Network accessible, files downloadable from anywhere on network
- **Document APIs**: ❌ Only accessible from localhost (your machine)
- **Full System**: ❌ Needs network configuration for external access

**Quick Fix**: Run `pnpm dev -- --hostname 0.0.0.0` to make APIs network accessible.