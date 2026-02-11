const API_BASE = 'http://localhost:5000/api/v1';

/**
 * Core API helper — handles headers, auth token, and error parsing
 */
async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || 'Something went wrong');
    }

    return data;
}

// ── Auth ──
export const authAPI = {
    register: (body) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (body) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

    getMe: () => request('/auth/me'),
};

// ── Resumes ──
export const resumeAPI = {
    getAll: (page = 1, limit = 10) =>
        request(`/resumes?page=${page}&limit=${limit}`),

    getById: (id) => request(`/resumes/${id}`),

    create: (body) =>
        request('/resumes', { method: 'POST', body: JSON.stringify(body) }),

    update: (id, body) =>
        request(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

    delete: (id) => request(`/resumes/${id}`, { method: 'DELETE' }),
};

// ── AI ──
export const aiAPI = {
    generateSummary: (body) =>
        request('/ai/generate-summary', { method: 'POST', body: JSON.stringify(body) }),

    analyzeResume: (body) =>
        request('/ai/analyze', { method: 'POST', body: JSON.stringify(body) }),
};
