// Declaring custom types
type Product={
  id:string,
  title:string,
  category:string,
  description:string,
  images:string[],
  price:string,
  tags:string[],
  variants:string[]}

type Products =Product[]

// GLOBAL VARIABLES
let start = 0
let end = 8
let currentPage = 1
let productArray:Products | string[] = []
let productCount = 0

// --------------------------- INITIALISING -------------------------------------------
// Fetching the product list from the API
getProducts('https://api.jsonbin.io/b/60d10c3c5ed58625fd162e87')
let products:Products = JSON.parse(localStorage.getItem('data')!)

showProducts(products, start, end)
onLoadCartState()
// --------------------------- PRODUCT FETCH AND DISPLAY FUNCTIONS --------------------------
// Fetching the products
async function getProducts (url:string) :Promise<void> {
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
    div1.id = 'div-1' + prodID

    const div2: HTMLDivElement = document.createElement('div')
    div2.className = 'panel panel-default'
    div2.id = 'div-2' + prodID

    const div3 : HTMLDivElement = document.createElement('div')
    div3.className = 'panel-body'
    div3.id = 'div-3' + prodID

    prodID++

    const images:string[] = products[i].images
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
  const id : string = btn.parentElement!.id
  const index: number = parseInt(localStorage.getItem(id)!)
  productArray[productCount] = products[index]
  localStorage.setItem('productArray', JSON.stringify(productArray)) // Saving productArray in localstorage for the onload cart state
  increaseTotalPrice(parseInt(products[index].price))
  increaseCartCount()
  productCount++
}

// -------------------------------------------------------------------------------

// -------------------------- CART COUNT AND TOTAL PRICE INCREASE & DECREASE --------------
// Implementing decrease total price functionlaity
function decreaseTotalPrice (currentPrice:number):void {
  const price: number = parseInt(localStorage.getItem('Price')!)
  localStorage.setItem('Price', (price - currentPrice).toString())
  document.querySelector('.price span')!.textContent = (price - currentPrice).toString()
}

// Implementing increase total price functionlaity
function increaseTotalPrice (currentPrice:number):void {
  const price:number = parseInt(localStorage.getItem('Price')!)
  if (price) {
    localStorage.setItem('Price', (price + currentPrice).toString())
    document.querySelector('.price span')!.textContent = (price + currentPrice).toString()
  } else {
    localStorage.setItem('Price', currentPrice.toString())
    document.querySelector('.price span')!.textContent = currentPrice.toString()
  }
}
// Increase total count function
function increaseCartCount ():void {
  const count: number = parseInt(localStorage.getItem('noOfProducts')!)
  if (count) {
    localStorage.setItem('noOfProducts', (count + 1).toString())
    document.querySelector('.cart span')!.textContent = (count + 1).toString()
  } else {
    localStorage.setItem('noOfProducts', '1')
    document.querySelector('.cart span')!.textContent = '1'
  }
}

// Decrease total count function
function decreaseCartCount () :void {
  const count :number = parseInt(localStorage.getItem('noOfProducts')!)
  localStorage.setItem('noOfProducts', (count - 1).toString())
  document.querySelector('.cart span')!.textContent = (count - 1).toString()
}
// ---------------------------------------------------------------------------------------------------

// -------------------------- CART MODAL CONTENT------------------------------
(document.querySelector('.cart')as HTMLInputElement).onclick = createModalContent
// For creating the modal content
function createModalContent () :void {
  const modalDiv: Element|null = document.querySelector('.modal-values')
  modalDiv!.innerHTML = ''
  for (let i = 0; i < productArray.length; i++) {
    const prod: string|Product = productArray[i]
    if (typeof prod !== 'string') {
      const productDiv: HTMLDivElement = document.createElement('div')
      productDiv.id = 'product' + i
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
      localStorage.setItem(productDiv.id + 'prodIndex', i.toString())

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
  const id:string = btn.parentElement!.id
  // Removing product from productArray as well
  const prodIndex: number = parseInt(localStorage.getItem(id + 'prodIndex')!)
  productArray[prodIndex] = ''
  localStorage.setItem('productArray', JSON.stringify(productArray))

  const data:Product = JSON.parse(localStorage.getItem(id)!)

  const { value } = document.getElementById(id + 'number') as HTMLInputElement
  const count:number = parseInt(value)
  for (let i = 1; i <= count; i++) {
    decreaseTotalPrice(parseInt(data.price))
    decreaseCartCount()
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

  result.id = name + 'label'
  result.className = 'result'

  const num: HTMLInputElement = document.createElement('input')
  num.type = 'number'
  num.id = name + 'number'
  num.className = 'value'
  num.disabled = true

  // Checking for the onload cart state
  const count : number = parseInt(localStorage.getItem('noOfProducts')!)
  const currentPrice: number = parseInt(localStorage.getItem(name + 'currentPrice')!)
  if (count && !isNaN(currentPrice)) {
    num.value = localStorage.getItem(name + 'value')!
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
  const id : string = btn.parentElement!.parentElement!.id
  let value = parseInt((document.getElementById(id + 'number') as HTMLInputElement).value)
  value--
  if (value > 0) {
    const price:number = parseInt(JSON.parse(localStorage.getItem(id)!).price)
    const val = document.getElementById(id + 'number') as HTMLInputElement
    const lab = document.getElementById(id + 'label') as HTMLInputElement

    val.value = value.toString()
    lab.innerHTML = (value * price).toString()

    // Saving value of the quantity and the current product price for onload
    localStorage.setItem(id + 'value', value.toString())
    localStorage.setItem(id + 'currentPrice', (value * price).toString())

    decreaseTotalPrice(price) // For total price
    decreaseCartCount() // For total count
  }
}
// Function for plus button
function plusButton (e:MouseEvent) :void {
  const btn = e.target as HTMLButtonElement
  const id = btn.parentElement!.parentElement!.id
  let value = parseInt((document.getElementById(id + 'number') as HTMLInputElement).value)
  console.log(value)
  value++
  if (value > 0) {
    const price = parseInt(JSON.parse(localStorage.getItem(id)!).price)
    const val = document.getElementById(id + 'number') as HTMLInputElement
    const lab = document.getElementById(id + 'label') as HTMLInputElement

    val.value = value.toString()
    lab.innerHTML = (value * price).toString()

    // Saving value of the quantity and the current product price for onload
    localStorage.setItem(id + 'value', value.toString())
    localStorage.setItem(id + 'currentPrice', (value * price).toString())

    increaseTotalPrice(price) // For total price
    increaseCartCount() // For total count
  }
}
// --------------------------------------------------------------------------------------

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
}
// --------------------------------------------------------------------------------

// ------------------------- MISC ------------------------
// For creating indexes after clear cart function
function createIndex (end:number):void {
  let j = 1
  for (let i = end - 8; i <= end; i++) {
    localStorage.setItem('div-3' + j, i.toString())
    j++
  }
}
// ----------------------------------------------------------

// ----------------------------------- PAGINATION ----------------------------------------
(document.querySelector('.pageForward')as HTMLInputElement).onclick = pageForward

// Forward function for Pagintation
function pageForward () :void {
  if (currentPage < 19) {
    start = start + 8
    end = end + 8
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
    start = start - 8
    end = end - 8
    currentPage--
    const productsDiv : Element|null = document.querySelector('#Products')
    productsDiv!.innerHTML = ''
    document.getElementById('pageForward')!.className = 'page-item'
    showProducts(products, start, end)
  } else {
    document.getElementById('pageBack')!.className = 'page-item disabled'
  }
}
