/* ==========================================
   PAINEL ADMINISTRATIVO
   SMED SARANDI
========================================== */

let informativos = [];
let editando = -1;

/* ------------------------------
   ELEMENTOS
------------------------------ */

const btnImportar = document.getElementById("btnImportar");
const arquivoJson = document.getElementById("arquivoJson");
const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const imagem = document.getElementById("imagem");
const botao = document.getElementById("botao");
const link = document.getElementById("link");
const inicio = document.getElementById("inicio");
const fim = document.getElementById("fim");
const prioridade = document.getElementById("prioridade");

const lista = document.getElementById("listaInformativos");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnExportar = document.getElementById("btnExportar");

/* ------------------------------
   ADICIONAR / EDITAR
------------------------------ */

btnAdicionar.onclick = () => {

    if (titulo.value.trim() === "") {
        alert("Informe um título.");
        return;
    }

    const item = {

        id: Date.now(),

        titulo: titulo.value,

        descricao: descricao.value,

        imagem: imagem.value,

        botao: botao.value,

        link: link.value,

        inicio: inicio.value,

        fim: fim.value,

        prioridade:informativos.length+1

    };

    if (editando == -1) {

        informativos.push(item);

    } else {

        item.id = informativos[editando].id;

        informativos[editando] = item;

        editando = -1;

        btnAdicionar.innerHTML = "Adicionar";

    }

    ordenar();

    limparFormulario();

    atualizarLista();

};

/* ------------------------------
   ORDENAR
------------------------------ */

function ordenar() {

    informativos.sort((a, b) => a.prioridade - b.prioridade);

}

/* ------------------------------
   LIMPAR
------------------------------ */

function limparFormulario() {

    titulo.value = "";
    descricao.value = "";
    imagem.value = "";
    botao.value = "Saiba mais";
    link.value = "";
    inicio.value = "";
    fim.value = "";
    prioridade.value = 1;

}

/* ------------------------------
   MOSTRAR LISTA
------------------------------ */

function atualizarLista() {

    lista.innerHTML = "";

    informativos.forEach((item, indice) => {

        const div = document.createElement("div");

        div.className = "item";

div.innerHTML = `

<h3>${item.titulo}</h3>

${
item.imagem
?
`<img src="${item.imagem}"
style="width:160px;
margin:10px 0;
border-radius:8px;">`
:
""
}

<p>${item.descricao}</p>

<footer>

<small>

${item.inicio} até ${item.fim}

</small>

<div class="botoes">

<button class="editar">

Editar

</button>

<button class="excluir">

Excluir

</button>

</div>

</footer>

`;

        const botoes = div.querySelectorAll("button");

        botoes[0].onclick = () => editar(indice);

        botoes[1].onclick = () => excluir(indice);

        lista.appendChild(div);

    });

}

/* ------------------------------
   EDITAR
------------------------------ */

function editar(indice){

    const item = informativos[indice];

    editando = indice;

    titulo.value = item.titulo;

    descricao.value = item.descricao;

    imagem.value = item.imagem;

    botao.value = item.botao;

    link.value = item.link;

    inicio.value = item.inicio;

    fim.value = item.fim;

    prioridade.value = item.prioridade;

    btnAdicionar.innerHTML = "Salvar Alterações";

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ------------------------------
   EXCLUIR
------------------------------ */

function excluir(indice){

    if(confirm("Excluir este informativo?")){

        informativos.splice(indice,1);

        atualizarLista();

    }

}

/* ------------------------------
   EXPORTAR JSON
------------------------------ */

btnExportar.onclick = ()=>{

    ordenar();

    const json = JSON.stringify(informativos,null,4);

    const blob = new Blob([json],{

        type:"application/json"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "informativos.json";

    a.click();

    URL.revokeObjectURL(url);

};

/* ------------------------------
   IMPORTAR JSON
------------------------------ */

function importar(json){

    informativos = json;

    ordenar();

    atualizarLista();

}
/* ==========================================
   IMPORTAR JSON
========================================== */

btnImportar.onclick = () => {

    arquivoJson.click();

};

arquivoJson.addEventListener("change", (e) => {

    const arquivo = e.target.files[0];

    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        try {

            informativos = JSON.parse(evento.target.result);

            ordenar();

            atualizarLista();

            alert("JSON importado com sucesso.");

        } catch {

            alert("Arquivo JSON inválido.");

        }

    };

    leitor.readAsText(arquivo);

});
