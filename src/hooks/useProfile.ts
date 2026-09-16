import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { profile, updateProfile, isLoading } = useAuth();
  return { profile, updateProfile, isLoading };
};
