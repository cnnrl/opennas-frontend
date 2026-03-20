export function parseJwt(token) {
  if (!token) {
    return null
  }

  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(normalized)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function extractRoles(claims) {
  if (!claims) {
    return []
  }

  const roleSet = new Set()
  const addRoles = (value) => {
    if (Array.isArray(value)) {
      value.forEach((role) => roleSet.add(String(role).toUpperCase()))
    }
  }

  addRoles(claims.roles)
  addRoles(claims.authorities)
  addRoles(claims.role)
  addRoles(claims?.realm_access?.roles)

  if (typeof claims.scope === 'string') {
    claims.scope
      .split(' ')
      .map((scope) => scope.trim().toUpperCase())
      .filter(Boolean)
      .forEach((scope) => roleSet.add(scope))
  }

  return Array.from(roleSet)
}
