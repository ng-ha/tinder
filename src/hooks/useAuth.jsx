import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';
WebBrowser.maybeCompleteAuthSession();
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '744409744447-cv0ednhrj48mn6a3655l87jejtqa4p5g.apps.googleusercontent.com',
    androidClientId: '744409744447-ogal7d3j4mqfvq4t8sqlr6b34ruh1e91.apps.googleusercontent.com',
    // scopes: ['profile', 'email'],
    // permissions: ['public_profile', 'email', 'gender', 'location'],
  });
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      if (!user) setUser(null);
      setLoadingInitial(false);
    });
    return unsub;
  }, []);
  useEffect(() => {
    if (response?.type === 'success') {
      const { accessToken, idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      signInWithCredential(auth, credential)
        .then((userCredential) => console.log(userCredential))
        .catch((error) => {
          console.log({ error });
          setError(error);
        })
        .finally(() => setLoading(true));
    }
  }, [response]);

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => console.log('Log out successfully!'))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };
  const memoedValue = useMemo(
    () => ({
      promptAsync,
      request,
      response,
      user,
      loading,
      error,
      logout,
    }),
    [user, loading, error, request, response, promptAsync]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
