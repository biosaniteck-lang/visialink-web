import { useState } from 'react';
import { api } from '../api.js';

function formattaData(dataIso) {
  const d = new Date(dataIso + 'T00:00:00');
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function Prenota({ medico, slot, onConfermata, onIndietro }) {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('privata');
  const [note, setNote] = useState('');
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);

    if (!nome.trim() || !cognome.trim()) {
      setErrore('Nome e cognome sono obbligatori.');
      return;
    }

    setInvio(true);
    try {
      const paziente = await api.creaPaziente({
        nome: nome.trim(),
        cognome: cognome.trim(),
        email: email.trim() || null,
        telefono: telefono.trim() || null,
      });

      const prenotazione = await api.creaPrenotazione({
        slot_id: slot.id,
        paziente_id: paziente.id,
        tipo,
        note: note.trim() || null,
      });

      onConfermata({ prenotazione, paziente });
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  };

  return (
    <div className="container section">
      <button className="back-link" onClick={onIndietro}>
        ← Torna agli orari
      </button>
      <h2>Conferma la prenotazione</h2>

      <div className="summary-card">
        <p style={{ fontWeight: 600 }}>{medico.nome}</p>
        {medico.specialita && <p>{medico.specialita}</p>}
        <p>
          {formattaData(slot.data)}, {slot.ora_inizio.slice(0, 5)} – {slot.ora_fine.slice(0, 5)}
        </p>
      </div>

      {errore && <div className="error-box">{errore}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="cognome">Cognome</label>
          <input id="cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-field">
          <label htmlFor="telefono">Telefono</label>
          <input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Tipo di visita</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="tipo"
                value="privata"
                checked={tipo === 'privata'}
                onChange={() => setTipo('privata')}
              />
              Privata
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="tipo"
                value="ssn"
                checked={tipo === 'ssn'}
                onChange={() => setTipo('ssn')}
              />
              SSN
            </label>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="note">Note (facoltativo)</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <button className="submit-btn" type="submit" disabled={invio}>
          {invio ? 'Invio in corso…' : 'Conferma prenotazione'}
        </button>
      </form>
    </div>
  );
}
