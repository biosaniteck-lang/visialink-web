function formattaData(dataIso) {
  const d = new Date(dataIso + 'T00:00:00');
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function Conferma({ medico, slot, paziente, prenotazioneId, onTornaHome }) {
  return (
    <div className="container section">
      <p className="confirm-mark">✓</p>
      <h2>Prenotazione confermata</h2>

      <div className="summary-card">
        <p style={{ fontWeight: 600 }}>{medico.nome}</p>
        {medico.specialita && <p>{medico.specialita}</p>}
        <p>
          {formattaData(slot.data)}, {slot.ora_inizio.slice(0, 5)} – {slot.ora_fine.slice(0, 5)}
        </p>
        <p style={{ marginTop: 12 }}>
          Prenotata a nome di {paziente.nome} {paziente.cognome}
        </p>
        {paziente.email && <p className="ledger-meta">{paziente.email}</p>}
      </div>

      {prenotazioneId && (
        <div className="summary-card" style={{ borderLeftColor: 'var(--brass)' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Codice prenotazione</p>
          <p style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>{prenotazioneId}</p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
            Conserva questo codice: ti servirà per modificare o annullare la
            prenotazione dalla sezione "Gestisci una prenotazione" nel sito.
          </p>
        </div>
      )}

      <p style={{ color: 'var(--ink-soft)', marginBottom: 32 }}>
        Riceverai una conferma via email. Per modificare o cancellare la
        prenotazione, contatta direttamente lo studio.
      </p>

      <button className="submit-btn" onClick={onTornaHome}>
        Torna alla home
      </button>
    </div>
  );
}
