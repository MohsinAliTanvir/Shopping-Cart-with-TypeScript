// Setting up the imports
import * as cartCountUtility from './utilities/cartCount'
import * as totalPriceUtility from './utilities/totalPrice'
import { Product } from './customTypes/productType'
import { createModalContent } from './operations/modalContent'
import { createIndex } from './miscellaneous/misc'

// Declaring custom type
type Products = Product[]

// GLOBAL VARIABLES
let start = 0
let end = 8
let currentPage = 1
export let productArray:Products | string[] = []
let productCount = 0

// --------------------------- INITIALISING -------------------------------------------
// Fetching the product list from the API
getProducts('https://api.jsonbin.io/b/60d10c3c5ed58625fd162e87')
let products: Products = JSON.parse(localStorage.getItem('data')!)

showProducts(products, start, end)
onLoadCartState()
// --------------------------- PRODUCT FETCH AND DISPLAY FUNCTIONS --------------------------
// Fetching the products
async function getProducts (url: string) : Promise<void> {
  let response = await fetch(url)
  response = await response.json()
  localStorage.setItem('data', JSON.stringify(response))
}

// The function used to display products on the screen
function showProducts (products:Products, start:number, end:number) :void {
  const productsDiv: Element = document.querySelector('#Products')!
  let prodID = 1

  for (let i = start; i <= end; i++) {
    const div1: HTMLDivElement = document.createElement('div')
    div1.className = 'col-lg-6 col-xl-4'
    div1.id = `div-1${prodID}`

    const div2: HTMLDivElement = document.createElement('div')
    div2.className = 'panel panel-default'
    div2.id = `div-2${prodID}`

    const div3 : HTMLDivElement = document.createElement('div')
    div3.className = 'panel-body'
    div3.id = `div-3${prodID}`

    prodID++

    const { images } = products[i]
    const productImage:HTMLImageElement = document.createElement('img')
    productImage.src = images[0]
    productImage.className = 'image-fluid'
    div3.append(productImage)

    const productName:HTMLHeadingElement = document.createElement('h6')
    const productPrice:HTMLParagraphElement = document.createElement('p')
    const button:HTMLButtonElement = document.createElement('button')
    button.innerHTML = 'Add to Cart'
    button.className = 'addCart btn btn-primary'
    button.onclick = addToCart

    productName.innerText = `Product name : ${products[i].title}`
    productPrice.innerText = `Product price : $${products[i].price}`

    div3.append(productName)
    div3.append(productPrice)
    div3.append(button)
    div2.append(div3)
    div1.append(div2)
    productsDiv.append(div1)

    // Storing the index of the product in main data array
    localStorage.setItem(div3.id, i.toString())
  }
}

// Function for add to cart buttom
function addToCart (e:MouseEvent):void {
  const btn = e.target as HTMLButtonElement
  const { id } = btn.parentElement!
  const index: number = parseInt(localStorage.getItem(id)!)
  productArray[productCount] = products[index]
  localStorage.setItem('productArray', JSON.stringify(productArray)) // Saving productArray in localstorage for the onload cart state
  totalPriceUtility.increaseTotalPrice(parseInt(products[index].price))
  cartCountUtility.increaseCartCount()
  productCount++
}
// -------------------------------------------------------------------------------

// CART MODAL CONTENT
(document.querySelector('.cart')as HTMLInputElement).onclick = createModalContent

// -------------------------- ONLOAD CART STATE FUNCTION--------------------------
function onLoadCartState () :void {
  const count: number = parseInt(localStorage.getItem('noOfProducts')!)
  const price: number = parseInt(localStorage.getItem('Price')!)
  const dataProducts :Products | string[] = JSON.parse(localStorage.getItem('productArray')!)
  if (count) {
    document.querySelector('.cart span')!.textContent = count.toString()
    document.querySelector('.price span')!.textContent = price.toString()
    for (let i = 0; i < dataProducts.length; i++) {
      productArray[i] = dataProducts[i]
    }
    createModalContent()
  }
}
// -----------------------------------------------------------------------------

// -------------------------- CLEAR CART FUNCTION ------------------------------
// CLEAR CART
(document.querySelector('.clear-cart')as HTMLElement).onclick = function () {
  document.getElementById('modal-values')!.remove()

  // Saving data before clearing for next times
  products = JSON.parse(localStorage.getItem('data')!)
  const end: number = parseInt(localStorage.getItem('div-39')!)
  localStorage.clear()
  localStorage.setItem('data', JSON.stringify(products))
  document.querySelector('.cart span')!.textContent = '0'
  document.querySelector('.price span')!.textContent = '0'

  createIndex(end)
  productCount = 0
  productArray = []

  // Creating the div again for next addition
  const modalDiv: HTMLDivElement = document.createElement('div')
  modalDiv.className = 'modal-values'
  modalDiv.id = 'modal-values'
  const mainModal: Element|null = document.querySelector('.modal-body')
  mainModal!.append(modalDiv)
};
// --------------------------------------------------------------------------------

// ----------------------------------- PAGINATION ----------------------------------------
(document.querySelector('.pageForward')as HTMLInputElement).onclick = pageForward

// Forward function for Pagintation
function pageForward () :void {
  if (currentPage < 19) {
    start += 8
    end += 8
    currentPage++
    const productsDiv: Element|null = document.querySelector('#Products')
    productsDiv!.innerHTML = ''
    document.getElementById('pageBack')!.className = 'page-item'
    showProducts(products, start, end)
  } else {
    document.getElementById('pageForward')!.className = 'page-item disabled'
  }
}

(document.querySelector('.pageBack')as HTMLInputElement).onclick = pageBack
// Backward function for Pagintation
function pageBack () :void {
  if (currentPage > 1) {
    start -= 8
    end -= 8
    currentPage--
    const productsDiv : Element|null = document.querySelector('#Products')
    productsDiv!.innerHTML = ''
    document.getElementById('pageForward')!.className = 'page-item'
    showProducts(products, start, end)
  } else {
    document.getElementById('pageBack')!.className = 'page-item disabled'
  }
}
