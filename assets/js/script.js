const campoValor = document.getElementById("valor");
const selectParcelamento = document.getElementById("parcelamento");
const radiosCartao = document.querySelectorAll('input[name="cartao"]');

let cartaoSelecionado = "visa";

// Sempre que trocar de cartão
radiosCartao.forEach(radio => {
    radio.addEventListener("change", () => {
        cartaoSelecionado = radio.value;
        atualizarParcelas();
    });
});

// Sempre que digitar um valor
campoValor.addEventListener("input", () => {
    let numeros = campoValor.value.replace(/\D/g, "");

    if (numeros === "") {
        campoValor.value = "";
        limparParcelas();
        return;
    }

    let valor = Number(numeros) / 100;

    campoValor.value = valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    atualizarParcelas();
});

function atualizarParcelas() {
    let numeros = campoValor.value.replace(/\D/g, "");

    if (numeros === "") {
        limparParcelas();
        return;
    }

    // 1. Pega o valor digitado (ex: 100.00)
    let valorBase = Number(numeros) / 100;
    
    // 2. Busca a taxa configurável (0.01) e soma 1% no valor inicial
    const porcentagemExtra = tabelas.config?.taxaAdicional || 0;
    let valorComAdicional = valorBase * (1 + porcentagemExtra); // Se for 1%, multiplica por 1.01 (Resultado: 101.00)

    selectParcelamento.innerHTML = "";
    const tabela = tabelas[cartaoSelecionado];

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        
        // 3. Aplica a taxa original da tabela de cartões (ex: 0.0348)
        let taxaEfetiva = tabela[i]; 

        // 4. Faz o repasse da máquina em cima do valor que já ganhou o 1%
        let valorTotalComTaxa = valorComAdicional / (1 - taxaEfetiva);
        let parcela = valorTotalComTaxa / i;

        option.value = i;
        option.text = `${i}x de ${parcela.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })} (Total: ${valorTotalComTaxa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})`;

        selectParcelamento.appendChild(option);
    }
}

function limparParcelas(){
    selectParcelamento.innerHTML = "";
    const option = document.createElement("option");
    option.text = "Digite o valor acima";
    option.disabled = true;
    option.selected = true;
    selectParcelamento.appendChild(option);
}
