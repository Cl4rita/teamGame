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
    };
  }

  draw(ctx) {
    if (this.loaded) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
  collide(obj) {
    return (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y
    )
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