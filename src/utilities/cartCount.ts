// Increase total count function
export function increaseCartCount ():void {
  const count:number = parseInt(localStorage.getItem('noOfProducts')!)
  if (count) {
    localStorage.setItem('noOfProducts', (count + 1).toString())
      document.querySelector('.cart span')!.textContent = (count + 1).toString()
  } else {
    localStorage.setItem('noOfProducts', '1')
      document.querySelector('.cart span')!.textContent = '1'
  }
}

// Decrease total count function
export function decreaseCartCount () :void {
  const count :number = parseInt(localStorage.getItem('noOfProducts')!)
  localStorage.setItem('noOfProducts', (count - 1).toString())
    document.querySelector('.cart span')!.textContent = (count - 1).toString()
}
