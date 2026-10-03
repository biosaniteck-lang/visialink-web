export default function PrivacySito({ onIndietro }) {
  return (
    <div className="container section legale">
      <button className="back-link" onClick={onIndietro}>
        ← Torna indietro
      </button>

      <h2>Informativa sulla protezione dei dati personali</h2>
      <p className="legale-sottotitolo">
        Sito visialink.it e pannello di gestione — ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679 (GDPR)
      </p>

      <p>
        Questa informativa riguarda il trattamento dei dati personali di chi visita il sito visialink.it,
        utilizza il modulo di contatto, oppure accede al pannello di gestione riservato agli Studi clienti
        (indirizzo /admin).
      </p>
      <p>
        Non riguarda invece i dati raccolti nel corso di una prenotazione di una visita medica tramite
        VisiaLink: per quelli si applica un'informativa distinta, mostrata nel footer durante il flusso di
        prenotazione, poiché in quel caso il Titolare del trattamento è lo Studio o il professionista
        sanitario presso cui si prenota, non chi gestisce la piattaforma.
      </p>

      <h3>1. Titolare del trattamento</h3>
      <p>
        Il Titolare del trattamento dei dati raccolti tramite il sito e il pannello di gestione è
        Maurizio Luigi Malerba, titolare di MLM ICT Service, con sede in Via Palmanova 133, 20132 Milano,
        P.IVA 11189920967, contattabile all'indirizzo email info.visialink@gmail.com.
      </p>

      <h3>2. Quali dati trattiamo e per quali finalità</h3>
      <table className="legale-tabella">
        <thead>
          <tr><th>Dati trattati</th><th>Finalità</th><th>Base giuridica</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Dati di navigazione (indirizzo IP, browser, pagine visitate, orario di accesso)</td>
            <td>Funzionamento tecnico del sito, sicurezza, prevenzione di usi impropri</td>
            <td>Legittimo interesse del Titolare (art. 6.1.f GDPR)</td>
          </tr>
          <tr>
            <td>Nome, email e messaggio inseriti in un eventuale modulo di contatto</td>
            <td>Rispondere a richieste di informazioni commerciali</td>
            <td>Misure precontrattuali su richiesta dell'interessato (art. 6.1.b)</td>
          </tr>
          <tr>
            <td>Chiave di accesso al pannello gestionale, assegnata a ciascuno Studio cliente</td>
            <td>Autenticazione e gestione degli account del pannello amministrativo</td>
            <td>Esecuzione del contratto di fornitura del servizio VisiaLink (art. 6.1.b)</td>
          </tr>
        </tbody>
      </table>

      <h3>3. Natura del conferimento dei dati</h3>
      <p>
        Il conferimento dei dati di navigazione è necessario per il funzionamento tecnico del sito: senza
        di essi non è possibile erogare il servizio. Il conferimento dei dati di un eventuale modulo di
        contatto è facoltativo, ma necessario per poter rispondere alla richiesta. Il conferimento della
        chiave di accesso al pannello di gestione è necessario per autenticarsi.
      </p>

      <h3>4. Dove sono conservati i dati e chi li tratta per nostro conto</h3>
      <p>I dati sono conservati su infrastrutture tecniche fornite da soggetti terzi, che agiscono come responsabili del trattamento su nostra istruzione:</p>
      <ul>
        <li>Supabase Inc. — database, su server ubicati nell'Unione Europea (regione Irlanda)</li>
        <li>Render Services Inc. — hosting del backend applicativo</li>
        <li>Vercel Inc. — hosting del sito e dell'interfaccia web</li>
      </ul>
      <p>Con ciascuno di questi fornitori è in vigore un accordo sul trattamento dei dati (Data Processing Agreement) conforme all'art. 28 del GDPR.</p>

      <h3>5. Trasferimento dei dati verso Paesi extra-UE</h3>
      <p>
        Il database (Supabase) è ospitato su server ubicati nell'Unione Europea (Irlanda). Vercel Inc. e
        Render Services Inc., pur offrendo infrastrutture con sede nell'Unione Europea, sono società con
        sede legale negli Stati Uniti: un trasferimento di dati verso un Paese extra-UE non può quindi
        essere escluso in senso assoluto, ma è disciplinato dalle clausole contrattuali standard (Standard
        Contractual Clauses) adottate dalla Commissione Europea, a garanzia di un livello di protezione
        equivalente a quello previsto dal GDPR.
      </p>

      <h3>6. Periodo di conservazione</h3>
      <p>
        I dati di navigazione sono conservati non oltre 12 mesi. I dati di un modulo di contatto non oltre
        24 mesi dall'ultimo contatto. Le credenziali di accesso al pannello sono conservate per la durata
        del rapporto contrattuale con lo Studio cliente.
      </p>

      <h3>7. Comunicazione dei dati a terzi</h3>
      <p>I dati non sono ceduti a terzi per finalità commerciali. Possono essere comunicati ai fornitori tecnici indicati al punto 4, e alle autorità competenti quando richiesto dalla legge.</p>

      <h3>8. Processi decisionali automatizzati e profilazione</h3>
      <p>I dati raccolti tramite il sito non sono soggetti ad alcun processo decisionale interamente automatizzato, inclusa la profilazione.</p>

      <h3>9. I tuoi diritti</h3>
      <p>
        Hai diritto di accedere ai tuoi dati, rettificarli, cancellarli, limitarne il trattamento, opporti
        al trattamento e ottenerne la portabilità (artt. 15-21 GDPR). Puoi proporre reclamo al{' '}
        <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">Garante per la Protezione dei Dati Personali</a>.
        Per esercitare questi diritti, scrivi a info.visialink@gmail.com.
      </p>

      <h3>10. Cookie e tecnologie simili</h3>
      <p>
        Per i dettagli su cookie e tecnologie simili utilizzate dal sito, consulta la{' '}
        <strong>Cookie Policy</strong>, raggiungibile dal footer di questa pagina.
      </p>

      <h3>11. Modifiche a questa informativa</h3>
      <p>Questa informativa può essere aggiornata nel tempo. La versione aggiornata sarà sempre disponibile su questa pagina.</p>
    </div>
  );
}
