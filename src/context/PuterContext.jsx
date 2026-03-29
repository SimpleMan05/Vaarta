import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const PuterContext = createContext(null)

export function PuterProvider({ children }) {
  // 'checking' | 'ready' | 'signing-in' | 'error'
  const [status, setStatus] = useState('checking')
  const [user, setUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Wait for puter global to be available on window
  function waitForPuter(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (typeof window.puter !== 'undefined') return resolve(window.puter)
      const start = Date.now()
      const interval = setInterval(() => {
        if (typeof window.puter !== 'undefined') {
          clearInterval(interval)
          resolve(window.puter)
        } else if (Date.now() - start > timeout) {
          clearInterval(interval)
          reject(new Error('Puter.js failed to load within timeout.'))
        }
      }, 100)
    })
  }

  // Check auth state and ensure socket is established
  const initPuter = useCallback(async () => {
    setStatus('checking')
    setErrorMsg('')
    try {
      const puter = await waitForPuter()

      // Check if already authenticated
      let isSignedIn = false
      try {
        isSignedIn = await puter.auth.isSignedIn()
      } catch {
        isSignedIn = false
      }

      if (isSignedIn) {
        try {
          const u = await puter.auth.getUser()
          setUser(u)
        } catch {}
        setStatus('ready')
      } else {
        // Not signed in — trigger sign-in
        setStatus('signing-in')
        try {
          await puter.auth.signIn()
          const u = await puter.auth.getUser()
          setUser(u)
          setStatus('ready')
        } catch (err) {
          // User may have closed the popup — keep as error so they can retry
          setStatus('error')
          setErrorMsg(err?.message || 'Sign-in was cancelled or failed. Click "Connect" to try again.')
        }
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Puter.js could not be loaded. Check your internet connection.')
    }
  }, [])

  useEffect(() => {
    initPuter()
  }, [initPuter])

  return (
    <PuterContext.Provider value={{ status, user, errorMsg, retry: initPuter }}>
      {children}
    </PuterContext.Provider>
  )
}

export function usePuter() {
  return useContext(PuterContext)
}
