import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Home({ onVediMedici, sede }) {
  const [specialita, setSpecialita] = useState([]);

  useEffect(() => {
    api
      .getMedici(sede?.id)
      .then((medici) => {
        const uniche = [...new Set(medici.map((m) => m.specialita).filter(Boolean))];
        setSpecialita(uniche);
      })
      .catch(() => setSpecialita([]));
  }, [sede?.id]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            {sede ? `Prenota una visita da ${sede.nome}.` : 'Prenota una visita in pochi minuti.'}
          </h1>
          <p>
            Scegli il medico, l'orario che ti serve, conferma. Niente attese al
            telefono, niente andirivieni: la tua prenotazione è pronta subito.
          </p>
          <button className="hero-cta" onClick={onVediMedici}>
            Vedi i medici disponibili
          </button>
        </div>
      </section>

      {specialita.length > 0 && (
        <section className="section">
          <div className="container">
            <h2>Specialità disponibili</h2>
            <div className="chip-row">
              {specialita.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ borderTop: '1px solid var(--porcelain-line)' }}>
        <div className="container">
          <h2>Come funziona</h2>
          <div className="steps">
            <div>
              <p className="step-number">1</p>
              <p className="step-title">Scegli il medico</p>
              <p className="step-desc">
                Sfoglia l'elenco degli specialisti e trova quello che ti serve.
              </p>
            </div>
            <div>
              <p className="step-number">2</p>
              <p className="step-title">Scegli l'orario</p>
              <p className="step-desc">
                Vedi gli slot liberi e scegli il giorno e l'ora più comodi.
              </p>
            </div>
            <div>
              <p className="step-number">3</p>
              <p className="step-title">Conferma</p>
              <p className="step-desc">
                Inserisci i tuoi dati e ricevi subito la conferma della prenotazione.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
