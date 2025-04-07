'use client'
import React, { useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';

function AuthProvider({ children }) {
  const initialize = useAuthStore(state => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return <>{children}</>;
}

export default AuthProvider;
