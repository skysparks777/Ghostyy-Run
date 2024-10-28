const ghost = document.getElementById('ghost');
const watchers = document.querySelectorAll('.watcher');
const escapeDoor = document.getElementById('escape-door');
let gameArea = document.getElementById('game-area');
let messageArea = document.getElementById('message-area');

// Handle Ghost Movement
document.addEventListener('keydown', function(e) {
    let currentTop = parseInt(window.getComputedStyle(ghost).getPropertyValue('top')) || 0;
    let currentLeft = parseInt(window.getComputedStyle(ghost).getPropertyValue('left')) || 0;

    switch(e.key) {
        case 'ArrowUp': if (currentTop > 0) ghost.style.top = (currentTop - 10) + 'px'; break;
        case 'ArrowDown': if (currentTop < gameArea.clientHeight - 40) ghost.style.top = (currentTop + 10) + 'px'; break;
        case 'ArrowLeft': if (currentLeft > 0) ghost.style.left = (currentLeft - 10) + 'px'; break;
        case 'ArrowRight': if (currentLeft < gameArea.clientWidth - 40) ghost.style.left = (currentLeft + 10) + 'px'; break;
    }

    checkCollision();
});

// Randomly switch watchers between states and handle vision highlighting
function toggleWatchers() {
    watchers.forEach(watcher => {
        const randomState = Math.random();
        let visionArea = watcher.querySelector('.vision');

        // Choose a random state for the watcher
        if (randomState < 0.4) {
            watcher.textContent = '😪'; // Sleeping
            if (visionArea) visionArea.remove();
        } else if (randomState < 0.8) {
            watcher.textContent = '🥱'; // Yawning
            if (visionArea) visionArea.remove();
        } else {
            watcher.textContent = '👀'; // Awake and watching
            if (!visionArea) {
                // Create a vision highlight area if not already there
                visionArea = document.createElement('div');
                visionArea.classList.add('vision');
                watcher.appendChild(visionArea);
            }
        }
    });
}

// Check collision with watchers
function checkCollision() {
    let ghostRect = ghost.getBoundingClientRect();

    watchers.forEach(watcher => {
        let watcherRect = watcher.getBoundingClientRect();

        // Check if watcher is awake and ghost is within its vision
        if (watcher.textContent === '👀') {
            let visionRadius = 100;

            let distance = Math.sqrt(Math.pow(ghostRect.left - watcherRect.left, 2) + 
                                     Math.pow(ghostRect.top - watcherRect.top, 2));

            if (distance <= visionRadius) {
                alert('Caught by the Watcher!');
                window.location.reload();
            }
        }
    });

    // Check if reached escape door
    let doorRect = escapeDoor.getBoundingClientRect();

    if (ghostRect.left < doorRect.right &&
        ghostRect.right > doorRect.left &&
        ghostRect.top < doorRect.bottom &&
        ghostRect.bottom > doorRect.top) {
        
        showSuccessMessage();
    }
}

// Show success message
function showSuccessMessage() {
    messageArea.innerHTML = `
        <p>You helped my ghosty escape successfully!</p>
        <button onclick="window.location.reload()">Restart Game</button>
    `;
}

// Continuously switch watcher states
setInterval(toggleWatchers, 1000);
