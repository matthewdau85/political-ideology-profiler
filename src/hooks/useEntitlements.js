import { useAuth } from './useAuth';

export function useEntitlements() {
  const { entitlements, featureEnabled } = useAuth();
  return { entitlements, featureEnabled };
}
