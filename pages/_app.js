import '@/styles/globals.css'
import '@/styles/post.css'
import { createContext, useState } from 'react'

export const UserContext = createContext();

export default function App({ Component, pageProps }) {

  const [theme, setTheme] = useState(false)
  return (
    <UserContext.Provider value={[theme, setTheme]}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
