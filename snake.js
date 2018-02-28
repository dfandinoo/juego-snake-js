//variables de velocidad y tamano
var velocidad = 80;
var tamano = 10;

//motor de juego
class Objeto {
  constructor() {
    this.tamano = tamano;
  }

  choque(obj) {
      var difx = Math.abs(this.x - obj.x);
      var dify = Math.abs(this.y - obj.y);
      if(difx >= 0 && difx < tamano && dify >= 0 && dify < tamano) {
        return true;
      } else {
        return false;
      }
  }
  //se establece la variable x / y
  setxy(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake extends Objeto {

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.siguiente = null;
  }

  dibujar(ctx) {
    if(this.siguiente != null) {
      this.siguiente.dibujar(ctx);
    }
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
  }

  //se establece la variable x / y
  setxy(x, y) {
    if(this.siguiente != null) {
      this.siguiente.setxy(this.x, this.y);
    }
    this.x = x;
    this.y = y;
  }

  meter() {
    if(this.siguiente == null) {
      this.siguiente = new Snake(this.x, this.y);
    } else {
      this.siguiente.meter();
    }
  }

  verSiguiente() {
    return this.siguiente;
  }
}

class Comida extends Objeto {
  constructor() {
    super();
    this.x = this.generar();
    this.y = this.generar();
  }
  generar() {
    var num = (Math.floor(Math.random() * 59)) * 10;
    return num;
  }

  colocar() {
    this.x = this.generar();
    this.y = this.generar();
  }

  dibujar(ctx) {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
  }
}

//objetos del juego
var cabeza = new Snake(20,20);
var comida = new Comida();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;

function movimiento() {
  //dar direccion al movimiento
  var nx = cabeza.x+xdir;
  var ny = cabeza.y+ydir;
  cabeza.setxy(nx,ny);
}

function control(event) {
  /*
  keycode codigos
  37 -> izquierda
  38 -> arriba
  39 -> derecha
  40 -> abajo
  */
  var cod = event.keyCode;
  if(ejex) {
    if(cod == 38) {
      ydir = -tamano;
      xdir = 0;
      ejex = false;
      ejey = true;
    }

    if(cod == 40) {
      ydir = tamano;
      xdir = 0;
      ejex = false;
      ejey = true;
    }

  }
  if(ejey) {
    if(cod == 37) {
        ydir = 0;
        xdir = -tamano;
        ejey = false;
        ejex = true;
    }

    if(cod == 39) {
        ydir = 0;
        xdir = tamano;
        ejey = false;
        ejex = true;
    }

  }
}

function finJuego() {
  ydir = 0;
  xdir = 0;
  ejey = true;
  ejex = true;
  cabeza = new Snake(20,20);
  comida = new Comida();
  alert("Perdiste");
}

function choqueCuerpo() {
  var temp = null;
  try {
    temp = cabeza.verSiguiente().verSiguiente();
  } catch (e) {
    temp = null;
  }
  while(temp != null) {
    if(cabeza.choque(temp)) {
      //fin del juego
      finJuego();
    }else {
      temp = temp.verSiguiente();
    }
  }
}

function choquePared() {
  if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590) {
    finJuego();
  }
}

function dibujar() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0, canvas.width, canvas.height);
  //aqui abajo va todo el dibujo

  //se dibjua la cabeza del snake
  cabeza.dibujar(ctx);
  comida.dibujar(ctx);
}

function main() {
  choqueCuerpo();
  choquePared();
  dibujar();
  movimiento();
  if(cabeza.choque(comida)) {
    comida.colocar();
    cabeza.meter();
  }
}

setInterval("main()", velocidad);
