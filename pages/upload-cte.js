import { useState } from 'react';

export default function UploadCTE() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fonteCte, setFonteCte] = useState("");
  const [salvataggioOK, setSalvataggioOK] = useState(null);

  const handleUpload = async () => {
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://backend-offerte-ocr-production.up.railway.app/upload-cte", {
        method: "POST",
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        },
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Errore durante il caricamento." });
    } finally {
      setLoading(false);
    }
  };

  const handleSalva = async () => {
    if (!result?.output_ai) return;

    const payload = {
      ...result.output_ai,
      fonte_cte: fonteCte
    };

    try {
      const res = await fetch("https://backend-offerte-ocr-production.up.railway.app/salva-offerta", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.successo) {
        setSalvataggioOK(true);
      } else {
        setSalvataggioOK(false);
      }
    } catch {
      setSalvataggioOK(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Upload CTE</h1>

      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Invia</button>

      {loading && <p className="mt-4">Caricamento...</p>}

      {result && (
        <div className="mt-6">
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>

          <div className="mt-4">
            <label className="block font-medium mb-1">Fonte CTE (inseriscilo a mano):</label>
            <input
              type="text"
              value={fonteCte}
              onChange={e => setFonteCte(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              placeholder="Es: ARERA gennaio 2024"
            />
          </div>

          <button
            onClick={handleSalva}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Salva in Airtable
          </button>

          {salvataggioOK === true && (
            <p className="mt-2 text-green-700">✅ Offerta salvata con successo</p>
          )}
          {salvataggioOK === false && (
            <p className="mt-2 text-red-700">❌ Errore durante il salvataggio</p>
          )}
        </div>
      )}
    </main>
  );
}
