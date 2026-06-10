const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('admin_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    apiRequest('/admin_data/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (email, password, name) => 
    apiRequest('/admin_register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  
  getCurrentUser: () => 
    apiRequest('/admin_profile/'),
};