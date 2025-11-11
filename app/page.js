'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');

  const styles = [
    { value: 'realistic', label: 'Realistis' },
    { value: 'anime', label: 'Anime' },
    { value: 'sketch', label: 'Sketsa Pensil' },
    { value: 'watercolor', label: 'Cat Air' },
    { value: 'oil', label: 'Cat Minyak' },
    { value: 'digital', label: 'Digital Art' },
    { value: 'portrait', label: 'Potret Klasik' },
    { value: 'abstract', label: 'Abstrak Modern' }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Silakan masukkan deskripsi gambar');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    setUploadStatus('');
    setInstagramUrl('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.imageUrl);
        setUploadStatus('Gambar berhasil dibuat!');
      } else {
        setUploadStatus('Error: ' + data.error);
      }
    } catch (error) {
      setUploadStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToInstagram = async () => {
    if (!generatedImage) return;

    setLoading(true);
    setUploadStatus('Mengunggah ke Instagram...');

    try {
      const response = await fetch('/api/upload-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: generatedImage,
          caption: prompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setUploadStatus('✓ Berhasil diunggah ke Instagram!');
        setInstagramUrl(data.postUrl || '');
      } else {
        setUploadStatus('Upload simulasi berhasil (diperlukan akun Instagram API untuk upload nyata)');
      }
    } catch (error) {
      setUploadStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎨 Instagram Art Agent</h1>
        <p style={styles.subtitle}>Pembuat Seni Gambar Manusia Otomatis</p>

        <div style={styles.form}>
          <label style={styles.label}>Deskripsi Gambar Manusia:</label>
          <textarea
            style={styles.textarea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Seorang wanita muda dengan rambut panjang hitam, tersenyum lembut, dengan latar belakang bunga sakura"
            rows={4}
          />

          <label style={styles.label}>Gaya Seni:</label>
          <select
            style={styles.select}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {styles.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <button
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            onClick={generateImage}
            disabled={loading}
          >
            {loading ? '⏳ Membuat...' : '🎨 Buat Gambar'}
          </button>
        </div>

        {generatedImage && (
          <div style={styles.result}>
            <img
              src={generatedImage}
              alt="Generated art"
              style={styles.image}
            />
            <button
              style={{...styles.button, ...styles.uploadButton}}
              onClick={uploadToInstagram}
              disabled={loading}
            >
              {loading ? '⏳ Mengunggah...' : '📤 Upload ke Instagram'}
            </button>
          </div>
        )}

        {uploadStatus && (
          <div style={styles.status}>
            {uploadStatus}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                Lihat di Instagram →
              </a>
            )}
          </div>
        )}

        <div style={styles.info}>
          <h3 style={styles.infoTitle}>ℹ️ Cara Menggunakan:</h3>
          <ol style={styles.list}>
            <li>Masukkan deskripsi gambar manusia yang ingin Anda buat</li>
            <li>Pilih gaya seni yang diinginkan</li>
            <li>Klik "Buat Gambar" untuk menghasilkan karya seni</li>
            <li>Klik "Upload ke Instagram" untuk mengunggah (memerlukan konfigurasi API)</li>
          </ol>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            💡 <strong>Catatan:</strong> Upload ke Instagram memerlukan Instagram Graph API credentials.
            Tambahkan OPENAI_API_KEY dan INSTAGRAM_ACCESS_TOKEN di environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    maxWidth: '800px',
    width: '100%',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px'
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '5px'
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'white'
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  uploadButton: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
    marginTop: '15px'
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px'
  },
  image: {
    maxWidth: '100%',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  status: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f9ff',
    border: '2px solid #0ea5e9',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#0c4a6e'
  },
  link: {
    display: 'block',
    marginTop: '10px',
    color: '#0ea5e9',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  info: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  infoTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px'
  },
  list: {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.8',
    paddingLeft: '20px'
  },
  footer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    border: '1px solid #ffc107'
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
    color: '#856404'
  }
};
