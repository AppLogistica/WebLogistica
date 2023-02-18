
import React, {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext,
} from 'react'

import {
  Auth,
  UserCredential,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
} from 'firebase/auth'
import { useSession } from './SessionContext'
import { setPersistence, browserSessionPersistence } from "firebase/auth";


export interface AuthProviderProps {
  children?: ReactNode
}

export interface UserContextState {
  isAuthenticated: boolean
  isLoading: boolean
  id?: string
}

export const UserStateContext = createContext<UserContextState>(
  {} as UserContextState,
)
export interface AuthContextModel {
  auth: Auth
  user: User | null
  signIn: (email: string, password: string) => Promise<UserCredential>
  signUp: (email: string, password: string) => Promise<UserCredential>
  resetPassword?: (email: string) => Promise<void>
}

export const AuthContext = React.createContext<AuthContextModel>(
  {} as AuthContextModel,
)

export function useAuth(): AuthContextModel {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)

  const auth = getAuth();
 
  setPersistence(auth, browserSessionPersistence)
      .then(() => {

      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });

  function signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password)
  }
  function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email)
  }


  useEffect(() => {
    (async () => {
      //function that firebase notifies you if a user is set
      const unsubsrcibe = await auth.onAuthStateChanged((user) => {

        const { setSession } = useSession();
        setUser(user)
        setSession({ idUser: user.uid })
      })
      return unsubsrcibe
    })

  }, [])

  const values = {
    signUp,
    user,
    signIn,
    resetPassword,
    auth
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useUserContext = (): UserContextState => {
  return useContext(UserStateContext)
}
