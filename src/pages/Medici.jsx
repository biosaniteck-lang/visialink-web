import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Medici({ onScegliMedico, onIndietro, sedeId }) {
  const [medici, setMedici] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    api
      .getMedici(sedeId)
      .then(setMedici)
      .catch((err) => setErrore(err.message))
      .finally(() => setCaricamento(false));
  }, [sedeId]);

  return (
    <div className="container section">
      <button className="back-link" onClick={onIndietro}>
        ← Torna alla home
      </button>
      <h2>Medici disponibili</h2>

      {errore && <div className="error-box">Non è stato possibile caricare i medici: {errore}</div>}

      {caricamento && <p className="ledger-empty">Caricamento in corso…</p>}

      {!caricamento && medici.length === 0 && !errore && (
        <p className="ledger-empty">Nessun medico disponibile al momento.</p>
      )}

      <div className="ledger">
        {medici.map((medico) => (
          <div className="ledger-row" key={medico.id}>
            <div className="ledger-main">
              <span className="ledger-name">{medico.nome}</span>
              {medico.specialita && <span className="ledger-meta">{medico.specialita}</span>}
            </div>
            <button className="ledger-action" onClick={() => onScegliMedico(medico)}>
              Vedi disponibilità
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
