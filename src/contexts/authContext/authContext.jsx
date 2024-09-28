import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        await initializeUser(user);
      } catch (error) {
        console.error("Error initializing user:", error);
        setAuthError("Failed to initialize authentication. Please try again later.");
      }
    });

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing from auth state listener:", error);
      }
    };
  }, []);

  async function initializeUser(user) {
    try {
      if (user) {
        setCurrentUser({ ...user });

        // check if provider is email and password login
        const isEmail = user.providerData.some(
          (provider) => provider.providerId === "password"
        );
        setIsEmailUser(isEmail);

        // Set userLoggedIn to true
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
    } catch (error) {
      console.error("Error during user initialization:", error);
      setAuthError("An error occurred while processing user data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {authError ? (
        <div className="error-message">{authError}</div>
      ) : !loading ? (
        children
      ) : (
        <div>Loading...</div>
      )}
    </AuthContext.Provider>
  );
}
