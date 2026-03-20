export function revokeObjectUrl(url) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

export function revokeObjectUrlMap(urlMap) {
  Object.values(urlMap).forEach((url) => {
    revokeObjectUrl(url)
  })
}
