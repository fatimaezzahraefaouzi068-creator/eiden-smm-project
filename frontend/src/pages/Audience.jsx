import { useState, useEffect } from 'react';
import api from '../api';

const Audience = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/accounts');
        setAccounts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Audience</h1>
      <p className="text-forest/45 italic mb-6">Comptes sociaux</p>
      <div className="grid grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-5 border">
            <div className="font-bold">{acc.account_name}</div>
            <div className="text-forest/60">{acc.platform}</div>
            <div>Followers: {acc.followers?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Audience;