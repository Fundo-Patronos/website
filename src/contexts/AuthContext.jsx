import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

const actionCodeSettings = {
  url: typeof window !== 'undefined' ? `${window.location.origin}/doador/login` : '',
  handleCodeInApp: true,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Check for magic link sign-in
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Por favor, confirme seu email para login:')
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
            // Clean URL
            window.history.replaceState(null, '', window.location.pathname)
          })
          .catch((error) => {
            setError(error.message)
          })
      }
    }

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    setError(null)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const signInWithEmail = async (email, password) => {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const registerWithEmail = async (email, password) => {
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const sendMagicLink = async (email) => {
    setError(null)
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const resetPassword = async (email) => {
    setError(null)
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    sendMagicLink,
    resetPassword,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
