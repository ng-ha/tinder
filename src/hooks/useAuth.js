import { Text, View } from 'react-native';
import React, { createContext, useContext } from 'react';
import * as Crypto from 'expo-crypto';
(async () => {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, 'hello');
  console.log('Digest: ', digest);
  /* Some crypto operation... */
})();
const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};
