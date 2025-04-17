// Configuração inicial
const canvas = document.getElementById('canvas').getContext('2d');
canvas.imageSmoothingEnabled = false;

let gameOverImg = new Obj(0, 0, 1300, 600, './assets/gameOverAnimals.png');

let musica_fundo = new Audio('./Sound/musica_fundo.wav');  
musica_fundo.loop = true;  // Faz a música tocar em loop
musica_fundo.volume = 0.5; // Ajusta o volume para 50%

document.getElementById('playMusic').addEventListener('click', () => {
  if (musica_fundo.paused) {
    musica_fundo.play();
    document.getElementById('playMusic').textContent = "♫ on";
  } else {
    musica_fundo.pause();
    document.getElementById('playMusic').textContent = "♫  off";
  }
});

document.addEventListener("click", (e)=>{
  if(cenaCorrente.click){
    cenaCorrente.click()
  }
});
// Variáveis globais
let cenaCorrente = {};
let bullets = 5;
let pts = 0; // Mantenha pts como uma variável global
let faseAtual = 1;
const FASE_2_PONTOS = 40;
const FASE_3_PONTOS = 80;
const FASE_FINAL = 120;

// Grupos de objetos
let groupShoot = [];
let groupSoldiers = [];

// Fundos por fase
const fundosPorFase = [
    { fundo: "assets/fundo3.png", fundo2: "assets/fundo3_1.png" },
    { fundo: "assets/fundo1.png", fundo2: "assets/fundo1_1.png" },
    { fundo: "assets/fundo4.png", fundo2: "assets/fundo4_1.png" }
]

// Objeto de fundo
const infinityBg = {
    bg: new Obj(0, 0, 1300, 600, fundosPorFase[0].fundo),
    bg2: new Obj(-1300, 0, 1300, 600, fundosPorFase[0].fundo2),
    bg3: new Obj(-2600, 0, 1300, 600, fundosPorFase[0].fundo),

    atualizarFundo(fase) {
        const indice = Math.min(fase - 1, fundosPorFase.length - 1);
        this.bg.image = fundosPorFase[indice].fundo;
        this.bg2.image = fundosPorFase[indice].fundo2;
        this.bg3.image = fundosPorFase[indice].fundo;
    },

    draw() {
        this.bg.draw();
        this.bg2.draw();
        this.bg3.draw();
    },

    moveBg() {
        this.bg.x += 1;
        this.bg2.x += 1;
        this.bg3.x += 1;

        if (this.bg.x >= 2600) this.bg.x = 0;
        if (this.bg2.x >= 1300) this.bg2.x = -1300;
        if (this.bg3.x >= 0) this.bg3.x = -2600;
    }
};

// Sistema de fases
function atualizarFase() {
    const novaFase = pts >= FASE_FINAL ? 4 : pts >= FASE_3_PONTOS ? 3 : pts >= FASE_2_PONTOS ? 2 : 1;

    if (novaFase !== faseAtual) {
        faseAtual = novaFase;
        infinityBg.atualizarFundo(faseAtual);
        mostrarMensagemFase();
    }
}

function mostrarMensagemFase() {
    const msg = new Text(`Fase ${faseAtual}!`);
    const originalDraw = cenaCorrente.draw;

    cenaCorrente.draw = function () {
        originalDraw.call(this);
        canvas.fillStyle = "rgba(0, 0, 0, 0.7)";
        canvas.fillRect(500, 250, 300, 100);
        msg.draw_text(50, "Arial", 560, 320, "white");
    };

    setTimeout(() => {
        cenaCorrente.draw = originalDraw;
    }, 1500);
}

// Controle de soldados
const soldiers = {
    time: 0,

    spawnSoldiers() {
        this.time++;
        const spawnRate = faseAtual === 4 ? 30 : faseAtual === 3 ? 40 : faseAtual === 2 ? 50 : 60;

        if (this.time >= spawnRate) {
            const speed = 
                faseAtual === 4 ? 11 + Math.random() * 7 :
                faseAtual === 3 ? 8 + Math.random() * 8 :
                faseAtual === 2 ? 5 + Math.random() * 9 :
                    2 + Math.random() * 10;

            groupSoldiers.push(new Soldiers(
                1400,
                Math.random() * 400 + 100,
                80 + Math.random() * 20,
                80 + Math.random() * 60,
                "assets/ruining_soldier.png",
                speed
            ));
            this.time = 0;
        }
    },

    update() {
        this.spawnSoldiers();

        // Verifica colisões
        groupShoot.forEach((shoot, sIndex) => {
            groupSoldiers.forEach((soldier, oIndex) => {
                if (shoot.collide(soldier)) {
                    groupShoot.splice(sIndex, 1);
                    groupSoldiers.splice(oIndex, 1);
                    bullets = 5;
                    pts++; // Incrementa os pontos aqui
                    return;
                }
            });
        });

        // Remove soldados que saíram da tela e Game Over
        groupSoldiers.forEach((soldier, index) => {
            soldier.move();
            if (soldier.x < -100) {
                groupSoldiers.splice(index, 1);
                mudaCena(gameOver);
            }
        });
    },

    draw() {
        groupSoldiers.forEach(soldier => soldier.draw());
    }
};

// Controle de tiros
const shoots = {
    update() {
        groupShoot.forEach((shoot, index) => {
            shoot.move();
            if (shoot.x > 1400) groupShoot.splice(index, 1);
        });
    },

    draw() {
        groupShoot.forEach(shoot => shoot.draw());
    }
};

// Cenas do jogo
const menu = {
    titulo: new Text("Pixel Battle"),
    subtitulo: new Text("Clique para começar"),
    guaxinim: new Obj(100, 300, 80, 120, "assets/guaxinimShoot_1.png"),

    click() {
        mudaCena(game);
    },

    draw() {
        infinityBg.draw();
        this.titulo.draw_text(72, "Arial", 450, 300, "green");
        this.subtitulo.draw_text(30, "Arial", 490, 350, "lightgreen");
        this.guaxinim.draw();
    },

    update() {
        infinityBg.moveBg();
    }
};

const game = {
    placar: new Text(`Pontos: ${pts} Fase: ${faseAtual}`),
    guaxinim: new Obj(0, 0, 80, 120, "assets/guaxinimShoot_1.png"),

    click(e) {
        if (bullets > 0) {
            bullets--;
            groupShoot.push(new Shoot(
                this.guaxinim.x + this.guaxinim.width,
                this.guaxinim.y + this.guaxinim.height / 2 - 15,
                30, 10,
                "assets/bala_direita.png"
            ));
            
            this.guaxinim.image = "assets/guaxinimShoot_3.png";
            setTimeout(() => {
            this.guaxinim.image = "assets/guaxinimShoot_1.png";
            }, 100); 
        }
    },

    moveHeroi(e) {
        this.guaxinim.x = e.clientX - 350;
        this.guaxinim.y = e.clientY - 200;
    },

    draw() {
        infinityBg.draw();
        this.placar.draw_text(30, "Arial", 1000, 50, "lightblue");
        this.guaxinim.draw();
        shoots.draw();
        soldiers.draw();
    },

    update() {
        infinityBg.moveBg();
        shoots.update();
        soldiers.update();
        atualizarFase();
        this.placar.update_text(`Pontos: ${pts} Fase: ${faseAtual}`);
    }
};

const gameOver = {
    placar: new Text(`Pontos: ${pts} Fase: ${faseAtual}`),
    instrucao: new Text("Clique para recomeçar"),

    draw() {
        gameOverImg.draw();
        this.placar.draw_text(30, "Arial", 1000, 50, "lightblue");
        this.instrucao.draw_text(30, "Arial", 475, 570, "yellow");
    },

    click() {
        bullets = 5;
        groupShoot = [];
        groupSoldiers = [];
        pts = 0; // Reseta os pontos
        faseAtual = 1;
        infinityBg.atualizarFundo(1);
        mudaCena(menu);
    },

    update() {
        infinityBg.moveBg();
        this.placar.update_text(`Pontos: ${pts} Fase: ${faseAtual}`);
    }
};

// Funções globais
function mudaCena(cena) {
    cenaCorrente = cena;
}

// Loop do jogo
function gameLoop() {
    canvas.clearRect(0, 0, 1300, 600);
    cenaCorrente.draw();
    cenaCorrente.update();
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener("click", (e) => {
    if (cenaCorrente.click) cenaCorrente.click(e);
});

document.addEventListener("mousemove", (e) => {
    if (cenaCorrente.moveHeroi) cenaCorrente.moveHeroi(e);
});

mudaCena(menu);
gameLoop();
