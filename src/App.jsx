import { useEffect, useState } from 'react';
import logo from './assets/logo.png';
import Home from './pages/Home.jsx';
import Medici from './pages/Medici.jsx';
import Slot from './pages/Slot.jsx';
import Prenota from './pages/Prenota.jsx';
import Conferma from './pages/Conferma.jsx';
import GestisciPrenotazione from './pages/GestisciPrenotazione.jsx';
import Admin from './pages/Admin.jsx';
import PrivacySito from './pages/PrivacySito.jsx';
import PrivacyPrenotazione from './pages/PrivacyPrenotazione.jsx';
import Termini from './pages/Termini.jsx';
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
  const [paginaPrecedente, setPaginaPrecedente] = useState('home');

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

  // Il link consegnato al cliente è del tipo https://visialink.it/studio-rossi
  // (lo slug è il primo pezzo del percorso). Manteniamo anche il vecchio
  // formato ?studio=studio-rossi per compatibilità con link già distribuiti.
  useEffect(() => {
    if (eAdmin) return;

    const segmentoPercorso = window.location.pathname.replace(/^\/+/, '').split('/')[0];
    const studioSlug = segmentoPercorso || new URLSearchParams(window.location.search).get('studio');
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

  // Le pagine legali (Privacy, Termini) sono raggiungibili da ogni
  // punto del sito tramite il footer, e tornano alla pagina da cui si
  // è partiti invece che sempre alla home.
  const vaiAPaginaLegale = (nomePagina) => {
    setPaginaPrecedente(pagina);
    setPagina(nomePagina);
  };

  const tornaDaPaginaLegale = () => setPagina(paginaPrecedente);

  // Durante il flusso di prenotazione il link "Privacy" nel footer
  // punta all'informativa specifica per la prenotazione (quella che
  // spiega il doppio ruolo Studio/VisiaLink), non a quella generica
  // del sito: è l'informativa pertinente mentre si stanno fornendo i
  // propri dati per prenotare.
  const PAGINE_FLUSSO_PRENOTAZIONE = ['medici', 'slot', 'prenota', 'conferma'];
  const paginaPrivacyPertinente = PAGINE_FLUSSO_PRENOTAZIONE.includes(pagina)
    ? 'privacy-prenotazione'
    : 'privacy-sito';

  return (
    <>
      {sede && (
        <div className="topbar">
          <div className="container topbar-inner">
            <div className="topbar-info">
              <span className="topbar-nome">{sede.nome}</span>
              {sede.indirizzo && <span>{sede.indirizzo}</span>}
            </div>
            <div className="topbar-contatti">
              {sede.telefono && <a href={`tel:${sede.telefono}`}>{sede.telefono}</a>}
              {sede.email && <a href={`mailto:${sede.email}`}>{sede.email}</a>}
            </div>
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

      {pagina === 'home' && <Home onVediMedici={vaiMedici} sede={sede} />}

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

      {pagina === 'privacy-sito' && <PrivacySito onIndietro={tornaDaPaginaLegale} />}
      {pagina === 'privacy-prenotazione' && <PrivacyPrenotazione onIndietro={tornaDaPaginaLegale} />}
      {pagina === 'termini' && <Termini onIndietro={tornaDaPaginaLegale} />}

      <footer className="footer">
        <div className="container footer-inner">
          <span>
            © {new Date().getFullYear()} VisiaLink — created by{' '}
            <a href="https://www.mlmictservice.it" target="_blank" rel="noopener">
              www.mlmictservice.it
            </a>{' '}
            — P.IVA 11189920967
          </span>
          <div className="footer-links">
            <button className="footer-link" onClick={() => vaiAPaginaLegale(paginaPrivacyPertinente)}>
              Privacy
            </button>
            <button className="footer-link" onClick={() => vaiAPaginaLegale('termini')}>
              Termini di utilizzo
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
