import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ================= AUTH =================

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),

  otpLogin: (payload) =>
    api.post("/auth/otp-login", payload),

  register: (payload) =>
    api.post("/auth/register", payload),

  logout: () => api.post("/auth/logout"),

  // SAFE ME API
  me: async () => {
    try {
      const response = await api.get("/auth/me");
      return response;
    } catch (error) {
      console.log("User not logged in");

      return {
        data: {
          success: false,
          user: null,
        },
      };
    }
  },

  resetPassword: (payload) =>
    api.post("/auth/reset-password", payload),
};

// ================= OTP =================

export const otpApi = {
  send: (payload) => api.post("/otp/send", payload),

  verify: (payload) => api.post("/otp/verify", payload),
};

// ================= JOBS =================

export const jobsApi = {
  list: (params) => api.get("/jobs", { params }),

  get: (id) => api.get(`/jobs/${id}`),

  create: (payload) => api.post("/jobs", payload),

  update: (id, payload) => api.patch(`/jobs/${id}`, payload),

  delete: (id) => api.delete(`/jobs/${id}`),

  apply: (jobId, payload = {}) =>
    api.post(`/applications/${jobId}`, payload),
};

// ================= SAVED JOBS =================

export const savedJobsApi = {
  save: (jobId, userId) =>
    api.post("/saved-jobs", { jobId, userId }),

  unsave: (jobId, userId) =>
    api.delete(`/saved-jobs/${userId}/${jobId}`),

  check: (jobId, userId) =>
    api.get("/saved-jobs/check/status", {
      params: { jobId, userId },
    }),

  list: (userId) =>
    api.get(`/saved-jobs/${userId}`),
};

// ================= SERVICES =================

export const servicesApi = {
  list: () => api.get("/services"),

  get: (id) => api.get(`/services/${id}`),

  purchase: (serviceId) =>
    api.post("/services/purchase", { serviceId }),
};

// ================= STATS =================

export const statsApi = {
  get: () => api.get("/stats"),
};

// ================= COMPANIES =================

export const companiesApi = {
  list: () => api.get("/companies"),

  create: (payload) => api.post("/companies", payload),

  update: (id, payload) => api.patch(`/companies/${id}`, payload),
};

// ================= APPLICATIONS =================

export const applicationsApi = {
  mine: () => api.get("/applications/me"),

  employer: () =>
    api.get("/applications/employer"),

  updateStatus: (applicationId, status) =>
    api.patch(
      `/applications/${applicationId}/status`,
      { status }
    ),
};

// ================= NOTIFICATIONS =================

export const notificationsApi = {
  list: (userId) =>
    api.get(`/notifications/${userId}`),

  markRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),

  remove: (notificationId) =>
    api.delete(`/notifications/${notificationId}`),
};

// ================= RESUMES =================

export const resumesApi = {
  list: (userId) =>
    api.get(`/resumes/${userId}`),

  get: (resumeId) =>
    api.get(`/resumes/detail/${resumeId}`),

  create: (payload) =>
    api.post("/resumes", payload),

  update: (resumeId, payload) =>
    api.patch(`/resumes/${resumeId}`, payload),

  upload: (formData) =>
    api.post("/resumes/upload", formData),

  setPrimary: (resumeId, userId) =>
    api.put("/resumes/set-primary", {
      resumeId,
      userId,
    }),

  remove: (resumeId) =>
    api.delete(`/resumes/${resumeId}`),
};

// ================= ADMIN =================
export const adminApi = {
  getAnalytics: () => api.get("/admin/analytics"),
  getUsers: () => api.get("/admin/users"),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateCompany: (id, payload) => api.patch(`/admin/companies/${id}`, payload),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
  updateJob: (id, payload) => api.patch(`/admin/jobs/${id}`, payload),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
};

// ================= ORDERS =================

export const ordersApi = {
  create: (serviceId, paymentMethod = "upi") =>
    api.post("/orders/create", { serviceId, paymentMethod }),

  verify: (orderId, transactionId) =>
    api.post("/orders/verify", { orderId, transactionId }),

  history: () => api.get("/orders/history"),
};

// ================= INTERVIEW PREP =================
export const prepApi = {
  getExperiences: () => api.get("/prep"),
  createExperience: (payload) => api.post("/prep", payload),
};

// ================= INTERVIEW QUESTIONS =================
export const interviewQuestionsApi = {
  getAll: () => api.get("/interview-questions"),

  getByCategory: (category) =>
    api.get(`/interview-questions/category/${category}`),

  search: (query, category) =>
    api.get("/interview-questions/search", {
      params: { query, ...(category ? { category } : {}) },
    }),

  create: (payload) => api.post("/interview-questions", payload),

  update: (id, payload) => api.put(`/interview-questions/${id}`, payload),

  remove: (id) => api.delete(`/interview-questions/${id}`),
};

// ================= ONLINE ASSESSMENTS =================
export const testsApi = {
  list: () => api.get("/tests"),
  get: (id) => api.get(`/tests/${id}`),
  start: (testId) => api.post("/tests/start", { testId }),
  submit: (testId, answers) => api.post("/tests/submit", { testId, answers }),
  
  // Admin endpoints
  create: (payload) => api.post("/tests", payload),
  update: (id, payload) => api.put(`/tests/${id}`, payload),
  remove: (id) => api.delete(`/tests/${id}`),
  questionsList: (params) => api.get("/tests/questions/all", { params }),
  createQuestion: (payload) => api.post("/tests/questions", payload),
  updateQuestion: (id, payload) => api.put(`/tests/questions/${id}`, payload),
  deleteQuestion: (id) => api.delete(`/tests/questions/${id}`),
  allResults: () => api.get("/tests/results/all"),
};

export const resultsApi = {
  my: () => api.get("/results/my"),
};

export const certificatesApi = {
  my: () => api.get("/certificates/my"),
};

export default api;