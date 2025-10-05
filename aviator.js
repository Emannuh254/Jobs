
    // Canvas setup
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const historyDiv = document.getElementById('history');
    const liveBetsDiv = document.getElementById('live-bets');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const depositModal = document.getElementById('deposit-modal');
    const withdrawModal = document.getElementById('withdraw-modal');
    const openDepositBtn = document.getElementById('open-deposit');
    const openWithdrawBtn = document.getElementById('open-withdraw');
    const closeDepositBtn = document.getElementById('close-deposit');
    const closeWithdrawBtn = document.getElementById('close-withdraw');
    const userBalance = document.getElementById('user-balance');

    // Game state
    let currentMultiplier = 1.00;
    let isFlying = false;
    let animationFrame;
    let planeX = 50;
    let planeY = canvas.height / 2;
    let planeRotation = 0;
    let trail = [];
    const maxTrailLength = 50;
    let gameHistory = [];
    let currentRound = 0;
    let crashPoint = 0;
    let gameStartTime = 0;
    let bets = [];
    let autoCashouts = {};

    // Sound effects
    const crashSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-explosion-hit-759.mp3');
    const cashoutSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');

    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        if (!isFlying) {
            drawBackground();
            drawGraph(1.00);
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Load plane image
    const planeImage = new Image();
    planeImage.src = 'https://i.imgur.com/3Q0yQ3g.png'; // Real plane image

    // Draw background
    function drawBackground() {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#1E90FF');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        drawCloud(100, 80, 40);
        drawCloud(250, 120, 50);
        drawCloud(450, 60, 35);
        drawCloud(650, 100, 45);
    }

    function drawCloud(x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
        ctx.arc(x + size * 1.5, y, size * 0.9, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y + size * 0.3, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw graph
    function drawGraph(multiplier) {
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Draw curve
        ctx.strokeStyle = '#ff3b30'; // Red color for the curve
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        
        const points = [];
        for (let i = 0; i <= canvas.width; i += 10) {
            const progress = i / canvas.width;
            // Using a more exponential curve like in Aviator
            const value = Math.exp(progress * Math.log(multiplier));
            const x = i;
            // Adjust the curve to be more like Aviator (steeper at the beginning)
            const y = canvas.height - (canvas.height * (value - 1) / 10);
            points.push({x, y});
        }
        
        // Draw smooth curve through points
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const xc = (points[i].x + points[i - 1].x) / 2;
            const yc = (points[i].y + points[i - 1].y) / 2;
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        ctx.stroke();
        
        // Draw trail
        if (trail.length > 1) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);
            for (let i = 1; i < trail.length; i++) {
                ctx.lineTo(trail[i].x, trail[i].y);
            }
            ctx.stroke();
        }
        
        // Draw plane
        if (planeImage.complete) {
            const planeWidth = 60;
            const planeHeight = 30;
            const lastPoint = points[points.length - 1];
            
            // Calculate rotation based on curve direction
            if (points.length > 1) {
                const dx = points[points.length - 1].x - points[points.length - 2].x;
                const dy = points[points.length - 1].y - points[points.length - 2].y;
                planeRotation = Math.atan2(dy, dx);
            }
            
            // Add current position to trail
            trail.push({x: lastPoint.x, y: lastPoint.y});
            if (trail.length > maxTrailLength) {
                trail.shift();
            }
            
            ctx.save();
            ctx.translate(lastPoint.x, lastPoint.y);
            ctx.rotate(planeRotation);
            ctx.drawImage(planeImage, -planeWidth/2, -planeHeight/2, planeWidth, planeHeight);
            ctx.restore();
            
            // Store plane position for next frame
            planeX = lastPoint.x;
            planeY = lastPoint.y;
        }
    }

    // Update multiplier
    function updateMultiplier(value) {
        currentMultiplier = value;
        multiplierDisplay.textContent = value.toFixed(2) + 'x';
        drawBackground();
        drawGraph(value);
        
        // Check for auto cashouts
        checkAutoCashouts();
    }

    // Check for auto cashouts
    function checkAutoCashouts() {
        for (const betId in autoCashouts) {
            if (autoCashouts[betId] <= currentMultiplier) {
                cashoutBet(parseInt(betId));
                delete autoCashouts[betId];
            }
        }
    }

    // Handle crash
    function handleCrash(value) {
        isFlying = false;
        cancelAnimationFrame(animationFrame);
        multiplierDisplay.style.color = '#ef4444'; // Red color for crash
        
        // Play crash sound
        crashSound.play().catch(e => console.log("Sound play failed:", e));
        
        // Add to history
        const item = document.createElement('div');
        item.classList.add('history-item');
        item.textContent = value.toFixed(2) + 'x';
        item.classList.add(value < 2 ? 'low' : 'high');
        historyDiv.prepend(item);
        
        // Keep only last 10 history items
        while (historyDiv.children.length > 10) {
            historyDiv.removeChild(historyDiv.lastChild);
        }
        
        // Reset bet buttons
        document.getElementById('bet-button-1').textContent = 'Place Bet';
        document.getElementById('bet-button-1').classList.remove('cashout');
        document.getElementById('bet-button-2').textContent = 'Place Bet';
        document.getElementById('bet-button-2').classList.remove('cashout');
        
        // Reset trail
        trail = [];
        
        // Clear active bets
        bets = [];
        autoCashouts = {};
        
        // Start new round after delay
        setTimeout(() => {
            startNewRound();
        }, 5000);
    }

    // Start new round
    function startNewRound() {
        currentRound++;
        gameStartTime = Date.now();
        
        // Generate crash point using Betika-like algorithm
        const seed = Math.random();
        crashPoint = 1 + Math.floor(seed * 100) / 100; // Random crash point between 1.00 and 2.00
        
        // 10% chance of higher multiplier
        if (Math.random() < 0.1) {
            crashPoint = 2 + Math.floor(Math.random() * 98) / 100; // Between 2.00 and 3.00
        }
        
        // 5% chance of very high multiplier
        if (Math.random() < 0.05) {
            crashPoint = 3 + Math.floor(Math.random() * 97) / 100; // Between 3.00 and 4.00
        }
        
        // Rare chance for extremely high multipliers
        if (Math.random() < 0.01) {
            crashPoint = 4 + Math.floor(Math.random() * 96) / 100; // Between 4.00 and 5.00
        }
        
        // Add to game history
        gameHistory.push({
            round: currentRound,
            crashPoint: crashPoint,
            timestamp: new Date().toISOString()
        });
        
        // Update UI
        multiplierDisplay.textContent = '1.00x';
        multiplierDisplay.style.color = 'white';
        
        // Draw initial canvas
        drawBackground();
        drawGraph(1.00);
    }

    // Update history
    function updateHistory(history) {
        historyDiv.innerHTML = '';
        history.forEach(val => {
            const item = document.createElement('div');
            item.classList.add('history-item');
            item.textContent = val.toFixed(2) + 'x';
            item.classList.add(val < 2 ? 'low' : 'high');
            historyDiv.appendChild(item);
        });
    }

    // Update live bets
    function updateLiveBets(bet) {
        const div = document.createElement('div');
        div.classList.add('live-bet-item');
        div.innerHTML = `
            <span class="live-bet-user">${bet.user}</span>
            <span class="live-bet-amount">$${bet.amount} @ ${bet.multiplier}x</span>
        `;
        liveBetsDiv.appendChild(div);
        
        // Keep only last 10 live bets
        while (liveBetsDiv.children.length > 10) {
            liveBetsDiv.removeChild(liveBetsDiv.lastChild);
        }
    }

    // Add chat message
    function addChatMessage(username, message) {
        const div = document.createElement('div');
        div.classList.add('chat-message');
        div.innerHTML = `<span class="username">${username}:</span> ${message}`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Keep only last 20 messages
        while (chatMessages.children.length > 20) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }

    // Chat send
    function sendMessage() {
        if (chatInput.value.trim()) {
            addChatMessage('You', chatInput.value);
            chatInput.value = '';
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Bet buttons
    const betButtons = [
        document.getElementById('bet-button-1'),
        document.getElementById('bet-button-2')
    ];

    // Place bet
    function placeBet(index) {
        if (isFlying) return;
        
        const amount = parseFloat(document.getElementById(`bet-amount-${index+1}`).value);
        const autoCashoutEnabled = document.getElementById(`auto-cashout-${index+1}`).checked;
        const autoMultiplier = parseFloat(document.getElementById(`auto-multiplier-${index+1}`).value);
        
        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            addChatMessage('System', 'Please enter a valid bet amount!');
            return;
        }
        
        // Check balance
        const currentBalance = parseFloat(userBalance.textContent.replace('$', '').replace(',', ''));
        if (amount > currentBalance) {
            addChatMessage('System', 'Insufficient balance for this bet!');
            return;
        }
        
        // Deduct from balance
        const newBalance = currentBalance - amount;
        userBalance.textContent = '$' + newBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Store bet
        bets[index] = {
            amount: amount,
            cashedOut: false,
            cashoutMultiplier: 0
        };
        
        // Set auto cashout if enabled
        if (autoCashoutEnabled && !isNaN(autoMultiplier) && autoMultiplier > 1) {
            autoCashouts[index] = autoMultiplier;
        }
        
        // Update UI
        betButtons[index].innerHTML = '<i class="fas fa-money-bill-wave"></i> Cash Out';
        betButtons[index].classList.add('cashout');
        
        // Start game if not already running
        if (!isFlying) {
            startSimulation();
        }
        
        // Add to live bets
        updateLiveBets({user: 'You', amount: amount.toFixed(2), multiplier: '1.00'});
        
        // Show notification
        addChatMessage('System', `Bet ${index+1} placed: $${amount.toFixed(2)}`);
    }

    // Cash out bet
    function cashoutBet(index) {
        if (!isFlying || !bets[index] || bets[index].cashedOut) return;
        
        const amount = bets[index].amount;
        const profit = amount * currentMultiplier;
        
        // Update balance
        const currentBalance = parseFloat(userBalance.textContent.replace('$', '').replace(',', ''));
        const newBalance = currentBalance + profit;
        userBalance.textContent = '$' + newBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Mark as cashed out
        bets[index].cashedOut = true;
        bets[index].cashoutMultiplier = currentMultiplier;
        
        // Update UI
        betButtons[index].innerHTML = '<i class="fas fa-check"></i> Cashed Out';
        betButtons[index].classList.remove('cashout');
        betButtons[index].disabled = true;
        
        // Play cashout sound
        cashoutSound.play().catch(e => console.log("Sound play failed:", e));
        
        // Show notification
        addChatMessage('System', `Bet ${index+1} cashed out at ${currentMultiplier.toFixed(2)}x for $${profit.toFixed(2)}!`);
        
        // Update live bets
        updateLiveBets({user: 'You', amount: amount.toFixed(2), multiplier: currentMultiplier.toFixed(2)});
    }

    // Bet button click handlers
    betButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (!isFlying) {
                placeBet(index);
            } else if (btn.classList.contains('cashout')) {
                cashoutBet(index);
            }
        });
    });

    // Simulation for demo
    function startSimulation() {
        if (isFlying) return;
        isFlying = true;
        currentMultiplier = 1.00;
        multiplierDisplay.style.color = 'white';
        trail = [];
        let time = 0;
        
        function animate() {
            time += 0.03;
            // More realistic exponential growth like in Aviator
            currentMultiplier = Math.exp(time * 0.15);
            updateMultiplier(currentMultiplier);
            
            // Check if we've reached the crash point
            if (currentMultiplier < crashPoint) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                handleCrash(currentMultiplier);
            }
        }
        animate();
    }

    // Deposit modal
    openDepositBtn.addEventListener('click', () => {
        depositModal.style.display = 'flex';
    });

    closeDepositBtn.addEventListener('click', () => {
        depositModal.style.display = 'none';
    });

    // Withdraw modal
    openWithdrawBtn.addEventListener('click', () => {
        withdrawModal.style.display = 'flex';
    });

    closeWithdrawBtn.addEventListener('click', () => {
        withdrawModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === depositModal) {
            depositModal.style.display = 'none';
        }
        if (e.target === withdrawModal) {
            withdrawModal.style.display = 'none';
        }
    });

    // Deposit form
    document.querySelector('.deposit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        const bonus = parseFloat(document.getElementById('deposit-bonus').value) || 0;
        
        if (isNaN(amount) || amount <= 0) {
            addChatMessage('System', 'Please enter a valid deposit amount!');
            return;
        }
        
        // Update balance
        const currentBalance = parseFloat(userBalance.textContent.replace('$', '').replace(',', ''));
        const newBalance = currentBalance + amount + bonus;
        userBalance.textContent = '$' + newBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Close modal
        depositModal.style.display = 'none';
        
        // Show notification
        addChatMessage('System', `Deposit of $${amount.toFixed(2)} completed successfully! ${bonus > 0 ? `Bonus: $${bonus.toFixed(2)}` : ''}`);
        
        // Reset form
        document.getElementById('deposit-amount').value = '';
        document.getElementById('deposit-bonus').value = '';
    });

    // Withdraw form
    document.querySelector('.withdraw-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const address = document.getElementById('withdraw-address').value;
        
        if (isNaN(amount) || amount <= 0) {
            addChatMessage('System', 'Please enter a valid withdrawal amount!');
            return;
        }
        
        if (!address) {
            addChatMessage('System', 'Please enter a withdrawal address!');
            return;
        }
        
        // Check if sufficient balance
        const currentBalance = parseFloat(userBalance.textContent.replace('$', '').replace(',', ''));
        
        if (amount > currentBalance) {
            addChatMessage('System', 'Insufficient balance for withdrawal!');
            return;
        }
        
        // Update balance
        const newBalance = currentBalance - amount;
        userBalance.textContent = '$' + newBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Close modal
        withdrawModal.style.display = 'none';
        
        // Show notification
        addChatMessage('System', `Withdrawal of $${amount.toFixed(2)} to ${address} completed successfully!`);
        
        // Reset form
        document.getElementById('withdraw-amount').value = '';
        document.getElementById('withdraw-address').value = '';
    });

    // Initialize
    startNewRound();
    updateHistory([1.23, 2.45, 1.01, 5.67, 1.89, 3.21, 1.45, 2.89]);
    updateLiveBets({user: 'Player123', amount: '25', multiplier: '2.50'});
    updateLiveBets({user: 'GamerPro', amount: '50', multiplier: '1.75'});
    updateLiveBets({user: 'LuckyStar', amount: '15', multiplier: '3.00'});
    
    // Initial chat messages
    addChatMessage('System', 'Welcome to Dollar Magnet! Place your bets and watch the plane fly!');
    addChatMessage('Player123', 'This game is so exciting!');
    addChatMessage('GamerPro', 'Just won big on the last round!');
    
    // Simulate other players
    setInterval(() => {
        if (Math.random() < 0.3) {
            const users = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley'];
            const messages = [
                'Going big this round!',
                'Cashed out at 2.5x',
                'Anyone else playing?',
                'This is my favorite game',
                'Good luck everyone!',
                'Just hit 3.0x!'
            ];
            
            const user = users[Math.floor(Math.random() * users.length)];
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            addChatMessage(user, message);
        }
    }, 10000);
    
    // Simulate live bets
    setInterval(() => {
        if (isFlying && Math.random() < 0.4) {
            const users = ['Player123', 'GamerPro', 'LuckyStar', 'HighRoller', 'CasualGamer'];
            const amounts = [10, 25, 50, 75, 100];
            
            const user = users[Math.floor(Math.random() * users.length)];
            const amount = amounts[Math.floor(Math.random() * amounts.length)];
            
            updateLiveBets({
                user: user,
                amount: amount.toFixed(2),
                multiplier: currentMultiplier.toFixed(2)
            });
        }
    }, 5000);
