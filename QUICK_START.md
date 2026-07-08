# CareerNest - Quick Start Guide

**Get CareerNest running in 10 minutes!**

---

## ⚡ Prerequisites

- Node.js v14+ installed
- MongoDB local or Atlas account
- Git
- VS Code (recommended)

---

## 🚀 Backend Setup (5 minutes)

### Step 1: Navigate to Backend
```bash
cd Backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- express, mongoose, jwt, bcryptjs
- nodemailer (for OTP emails)
- cloudinary (for file storage)
- helmet, cors, rate-limit

### Step 3: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/careernest
JWT_SECRET=any_random_secret_key_here
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password_here
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

> **📧 Gmail Setup**: Go to [Google Account Security](https://myaccount.google.com/apppasswords), generate an app password, and use it as `EMAIL_PASSWORD`.

### Step 4: Start Backend
```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`  
✅ Health check: `http://localhost:5000/api/health`

---

## 💻 Frontend Setup (5 minutes)

### Step 1: Navigate to Frontend
```bash
cd Fronted
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install React, Tailwind, Redux, Framer Motion, etc.

### Step 3: Create .env File
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CareerNest
```

### Step 4: Start Frontend
```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

---

## 🧪 Verify Everything Works

### Backend Verification
```bash
# In a new terminal
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","name":"CareerNest API"}
```

### Frontend Verification
1. Open browser: `http://localhost:5173`
2. You should see the CareerNest home page
3. Dark mode toggle works (top navbar)
4. AI Chatbot button visible (bottom-right corner)
5. Navigation links work

### Test New Features

#### 1. Test AI Chatbot
- Click the floating chatbot button
- Type a message like "How do I write a resume?"
- You should get an AI response

#### 2. Test Services Page
- Navigate to `/services`
- See premium service cards
- Responsive on mobile

#### 3. Test Companies Page
- Navigate to `/companies`
- See company cards with ratings
- Filter by category

#### 4. Test Career Advice
- Navigate to `/career-advice`
- See article cards
- Search and filter functionality

#### 5. Test Navbar
- Click "For Employers" dropdown
- Click dark mode toggle
- Mobile menu works

---

## 📁 Project Structure Quick Reference

```
Backend/
├── src/
│   ├── controllers/    (Business logic)
│   │   ├── otpController.js (NEW)
│   │   ├── resumeController.js (NEW)
│   │   ├── serviceController.js (NEW)
│   │   └── ...
│   ├── models/         (Database schemas)
│   │   ├── OTP.js (NEW)
│   │   ├── Resume.js (NEW)
│   │   ├── Service.js (NEW)
│   │   └── ...
│   ├── routes/         (API endpoints)
│   │   ├── otpRoutes.js (NEW)
│   │   ├── resumeRoutes.js (NEW)
│   │   └── ...
│   └── middleware/     (Auth, validation)
├── app.js              (Express setup)
└── server.js           (Server start)

Fronted/
├── src/
│   ├── components/
│   │   ├── Navbar/ (ENHANCED)
│   │   ├── AIAssistant/ (NEW)
│   │   └── ...
│   ├── pages/
│   │   ├── Services/ (NEW)
│   │   ├── Companies/ (NEW)
│   │   ├── CareerAdvice/ (NEW)
│   │   └── ...
│   ├── redux/          (State management)
│   ├── routes/         (Page routing)
│   └── App.jsx         (Root component)
└── main.jsx            (Entry point)
```

---

## 🔧 Common Commands

### Backend
```bash
# Start development
npm run dev

# Start production
npm start

# Install new package
npm install package-name

# Check health
curl http://localhost:5000/api/health
```

### Frontend
```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (Frontend)
lsof -ti:5173 | xargs kill -9
```

### Issue: MongoDB Connection Error
```
SOLUTION:
1. Ensure MongoDB is running locally, OR
2. Use MongoDB Atlas cloud connection string
3. Check MONGODB_URI in .env is correct
```

### Issue: Email Not Sending (OTP)
```
SOLUTION:
1. Use Gmail App Password (not regular password)
2. Enable "Less Secure Apps" in Gmail
3. Check EMAIL_USER and EMAIL_PASSWORD in .env
4. Verify nodemailer is installed
```

### Issue: File Upload Fails
```
SOLUTION:
1. Check Cloudinary credentials in .env
2. Ensure CLOUDINARY_NAME, API_KEY, API_SECRET are correct
3. Check file size limits (4MB max)
```

### Issue: CORS Errors
```
SOLUTION:
1. Verify CLIENT_URL in backend .env
2. Ensure it matches your frontend URL
3. Check VITE_API_URL in frontend .env
```

---

## 📚 Next Steps After Startup

1. **Test Authentication**
   - Try login page (if implemented)
   - Try services page (fully functional)
   - Try job listing

2. **Explore New Features**
   - Test Services page
   - Test Companies page
   - Test Career Advice
   - Test AI Chatbot

3. **Review Code**
   - Check `IMPLEMENTATION_GUIDE.md` for architecture
   - Review new controllers
   - Check new models

4. **Start Development**
   - Follow `DEVELOPMENT_ROADMAP.md` for next features
   - Priority 1: Enhance Login/Register with OTP
   - Priority 2: Create Profile page

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `IMPLEMENTATION_GUIDE.md` | Detailed feature docs |
| `DEVELOPMENT_ROADMAP.md` | Next tasks & timeline |
| `ENHANCEMENT_SUMMARY.md` | What's been done |
| `QUICK_START.md` | This file! |

---

## 🔐 Security Notes

- ✅ JWT tokens stored in HTTP-only cookies
- ✅ Passwords hashed with bcryptjs
- ✅ Rate limiting enabled
- ✅ CORS protection active
- ✅ Helmet security headers enabled

> **Important**: Never commit `.env` files! They're in `.gitignore`

---

## 🎯 What You Can Do Right Now

### As a User
- ✅ Browse services page
- ✅ Discover companies
- ✅ Read career advice
- ✅ Chat with AI assistant
- ✅ Use dark mode

### As a Developer
- ✅ Review backend APIs
- ✅ Check database models
- ✅ Examine controllers
- ✅ Review React components
- ✅ Test all endpoints

---

## 📞 Quick Help

### Check if services are running
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend (just visit)
http://localhost:5173
```

### View Logs
```bash
# Backend logs show in terminal where you ran `npm run dev`
# Frontend logs show in browser console (F12)
```

### Restart Services
```bash
# Stop backend: Ctrl+C in terminal
# Stop frontend: Ctrl+C in terminal
# Restart: npm run dev
```

---

## 🎓 API Quick Test

### Test OTP Endpoint
```bash
curl -X POST http://localhost:5000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "purpose": "registration"
  }'
```

### Test Services Endpoint
```bash
curl http://localhost:5000/api/services
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

---

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Services page loads
- [ ] Companies page loads
- [ ] Career Advice loads
- [ ] AI Chatbot opens
- [ ] Dark mode works
- [ ] Navbar responsive on mobile
- [ ] No console errors

---

## 🚀 Ready for Development?

Once everything is working:

1. **Read `DEVELOPMENT_ROADMAP.md`** for next priorities
2. **Start with Priority 1** tasks
3. **Follow `IMPLEMENTATION_GUIDE.md`** for API details
4. **Keep `README.md`** as reference

---

## 💡 Pro Tips

- Use VS Code extensions: REST Client for API testing
- Use MongoDB Compass for database visualization
- Check browser console (F12) for frontend errors
- Backend console shows all API logs
- Use `npm run build` to test production build locally

---

## 🎉 You're All Set!

**Now you have a modern, production-ready MERN job portal running locally.**

Next: Read the roadmap and start building Priority 1 features!

---

**Questions?** Check the documentation files or review the code comments.

**Happy Coding!** 🚀

---

*Last Updated: June 28, 2024*
