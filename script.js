// Captura elementos do DOM
const cardapio = document.getElementById("menu");
const botaoCarrinho = document.getElementById("cart-btn");
const modalCarrinho = document.getElementById("cart-modal");
const itensCarrinhoContainer = document.getElementById("cart-items");
const totalCarrinho = document.getElementById("cart-total");
const botaoFinalizar = document.getElementById("checkout-btn");
const botaoFecharModal = document.getElementById("close-modal-btn");
const contadorCarrinho = document.getElementById("cart-count");
const inputEndereco = document.getElementById("address");
const avisoEndereco = document.getElementById("address-warn");
const botoesAdicionarCarrinho = document.getElementsByClassName("add-to-cart-btn");
const indicadorHorario = document.getElementById("date-span");

// Inicializa o carrinho e pedido
let carrinho = [];

// Evento para abrir o modal do carrinho
botaoCarrinho.addEventListener("click", function() {
    atualizarCarrinho(); // Atualiza os itens do carrinho antes de abrir o modal
    modalCarrinho.style.display = "flex"; // Exibe o modal
});

// Evento para fechar o modal ao clicar no botão de fechar
botaoFecharModal.addEventListener("click", function () {
    modalCarrinho.style.display = "none"; // Esconde o modal
});

// Fecha o modal ao clicar fora do conteúdo principal
modalCarrinho.addEventListener("click", function(event) {
    if(event.target === modalCarrinho){
        modalCarrinho.style.display = "none"; // Esconde o modal
    }
});

// Adiciona itens ao carrinho ao clicar nos botões correspondentes
cardapio.addEventListener("click", function(event) {
    let botaoAdicionar = event.target.closest(".add-to-cart-btn");
    if (botaoAdicionar) {
        const nome = botaoAdicionar.getAttribute("data-name");
        const preco = parseFloat(botaoAdicionar.getAttribute("data-price"));
        adicionarAoCarrinho(nome, preco); // Chama a função para adicionar o item ao carrinho
    }
});

// Função para adicionar itens ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade += 1; // Incrementa a quantidade se o item já estiver no carrinho
    } else {
        carrinho.push({
            nome,
            preco,
            quantidade: 1,
        }); // Adiciona o item novo ao carrinho
    }
    atualizarContadorItens(); // Atualiza o contador de itens
}

// Função para atualizar a exibição dos itens no carrinho
function atualizarCarrinho() {
    itensCarrinhoContainer.innerHTML = ""; // Limpa o conteúdo atual
    let total = 0;
    carrinho.forEach(item => {
        const itemCarrinho = document.createElement("div");
        itemCarrinho.classList.add("flex", "justify-betwenn", "mb-4", "flex-col");
        
        // Cria o conteúdo HTML para cada item do carrinho
        itemCarrinho.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium item-name">${item.nome}</p>
                    <p>Qtd: ${item.quantidade}</p>
                    <p class="font-medium mt-2">R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button class="bg-red-500 text-white px-4 py-1 rounded remover" data-name="${item.nome}">
                    Remover
                </button>
            </div>
        `;
        total += item.preco * item.quantidade; // Calcula o total do carrinho
        itensCarrinhoContainer.appendChild(itemCarrinho); // Adiciona o item ao container
    });
    totalCarrinho.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    }); // Exibe o valor total formatado
    atualizarContadorItens(); // Atualiza o contador de itens
}

// Evento para remover itens do carrinho
itensCarrinhoContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remover")) {
        const nome = event.target.getAttribute("data-name");
        removerItem(nome); // Chama a função para remover o item
    }
});

// Valida o campo de endereço ao digitar
inputEndereco.addEventListener("input", function(event) {
    let valorInput = event.target.value;
    if(valorInput !== "") {
        inputEndereco.classList.remove("border-red-500");
        avisoEndereco.classList.add("hidden");
    }
});

// Evento para finalizar o pedido
botaoFinalizar.addEventListener("click", function () {
    if (!verificarHorario()) {
        // Exibe uma notificação se o restaurante estiver fechado
        Toastify({
            text: "Ops o restaurante está fechado !!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (carrinho.length === 0) return; // Verifica se o carrinho está vazio

    if (inputEndereco.value === "") {
       avisoEndereco.classList.remove("hidden");
       inputEndereco.classList.add("border-red-500");
       return; // Verifica se o endereço foi preenchido
    }

    // Prepara a mensagem com os itens do carrinho
    const carrinhoFormatado = carrinho.map(item => {
        return `${item.nome} : ${item.quantidade} |`;
    }).join("");

    const mensagem = encodeURIComponent(carrinhoFormatado);
    const telefone = "7996344181";
    
    // Abre o WhatsApp com a mensagem formatada
    window.open(`https://wa.me/${telefone}?text=${mensagem} Total: ${totalCarrinho.textContent} Endereço: ${inputEndereco.value}`, "_blank");
    
    carrinho = []; // Limpa o carrinho após o pedido
    atualizarCarrinho(); // Atualiza o carrinho
});

// Atualiza o indicador de horário de funcionamento
if (verificarHorario()) {
    indicadorHorario.classList.remove("bg-red-500");
    indicadorHorario.classList.add("bg-green-600");
} else {
    indicadorHorario.classList.remove("bg-green-600");
    indicadorHorario.classList.add("bg-red-500");
}

// Função para remover itens do carrinho
function removerItem(nome) {
    const index = carrinho.findIndex(item => item.nome === nome);
    if (index !== -1) {
        const item = carrinho[index];
        if (item.quantidade > 1) {
            item.quantidade -= 1; // Decrementa a quantidade se houver mais de 1
            atualizarCarrinho();
            return;
        }
        carrinho.splice(index, 1); // Remove o item do array se restar apenas 1
        atualizarCarrinho();
    }
}

// Função para atualizar o número de itens no carrinho
function atualizarContadorItens() {
    const quantidade = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contadorCarrinho.innerHTML = quantidade; // Atualiza o contador de itens no DOM
}

// Função para verificar o horário de funcionamento
function verificarHorario() {
    const dataAtual = new Date();
    const horaAtual = dataAtual.getHours();
    return horaAtual >= 18 && horaAtual <= 23; // Verifica se o horário é entre 18h e 23h
}
