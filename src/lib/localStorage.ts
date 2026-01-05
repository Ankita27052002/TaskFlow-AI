export const loadFromLocalStorage = <T>(key: string): T | undefined => {
  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) return undefined
    return JSON.parse(serialized) as T
  } catch (err) {
    console.error('Error loading from localStorage:', err)
    return undefined
  }
}

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
}

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Error removing from localStorage:', err)
  }
}
