import { useState, useEffect } from 'react';
import api from '../api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports');
        setReports(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Publicité</h1>
      <p className="text-forest/45 italic mb-6">Rapports</p>
      {reports.map((report) => (
        <div key={report.id} className="bg-white p-5 border mb-3">
          <h2 className="font-bold">{report.title}</h2>
          <p>Type: {report.report_type}</p>
          {report.data && (
            <div>
              <div>Reach: {report.data.total_reach?.toLocaleString()}</div>
              <div>Engagement: {report.data.total_engagement}%</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reports;