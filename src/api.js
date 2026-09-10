// Punto unico da cui il sito parla con il backend.
// In locale puoi creare un file .env con:
//   VITE_API_URL=http://localhost:3000
// In produzione (Vercel) puoi impostare la stessa variabile
// nelle Environment Variables del progetto, oppure lasciare
// il valore di default già puntato al backend su Render.

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
  getPrenotazione: (id) => request(`/api/prenotazioni/${id}`),
  cancellaPrenotazione: (id) =>
    request(`/api/prenotazioni/${id}/cancella`, { method: 'PATCH' }),

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
  aggiornaSede: (id, dati, adminKey) =>
    request(`/api/sedi/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dati),
      headers: adminHeaders(adminKey),
    }),
  aggiornaMedico: (id, dati, adminKey) =>
    request(`/api/medici/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dati),
      headers: adminHeaders(adminKey),
    }),
  eliminaSede: (id, adminKey) =>
    request(`/api/sedi/${id}`, { method: 'DELETE', headers: adminHeaders(adminKey) }),
  eliminaMedico: (id, adminKey) =>
    request(`/api/medici/${id}`, { method: 'DELETE', headers: adminHeaders(adminKey) }),
  generaSlotBulk: (datiSlot, adminKey) =>
    request('/api/slot/bulk', {
      method: 'POST',
      body: JSON.stringify(datiSlot),
      headers: adminHeaders(adminKey),
    }),
};
