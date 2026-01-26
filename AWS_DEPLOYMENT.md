# AWS Deployment Guide - EduStream

## Architecture
- **Frontend**: AWS Amplify (Next.js)
- **Backend**: EC2 t3.micro (Free tier eligible)
- **Services**: Docker Compose (MongoDB, LiveKit, Express)
- **Domain**: Route53 (optional)

---

## Step 1: Deploy Backend to EC2

### 1.1 Launch EC2 Instance
1. Go to AWS EC2 Console
2. Launch Instance:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t3.medium (t3.micro may be slow for video)
   - **Key Pair**: Create/select SSH key
   - **Security Group**: 
     - SSH (22) - Your IP
     - HTTP (80) - Anywhere
     - HTTPS (443) - Anywhere
     - Custom TCP (5000) - Anywhere (Backend API)
     - Custom TCP (7880-7881) - Anywhere (LiveKit)
     - Custom UDP (50000-50100) - Anywhere (LiveKit RTC)

### 1.2 Connect to EC2 and Install Docker
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose -y

# Logout and login again
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 1.3 Clone Project from GitHub
```bash
# Install Git
sudo apt install git -y

# Clone repository
git clone https://github.com/nafisreza/edustream.git
cd edustream/apps/server

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install
```

### 1.4 Configure Environment Variables
Create `.env` on EC2:
```bash
cd ~/apps/server
nano .env
```

Paste (update values):
```env
PORT=5000
NODE_ENV=production

MONGODB_URI=mongodb://localhost:27017/edustream

JWT_SECRET=<generate-random-secret>
JWT_EXPIRES_IN=7d

GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=devkey
LIVEKIT_URL=ws://your-ec2-public-ip:7880

ALLOWED_ORIGINS=https://your-amplify-domain.amplifyapp.com
```

### 1.5 Start Services
```bash
# Start Docker services (MongoDB + LiveKit)
cd ~/edustream
docker-compose up -d

# Start backend
cd ~/edustream/apps/server
npm start
```

### 1.6 Setup PM2 for Auto-Restart
```bash
sudo npm install -g pm2
cd ~/edustream/apps/server
pm2 start npm --name "edustream-api" -- start
pm2 startup
pm2 save
```

---

## Step 2: Deploy Frontend to AWS Amplify

### 2.1 Prepare Frontend for Deployment
1. Create `apps/web/.env.production`:
```env
NEXT_PUBLIC_API_URL=http://your-ec2-public-ip:5000
```

2. Update `apps/web/next.config.js` (if needed):
```js
module.exports = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

### 2.2 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/edustream.git
git push -u origin main
```

### 2.3 Deploy with Amplify
1. Go to AWS Amplify Console
2. Click **"New app"** → **"Host web app"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory**: `apps/web`
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `http://your-ec2-ip:5000`
6. Click **"Save and deploy"**

---

## Step 3: Configure CORS
Update backend `.env` on EC2 with your Amplify URL:
```env
ALLOWED_ORIGINS=https://main.d1234abcd.amplifyapp.com
```

Restart backend:
```bash
pm2 restart edustream-api
```

---

## Step 4: Test Deployment
1. Visit your Amplify URL
2. Signup/Login
3. Create a room
4. Join from mobile device

---

## Optional: Setup Custom Domain
1. Purchase domain in Route53
2. Add SSL certificate in ACM
3. Configure Amplify custom domain
4. Update EC2 backend to use domain instead of IP

---

## Troubleshooting
- **502 Bad Gateway**: Check backend logs with `pm2 logs`
- **CORS errors**: Verify `ALLOWED_ORIGINS` matches Amplify URL
- **Video not working**: Check EC2 security group allows UDP 50000-50100
