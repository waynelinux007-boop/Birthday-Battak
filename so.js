

document.addEventListener('DOMContentLoaded', () => {

   
    const s = {
        walletOpen: false,
        currentPage: 0,          
        sliding: false,       
        cardFlipped: false,
        photoOrder: ['card-a', 'card-b', 'card-c'], 
    };

    
    const el = {
        walletFlip: document.getElementById('wallet-flip'),
        hint: document.getElementById('hint'),
        pagesTrack: document.getElementById('pages-track'),
        dots: document.querySelectorAll('.dot'),
        photoStack: document.getElementById('photo-stack'),
        tapHint: document.getElementById('tap-hint'),
        btnToPocket: document.getElementById('btn-to-pocket'),
        giftCard: document.getElementById('gift-card'),
        revealBtn: document.getElementById('reveal-btn'),
        bouquetLayer: document.getElementById('bouquet-overlay'),
        finalBtn: document.getElementById('final-btn'),
        finalLayer: document.getElementById('final-overlay'),
        birthdayHdg: document.getElementById('birthday-heading'),
        birthdaySub: document.getElementById('birthday-sub'),
        swipeNudge: document.getElementById('swipe-nudge'),
        audio: document.getElementById('bg-music'),
    };

    
    let audioStarted = false;
    const tryAudio = () => {
        if (audioStarted || !el.audio) return;
        el.audio.volume = 0.4;
        el.audio.play()
            .then(() => { audioStarted = true; })
            .catch(() => { /* blocked — will retry on next touch */ });
    };

   
    const openWallet = (e) => {
        if (s.walletOpen) return;
        e.stopPropagation();
        s.walletOpen = true;
        tryAudio();

        el.hint.style.opacity = '0';
        el.hint.style.pointerEvents = 'none';

        el.walletFlip.classList.add('open');

        
        setTimeout(() => {
            el.walletFlip.style.transform = 'rotateY(-180deg)';
            el.walletFlip.classList.remove('open');
            
            el.swipeNudge.style.opacity = '1';
            setTimeout(() => { el.swipeNudge.style.opacity = ''; }, 3500);
        }, 900);
    };

   
    el.walletFlip.addEventListener('click', openWallet);
    el.walletFlip.addEventListener('touchstart', tryAudio, { passive: true });

   
    const goToPage = (page) => {
        if (!s.walletOpen || page === s.currentPage) return;
        s.currentPage = page;

        if (page === 1) {
            el.pagesTrack.classList.add('page-1');
            el.swipeNudge.style.opacity = '0';
        } else {
            el.pagesTrack.classList.remove('page-1');
        }

        el.dots.forEach((d, i) => d.classList.toggle('active', i === page));
    };

    el.dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToPage(parseInt(dot.dataset.page, 10));
        });
    });

    el.btnToPocket.addEventListener('click', (e) => {
        e.stopPropagation();
        goToPage(1);
    });

    
    let touchX0 = 0, touchY0 = 0, touchLocked = false;

    el.walletFlip.addEventListener('touchstart', (e) => {
        if (!s.walletOpen) return;
        touchX0 = e.touches[0].clientX;
        touchY0 = e.touches[0].clientY;
        touchLocked = false;
    }, { passive: true });

    el.walletFlip.addEventListener('touchmove', (e) => {
        if (!s.walletOpen || touchLocked) return;
        const dx = e.touches[0].clientX - touchX0;
        const dy = e.touches[0].clientY - touchY0;
      
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
            e.preventDefault();
        }
    }, { passive: false });

    el.walletFlip.addEventListener('touchend', (e) => {
        if (!s.walletOpen) return;
        const dx = touchX0 - e.changedTouches[0].clientX;
        const dy = touchY0 - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
            goToPage(dx > 0 ? 1 : 0);
        }
    }, { passive: true });

   
    el.photoStack.addEventListener('click', (e) => {
        if (!s.walletOpen || s.sliding || s.currentPage !== 0) return;
        e.stopPropagation();

      
        const topClass = s.photoOrder[0];
        const midClass = s.photoOrder[1];
        const bottomClass = s.photoOrder[2];

        const topCard = el.photoStack.querySelector('.' + topClass);
        const midCard = el.photoStack.querySelector('.' + midClass);
        const bottomCard = el.photoStack.querySelector('.' + bottomClass);

        if (!topCard) return;
        s.sliding = true;

        
        topCard.classList.add('card-fly');

        setTimeout(() => {
            
            topCard.classList.remove('card-fly');

            
            s.photoOrder.push(s.photoOrder.shift());

            
            topCard.classList.remove('card-a', 'card-b', 'card-c');
            midCard.classList.remove('card-a', 'card-b', 'card-c');
            bottomCard.classList.remove('card-a', 'card-b', 'card-c');

          
            topCard.classList.add('card-c');    
            midCard.classList.add('card-a');    
            bottomCard.classList.add('card-b'); 

            
            s.sliding = false;
        }, 480);
    });

 
    el.giftCard.addEventListener('click', (e) => {
        if (!s.walletOpen || s.cardFlipped || s.currentPage !== 1) return;
        e.stopPropagation();
        s.cardFlipped = true;
        el.giftCard.classList.add('flipped');
        el.giftCard.style.cursor = 'default';
    });

    
    el.revealBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        el.walletFlip.style.transition = 'opacity 0.5s';
        el.walletFlip.style.opacity = '0';

        setTimeout(() => {
            el.walletFlip.style.display = 'none';
            el.bouquetLayer.classList.add('visible');
        }, 500);
    });

   
    el.finalBtn.addEventListener('click', (e) => {
        e.stopPropagation();

       
        el.bouquetLayer.classList.remove('visible');

        setTimeout(() => {
           
            el.finalLayer.classList.add('visible');

           
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.birthdayHdg.classList.add('pop');
                    setTimeout(() => { el.birthdaySub.classList.add('show'); }, 900);
                });
            });

            
            setTimeout(() => {
                startFlowerShower();
                startFireworks();
            }, 100);
        }, 450);
    });

    
    function startFlowerShower() {
        const container = el.finalLayer;
        const PETALS = ['🌸', '🌺', '🌼', '🌷', '💐', '🏵️', '✿', '🌹', '💮', '🌻'];
        let count = 0;
        const MAX = 60;

        const spawnPetal = () => {
            if (count >= MAX) return;
            count++;

            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];

            
            petal.style.left = (Math.random() * 100) + 'vw';

          
            const size = 0.9 + Math.random() * 1.2;
            petal.style.fontSize = size + 'rem';

            
            const duration = 3 + Math.random() * 4;
            const delay = Math.random() * 4;
            petal.style.animationDuration = duration + 's';
            petal.style.animationDelay = delay + 's';

            
            const drift = (Math.random() - 0.5) * 120;
            petal.style.setProperty('--drift', drift + 'px');

            
            petal.style.transform = `translateX(${drift}px)`;

            container.appendChild(petal);

           
            petal.addEventListener('animationend', () => petal.remove(), { once: true });
        };

        
        for (let i = 0; i < 20; i++) {
            setTimeout(spawnPetal, i * 80);
        }
        
        let interval = setInterval(() => {
            spawnPetal();
            if (count >= MAX) clearInterval(interval);
        }, 200);
    }

   
    function startFireworks() {
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        let W, H, particles = [], rafId;

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const COLORS = [
            '#FFD700', '#f0b89a', '#c9836a', '#FF69B4',
            '#ffffff', '#b08aff', '#FF4500', '#00FFCC'
        ];

        const burst = (x, y, count = 55) => {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
                const speed = Math.random() * 6 + 1.5;
                particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    r: Math.random() * 2.8 + 0.5,
                    alpha: 1,
                    decay: 0.012 + Math.random() * 0.01,
                    gravity: 0.06 + Math.random() * 0.06,
                    trail: [],
                });
            }
        };

     
        const fireRocket = (targetX, targetY) => {
            const startX = targetX + (Math.random() - 0.5) * 40;
            let ry = H + 20;
            const rise = () => {
                ry -= 18;
                
                particles.push({
                    x: startX, y: ry,
                    vx: (Math.random() - 0.5) * 1,
                    vy: Math.random() * 2,
                    color: '#fff8a0',
                    r: 1.5, alpha: 0.8, decay: 0.08, gravity: 0.1,
                });
                if (ry > targetY) {
                    requestAnimationFrame(rise);
                } else {
                    burst(startX, ry);
                }
            };
            rise();
        };

        const loop = () => {
            rafId = requestAnimationFrame(loop);

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            ctx.clearRect(0, 0, W, H);

            
            ctx.fillStyle = 'rgba(0,0,0,0.07)';
            ctx.fillRect(0, 0, W, H);

            ctx.globalCompositeOperation = 'lighter';

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += (p.gravity || 0.07);
                p.vx *= 0.97;
                p.alpha -= p.decay;

                if (p.alpha <= 0) { particles.splice(i, 1); continue; }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.fill();
            }

            if (Math.random() < 0.04) {
                fireRocket(
                    80 + Math.random() * (W - 160),
                    H * 0.1 + Math.random() * H * 0.35
                );
            }
        };

       
        setTimeout(() => fireRocket(W * 0.2, H * 0.25), 0);
        setTimeout(() => fireRocket(W * 0.5, H * 0.15), 300);
        setTimeout(() => fireRocket(W * 0.8, H * 0.3), 600);
        setTimeout(() => fireRocket(W * 0.35, H * 0.2), 1000);
        setTimeout(() => fireRocket(W * 0.65, H * 0.15), 1400);

        loop();

     
        setTimeout(() => {
            cancelAnimationFrame(rafId);
            ctx.clearRect(0, 0, W, H);
        }, 18000);
    }

});