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

    let valorBase = Number(numeros) / 100;
    
    // Busca a taxa de dentro da configuração da tabela (padrão 0 se não existir)
    const taxaAdicional = tabelas.config?.taxaAdicional || 0;
    let valorComAdicional = valorBase * (1 + taxaAdicional);

    selectParcelamento.innerHTML = "";
    const tabela = tabelas[cartaoSelecionado];

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        let taxaEfetiva = tabela[i]; 

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
