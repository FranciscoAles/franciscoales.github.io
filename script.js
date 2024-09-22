const mainSection = document.getElementById('main-section');
const content = document.querySelector('.content');
const info = document.querySelector('.info');
const h1 = document.querySelector('h1');
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 150;
let mouseX = 0;
let mouseY = 0;
let animationActive = false;

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

class Particle {
    constructor(isExplosion = false) {
        this.x = isExplosion ? mouseX : Math.random() * canvas.width;
        this.y = isExplosion ? mouseY : Math.random() * canvas.height;
        this.size = Math.random() * 5 + 3;
        this.baseSize = this.size;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 2 + 0.5;
        this.distance = Math.random() * 100 + 50;
        this.rotationSpeed = (Math.random() * 0.03 + 0.01) * (Math.random() < 0.5 ? 1 : -1);
        this.isExplosion = isExplosion;
        if (isExplosion) {
            this.explosionAngle = Math.random() * Math.PI * 2;
            this.explosionSpeed = Math.random() * 10 + 5;
        }
    }
    
    update() {
        if (this.isExplosion) {
            this.x += Math.cos(this.explosionAngle) * this.explosionSpeed;
            this.y += Math.sin(this.explosionAngle) * this.explosionSpeed;
            this.explosionSpeed *= 0.95;
            this.size *= 0.97;
        } else {
            this.angle += this.rotationSpeed;
            const dx = mouseX + Math.cos(this.angle) * this.distance - this.x;
            const dy = mouseY + Math.sin(this.angle) * this.distance - this.y;
            this.x += dx * this.speed * 0.05;
            this.y += dy * this.speed * 0.05;
            this.size = this.baseSize + Math.sin(this.angle) * 2;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    if (!animationActive) return;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.size > 0.1);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

createParticles();

let isHovering = false;

function handleInteraction(entering) {
    if (entering) {
        if (isHovering) return;
        isHovering = true;

        gsap.to(h1, { opacity: 0, duration: 0.3 });
        gsap.to(canvas, { opacity: 1, duration: 0.5 });
        gsap.to(info, { opacity: 1, duration: 0.5, delay: 0.5 });

        animationActive = true;
        animate();
    } else {
        isHovering = false;
        animationActive = false;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const aboutMeName = document.querySelector('.section h2 + p .highlight');
const screenFlash = document.getElementById('screen-flash');

aboutMeName.addEventListener('mouseenter', () => {
    screenFlash.style.opacity = '1';
    setTimeout(() => {
        screenFlash.style.opacity = '0';
    }, 500);
});

aboutMeName.addEventListener('mouseleave', () => {
    screenFlash.style.opacity = '0';
});

document.body.addEventListener('mouseenter', () => handleInteraction(true));
document.body.addEventListener('mouseleave', () => handleInteraction(false));
document.body.addEventListener('touchstart', () => handleInteraction(true));
document.body.addEventListener('touchend', () => handleInteraction(false));

function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Always keep the canvas background black
    gsap.to(canvas, { opacity: 1, duration: 0.3 });
}

document.body.addEventListener('mousemove', handleMouseMove);
document.body.addEventListener('touchmove', (e) => {
    handleMouseMove(e.touches[0]);
});

document.body.addEventListener('click', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(true));
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    createParticles();
});

// Highlight animation
const highlights = document.querySelectorAll('.highlight');
highlights.forEach(highlight => {
    highlight.addEventListener('mouseenter', () => {
        gsap.to(highlight, { backgroundSize: '100% 88%', duration: 0.25, ease: 'power1.out' });
    });
    highlight.addEventListener('mouseleave', () => {
        gsap.to(highlight, { backgroundSize: '100% 0.2em', duration: 0.25, ease: 'power1.out' });
    });
});