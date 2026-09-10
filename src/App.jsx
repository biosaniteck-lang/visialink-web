
import { useEffect, useState } from 'react';
import logo from './assets/logo.png';
import Home from './pages/Home.jsx';
import Medici from './pages/Medici.jsx';
import Slot from './pages/Slot.jsx';
import Prenota from './pages/Prenota.jsx';
import Conferma from './pages/Conferma.jsx';
import GestisciPrenotazione from './pages/GestisciPrenotazione.jsx';
import Admin from './pages/Admin.jsx';
import { api } from './api.js';

// Navigazione semplice a stato: niente librerie di routing,
// il sito ha poche pagine e questo approccio è più leggero
// da mantenere e da distribuire.
// Eccezione: /admin è riconosciuto dal percorso dell'URL, perché è
// un'area separata (back-office) pensata per essere raggiunta con un
// indirizzo diretto, non tramite la navigazione del sito pubblico.
export default function App() {
  const eAdmin = window.location.pathname.startsWith('/admin');

  const [pagina, setPagina] = useState('home');
  const [medicoSelezionato, setMedicoSelezionato] = useState(null);
  const [slotSelezionato, setSlotSelezionato] = useState(null);
  const [pazienteConfermato, setPazienteConfermato] = useState(null);
  const [prenotazioneIdConfermata, setPrenotazioneIdConfermata] = useState(null);
  const [sede, setSede] = useState(null);
  const [codicePrenotazioneUrl, setCodicePrenotazioneUrl] = useState(null);

  // Se il link contiene ?prenotazione=<id>, apriamo direttamente la
  // pagina di gestione con quella prenotazione già caricata — utile
  // per un link diretto inviato via email/SMS in futuro.
  useEffect(() => {
    if (eAdmin) return;
    const params = new URLSearchParams(window.location.search);
    const idPrenotazione = params.get('prenotazione');
    if (idPrenotazione) {
      setCodicePrenotazioneUrl(idPrenotazione);
      setPagina('gestisci');
    }
  }, [eAdmin]);

  // Se il link contiene ?studio=<slug>, carichiamo i dati di quello
  // studio (nome, telefono) e mostriamo solo i suoi medici.
  // Es: https://visialink.it/?studio=studio-rossi
  useEffect(() => {
    if (eAdmin) return;
    const params = new URLSearchParams(window.location.search);
    const studioSlug = params.get('studio');
    if (!studioSlug) return;

    api
      .getSede(studioSlug)
      .then(setSede)
      .catch(() => setSede(null));
  }, [eAdmin]);

  if (eAdmin) {
    return <Admin />;
  }

  const vaiHome = () => {
    setPagina('home');
    setMedicoSelezionato(null);
    setSlotSelezionato(null);
    setPazienteConfermato(null);
    setPrenotazioneIdConfermata(null);
  };

  const vaiMedici = () => setPagina('medici');

  const sceglimedico = (medico) => {
    setMedicoSelezionato(medico);
    setPagina('slot');
  };

  const scegliSlot = (slot) => {
    setSlotSelezionato(slot);
    setPagina('prenota');
  };

  const confermaPrenotazione = ({ paziente, prenotazioneId }) => {
    setPazienteConfermato(paziente);
    setPrenotazioneIdConfermata(prenotazioneId);
    setPagina('conferma');
  };

  return (
    <>
      {sede && (
        <div className="topbar">
          <div className="container topbar-inner">
            <span>{sede.nome}</span>
            {sede.telefono && <a href={`tel:${sede.telefono}`}>{sede.telefono}</a>}
          </div>
        </div>
      )}

      <nav className="nav">
        <div className="container nav-inner">
          <button className="nav-logo" onClick={vaiHome}>
            <img src={logo} alt="" className="nav-logo-icon" />
            VisiaLink
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button className="nav-cta" onClick={vaiMedici}>
              Prenota una visita
            </button>
            <button
              className="nav-cta"
              onClick={() => {
                setCodicePrenotazioneUrl(null);
                setPagina('gestisci');
              }}
            >
              Gestisci una prenotazione
            </button>
          </div>
        </div>
      </nav>

      {pagina === 'home' && <Home onVediMedici={vaiMedici} sedeId={sede?.id} />}

      {pagina === 'medici' && (
        <Medici onScegliMedico={sceglimedico} onIndietro={vaiHome} sedeId={sede?.id} />
      )}

      {pagina === 'slot' && medicoSelezionato && (
        <Slot medico={medicoSelezionato} onScegliSlot={scegliSlot} onIndietro={vaiMedici} />
      )}

      {pagina === 'prenota' && medicoSelezionato && slotSelezionato && (
        <Prenota
          medico={medicoSelezionato}
          slot={slotSelezionato}
          onConfermata={confermaPrenotazione}
          onIndietro={() => setPagina('slot')}
        />
      )}

      {pagina === 'conferma' && medicoSelezionato && slotSelezionato && pazienteConfermato && (
        <Conferma
          medico={medicoSelezionato}
          slot={slotSelezionato}
          paziente={pazienteConfermato}
          prenotazioneId={prenotazioneIdConfermata}
          onTornaHome={vaiHome}
        />
      )}

      {pagina === 'gestisci' && (
        <GestisciPrenotazione
          codiceIniziale={codicePrenotazioneUrl}
          onIndietro={vaiHome}
          onNuovaPrenotazione={vaiMedici}
        />
      )}

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} VisiaLink — created by MLM ICT SERVICE
        </div>
      </footer>
    </>
  );
}
