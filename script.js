// Variables globales
let projectileAnimation;
let pendulumAnimation;
let waveAnimation;
let projectileRunning = false;
let pendulumRunning = false;
let waveRunning = false;

// ========================================
// FUNCIONES GENERALES
// ========================================

// Función para cambiar entre simulaciones
function showSimulation(simName) {
    document.querySelectorAll('.simulation').forEach(sim => sim.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(simName).classList.add('active');
    event.target.classList.add('active');
    
    // Detener todas las animaciones
    stopAllAnimations();
}

function stopAllAnimations() {
    if (projectileAnimation) cancelAnimationFrame(projectileAnimation);
    if (pendulumAnimation) cancelAnimationFrame(pendulumAnimation);
    if (waveAnimation) cancelAnimationFrame(waveAnimation);
    projectileRunning = false;
    pendulumRunning = false;
    waveRunning = false;
}

// ========================================
// SIMULACIÓN 1: MOVIMIENTO PARABÓLICO
// ========================================

function updateProjectileDisplay() {
    document.getElementById('velocityValue').textContent = document.getElementById('velocity').value;
    document.getElementById('angleValue').textContent = document.getElementById('angle').value;
    document.getElementById('gravityValue').textContent = document.getElementById('gravity').value;
    calculateProjectileResults();
}

function calculateProjectileResults() {
    const v0 = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value) * Math.PI / 180;
    const g = parseFloat(document.getElementById('gravity').value);
    
    const maxRange = (v0 * v0 * Math.sin(2 * angle)) / g;
    const maxHeight = (v0 * v0 * Math.sin(angle) * Math.sin(angle)) / (2 * g);
    const flightTime = (2 * v0 * Math.sin(angle)) / g;
    
    document.getElementById('maxRange').textContent = maxRange.toFixed(1);
    document.getElementById('maxHeight').textContent = maxHeight.toFixed(1);
    document.getElementById('flightTime').textContent = flightTime.toFixed(1);
}

function launchProjectile() {
    if (projectileRunning) return;
    
    const canvas = document.getElementById('projectileCanvas');
    const ctx = canvas.getContext('2d');
    const v0 = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value) * Math.PI / 180;
    const g = parseFloat(document.getElementById('gravity').value);
    
    let t = 0;
    const dt = 0.05;
    const scale = 2; // Escala para visualización
    
    projectileRunning = true;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar suelo
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        
        // Calcular posición
        const x = v0 * Math.cos(angle) * t * scale;
        const y = v0 * Math.sin(angle) * t * scale - 0.5 * g * t * t * scale;
        
        // Dibujar proyectil
        const canvasY = canvas.height - 20 - y;
        
        if (canvasY <= canvas.height - 20 && x <= canvas.width) {
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(x, canvasY, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Dibujar trayectoria
            ctx.strokeStyle = '#4ECDC4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i <= t; i += dt) {
                const px = v0 * Math.cos(angle) * i * scale;
                const py = v0 * Math.sin(angle) * i * scale - 0.5 * g * i * i * scale;
                const pCanvasY = canvas.height - 20 - py;
                if (i === 0) ctx.moveTo(px, pCanvasY);
                else ctx.lineTo(px, pCanvasY);
            }
            ctx.stroke();
            
            t += dt;
            projectileAnimation = requestAnimationFrame(animate);
        } else {
            projectileRunning = false;
        }
    }
    
    animate();
}

function resetProjectile() {
    if (projectileAnimation) cancelAnimationFrame(projectileAnimation);
    projectileRunning = false;
    const canvas = document.getElementById('projectileCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar suelo
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

// ========================================
// SIMULACIÓN 2: PÉNDULO SIMPLE
// ========================================

function updatePendulumDisplay() {
    document.getElementById('lengthValue').textContent = document.getElementById('length').value;
    document.getElementById('massValue').textContent = document.getElementById('mass').value;
    document.getElementById('initialAngleValue').textContent = document.getElementById('initialAngle').value;
    calculatePendulumResults();
    drawPendulumStatic();
}

function calculatePendulumResults() {
    const L = parseFloat(document.getElementById('length').value);
    const m = parseFloat(document.getElementById('mass').value);
    const theta0 = parseFloat(document.getElementById('initialAngle').value) * Math.PI / 180;
    const g = 9.81;
    
    const period = 2 * Math.PI * Math.sqrt(L / g);
    const frequency = 1 / period;
    const energy = m * g * L * (1 - Math.cos(theta0));
    
    document.getElementById('period').textContent = period.toFixed(2);
    document.getElementById('frequency').textContent = frequency.toFixed(3);
    document.getElementById('energy').textContent = energy.toFixed(2);
}

function drawPendulumStatic() {
    const canvas = document.getElementById('pendulumCanvas');
    const ctx = canvas.getContext('2d');
    const L = parseFloat(document.getElementById('length').value);
    const m = parseFloat(document.getElementById('mass').value);
    const theta0 = parseFloat(document.getElementById('initialAngle').value) * Math.PI / 180;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = 50;
    const scale = 100;
    
    // Dibujar punto de suspensión
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Calcular posición de la masa
    const x = centerX + L * scale * Math.sin(theta0);
    const y = centerY + L * scale * Math.cos(theta0);
    
    // Dibujar cuerda
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Dibujar masa
    const radius = Math.sqrt(m) * 8;
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function startPendulum() {
    if (pendulumRunning) return;
    
    const canvas = document.getElementById('pendulumCanvas');
    const ctx = canvas.getContext('2d');
    const L = parseFloat(document.getElementById('length').value);
    const m = parseFloat(document.getElementById('mass').value);
    const theta0 = parseFloat(document.getElementById('initialAngle').value) * Math.PI / 180;
    const g = 9.81;
    
    let t = 0;
    const dt = 0.02;
    const omega = Math.sqrt(g / L);
    const centerX = canvas.width / 2;
    const centerY = 50;
    const scale = 100;
    
    pendulumRunning = true;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calcular ángulo actual
        const theta = theta0 * Math.cos(omega * t);
        
        // Dibujar punto de suspensión
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Calcular posición de la masa
        const x = centerX + L * scale * Math.sin(theta);
        const y = centerY + L * scale * Math.cos(theta);
        
        // Dibujar cuerda
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Dibujar masa
        const radius = Math.sqrt(m) * 8;
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        t += dt;
        if (pendulumRunning) {
            pendulumAnimation = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function stopPendulum() {
    pendulumRunning = false;
    if (pendulumAnimation) cancelAnimationFrame(pendulumAnimation);
}

function resetPendulum() {
    stopPendulum();
    drawPendulumStatic();
}

// ========================================
// SIMULACIÓN 3: ONDAS
// ========================================

function updateWaveDisplay() {
    document.getElementById('amplitudeValue').textContent = document.getElementById('amplitude').value;
    document.getElementById('waveFrequencyValue').textContent = document.getElementById('waveFrequency').value;
    calculateWaveResults();
}

function calculateWaveResults() {
    const f = parseFloat(document.getElementById('waveFrequency').value);
    const period = 1 / f;
    const waveSpeed = 340; // Velocidad del sonido en m/s
    const wavelength = waveSpeed / f;
    
    document.getElementById('wavePeriod').textContent = period.toFixed(2);
    document.getElementById('wavelength').textContent = wavelength.toFixed(1);
    document.getElementById('waveSpeed').textContent = waveSpeed;
}

function startWave() {
    if (waveRunning) return;
    
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    const amplitude = parseFloat(document.getElementById('amplitude').value);
    const frequency = parseFloat(document.getElementById('waveFrequency').value);
    const waveType = document.getElementById('waveType').value;
    
    let phase = 0;
    const phaseIncrement = 0.1;
    
    waveRunning = true;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar ejes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        
        // Dibujar onda
        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 2) {
            let y;
            const normalizedX = x / canvas.width * 4 * Math.PI;
            
            switch (waveType) {
                case 'sine':
                    y = amplitude * Math.sin(frequency * normalizedX + phase);
                    break;
                case 'cosine':
                    y = amplitude * Math.cos(frequency * normalizedX + phase);
                    break;
                case 'square':
                    y = amplitude * Math.sign(Math.sin(frequency * normalizedX + phase));
                    break;
            }
            
            const canvasY = canvas.height / 2 - y;
            
            if (x === 0) ctx.moveTo(x, canvasY);
            else ctx.lineTo(x, canvasY);
        }
        
        ctx.stroke();
        
        phase += phaseIncrement * frequency;
        if (waveRunning) {
            waveAnimation = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function stopWave() {
    waveRunning = false;
    if (waveAnimation) cancelAnimationFrame(waveAnimation);
}

function resetWave() {
    stopWave();
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar ejes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    updateProjectileDisplay();
    updatePendulumDisplay();
    updateWaveDisplay();
    resetProjectile();
    resetPendulum();
    resetWave();
});