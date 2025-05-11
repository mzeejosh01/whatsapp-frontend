import axios from "axios";

// Create an axios instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/me", userData),
  upgradeToPremium: () => api.post("/auth/upgrade-premium"),
};

// Messages API calls
export const messagesAPI = {
  getAllMessages: () => api.get("/messages"),
  getMessagesByContact: (phoneNumber) =>
    api.get(`/messages/contact/${phoneNumber}`),
  getMessagesByTag: (tagId) => api.get(`/messages/tag/${tagId}`),
  createMessage: (messageData) => api.post("/messages", messageData),
  toggleImportant: (id, important) =>
    api.put(`/messages/${id}/important`, { important }),
  addTag: (messageId, tagId) =>
    api.put(`/messages/${messageId}/tags`, { tagId, action: "add" }),
  removeTag: (messageId, tagId) =>
    api.put(`/messages/${messageId}/tags`, { tagId, action: "remove" }),
  searchMessages: (params) => api.get("/messages/search", { params }),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

// Reminders API calls
export const remindersAPI = {
  getAllReminders: () => api.get("/reminders"),
  getReminder: (id) => api.get(`/reminders/${id}`),
  createReminder: (reminderData) => api.post("/reminders", reminderData),
  updateReminder: (id, reminderData) =>
    api.put(`/reminders/${id}`, reminderData),
  updateReminderStatus: (id, status) =>
    api.put(`/reminders/${id}/status`, { status }),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
  getUpcomingReminders: () => api.get("/reminders/upcoming/soon"),
};

// Tags API calls
export const tagsAPI = {
  getAllTags: () => api.get("/tags"),
  createTag: (tagData) => api.post("/tags", tagData),
  updateTag: (id, tagData) => api.put(`/tags/${id}`, tagData),
  deleteTag: (id) => api.delete(`/tags/${id}`),
  getTagsByCategory: (category) => api.get(`/tags/category/${category}`),
  createDefaultTags: () => api.post("/tags/create-defaults"),
};

// Contacts API calls
export const contactsAPI = {
  getAllContacts: () => api.get("/contacts"),
  getContact: (id) => api.get(`/contacts/${id}`),
  createContact: (contactData) => api.post("/contacts", contactData),
  updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  searchContacts: (query) => api.get("/contacts/search", { params: { query } }),
};

export default api;
