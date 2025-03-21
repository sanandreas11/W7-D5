// questo documento si caricherà in index.html
const printDateInFooter = function () {
  // recupero un riferimento allo span vuoto nel footer
  const footerSpan = document.getElementById("year")
  footerSpan.innerText = new Date().getFullYear()
}

printDateInFooter()

class Product {
  constructor(_name, _description, _brand, _image, _price) {
    this.name = _name
    this.description = _description
    this.brand = _brand
    this.imageUrl = _image
    this.price = _price
  }
}

// ora la pagina Backoffice serve un duplice scopo... può:
// - creare un concerto nuovo
// - modificare un concerto esistente
// da cosa capisco se sono in modalità "CREA" o in modalità "MODIFICA"?
// dal fatto che abbia o meno un "id" come parametro nella barra degli indirizzi
const URLparameters = new URLSearchParams(location.search)
const productId = URLparameters.get("id")

// prendiamo i riferimenti ai 4 input del form
const nameInput = document.getElementById("name")
const descriptionInput = document.getElementById("description")
const brandInput = document.getElementById("brand")
const priceInput = document.getElementById("price")
const imageInput = document.getElementById("image")

const productURL = "https://striveschool-api.herokuapp.com/api/product/"

// eventId è una stringa se sono in modalità MODIFICA
// eventId è null se sono in modalità CREA
if (productId) {
  // MODALITÀ MODIFICA
  // ripopolo i campi del form con i dati esistenti
  fetch(productURL + "/" + productId, {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RkMmNlODM4MzRiZjAwMTUwMDA3MDQiLCJpYXQiOjE3NDI1NDgyMDAsImV4cCI6MTc0Mzc1NzgwMH0.z9Wd2GYOB30LZjWyXh0Ps2heZFU2_Gbo5URGePQRiDE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json() // recupero il contenuto del JSON con una seconda Promise
      } else {
        throw new Error("errore nella fetch")
      }
    })
    .then((data) => {
      // data è l'oggetto corrispondente all'id da modificare
      // riempire i campi del form con i valori di data
      nameInput.value = data.name
      descriptionInput.value = data.description
      brandInput.value = data.brand
      priceInput.value = data.price
      imageInput.value = data.imageUrl
    })
    .catch((err) => console.log("ERRORE DEL RIPOPOLAMENTO DEL FORM", err))
}

// gestiamo il submit del form in modo da creare un oggetto con i 4 campi
// e spedire un nuovo evento alle API!
// prendiamo un riferimento al form
const form = document.getElementById("event-form")
form.addEventListener("submit", function (e) {
  e.preventDefault()

  const product = new Product(
    nameInput.value,
    descriptionInput.value,
    brandInput.value,
    imageInput.value,
    priceInput.value
  )

  console.log("Prodotto", product)

  // ora il bello: lo salviamo in modo persistente nel DB
  // nota positiva: in un'API di tipo RESTFUL, l'URL su cui fate la GET generica
  // è anche l'URL per fare una POST!

  let methodToUse
  let URLtoUse

  if (productId) {
    methodToUse = "PUT"
    URLtoUse = productURL + "/" + productId
  } else {
    methodToUse = "POST"
    URLtoUse = productURL
  }

  fetch(URLtoUse, {
    method: methodToUse, // metodo post per creazione nuovo evento
    body: JSON.stringify(product), // oggetto concert convertito in stringa JSON
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RkMmNlODM4MzRiZjAwMTUwMDA3MDQiLCJpYXQiOjE3NDI1NDgyMDAsImV4cCI6MTc0Mzc1NzgwMH0.z9Wd2GYOB30LZjWyXh0Ps2heZFU2_Gbo5URGePQRiDE",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // la response ci dice se il salvataggio del nostro concerto è andato a buon fine o meno
      if (response.ok) {
        // il salvataggio ha funzionato!
        alert("SALVATAGGIO COMPLETATO!")
        // io nella pagina backoffice non avrei bisogno di recuperare il JSON dalla response
        // direi che potremmo semplicemente svuotare il form e finire qua
        form.reset() // svuoto il form
      } else {
        // 400, 401, 500 etc.
        throw new Error("ricevuta response non ok dal backend")
      }
    })
    .catch((err) => {
      console.log("errore nel salvataggio!", err)
    })
})
