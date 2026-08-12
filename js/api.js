/*
 * API centralizada.
 * Cole aqui a URL do Web App do Google Apps Script.
 */
const API_URL = "https://script.google.com/macros/s/AKfycbwl6JcCdRrj-pQl1RT-gXpBMDJ0jX6QSbnF782K7iq4e3bPC_M63cRxrsVLbYKE1TmY/exec";

const API = {
  async get(action, params = {}) {
    if (!API_URL) {
      console.warn("API_URL ainda não configurada.");
      return null;
    }
    const query = new URLSearchParams({ action, ...params });
    const response = await fetch(`${API_URL}?${query.toString()}`, { method: "GET" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  async post(action, payload = {}) {
    if (!API_URL) {
      console.warn("API_URL ainda não configurada.");
      return null;
    }
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...payload })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
};
