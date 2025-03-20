'use client';

import { useQuery } from '@tanstack/react-query';

import { getCurrentSessionMutationFn } from '@/lib/api';

const useAuth = () => {
  const query = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentSessionMutationFn,
    staleTime: Infinity
  });
  return query;
};

export default useAuth;
