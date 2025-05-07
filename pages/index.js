
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadText = async () => {
    setLoading(true);
    const res = await fetch('/api/load?ts=timestamp');
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

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Ruang Teks</h1>
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <>
          <textarea
            rows="10"
            cols="60"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ display: 'block', marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={saveText}>Simpan</button>
            <button onClick={loadText}>Load</button>
          </div>
        </>
      )}
    </div>
  );
}
