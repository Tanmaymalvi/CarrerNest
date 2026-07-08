# CareerNest - Premium Job Portal Platform

CareerNest is a comprehensive MERN stack job portal platform inspired by Naukri.com, LinkedIn, and Internshala. It's a production-ready platform designed for job seekers and employers.

## 🎯 Key Features

### For Job Seekers (Students)
- ✅ **Modern Job Search** - Advanced filtering and search capabilities
- ✅ **Resume Management** - Upload, edit, and manage multiple resumes
- ✅ **Saved Jobs** - Save jobs for later and get notifications
- ✅ **Application Tracking** - Track application status in real-time
- ✅ **Dashboard** - Personalized dashboard with profile completion metrics
- ✅ **Interview Schedule** - Schedule and manage interviews
- ✅ **AI Career Assistant** - 24/7 floating chatbot for career guidance
- ✅ **Notifications** - Real-time notifications for job applications and interviews
- ✅ **Premium Services** - Resume reviews, mock interviews, and coaching

### For Employers
- ✅ **Post Jobs** - Create and publish job listings easily
- ✅ **Manage Applications** - Review, shortlist, and reject candidates
- ✅ **Candidate Search** - Search and filter candidates by skills and experience
- ✅ **Company Profile** - Manage company information and branding
- ✅ **Analytics** - View job posting analytics and candidate insights
- ✅ **Interview Management** - Schedule and track interviews
- ✅ **Applicant Management** - Change application status and send notifications

### General Features
- ✅ **Authentication** - OTP-based email verification
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Service Marketplace** - Premium services for career development
- ✅ **Career Advice Hub** - Expert articles and career guidance
- ✅ **Company Discovery** - Explore companies and their job openings
- ✅ **Professional Networking** - Connect with professionals

## 📁 Project Structure

```
CareerNest/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   ├── applicationController.js
│   │   │   ├── companyController.js
│   │   │   ├── otpController.js (NEW)
│   │   │   ├── resumeController.js (NEW)
│   │   │   ├── serviceController.js (NEW)
│   │   │   ├── notificationController.js (NEW)
│   │   │   └── savedJobController.js (NEW)
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Job.js
│   │   │   ├── Application.js
│   │   │   ├── Company.js
│   │   │   ├── OTP.js (NEW)
│   │   │   ├── Resume.js (NEW)
│   │   │   ├── Service.js (NEW)
│   │   │   ├── Order.js (NEW)
│   │   │   ├── Notification.js (NEW)
│   │   │   ├── SavedJob.js (NEW)
│   │   │   └── Interview.js (NEW)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── otpRoutes.js (NEW)
│   │   │   ├── resumeRoutes.js (NEW)
│   │   │   ├── serviceRoutes.js (NEW)
│   │   │   ├── notificationRoutes.js (NEW)
│   │   │   └── savedJobRoutes.js (NEW)
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── Fronted/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── AIAssistant/ (NEW - Floating Chatbot)
│   │   │   ├── Footer/
│   │   │   └── ...other components
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Jobs/
│   │   │   ├── Profile/
│   │   │   ├── Services/ (NEW)
│   │   │   ├── Companies/ (NEW)
│   │   │   ├── CareerAdvice/ (NEW)
│   │   │   └── ...other pages
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Cloudinary** - File storage
- **Helmet** - Security
- **CORS** - Cross-origin requests

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/forgot-password   - Request password reset
```

### OTP (NEW)
```
POST   /api/otp/send               - Send OTP to email
POST   /api/otp/verify             - Verify OTP
```

### Jobs
```
GET    /api/jobs                   - Get all jobs with filters
GET    /api/jobs/:id               - Get job details
POST   /api/jobs                   - Create new job (Employer)
PUT    /api/jobs/:id               - Update job (Employer)
DELETE /api/jobs/:id               - Delete job (Employer)
```

### Applications
```
POST   /api/applications           - Apply for job
GET    /api/applications/:userId   - Get user applications
GET    /api/applications/:jobId    - Get job applications (Employer)
PUT    /api/applications/:id/status - Update application status
```

### Resumes (NEW)
```
POST   /api/resumes/upload         - Upload resume
GET    /api/resumes/:userId        - Get user resumes
DELETE /api/resumes/:resumeId      - Delete resume
PUT    /api/resumes/set-primary    - Set primary resume
```

### Services (NEW)
```
GET    /api/services               - Get all services
GET    /api/services/:serviceId    - Get service details
POST   /api/services/purchase      - Purchase service
```

### Notifications (NEW)
```
GET    /api/notifications/:userId  - Get notifications
PUT    /api/notifications/:id/read - Mark as read
DELETE /api/notifications/:id      - Delete notification
```

### Saved Jobs (NEW)
```
POST   /api/saved-jobs             - Save job
GET    /api/saved-jobs/:userId     - Get saved jobs
DELETE /api/saved-jobs/:userId/:jobId - Unsave job
GET    /api/saved-jobs/check/status - Check if job is saved
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

#### Backend Setup
```bash
cd Backend
npm install

# Create .env file
cp .env.example .env

# Add your credentials to .env file
# Start development server
npm run dev
```

#### Frontend Setup
```bash
cd Fronted
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CareerNest
```

## 📚 New Features Added

### Phase 1: UI/UX Enhancement
- ✅ Redesigned Navbar (Naukri-inspired)
- ✅ Enhanced Home Page structure
- ✅ Dark Mode support
- ✅ Responsive design improvements

### Phase 2: New Pages & Services
- ✅ Services Page with premium offerings
- ✅ Companies Page with filtering
- ✅ Career Advice Hub with articles
- ✅ Floating AI Assistant Chatbot

### Phase 3: Authentication & Security
- ✅ OTP Email Verification
- ✅ Forgot Password flow
- ✅ Enhanced password security

### Phase 4: Resume Management
- ✅ Multiple Resume uploads
- ✅ Resume preview
- ✅ Primary resume selection
- ✅ Cloudinary integration

### Phase 5: Features & Engagement
- ✅ Save/Unsave Jobs functionality
- ✅ Real-time Notifications
- ✅ Interview Scheduling
- ✅ Notification Management

### Phase 6: Premium Services
- ✅ Service Marketplace
- ✅ Order Management
- ✅ Payment Integration (Ready)

## 🎨 UI Inspiration

The design is inspired by:
- **Naukri.com** - Navigation structure, job cards, company discovery
- **LinkedIn** - Professional profile, network features, feed
- **Internshala** - Internship listings, filters, user experience

## 📱 Responsive Design

- ✅ Mobile First approach
- ✅ Fully responsive layouts
- ✅ Touch-friendly interfaces
- ✅ Optimized performance

## 🔄 Redux Store Structure

```javascript
store: {
  auth: {
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
    role: null
  },
  jobs: {
    jobs: [],
    selectedJob: null,
    loading: false,
    filter: {}
  },
  companies: {
    companies: [],
    selectedCompany: null,
    loading: false
  },
  applications: {
    applications: [],
    loading: false
  }
}
```

## 🧪 Testing

### Backend
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Frontend
```bash
# Run tests
npm test

# Build for production
npm run build
```

## 📈 Performance Optimizations

- ✅ Code Splitting
- ✅ Lazy Loading
- ✅ Image Optimization
- ✅ Caching Strategies
- ✅ API Request Debouncing
- ✅ Database Indexing

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (Bcryptjs)
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ XSS Protection
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ SQL Injection Prevention

## 📞 Support

For issues, feature requests, or questions:
1. Check existing documentation
2. Review GitHub issues
3. Contact support team

## 📄 License

This project is proprietary and confidential.

## 👥 Contributors

- CareerNest Development Team

---

**Note**: This is a comprehensive enhancement of an existing MERN Stack Job Portal. All existing functionality has been preserved while adding modern features and improved UI/UX.
