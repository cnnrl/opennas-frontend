const DEFAULT_API_BASE = '/api'
const rawApiBase = import.meta.env.VITE_API_BASE ?? DEFAULT_API_BASE

export const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase
