import { useState } from 'react';

export default function UploadCTE() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://backend-offerte-ocr-production.up.railway.app/upload-cte?madonie_ufficio=cefalu", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Upload CTE</h1>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">Invia</button>
      {result && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
