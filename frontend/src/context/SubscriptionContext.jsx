import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { useSocket } from './SocketContext';
import { toast } from 'react-hot-toast';

const SubscriptionContext = createContext(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const socket = useSocket(); // This might be null initially, which is fine
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/subscription/current');
      if (response.data.success) {
        setSubscription(response.data.subscription);
      } else {
        // Default to free plan
        setSubscription({
          planType: 'free',
          planName: 'Free Plan',
          status: 'active',
          features: {
            fullAccess: false,
            parentDashboard: false,
            advancedAnalytics: false,
            certificates: false,
            wiseClubAccess: false,
            inavoraAccess: false,
            gamesPerPillar: 5,
            totalGames: 50,
          },
          isFirstYear: true,
          amount: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Default to free plan on error
      setSubscription({
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: {
          fullAccess: false,
          parentDashboard: false,
          advancedAnalytics: false,
          certificates: false,
          wiseClubAccess: false,
          inavoraAccess: false,
          gamesPerPillar: 5,
          totalGames: 50,
        },
        isFirstYear: true,
        amount: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Listen for real-time subscription updates
  useEffect(() => {
    if (!socket?.socket || !user) return;

    const handleSubscriptionActivated = (data) => {
      if (data && data.subscription) {
        setSubscription(data.subscription);
        toast.success('Subscription updated!', { icon: '🎉' });
        fetchSubscription(); // Refresh from API to get latest data
      }
    };

    const handleSubscriptionCancelled = (data) => {
      if (data && data.subscription) {
        setSubscription(data.subscription);
        toast.info('Subscription cancelled');
        fetchSubscription(); // Refresh from API to get latest data
      }
    };

    const handleStudentSubscriptionUpdated = (data) => {
      if (data && data.subscription) {
        const reason = data.reason || 'updated';
        setSubscription(data.subscription);
        fetchSubscription(); // Refresh from API to get latest data
        
        // Show appropriate message
        if (reason === 'school_subscription_renewed') {
          toast.success('Your school has renewed its plan! Premium access restored.', { 
            icon: '🎉',
            duration: 4000 
          });
        } else if (reason === 'school_subscription_expired') {
          toast.warning('Your school\'s plan has expired. You now have freemium access.', { 
            icon: '⚠️',
            duration: 5000 
          });
        } else {
          toast.success('Subscription updated!', { icon: '🎉' });
        }
      }
    };

    socket.socket.on('subscription:activated', handleSubscriptionActivated);
    socket.socket.on('subscription:cancelled', handleSubscriptionCancelled);
    socket.socket.on('student:subscription:updated', handleStudentSubscriptionUpdated);

    return () => {
      socket.socket.off('subscription:activated', handleSubscriptionActivated);
      socket.socket.off('subscription:cancelled', handleSubscriptionCancelled);
      socket.socket.off('student:subscription:updated', handleStudentSubscriptionUpdated);
    };
  }, [socket, user, fetchSubscription]);

  // Feature check functions - memoized to prevent unnecessary re-renders
  const hasFeature = useCallback((featureName) => {
    if (!subscription || !subscription.features) return false;
    
    const features = subscription.features;
    
    switch (featureName) {
      case 'fullAccess':
        return features.fullAccess === true;
      case 'inavoraAccess':
      case 'inavora':
        return features.inavoraAccess === true;
      case 'wiseClubAccess':
      case 'wiseClub':
        return features.wiseClubAccess === true;
      case 'certificates':
        return features.certificates === true;
      case 'advancedAnalytics':
        return features.advancedAnalytics === true;
      case 'parentDashboard':
        return features.parentDashboard === true;
      default:
        return features[featureName] === true;
    }
  }, [subscription]);

  const canAccessGame = useCallback((pillarName, gamesCompletedCount, gameIndex = undefined) => {
    if (!subscription || !subscription.features) {
      return { allowed: false, reason: 'Subscription not loaded' };
    }

    const features = subscription.features;

    // Premium users have unlimited access
    if (features.fullAccess === true) {
      return {
        allowed: true,
        gamesPlayed: 0,
        gamesAllowed: -1, // Unlimited
        mode: 'full',
      };
    }

    // Freemium users: ONLY have access to first N games per pillar (locked after that)
    const gamesPerPillar = features.gamesPerPillar || 5;
    
    // If gameIndex is provided, check if this specific game is within the limit
    if (gameIndex !== undefined) {
      // Game is locked if index is beyond the allowed limit
      if (gameIndex >= gamesPerPillar) {
        return {
          allowed: false,
          reason: `Upgrade to premium to access more than ${gamesPerPillar} games per pillar.`,
          gamesPlayed: gamesCompletedCount || 0,
          gamesAllowed: gamesPerPillar,
          mode: 'preview',
        };
      }
      // Game is within limit, allow access
      return {
        allowed: true,
        gamesPlayed: gamesCompletedCount || 0,
        gamesAllowed: gamesPerPillar,
        mode: 'preview',
      };
    }

    // If gameIndex is not provided, return general access info
    // (for backward compatibility, but individual games should pass gameIndex)
    return {
      allowed: true, // Individual game access must be checked with gameIndex
      gamesPlayed: gamesCompletedCount || 0,
      gamesAllowed: gamesPerPillar,
      mode: 'preview',
    };
  }, [subscription]);

  const canAccessPillar = useCallback((pillarName) => {
    if (!subscription || !subscription.features) {
      return { allowed: false, mode: 'none' };
    }

    const features = subscription.features;

    // Premium users have full access to all pillars
    if (features.fullAccess === true) {
      return {
        allowed: true,
        mode: 'full',
      };
    }

    // Freemium users can access all pillars, but only first 5 games per pillar
    // All pillars are accessible, but games are limited
    return {
      allowed: true,
      mode: 'preview',
      message: 'You are in preview mode. Upgrade to access all games.',
    };
  }, [subscription]);

  const getGamesPerPillar = useCallback(() => {
    if (!subscription || !subscription.features) return 5;
    return subscription.features.gamesPerPillar || 5;
  }, [subscription]);

  const isPremium = useCallback(() => {
    if (!subscription) return false;
    return subscription.planType !== 'free' && subscription.status === 'active';
  }, [subscription]);

  // Memoize the context value to prevent unnecessary re-renders
  // Always provide a value object, even if subscription is null
  const value = useMemo(() => {
    // Ensure we always return a valid object
    return {
      subscription: subscription || null,
      loading: loading !== undefined ? loading : true,
      refreshSubscription: fetchSubscription || (() => {}),
      hasFeature: hasFeature || (() => false),
      canAccessGame: canAccessGame || (() => ({ allowed: false, reason: 'Subscription not loaded' })),
      canAccessPillar: canAccessPillar || (() => ({ allowed: false, mode: 'none' })),
      getGamesPerPillar: getGamesPerPillar || (() => 5),
      isPremium: isPremium || (() => false),
    };
  }, [subscription, loading, fetchSubscription, hasFeature, canAccessGame, canAccessPillar, getGamesPerPillar, isPremium]);

  // Always render the provider with a value - never render without it
  if (!value) {
    console.error('SubscriptionContext value is undefined!');
    // Provide a fallback value to prevent the error
    return (
      <SubscriptionContext.Provider value={{
        subscription: null,
        loading: true,
        refreshSubscription: () => {},
        hasFeature: () => false,
        canAccessGame: () => ({ allowed: false, reason: 'Subscription not loaded' }),
        canAccessPillar: () => ({ allowed: false, mode: 'none' }),
        getGamesPerPillar: () => 5,
        isPremium: () => false,
      }}>
        {children}
      </SubscriptionContext.Provider>
    );
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;

