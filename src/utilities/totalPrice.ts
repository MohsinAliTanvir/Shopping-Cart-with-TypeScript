// Implementing decrease total price functionlaity
export function decreaseTotalPrice (currentPrice:number):void {
  const price: number = parseInt(localStorage.getItem('Price')!)
  localStorage.setItem('Price', (price - currentPrice).toString())
    document.querySelector('.price span')!.textContent = (price - currentPrice).toString()
}

// Implementing increase total price functionlaity
export function increaseTotalPrice (currentPrice:number):void {
  const price:number = parseInt(localStorage.getItem('Price')!)
  if (price) {
    localStorage.setItem('Price', (price + currentPrice).toString())
      document.querySelector('.price span')!.textContent = (price + currentPrice).toString()
  } else {
    localStorage.setItem('Price', currentPrice.toString())
      document.querySelector('.price span')!.textContent = currentPrice.toString()
  }
}
