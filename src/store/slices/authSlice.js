import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// Auth comes through the service façade (src/services/index.js) — currently
// the temporary mock backend. Demo accounts:
//   Admin        → admin@sahm.sa / admin123
//   Regular user → user@sahm.sa  / user123
// TODO(backend): flip the façade to the real services to go live.
import { authService } from '@/services/index.js'
import { clearToken, getToken, setToken } from '@/services/apiClient.js'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const result = await authService.login(credentials)
    if (!result.token) return rejectWithValue('No token in response')
    return result
  } catch (error) {
    return rejectWithValue(error.message ?? 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout()
  } catch {
    /* ignore logout API errors */
  }
  clearToken()
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const token = getToken()
  if (!token) return null
  setToken(token)
  try {
    const user = await authService.getProfile()
    return { token, user }
  } catch (error) {
    if (error?.status === 401) {
      clearToken()
      return null
    }
    // Network/server error — keep the session; profile loads on a later request
    return { token, user: null }
  }
})

const initialState = {
  user: null,
  token: getToken(),
  status: 'idle',
  error: null,
  hydrated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        setToken(action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Login failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(hydrateAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.hydrated = true
        state.status = 'idle'
        if (action.payload) {
          state.user = action.payload.user
          state.token = action.payload.token
        } else {
          state.user = null
          state.token = null
        }
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.hydrated = true
        state.status = 'idle'
        state.user = null
        state.token = null
      })
  },
})

export const { clearAuthError } = authSlice.actions
export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export const selectAuthHydrated = (state) => state.auth.hydrated

export default authSlice.reducer
