const API_URL = import.meta.env.VITE_API_URL || 'https://visialink-backend.onrender.com';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Errore ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// Le chiamate "admin" allegano la chiave di back-office nell'header.
// La chiave viene passata esplicitamente dal chiamante (non è mai
// salvata in questo file) e arriva da AdminAuth via sessionStorage.
function adminHeaders(adminKey) {
  return { 'x-admin-key': adminKey };
}

export const api = {
  getMedici: (sedeId) => request(sedeId ? `/api/medici?sede_id=${sedeId}` : '/api/medici'),
  getMedico: (id) => request(`/api/medici/${id}`),
  getSlot: (medicoId) => request(`/api/slot?medico_id=${medicoId}`),
  getSede: (identificatore) => request(`/api/sedi/${identificatore}`),
  creaPaziente: (paziente) =>
    request('/api/pazienti', {
      method: 'POST',
      body: JSON.stringify(paziente),
    }),
  creaPrenotazione: (prenotazione) =>
    request('/api/prenotazioni', {
      method: 'POST',
      body: JSON.stringify(prenotazione),
    }),

  // ---- Amministrazione (richiedono adminKey) ----
  listaSedi: (adminKey) => request('/api/sedi', { headers: adminHeaders(adminKey) }),
  creaSede: (sede, adminKey) =>
    request('/api/sedi', {
      method: 'POST',
      body: JSON.stringify(sede),
      headers: adminHeaders(adminKey),
    }),
  creaMedico: (medico, adminKey) =>
    request('/api/medici', {
      method: 'POST',
      body: JSON.stringify(medico),
      headers: adminHeaders(adminKey),
    }),
  generaSlotBulk: (datiSlot, adminKey) =>
    request('/api/slot/bulk', {
      method: 'POST',
      body: JSON.stringify(datiSlot),
      headers: adminHeaders(adminKey),
    }),
};
