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

export default function Slot({ medico, onScegliSlot, onIndietro }) {
  const [slot, setSlot] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    api
      .getSlot(medico.id)
      .then(setSlot)
      .catch((err) => setErrore(err.message))
      .finally(() => setCaricamento(false));
  }, [medico.id]);

  const slotPerGiorno = slot.reduce((acc, s) => {
    (acc[s.data] = acc[s.data] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="container section">
      <button className="back-link" onClick={onIndietro}>
        ← Torna ai medici
      </button>
      <h2>{medico.nome}</h2>
      {medico.specialita && <p className="ledger-meta" style={{ marginTop: -20, marginBottom: 32 }}>{medico.specialita}</p>}

      {errore && <div className="error-box">Non è stato possibile caricare gli orari: {errore}</div>}

      {caricamento && <p className="ledger-empty">Caricamento orari…</p>}

      {!caricamento && slot.length === 0 && !errore && (
        <p className="ledger-empty">Nessuno slot libero al momento per questo medico.</p>
      )}

      {Object.entries(slotPerGiorno).map(([data, slotGiorno]) => (
        <div key={data}>
          <p className="day-heading">{formattaData(data)}</p>
          <div className="ledger">
            {slotGiorno.map((s) => (
              <div className="ledger-row" key={s.id}>
                <span className="ledger-time">
                  {s.ora_inizio.slice(0, 5)} – {s.ora_fine.slice(0, 5)}
                </span>
                <button className="ledger-action" onClick={() => onScegliSlot(s)}>
                  Prenota
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
