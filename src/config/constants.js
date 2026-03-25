const DEFAULT_API_BASE = 'http://localhost:8080'
const rawApiBase = import.meta.env.VITE_API_BASE ?? DEFAULT_API_BASE

export const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase
