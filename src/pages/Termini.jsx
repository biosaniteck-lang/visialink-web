export default function Termini({ onIndietro }) {
  return (
    <div className="container section legale">
      <button className="back-link" onClick={onIndietro}>
        ← Torna indietro
      </button>

      <h2>Termini di utilizzo</h2>
      <p className="legale-sottotitolo">Sito visialink.it e piattaforma di prenotazione</p>

      <h3>1. Ambito di applicazione</h3>
      <p>
        Questi termini regolano l'utilizzo del sito visialink.it e della piattaforma di prenotazione
        VisiaLink da parte di chi lo visita, prenota una visita, o lo usa come Studio cliente tramite il
        pannello di gestione. Per il trattamento dei dati personali si applicano le informative privacy,
        raggiungibili dal footer del sito.
      </p>

      <h3>2. Natura del servizio</h3>
      <p>
        VisiaLink è una piattaforma tecnica che consente agli Studi medici e ai professionisti sanitari di
        gestire online la propria agenda e le prenotazioni dei pazienti. VisiaLink (fornito da MLM ICT
        Service di Maurizio Luigi Malerba) agisce esclusivamente come intermediario tecnico: non fa parte
        del rapporto clinico tra paziente e medico, non fornisce prestazioni sanitarie, e non interviene
        nelle decisioni cliniche.
      </p>

      <h3>3. Esattezza delle informazioni</h3>
      <p>
        I contenuti relativi a ciascuno Studio — nome, indirizzo, contatti, medici, specialità, orari di
        disponibilità — sono inseriti e aggiornati direttamente dallo Studio cliente tramite il proprio
        pannello di gestione. MLM ICT Service non verifica nel merito l'esattezza di queste informazioni e
        non risponde di eventuali inesattezze, salvo il caso di dolo o colpa grave nella gestione tecnica
        della piattaforma.
      </p>
      <p>
        MLM ICT Service si adopera per mantenere il servizio funzionante e aggiornato, ma non può escludere
        in modo assoluto interruzioni, errori o malfunzionamenti di natura tecnica, e non presta alcuna
        garanzia espressa o implicita di assenza di difetti.
      </p>

      <h3>4. Limitazione di responsabilità</h3>
      <p>
        Salvo il caso di dolo o colpa grave, MLM ICT Service non risponde di eventuali danni diretti o
        indiretti derivanti dall'uso, o dal mancato uso, del sito o della piattaforma — inclusi, a titolo
        di esempio, danni derivanti da un'interruzione del servizio o da un errore nei dati inseriti da uno
        Studio cliente.
      </p>

      <h3>5. Proprietà intellettuale</h3>
      <p>
        Il nome "VisiaLink", il logo, il codice sorgente e la struttura del sito sono di titolarità
        esclusiva di MLM ICT Service di Maurizio Luigi Malerba, e sono tutelati dalle vigenti normative a
        protezione del diritto d'autore e della proprietà industriale. Non è consentito riprodurli,
        copiarli o riutilizzarli senza autorizzazione.
      </p>
      <p>
        I dati inseriti da ciascuno Studio cliente (anagrafica medici, pazienti, prenotazioni) restano di
        titolarità dello Studio stesso: VisiaLink li tratta solo in qualità di Responsabile del trattamento,
        come descritto nell'informativa privacy.
      </p>

      <h3>6. Collegamenti a siti esterni</h3>
      <p>
        Il sito può contenere link a siti esterni (ad esempio il Garante per la Protezione dei Dati
        Personali). MLM ICT Service non ha alcun controllo su tali siti e non risponde dei loro contenuti.
      </p>

      <h3>7. Modifiche a questi termini</h3>
      <p>
        Questi termini possono essere aggiornati nel tempo, in particolare all'attivazione di nuove
        funzionalità della piattaforma. La versione più recente è sempre disponibile su questa pagina.
      </p>

      <h3>8. Contatti</h3>
      <p>Per qualsiasi domanda su questi termini, scrivi a info.visialink@gmail.com.</p>
    </div>
  );
}
