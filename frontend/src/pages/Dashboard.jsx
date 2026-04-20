
    import KPICard from '../components/KPICard';
import FollowerGrowthChart from '../components/FollowerGrowthChart';
import { useAnalytics } from '../hooks/useAnalytics';

const Dashboard = () => {
  const { totalFollowers, totalPosts, avgEngagement, currentMetrics, followerGrowthData, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-head font-black text-forest">Overview</h1>
        <p className="text-forest/45 font-edit italic mt-1 mb-6">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-head font-black text-forest">Overview</h1>
      <p className="text-forest/45 font-edit italic mt-1 mb-6">Live Command Center</p>

      {/* KPIs Cards */}
      <div className="grid grid-cols-5 gap-px bg-forest/5 mb-px">
        <KPICard
          title="TOTAL FOLLOWERS"
          value={totalFollowers.toLocaleString()}
          change={currentMetrics.follower_growth_rate || 0}
          icon="👥"
          color="teal"
        />
        <KPICard
          title="TOTAL POSTS"
          value={totalPosts}
          change={5}
          icon="📝"
          color="gold"
        />
        <KPICard
          title="ENGAGEMENT RATE"
          value={`${avgEngagement}%`}
          change={currentMetrics.engagement_rate || 0}
          icon="❤️"
          color="forest"
        />
        <KPICard
          title="VIRALITY SCORE"
          value={currentMetrics.virality_score || 0}
          change={currentMetrics.virality_score > 30 ? 12 : -5}
          icon="🚀"
          color="teal"
        />
        <KPICard
          title="REACH VELOCITY"
          value={`${currentMetrics.reach_velocity || 0}M`}
          change={12.5}
          icon="📈"
          color="forest"
        />
      </div>

      {/* Graphique */}
      <div className="mt-px">
        <FollowerGrowthChart data={followerGrowthData} loading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;

