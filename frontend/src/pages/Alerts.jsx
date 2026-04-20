import { useState, useEffect } from 'react';
import api from '../api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/alerts');
        console.log('Alertes reçues:', response.data);
        setAlerts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning': return '⚠️';
      case 'success': return '🚀';
      case 'info': return '📊';
      case 'critical': return '🚨';
      default: return '🔔';
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'warning': return 'border-amber';
      case 'success': return 'border-teal';
      case 'info': return 'border-blue';
      case 'critical': return 'border-red';
      default: return 'border-forest/20';
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-head font-black text-forest">Alerts</h1>
        <p className="text-forest/45 font-edit italic mt-1 mb-6">Chargement des alertes...</p>
        <div className="bg-white p-12 text-center">⏳ Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Alerts &amp; Smart Notifications</h1>
      <p className="text-forest/45 font-edit italic mt-1 mb-6">AI-powered anomaly detection</p>

      {alerts.length === 0 ? (
        <div className="bg-white p-12 text-center text-forest/45 border border-forest/5">
          🔔 Aucune alerte pour le moment
        </div>
      ) : (
        alerts.map((alert) => (
          <div key={alert.id} className={`bg-white p-5 border-l-4 ${getAlertColor(alert.type)} mb-3 shadow-sm`}>
            <div className="flex gap-4">
              <div className="text-2xl">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <h3 className="font-bold text-forest">{alert.title}</h3>
                <p className="text-forest/60 text-sm mt-1">{alert.description}</p>
                <p className="text-xs text-forest/35 mt-2">
                  {new Date(alert.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Alerts;
