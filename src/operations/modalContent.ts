// Setting up the imports
import { Product } from '../customTypes/productType'
import * as cartCountUtility from '../utilities/cartCount'
import * as totalPriceUtility from '../utilities/totalPrice'
import { productArray } from '../index'

export function createModalContent () :void {
  const modalDiv: Element|null = document.querySelector('.modal-values')
    modalDiv!.innerHTML = ''
    for (let i = 0; i < productArray.length; i++) {
      const prod: string|Product = productArray[i]
      if (typeof prod !== 'string') {
        const productDiv: HTMLDivElement = document.createElement('div')
        productDiv.id = `product${i}`
        const productName: HTMLHeadingElement = document.createElement('h6')
        const productPrice: HTMLParagraphElement = document.createElement('p')

        productPrice.className = 'product-price'
        productName.innerText = `Product name : ${prod.title}`
        productPrice.innerText = `Product price : $ ${prod.price}`

        productDiv.append(productName)
        productDiv.append(productPrice)
        modalDiv!.append(productDiv)

        // Storing the data array with its div ID in local storage
        localStorage.setItem(productDiv.id, JSON.stringify(productArray[i]))
        localStorage.setItem(`${productDiv.id}prodIndex`, i.toString())

        createDeleteButton(productDiv.id)
        createQuantityForm(productDiv.id)
      }
    }
}

// Creating the delete button
function createDeleteButton (name:string) :void {
  const productDiv :HTMLElement|null = document.getElementById(name)
  const button:HTMLButtonElement = document.createElement('button')
  button.innerHTML = 'X'
  button.className = 'btn btn-danger delete-button'
  button.onclick = deleteFunction
    productDiv!.append(button)
}

// Implementing the delete button fucntionality
function deleteFunction (e:MouseEvent) :void {
  const btn = e.target as HTMLButtonElement
  const { id } = btn.parentElement!
  // Removing product from productArray as well
  const prodIndex: number = parseInt(localStorage.getItem(`${id}prodIndex`)!)
  // productArray = JSON.parse(localStorage.getItem('productArray')!);
  productArray[prodIndex] = ''
  localStorage.setItem('productArray', JSON.stringify(productArray))

  const data:Product = JSON.parse(localStorage.getItem(id)!)

  const { value } = document.getElementById(`${id}number`) as HTMLInputElement
  const count:number = parseInt(value)
  for (let i = 1; i <= count; i++) {
    totalPriceUtility.decreaseTotalPrice(parseInt(data.price))
    cartCountUtility.decreaseCartCount()
  }
    // Removing total div
    document.getElementById(id)!.remove()
}
// -------------------------------------------------------------------------------------

// -------------------------- QUANTITY INCREASE AND DECREASE FORM ------------------------------

// Creating the quantity form
function createQuantityForm (name:string) :void {
  const productDiv: HTMLElement|null = document.getElementById(name)
  const form : HTMLFormElement = document.createElement('form')
  form.className = 'quantity'
  const label: HTMLLabelElement = document.createElement('label')
  const result: HTMLLabelElement = document.createElement('label')

  label.innerHTML = 'Current Product price: $'
  label.className = 'changingLabel'

  result.id = `${name}label`
  result.className = 'result'

  const num: HTMLInputElement = document.createElement('input')
  num.type = 'number'
  num.id = `${name}number`
  num.className = 'value'
  num.disabled = true

  // Checking for the onload cart state
  const count : number = parseInt(localStorage.getItem('noOfProducts')!)
  const currentPrice: number = parseInt(localStorage.getItem(`${name}currentPrice`)!)
  if (count && !isNaN(currentPrice)) {
    num.value = localStorage.getItem(`${name}value`)!
    result.innerHTML = currentPrice.toString()
  } else {
    result.innerHTML = JSON.parse(localStorage.getItem(name)!).price
    num.value = '1'
  }

  const btn1: HTMLButtonElement = document.createElement('button')
  btn1.innerHTML = '-'
  btn1.type = 'button'
  btn1.className = 'btn btn-outline-secondary btn-sm'
  btn1.onclick = minusButton

  const btn2: HTMLButtonElement = document.createElement('button')
  btn2.innerHTML = '+'
  btn2.type = 'button'
  btn2.className = 'btn btn-outline-secondary btn-sm'
  btn2.onclick = plusButton

    productDiv!.append(label, result)
    form.append(btn1, num, btn2)
    productDiv!.append(form)
}

// Function for the minus button
function minusButton (e:MouseEvent) :void {
  const btn = e.target as HTMLButtonElement
  const { id } = btn.parentElement!.parentElement!
  let value = parseInt((document.getElementById(`${id}number`) as HTMLInputElement).value)
  value--
  if (value > 0) {
    const price:number = parseInt(JSON.parse(localStorage.getItem(id)!).price)
    const val = document.getElementById(`${id}number`) as HTMLInputElement
    const lab = document.getElementById(`${id}label`) as HTMLInputElement

    val.value = value.toString()
    lab.innerHTML = (value * price).toString()

    // Saving value of the quantity and the current product price for onload
    localStorage.setItem(`${id}value`, value.toString())
    localStorage.setItem(`${id}currentPrice`, (value * price).toString())

    totalPriceUtility.decreaseTotalPrice(price) // For total price
    cartCountUtility.decreaseCartCount() // For total count
  }
}
// Function for plus button
function plusButton (e:MouseEvent) :void {
  const btn = e.target as HTMLButtonElement
  const { id } = btn.parentElement!.parentElement!
  let value = parseInt((document.getElementById(`${id}number`) as HTMLInputElement).value)
  value++
  if (value > 0) {
    const price = parseInt(JSON.parse(localStorage.getItem(id)!).price)
    const val = document.getElementById(`${id}number`) as HTMLInputElement
    const lab = document.getElementById(`${id}label`) as HTMLInputElement

    val.value = value.toString()
    lab.innerHTML = (value * price).toString()

    // Saving value of the quantity and the current product price for onload
    localStorage.setItem(`${id}value`, value.toString())
    localStorage.setItem(`${id}currentPrice`, (value * price).toString())

    totalPriceUtility.increaseTotalPrice(price) // For total price
    cartCountUtility.increaseCartCount() // For total count
  }
}
