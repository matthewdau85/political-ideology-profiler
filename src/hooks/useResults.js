import { useAuth } from './useAuth';

export function useResults() {
  const { results, saveResult, clearResults } = useAuth();
  return { results, saveResult, clearResults };
}
