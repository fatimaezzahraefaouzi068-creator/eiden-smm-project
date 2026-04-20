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

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-head font-black text-forest">Audience</h1>
        <p className="text-forest/45 font-edit italic mt-1 mb-6">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Audience</h1>
      <p className="text-forest/45 font-edit italic mt-1 mb-6">Comptes sociaux connectés</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white p-6 border border-forest/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-beige flex items-center justify-center text-2xl">
                {account.platform === 'instagram' && '📸'}
                {account.platform === 'tiktok' && '🎵'}
                {account.platform === 'facebook' && '👍'}
                {account.platform === 'linkedin' && '💼'}
              </div>
              <div>
                <h2 className="text-xl font-head font-bold text-forest">{account.account_name}</h2>
                <p className="text-forest/45 font-label">{account.platform}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-forest/5 flex justify-between">
              <div>
                <div className="text-[10px] font-label text-forest/35">FOLLOWERS</div>
                <div className="text-xl font-head font-bold text-forest">{account.followers?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-label text-forest/35">CRÉÉ LE</div>
                <div className="text-sm font-body text-forest">{new Date(account.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Audience;