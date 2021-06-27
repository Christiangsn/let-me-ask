import firebase from "firebase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user?: User;
    signInWIthGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode
}
  

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    
    const [user, setUser] = useState<User>();

    useEffect( () => {
  
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const { displayName, photoURL, uid } = user
  
          if(!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.')
          }
  
          setUser( { 
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      })
  
      return () => {
        unsubscribe();
      }
  
    }, [])
  
    async function signInWIthGoogle() {
      const provider = await new firebase.auth.GoogleAuthProvider();
         
    
      try {
          const logon = await auth.signInWithPopup(provider)
  
          if(logon.user){
            const { displayName, photoURL, uid } = logon.user
  
            if(!displayName || !photoURL) {
              throw new Error('Missing information from Google Account.')
            }
  
            await setUser( { 
              id: uid,
              name: displayName,
              avatar: photoURL
            })
  
          }      
      } catch (error) {
         throw new Error(`Login is failed... ${error}`)
      }
    } 


    return (
        <AuthContext.Provider value={{ user, signInWIthGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );

}