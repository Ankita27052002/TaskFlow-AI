export const loadFromLocalStorage = (key) => {
  try {
    const serialized = localStorage.getItem(key)
    if (serialized === null) return undefined
    return JSON.parse(serialized)
  } catch (err) {
    console.error('Error loading from localStorage:', err)
    return undefined
  }
}

export const saveToLocalStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
}

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Error removing from localStorage:', err)
  }
}
