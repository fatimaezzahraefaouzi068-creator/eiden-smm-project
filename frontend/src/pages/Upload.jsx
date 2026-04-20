import { useState } from 'react';
import api from '../api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
    setStatus(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    setUploading(true);
    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload-async', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newJobId = response.data.job_id;
      setJobId(newJobId);
      setStatus('processing');
      setUploading(false);

      // Polling pour vérifier le statut
      const interval = setInterval(async () => {
        try {
          const res = await api.get(`/jobs/${newJobId}`);
          
          if (res.data.status === 'completed') {
            setResult(res.data.result);
            setStatus('completed');
            clearInterval(interval);
          } else if (res.data.status === 'failed') {
            setError(res.data.error || 'Le traitement a échoué');
            setStatus('failed');
            clearInterval(interval);
          } else if (res.data.status === 'pending') {
            setStatus('pending');
          } else if (res.data.status === 'running') {
            setStatus('running');
          }
        } catch (err) {
          console.error('Erreur polling:', err);
        }
      }, 2000);

    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de l\'upload');
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Import CSV</h1>
      <p className="text-forest/45 font-edit italic mt-1 mb-6">
        Importez vos données sociales depuis un fichier CSV
      </p>

      <div className="bg-white p-8 border border-forest/5">
        {/* Zone d'upload */}
        <div className="border-2 border-dashed border-forest/20 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-forest/60 mb-4">
            Glissez votre fichier CSV ici ou cliquez pour sélectionner
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="inline-block bg-teal text-white px-6 py-2 rounded-full cursor-pointer hover:bg-teal-lt transition-colors"
          >
            Choisir un fichier
          </label>
          {file && (
            <div className="mt-4 text-sm text-teal">
              📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        {/* Bouton upload */}
        {file && (
          <div className="mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-forest text-white px-8 py-3 rounded-full font-label tracking-wide hover:bg-teal transition-colors disabled:opacity-50"
            >
              {uploading ? 'Upload en cours...' : 'Analyser le CSV'}
            </button>
          </div>
        )}

        {/* Statut */}
        {status && (
          <div className="mt-6 p-4 rounded-lg bg-beige">
            <div className="flex items-center gap-3">
              {status === 'pending' && <span>⏳ En attente...</span>}
              {status === 'running' && <span>🔄 Traitement en cours...</span>}
              {status === 'processing' && <span>📊 Analyse des données...</span>}
              {status === 'completed' && <span>✅ Analyse terminée !</span>}
              {status === 'failed' && <span>❌ Échec du traitement</span>}
            </div>
            {jobId && (
              <div className="text-xs text-forest/45 mt-2">
                Job ID: {jobId}
              </div>
            )}
          </div>
        )}

        {/* Résultats */}
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-head font-bold text-forest mb-4">Résultats de l'analyse</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-beige p-4">
                <div className="text-[10px] font-label text-forest/45">TOTAL POSTS</div>
                <div className="text-2xl font-head font-bold text-forest">{result.total_posts}</div>
              </div>
              <div className="bg-beige p-4">
                <div className="text-[10px] font-label text-forest/45">ENGAGEMENT MOYEN</div>
                <div className="text-2xl font-head font-bold text-teal">{result.avg_engagement_rate}%</div>
              </div>
            </div>

            {result.top_post && (
              <div className="mt-4 bg-beige p-4">
                <div className="text-[10px] font-label text-forest/45">TOP POST</div>
                <div className="text-sm text-forest mt-1">{result.top_post.content}</div>
                <div className="text-xs text-teal mt-2">Engagement: {result.top_post.engagement_rate}%</div>
              </div>
            )}

            {result.date_range && (
              <div className="mt-4 text-xs text-forest/45 text-center">
                Période: {result.date_range.start} → {result.date_range.end}
              </div>
            )}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-6 p-4 bg-red/10 border-l-4 border-red text-red text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;