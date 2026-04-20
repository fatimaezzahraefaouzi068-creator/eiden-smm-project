import { useState, useEffect } from 'react';
import api from '../api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        console.log('Rapports reçus:', response.data);
        setReports(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-head font-black text-forest">Publicité</h1>
        <p className="text-forest/45 font-edit italic mt-1 mb-6">Chargement des rapports...</p>
        <div className="bg-white p-12 text-center">⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Publicité</h1>
      <p className="text-forest/45 font-edit italic mt-1 mb-6">Performances des campagnes</p>

      {reports.length === 0 ? (
        <div className="bg-white p-12 text-center text-forest/45 border border-forest/5">
          📢 Aucun rapport disponible
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="bg-white p-6 border border-forest/5 mb-4 hover:border-teal/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-head font-bold text-forest">{report.title}</h2>
                <p className="text-forest/45 text-sm mt-1">Type: {report.report_type}</p>
              </div>
              <span className="text-xs text-teal bg-teal/10 px-3 py-1 rounded-full">
                {new Date(report.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {report.data && (
              <div className="mt-4 pt-4 border-t border-forest/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] font-label text-forest/35">REACH TOTAL</div>
                    <div className="text-lg font-head font-bold text-forest">
                      {report.data.total_reach?.toLocaleString() || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-label text-forest/35">ENGAGEMENT</div>
                    <div className="text-lg font-head font-bold text-forest">
                      {report.data.total_engagement?.toLocaleString() || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-label text-forest/35">TAUX ENGAGEMENT</div>
                    <div className="text-lg font-head font-bold text-teal">
                      {report.data.avg_engagement_rate || 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-label text-forest/35">TOP PLATEFORME</div>
                    <div className="text-lg font-head font-bold text-gold-dk">
                      {report.data.top_platform || '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Reports;