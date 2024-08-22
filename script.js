

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const container = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const addCart = document.getElementsByClassName("add-to-cart-btn")
const horario = document.getElementById("date-span")

let cart = []
let pedido = {}
//Abrir modal do carrinho 
cartBtn.addEventListener("click", function() {
    updateCart()
    cartModal.style.display= "flex"

})
//Remover Item do carrinho

//Fechar a modal do carrinho
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

cartModal.addEventListener("click",function (event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})
//Adicionar items no carrinhos
menu.addEventListener("click",function (event) {
    let prentButton = event.target.closest(".add-to-cart-btn")
    if (prentButton){
        const name = prentButton.getAttribute("data-name")
        const price = parseFloat(prentButton.getAttribute("data-price"))
        addToCart(name,price)
    }
})

//Adicionar no carrinho

function addToCart (name,price){
    const itemExistente = cart.find(item => item.name === name)
    if (itemExistente){
        itemExistente.quantidade += 1
        
    } else {
        cart.push({
            name,
            price,
            quantidade: 1,
        })
        
    }
    numItens()
}

//Atualiza carrinho

function updateCart (){
    container.innerHTML = ""
    let total = 0
    cart.forEach(items => {
        const itemsCart = document.createElement("div")
        itemsCart.classList.add("flex" , "justify-betwenn", "mb-4", "flex-col")
        
        itemsCart.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium item-name">${items.name}</p>
                    <p>Qtd:${items.quantidade}</p>
                    <p class="font-medium mt-2">R$ ${items.price.toFixed(2)}</p>
            
                </div>
                <button class="bg-red-500 text-white  px-4 py-1 rounded remover" data-name="${items.name}">
                Remover
                </button>
            </div>
        `
        total += items.price*items.quantidade
        container.appendChild(itemsCart)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    numItens()
    
}

container.addEventListener("click",function (event) {
    if(event.target.classList.contains("remover")){
        const name = event.target.getAttribute("data-name")
        remove(name)
    }

})

addressInput.addEventListener("input",function(event){
    let inputValue = event.target.value
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


checkoutBtn.addEventListener("click",function () {
    if (!checkHorario()){
        Toastify({
            text: "Ops o restaurante está fechado !!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return

    }

    if (cart.length === 0)return

    if (addressInput.value === ""){
       addressWarn.classList.remove("hidden")
       addressInput.classList.add("border-red-500")
       return
    }
    const stringCarrinho = cart.map( i => {
        `${i.name} : ${i.quantidade} |`
    }).join("")
    
    const mensage = encodeURIComponent(stringCarrinho)
    const telefone = "7996344181"
    
    window.open(`https://wa.me/${telefone}?text=${mensage} Total: ${cartTotal.textContent} Endereço: ${addressInput.value}`, "_blank" )
    
    cart = []
    updateCart()
})


if (checkHorario()){
    horario.classList.remove("bg-red-500")
    horario.classList.add("bg-green-600")
} else {
    horario.classList.remove("bg-green-600")
    horario.classList.add("bg-red-500")
}

const stringCarrinho = cart.map( i => {
    `${i.name} : ${i.quantidade} |`
}).join("")




function remove (name) {
    const index = cart.findIndex(i => i.name === name)
    if (index !== -1){
        const item = cart[index]
        if (item.quantidade > 1){
            item.quantidade -=1
            updateCart()
            return
        } 
        cart.splice(index,1)
        updateCart()   
    }
}


function numItens() {
    const quantidade = cart.reduce((acc,item) => acc + item.quantidade, 0)
    const count = document.getElementById("cart-count")
    count.innerHTML = quantidade
}

function checkHorario (){
    const date = new Date()
    const hora = date.getHours()
    return hora >= 18 && hora <= 23
}

