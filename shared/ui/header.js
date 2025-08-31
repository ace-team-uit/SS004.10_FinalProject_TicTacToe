/**
 * Game Header Component for HUD (Heads Up Display)
 * @namespace
 */
const GameHUD = {
  // DOM elements
  elements: {
    /** @type {HTMLElement|null} */ scoreDisplay: null,
    /** @type {HTMLElement|null} */ starsContainer: null, 
    /** @type {any[]} */ stars: [],
    /** @type {HTMLElement|null} */ progressBar: null,
    /** @type {HTMLElement|null} */ progressFill: null,
    /** @type {HTMLElement|null} */ musicBtn: null,
    /** @type {HTMLElement|null} */ backBtn: null,
    /** @type {HTMLElement|null} */ settingsBtn: null
  },

  // Game state
  gameState: {
    scores: { player1: 0, player2: 0 },
    stars: 3,
    timeLeft: 15,
    totalTime: 15,
    difficulty: 'easy'
  },

  /**
   * Initialize and cache DOM elements
   */
  init() {
    const elements = this.elements;

    console.log('🔍 Searching for HUD elements...');

    // Find all HUD elements by ID
    elements.scoreDisplay = document.getElementById('score-display');
    elements.starsContainer = document.getElementById('stars-container');
    elements.stars = [
      document.getElementById('star-left'),
      document.getElementById('star-center'),
      document.getElementById('star-right')
    ].filter(Boolean);
    elements.progressBar = document.getElementById('progress-bar');
    elements.progressFill = document.getElementById('progress-fill');
    elements.musicBtn = document.getElementById('music-btn');
    elements.backBtn = document.getElementById('back-btn');
    elements.settingsBtn = document.getElementById('settings-btn');

    console.log('🔍 DOM elements found:', {
      scoreDisplay: elements.scoreDisplay,
      starsContainer: elements.starsContainer,
      stars: elements.stars,
      progressBar: elements.progressBar,
      progressFill: elements.progressFill
    });

    // Validate required elements
    this.validateElements();

    // Bind keyboard controls
    this.bindKeyboardControls();

    // Initialize default state
    this.updateScores({ player1: 0, player2: 0 });
    this.updateStars(3);
    this.updateTimer({ current: 15, total: 15 });

    console.log('🎮 Game HUD initialized');
    console.log('🔍 Found elements:', {
      scoreDisplay: !!elements.scoreDisplay,
      starsContainer: !!elements.starsContainer,
      stars: elements.stars.length,
      progressBar: !!elements.progressBar,
      progressFill: !!elements.progressFill
    });
  },

  /**
   * Validate that all required DOM elements exist
   */
  validateElements() {
    const requiredElements = [
      { name: 'scoreDisplay', element: this.elements.scoreDisplay },
      { name: 'starsContainer', element: this.elements.starsContainer },
      { name: 'progressBar', element: this.elements.progressBar },
      { name: 'progressFill', element: this.elements.progressFill }
    ];

    const missingElements = requiredElements.filter(item => !item.element);
    if (missingElements.length > 0) {
      console.warn('⚠️ Missing HUD elements:', missingElements.map(item => item.name));
    }
  },

  /**
   * Setup keyboard shortcuts for navigation
   */
  bindKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      // Only handle shortcuts when game is active
      if (!this.elements.backBtn) return;

      switch(e.key.toLowerCase()) {
        case 'escape':
          this.elements.backBtn?.click();
          break;
        case 'm':
          this.elements.musicBtn?.click();
          break; 
        case 's':
          this.elements.settingsBtn?.click();
          break;
        case 'r':
          // Reset game shortcut
          this.resetGame();
          break;
      }
    });
    console.log('⌨️ Keyboard controls bound');
  },

  /**
   * Update score display for both players
   * @param {{player1?: number, player2?: number}} scores - Player scores object
   */
  updateScores(scores) {
    const display = this.elements.scoreDisplay;
    if (!display) {
      console.warn('⚠️ Score display element not found');
      return;
    }

    const p1 = scores.player1 ?? 0;
    const p2 = scores.player2 ?? 0;
    
    // Format score display
    display.textContent = `${p1}:${p2}`;
    
    // Add visual feedback for score changes
    display.classList.add('score-updated');
    setTimeout(() => {
      display.classList.remove('score-updated');
    }, 300);

    // Update internal state
    this.gameState.scores = { player1: p1, player2: p2 };

    console.log(`📊 Scores updated: ${p1}:${p2}`);
  },

  /**
   * Update timer display and progress bar
   * @param {{current?: number, total?: number}} time - Time object with current and total
   */
  updateTimer(time) {
    const fill = this.elements.progressFill;
    if (!fill) {
      console.warn('⚠️ Progress fill element not found');
      return;
    }

    const current = time.current ?? 0;
    const total = time.total ?? 15;
    const percent = Math.max(0, Math.min(100, (current / total) * 100));

    console.log(`🎯 Updating progress bar: ${current}/${total}s = ${percent.toFixed(1)}%`);

    // Update progress bar width
    fill.style.width = `${percent}%`;
    console.log(`📏 Progress bar width set to: ${percent}%`);

    // Update color based on time remaining
    if (percent <= 20) {
      fill.style.background = 'var(--red-400)';
      fill.classList.add('timer-urgent');
      console.log('🔴 Timer urgent - Red color');
    } else if (percent <= 50) {
      fill.style.background = 'var(--yellow-400)';
      fill.classList.remove('timer-urgent');
      console.log('🟡 Timer warning - Yellow color');
    } else {
      fill.style.background = 'var(--green-400)';
      fill.classList.remove('timer-urgent');
      console.log('🟢 Timer normal - Green color');
    }

    // Update internal state
    this.gameState.timeLeft = current;
    this.gameState.totalTime = total;

    console.log(`⏱️ Timer updated: ${current}/${total}s (${percent.toFixed(1)}%)`);
  },

  /**
   * Update star display (lives/hearts)
   * @param {number} count - Number of filled stars (0-3)
   */
  updateStars(count) {
    const stars = this.elements.stars;
    if (!stars.length) {
      console.warn('⚠️ Star elements not found');
      return;
    }

    // Clamp count between 0 and max stars
    const maxStars = stars.length;
    count = Math.max(0, Math.min(count, maxStars));

    // Update each star
    stars.forEach((star, i) => {
      const isFilled = i < count;
      const starType = isFilled ? 'filled' : 'empty';
      
      // Update star image using src property
      if (star && 'src' in star) {
        star.src = `assets/images/game/star-${starType}.png`;
      }
    });

    // Add animation for star changes
    if (count < this.gameState.stars) {
      this.animateStarLoss();
    }

    // Update internal state
    this.gameState.stars = count;

    console.log(`⭐ Stars: ${count}/${maxStars}`);
  },

  /**
   * Animate star loss effect
   */
  animateStarLoss() {
    const starsContainer = this.elements.starsContainer;
    if (!starsContainer) return;

    starsContainer.classList.add('stars-shake');
    setTimeout(() => {
      starsContainer.classList.remove('stars-shake');
    }, 500);
  },

  /**
   * Create color palette for theme preview
   * @returns {HTMLElement} Color palette DOM element
   */
  createColorPalette() {
    const palette = document.createElement('div');
    palette.className = 'color-palette';
    palette.setAttribute('role', 'toolbar');
    palette.setAttribute('aria-label', 'Theme color options');

    // Theme color options
    const colors = [
      { name: 'Dark', value: '#1a1a1a', class: 'theme-dark' },
      { name: 'Light', value: '#ffffff', class: 'theme-light' },
      { name: 'Blue', value: '#3b82f6', class: 'theme-blue' },
      { name: 'Green', value: '#10b981', class: 'theme-green' },
      { name: 'Purple', value: '#8b5cf6', class: 'theme-purple' },
      { name: 'Orange', value: '#f59e0b', class: 'theme-orange' }
    ];

    colors.forEach(color => {
      const swatch = document.createElement('button');
      swatch.className = `color-swatch ${color.class}`;
      swatch.setAttribute('type', 'button');
      swatch.setAttribute('aria-label', `Select ${color.name} theme`);
      swatch.style.backgroundColor = color.value;
      
      // Add hover effect
      swatch.addEventListener('mouseenter', () => {
        swatch.style.transform = 'scale(1.1)';
      });
      
      swatch.addEventListener('mouseleave', () => {
        swatch.style.transform = 'scale(1)';
      });

      // Handle click to preview theme
      swatch.addEventListener('click', () => {
        this.previewTheme(color);
      });

      palette.appendChild(swatch);
    });

    return palette;
  },

  /**
   * Preview theme color and dispatch event
   * @param {{name: string, value: string, class: string}} color - Color object
   */
  previewTheme(color) {
    // Dispatch theme preview event
    const themeEvent = new CustomEvent('theme:preview', {
      detail: { 
        color: color.value,
        name: color.name,
        class: color.class
      }
    });
    
    document.dispatchEvent(themeEvent);
    
    // Visual feedback
    this.showThemePreview(color);
    
    console.log(`🎨 Theme preview: ${color.name} (${color.value})`);
  },

  /**
   * Show visual theme preview
   * @param {{name: string, value: string, class: string}} color - Color object
   */
  showThemePreview(color) {
    // Remove existing preview
    const existingPreview = document.querySelector('.theme-preview');
    if (existingPreview) {
      existingPreview.remove();
    }

    // Create preview element
    const preview = document.createElement('div');
    preview.className = 'theme-preview';
    preview.textContent = `${color.name} Theme`;
    preview.style.backgroundColor = color.value;
    preview.style.color = this.getContrastColor(color.value);
    
    // Position and show preview
    document.body.appendChild(preview);
    
    // Auto-hide after 2 seconds
    setTimeout(() => {
      preview.remove();
    }, 2000);
  },

  /**
   * Get contrasting text color for background
   * @param {string} hexColor - Hex color value
   * @returns {string} Contrasting color (black or white)
   */
  getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#ffffff';
  },

  /**
   * Reset game state (called via keyboard shortcut)
   */
  resetGame() {
    // Dispatch reset event
    const resetEvent = new CustomEvent('game:reset');
    document.dispatchEvent(resetEvent);
    
    // Reset HUD to default state
    this.updateScores({ player1: 0, player2: 0 });
    this.updateStars(3);
    this.updateTimer({ current: 15, total: 15 });
    
    console.log('🔄 Game reset via keyboard shortcut');
  },

  /**
   * Get current HUD state
   * @returns {Object} Current HUD state
   */
  getState() {
    return {
      scores: this.gameState.scores,
      stars: this.gameState.stars,
      timer: {
        current: this.gameState.timeLeft,
        total: this.gameState.totalTime
      },
      difficulty: this.gameState.difficulty
    };
  },

  /**
   * Initialize game with difficulty
   * @param {string} difficulty - Game difficulty (easy, medium, hard)
   */
  initializeGame(difficulty) {
    console.log(`🎯 Initializing game with difficulty: ${difficulty}`);
    
    // Set timer based on difficulty
    switch(difficulty) {
      case 'hard':
        this.gameState.timeLeft = 5;
        this.gameState.totalTime = 5;
        break;
      case 'medium':
        this.gameState.timeLeft = 10;
        this.gameState.totalTime = 10;
        break;
      case 'easy':
      default:
        this.gameState.timeLeft = 15;
        this.gameState.totalTime = 15;
        break;
    }
    
    this.gameState.difficulty = difficulty;
    
    console.log(`⏱️ Timer set to: ${this.gameState.timeLeft}/${this.gameState.totalTime}s`);
    
    // Force update progress bar immediately
    this.updateTimer({ 
      current: this.gameState.timeLeft, 
      total: this.gameState.totalTime 
    });
    
    // Update HUD display
    this.updateHUD();
    
    // Start game timer
    this.startGameTimer();
    
    console.log(`🎯 Game initialized with ${difficulty} difficulty (${this.gameState.timeLeft}s)`);
  },

  /**
   * Update all HUD elements
   */
  updateHUD() {
    this.updateScores(this.gameState.scores);
    this.updateStars(this.gameState.stars);
    this.updateTimer({ 
      current: this.gameState.timeLeft, 
      total: this.gameState.totalTime 
    });
    
    console.log(`🔄 HUD updated - Time: ${this.gameState.timeLeft}/${this.gameState.totalTime}s, Stars: ${this.gameState.stars}`);
  },

  /**
   * Reset and restart timer for next turn
   */
  resetTimer() {
    // Reset time left to total time
    this.gameState.timeLeft = this.gameState.totalTime;
    
    // Update display
    this.updateTimer({
      current: this.gameState.timeLeft,
      total: this.gameState.totalTime
    });
    
    // Restart timer
    this.startGameTimer();
    
    console.log(`🔄 Timer reset to ${this.gameState.timeLeft}s`);
  },

  /**
   * Start game timer countdown
   */
  startGameTimer() {
    // Clear existing timer if any
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }

    console.log(`⏱️ Starting timer: ${this.gameState.timeLeft}s remaining`);

    this.gameTimer = setInterval(() => {
      if (this.gameState.timeLeft > 0) {
        this.gameState.timeLeft--;
        console.log(`⏱️ Timer tick: ${this.gameState.timeLeft}s remaining`);
        
        // Update timer display immediately
        this.updateTimer({ 
          current: this.gameState.timeLeft, 
          total: this.gameState.totalTime 
        });
      } else {
        clearInterval(this.gameTimer);
        this.onTimeExpired();
      }
    }, 1000);
  },

  /**
   * Handle time expired
   */
  onTimeExpired() {
    // Decrement star
    this.gameState.stars = Math.max(0, this.gameState.stars - 1);
    
    if (this.gameState.stars <= 0) {
      // Game over
      console.log('❌ Game Over - No stars remaining!');
      // TODO: Show game over popup
    } else {
      // Reset timer for next round
      this.gameState.timeLeft = this.gameState.totalTime;
      this.updateHUD();
      this.startGameTimer();
    }
    
    // Animate star loss
    this.animateStarLoss();
  },

  /**
   * Test function to manually test progress bar
   */
  testProgressBar() {
    console.log('🧪 Testing progress bar...');
    
    const progressFill = document.getElementById('progress-fill');
    if (!progressFill) {
      console.error('❌ progress-fill element not found!');
      return;
    }
    
    console.log('✅ progress-fill found, testing...');
    
    // Test different values
    this.updateTimer({ current: 15, total: 15 }); // 100%
    setTimeout(() => {
      this.updateTimer({ current: 10, total: 15 }); // 66.7%
    }, 1000);
    setTimeout(() => {
      this.updateTimer({ current: 5, total: 15 }); // 33.3%
    }, 2000);
    setTimeout(() => {
      this.updateTimer({ current: 1, total: 15 }); // 6.7%
    }, 3000);
  }
};

// Debug: Log when header.js is loaded
console.log('📜 header.js loaded, checking DOM state...');

// Initialize when DOM loads
if (document.readyState === 'loading') {
  console.log('⏳ DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOMContentLoaded fired, initializing GameHUD...');
    // Check if GameHUD already exists
    if (!/** @type {any} */ (window).GameHUD) {
      GameHUD.init();
      /** @type {any} */ (window).GameHUD = GameHUD;
      console.log('🎮 GameHUD initialized and made global');
    } else {
      console.log('🔄 GameHUD already exists, skipping initialization');
    }
  });
} else {
  console.log('✅ DOM already ready, initializing GameHUD immediately...');
  // Check if GameHUD already exists
  if (!/** @type {any} */ (window).GameHUD) {
    GameHUD.init();
    /** @type {any} */ (window).GameHUD = GameHUD;
    console.log('🎮 GameHUD initialized and made global');
  } else {
    console.log('🔄 GameHUD already exists, skipping initialization');
  }
}
