import { createContext, useState} from 'react'
// @ts-ignore
export const AuthContext = createContext();
// @ts-ignore
export default function AuthContextProvider(props ){
    const [user, setUser] = useState();
    return (
        <AuthContext.Provider value={{ user, setUser}}>
            
            {props.children}
        </AuthContext.Provider>
    )

}