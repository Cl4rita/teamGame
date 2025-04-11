const canvas = document.getElementById('canvas').getContext('2d');
canvas.imageSmoothingEnabled = false;

let gameOverImg = new Obj(0, 0, 1300, 600, './assets/gameOverAnimals.png');
let BackgroundImg = new Obj(0, 0, 1300, 600, './assets/gitu8gy7tfdhtsdujsdr.png');

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

let groupShootAnimal = []
let groupShootSoldier = []

const animalSelecionado = parseInt(localStorage.getItem("animalSelecionado"));
const soldadoSelecionado = parseInt(localStorage.getItem("soldadoSelecionado"));

// Define as imagens dos personagens
const imagensAnimais = ["guaxinimShoot_1.png", "capivaraRight.png"];
const imagensSoldados = ["soldier3.png", "pinkSoldier.png"];

// Cria os objetos dos jogadores
const animal = {
  x: 50,
  y: 200,
  width: 50,
  height: 50,
  img: new Image(),
  velocidade: 5
};

const soldado = {
  x: 700,
  y: 200,
  width: 50,
  height: 50,
  img: new Image(),
  velocidade: 5
};

// Atribui as imagens corretas
animal.img.src = `./imagens/${imagensAnimais[animalSelecionado]}`;
soldado.img.src = `./imagens/${imagensSoldados[soldadoSelecionado]}`;

document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
      case "W":
        animal.y -= animal.velocidade;
        break;
      case "s":
      case "S":
        animal.y += animal.velocidade;
        break;
      case "ArrowUp":
        soldado.y -= soldado.velocidade;
        break;
      case "ArrowDown":
        soldado.y += soldado.velocidade;
        break;
    }
  });

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(animal.img, animal.x, animal.y, animal.width, animal.height);
    ctx.drawImage(soldado.img, soldado.x, soldado.y, soldado.width, soldado.height);
    
    requestAnimationFrame(desenhar);
  }
function gameLoop() {
    desenhar();
    canvas.clearRect(0, 0, 1300, 600);
    requestAnimationFrame(gameLoop);
}

gameLoop();
