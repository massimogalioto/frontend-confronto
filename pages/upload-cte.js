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
  <main className="p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">📄 Carica una CTE</h1>

    <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
    <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
      Invia
    </button>

    {loading && <p className="mt-4 text-blue-600">⏳ Caricamento in corso...</p>}

    {result && (
      <div className="mt-6 space-y-6">
        <div className="bg-gray-100 rounded p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">📊 Dati estratti</h2>
          <ul className="space-y-1 text-sm">
            {Object.entries(result.output_ai || {}).map(([key, value]) => (
              <li key={key}>
                <strong>{key.replaceAll("_", " ")}:</strong> {String(value || "—")}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block font-medium mb-1">📝 Fonte CTE (inserita a mano)</label>
          <input
            type="text"
            value={fonteCte}
            onChange={e => setFonteCte(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Es: ARERA aprile 2025"
          />
        </div>

        <button
          onClick={handleSalva}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Salva in Airtable
        </button>

        {salvataggioOK === true && (
          <div className="text-green-700 mt-2">✅ Offerta salvata con successo!</div>
        )}
        {salvataggioOK === false && (
          <div className="text-red-700 mt-2">❌ Errore durante il salvataggio.</div>
        )}
      </div>
    )}
  </main>
);
}
