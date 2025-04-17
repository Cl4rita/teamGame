const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurações iniciais
let gameActive = true;
let pontosAnimal = 0;
let pontosSoldado = 0;
const pontosParaVencer = 5;

// Defina as listas de imagens PRIMEIRO
const imagensAnimais = ["assets/guaxinimShoot_1.png", "assets/capivaraRight.png"];
const imagensSoldados = ["assets/soldier3.png", "assets/pinkSoldier.png"];

// Obtenha as seleções do localStorage
const animalSelecionado = parseInt(localStorage.getItem("animalSelecionado")) || 0;
const soldadoSelecionado = parseInt(localStorage.getItem("soldadoSelecionado")) || 0;

// Inicialize os objetos de imagem
const backgroundImg = new Obj(0, 0, canvas.width, canvas.height, './assets/bg_1v1.png');
const gameOverImg = new Obj(0, 0, canvas.width, canvas.height, './assets/gameOverAnimals.png');

// Personagens
const animal = {
  x: 50,
  y: 250,
  width: 80,
  height: 80,
  img: new Image(),
  velocidade: 8,
  vidas: 3
};
animal.img.src = imagensAnimais[animalSelecionado]; // Só uma atribuição

const soldado = {
  x: 1170,
  y: 250,
  width: 80,
  height: 80,
  img: new Image(),
  velocidade: 8,
  vidas: 3
};
soldado.img.src = imagensSoldados[soldadoSelecionado]; // Só uma atribuição

// Controles
const teclas = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false
};

// Sistema de áudio
let musica_fundo = new Audio('./Sound/musica_fundo.wav');
musica_fundo.loop = true;
musica_fundo.volume = 0.5;

document.getElementById('playMusic').addEventListener('click', () => {
  if (musica_fundo.paused) {
    musica_fundo.play();
    document.getElementById('playMusic').textContent = "♫ on";
  } else {
    musica_fundo.pause();
    document.getElementById('playMusic').textContent = "♫ off";
  }
});

animal.img.src = imagensAnimais[animalSelecionado];
soldado.img.src = imagensSoldados[soldadoSelecionado];

console.log("Animal selecionado:", animalSelecionado, "Imagem:", imagensAnimais[animalSelecionado]);
console.log("Soldado selecionado:", soldadoSelecionado, "Imagem:", imagensSoldados[soldadoSelecionado]);

let tirosAnimal = [];
let tirosSoldado = [];

document.addEventListener("keydown", (e) => {
  if (['w', 's', 'ArrowUp', 'ArrowDown', ' ', 'Control'].includes(e.key)) {
    teclas[e.key] = true;
  }
  
  // Tiro do animal (barra de espaço)
  if (e.key === ' ' && gameActive) {
    tirosAnimal.push({
      x: animal.x + animal.width,
      y: animal.y + animal.height/2 - 5,
      width: 30,
      height: 10,
      velocidade: 15
    });
  }
  
  // Tiro do soldado (Ctrl)
  if (e.key === 'Control' && gameActive) {
    tirosSoldado.push({
      x: soldado.x - 30,
      y: soldado.y + soldado.height/2 - 5,
      width: 30,
      height: 10,
      velocidade: 15
    });
  }
});

document.addEventListener("keyup", (e) => {
  if (['w', 's', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    teclas[e.key] = false;
  }
});

function update() {
  if (!gameActive) return;

  // Movimento animal
  if (teclas.w) animal.y = Math.max(0, animal.y - animal.velocidade);
  if (teclas.s) animal.y = Math.min(canvas.height - animal.height, animal.y + animal.velocidade);
  
  // Movimento soldado
  if (teclas.ArrowUp) soldado.y = Math.max(0, soldado.y - soldado.velocidade);
  if (teclas.ArrowDown) soldado.y = Math.min(canvas.height - soldado.height, soldado.y + soldado.velocidade);
  
  // Movimento tiros
  tirosAnimal.forEach((tiro, index) => {
    tiro.x += tiro.velocidade;
    if (tiro.x > canvas.width) {
      tirosAnimal.splice(index, 1);
    }
  });
  
  tirosSoldado.forEach((tiro, index) => {
    tiro.x -= tiro.velocidade;
    if (tiro.x < 0) {
      tirosSoldado.splice(index, 1);
    }
  });
  
  // Verifica colisões
  verificarColisoes();
}

// Verifica colisões
function verificarColisoes() {
  // Tiros do animal no soldado
  tirosAnimal.forEach((tiro, index) => {
    if (colisao(tiro, soldado)) {
      tirosAnimal.splice(index, 1);
      soldado.vidas--;
      if (soldado.vidas <= 0) {
        pontosAnimal++;
        resetRound();
      }
    }
  });
  
  // Tiros do soldado no animal
  tirosSoldado.forEach((tiro, index) => {
    if (colisao(tiro, animal)) {
      tirosSoldado.splice(index, 1);
      animal.vidas--;
      if (animal.vidas <= 0) {
        pontosSoldado++;
        resetRound();
      }
    }
  });
  
  // Verifica vencedor
  if (pontosAnimal >= pontosParaVencer || pontosSoldado >= pontosParaVencer) {
    gameOver();
  }
}

function colisao(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function resetRound() {
  animal.vidas = 3;
  soldado.vidas = 3;
  animal.y = 250;
  soldado.y = 250;
  tirosAnimal = [];
  tirosSoldado = [];
}

function gameOver() {
  gameActive = false;
  // Aqui você pode adicionar lógica para mostrar quem venceu
}


function draw() {
  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Desenha background
  backgroundImg.draw(ctx);
  
  // Desenha personagens (com verificação de carregamento)
  if (animal.img.complete && animal.img.naturalWidth !== 0) {
    ctx.drawImage(animal.img, animal.x, animal.y, animal.width, animal.height);
  }
  
  if (soldado.img.complete && soldado.img.naturalWidth !== 0) {
    ctx.drawImage(soldado.img, soldado.x, soldado.y, soldado.width, soldado.height);
  }
  
  // Desenha tiros
  ctx.fillStyle = "yellow";
  tirosAnimal.forEach(tiro => {
    ctx.fillRect(tiro.x, tiro.y, tiro.width, tiro.height);
  });
  
  ctx.fillStyle = "red";
  tirosSoldado.forEach(tiro => {
    ctx.fillRect(tiro.x, tiro.y, tiro.width, tiro.height);
  });
  
  // Desenha HUD (vidas e pontos)
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Animal: ${pontosAnimal}`, 50, 30);
  ctx.fillText(`Soldado: ${pontosSoldado}`, canvas.width - 150, 30);
  
  // Barras de vida
  drawVidas(animal, 50, 60);
  drawVidas(soldado, canvas.width - 150, 60);
  
  if (!gameActive) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    const vencedor = pontosAnimal >= pontosParaVencer ? "ANIMAL" : "SOLDADO";
    ctx.fillText(`${vencedor} VENCEU!`, canvas.width/2 - 150, canvas.height/2);
    ctx.font = "24px Arial";
    ctx.fillText("Clique para voltar ao menu", canvas.width/2 - 120, canvas.height/2 + 50);
  }
  
  requestAnimationFrame(draw);
}

function drawVidas(personagem, x, y) {
  ctx.fillStyle = "red";
  for (let i = 0; i < personagem.vidas; i++) {
    ctx.fillRect(x + (i * 30), y, 20, 20);
  }
}

let resourcesLoaded = 0;
const totalResources = 4; // background + gameover + 2 personagens

function checkLoading() {
  resourcesLoaded++;
  if (resourcesLoaded === totalResources) {
    // Todos recursos carregados, inicia o jogo
    requestAnimationFrame(draw);
    musica_fundo.play();
  }
}

backgroundImg.img.onload = checkLoading;
gameOverImg.img.onload = checkLoading;
animal.img.onload = checkLoading;
soldado.img.onload = checkLoading;

// Inicia o jogo
draw();
setInterval(update, 1000/60);

// Volta ao menu quando clicar após game over
canvas.addEventListener("click", () => {
  if (!gameActive) {
    window.location.href = "index.html";
  }
});