// For creating indexes after clear cart function
export function createIndex (end: number): void {
  let j = 1
  for (let i = end - 8; i <= end; i++) {
    localStorage.setItem(`div-3${j}`, i.toString())
    j++
  }
}
