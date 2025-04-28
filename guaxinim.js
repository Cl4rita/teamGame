
const canvas = document.getElementById('canvas').getContext('2d');
canvas.imageSmoothingEnabled = false;

let gameOverImg = new Obj(0, 0, 1300, 600, './assets/gameOverAnimals.png');

let musica_fundo = new Audio('./Sound/musica_fundo.wav');  
let tiros = new Audio('./Sound/som_tiro.wav');  
let death = new Audio('./Sound/som_morte.wav'); 
musica_fundo.loop = true;
musica_fundo.volume = 0.5;
tiros.volume = 0.8;
death.volume = 0.8;

document.getElementById('playMusic').addEventListener('click', () => {
  if(musica_fundo.paused) {
    musica_fundo.play();
    document.getElementById('playMusic').textContent = "♫ on";
  }else{
    musica_fundo.pause();
    tiros.pause();
    death.pause();
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
const FASE_4_PONTOS = 120;
const FASE_5_PONTOS = 160;
const FASE_6_PONTOS = 200;

// Grupos de objetos
let groupShoot = [];
let groupSoldiers = [];

// Fundos por fase
const fundosPorFase = [
    { fundo: "assets/fundo3.png", fundo2: "assets/fundo3_1.png" },
    { fundo: "assets/fundo2.png", fundo2: "assets/fundo2_1.png" },
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
    },
    atualizarFundo(fase) {
        // Usa o operador módulo (%) para ciclar entre as fases disponíveis
        const indice = (fase - 1) % fundosPorFase.length;
        this.bg.image = fundosPorFase[indice].fundo;
        this.bg2.image = fundosPorFase[indice].fundo2;
        this.bg3.image = fundosPorFase[indice].fundo;
    }
};

// Sistema de fases
function atualizarFase() {
    const novaFase = pts >= FASE_6_PONTOS ? 6 : pts >= FASE_5_PONTOS ? 5 : pts >= FASE_4_PONTOS ? 4 : pts >= FASE_3_PONTOS ? 3 : pts >= FASE_2_PONTOS ? 2 : 1;

    if (novaFase !== faseAtual) {
        faseAtual = novaFase;
        infinityBg.atualizarFundo(faseAtual);
        mostrarMensagemFase();
    }
    const faseAnterior = faseAtual;
    faseAtual = pts >= FASE_6_PONTOS ? 6 : 
               pts >= FASE_5_PONTOS ? 5 : 
               pts >= FASE_4_PONTOS ? 4 : 
               pts >= FASE_3_PONTOS ? 3 : 
               pts >= FASE_2_PONTOS ? 2 : 1;

    if (faseAtual !== faseAnterior) {
        infinityBg.atualizarFundo(faseAtual);
        mostrarMensagemFase();
        
        // Aumenta a dificuldade progressivamente
        aumentarDificuldade(faseAtual);
    }
}

function aumentarDificuldade(fase) {
    // Você pode adicionar efeitos especiais para fases específicas
    if (fase === 4) {
        // Exemplo: na fase 4 (que usa o mesmo fundo que a 1), adicione algo especial
        console.log("Fase especial iniciada!");
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
        const spawnRate = faseAtual === 6 ? 10 : faseAtual === 5 ? 20 : faseAtual === 4 ? 30 : faseAtual === 3 ? 40 : faseAtual === 2 ? 50 : 60;

        if (this.time >= spawnRate) {
            const speed = 
                faseAtual === 6 ? 17 + Math.random() * 5 :
                faseAtual === 5 ? 14 + Math.random() * 6 :
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
                death.play();
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

    draw(){
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
            tiros.play()
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
    },
    initTouchControls() {
        const canvasElement = document.getElementById('canvas');
        let touchStartX = 0;
        let touchStartY = 0;
        
        canvasElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            
            // Dispara um tiro no toque
            if (bullets > 0) {
                bullets--;
                tiros.play();
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
        });
        
        canvasElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const moveX = touch.clientX - touchStartX;
            const moveY = touch.clientY - touchStartY;
            
            // Move o personagem proporcionalmente ao movimento do dedo
            this.guaxinim.x += moveX * 2;
            this.guaxinim.y += moveY * 2;
            
            // Limita o movimento dentro da tela
            this.guaxinim.x = Math.max(0, Math.min(1300 - this.guaxinim.width, this.guaxinim.x));
            this.guaxinim.y = Math.max(0, Math.min(600 - this.guaxinim.height, this.guaxinim.y));
            
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });
    },
};
menu.click = function() {
    mudaCena(game);
    game.initTouchControls(); // Adiciona controles touch
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

document.addEventListener("click", (e) => {
    if (cenaCorrente.click) cenaCorrente.click(e);
});
document.addEventListener("touchpress", (e) => {
    if (cenaCorrente.click) cenaCorrente.click(e);
});

document.addEventListener("mousemove", (e) => {
    if (cenaCorrente.moveHeroi) cenaCorrente.moveHeroi(e);
});

mudaCena(menu);
gameLoop();