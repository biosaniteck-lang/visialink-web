import { useEffect, useState } from 'react';
import { api } from '../api.js';
import PrivacyPrenotazione from './PrivacyPrenotazione.jsx';

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
  const [consenso, setConsenso] = useState(false);
  const [mostraInformativa, setMostraInformativa] = useState(false);

  // L'informativa si apre sopra il modulo, così i dati già scritti non si
  // perdono. Il pulsante "Indietro" del telefono la chiude (invece di
  // uscire dal modulo): all'apertura aggiungiamo una voce alla cronologia.
  const apriInformativa = () => {
    const stato = window.history.state || {};
    window.history.pushState({ ...stato, idx: (stato.idx ?? 0) + 1, modale: true }, '');
    setMostraInformativa(true);
  };

  const chiudiInformativa = () => {
    if (window.history.state?.modale) window.history.back();
    else setMostraInformativa(false);
  };

  useEffect(() => {
    if (!mostraInformativa) return undefined;
    const alCambioCronologia = (evento) => {
      if (!evento.state?.modale) setMostraInformativa(false);
    };
    window.addEventListener('popstate', alCambioCronologia);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('popstate', alCambioCronologia);
      document.body.style.overflow = '';
    };
  }, [mostraInformativa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);

    if (!nome.trim() || !cognome.trim()) {
      setErrore('Nome e cognome sono obbligatori.');
      return;
    }

    if (!consenso) {
      setErrore("Per prenotare devi leggere l'informativa privacy e dare il consenso al trattamento dei dati.");
      return;
    }

    setInvio(true);
    try {
      const paziente = await api.creaPaziente({
        nome: nome.trim(),
        cognome: cognome.trim(),
        email: email.trim() || null,
        telefono: telefono.trim() || null,
        consenso_privacy: true,
      });

      const prenotazione = await api.creaPrenotazione({
        slot_id: slot.id,
        paziente_id: paziente.id,
        tipo,
        note: note.trim() || null,
        consenso_privacy: true,
      });

      onConfermata({ prenotazione, paziente, prenotazioneId: prenotazione.codice_breve });
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

        <label className="consenso-box" htmlFor="consenso-privacy">
          <input
            id="consenso-privacy"
            type="checkbox"
            checked={consenso}
            onChange={(e) => setConsenso(e.target.checked)}
          />
          <span>
            Ho letto l'
            <button type="button" className="consenso-link" onClick={apriInformativa}>
              informativa privacy
            </button>{' '}
            e acconsento al trattamento dei miei dati personali, compresi quelli relativi alla
            salute, per la gestione della prenotazione.
          </span>
        </label>

        <button className="submit-btn" type="submit" disabled={invio || !consenso}>
          {invio ? 'Invio in corso…' : 'Conferma prenotazione'}
        </button>
        {!consenso && (
          <p className="consenso-nota">Per prenotare spunta la casella del consenso.</p>
        )}
      </form>

      {mostraInformativa && (
        <div className="modale-informativa" role="dialog" aria-modal="true">
          <PrivacyPrenotazione onIndietro={chiudiInformativa} />
        </div>
      )}
    </div>
  );
}
