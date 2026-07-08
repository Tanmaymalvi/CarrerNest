# CareerNest - Implementation Guide

## 📋 Overview

This guide provides detailed information about the enhancements made to the CareerNest job portal platform.

## ✨ What's New

### Frontend Enhancements

#### 1. **Enhanced Navbar**
- **File**: `src/components/Navbar/Navbar.jsx`
- **Features**:
  - Naukri-inspired design
  - Dropdown menu for "For Employers"
  - Profile dropdown with logout
  - Notifications bell icon
  - Dark mode toggle
  - Sticky header with shadow on scroll
  - Mobile hamburger menu with full navigation

#### 2. **AI Career Assistant Chatbot**
- **File**: `src/components/AIAssistant/AIAssistant.jsx`
- **Features**:
  - Floating button (bottom-right)
  - Chat interface with message history
  - Predefined responses for common queries
  - Typing indicators
  - Responsive design
  - Dark mode support
- **Usage**: Automatically included in App.jsx, appears on all pages

#### 3. **Services Page**
- **File**: `src/pages/Services/Services.jsx`
- **Route**: `/services`
- **Features**:
  - 6 premium service cards (Resume Builder, Priority Applicant, AI Mock Interview, etc.)
  - Service filtering
  - Price display with badges
  - Benefits listing
  - FAQ section
  - Newsletter subscription CTA

#### 4. **Companies Page**
- **File**: `src/pages/Companies/Companies.jsx`
- **Route**: `/companies`
- **Features**:
  - Company cards with logos and ratings
  - Category filtering
  - Search functionality
  - Job count and employee size display
  - Save/Follow company functionality
  - Responsive grid layout

#### 5. **Career Advice Hub**
- **File**: `src/pages/CareerAdvice/CareerAdvice.jsx`
- **Route**: `/career-advice`
- **Features**:
  - Article cards with images
  - Category filtering
  - Search functionality
  - Read time estimation
  - Like/Share functionality
  - Author information
  - Newsletter subscription

### Backend Enhancements

#### 1. **OTP Authentication**
- **Model**: `src/models/OTP.js`
- **Controller**: `src/controllers/otpController.js`
- **Routes**: `src/routes/otpRoutes.js`
- **Features**:
  - Send OTP via email
  - Verify OTP
  - 10-minute expiry
  - Auto-delete expired OTPs
  - Nodemailer integration

**API Endpoints**:
```
POST /api/otp/send
  Body: { email, purpose: "registration" | "password-reset" }
  
POST /api/otp/verify
  Body: { email, otp, purpose }
```

#### 2. **Resume Management**
- **Model**: `src/models/Resume.js`
- **Controller**: `src/controllers/resumeController.js`
- **Routes**: `src/routes/resumeRoutes.js`
- **Features**:
  - Upload multiple resumes
  - Set primary resume
  - Delete resume
  - Cloudinary integration

**API Endpoints**:
```
POST /api/resumes/upload
  Body: FormData with resume file
  
GET /api/resumes/:userId
  
DELETE /api/resumes/:resumeId

PUT /api/resumes/set-primary
  Body: { resumeId, userId }
```

#### 3. **Services & Orders**
- **Models**: 
  - `src/models/Service.js`
  - `src/models/Order.js`
- **Controller**: `src/controllers/serviceController.js`
- **Routes**: `src/routes/serviceRoutes.js`
- **Features**:
  - Create services (Admin)
  - Purchase services
  - Order tracking
  - Payment ready (integration point)

**API Endpoints**:
```
GET /api/services

GET /api/services/:serviceId

POST /api/services/purchase
  Body: { userId, serviceId }
```

#### 4. **Notifications**
- **Model**: `src/models/Notification.js`
- **Controller**: `src/controllers/notificationController.js`
- **Routes**: `src/routes/notificationRoutes.js`
- **Features**:
  - Create notifications
  - Get user notifications
  - Mark as read
  - Delete notification

**API Endpoints**:
```
POST /api/notifications
  Body: { userId, type, title, message, relatedId }
  
GET /api/notifications/:userId

PUT /api/notifications/:notificationId/read

DELETE /api/notifications/:notificationId
```

#### 5. **Saved Jobs**
- **Model**: `src/models/SavedJob.js`
- **Controller**: `src/controllers/savedJobController.js`
- **Routes**: `src/routes/savedJobRoutes.js`
- **Features**:
  - Save/unsave jobs
  - Get saved jobs with job details
  - Check if job is saved

**API Endpoints**:
```
POST /api/saved-jobs
  Body: { userId, jobId }
  
GET /api/saved-jobs/:userId

DELETE /api/saved-jobs/:userId/:jobId

GET /api/saved-jobs/check/status?userId=X&jobId=Y
```

#### 6. **Interview Scheduling**
- **Model**: `src/models/Interview.js`
- **Features**:
  - Schedule interviews
  - Track interview status
  - Store meeting links
  - Collect feedback and ratings

#### 7. **Other Models**
- **SavedJob.js**: Track saved job listings
- **Interview.js**: Manage interview schedules and feedback

## 🔧 Configuration

### Required Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/careernest

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client
CLIENT_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CareerNest
```

## 🚀 How to Use New Features

### 1. **Using OTP Authentication**

**Frontend**:
```javascript
// Send OTP
const sendOTP = async (email, purpose) => {
  const response = await axios.post('/api/otp/send', { 
    email, 
    purpose: 'registration' // or 'password-reset'
  });
};

// Verify OTP
const verifyOTP = async (email, otp, purpose) => {
  const response = await axios.post('/api/otp/verify', { 
    email, 
    otp, 
    purpose 
  });
};
```

### 2. **Resume Upload**

**Frontend**:
```javascript
const uploadResume = async (userId, file, title) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('userId', userId);
  formData.append('title', title);
  
  const response = await axios.post('/api/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

### 3. **Save a Job**

**Frontend**:
```javascript
const saveJob = async (userId, jobId) => {
  const response = await axios.post('/api/saved-jobs', { 
    userId, 
    jobId 
  });
};
```

### 4. **Send Notifications**

**Backend**:
```javascript
import Notification from '../models/Notification.js';

await Notification.create({
  userId: applicantId,
  type: 'application_submitted',
  title: 'Application Submitted',
  message: `Your application for ${jobTitle} has been submitted`,
  relatedId: applicationId
});
```

## 📊 Database Collections

### Existing Collections
- `users` - User accounts
- `jobs` - Job listings
- `companies` - Company profiles
- `applications` - Job applications

### New Collections
- `otps` - OTP records (auto-delete after 10 min)
- `resumes` - Resume files and metadata
- `services` - Premium services
- `orders` - Service orders
- `notifications` - User notifications
- `savedjobs` - Bookmarked jobs
- `interviews` - Interview schedules

## 🎨 Styling Guidelines

### Tailwind CSS Classes Used
- **Colors**: 
  - Primary: `teal-500` / `teal-600`
  - Secondary: `cyan-500` / `cyan-600`
  - Neutral: `slate-*`
  
- **Components**:
  - Buttons: `.btn`, `.btn-primary`, `.btn-secondary`
  - Cards: `.rounded-2xl`, `.border`, `.shadow-lg`
  - Containers: `max-w-7xl`, `mx-auto`

### Dark Mode
- All components have dark mode support using `dark:` prefixes
- Toggle is in Navbar

## 🔐 Authentication Flow

### Registration with OTP
1. User fills registration form
2. Click "Send OTP"
3. OTP sent to email via Nodemailer
4. User verifies OTP
5. Account created

### Login
1. User enters credentials
2. JWT token generated
3. Token stored in cookies
4. Redirect to dashboard

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components are mobile-first designed.

## 🐛 Debugging Tips

### Check API Connectivity
```bash
curl http://localhost:5000/api/health
```

### View MongoDB Collections
```bash
mongosh
use careernest
db.users.find()
```

### Check Nodemailer Setup
- Use "App Passwords" for Gmail (not regular password)
- Enable "Less Secure Apps" or use OAuth2

### Verify Cloudinary Setup
- Ensure API credentials are correct
- Test upload with Postman

## 📚 Next Steps for Implementation

### Priority 1 (Critical)
- [ ] Update User model with additional fields (education, skills, experience)
- [ ] Enhance Login page with OTP option
- [ ] Enhance Register page with OTP verification
- [ ] Create Profile edit page

### Priority 2 (High)
- [ ] Implement Payment gateway (Razorpay/Stripe)
- [ ] Create Email notification triggers
- [ ] Implement Interview scheduling UI
- [ ] Add Job filters in frontend

### Priority 3 (Medium)
- [ ] Add Video Interview feature
- [ ] Implement Messaging system
- [ ] Create Admin Dashboard
- [ ] Add Analytics

### Priority 4 (Optional)
- [ ] WebSocket for real-time notifications
- [ ] Video upload for profiles
- [ ] Social login (Google, LinkedIn)
- [ ] Advanced analytics

## 🔗 Dependencies Added

### Frontend
- `framer-motion@^11.0.0` - Animations

### Backend
- `nodemailer@^6.9.7` - Email service
- `cloudinary@^1.40.0` - Cloud storage

## 📖 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [MongoDB Mongoose Docs](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## 💡 Code Examples

### Create Service (Admin)
```javascript
POST /api/services
{
  "name": "Resume Builder",
  "description": "Create a professional resume",
  "price": 0,
  "category": "resume",
  "features": ["ATS-optimized", "Multiple templates"],
  "icon": "FileText",
  "badge": "Free"
}
```

### Purchase Service
```javascript
POST /api/services/purchase
{
  "userId": "user_id",
  "serviceId": "service_id"
}
```

### Create Notification
```javascript
POST /api/notifications
{
  "userId": "user_id",
  "type": "application_submitted",
  "title": "Application Submitted",
  "message": "Your application has been submitted",
  "relatedId": "application_id"
}
```

## ✅ Checklist for Going Live

- [ ] Update all environment variables
- [ ] Test OTP email sending
- [ ] Configure Cloudinary
- [ ] Set up MongoDB Atlas
- [ ] Update CORS origins
- [ ] Setup payment gateway
- [ ] Create admin account
- [ ] Add initial services
- [ ] Test all API endpoints
- [ ] Verify email notifications
- [ ] Test authentication flow
- [ ] Performance optimization
- [ ] Security audit
- [ ] Backup and recovery plan

---

**Last Updated**: June 2024
**Version**: 2.0 (Enhanced)
