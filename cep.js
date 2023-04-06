console.log("=== CEP ===");

const entradaCEP = document.querySelector('#cep');
let enderecosSalvos = (localStorage.enderecosSalvos) ? JSON.parse(localStorage.enderecosSalvos) : [];

function onlyNumbers(e) {
    this.value = this.value.replace(/\D+/g, "");
}

function validateEntry() {
    if (this.value.length === 8) {
        this.classList.remove("error");
        getAddress(this.value);
        document.querySelector(".btn-primary").disabled = false;
    } else {
        this.classList.add("error");
        this.focus();
        document.querySelector(".btn-primary").disabled = true;
    }
}

function getAddress(e) {
    e.preventDefault();
    const postalCode = entradaCEP.value;
    const endpoint = `https://viacep.com.br/ws/${postalCode}/json/`;
    this.value = "";
    const config = {
        method: "GET"
    };
    fetch(endpoint, config)
        .then(function (resp) { return resp.json(); })
        .then(getAddressSuccess)
        .catch(getAddressError);
}

function getAddressSuccess(address) {
    if (address["erro"] === true) {
        alert("CEP não encontrado");
    } else {
        salvaEnderecoValido(address);
        Cards();
    }
    document.querySelector("#cep").value = '';
}

function getAddressError() {
    console.log("deu ruim 1!");
    alert("CEP não encontrado");
    document.querySelector("#cep").value = '';
}

function Cards() {
    const card = enderecosSalvos.map(function (cardInfo) {
        const { logradouro, cep, localidade, uf, bairro } = cardInfo;
        return `<div class="card" style="width: 18rem;">
                     <div class="card-body">
                         <h5 class="card-title">${logradouro}</h5>
                         <h6 class="card-subtitle mb-2 text-body-secondary">
                             ${bairro} - ${localidade} - ${uf}
                         </h6>
                         <p class="card-text">${cep}</p>
                     </div>
                 </div>`
    }).join("");
    document.querySelector(".cards").innerHTML = card;
}

function salvaEnderecoValido(address) {
    enderecosSalvos.push(address);
    localStorage.setItem("enderecosSalvos", JSON.stringify(enderecosSalvos));
}

entradaCEP.addEventListener("input", onlyNumbers);
// document.querySelector("#cep").addEventListener("input", onlyNumbers);
entradaCEP.addEventListener("focusout", validateEntry);
// document.querySelector("#cep").addEventListener("focusout", validateEntry);
document.querySelector(".btn-primary").addEventListener("click", getAddress);
document.addEventListener("DOMContentLoaded", Cards);