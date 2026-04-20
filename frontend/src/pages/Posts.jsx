import { useState, useEffect } from 'react';
import api from '../api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        console.log('Posts reçus:', response.data);
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-head font-black text-forest">MicroView</h1>
        <p className="text-forest/45 font-edit italic mt-1 mb-6">Chargement...</p>
        <div className="bg-white p-12 text-center">⏳ Chargement des posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-head font-black text-forest">MicroView</h1>
        <p className="text-forest/45 font-edit italic mt-1 mb-6">Erreur</p>
        <div className="bg-white p-12 text-center text-red">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-head font-black text-forest">MicroView</h1>
        <p className="text-forest/45 font-edit italic mt-1">Performances détaillées des posts</p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white p-12 text-center text-forest/45 border border-forest/5">
          📝 Aucun post trouvé. Utilise /api/upload pour importer des données.
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-5 border border-forest/5 hover:border-teal/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-beige flex items-center justify-center text-lg">
                  {post.platform === 'instagram' && '📸'}
                  {post.platform === 'tiktok' && '🎵'}
                  {post.platform === 'facebook' && '👍'}
                  {post.platform === 'linkedin' && '💼'}
                  {!post.platform && '📝'}
                </div>
                <div className="flex-1">
                  <p className="text-forest font-body mb-2">{post.content || 'Aucun contenu'}</p>
                  <div className="flex flex-wrap gap-4 text-xs font-label text-forest/45">
                    <span>❤️ {post.likes || 0} likes</span>
                    <span>💬 {post.comments || 0} comments</span>
                    <span>↗️ {post.shares || 0} shares</span>
                    <span>🔖 {post.saves || 0} saves</span>
                    <span>📊 {post.engagement_rate || 0}% ER</span>
                  </div>
                  <div className="text-[10px] font-label text-forest/35 mt-2">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;