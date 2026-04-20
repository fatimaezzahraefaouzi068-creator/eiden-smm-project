
import { useState, useEffect } from 'react';
import api from '../api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get('/alerts');
        setAlerts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Alerts</h1>
      <p className="text-forest/45 italic mb-6">Notifications</p>
      {alerts.map((alert) => (
        <div key={alert.id} className="bg-white p-5 border-l-4 border-teal mb-3">
          <h3 className="font-bold">{alert.title}</h3>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
