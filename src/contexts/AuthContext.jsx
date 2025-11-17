import { createContext, useContext, useEffect, useState } from 'react'
import { 
  signInWithPopup,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut, 
  onAuthStateChanged
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const sendEmailLink = async (email) => {
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/verify-email',
        handleCodeInApp: true,
      }
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      // Save the email locally to complete sign-in
      window.localStorage.setItem('emailForSignIn', email)
      return true
    } catch (error) {
      console.error('Error sending email link:', error)
      throw error
    }
  }

  const verifyEmailLink = async (email, emailLink) => {
    try {
      if (isSignInWithEmailLink(auth, emailLink)) {
        const result = await signInWithEmailLink(auth, email, emailLink)
        // Clear the email from storage
        window.localStorage.removeItem('emailForSignIn')
        return result.user
      }
      throw new Error('Invalid email link')
    } catch (error) {
      console.error('Error verifying email link:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithGoogle, 
      sendEmailLink,
      verifyEmailLink,
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
