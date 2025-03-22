const printDateInFooter = function () {
  // recupero un riferimento allo span vuoto nel footer
  const footerSpan = document.getElementById("year")
  footerSpan.innerText = new Date().getFullYear()
}

printDateInFooter()

// qui dentro ora recupero il parametro "id" che mi sono inserito nell'URL
// in cui si sta montando questa pagina details.html
const URLparameters = new URLSearchParams(location.search) // location.search è l'intero contenuto della barra URL

// details.html?id=67dbe830e205930015653b39

const productId = URLparameters.get("id") // '67dbe830e205930015653b39'
// ora con questo concertId potrò:
// - recuperare i dettagli SOLO di questo concerto (e non di tutti)
// - modificare i dettagli SOLO di questo concerto
// - eliminare questo concerto

// per recuperare i dettagli di un solo elemento a DB, faccio una GET...
// ...ma non sarà una GET "generale" come prima!
// sarà una GET molto specifica, in cui inserirò l'ID del concerto nell'URL!
const productURL = "https://striveschool-api.herokuapp.com/api/product/"

const getProductDetails = function () {
  fetch(productURL + productId, {
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RkMmNlODM4MzRiZjAwMTUwMDA3MDQiLCJpYXQiOjE3NDI1NDgyMDAsImV4cCI6MTc0Mzc1NzgwMH0.z9Wd2GYOB30LZjWyXh0Ps2heZFU2_Gbo5URGePQRiDE",
    },
  })
    .then((response) => {
      console.log("response", response)
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("Errore nel recupero dei dettagli")
      }
    })
    .then((data) => {
      console.log("DETTAGLI PRODOTTO", data)
      const name = document.getElementById("name")
      const description = document.getElementById("description")
      const brand = document.getElementById("brand")
      const price = document.getElementById("price")
      const image = document.getElementById("image")
      name.innerText = data.name
      description.innerText = data.description
      price.innerText = data.price + "€"
      brand.innerText = data.brand
      image.innerText = data.imageUrl
    })
    .catch((err) => {
      console.log("ERRORE NEL RECUPERO DATI CONCERTO", err)
    })
}

const editProduct = function () {
  location.assign("./backoffice.html?id=" + productId)
}

const deleteProduct = function () {
  // --- WARNING ---
  // stiamo per eliminare il concerto
  fetch(productURL + "/" + productId, {
    method: "DELETE",
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2RkMmNlODM4MzRiZjAwMTUwMDA3MDQiLCJpYXQiOjE3NDI1NDgyMDAsImV4cCI6MTc0Mzc1NzgwMH0.z9Wd2GYOB30LZjWyXh0Ps2heZFU2_Gbo5URGePQRiDE",
    },
  })
    .then((response) => {
      if (response.ok) {
        // abbiamo eliminato il concerto
        alert("PRODOTTO ELIMINATO")
        // riportiamo l'utente in home
        location.assign("./index.html") // riportiamo l'utente in home
      } else {
        throw new Error("eliminazione NON andata a buon fine!")
      }
    })
    .catch((err) => {
      console.log("ERRORE NELLA CANCELLAZIONE", err)
    })
}

getProductDetails()
