export default function PrivacyPrenotazione({ onIndietro }) {
  return (
    <div className="container section legale">
      <button className="back-link" onClick={onIndietro}>
        ← Torna indietro
      </button>

      <h2>Informativa sulla protezione dei dati personali</h2>
      <p className="legale-sottotitolo">
        Prenotazione di una visita tramite la piattaforma VisiaLink — ai sensi degli artt. 13-14 GDPR
      </p>

      <h3>1. Chi tratta i tuoi dati: due soggetti, due ruoli diversi</h3>
      <p>Quando prenoti una visita tramite VisiaLink, i tuoi dati personali sono trattati da due soggetti distinti:</p>
      <ul>
        <li>
          <strong>Il Titolare del trattamento</strong> è lo Studio medico o il professionista sanitario
          presso cui stai prenotando la visita, i cui dati identificativi sono indicati nella pagina di
          prenotazione. È lo Studio a decidere come e perché i tuoi dati vengono raccolti, ed è a lui che
          ti puoi rivolgere per esercitare i tuoi diritti.
        </li>
        <li>
          <strong>MLM ICT Service</strong> di Maurizio Luigi Malerba (Via Palmanova 133, 20132 Milano,
          P.IVA 11189920967) fornisce e gestisce VisiaLink, la piattaforma tecnica su cui la prenotazione
          avviene, agendo come Responsabile del trattamento (art. 28 GDPR) su istruzione dello Studio.
        </li>
      </ul>

      <h3>2. Quali dati raccogliamo</h3>
      <table className="legale-tabella">
        <thead>
          <tr><th>Dato</th><th>Raccolto quando</th><th>Facoltativo</th></tr>
        </thead>
        <tbody>
          <tr><td>Nome e cognome</td><td>Compilazione del modulo di prenotazione</td><td>No</td></tr>
          <tr><td>Email</td><td>Compilazione del modulo di prenotazione</td><td>No</td></tr>
          <tr><td>Numero di telefono</td><td>Compilazione del modulo di prenotazione</td><td>No</td></tr>
          <tr><td>Tipo di prenotazione (privata o tramite SSN)</td><td>Scelta al momento della prenotazione</td><td>No</td></tr>
          <tr><td>Note libere per il medico o lo studio</td><td>Compilazione facoltativa del modulo</td><td>Sì</td></tr>
        </tbody>
      </table>

      <h3>3. Per quali finalità</h3>
      <p>I dati raccolti durante la prenotazione sono utilizzati per gestire la prenotazione, comunicarne la conferma o l'eventuale cancellazione, e costituire presso lo Studio un'anagrafica dei pazienti, aggiornata automaticamente. La base giuridica è l'esecuzione di misure precontrattuali su tua richiesta (art. 6.1.b GDPR).</p>

      <h3>4. Natura del conferimento dei dati</h3>
      <p>Il conferimento di nome, cognome, email, telefono e tipo di prenotazione è obbligatorio: senza questi dati non è possibile completare la prenotazione. Le note libere sono facoltative.</p>

      <h3>5. Dati relativi alla salute</h3>
      <p>
        Se scegli una prenotazione tramite Servizio Sanitario Nazionale, o inserisci informazioni sul tuo
        stato di salute nelle note, questi dati rientrano nelle categorie particolari di dati personali
        (art. 9 GDPR). Sono trattati esclusivamente per erogare la prestazione richiesta, sulla base del
        consenso esplicito prestato al momento della prenotazione.
      </p>

      <h3>6. Comunicazioni future (email, promemoria, newsletter)</h3>
      <p>
        Al momento VisiaLink non invia automaticamente email, messaggi WhatsApp o newsletter. Se in futuro
        lo Studio attivasse queste funzionalità, riceverai un'informativa aggiornata e, dove richiesto, un
        consenso specifico e distinto da quello necessario per la prenotazione.
      </p>

      <h3>7. Dove sono conservati i tuoi dati e trasferimento extra-UE</h3>
      <p>
        I dati sono conservati su Supabase, su server ubicati nell'Unione Europea (Irlanda). La piattaforma
        si avvale inoltre di Vercel Inc. e Render Services Inc.: pur offrendo infrastrutture con sede
        nell'Unione Europea, queste società hanno sede legale negli Stati Uniti, per cui un trasferimento
        extra-UE non può essere escluso in senso assoluto, ma è disciplinato dalle clausole contrattuali
        standard adottate dalla Commissione Europea.
      </p>

      <h3>8. Periodo di conservazione</h3>
      <p>I dati sono conservati finché mantieni un rapporto con lo Studio. Puoi chiedere allo Studio la cancellazione in qualsiasi momento, salvo obblighi di legge (fiscali o sanitari).</p>

      <h3>9. Processi decisionali automatizzati e profilazione</h3>
      <p>I tuoi dati non sono soggetti ad alcun processo decisionale interamente automatizzato, inclusa la profilazione.</p>

      <h3>10. I tuoi diritti</h3>
      <p>
        Hai diritto di accedere ai tuoi dati, rettificarli, cancellarli, limitarne il trattamento, opporti
        al trattamento (artt. 15-21 GDPR) e proporre reclamo al{' '}
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">Garante per la Protezione dei Dati Personali</a>.
        Poiché lo Studio è il Titolare, questi diritti vanno esercitati rivolgendosi direttamente a lui, ai
        contatti indicati nella pagina di prenotazione.
      </p>

      <h3>11. Modifiche a questa informativa</h3>
      <p>Questa informativa può essere aggiornata nel tempo. La versione più recente è sempre disponibile nella pagina di prenotazione.</p>
    </div>
  );
}
