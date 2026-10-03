export default function Cookie({ onIndietro }) {
  return (
    <div className="container section legale">
      <button className="back-link" onClick={onIndietro}>
        ← Torna indietro
      </button>

      <h2>Cookie policy</h2>
      <p className="legale-sottotitolo">Sito visialink.it e pannello di gestione</p>

      <h3>1. Cosa sono i cookie</h3>
      <p>
        I cookie sono piccoli file di testo che un sito può salvare sul dispositivo di chi lo visita, ad
        esempio per riconoscerlo durante la navigazione o ricordare le sue preferenze. Si distinguono per
        finalità (tecnici, analitici, di profilazione) e per durata (di sessione, permanenti).
      </p>

      <h3>2. Quali cookie usa VisiaLink</h3>
      <p>
        <strong>Il sito visialink.it non utilizza alcun cookie</strong> — né tecnico, né analitico, né di
        profilazione, né di terze parti. Non sono presenti strumenti di tracciamento, statistica o
        pubblicità di alcun tipo.
      </p>

      <h3>3. sessionStorage del pannello di gestione</h3>
      <p>
        Il pannello riservato agli Studi clienti (/admin) utilizza una tecnologia diversa dai cookie,
        chiamata <em>sessionStorage</em>, per mantenere l'accesso attivo durante la sessione di lavoro dopo
        l'inserimento della chiave. A differenza di un cookie, questo dato:
      </p>
      <ul>
        <li>resta esclusivamente sul dispositivo di chi lo usa, e non viene mai inviato al server</li>
        <li>viene cancellato automaticamente alla chiusura della scheda o del browser</li>
        <li>non richiede consenso, perché strettamente necessario al funzionamento del pannello stesso</li>
      </ul>

      <h3>4. Se questa situazione dovesse cambiare</h3>
      <p>
        Se in futuro VisiaLink dovesse introdurre cookie tecnici, analitici o di altro tipo (ad esempio uno
        strumento di statistiche sul traffico), questa pagina sarà aggiornata con l'elenco dettagliato dei
        cookie utilizzati, la loro durata, e — dove richiesto dalla normativa vigente — sarà attivato un
        banner per raccogliere il consenso prima della loro installazione.
      </p>

      <h3>5. Titolare del trattamento</h3>
      <p>
        Maurizio Luigi Malerba, titolare di MLM ICT Service, Via Palmanova 133, 20132 Milano, P.IVA
        11189920967, info.visialink@gmail.com.
      </p>

      <h3>6. Modifiche a questa pagina</h3>
      <p>Questa pagina può essere aggiornata nel tempo. La versione più recente è sempre disponibile qui, con indicazione della data di ultimo aggiornamento.</p>
      <p className="legale-sottotitolo">Ultimo aggiornamento: ottobre 2026</p>
    </div>
  );
}
