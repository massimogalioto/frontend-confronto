import { useState } from 'react';

export default function UploadBolletta() {
  const [file, setFile] = useState(null);
  const [risultato, setRisultato] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setErrore(null);
    setRisultato(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://backend-offerte-ocr-production.up.railway.app/upload-bolletta", {
        method: "POST",
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        },
        body: formData,
      });

      
      const data = await res.json();

      if (res.ok) {
        setRisultato(data);
      } else {
        setErrore(data.detail || "Errore sconosciuto.");
      }
    } catch (e) {
      setErrore("Errore di rete o server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📄 Confronta la tua bolletta</h1>
      <p className="text-sm text-gray-600">Carica la tua bolletta in PDF e ti mostreremo se puoi risparmiare.</p>

      <input
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Invia
      </button>

      {loading && <p className="text-blue-600">⏳ Analisi in corso...</p>}
      {errore && <p className="text-red-600">❌ {errore}</p>}

      {risultato && (
        <div className="bg-gray-100 p-4 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">📊 Risultato del confronto</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="font-medium pr-2">Prezzo attuale pagato:</td><td>{risultato.prezzo_attuale_pagato ?? "—"} €/kWh</td></tr>
              <tr><td className="font-medium pr-2">Prezzo kWh offerta:</td><td>{risultato.prezzo_kwh ?? "—"} €/kWh</td></tr>
              <tr><td className="font-medium pr-2">Costo fisso mensile:</td><td>{risultato.costo_fisso ?? "—"} €</td></tr>
              <tr><td className="font-medium pr-2">Totale stimato mensile:</td><td>{risultato.totale_simulato ?? "—"} €</td></tr>
              <tr><td className="font-medium pr-2">Differenza mensile:</td><td>{risultato?.differenza?.valore ?? "—"} € ({risultato?.differenza?.percentuale ?? "—"}%)</td></tr>
              <tr><td className="font-medium pr-2">Tipo risparmio:</td><td>{risultato?.differenza?.tipo ?? "—"}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
