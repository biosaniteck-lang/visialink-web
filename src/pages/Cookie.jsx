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
        pubblicità di alcun tipo. Anche i caratteri tipografici sono ospitati sul sito stesso: il
        browser non contatta servizi esterni per caricarli.
      </p>
      <p>
        Il sito utilizza però alcune tecnologie di archiviazione locale diverse dai cookie, descritte ai
        punti 3 e 4, tutte di natura tecnica.
      </p>

      <h3>3. sessionStorage del pannello di gestione</h3>
      <p>
        Il pannello riservato agli Studi clienti (/admin) utilizza una tecnologia diversa dai cookie,
        chiamata <em>sessionStorage</em>, per mantenere l'accesso attivo durante la sessione di lavoro dopo
        l'inserimento della chiave. A differenza di un cookie, questo dato:
      </p>
      <ul>
        <li>
          resta sul dispositivo di chi lo usa e non viene inviato automaticamente al server, come invece
          avviene per i cookie; la chiave è trasmessa al servizio solo per autenticare le singole
          operazioni richieste dall'utente
        </li>
        <li>viene cancellato automaticamente alla chiusura della scheda o del browser</li>
        <li>non richiede consenso, perché strettamente necessario al funzionamento del pannello stesso</li>
      </ul>

      <h3>4. App installabile, service worker e archiviazione locale</h3>
      <p>
        VisiaLink può essere aggiunto alla schermata Home di smartphone e computer come un'app. Per
        questo il sito utilizza due strumenti tecnici, che non sono cookie e non contengono dati
        personali, né dati relativi alle prenotazioni:
      </p>
      <ul>
        <li>
          <strong>Service worker e memoria temporanea del browser (Cache Storage):</strong> conservano sul
          dispositivo solo file del sito (grafica, icone, caratteri e una pagina di cortesia mostrata se
          manca la connessione) per rendere l'app installabile e più veloce da aprire. Le richieste al
          servizio di prenotazione non vengono mai memorizzate.
        </li>
        <li>
          <strong>Preferenza sull'invito all'installazione (localStorage):</strong> se chiudi il messaggio
          che propone di installare l'app, il browser salva soltanto la data della chiusura, per non
          riproporlo per 7 giorni. Il dato resta sul tuo dispositivo e non viene inviato a VisiaLink né
          a terzi.
        </li>
      </ul>
      <p>
        Questi strumenti sono strettamente necessari a fornire la funzione richiesta o a ricordare una
        scelta dell'utente: per questo non richiedono consenso. Puoi eliminarli in qualsiasi momento dalle
        impostazioni del browser (cancellando i dati del sito) o disinstallando l'app.
      </p>

      <h3>5. Se questa situazione dovesse cambiare</h3>
      <p>
        Se in futuro VisiaLink dovesse introdurre cookie tecnici, analitici o di altro tipo (ad esempio uno
        strumento di statistiche sul traffico), questa pagina sarà aggiornata con l'elenco dettagliato dei
        cookie utilizzati, la loro durata, e — dove richiesto dalla normativa vigente — sarà attivato un
        banner per raccogliere il consenso prima della loro installazione.
      </p>

      <h3>6. Titolare del trattamento</h3>
      <p>
        Maurizio Luigi Malerba, titolare di MLM ICT Service, Via Palmanova 133, 20132 Milano, P.IVA
        11189920967, info.visialink@gmail.com.
      </p>

      <h3>7. Modifiche a questa pagina</h3>
      <p>Questa pagina può essere aggiornata nel tempo. La versione più recente è sempre disponibile qui, con indicazione della data di ultimo aggiornamento.</p>
      <p className="legale-sottotitolo">Ultimo aggiornamento: ottobre 2026</p>
    </div>
  );
}
