/**
 * API Service Client Module
 * Provides centralized fetch wrappers, JWT token management, and REST endpoints.
 */

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1';

/**
 * Common request helper handling standard JSON requests, headers, and authentication.
 */
async function request(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
  const token = localStorage.getItem('auth_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };

  const config = {
    method,
    headers: defaultHeaders,
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle token expiry / Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request Failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

/* ==========================================================================
   Candidate & Exam Endpoints
   ========================================================================== */

export const examApi = {
  /** Fetch active exam payload and section questions for candidate */
  getExam: (examId) => request(`/exams/${examId}`),

  /** Save individual candidate question response (with client cryptographic signature) */
  submitAnswer: (examId, { questionId, answer, signature, timestamp }) =>
    request(`/exams/${examId}/answer`, {
      method: 'POST',
      body: { questionId, answer, signature, timestamp }
    }),

  /** Batch upload response queue accumulated while offline */
  syncOfflineResponses: (examId, queuedResponses) =>
    request(`/exams/${examId}/sync-offline`, {
      method: 'POST',
      body: { responses: queuedResponses }
    }),

  /** Submit completed examination session */
  submitFinalExam: (examId, finalPayload) =>
    request(`/exams/${examId}/submit`, {
      method: 'POST',
      body: finalPayload
    })
};

/* ==========================================================================
   Admin Operations & Systems Control Endpoints
   ========================================================================== */

export const adminApi = {
  /** Fetch real-time system metrics and active test center statuses */
  getCenterMetrics: () => request('/admin/centers'),

  /** Fetch active AI proctoring configuration and risk sensitivity thresholds */
  getRiskConfig: () => request('/admin/risk-engine/config'),

  /** Update AI risk engine thresholds and toggle detection modules */
  updateRiskConfig: (configData) =>
    request('/admin/risk-engine/config', {
      method: 'PUT',
      body: configData
    }),

  /** Fetch flagged candidate proctoring sessions */
  getFlaggedSessions: () => request('/admin/risk-engine/flagged-sessions'),

  /** Clear or resolve a flagged proctoring session */
  resolveFlaggedSession: (sessionId, resolutionNotes) =>
    request(`/admin/risk-engine/flagged-sessions/${sessionId}/resolve`, {
      method: 'POST',
      body: { resolutionNotes }
    }),

  /** Retrieve cryptographic ledger blocks */
  getHashLedger: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/ledger${query ? `?${query}` : ''}`);
  },

  /** Re-verify cryptographic SHA-256 chain and Merkle root */
  verifyLedgerChain: () =>
    request('/admin/ledger/verify-chain', {
      method: 'POST'
    }),

  /** Fetch live incidents and system failover events */
  getIncidents: () => request('/admin/incidents'),

  /** Acknowledge an active infrastructure incident */
  acknowledgeIncident: (incidentId) =>
    request(`/admin/incidents/${incidentId}/acknowledge`, {
      method: 'PATCH'
    }),

  /** Mark an incident as resolved */
  resolveIncident: (incidentId) =>
    request(`/admin/incidents/${incidentId}/resolve`, {
      method: 'PATCH'
    })
};

/* ==========================================================================
   Authentication & Session Endpoints
   ========================================================================== */

export const authApi = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: credentials
    }),

  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve(true);
  },

  getCurrentUser: () => request('/auth/me')
};

export default {
  examApi,
  adminApi,
  authApi
};