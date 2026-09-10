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

function RigaMedico({ adminKey, medico, onAggiornato, onEliminato }) {
  const [modifica, setModifica] = useState(false);
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
      <div className="ledger-row" style={{ flexWrap: 'wrap' }}>
        <div className="ledger-main">
          <span className="ledger-name">{medico.nome}</span>
          {medico.specialita && <span className="ledger-meta">{medico.specialita}</span>}
          {errore && <span style={{ color: 'var(--rust)', fontSize: 13 }}>{errore}</span>}
        </div>
        <span className="ledger-meta">{medico.durata_visita_default} min</span>
        <div style={{ display: 'flex', gap: 8 }}>
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
