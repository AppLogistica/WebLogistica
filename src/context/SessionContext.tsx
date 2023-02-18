
import {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext,
} from 'react'

interface ContextSession {
  setSession: (value: Partial<Session>) => void
  session: Session;
}

export interface Session {
  idUser: string;
}

interface Props {
  children: ReactNode
}

const Context = createContext<ContextSession>(null)

export function useSession(): ContextSession {
  return useContext(Context)
}

export function SessionProvider(p: Props) {
const [session, setValue] = useState<Session>()

useEffect(() => {
  const value = JSON.parse(sessionStorage.getItem("global"))
  if(value)
  
  setValue(value)
},[])

function setSession(item: Partial<Session>) {
  setValue({...session, ...item});
  sessionStorage.setItem("global", JSON.stringify({...session, ...item}))
}

return (
  <Context.Provider value={{setSession, session}}>
    {p.children}
  </Context.Provider>
)

}