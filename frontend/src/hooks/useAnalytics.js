import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const useAnalytics = () => {
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics').then(res => res.data),
  });

  return {
    totalFollowers: analytics?.total_followers || 0,
    totalPosts: analytics?.total_posts || 0,
    avgEngagement: analytics?.avg_engagement || 0,
    currentMetrics: analytics?.current_metrics || {},
    followerGrowthData: analytics?.follower_growth || [],
    isLoading,
    refetch,
  };
};