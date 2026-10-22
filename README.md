# VisiaLink Web

Sito pubblico di prenotazione visite mediche + pannello di
amministrazione per **VisiaLink**, piattaforma SaaS multi-tenant:
uno stesso sito serve più studi/cliniche diversi, ciascuno con il
proprio link personalizzato.

- **Questo sito** → deploy su Vercel, dominio definitivo **`visialink.it`** (acquistato su Aruba, collegato il 22/10/2026).
  Il vecchio indirizzo `visialink-web.vercel.app` resta attivo.
- **Backend** → [visialink-backend](https://github.com/biosaniteck-lang/visialink-backend), su Render: `https://visialink-backend.onrender.com`
- **Database:** Supabase

## Come funziona il multi-tenant

Ogni studio cliente riceve un link personale generato dal pannello
admin, es. `visialink-web.vercel.app/rossi` (niente trattini, tutto
minuscolo — generato in automatico dal nome dello studio, ma
modificabile in qualsiasi momento). Aprendo quel link, il sito:
- mostra nome, indirizzo, telefono ed email dello studio in una topbar in alto
- personalizza il titolo della home ("Prenota una visita da Studio Rossi")
- mostra solo i medici di quello studio, ciascuno con i propri contatti

Senza uno slug nel percorso il sito mostra una home generica
(comportamento corretto, non un bug).

## Struttura

```
visialink-web/
├── src/
│   ├── main.jsx                  # entry point React
│   ├── App.jsx                   # navigazione a stato (no react-router), legge lo slug studio dal percorso
│   ├── api.js                    # client fetch verso il backend
│   ├── index.css                 # design system ("registro/ledger"): ink/porcelain/brass/sage/rust + stili di stampa
│   ├── assets/logo.png
│   └── pages/
│       ├── Home.jsx                    # landing page, personalizzata per studio
│       ├── Medici.jsx                  # elenco medici (filtrato per sede), con telefono/email di ciascuno
│       ├── Slot.jsx                    # orari disponibili, con selettore data (non permette date passate)
│       ├── Prenota.jsx                 # form di prenotazione
│       ├── Conferma.jsx                # mostra il codice breve della prenotazione
│       ├── GestisciPrenotazione.jsx    # self-service: cerca per codice, annulla (il pulsante delle email porta qui)
│       ├── PrivacyPrenotazione.jsx     # informativa privacy del paziente (Titolare = studio, MLM ICT Service = Responsabile)
│       ├── PrivacySito.jsx             # informativa privacy del sito visialink.it e del pannello admin
│       └── Admin.jsx                   # pannello back-office (vedi sotto)
├── public/
│   ├── manifest.webmanifest      # app installabile (PWA)
│   ├── sw.js                     # service worker minimale (vedi "App installabile")
│   ├── offline.html              # pagina di cortesia senza connessione
│   ├── icons/                    # icone app (192, 512, maskable, apple-touch, favicon)
│   └── fonts/                    # font self-hosted
├── index.html                    # meta PWA, registrazione service worker, banner di installazione
├── package.json
├── vite.config.js
├── vercel.json                   # rewrite SPA per ogni percorso (slug studio, /admin)
└── .gitignore
```

## Email al paziente

Il sito non invia email: lo fa il backend (via Resend). Il paziente
riceve una email di conferma, una di annullamento e, il giorno prima
della visita, un promemoria con il pulsante "Gestisci o annulla la
prenotazione", che porta alla pagina `GestisciPrenotazione`. L'invio del
promemoria si può spegnere per singolo studio dal pannello admin
(interruttore "promemoria email") o dal backend (colonna
`promemoria_attivi`: vedi il README del backend). Il mittente delle email
è `prenotazioni@visialink.it` (dominio verificato su Resend).

## Il pannello Admin (`/admin`)

Login a **due livelli**, dalla stessa schermata:

- **Chiave amministratore generale** (tua): vedi tutti gli studi,
  crei nuovi clienti, scarichi il backup completo
- **Chiave di accesso di un singolo studio** (consegnata al cliente):
  entra direttamente nel proprio pannello, senza vedere né poter
  toccare gli altri studi

Da lì si può:

- creare/modificare/eliminare **studi** (nome, telefono, email,
  indirizzo, e lo slug del link — modificabile in ogni momento, anche
  dopo la creazione)
- vedere/rigenerare la **chiave di accesso** dello studio, per
  consegnarla al cliente
- creare/modificare/eliminare **medici** di uno studio, con telefono
  ed email di ciascuno
- **generare gli slot di disponibilità** per un medico: si sceglie un
  intervallo di date e, per ciascun giorno della settimana, un orario
  diverso (utile perché un medico può ricevere al mattino certi giorni
  e al pomeriggio altri) — evita di dover creare gli slot uno alla volta
- vedere, **filtrare per medico**, **stampare** e **annullare** le
  prenotazioni di uno studio
- consultare l'**anagrafica pazienti**: un elenco unico delle persone
  che hanno prenotato (deduplicato automaticamente dal backend), con
  numero di visite e data dell'ultima, esportabile in **CSV** — pronto
  per eventuali newsletter o messaggi WhatsApp quando quelle
  funzionalità saranno attivate
- scaricare un **backup completo** dei dati in JSON *(solo chiave generale)*

## Deploy su Vercel

1. **vercel.com** → **Add New** → **Project** → seleziona questo repository
2. Vercel riconosce il progetto Vite in automatico (Build: `vite build`, Output: `dist`)
3. **Deploy**

Se il backend cambia indirizzo, si aggiorna la variabile d'ambiente
`VITE_API_URL` nelle impostazioni del progetto Vercel, senza toccare
il codice.

Quando il dominio definitivo sarà collegato, va impostata anche la
variabile `SITE_URL` sul backend (Render), perché i link nelle email
puntino al dominio giusto.

## App installabile (PWA)

Il sito si può aggiungere alla schermata Home del telefono come
un'app (senza passare dagli store):

- `public/manifest.webmanifest` descrive l'app; per i link degli studi
  (es. `/rossi`) `index.html` genera al volo un manifest con `start_url`
  uguale al link, così l'app installata si apre direttamente sullo
  studio giusto. `/admin` usa il manifest standard.
- `public/sw.js` è un service worker minimale: mostra `offline.html` se
  manca la connessione e mette in cache solo file statici (`/assets/`,
  `/fonts/`, `/icons/`). **Non memorizza mai le chiamate al backend**
  (prenotazioni, dati dei pazienti, pannello admin). Per forzare
  l'aggiornamento della cache cambiare `VERSION` in `sw.js`.
- In `index.html` un piccolo banner invita a installare l'app: su
  Android/Chrome compare il pulsante "Installa", su iPhone/iPad (Safari)
  le istruzioni "Condividi → Aggiungi alla schermata Home". Non compare
  su `/admin`, in stampa, o se l'app è già installata; dopo la chiusura
  non ricompare per 7 giorni (data salvata in `localStorage`, chiave
  `vl-install-nascondi`: dato solo tecnico, da citare nella Cookie policy).

## Dominio visialink.it (collegato)

- Vercel → **Settings → Domains**: `visialink.it` (record A `@` → `216.198.79.1`
  nel DNS di Aruba; `www` è un CNAME verso `visialink.it`).
- Sul DNS di Aruba restano i record di posta (`mx`) e quelli di Resend
  (`send`, `rsend`, `resend._domainkey`, `_dmarc`): non toccarli.
- Su Render (backend) `SITE_URL=https://visialink.it`: i link nelle email
  puntano al dominio definitivo (verificato con una prenotazione di prova).
- **CORS del backend (ristretto il 22/10/2026)**: il backend risponde ai
  browser solo da `visialink.it`, `www.visialink.it`, `visialink-web.vercel.app`
  e `localhost:5173` (sviluppo locale). Le richieste senza `Origin`
  (cron-job.org, controlli di Render, prove da terminale) passano comunque
  e restano protette da `x-admin-key` / `x-cron-secret`. Per autorizzare un
  dominio in più senza modificare il codice: variabile `ALLOWED_ORIGINS` su
  Render (elenco separato da virgole, senza barra finale). Se dopo un
  cambio di dominio il sito non carica più medici e orari, controllare
  prima la console del browser: un errore "CORS" indica un dominio mancante.

## Flusso di lavoro adottato in questo progetto

Chi mantiene questo sito lavora principalmente da tablet, dove il
copia-incolla di file lunghi può troncare il contenuto. Per questo,
quando si aggiorna un file: si sostituisce il contenuto **per intero**
(mai con modifiche parziali incollate a mano), verificando prima che
compili (`npm run build`) prima di caricarlo su GitHub.

## Da fare

- Cookie policy: dichiarare service worker e chiave `localStorage` del
  banner di installazione (da far vedere al legale)
- Informativa privacy: i testi del sito e della prenotazione sono già
  pubblicati e aggiornati con le email di servizio (conferma,
  annullamento, promemoria); sono in revisione da parte di un legale,
  così come la clausola per gli studi clienti e l'atto di nomina a
  Responsabile del trattamento (art. 28) da far firmare a ogni studio
- Possibili estensioni future: autenticazione vera per lo staff dello
  studio, pagamenti Stripe per le visite private, WhatsApp, app mobile nativa,
  videoconsulto (tabella già presente nel database ma non collegata)
