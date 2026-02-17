


import { useEffect, useState } from 'react';
import Head from 'next/head';


export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const loadText = async () => {
    setLoading(true);
    const res = await fetch('/api/load?ts=' + Date.now());
    const data = await res.json();
    setText(data.text || '');
    setLoading(false);
  };

  useEffect(() => {
    loadText();
  }, []);

  const saveText = async () => {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (res.ok) {
      alert('Tersimpan!');
    } else {
      alert('Gagal menyimpan.');
    }
  };

  // Styling moved to globals.css for editor-like look

  // Fungsi untuk auto-linkify (deteksi link di view mode)
  function linkify(text) {
    const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
    return text.split('\n').map((line, i) =>
      <div key={i}>
        {line.split(urlRegex).map((part, j) => {
          if (!part) return null;
          if (urlRegex.test(part)) {
            const href = part.startsWith('http') ? part : `https://${part}`;
            return <a key={j} href={href} target="_blank" rel="noopener noreferrer" style={{color:'#4fc3f7',textDecoration:'underline'}}>{part}</a>;
          }
          return <span key={j}>{part}</span>;
        })}
      </div>
    );
  }

  const handleEditClick = () => {
    setShowPinModal(true);
    setPinInput('');
    setPinError('');
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '357101') {
      setEditMode(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('PIN salah. Coba lagi.');
    }
  };

  return (
    <>
      <Head>
        <title>Ruang Teks Editor</title>
      </Head>
      <div className="editor-app">
        <div className="editor-toolbar">
          <span className="editor-title">Ruang Teks <span className="editor-dot">●</span></span>
          <div className="editor-actions">
            {editMode ? (
              <>
                <button className="editor-btn primary" onClick={saveText}>Simpan</button>
                <button className="editor-btn" onClick={loadText} disabled={loading}>
                  {loading ? 'Memuat...' : 'Load'}
                </button>
                <button className="editor-btn" onClick={() => setEditMode(false)} style={{marginLeft:'0.5rem'}}>View</button>
              </>
            ) : (
              <button className="editor-btn primary" onClick={handleEditClick}>Edit</button>
            )}
          </div>
        </div>
        <div className="editor-main">
          {loading ? (
            <div className="editor-loading">Memuat...</div>
          ) : (
            editMode ? (
              <textarea
                className="editor-textarea"
                rows="18"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis sesuatu di sini..."
                spellCheck={false}
              />
            ) : (
              <div className="editor-viewmode" style={{
                width: '100%',
                height: '100%',
                background: '#23272e',
                color: '#d4d4d4',
                fontFamily: 'inherit',
                fontSize: '1.1rem',
                padding: '1.2rem 1rem 1.2rem 2rem',
                borderRadius: 0,
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: 300
              }}>
                {linkify(text)}
              </div>
            )
          )}
        </div>
        <footer className="editor-footer">
          Dibuat oleh <strong>fajarnadril</strong> dengan 🤖
        </footer>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#23272e',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            minWidth: '300px',
            maxWidth: '90vw',
          }}>
            <h3 style={{margin:'0 0 1rem 0', color:'#61dafb', fontWeight:600}}>Masukkan PIN</h3>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  fontSize: '1.1rem',
                  borderRadius: '4px',
                  border: '1px solid #333',
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  marginBottom: '0.5rem',
                  boxSizing: 'border-box',
                }}
              />
              {pinError && <div style={{color:'#ff6b6b', marginBottom:'0.5rem', fontSize:'0.9rem'}}>{pinError}</div>}
              <div style={{display:'flex', justifyContent:'flex-end', gap:'0.5rem'}}>
                <button type="button" className="editor-btn" onClick={() => setShowPinModal(false)}>Batal</button>
                <button type="submit" className="editor-btn primary">OK</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
