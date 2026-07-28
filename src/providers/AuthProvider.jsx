import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthContext } from '@/context/AuthContext.jsx'
import {
  logout,
  selectAuth,
  selectAuthHydrated,
  selectIsAuthenticated,
} from '@/store/slices/authSlice.js'

export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const hydrated = useSelector(selectAuthHydrated)

  const handleLogout = useCallback(async () => {
    await dispatch(logout())
  }, [dispatch])

  const value = useMemo(
    () => ({ ...auth, isAuthenticated, hydrated, logout: handleLogout }),
    [auth, isAuthenticated, hydrated, handleLogout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
