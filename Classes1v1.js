class Obj {
    constructor(x, y, width, height, imagePath) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = new Image();
      this.img.src = imagePath;
      this.loaded = false;
      
      this.img.onload = () => {
        this.loaded = true;
        console.log("Imagem carregada:", imagePath);
      };
      
      this.img.onerror = () => {
        console.error("Erro ao carregar:", imagePath);
      };
    }
  
    draw(ctx) {
      if (this.loaded) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }  
}

class Text {
  constructor(text) {
      this.texto = text
  }

  draw_text(size, font, x, y, color) {
      canvas.font = `${size}px ${font}`
      canvas.fillStyle = color
      canvas.fillText(this.texto, x, y)
  }

  update_text(valor) {
      this.texto = valor
  }
}

class Shoot extends Obj {
  move() {
      this.x += 10
  }
}

class Soldiers extends Obj {
  constructor(x, y, width, height, image, velocidade) {
      super(x, y, width, height, image)
      this.velocidade = velocidade
  }

  move() {
      this.x -= this.velocidade
  }
}