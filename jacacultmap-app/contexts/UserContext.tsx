import React, { createContext, useContext, useState } from 'react';

interface UserContextData {
  userPhotoUri: string | null;
  updateUserPhoto: (uri: string | null) => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);

  const updateUserPhoto = (uri: string | null) => {
    setUserPhotoUri(uri);
  };

  return (
    <UserContext.Provider value={{ userPhotoUri, updateUserPhoto }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}