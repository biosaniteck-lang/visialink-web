import { useEffect, useRef, useState } from 'react';
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
import Cookie from './pages/Cookie.jsx';
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

  // Copia sempre aggiornata dei dati del flusso di prenotazione: serve al
  // gestore del pulsante "Indietro" del browser per sapere se una pagina
  // si può ancora mostrare (es. non si torna a "prenota" senza uno slot).
  const flusso = useRef({});
  flusso.current = { medicoSelezionato, slotSelezionato, pazienteConfermato };

  // Cronologia del browser. Il sito cambia pagina con lo stato interno e
  // l'indirizzo resta lo stesso: senza queste voci il pulsante "Indietro"
  // (del browser o del telefono) uscirebbe dal sito. Ogni cambio di pagina
  // aggiunge una voce con la pagina e la sua posizione (idx).
  const naviga = (nuovaPagina, { sostituisci = false } = {}) => {
    const idxAttuale = window.history.state?.idx ?? 0;
    const stato = { vl: 1, pagina: nuovaPagina, idx: sostituisci ? idxAttuale : idxAttuale + 1 };
    if (sostituisci) window.history.replaceState(stato, '');
    else window.history.pushState(stato, '');
    setPagina(nuovaPagina);
  };

  // All'apertura, e dopo un ricaricamento, la voce corrente diventa la
  // pagina iniziale del sito (posizione 0).
  useEffect(() => {
    if (eAdmin) return;
    const inizialePagina = new URLSearchParams(window.location.search).get('prenotazione')
      ? 'gestisci'
      : 'home';
    window.history.replaceState({ vl: 1, pagina: inizialePagina, idx: 0 }, '');
  }, [eAdmin]);

  // Pulsante "Indietro" / "Avanti" del browser o del telefono.
  useEffect(() => {
    if (eAdmin) return;
    const alCambioCronologia = (evento) => {
      const stato = evento.state;
      if (!stato || !stato.vl) return;
      const { medicoSelezionato: m, slotSelezionato: sl, pazienteConfermato: p } = flusso.current;
      const richieste = {
        slot: m,
        prenota: m && sl,
        conferma: m && sl && p,
      };
      const mostrabile = !(stato.pagina in richieste) || richieste[stato.pagina];
      setPagina(mostrabile ? stato.pagina : 'home');
    };
    window.addEventListener('popstate', alCambioCronologia);
    return () => window.removeEventListener('popstate', alCambioCronologia);
  }, [eAdmin]);

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

  const azzeraFlusso = () => {
    setMedicoSelezionato(null);
    setSlotSelezionato(null);
    setPazienteConfermato(null);
    setPrenotazioneIdConfermata(null);
  };

  const vaiHome = () => {
    azzeraFlusso();
    if (pagina !== 'home') naviga('home');
  };

  const vaiMedici = () => {
    if (pagina !== 'medici') naviga('medici');
  };

  const vaiGestisci = () => {
    setCodicePrenotazioneUrl(null);
    if (pagina !== 'gestisci') naviga('gestisci');
  };

  // Pulsante "← Torna ..." delle pagine: usa la cronologia del browser,
  // così "Indietro" e il link della pagina fanno la stessa cosa. Se la
  // pagina è la prima visitata (link diretto), non c'è nulla dietro e
  // si va alla pagina indicata.
  const indietro = (paginaDiRiserva = 'home') => {
    if ((window.history.state?.idx ?? 0) > 0) {
      window.history.back();
      return;
    }
    if (paginaDiRiserva === 'home') azzeraFlusso();
    naviga(paginaDiRiserva, { sostituisci: true });
  };

  const sceglimedico = (medico) => {
    setMedicoSelezionato(medico);
    naviga('slot');
  };

  const scegliSlot = (slot) => {
    setSlotSelezionato(slot);
    naviga('prenota');
  };

  // La pagina di conferma prende il posto del modulo nella cronologia:
  // "Indietro" non riporta al modulo già inviato (rischio di doppia
  // prenotazione), ma agli orari.
  const confermaPrenotazione = ({ paziente, prenotazioneId }) => {
    setPazienteConfermato(paziente);
    setPrenotazioneIdConfermata(prenotazioneId);
    naviga('conferma', { sostituisci: true });
  };

  // Le pagine legali (Privacy, Termini) sono raggiungibili da ogni
  // punto del sito tramite il footer, e tornano alla pagina da cui si
  // è partiti invece che sempre alla home.
  const vaiAPaginaLegale = (nomePagina) => {
    setPaginaPrecedente(pagina);
    naviga(nomePagina);
  };

  const tornaDaPaginaLegale = () => indietro(paginaPrecedente);

  // Durante il flusso di prenotazione il link "Privacy" nel footer
  // punta all'informativa specifica per la prenotazione (quella che
  // spiega il doppio ruolo Studio/VisiaLink), non a quella generica
  // del sito: è l'informativa pertinente mentre si stanno fornendo i
  // propri dati per prenotare.
  // Studio sospeso (es. canone non pagato): niente nuove prenotazioni online.
  // Restano accessibili la gestione/annullamento delle prenotazioni già fatte.
  const prenotazioniSospese = sede?.sospesa === true;
  const avvisoSospensione = (
    <div className="container section">
      <div className="summary-card">
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Prenotazioni online non disponibili</p>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>
          Questo studio non accetta al momento nuove prenotazioni online. Per fissare un appuntamento
          contatta direttamente lo studio{sede?.telefono ? ` al ${sede.telefono}` : ''}.
        </p>
        <p style={{ color: 'var(--ink-soft)' }}>
          Se hai già una prenotazione, puoi gestirla o annullarla con il pulsante «Gestisci una
          prenotazione».
        </p>
      </div>
    </div>
  );

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
            {!prenotazioniSospese && (
              <button className="nav-cta" onClick={vaiMedici}>
                Prenota una visita
              </button>
            )}
            <button className="nav-cta" onClick={vaiGestisci}>
              Gestisci una prenotazione
            </button>
          </div>
        </div>
      </nav>

      {pagina === 'home' && (
        <>
          {prenotazioniSospese && avvisoSospensione}
          <Home onVediMedici={vaiMedici} sede={sede} />
        </>
      )}

      {pagina === 'medici' &&
        (prenotazioniSospese ? (
          avvisoSospensione
        ) : (
          <Medici onScegliMedico={sceglimedico} onIndietro={() => indietro('home')} sedeId={sede?.id} />
        ))}

      {pagina === 'slot' &&
        medicoSelezionato &&
        (prenotazioniSospese ? (
          avvisoSospensione
        ) : (
          <Slot medico={medicoSelezionato} onScegliSlot={scegliSlot} onIndietro={() => indietro('medici')} />
        ))}

      {pagina === 'prenota' &&
        medicoSelezionato &&
        slotSelezionato &&
        (prenotazioniSospese ? (
          avvisoSospensione
        ) : (
          <Prenota
            medico={medicoSelezionato}
            slot={slotSelezionato}
            onConfermata={confermaPrenotazione}
            onIndietro={() => indietro('slot')}
          />
        ))}

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
          onIndietro={() => indietro('home')}
          onNuovaPrenotazione={vaiMedici}
        />
      )}

      {pagina === 'privacy-sito' && <PrivacySito onIndietro={tornaDaPaginaLegale} />}
      {pagina === 'privacy-prenotazione' && <PrivacyPrenotazione onIndietro={tornaDaPaginaLegale} />}
      {pagina === 'termini' && <Termini onIndietro={tornaDaPaginaLegale} />}
      {pagina === 'cookie' && <Cookie onIndietro={tornaDaPaginaLegale} />}

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
            <button className="footer-link" onClick={() => vaiAPaginaLegale('cookie')}>
              Cookie
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
