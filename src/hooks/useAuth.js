import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      let errorMessage = 'Si è verificato un errore durante il login.';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'La password che hai inserito non corrisponde alla mail. Riprova.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Nessun account trovato con questa email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Password errata. Riprova.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'L\'indirizzo email non è valido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Questo account è stato disabilitato.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Troppi tentativi di accesso. Riprova più tardi.';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      let errorMessage = 'Si è verificato un errore durante la registrazione.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Esiste già un account con questa email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'L\'indirizzo email non è valido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La password deve essere di almeno 6 caratteri.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'La registrazione con email e password non è abilitata.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Troppi tentativi di registrazione. Riprova più tardi.';
          break;
        default:
          errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setLoading(true);
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithApple
  };
};
