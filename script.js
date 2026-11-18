
/*==========================================================
                    O ÚLTIMO SINAL
                      SCRIPT.JS
==========================================================*/

/* ELEMENTOS DO HTML */

const menu = document.getElementById("menu");
const game = document.getElementById("game");

const capaBtn =
    document.getElementById("capaBtn") ||
    document.getElementById("jogarBtn");

const introVideo = document.getElementById("introVideo");
const pularIntro = document.getElementById("pularIntro");

const ctx = game.getContext("2d");
ctx.imageSmoothingEnabled = false;

game.width = window.innerWidth;
game.height = window.innerHeight;

/*==========================================================
                       IMAGENS DO MAPA
==========================================================*/

function carregarImagem(caminho) {
    const img = new Image();
    img.src = caminho;
    img.onerror = () => {
        console.error("Imagem não encontrada:", caminho);
    };
    return img;
}

const fundo = carregarImagem("assets/mapacerto.png");
const fundoFloresta2 = carregarImagem("assets/mapacerto2.png");
const fundoFloresta3 = carregarImagem("assets/mapacerto3.png");
const fundoFloresta4 = carregarImagem("assets/mapa4.png");
const fundoFloresta5 = carregarImagem("assets/mapa5.png");
const fundoFloresta6 = carregarImagem("assets/mapa6.png");
const fundoFloresta7 = carregarImagem("assets/mapa7.png");


const fundo2 = carregarImagem("assets/sub1.png");
const fundo3 = carregarImagem("assets/continue1.png");
const fundo4 = carregarImagem("assets/continue2.png");

const plantaFechadaImg =
    carregarImagem("assets/planta_fechaa.png");

const plantaAbertaImg =
    carregarImagem("assets/planta_abera.png");

const informanteImg =
    carregarImagem("assets/informante1.png");

const balaoImg = carregarImagem("assets/balao.png");
const cristalImg = carregarImagem("assets/cristall.png");

/*==========================================================
                   CRISTAL DO PODER
                  CARREGAR IMAGEM
==========================================================*/

const cristalPoderImg = carregarImagem("assets/cristalpoder.png");
const cristalEvolucaoImg = carregarImagem("assets/cristalevolucao.png");

/*==========================================================
                   GUARDIÃO DA FLORESTA
                    CARREGAR IMAGEM
==========================================================*/

const guardiaoImg = carregarImagem("assets/guardiao.png");


/*==========================================================
                       HUD DO LIAM
                    CARREGAR IMAGEM
==========================================================*/


const plataformaImg = carregarImagem("assets/plataformaboa.png");

const espinho1Img = carregarImagem("assets/espinho1 (2).png");
const espinho2Img = carregarImagem("assets/espinho2 (2).png");

const hudLiamImg = carregarImagem("assets/barra.png");

hudLiamImg.onload = () => {
    console.log("HUD CARREGADO COM SUCESSO!");
};

hudLiamImg.onerror = () => {
    console.error("ERRO: barra.png não encontrada!");
};

/*==========================================================
                 FRAMES DOS MORCEGOS
           ANIMAÇÃO DE VOO - 2 FRAMES
==========================================================*/

const morcegoFrames = [
    carregarImagem("assets/morcego1.png"),
    carregarImagem("assets/morcego2.png")
];

const estalactiteImg =
    carregarImagem("assets/escalatice.png");

/*==========================================================
                 FRAMES DO LIAM
       ALTERE SOMENTE OS NOMES AQUI
==========================================================*/

const nomesFrames = {
    parado: "parado.png",
    andar1: "andar1.png",
    andar2: "andar2.png",
    tras: "tras.png"
};

const playerFrames = {};

for (const nome in nomesFrames) {
    playerFrames[nome] =
        carregarImagem("assets/" + nomesFrames[nome]);
}

/*==========================================================
                   INICIAR JOGO
==========================================================*/


let jogoIniciado = false;

// BOTÃO CRIADORES
document.getElementById("areaCriadores").onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "criadores.html";
};

// BOTÃO CONFIGURAÇÕES
document.getElementById("areaConfiguracoes").onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "configuracoes.html";
};

// BOTÃO JOGAR
capaBtn.onclick = function() {
    menu.style.display = "none";
    game.style.display = "block";
    iniciarJogo();
};


function finalizarIntro() {
    if (introVideo) {
        introVideo.pause();
        introVideo.style.display = "none";
    }

    if (pularIntro) {
        pularIntro.style.display = "none";
    }

    game.style.display = "block";
    iniciarJogo();
}

/*==========================================================
                   FUNÇÃO PRINCIPAL
==========================================================*/

function iniciarJogo() {

    if (jogoIniciado) return;
    jogoIniciado = true;

    /* CONFIGURAÇÕES DO MAPA */

// ALTURA DO CHÃO
// 0.88 = chão a 88% da altura da tela
const ALTURA_CHAO_MAPA = 0.70;

const CHAO = Math.round(game.height * ALTURA_CHAO_MAPA);
const CHAO_PARTE2 = game.height - 150;

    let MAPA_LARGURA = 5000;

    let larguraFloresta1 = 0;
    let larguraFloresta2 = 0;
    let larguraFloresta3 = 0;

    let cameraX = 0;
/* BURACOS DO MAPA */

const buracosMapa1 = [
    { inicio: 365, fim: 450 },
    { inicio: 1648, fim: 1732 }
];

// Posição dos buracos em pixels da imagem mapa1.0.png
// As coordenadas serão convertidas para o tamanho exibido.

let caindoNoBuraco = false;
let mudouDeMapa = false;

    /*======================================================
                         PERSONAGEM
    ======================================================*/
/*==========================================================
                         LIAM
                  POSIÇÃO E CONFIGURAÇÕES
==========================================================*/

const player = {
    x: 100,
    y: CHAO,
    w: 70,
    h: 90,
    hNormal: 80,
    hAgachado: 50,
    speed: 5,
    velY: 0,
    pulando: false,
    agachado: false,
    direcao: "direita"
};

    let invencivel = false;

    /* VIDA E ENERGIA */

    const vidasMaximas = 5;
    let vidas = 5;

    const energiaMaxima = 100;
    let energia = 100;

    /* INFORMANTE */
/* INFORMANTE */

const informante = {
    x: 2400,
    y: CHAO - 110,
    w: 85,
    h: 110
};

    let mostrarFala = false;



    /*==========================================================
                    SISTEMA DOS MORCEGOS
                 POSIÇÕES E CONFIGURAÇÕES
==========================================================*/



const morcegos = [
    { x: 300,  y: CHAO - 300, w: 65, h: 50, velocidade: 2 },
    { x: 600,  y: CHAO - 350, w: 65, h: 50, velocidade: 3 },
    { x: 900,  y: CHAO - 280, w: 65, h: 50, velocidade: 2 },
    { x: 1200, y: CHAO - 400, w: 65, h: 50, velocidade: 3 },
    { x: 1500, y: CHAO - 320, w: 65, h: 50, velocidade: 2 },
    { x: 1800, y: CHAO - 370, w: 65, h: 50, velocidade: 3 },
    { x: 2100, y: CHAO - 300, w: 65, h: 50, velocidade: 2 },
    { x: 2400, y: CHAO - 380, w: 65, h: 50, velocidade: 3 },
    { x: 2700, y: CHAO - 340, w: 65, h: 50, velocidade: 2 },
    { x: 3000, y: CHAO - 400, w: 65, h: 50, velocidade: 3 },
    { x: 3300, y: CHAO - 290, w: 65, h: 50, velocidade: 2 },
    { x: 3600, y: CHAO - 360, w: 65, h: 50, velocidade: 3 }
];

/*==========================================================
                   CRISTAL DO PODER
                POSIÇÃO NA FLORESTA
==========================================================*/
const cristalPoder = {
    x: 6635,
    y: CHAO - 300,
    w: 65,
    h: 65,
    coletado: false
};
/*==========================================================
                   PULSO DE ENERGIA
                 CONTROLE DO PODER
==========================================================*/

let pulsoDesbloqueado = false;
let tempoAvisoPoder = -1;

/*==========================================================
                   PULSO DE ENERGIA
              CONFIGURAÇÕES DO PROJÉTIL
==========================================================*/

const projeteis = [];

const configuracaoPulso = {
    velocidade: 12,
    tamanho: 25,
    dano: 1,
    custoEnergia: 10,
    intervaloDisparo: 350
};

let ultimoDisparo = 0;



/*==========================================================
                   GUARDIÃO DA FLORESTA
                  CONFIGURAÇÃO E MOVIMENTO
==========================================================*/
const guardiao = {
    x: 8400,
    y: CHAO + 20,
    w: 130,
    h: 150,

    vida: 5,
    vidaMaxima: 5,
    derrotado: false,

    velocidade: 2.5,
    direcao: -1,
    limiteEsquerdo: 8300,
limiteDireito: 8500
};


// CRISTAL DE CURA
const cristalCura = {
    x: 0,
    y: 0,
    w: 40,
    h: 40,
    ativo: false,
    coletado: false
};


// DISPAROS DO GUARDIÃO
const tirosGuardiao = [];
let ultimoTiroGuardiao = 0;
const intervaloTiroGuardiao = 900;

    /* PLANTA HOSTIL */

    const plantaHostil1 = {
        x: 3200,
        y: CHAO - 5,
        w: 90,
        h: 90,
        acordada: false,
        distanciaAtivacao: 350
    };

    /* CRISTAIS */

    const cristal1 = {
        x: 900,
        y: CHAO_PARTE2 - 80,
        w: 60,
        h: 60,
        coletado: false
    };

    const cristal2 = {
        x: 2000,
        y: CHAO_PARTE2 - 120,
        w: 60,
        h: 60,
        coletado: false
    };

    const cristal3 = {
        x: 3200,
        y: CHAO_PARTE2 - 80,
        w: 60,
        h: 60,
        coletado: false
    };

    const cristais = [cristal1, cristal2, cristal3];

    let cristaisColetados = 0;

    /* ESTALACTITE */

    const estalactite1 = {
        x: 2500,
        y: 40,
        w: 45,
        h: 120,
        velocidade: 9,
        ativa: false,
        caiu: false
    };

   /* PLATAFORMAS DA FLORESTA */

const plataformasFinal = [
    { x: 5900, y: CHAO - 70, w: 190, h: 45 },
    { x: 6120, y: CHAO - 130, w: 190, h: 45 },
    { x: 6340, y: CHAO - 190, w: 190, h: 45 },
    { x: 6560, y: CHAO - 250, w: 220, h: 45 }
];

/* ESPINHOS ANIMADOS */

const espinhos = {
    x: 5970,
    y: CHAO + 25,
    w: 850,
    hRecolhido: 20,
    hEstendido: 100
};

/*======================================================
                         ANIMAÇÃO
    ======================================================*/

    let frameAtual = 0;
    let contadorFrame = 0;

    const velocidadeAnimacao = 8;

    /*======================================================
                         CONTROLES
    ======================================================*/

    const keys = {};

    document.addEventListener("keydown", (e) => {

        const tecla = e.key.toLowerCase();
        keys[tecla] = true;



         /*==========================================================
                     PULSO DE ENERGIA
                   DISPARAR COM TECLA F
    ==========================================================*/

    if (tecla === "f" && pulsoDesbloqueado && !e.repeat) {

        const agora = performance.now();

        if (
            agora - ultimoDisparo >= configuracaoPulso.intervaloDisparo &&
            energia >= configuracaoPulso.custoEnergia
        ) {

            energia -= configuracaoPulso.custoEnergia;
            ultimoDisparo = agora;

            const direcaoPulso =
                player.direcao === "direita" ? 1 : -1;

            projeteis.push({
                x: player.x + (direcaoPulso === 1 ? player.w : -25),
                y: player.y - player.h / 2,
                w: configuracaoPulso.tamanho,
                h: configuracaoPulso.tamanho,
                velocidade: configuracaoPulso.velocidade * direcaoPulso,
                dano: configuracaoPulso.dano
            });
        }
    }


        if (
            ["arrowup", "arrowdown", "arrowleft",
             "arrowright", " "].includes(tecla)
        ) {
            e.preventDefault();
        }

        const querPular =
            tecla === "w" ||
            tecla === "arrowup" ||
            tecla === " ";

        if (
            querPular &&
            !player.pulando &&
            !player.agachado
        ) {
            player.velY = -15;
            player.pulando = true;
        }
    });

    document.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener("blur", () => {
        for (const tecla in keys) {
            keys[tecla] = false;
        }
    });



    /*======================================================
                      FUNÇÕES AUXILIARES
    ======================================================*/

    function imagemPronta(img) {
        return img && img.complete && img.naturalWidth > 0;
    }

    function colisao(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y - a.h < b.y + b.h &&
            a.y > b.y
        );
    }

    function desenharImagem(img, x, y, w, h) {
        if (imagemPronta(img)) {
            ctx.drawImage(img, x, y, w, h);
        }
    }

  function larguraFundo(img) {
    if (!imagemPronta(img)) return 0;

    return img.naturalWidth *
        (game.height / img.naturalHeight);
}
function estaSobreBuraco() {
    if (mudouDeMapa || !imagemPronta(fundo)) {
        return false;
    }

    const escala = larguraFundo(fundo) / 2048;

    const centroLiam = player.x + player.w / 2;

    return buracosMapa1.some(buraco => {
        const inicio = buraco.inicio * escala;
        const fim = buraco.fim * escala;

        return centroLiam > inicio && centroLiam < fim;
    });
}

    /*======================================================
                       LOOP DO JOGO
    ======================================================*/



    function desenharVidasHUD(hudX, hudY, hudW, hudH) {

    const indicadores = [
        { x: 718, y: 388, w: 144, h: 56 },
        { x: 915, y: 356, w: 145, h: 88 },
        { x: 1112, y: 325, w: 145, h: 119 },
        { x: 1311, y: 292, w: 145, h: 152 },
        { x: 1509, y: 254, w: 151, h: 190 }
    ];

    const escalaX = hudW / 2048;
    const escalaY = hudH / 677;

    ctx.save();
    ctx.fillStyle = "#09030f";

    for (let i = Math.max(0, vidas); i < 5; i++) {
        const b = indicadores[i];

        ctx.fillRect(
    hudX + (b.x - 6) * escalaX,
    hudY + (b.y - 6) * escalaY,
    (b.w + 12) * escalaX,
    (b.h + 12) * escalaY
);
    }

    ctx.restore();
}

    function loop() {

        ctx.clearRect(0, 0, game.width, game.height);
        ctx.imageSmoothingEnabled = false;

        /* MOVIMENTO */

        const esquerda = keys["a"] || keys["arrowleft"];
        const direita = keys["d"] || keys["arrowright"];
       player.agachado = false;
player.h = player.hNormal;

        let estaAndando = false;

        if (!player.agachado) {

            if (esquerda && !direita) {
                player.x -= player.speed;
                player.direcao = "esquerda";
                estaAndando = true;
            }

            if (direita && !esquerda) {
                player.x += player.speed;
                player.direcao = "direita";
                estaAndando = true;
            }
        }

        player.x = Math.max(0, player.x);

        /* GRAVIDADE */

        const gravidade = 0.8;
        const yAnterior = player.y;

        player.velY += gravidade;
        player.y += player.velY;

        let pousouNaPlataforma = false;

        /* COLISÃO COM PLATAFORMAS */

        if (!mudouDeMapa && player.velY >= 0) {

            for (const plataforma of plataformasFinal) {

                const dentro =
                    player.x + player.w > plataforma.x &&
                    player.x < plataforma.x + plataforma.w;

                const pousando =
                    yAnterior <= plataforma.y &&
                    player.y >= plataforma.y;

                if (dentro && pousando) {
                    player.y = plataforma.y;
                    player.velY = 0;
                    player.pulando = false;
                    pousouNaPlataforma = true;
                    break;
                }
            }
        }

        /* CHÃO */

        const chaoAtual = mudouDeMapa
            ? CHAO_PARTE2
            : CHAO;
const sobreBuraco = estaSobreBuraco();

        if (
            !sobreBuraco &&
            !caindoNoBuraco &&
            !pousouNaPlataforma &&
            player.y >= chaoAtual
        ) {
            player.y = chaoAtual;
            player.velY = 0;
            player.pulando = false;
        }

        

       if (
    !mudouDeMapa &&
    player.y - player.h > game.height
) {
    player.x = 100;
    player.y = CHAO;
    player.velY = 0;
    player.pulando = false;
    caindoNoBuraco = false;
    cameraX = 0;
}
        /* PLANTA HOSTIL */

        if (!mudouDeMapa) {

            const centroLiam = player.x + player.w / 2;
            const centroPlanta =
                plantaHostil1.x + plantaHostil1.w / 2;

            plantaHostil1.acordada =
                Math.abs(centroLiam - centroPlanta) <
                plantaHostil1.distanciaAtivacao;

            const colidiuPlanta =
                colisao(player, plantaHostil1);

            if (
                plantaHostil1.acordada &&
                colidiuPlanta &&
                !invencivel
            ) {
                invencivel = true;
                player.velY = -4;

                setTimeout(() => {
                    invencivel = false;
                }, 700);
            }
        }

        /* ESTALACTITE */

        if (mudouDeMapa) {

            if (
                !estalactite1.ativa &&
                player.x > estalactite1.x - 250
            ) {
                estalactite1.ativa = true;
            }

            if (
                estalactite1.ativa &&
                !estalactite1.caiu
            ) {
                estalactite1.y += estalactite1.velocidade;
            }

            if (
                estalactite1.y + estalactite1.h >=
                CHAO_PARTE2
            ) {
                estalactite1.y =
                    CHAO_PARTE2 - estalactite1.h;

                estalactite1.caiu = true;
            }
        }


        /*==========================================================
                   CRISTAL DO PODER
             COLETA E DESBLOQUEIO
==========================================================*/

if (!mudouDeMapa && !cristalPoder.coletado) {

    if (colisao(player, cristalPoder)) {

        cristalPoder.coletado = true;

        pulsoDesbloqueado = true;
      
        tempoAvisoPoder = performance.now();

        console.log("PULSO DE ENERGIA DESBLOQUEADO!");
    }
}

        /* COLETAR CRISTAIS */

        if (mudouDeMapa) {
            for (const cristal of cristais) {

                if (
                    !cristal.coletado &&
                    colisao(player, cristal)
                ) {
                    cristal.coletado = true;
                    cristaisColetados++;
                }
            }
        }

        /* INFORMANTE */

        mostrarFala =
            !mudouDeMapa &&
            Math.abs(player.x - informante.x) < 300;

        /*==================================================
                         ANIMAÇÃO DO LIAM
        ==================================================*/

        if (estaAndando) {
            contadorFrame++;

            if (contadorFrame >= velocidadeAnimacao) {
                frameAtual = (frameAtual + 1) % 2;
                contadorFrame = 0;
            }
        } else {
            frameAtual = 0;
            contadorFrame = 0;
        }

        let imagemAtual = playerFrames.parado;

        if (estaAndando) {

            if (player.direcao === "esquerda") {
                imagemAtual = playerFrames.tras;
            } else {
                imagemAtual = frameAtual === 0
                    ? playerFrames.andar1
                    : playerFrames.andar2;
            }
        } else if (player.direcao === "esquerda") {
            imagemAtual = playerFrames.tras;
        }

        /*==================================================
                         CÂMERA E MAPA
        ==================================================*/

        if (!mudouDeMapa) {

            larguraFloresta1 = larguraFundo(fundo);
            larguraFloresta2 = larguraFundo(fundoFloresta2);
            larguraFloresta3 = larguraFundo(fundoFloresta3);

         const larguraTotal =
    larguraFloresta1 +
    larguraFloresta2 +
    larguraFloresta3 +
    larguraFundo(fundoFloresta4) +
    larguraFundo(fundoFloresta5) +
    larguraFundo(fundoFloresta6) +
    larguraFundo(fundoFloresta7);

            if (larguraTotal > 0) {
                MAPA_LARGURA = larguraTotal;
            }

        } else {

            const larguraTotal =
                larguraFundo(fundo2) +
                larguraFundo(fundo3) +
                larguraFundo(fundo4);

            if (larguraTotal > 0) {
                MAPA_LARGURA = larguraTotal;
            }
        }

        cameraX =
            player.x - (game.width / 2 - player.w / 2);

        cameraX = Math.max(
            0,
            Math.min(
                cameraX,
                Math.max(0, MAPA_LARGURA - game.width)
            )
        );

        /* DESENHAR FLORESTA */

        if (!mudouDeMapa) {

            desenharImagem(
                fundo,
                -cameraX,
                0,
                larguraFloresta1,
                game.height
            );

            desenharImagem(
                fundoFloresta2,
                larguraFloresta1 - cameraX,
                0,
                larguraFloresta2,
                game.height
            );

            desenharImagem(
                fundoFloresta3,
                larguraFloresta1 + larguraFloresta2 -
                    cameraX,
                0,
                larguraFloresta3,
                game.height
            );

            // MAPA 4
desenharImagem(
    fundoFloresta4,
    larguraFloresta1 + larguraFloresta2 +
    larguraFloresta3 - cameraX,
    0,
    larguraFundo(fundoFloresta4),
    game.height
);

// MAPA 5
desenharImagem(
    fundoFloresta5,
    larguraFloresta1 + larguraFloresta2 +
    larguraFloresta3 +
    larguraFundo(fundoFloresta4) - cameraX,
    0,
    larguraFundo(fundoFloresta5),
    game.height
);

// MAPA 6
desenharImagem(
    fundoFloresta6,
    larguraFloresta1 +
    larguraFloresta2 +
    larguraFloresta3 +
    larguraFundo(fundoFloresta4) +
    larguraFundo(fundoFloresta5) - cameraX,
    0,
    larguraFundo(fundoFloresta6),
    game.height
);

// MAPA 7
desenharImagem(
    fundoFloresta7,
    larguraFloresta1 +
    larguraFloresta2 +
    larguraFloresta3 +
    larguraFundo(fundoFloresta4) +
    larguraFundo(fundoFloresta5) +
    larguraFundo(fundoFloresta6) - cameraX,
    0,
    larguraFundo(fundoFloresta7),
    game.height
);

        } else {

            /* DESENHAR SUBTERRÂNEO */

            const larguraSub1 = larguraFundo(fundo2);
            const larguraContinue1 = larguraFundo(fundo3);
            const larguraContinue2 = larguraFundo(fundo4);

            desenharImagem(
                fundo2,
                -cameraX,
                0,
                larguraSub1,
                game.height
            );

            desenharImagem(
                fundo3,
                larguraSub1 - cameraX,
                0,
                larguraContinue1,
                game.height
            );

            desenharImagem(
                fundo4,
                larguraSub1 + larguraContinue1 - cameraX,
                0,
                larguraContinue2,
                game.height
            );
        }


        /*==========================================================
                   CRISTAL DO PODER
                 DESENHAR NA FLORESTA
==========================================================*/

if (!mudouDeMapa && !cristalPoder.coletado) {

    desenharImagem(
        cristalPoderImg,
        cristalPoder.x - cameraX,
        cristalPoder.y,
        cristalPoder.w,
        cristalPoder.h
    );
}

        /*==================================================
                        DESENHAR CRISTAIS
        ==================================================*/

        if (mudouDeMapa) {
            for (const cristal of cristais) {
                if (!cristal.coletado) {
                    desenharImagem(
                        cristalImg,
                        cristal.x - cameraX,
                        cristal.y,
                        cristal.w,
                        cristal.h
                    );
                }
            }
        }



       /*==========================================================
                  SISTEMA DOS MORCEGOS
              VOO POR TODA A FLORESTA
==========================================================*/

if (!mudouDeMapa) {

    const frameMorcego = Math.floor(performance.now() / 180) % 2;

    for (const morcego of morcegos) {

        if (morcego.direcao === undefined) {
            morcego.direcao = 1;
        }

        if (morcego.origemY === undefined) {
            morcego.origemY = morcego.y;
        }

        // Movimento horizontal contínuo
        morcego.x += morcego.velocidade * morcego.direcao;

        // Inverte a direção nas extremidades
        if (morcego.x >= MAPA_LARGURA - morcego.w) {
            morcego.x = MAPA_LARGURA - morcego.w;
            morcego.direcao = -1;
        }

        if (morcego.x <= 0) {
            morcego.x = 0;
            morcego.direcao = 1;
        }

        // Movimento vertical suave
        morcego.y = morcego.origemY +
            Math.sin(performance.now() / 400 + morcego.x / 100) * 15;

        // Animação e desenho
        ctx.save();

        if (morcego.direcao === -1) {
            ctx.translate(morcego.x - cameraX + morcego.w, 0);
            ctx.scale(-1, 1);

            desenharImagem(
                morcegoFrames[frameMorcego],
                0,
                morcego.y,
                morcego.w,
                morcego.h
            );

        } else {
            desenharImagem(
                morcegoFrames[frameMorcego],
                morcego.x - cameraX,
                morcego.y,
                morcego.w,
                morcego.h
            );
        }

        ctx.restore();
    }
}

        /*==================================================
                       DESENHAR PLANTA
        ==================================================*/

        if (!mudouDeMapa) {

            const imagemPlanta =
                plantaHostil1.acordada
                    ? plantaAbertaImg
                    : plantaFechadaImg;

            ctx.save();

            if (plantaHostil1.acordada) {
                ctx.shadowColor =
                    "rgba(120, 60, 200, 0.9)";
                ctx.shadowBlur = 25;
            }

            desenharImagem(
                imagemPlanta,
                plantaHostil1.x - cameraX,
                plantaHostil1.y,
                plantaHostil1.w,
                plantaHostil1.h
            );

            ctx.restore();
        }

        /*==================================================
                         INFORMANTE
        ==================================================*/

        if (!mudouDeMapa) {

            desenharImagem(
                informanteImg,
                informante.x - cameraX,
                informante.y,
                informante.w,
                informante.h
            );
        }

        /* BALÃO DE FALA */

        if (!mudouDeMapa && mostrarFala) {

            const balaoX =
                informante.x - cameraX - 140;

            const balaoY = informante.y - 190;
            const balaoW = 560;
            const balaoH = 190;

            desenharImagem(
                balaoImg,
                balaoX,
                balaoY,
                balaoW,
                balaoH
            );

            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "16px Courier New";

            ctx.fillText(
                "Você acordou longe de onde deveria estar...",
                balaoX + 55,
                balaoY + 85
            );

            ctx.fillText(
                "Siga pela floresta. As respostas estão adiante.",
                balaoX + 55,
                balaoY + 100
            );

            ctx.restore();
        }

        /* ESTALACTITE */

        if (mudouDeMapa) {
            desenharImagem(
                estalactiteImg,
                estalactite1.x - cameraX,
                estalactite1.y,
                estalactite1.w,
                estalactite1.h
            );
        }



        /*==========================================================
                   PULSO DE ENERGIA
              MOVIMENTO E EFEITO VISUAL
==========================================================*/

for (let i = projeteis.length - 1; i >= 0; i--) {

    const projetil = projeteis[i];

    // Movimentar a esfera
    projetil.x += projetil.velocidade;

    /*==========================================================
                   GUARDIÃO DA FLORESTA
                 DANO DO PULSO DE ENERGIA
==========================================================*/

if (!mudouDeMapa && !guardiao.derrotado) {

    const acertouGuardiao =
        projetil.x < guardiao.x + guardiao.w &&
        projetil.x + projetil.w > guardiao.x &&
        projetil.y < guardiao.y &&
        projetil.y + projetil.h > guardiao.y - guardiao.h;

    if (acertouGuardiao) {

        // Retira vida do Guardião
        guardiao.vida -= projetil.dano;

        // Remove o projétil após o acerto
        projeteis.splice(i, 1);

        // Verifica se o Guardião foi derrotado
if (guardiao.vida <= 0) {
    guardiao.vida = 0;
    guardiao.derrotado = true;

    // SOLTAR CRISTAL DE CURA
    cristalCura.x = guardiao.x + guardiao.w / 2 - 20;
    cristalCura.y = CHAO - 40;
    cristalCura.ativo = true;
}

        continue;
    }
}

    // Remover quando sair do mapa
    if (projetil.x < 0 || projetil.x > MAPA_LARGURA) {
        projeteis.splice(i, 1);
        continue;
    }

    // Desenhar esfera de energia roxa
    ctx.save();

    const centroX = projetil.x - cameraX + projetil.w / 2;
    const centroY = projetil.y + projetil.h / 2;

    ctx.shadowColor = "#a020f0";
    ctx.shadowBlur = 20;

    const brilho = ctx.createRadialGradient(
        centroX, centroY, 2,
        centroX, centroY, projetil.w
    );

    brilho.addColorStop(0, "#ffffff");
    brilho.addColorStop(0.3, "#d88aff");
    brilho.addColorStop(0.7, "#8a2be2");
    brilho.addColorStop(1, "rgba(100,0,200,0)");

    ctx.fillStyle = brilho;

    ctx.beginPath();
    ctx.arc(
        centroX,
        centroY,
        projetil.w,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}

/*==========================================================
                  AVISO DE MISSÃO
             O SEGREDO DO GUARDIÃO
==========================================================*/

if (
    !mudouDeMapa &&
    player.x > informante.x + 250 &&
    player.x < informante.x + 1400 &&
    !cristalPoder.coletado
) {

    ctx.save();

    // Fundo escuro da mensagem
    const avisoLargura = Math.min(560, game.width - 40);
    const avisoAltura = 105;
    const avisoX = (game.width - avisoLargura) / 2;
    const avisoY = 45;

    ctx.fillStyle = "rgba(10, 5, 25, 0.88)";
    ctx.fillRect(
        avisoX,
        avisoY,
        avisoLargura,
        avisoAltura
    );

    // Borda roxa
    ctx.strokeStyle = "#9b4dff";
    ctx.lineWidth = 2;
    ctx.strokeRect(
        avisoX,
        avisoY,
        avisoLargura,
        avisoAltura
    );

    // Título
    ctx.textAlign = "center";
    ctx.fillStyle = "#c38aff";
    ctx.font = "bold 19px Arial";

    ctx.fillText(
        "NOVA MISSÃO",
        game.width / 2,
        avisoY + 30
    );

    // Mensagem
    ctx.fillStyle = "#ffffff";
    ctx.font = "15px Arial";

    ctx.fillText(
        "O Guardião da Floresta está adiante.",
        game.width / 2,
        avisoY + 60
    );

    ctx.fillText(
        "Encontre o cristal e desperte seu poder!",
        game.width / 2,
        avisoY + 85
    );

    ctx.restore();
}

/*==========================================================
                   GUARDIÃO DA FLORESTA
                    MOVIMENTO AUTOMÁTICO
==========================================================*/

if (!mudouDeMapa && !guardiao.derrotado) {

    guardiao.x += guardiao.velocidade * guardiao.direcao;

    if (guardiao.x <= guardiao.limiteEsquerdo) {
        guardiao.x = guardiao.limiteEsquerdo;
        guardiao.direcao = 1;
    }

    if (guardiao.x >= guardiao.limiteDireito) {
        guardiao.x = guardiao.limiteDireito;
        guardiao.direcao = -1;
    }
}

/*==========================================================
                   GUARDIÃO DA FLORESTA
                   DESENHAR NO MAPA
==========================================================*/

if (!mudouDeMapa && !guardiao.derrotado) {

    // Desenhar o Guardião com os pés no chão
   /*==========================================================
                   GUARDIÃO DA FLORESTA
                    VIRAR AO CAMINHAR
==========================================================*/

ctx.save();

if (imagemPronta(guardiaoImg)) {

    const xTela = guardiao.x - cameraX;

    if (guardiao.direcao === 1) {

        ctx.translate(xTela + guardiao.w, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(
            guardiaoImg,
            0,
            guardiao.y - guardiao.h,
            guardiao.w,
            guardiao.h
        );

    } else {

        ctx.drawImage(
            guardiaoImg,
            xTela,
            guardiao.y - guardiao.h,
            guardiao.w,
            guardiao.h
        );
    }
}

ctx.restore();

    /*======================================================
                  BARRA DE VIDA DO GUARDIÃO
    ======================================================*/

    const barraX = guardiao.x - cameraX;
    const barraY = guardiao.y - guardiao.h - 25;
    const barraLargura = guardiao.w;

    // Fundo da barra
    ctx.fillStyle = "#222222";
    ctx.fillRect(barraX, barraY, barraLargura, 10);

    // Vida restante
    ctx.fillStyle = "#9b4dff";
    ctx.fillRect(
        barraX,
        barraY,
        barraLargura * (guardiao.vida / guardiao.vidaMaxima),
        10
    );
} 


/*==========================================================
                DESENHAR PLATAFORMAS
==========================================================*/

if (!mudouDeMapa) {
    
    for (const plataforma of plataformasFinal) {

        if (imagemPronta(plataformaImg)) {

            ctx.drawImage(
                plataformaImg,
                plataforma.x - cameraX,
                plataforma.y,
                plataforma.w,
                plataforma.h
            );

        }
    }
}

/* ESPINHOS - ARMADILHA RETRÁTIL */

const ciclo = (performance.now() % 2400) / 2400;

let crescimento;

if (ciclo < 0.30) {
    // Ficam escondidos
    crescimento = 0;

} else if (ciclo < 0.38) {
    // Disparam rapidamente para cima
    crescimento = (ciclo - 0.30) / 0.08;

} else if (ciclo < 0.75) {
    // Permanecem levantados
    crescimento = 1;

} else if (ciclo < 0.88) {
    // Recolhem
    crescimento = 1 - (ciclo - 0.75) / 0.13;

} else {
    crescimento = 0;
}

const alturaEspinhos =
    espinhos.hRecolhido +
    crescimento *
    (espinhos.hEstendido - espinhos.hRecolhido);


    /* DANO DOS ESPINHOS */

const tocouEspinhos =
    !mudouDeMapa &&
    crescimento > 0.25 &&
    player.x + player.w > espinhos.x &&
    player.x < espinhos.x + espinhos.w &&
    player.y > espinhos.y - alturaEspinhos &&
    player.y - player.h < espinhos.y;

if (tocouEspinhos && !invencivel) {

    vidas = Math.max(0, vidas - 1);
    invencivel = true;

    // Voltar para antes do obstáculo
    player.x = espinhos.x - 160;
    player.y = CHAO;
    player.velY = 0;
    player.pulando = false;

    setTimeout(() => {
        invencivel = false;
    }, 1000);
}

// ATAQUES DO GUARDIÃO
if (!mudouDeMapa && !guardiao.derrotado) {

    const agora = performance.now();
    const distancia = Math.abs(player.x - guardiao.x);

    if (
        distancia < 650 &&
        agora - ultimoTiroGuardiao > intervaloTiroGuardiao
    ) {
        ultimoTiroGuardiao = agora;

        const origemX = guardiao.x + guardiao.w / 2;
        const origemY = guardiao.y - guardiao.h / 2;

        const alvoX = player.x + player.w / 2;
        const alvoY = player.y - player.h / 2;

        const dx = alvoX - origemX;
        const dy = alvoY - origemY;
        const comprimento = Math.hypot(dx, dy) || 1;

        tirosGuardiao.push({
            x: origemX,
            y: origemY,
            w: 20,
            h: 20,
            vx: (dx / comprimento) * 7,
            vy: (dy / comprimento) * 7
        });
    }
}

// MOVIMENTO, DESENHO E DANO DOS TIROS
for (let i = tirosGuardiao.length - 1; i >= 0; i--) {

    const tiro = tirosGuardiao[i];

    tiro.x += tiro.vx;
    tiro.y += tiro.vy;

    ctx.save();
    ctx.shadowColor = "#a020f0";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#b84dff";

    ctx.beginPath();
    ctx.arc(
        tiro.x - cameraX,
        tiro.y,
        10,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    const acertou =
        tiro.x + tiro.w > player.x &&
        tiro.x < player.x + player.w &&
        tiro.y + tiro.h > player.y - player.h &&
        tiro.y < player.y;

    if (acertou) {
        if (!invencivel) {
            vidas = Math.max(0, vidas - 1);
            invencivel = true;

            setTimeout(() => {
                invencivel = false;
            }, 1000);
        }

        tirosGuardiao.splice(i, 1);
        continue;
    }

    if (
        tiro.x < 0 ||
        tiro.x > MAPA_LARGURA ||
        tiro.y < 0 ||
        tiro.y > game.height
    ) {
        tirosGuardiao.splice(i, 1);
    }
}


/* CRISTAL DE CURA DO GUARDIÃO */

if (!mudouDeMapa && cristalCura.ativo && !cristalCura.coletado) {

    const x = cristalCura.x - cameraX + 20;
    const y = cristalCura.y + 20 +
        Math.sin(performance.now() / 250) * 5;

    // DESENHAR CRISTAL VERDE
    ctx.save();

    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 25;
    ctx.fillStyle = "#00ff88";

    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 15, y);
    ctx.lineTo(x, y + 20);
    ctx.lineTo(x - 15, y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // COLETAR E RECUPERAR A VIDA
    if (colisao(player, cristalCura)) {

        cristalCura.coletado = true;
        cristalCura.ativo = false;

        vidas = vidasMaximas;

        console.log("VIDA RESTAURADA!");
    }
}


// AVISO DO PODER
if (
    tempoAvisoPoder >= 0 &&
    performance.now() - tempoAvisoPoder < 6000
) {
    ctx.save();

    const x = game.width / 2;

    ctx.fillStyle = "rgba(10, 5, 25, 0.9)";
    ctx.fillRect(x - 260, 35, 520, 105);

    ctx.strokeStyle = "#a020f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 260, 35, 520, 105);

    ctx.textAlign = "center";
    ctx.fillStyle = "#c38aff";
    ctx.font = "bold 23px Arial";
   ctx.fillText("PODER DESBLOQUEADO!", x, 65);

ctx.font = "16px Arial";
ctx.fillStyle = "#ffffff";

ctx.fillText("Derrote o Guardião da Floresta!", x, 95);
ctx.fillText("Pressione F para disparar seu poder.", x, 120);
    ctx.restore();
}

const imagemEspinhos =
    crescimento < 0.5 ? espinho1Img : espinho2Img;

if (imagemPronta(imagemEspinhos)) {
    ctx.drawImage(
        imagemEspinhos,
        espinhos.x - cameraX,
        espinhos.y - alturaEspinhos,
        espinhos.w,
        alturaEspinhos
    );
}

        /*==================================================
                       DESENHAR LIAM
        ==================================================*/

        if (imagemPronta(imagemAtual)) {

    ctx.drawImage(
        imagemAtual,
        player.x - cameraX,
        player.y - player.h + 25,
        player.w,
        player.h
    );
}

/*==========================================================
                       HUD DO LIAM
                    NOVA INTERFACE
==========================================================*/

if (imagemPronta(hudLiamImg)) {

    const hudX = 15;
    const hudY = 15;
    const hudW = 380;
    const hudH = 130;

    ctx.drawImage(
        hudLiamImg,
        hudX,
        hudY,
        hudW,
        hudH
    );

    desenharVidasHUD(hudX, hudY, hudW, hudH);
}


        /*==================================================
                       HUD DOS CRISTAIS
        ==================================================*/

        if (mudouDeMapa && cristaisColetados > 0) {

            const tamanhoCristal = 38;
            const hudX = game.width - 105;
            const hudY = 28;

            desenharImagem(
                cristalImg,
                hudX,
                hudY,
                tamanhoCristal,
                tamanhoCristal
            );

            ctx.save();

            ctx.font = "bold 20px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";

            ctx.fillText(
                `${cristaisColetados} / 3`,
                hudX + 49,
                hudY + 21
            );

            ctx.fillStyle =
                "rgba(235, 248, 255, 0.95)";

            ctx.fillText(
                `${cristaisColetados} / 3`,
                hudX + 48,
                hudY + 20
            );

            ctx.restore();
        }

        /* PRÓXIMO FRAME */

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

/*==========================================================
                      REDIMENSIONAR
==========================================================*/

window.addEventListener("resize", () => {
    game.width = window.innerWidth;
    game.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
});