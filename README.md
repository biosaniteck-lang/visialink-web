# VisiaLink Web

Sito pubblico di prenotazione visite mediche + pannello di
amministrazione per **VisiaLink**, piattaforma SaaS multi-tenant:
uno stesso sito serve più studi/cliniche diversi, ciascuno con il
proprio link personalizzato.

- **Questo sito** → deploy su Vercel: `visialink-web.vercel.app`
  (dominio definitivo previsto: `visialink.it`, acquistato su Aruba, non ancora collegato)
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
│       ├── GestisciPrenotazione.jsx    # self-service: cerca per codice, annulla
│       └── Admin.jsx                   # pannello back-office (vedi sotto)
├── index.html
├── package.json
├── vite.config.js
├── vercel.json                   # rewrite SPA per ogni percorso (slug studio, /admin)
└── .gitignore
```

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
  per email, newsletter o messaggi WhatsApp quando quelle funzionalità
  saranno attivate
- scaricare un **backup completo** dei dati in JSON *(solo chiave generale)*

## Deploy su Vercel

1. **vercel.com** → **Add New** → **Project** → seleziona questo repository
2. Vercel riconosce il progetto Vite in automatico (Build: `vite build`, Output: `dist`)
3. **Deploy**

Se il backend cambia indirizzo, si aggiorna la variabile d'ambiente
`VITE_API_URL` nelle impostazioni del progetto Vercel, senza toccare
il codice.

## Collegare il dominio visialink.it (da fare)

1. Nel progetto Vercel → **Settings** → **Domains** → aggiungi `visialink.it`
2. Vercel mostra i record DNS da impostare
3. Inseriscili nel pannello DNS di **Aruba** (dove il dominio è registrato)
4. La propagazione può richiedere da pochi minuti a qualche ora

## Flusso di lavoro adottato in questo progetto

Chi mantiene questo sito lavora principalmente da tablet, dove il
copia-incolla di file lunghi può troncare il contenuto. Per questo,
quando si aggiorna un file: si sostituisce il contenuto **per intero**
(mai con modifiche parziali incollate a mano), verificando prima che
compili (`npm run build`) prima di caricarlo su GitHub.

## Da fare

- Integrazione email di conferma (Resend) — non ancora iniziata
- Collegamento del dominio `visialink.it` (vedi sopra)
- Informativa privacy: bozze già predisposte (sito, prenotazione
  paziente, clausola per lo studio cliente) — da far rivedere a un
  legale prima della pubblicazione definitiva sul sito
- Possibili estensioni future: autenticazione vera per lo staff dello
  studio, pagamenti Stripe per le visite private, app mobile nativa,
  videoconsulto (tabella già presente nel database ma non collegata)
