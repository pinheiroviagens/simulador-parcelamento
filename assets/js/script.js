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

    // Mantém somente números
    let numeros = campoValor.value.replace(/\D/g, "");

    if (numeros === "") {
        campoValor.value = "";
        limparParcelas();
        return;
    }

    // Converte para reais
    let valor = Number(numeros) / 100;

    // Formata em moeda brasileira
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

    let valor = Number(numeros) / 100;
    selectParcelamento.innerHTML = "";

    const tabela = tabelas[cartaoSelecionado];

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");

        // Taxa efetiva decimal
        let taxaEfetiva = tabela[i]; 

        // Cálculo com repasse da taxa sobre o valor total cobrado:
        let valorTotalComTaxa = valor / (1 - taxaEfetiva);
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

    selectParcelamento.innerHTML="";

    const option=document.createElement("option");

    option.text="Digite o valor acima";

    option.disabled=true;

    option.selected=true;

    selectParcelamento.appendChild(option);

}
