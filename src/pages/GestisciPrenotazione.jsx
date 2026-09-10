import { useEffect, useState } from 'react';
import { api } from '../api.js';

function formattaData(dataIso) {
  const d = new Date(dataIso + 'T00:00:00');
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function GestisciPrenotazione({ codiceIniziale, onIndietro, onNuovaPrenotazione }) {
  const [codice, setCodice] = useState(codiceIniziale || '');
  const [prenotazione, setPrenotazione] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState(null);
  const [cancellazione, setCancellazione] = useState(false);
  const [cancellata, setCancellata] = useState(false);

  const cerca = async (e) => {
    e?.preventDefault();
    if (!codice.trim()) return;

    setCaricamento(true);
    setErrore(null);
    setPrenotazione(null);
    setCancellata(false);

    try {
      const dati = await api.getPrenotazione(codice.trim());
      setPrenotazione(dati);
    } catch (err) {
      setErrore('Prenotazione non trovata. Controlla di aver inserito il codice corretto.');
    } finally {
      setCaricamento(false);
    }
  };

  // Se arriviamo da un link diretto con il codice già in mano,
  // cerchiamo subito senza aspettare che l'utente prema "Cerca".
  useEffect(() => {
    if (codiceIniziale) cerca();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codiceIniziale]);

  const handleCancella = async () => {
    if (!window.confirm('Confermi di voler annullare questa prenotazione?')) return;

    setCancellazione(true);
    setErrore(null);
    try {
      await api.cancellaPrenotazione(prenotazione.id);
      setCancellata(true);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setCancellazione(false);
    }
  };

  const slot = prenotazione?.slot_disponibilita;
  const medico = slot?.medici;
  const paziente = prenotazione?.pazienti;

  return (
    <div className="container section" style={{ maxWidth: 560 }}>
      <button className="back-link" onClick={onIndietro}>
        ← Torna alla home
      </button>
      <h2>Gestisci la tua prenotazione</h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
        Inserisci il codice ricevuto al momento della prenotazione per
        visualizzarla o annullarla.
      </p>

      <form onSubmit={cerca}>
        <div className="form-field">
          <label htmlFor="codice">Codice prenotazione</label>
          <input
            id="codice"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            placeholder="Es. 8f36b997-6907-4661-a43f-a7572baa33fe"
          />
        </div>
        <button className="submit-btn" type="submit" disabled={caricamento}>
          {caricamento ? 'Ricerca in corso…' : 'Cerca prenotazione'}
        </button>
      </form>

      {errore && (
        <div className="error-box" style={{ marginTop: 24 }}>
          {errore}
        </div>
      )}

      {prenotazione && !cancellata && (
        <div className="summary-card" style={{ marginTop: 32 }}>
          {medico && <p style={{ fontWeight: 600 }}>{medico.nome}</p>}
          {medico?.specialita && <p>{medico.specialita}</p>}
          {slot && (
            <p>
              {formattaData(slot.data)}, {slot.ora_inizio
