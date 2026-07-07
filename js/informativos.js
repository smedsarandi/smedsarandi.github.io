/* ===========================================================
   SISTEMA DE INFORMATIVOS - SMED SARANDI
   Arquivo: js/informativos.js
   Parte 1 - Estrutura principal
=========================================================== */

const TEMPO_SLIDE = 4000;

let informativos = [];
let indiceAtual = 0;

let intervaloSlide = null;
let intervaloBarra = null;

const modalOverlay = document.getElementById("overlayInformativos");
const modal = document.getElementById("modalInformativos");

const titulo = document.getElementById("slideTitulo");
const descricao = document.getElementById("slideDescricao");
const imagem = document.getElementById("slideImagem");
const btnLink = document.getElementById("btnAbrirLink");

const indicadores = document.getElementById("indicadores");

const progresso = document.getElementById("progresso");

const btnAnterior = document.getElementById("btnAnterior");
const btnProximo = document.getElementById("btnProximo");
const btnFechar = document.getElementById("fecharModal");

const chkNaoMostrar = document.getElementById("chkNaoMostrar");



/* ===========================================================
    CARREGA O JSON
=========================================================== */

async function carregarInformativos() {

    try {

        const resposta = await fetch("dados/informativos.json");

        const dados = await resposta.json();

        informativos = filtrarInformativos(dados);

        if (informativos.length === 0) {
            return;
        }

		preloadImagens();

		criarIndicadores();

		mostrarSlide(0);

		abrirModal();

    }

    catch (erro) {

        console.error("Erro ao carregar informativos", erro);

    }

}



/* ===========================================================
      FILTRO POR DATA
=========================================================== */

function filtrarInformativos(lista) {

    const hoje = new Date();

    return lista.filter(item => {

        const inicio = new Date(item.inicio);

        const fim = new Date(item.fim);

        return hoje >= inicio && hoje <= fim;

    }).sort((a, b) => a.prioridade - b.prioridade);

}



/* ===========================================================
      ABRIR MODAL
=========================================================== */

function abrirModal() {

    if (localStorage.getItem("informativosHoje") === (new Date()).toLocaleDateString()) {

        return;

    }

    modalOverlay.style.display = "flex";

    iniciarRotacao();

}



/* ===========================================================
      FECHAR MODAL
=========================================================== */

function fecharModal() {

    modalOverlay.style.display = "none";

    pararRotacao();

    if (chkNaoMostrar.checked) {

        localStorage.setItem(
            "informativosHoje",
            (new Date()).toLocaleDateString()
        );

    }

}



/* ===========================================================
      CLIQUES
=========================================================== */

btnFechar.addEventListener("click", fecharModal);

modalOverlay.addEventListener("click", (e) => {

    if (e.target === modalOverlay) {

        fecharModal();

    }

});



btnAnterior.addEventListener("click", () => {

    slideAnterior();

});



btnProximo.addEventListener("click", () => {

    proximoSlide();

});



modal.addEventListener("mouseenter", () => {

    pararRotacao();

});



modal.addEventListener("mouseleave", () => {

    iniciarRotacao();

});



/* ===========================================================
    BOTÃO SAIBA MAIS
=========================================================== */

btnLink.addEventListener("click", () => {

    if (informativos.length === 0) {

        return;

    }

    const atual = informativos[indiceAtual];

    if (atual.link) {

        window.open(atual.link, "_blank");

    }

});



/* ===========================================================
    INICIALIZAÇÃO
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    carregarInformativos();

});
/* ===========================================================
      CRIAR INDICADORES
=========================================================== */

function criarIndicadores() {

    indicadores.innerHTML = "";

    informativos.forEach((item, index) => {

        const bolinha = document.createElement("div");

        bolinha.className = "bolinha";

        bolinha.addEventListener("click", () => {

            mostrarSlide(index);

            reiniciarRotacao();

        });

        indicadores.appendChild(bolinha);

    });

}
/* ===========================================================
      MOSTRAR SLIDE
=========================================================== */

function mostrarSlide(indice){

    if(informativos.length===0) return;

    indiceAtual = indice;

    const item = informativos[indice];

    titulo.classList.remove("fade");
    descricao.classList.remove("fade");
    imagem.classList.remove("fade");

    void titulo.offsetWidth;

    titulo.classList.add("fade");
    descricao.classList.add("fade");
    imagem.classList.add("fade");

    titulo.innerHTML = item.titulo;

    descricao.innerHTML = item.descricao;

    if(item.imagem && item.imagem.length>0){

        imagem.src = item.imagem;

        imagem.style.display = "block";

    }else{

        imagem.style.display = "none";

    }

    if(item.botao){

        btnLink.style.display="inline-block";

        btnLink.innerHTML=item.botao;

    }else{

        btnLink.style.display="none";

    }

    atualizarIndicadores();

}
/* ===========================================================
      ATUALIZA INDICADORES
=========================================================== */

function atualizarIndicadores(){

    const lista=document.querySelectorAll(".bolinha");

    lista.forEach((b,index)=>{

        b.classList.remove("ativa");

        if(index===indiceAtual){

            b.classList.add("ativa");

        }

    });

}
/* ===========================================================
      PRÓXIMO SLIDE
=========================================================== */

function proximoSlide(){

    indiceAtual++;

    if(indiceAtual>=informativos.length){

        indiceAtual=0;

    }

    mostrarSlide(indiceAtual);

}
/* ===========================================================
      SLIDE ANTERIOR
=========================================================== */

function slideAnterior(){

    indiceAtual--;

    if(indiceAtual<0){

        indiceAtual=informativos.length-1;

    }

    mostrarSlide(indiceAtual);

}
/* ===========================================================
      INICIAR ROTAÇÃO
=========================================================== */

function iniciarRotacao(){

    pararRotacao();

    iniciarBarra();

    intervaloSlide=setInterval(()=>{

        proximoSlide();

        iniciarBarra();

    },TEMPO_SLIDE);

}
/* ===========================================================
      PARAR ROTAÇÃO
=========================================================== */

function pararRotacao(){

    clearInterval(intervaloSlide);

    clearInterval(intervaloBarra);

}
/* ===========================================================
      REINICIAR ROTAÇÃO
=========================================================== */

function reiniciarRotacao(){

    iniciarRotacao();

}
/* ===========================================================
      BARRA DE PROGRESSO
=========================================================== */

function iniciarBarra(){

    clearInterval(intervaloBarra);

    progresso.style.width="0%";

    let largura=0;

    intervaloBarra=setInterval(()=>{

        largura +=100/(TEMPO_SLIDE/40);

        progresso.style.width=largura+"%";

        if(largura>=100){

            clearInterval(intervaloBarra);

        }

    },40);

}
/* ===========================================================
   SUPORTE AO TECLADO
=========================================================== */

document.addEventListener("keydown", (e) => {

    if (modalOverlay.style.display != "flex") return;

    switch (e.key) {

        case "ArrowRight":
            proximoSlide();
            reiniciarRotacao();
            break;

        case "ArrowLeft":
            slideAnterior();
            reiniciarRotacao();
            break;

        case "Escape":
            fecharModal();
            break;

    }

});
/* ===========================================================
   SWIPE PARA CELULAR
=========================================================== */

let touchInicio = 0;
let touchFim = 0;

modal.addEventListener("touchstart",(e)=>{

    touchInicio = e.changedTouches[0].screenX;

});

modal.addEventListener("touchend",(e)=>{

    touchFim = e.changedTouches[0].screenX;

    if(Math.abs(touchFim-touchInicio)<40){
        return;
    }

    if(touchFim < touchInicio){

        proximoSlide();

    }else{

        slideAnterior();

    }

    reiniciarRotacao();

});
/* ===========================================================
   PRÉ-CARREGAR IMAGENS
=========================================================== */

function preloadImagens(){

    informativos.forEach(item=>{

        if(item.imagem){

            const img = new Image();

            img.src = item.imagem;

        }

    });

}
/* ===========================================================
   CORRIGE IMAGEM INEXISTENTE
=========================================================== */

imagem.addEventListener("error",()=>{

    imagem.style.display="none";

});
/* ===========================================================
   ABRIR LINK COM DUPLO CLIQUE NA IMAGEM
=========================================================== */

imagem.addEventListener("dblclick",()=>{

    if(informativos.length===0) return;

    const item = informativos[indiceAtual];

    if(item.link){

        window.open(item.link,"_blank");

    }

});
/* ===========================================================
   REINICIA O TIMER QUANDO A ABA VOLTA
=========================================================== */

document.addEventListener("visibilitychange",()=>{

    if(document.hidden){

        pararRotacao();

    }else{

        iniciarRotacao();

    }

});
/* ===========================================================
   AJUSTA AO REDIMENSIONAR A TELA
=========================================================== */

window.addEventListener("resize",()=>{

    atualizarIndicadores();

});

