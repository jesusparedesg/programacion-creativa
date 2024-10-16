import './scss/estilos.scss';

console.log('..:: EnFlujo ::..');

//Forma de definir el tipo de "algo" en Typescript

interface Vector {
  x: number;
  y: number;
}

class Particle {
  splitCount: number;
  age: number;
  pos: Vector;
  vel: Vector;

  constructor(x: number, y: number, splitCount: number) {
    this.splitCount = splitCount;
    this.age = 0;
    this.pos = { x, y };
    const angle = Math.random() * 2 * Math.PI;
    const speed = this.map(this.splitCount, 0, maxSplitCount, 5, 2);
    this.vel = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
  }

  move() {
    this.vel.x *= 0.9;
    this.vel.y *= 0.9;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    if (this.age % 10 === 0 && this.splitCount > 0) {
      allParticles.push(new Particle(this.pos.x, this.pos.y, this.splitCount - 1));
      this.splitCount -= 1;
    }
    this.age++;
  }

  private map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }
}

const lienzo = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = lienzo.getContext('2d')!;
lienzo.width = window.innerWidth;
lienzo.height = window.innerHeight;

let allParticles: Particle[] = [];
const maxSplitCount = 3;
let useFill = false;

function dist(p1: Vector, p2: Vector): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function draw() {
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);

  for (let i = allParticles.length - 1; i >= 0; i--) {
    const particle = allParticles[i];
    particle.move();

    if (Math.sqrt(particle.vel.x ** 2 + particle.vel.y ** 2) < 0.01) {
      allParticles.splice(i, 1);
    }
  }

  if (allParticles.length > 0) {
    const distThresh = 30;

    for (let i = 0; i < allParticles.length; i++) {
      const p1 = allParticles[i];

      for (let j = i + 1; j < allParticles.length; j++) {
        const p2 = allParticles[j];

        for (let k = j + 1; k < allParticles.length; k++) {
          const p3 = allParticles[k];

          if (
            dist(p1.pos, p2.pos) < distThresh &&
            dist(p2.pos, p3.pos) < distThresh &&
            dist(p1.pos, p3.pos) < distThresh
          ) {
            const particleColor = `hsl(${165 + p1.age * 1.5}, 100%, 50%)`;

            ctx.strokeStyle = particleColor;
            ctx.lineWidth = 0.5;

            ctx.beginPath();
            ctx.moveTo(p1.pos.x, p1.pos.y);
            ctx.lineTo(p2.pos.x, p2.pos.y);
            ctx.lineTo(p3.pos.x, p3.pos.y);
            ctx.closePath(); // Cierra el triángulo

            if (useFill == true) {
              ctx.fillStyle = particleColor;
              ctx.fill(); // Rellena el triángulo si useFill es verdadero
            }

            ctx.stroke(); // Dibuja el contorno del triángulo
          }
        }
      }
    }
  }

  requestAnimationFrame(draw);
}

lienzo.addEventListener('mousemove', (event: MouseEvent) => {
  if (event.buttons === 1) {
    // Si el ratón está presionado
    allParticles.push(new Particle(event.clientX, event.clientY, maxSplitCount));
  }
});

document.addEventListener('keydown', () => {
  useFill = !useFill; // Alterna el valor de useFill
});

draw();
