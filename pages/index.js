

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Head>
        <title>Ruang Teks Editor</title>
      </Head>
      <div className="editor-app">
        <div className="editor-toolbar">
          <span className="editor-title">Ruang Teks <span className="editor-dot">●</span></span>
          <div className="editor-actions">
            <button className="editor-btn primary" onClick={saveText}>Simpan</button>
            <button className="editor-btn" onClick={loadText} disabled={loading}>
              {loading ? 'Memuat...' : 'Load'}
            </button>
          </div>
        </div>
        <div className="editor-main">
          {loading ? (
            <div className="editor-loading">Memuat...</div>
          ) : (
            <textarea
              className="editor-textarea"
              rows="18"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis sesuatu di sini..."
              spellCheck={false}
            />
          )}
        </div>
        <footer className="editor-footer">
          Dibuat oleh <strong>fajarnadril</strong> dengan 🤖
        </footer>
      </div>
    </>
  );
}
