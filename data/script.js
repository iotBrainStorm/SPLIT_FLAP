/**
 * ESP32 Split Flap Dashboard Controller
 * Modular JS Structure matching production standards.
 */

const app = {
    modulesCount: 8,
    flapElements:[],
    
    init() {
        this.initNavigation();
        this.initMobileMenu();
        this.initFlaps();
        this.initModulesTable();
        this.initMockWebSocket();
        this.initClock();

        // Show welcome toast
        setTimeout(() => this.showToast("Dashboard initialized successfully", "success"), 500);
    },

    // --- Navigation ---
    initNavigation() {
        const navItems = document.querySelectorAll("#nav-menu li");
        const views = document.querySelectorAll(".view");
        const pageTitle = document.getElementById("page-title");

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navItems.forEach(nav => nav.classList.remove("active"));
                item.classList.add("active");

                const targetViewId = item.getAttribute("data-target");
                views.forEach(view => view.classList.remove("active"));

                const targetView = document.getElementById(targetViewId);
                if (targetView) targetView.classList.add("active");

                const titleText = item.innerText.trim();
                if(pageTitle) pageTitle.innerText = `Dashboard ${titleText}`;

                // Close mobile menu if open
                const sidebar = document.getElementById("sidebar");
                if(sidebar.classList.contains("open")) {
                    sidebar.classList.remove("open");
                }
            });
        });
    },

    initMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        if(btn && sidebar) {
            btn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    },

    // --- Split Flap Render & Logic ---
    initFlaps() {
        const container = document.getElementById("main-flaps");
        if(!container) return;
        
        container.innerHTML = '';
        const initialText = "FLIGHTS ";

        for (let i = 0; i < this.modulesCount; i++) {
            const char = initialText[i] || " ";
            const flap = document.createElement("div");
            flap.className = "flap";
            
            // Premium 2-part structure for 3D flip illusion
            flap.innerHTML = `
                <div class="flap-top">${char}</div>
                <div class="flap-bottom">${char}</div>
            `;
            container.appendChild(flap);
            this.flapElements.push(flap);
        }
    },

    setFlapChar(index, newChar) {
        if(index >= this.flapElements.length) return;
        const flap = this.flapElements[index];
        const top = flap.querySelector('.flap-top');
        const bottom = flap.querySelector('.flap-bottom');
        
        // Trigger CSS flip animation
        flap.classList.remove('flipping');
        // Force reflow
        void flap.offsetWidth; 
        flap.classList.add('flipping');
        
        // Change text halfway through animation
        setTimeout(() => {
            top.innerText = newChar;
            bottom.innerText = newChar;
        }, 150);
        
        // Cleanup class
        setTimeout(() => {
            flap.classList.remove('flipping');
        }, 300);
    },

    // Used by the "Display" page 'Send' button
    sendMessage(animated = true) {
        const input = document.getElementById("display-input").value.toUpperCase().padEnd(this.modulesCount, " ");
        document.getElementById("current-msg-stat").innerText = input;
        
        if (animated) {
            // Cascade / Airport Roll effect
            for (let i = 0; i < this.modulesCount; i++) {
                setTimeout(() => {
                    this.simulateRoll(i, input[i]);
                }, i * 150); // Cascade delay
            }
            this.showToast(`Rolling to: ${input}`, "info");
        } else {
            // Instant update
            for (let i = 0; i < this.modulesCount; i++) {
                const flap = this.flapElements[i];
                flap.querySelector('.flap-top').innerText = input[i];
                flap.querySelector('.flap-bottom').innerText = input[i];
            }
            this.showToast(`Updated instantly: ${input}`, "success");
        }
    },

    // Simulates flipping through random characters before landing on target
    simulateRoll(index, targetChar) {
        let flips = 0;
        const maxFlips = 5 + Math.floor(Math.random() * 5); // 5 to 10 random flips
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
        
        const interval = setInterval(() => {
            if(flips >= maxFlips) {
                clearInterval(interval);
                this.setFlapChar(index, targetChar);
            } else {
                const randChar = chars[Math.floor(Math.random() * chars.length)];
                this.setFlapChar(index, randChar);
                flips++;
            }
        }, 350); // Speed of roll
    },

    testFlip() {
        for (let i = 0; i < this.modulesCount; i++) {
            this.setFlapChar(i, "8");
            setTimeout(() => this.setFlapChar(i, " "), 800);
        }
        this.showToast("Flip test executed.", "info");
    },

    // --- Modules Table Data ---
    initModulesTable() {
        const tbody = document.getElementById("module-table-body");
        if(!tbody) return;

        const mockChars =['F','L','I','G','H','T','S',' '];
        
        for (let i = 0; i < this.modulesCount; i++) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>#${i+1}</td>
                <td class="text-accent" style="font-size: 16px;">${mockChars[i]}</td>
                <td>Pos ${12 + i}</td>
                <td><span class="badge" style="background: rgba(16, 185, 129, 0.1); color: #10B981;">Triggered</span></td>
                <td>Idle</td>
                <td>OK</td>
                <td>
                    <button class="btn btn-outline btn-sm" title="Step Forward"><i class="fa-solid fa-forward-step"></i></button>
                    <button class="btn btn-outline btn-sm" title="Home"><i class="fa-solid fa-house"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    },

    // --- Live Clock ---
    initClock() {
        setInterval(() => {
            const clockEl = document.getElementById("live-clock");
            if(clockEl) {
                const now = new Date();
                let hrs = now.getHours();
                let mins = now.getMinutes();
                let ampm = hrs >= 12 ? 'PM' : 'AM';
                hrs = hrs % 12;
                hrs = hrs ? hrs : 12; 
                mins = mins < 10 ? '0' + mins : mins;
                clockEl.innerText = `${hrs}:${mins} ${ampm}`;
            }
        }, 1000);
    },

    // --- Simulated WebSocket ---
    initMockWebSocket() {
        const dot = document.getElementById("ws-indicator");
        const text = document.getElementById("ws-text");
        
        // Simulate connecting...
        setTimeout(() => {
            dot.classList.remove("offline");
            dot.classList.add("online");
            text.innerText = "WS Connected";
        }, 1000);
        
        // Occasional mock ping/terminal log
        setInterval(() => {
            const terminal = document.getElementById("sys-terminal");
            if(terminal && this.getIsViewActive('diagnostics')) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: false });
                const msg = `[${time}] [SYS] Free heap: ${Math.floor(Math.random() * 50 + 100)}KB<br>`;
                // Insert before the cursor
                terminal.innerHTML = terminal.innerHTML.replace('<span class="cursor">_</span>', msg + '<span class="cursor">_</span>');
                terminal.scrollTop = terminal.scrollHeight;
            }
        }, 5000);
    },

    getIsViewActive(id) {
        const el = document.getElementById(id);
        return el ? el.classList.contains("active") : false;
    },

    // --- UI Tools ---
    setTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
        
        // Update active button state in settings
        const buttons = document.querySelectorAll("#settings .button-group .btn");
        buttons.forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");
        
        this.showToast(`Theme changed to ${themeName}`, "info");
    },

    showToast(message, type = "info") {
        const container = document.getElementById("toast-container");
        if(!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        let icon = "fa-circle-info";
        if(type === 'warning') icon = "fa-triangle-exclamation";
        if(type === 'error') icon = "fa-circle-xmark";
        if(type === 'success') icon = "fa-circle-check";

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = "slideOut 0.3s ease forwards";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Boot App
document.addEventListener("DOMContentLoaded", () => {
    app.init();
});