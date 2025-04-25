const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gameActive = true;
let pontosAnimal = 0;
let pontosSoldado = 0;
const pontosParaVencer = 5;

const tiroAnimalImg = new Image();
tiroAnimalImg.src = 'assets/bala_direita.png';
const tiroSoldadoImg = new Image();
tiroSoldadoImg.src = 'assets/bala_esquerda.png'; 

const imagensAnimais = ["assets/guaxinimShoot_1.png", "assets/capivaraRight.png"];
const imagensSoldados = ["assets/soldier3.png", "assets/ruining_soldierPink.png"];

const animalSelecionado = parseInt(localStorage.getItem("animalSelecionado")) || 0;
const soldadoSelecionado = parseInt(localStorage.getItem("soldadoSelecionado")) || 0;

const backgroundImg = new Obj(0, 0, canvas.width, canvas.height, './assets/bg_1v1.png');
const gameOverImg = new Obj(0, 0, canvas.width, canvas.height, './assets/gameOverAnimals.png');
const vitoriaAnimalImg = new Obj(0, 0, canvas.width, canvas.height, './assets/WinAnimals.png');
const vitoriaSoldadoImg = new Obj(0, 0, canvas.width, canvas.height, './assets/winSoldiers.png');

// Personagens
const animal = {
  x: 50,
  y: 250,
  width: 80,
  height: 80,
  img: new Image(),
  velocidade: 8,
  vidas: 5
};
animal.img.src = imagensAnimais[animalSelecionado]; // Só uma atribuição

const soldado = {
  x: 1170,
  y: 250,
  width: 80,
  height: 80,
  img: new Image(),
  velocidade: 8,
  vidas: 5
};
soldado.img.src = imagensSoldados[soldadoSelecionado]; // Só uma atribuição

// Controles
const teclas = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false
};

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
  if (['w', 's', 'ArrowUp', 'ArrowDown', 'd', 'ArrowLeft'].includes(e.key)) {
    teclas[e.key] = true;
  }
  
  if (e.key === 'd' && gameActive && tirosAnimal.length < 4) {
    tirosAnimal.push({
      x: animal.x + animal.width,
      y: animal.y + animal.height/2 - 5,
      width: 30,
      height: 10,
      velocidade: 15
    });
  }
  
  if (e.key === 'ArrowLeft' && gameActive && tirosSoldado.length < 4) {
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
  verificarColisoes();
}

function verificarColisoes() {
  tirosAnimal.forEach((tiro, index) => {
    if (colisao(tiro, soldado)) {
      tirosAnimal.splice(index, 1);
      soldado.vidas--;
      if (soldado.vidas <= 0) {
        gameOver("ANIMAL");
      }
    }
  });
  
  tirosSoldado.forEach((tiro, index) => {
    if (colisao(tiro, animal)) {
      tirosSoldado.splice(index, 1);
      animal.vidas--;
      if (animal.vidas <= 0) {
        gameOver("SOLDADO");
      }
    }
  });
}

function colisao(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function resetRound() {
  animal.y = 250;
  soldado.y = 250;
  tirosAnimal = [];
  tirosSoldado = [];
}

function gameOver(vencedor) {
  gameActive = false;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (vencedor === "ANIMAL" && vitoriaAnimalImg.loaded) {
    vitoriaAnimalImg.draw(ctx);
  } 
  else if (vencedor === "SOLDADO" && vitoriaSoldadoImg.loaded) {
    vitoriaSoldadoImg.draw(ctx);
  }
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Clique para voltar ao menu", canvas.width/2 - 120, canvas.height/2 + 50);
  
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  backgroundImg.draw(ctx);
  
  if (animal.img.complete && animal.img.naturalWidth !== 0) {
    ctx.drawImage(animal.img, animal.x, animal.y, animal.width, animal.height);
  }
  
  if (soldado.img.complete && soldado.img.naturalWidth !== 0) {
    ctx.drawImage(soldado.img, soldado.x, soldado.y, soldado.width, soldado.height);
  }
  tirosAnimal.forEach(tiro => {
    if (tiroAnimalImg.complete) {
      ctx.drawImage(tiroAnimalImg, tiro.x, tiro.y, tiro.width, tiro.height);
    }
  });
  
  tirosSoldado.forEach(tiro => {
    if (tiroSoldadoImg.complete) {
      ctx.drawImage(tiroSoldadoImg, tiro.x, tiro.y, tiro.width, tiro.height);
    }
  });
  
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  
  // Vidas do animal
  ctx.fillText(`Vidas: ${animal.vidas}`, 50, 30);
  drawVidas(animal, 50, 60);
  
  // Vidas do soldado
  ctx.fillText(`Vidas: ${soldado.vidas}`, canvas.width - 150, 30);
  drawVidas(soldado, canvas.width - 150, 60);
  
  if (!gameActive) {
    let vencedor;
    if (animal.vidas <= 0) {
        vencedor = "SOLDADO";
        vitoriaSoldadoImg.draw(ctx);
    } else if (soldado.vidas <= 0) {
        vencedor = "ANIMAL";
        vitoriaAnimalImg.draw(ctx);
    } else {
        vencedor = "JOGO EMPATADO";
    }

    ctx.font = "24px Arial";
    ctx.fillText("Clique para voltar ao menu", canvas.width/2 - 120, canvas.height/2 + 50);
}
  requestAnimationFrame(draw);
}

function drawVidas(personagem, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Vidas: ${animal.vidas}`, 50, 30);
  ctx.fillText(`Vidas: ${soldado.vidas}`, canvas.width - 150, 30);
}

let resourcesLoaded = 0;
const totalResources = 4;

function checkLoading() {
  resourcesLoaded++;
  if (resourcesLoaded === totalResources) {
    requestAnimationFrame(draw);
    musica_fundo.play();
  }
}
vitoriaAnimalImg.img.onload = checkLoading;
vitoriaSoldadoImg.img.onload = checkLoading;
backgroundImg.img.onload = checkLoading;
gameOverImg.img.onload = checkLoading;
animal.img.onload = checkLoading;
soldado.img.onload = checkLoading;

draw();
setInterval(update, 1000/60);

canvas.addEventListener("click", () => {
  if (!gameActive) {
    window.location.href = "index.html";
  }
});