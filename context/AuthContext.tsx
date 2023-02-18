
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
  sendPasswordResetEmail?: (email: string) => Promise<void>
}

export const AuthContext = React.createContext<AuthContextModel>(
  {} as AuthContextModel,
)

export function useAuth(): AuthContextModel {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const auth = getAuth();

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

        setUser(user)
      })
      return unsubsrcibe
    })

  }, [])

  const values = {
    signUp,
    user,
    signIn,
    resetPassword,
    auth,
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useUserContext = (): UserContextState => {
  return useContext(UserStateContext)
}
// src/AuthProvider.tsx
/*
import React, {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext,
} from 'react'

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential
} from 'firebase/auth'

type ContextProps = {
  user: User | null;
  authenticated: boolean;
  setUser: any;
  loadingAuthState: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
};

export interface AuthProviderProps {
  children?: ReactNode
}

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState(null as User | null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);


  const auth = getAuth();

  const signIn = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  useEffect(() => {

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUser(user);
        setLoadingAuthState(false);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const values = {
    signIn,
    user,
    authenticated: user !== null,
    setUser,
    loadingAuthState
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>

}
*/
