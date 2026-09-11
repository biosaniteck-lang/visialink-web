import { useEffect, useState } from 'react';
import { api } from '../api.js';

const API_URL_BASE = import.meta.env.VITE_API_URL || 'https://visialink-backend.onrender.com';

function BottoneBackup({ adminKey }) {
  const [scaricamento, setScaricamento] = useState(false);
  const [errore, setErrore] = useState(null);

  const scaricaBackup = async () => {
    setScaricamento(true);
    setErrore(null);
    try {
      const res = await fetch(`${API_URL_BASE}/api/backup`, {
        headers: { 'x-admin-key': adminKey },
      });

      if (!res.ok) {
        const dati = await res.json().catch(() => null);
        throw new Error(dati?.message || `Errore ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const data = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `visialink-backup-${data}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setScaricamento(false);
    }
  };

  return (
    <div className="summary-card" style={{ borderLeftColor: 'var(--brass)' }}>
      <p style={{ fontWeight: 600, marginBottom: 8 }}>Backup dei dati</p>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>
        Scarica una copia completa di tutti i dati (studi, medici, pazienti,
        prenotazioni) in un file JSON, da conservare in un posto sicuro.
      </p>
      {errore && <div className="error-box">{errore}</div>}
      <button className="submit-btn" onClick={scaricaBackup} disabled={scaricamento}>
        {scaricamento ? 'Preparazione in corso…' : 'Scarica backup completo'}
      </button>
    </div>
  );
}

function FormModificaStudio({ adminKey, sede, onAggiornata }) {
  const [nome, setNome] = useState(sede.nome);
  const [telefono, setTelefono] = useState(sede.telefono || '');
  const [indirizzo, setIndirizzo] = useState(sede.indirizzo || '');
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState(null);
  const [salvato, setSalvato] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);
    setSalvato(false);

    if (!nome.trim()) {
      setErrore('Il nome dello studio è obbligatorio.');
      return;
    }

    setInvio(true);
    try {
      const sedeAggiornata = await api.aggiornaSede(
        sede.id,
        {
          nome: nome.trim(),
          telefono: telefono.trim() || null,
          indirizzo: indirizzo.trim() || null,
        },
        adminKey
      );
      onAggiornata(sedeAggiornata);
      setSalvato(true);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  };

  return (
    <div className="summary-card">
      <p style={{ fontWeight: 600, marginBottom: 16 }}>Modifica dati studio</p>

      {errore && <div className="error-box">{errore}</div>}
      {salvato && <p style={{ color: 'var(--sage)', marginBottom: 16 }}>Modifiche salvate.</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="nome-studio-edit">Nome dello studio</label>
          <input id="nome-studio-edit" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="form-field">
          <label htmlFor="telefono-studio-edit">Telefono</label>
          <input
            id="telefono-studio-edit"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="indirizzo-studio-edit">Indirizzo</label>
          <input
            id="indirizzo-studio-edit"
            value={indirizzo}
            onChange={(e) => setIndirizzo(e.target.value)}
          />
        </div>

        <button className="submit-btn" type="submit" disabled={invio}>
          {invio ? 'Salvataggio…' : 'Salva modifiche'}
        </button>
      </form>
    </div>
  );
}

const GIORNI_SETTIMANA = [
  { valore: 1, nome: 'Lunedì' },
  { valore: 2, nome: 'Martedì' },
  { valore: 3, nome: 'Mercoledì' },
  { valore: 4, nome: 'Giovedì' },
  { valore: 5, nome: 'Venerdì' },
  { valore: 6, nome: 'Sabato' },
  { valore: 0, nome: 'Domenica' },
];

function RigaGiornoOrario({ giorno, valore, onCambia }) {
  const attivo = !!valore;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid var(--porcelain-line)',
        flexWrap: 'wrap',
      }}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110, fontSize: 14 }}>
        <input
          type="checkbox"
          checked={attivo}
          onChange={(e) =>
            onCambia(e.target.checked ? { ora_inizio: '09:00', ora_fine: '13:00' } : null)
          }
        />
        {giorno.nome}
      </label>

      {attivo && (
        <>
          <input
            type="time"
            value={valore.ora_inizio}
            onChange={(e) => onCambia({ ...valore, ora_inizio: e.target.value })}
            style={{
              width: 110,
              flexShrink: 0,
              padding: '6px 8px',
              border: '1px solid var(--porcelain-line)',
              borderRadius: 3,
              fontSize: 14,
            }}
          />
          <span style={{ color: 'var(--ink-soft)' }}>–</span>
          <input
            type="time"
            value={valore.ora_fine}
            onChange={(e) => onCambia({ ...valore, ora_fine: e.target.value })}
            style={{
              width: 110,
              flexShrink: 0,
              padding: '6px 8px',
              border: '1px solid var(--porcelain-line)',
              borderRadius: 3,
              fontSize: 14,
            }}
          />
        </>
      )}
    </div>
  );
}

function FormGeneraSlot({ adminKey, medicoId, onGenerati }) {
  const [data, setData] = useState('');
  const [dataFine, setDataFine] = useState('');
  const [durata, setDurata] = useState(30);
  const [orariPerGiorno, setOrariPerGiorno] = useState({
    1: { ora_inizio: '09:00', ora_fine: '13:00' },
    2: { ora_inizio: '09:00', ora_fine: '13:00' },
    3: { ora_inizio: '09:00', ora_fine: '13:00' },
    4: { ora_inizio: '09:00', ora_fine: '13:00' },
    5: { ora_inizio: '09:00', ora_fine: '13:00' },
    6: null,
    0: null,
  });
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState(null);
  const [esito, setEsito] = useState(null);

  const cambiaGiorno = (valore, nuovoOrario) => {
    setOrariPerGiorno((prev) => ({ ...prev, [valore]: nuovoOrario }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);
    setEsito(null);

    if (!data) {
      setErrore('Seleziona almeno una data di inizio.');
      return;
    }

    const almeUnGiornoAttivo = Object.values(orariPerGiorno).some(Boolean);
    if (!almeUnGiornoAttivo) {
      setErrore('Attiva almeno un giorno della settimana.');
      return;
    }

    setInvio(true);
    try {
      const risultato = await api.generaSlotBulk(
        {
          medico_id: medicoId,
          data,
          data_fine: dataFine || undefined,
          durata_minuti: Number(durata) || 30,
          orari_per_giorno: orariPerGiorno,
        },
        adminKey
      );
      setEsito(`${risultato.slot_creati} slot creati su ${risultato.giorni_generati} giorno/i.`);
      onGenerati?.();
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      {errore && <div className="error-box">{errore}</div>}
      {esito && <p style={{ color: 'var(--sage)', marginBottom: 12 }}>{esito}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        <div className="form-field" style={{ flex: 1 }}>
          <label>Dal</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="form-field" style={{ flex: 1 }}>
          <label>Al (facoltativo, per ripetere su più settimane)</label>
          <input type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)} />
        </div>
      </div>

      <div className="form-field">
        <label>Orario per ogni giorno della settimana</label>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: -4, marginBottom: 8 }}>
          Spunta i giorni in cui il medico riceve e imposta l'orario di ciascuno.
        </p>
        {GIORNI_SETTIMANA.map((g) => (
          <RigaGiornoOrario
            key={g.valore}
            giorno={g}
            valore={orariPerGiorno[g.valore]}
            onCambia={(nuovoOrario) => cambiaGiorno(g.valore, nuovoOrario)}
          />
        ))}
      </div>

      <div className="form-field" style={{ maxWidth: 220 }}>
        <label>Durata di ogni visita (minuti)</label>
        <input type="number" value={durata} onChange={(e) => setDurata(e.target.value)} />
      </div>

      <button className="submit-btn" type="submit" disabled={invio}>
        {invio ? 'Generazione…' : 'Genera slot'}
      </button>
    </form>
  );
}

function RigaMedico({ adminKey, medico, onAggiornato, onEliminato }) {
  const [modifica, setModifica] = useState(false);
  const [mostraSlot, setMostraSlot] = useState(false);
  const [nome, setNome] = useState(medico.nome);
  const [specialita, setSpecialita] = useState(medico.specialita || '');
  const [durata, setDurata] = useState(medico.durata_visita_default);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState(null);

  const handleSalva = async () => {
    setErrore(null);
    setInvio(true);
    try {
      const medicoAggiornato = await api.aggiornaMedico(
        medico.id,
        {
          nome: nome.trim(),
          specialita: specialita.trim() || null,
          durata_visita_default: Number(durata) || 30,
        },
        adminKey
      );
      onAggiornato(medicoAggiornato);
      setModifica(false);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  };

  const handleElimina = async () => {
    if (!window.confirm(`Eliminare ${medico.nome}? L'azione non è reversibile.`)) return;

    setErrore(null);
    setInvio(true);
    try {
      await api.eliminaMedico(medico.id, adminKey);
      onEliminato(medico.id);
    } catch (err) {
      setErrore(err.message);
      setInvio(false);
    }
  };

  if (!modifica) {
    return (
      <div style={{ borderBottom: '1px solid var(--porcelain-line)' }}>
        <div className="ledger-row" style={{ flexWrap: 'wrap', border: 'none' }}>
          <div className="ledger-main">
            <span className="ledger-name">{medico.nome}</span>
            {medico.specialita && <span className="ledger-meta">{medico.specialita}</span>}
            {errore && <span style={{ color: 'var(--rust)', fontSize: 13 }}>{errore}</span>}
          </div>
          <span className="ledger-meta">{medico.durata_visita_default} min</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="ledger-action" onClick={() => setMostraSlot((v) => !v)} disabled={invio}>
              {mostraSlot ? 'Chiudi' : 'Genera slot'}
            </button>
            <button className="ledger-action" onClick={() => setModifica(true)} disabled={invio}>
              Modifica
            </button>
            <button
              className="ledger-action"
              style={{ borderColor: 'var(--rust)', color: 'var(--rust)' }}
              onClick={handleElimina}
              disabled={invio}
            >
              Elimina
            </button>
          </div>
        </div>
        {mostraSlot && (
          <div style={{ padding: '0 0 20px' }}>
            <FormGeneraSlot adminKey={adminKey} medicoId={medico.id} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ledger-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      {errore && <div className="error-box">{errore}</div>}
      <div className="form-field">
        <label>Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Specialità</label>
        <input value={specialita} onChange={(e) => setSpecialita(e.target.value)} />
      </div>
      <div className="form-field">
        <label>Durata visita (minuti)</label>
        <input type="number" value={durata} onChange={(e) => setDurata(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="submit-btn" onClick={handleSalva} disabled={invio}>
          {invio ? 'Salvataggio…' : 'Salva'}
        </button>
        <button className="back-link" onClick={() => setModifica(false)}>
          Annulla
        </button>
      </div>
    </div>
  );
}

const CHIAVE_SESSIONE = 'visialink_admin_key';

function SchermataAccesso({ onAccesso }) {
  const [chiave, setChiave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chiave.trim()) {
      onAccesso(chiave.trim());
    }
  };

  return (
    <div className="container section" style={{ maxWidth: 420 }}>
      <h2>Accesso amministratore</h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
        Inserisci la chiave amministratore per gestire studi e medici.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="chiave">Chiave amministratore</label>
          <input
            id="chiave"
            type="password"
            value={chiave}
            onChange={(e) => setChiave(e.target.value)}
            autoFocus
          />
        </div>
        <button className="submit-btn" type="submit">
          Accedi
        </button>
      </form>
    </div>
  );
}

function FormNuovoStudio({ adminKey, onCreato }) {
  const [nome, setNome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [slug, setSlug] = useState('');
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState(null);

  const generaSlug = (testo) =>
    testo
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleNomeChange = (valore) => {
    setNome(valore);
    setSlug(generaSlug(valore));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);

    if (!nome.trim() || !slug.trim()) {
      setErrore('Nome e slug sono obbligatori.');
      return;
    }

    setInvio(true);
    try {
      const sede = await api.creaSede(
        {
          nome: nome.trim(),
          telefono: telefono.trim() || null,
          indirizzo: indirizzo.trim() || null,
          slug: slug.trim(),
        },
        adminKey
      );
      setNome('');
      setTelefono('');
      setIndirizzo('');
      setSlug('');
      onCreato(sede);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  };

  return (
    <div className="summary-card" style={{ borderLeftColor: 'var(--sage)' }}>
      <p style={{ fontWeight: 600, marginBottom: 16 }}>Registra un nuovo studio</p>

      {errore && <div className="error-box">{errore}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="nome-studio">Nome dello studio</label>
          <input
            id="nome-studio"
            value={nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            placeholder="Studio Medico Dott. Rossi"
          />
        </div>

        <div className="form-field">
          <label htmlFor="slug-studio">Indirizzo del link (generato automaticamente)</label>
          <input id="slug-studio" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>

        <div className="form-field">
          <label htmlFor="telefono-studio">Telefono</label>
          <input
            id="telefono-studio"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+39 02 1234567"
          />
        </div>

        <div className="form-field">
          <label htmlFor="indirizzo-studio">Indirizzo (facoltativo)</label>
          <input id="indirizzo-studio" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} />
        </div>

        <button className="submit-btn" type="submit" disabled={invio}>
          {invio ? 'Creazione in corso…' : 'Crea studio'}
        </button>
      </form>
    </div>
  );
}

function FormNuovoMedico({ adminKey, sede, onCreato }) {
  const [nome, setNome] = useState('');
  const [specialita, setSpecialita] = useState('');
  const [durata, setDurata] = useState(30);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);

    if (!nome.trim()) {
      setErrore('Il nome del medico è obbligatorio.');
      return;
    }

    setInvio(true);
    try {
      const medico = await api.creaMedico(
        {
          nome: nome.trim(),
          specialita: specialita.trim() || null,
          durata_visita_default: Number(durata) || 30,
          sede_id: sede.id,
        },
        adminKey
      );
      setNome('');
      setSpecialita('');
      setDurata(30);
      onCreato(medico);
    } catch (err) {
      setErrore(err.message);
    } finally {
      setInvio(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      {errore && <div className="error-box">{errore}</div>}

      <div className="form-field">
        <label htmlFor="nome-medico">Nome del medico</label>
        <input
          id="nome-medico"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Dott. Mario Rossi"
        />
      </div>

      <div className="form-field">
        <label htmlFor="specialita-medico">Specialità</label>
        <input
          id="specialita-medico"
          value={specialita}
          onChange={(e) => setSpecialita(e.target.value)}
          placeholder="Cardiologia"
        />
      </div>

      <div className="form-field">
        <label htmlFor="durata-medico">Durata visita (minuti)</label>
        <input
          id="durata-medico"
          type="number"
          value={durata}
          onChange={(e) => setDurata(e.target.value)}
        />
      </div>

      <button className="submit-btn" type="submit" disabled={invio}>
        {invio ? 'Aggiunta in corso…' : 'Aggiungi medico'}
      </button>
    </form>
  );
}

function ElencoPrenotazioni({ adminKey, sedeId }) {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  const carica = () => {
    setCaricamento(true);
    api
      .listaPrenotazioni(sedeId, adminKey)
      .then(setPrenotazioni)
      .catch((err) => setErrore(err.message))
      .finally(() => setCaricamento(false));
  };

  useEffect(carica, [sedeId]);

  const annulla = async (id) => {
    if (!window.confirm('Annullare questa prenotazione?')) return;
    try {
      await api.cancellaPrenotazione(id);
      carica();
    } catch (err) {
      setErrore(err.message);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: 22, marginTop: 40 }}>Prenotazioni</h2>

      {errore && <div className="error-box">{errore}</div>}
      {caricamento && <p className="ledger-empty">Caricamento…</p>}
      {!caricamento && prenotazioni.length === 0 && !errore && (
        <p className="ledger-empty">Nessuna prenotazione ancora per questo studio.</p>
      )}

      <div className="ledger">
        {prenotazioni.map((p) => {
          const slot = p.slot_disponibilita;
          const medico = slot?.medici;
          const paziente = p.pazienti;
          return (
            <div className="ledger-row" key={p.id} style={{ flexWrap: 'wrap' }}>
              <div className="ledger-main">
                <span className="ledger-name">
                  {paziente?.nome} {paziente?.cognome}
                </span>
                <span className="ledger-meta">
                  {medico?.nome} — {slot?.data} {slot?.ora_inizio?.slice(0, 5)}
                </span>
                <span className="ledger-meta">
                  {p.tipo === 'privata' ? 'Privata' : 'SSN'} · {p.codice_breve}
                </span>
              </div>
              <span className="ledger-meta">
                {p.stato === 'confermata' ? 'Confermata' : p.stato === 'cancellata' ? 'Annullata' : p.stato}
              </span>
              {p.stato === 'confermata' && (
                <button
                  className="ledger-action"
                  style={{ borderColor: 'var(--rust)', color: 'var(--rust)' }}
                  onClick={() => annulla(p.id)}
                >
                  Annulla
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function DettaglioStudio({ adminKey, sede, onIndietro, onSedeAggiornata }) {
  const [medici, setMedici] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  const caricaMedici = () => {
    setCaricamento(true);
    api
      .getMedici(sede.id)
      .then(setMedici)
      .finally(() => setCaricamento(false));
  };

  useEffect(caricaMedici, [sede.id]);

  const aggiornaMedicoInLista = (medicoAggiornato) => {
    setMedici((prev) => prev.map((m) => (m.id === medicoAggiornato.id ? medicoAggiornato : m)));
  };

  const rimuoviMedicoDaLista = (medicoId) => {
    setMedici((prev) => prev.filter((m) => m.id !== medicoId));
  };

  const linkPrenotazione = `${window.location.origin}/?studio=${sede.slug}`;

  return (
    <div className="container section">
      <button className="back-link" onClick={onIndietro}>
        ← Torna all'elenco studi
      </button>
      <h2>{sede.nome}</h2>

      <div className="summary-card">
        <p style={{ fontWeight: 600 }}>Link di prenotazione da consegnare al cliente</p>
        <p style={{ wordBreak: 'break-all' }}>{linkPrenotazione}</p>
      </div>

      <FormModificaStudio adminKey={adminKey} sede={sede} onAggiornata={onSedeAggiornata} />

      <h2 style={{ fontSize: 22, marginTop: 40 }}>Medici dello studio</h2>

      {caricamento && <p className="ledger-empty">Caricamento…</p>}

      {!caricamento && medici.length === 0 && (
        <p className="ledger-empty">Nessun medico ancora registrato per questo studio.</p>
      )}

      <div className="ledger">
        {medici.map((m) => (
          <RigaMedico
            key={m.id}
            adminKey={adminKey}
            medico={m}
            onAggiornato={aggiornaMedicoInLista}
            onEliminato={rimuoviMedicoDaLista}
          />
        ))}
      </div>

      <FormNuovoMedico adminKey={adminKey} sede={sede} onCreato={caricaMedici} />

      <ElencoPrenotazioni adminKey={adminKey} sedeId={sede.id} />
    </div>
  );
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(CHIAVE_SESSIONE));
  const [sedi, setSedi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [sedeSelezionata, setSedeSelezionata] = useState(null);

  const caricaSedi = (chiave) => {
    setCaricamento(true);
    setErrore(null);
    api
      .listaSedi(chiave)
      .then(setSedi)
      .catch((err) => {
        setErrore(err.message);
        if (err.message.toLowerCase().includes('non valida')) {
          sessionStorage.removeItem(CHIAVE_SESSIONE);
          setAdminKey(null);
        }
      })
      .finally(() => setCaricamento(false));
  };

  useEffect(() => {
    if (adminKey) caricaSedi(adminKey);
  }, [adminKey]);

  const handleAccesso = (chiave) => {
    sessionStorage.setItem(CHIAVE_SESSIONE, chiave);
    setAdminKey(chiave);
  };

  const handleEliminaSede = async (sede) => {
    if (!window.confirm(`Eliminare "${sede.nome}"? L'azione non è reversibile.`)) return;

    try {
      await api.eliminaSede(sede.id, adminKey);
      setSedi((prev) => prev.filter((s) => s.id !== sede.id));
    } catch (err) {
      setErrore(err.message);
    }
  };

  if (!adminKey) {
    return <SchermataAccesso onAccesso={handleAccesso} />;
  }

  if (sedeSelezionata) {
    return (
      <DettaglioStudio
        adminKey={adminKey}
        sede={sedeSelezionata}
        onIndietro={() => setSedeSelezionata(null)}
        onSedeAggiornata={(sedeAggiornata) => {
          setSedeSelezionata(sedeAggiornata);
          setSedi((prev) => prev.map((s) => (s.id === sedeAggiornata.id ? sedeAggiornata : s)));
        }}
      />
    );
  }

  return (
    <div className="container section">
      <h2>Pannello studi VisiaLink</h2>

      {errore && <div className="error-box">{errore}</div>}

      <BottoneBackup adminKey={adminKey} />

      <FormNuovoStudio adminKey={adminKey} onCreato={() => caricaSedi(adminKey)} />

      <h2 style={{ fontSize: 22, marginTop: 40 }}>Studi registrati</h2>

      {caricamento && <p className="ledger-empty">Caricamento…</p>}

      {!caricamento && sedi.length === 0 && !errore && (
        <p className="ledger-empty">Nessuno studio registrato ancora.</p>
      )}

      <div className="ledger">
        {sedi.map((s) => (
          <div className="ledger-row" key={s.id}>
            <div className="ledger-main">
              <span className="ledger-name">{s.nome}</span>
              <span className="ledger-meta">/?studio={s.slug}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="ledger-action" onClick={() => setSedeSelezionata(s)}>
                Gestisci
              </button>
              <button
                className="ledger-action"
                style={{ borderColor: 'var(--rust)', color: 'var(--rust)' }}
                onClick={() => handleEliminaSede(s)}
              >
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
        }
