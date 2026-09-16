/**
 * EcoRise - Local Eco-Challenge (SDG 13: Climate Action)
 * Main Application Orchestrator
 */

import { ACTIVITIES, BADGES, BASE_LEADERBOARD } from './data.js';
import { loadState, saveState, clearState } from './storage.js';
import { EcoByteController } from './mascot.js';
import { playCheckSound, playUncheckSound, playMilestoneSound, playChampionFanfare, setSoundEnabled, isSoundEnabled } from './sound.js';
import { triggerCelebration, initAmbientLeaves } from './confetti.js';
import { renderWeeklyChart, renderCategoryBreakdown } from './charts.js';

class EcoRiseApp {
  constructor() {
    this.state = loadState();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.previousMilestones = new Set();
    this.unlockedBadgeIds = new Set();

    // DOM References
    this.initDOM();

    // Mascots
    this.heroMascot = new EcoByteController({
      container: this.elements.heroMascotContainer,
      bubbleElement: this.elements.heroSpeechBubble,
      badgeElement: this.elements.heroEvolutionBadge
    });

    this.motivationMascot = new EcoByteController({
      container: this.elements.motivationMascotContainer,
      bubbleElement: this.elements.motivationSpeechBubble,
      badgeElement: null
    });
  }

  initDOM() {
    this.elements = {
      // Header
      pointsPill: document.getElementById('nav-points-val'),
      streakPill: document.getElementById('nav-streak-val'),
      miniAvatar: document.getElementById('nav-mini-avatar'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      mobileMenuBtn: document.getElementById('mobile-menu-btn'),
      mobileDrawer: document.getElementById('mobile-nav-drawer'),

      // Hero
      heroMascotContainer: document.getElementById('hero-mascot-container'),
      heroSpeechBubble: document.getElementById('hero-speech-bubble'),
      heroEvolutionBadge: document.getElementById('hero-evolution-badge'),
      leavesCanvas: document.getElementById('ambient-leaves-canvas'),

      // Weekly Progress Card
      pointsCurrentBig: document.getElementById('progress-points-current'),
      progressBarFill: document.getElementById('progress-bar-fill'),
      circleFill: document.getElementById('progress-circle-fill'),
      circlePercentage: document.getElementById('progress-circle-percentage'),
      statCompletedCount: document.getElementById('stat-completed-count'),
      statStreakDays: document.getElementById('stat-streak-days'),
      statWeeklyGoal: document.getElementById('stat-weekly-goal'),
      countdownText: document.getElementById('weekly-countdown-text'),

      // Motivation Panel
      motivationMascotContainer: document.getElementById('motivation-mascot-container'),
      motivationSpeechBubble: document.getElementById('motivation-speech-bubble'),
      btnPokeMascot: document.getElementById('btn-poke-mascot'),

      // Challenges Checklist
      categoryFilterContainer: document.getElementById('category-filter-container'),
      searchInput: document.getElementById('activity-search-input'),
      activitiesList: document.getElementById('activities-list-container'),

      // Streak & Community
      streakCountText: document.getElementById('streak-count-text'),
      weeklyCalendar: document.getElementById('weekly-streak-calendar'),
      communityCountText: document.getElementById('community-progress-text'),
      communityBarFill: document.getElementById('community-bar-fill'),
      communityPercentageText: document.getElementById('community-percentage-text'),

      // Badges
      badgesGrid: document.getElementById('badges-grid-container'),

      // Analytics & Leaderboard
      chartTrendContainer: document.getElementById('chart-trend-container'),
      chartCategoryContainer: document.getElementById('chart-category-container'),
      leaderboardList: document.getElementById('leaderboard-list-container'),

      // Impact Metrics
      impactTreesVal: document.getElementById('impact-trees-val'),
      impactWaterVal: document.getElementById('impact-water-val'),
      impactPlasticVal: document.getElementById('impact-plastic-val'),
      impactTransportVal: document.getElementById('impact-transport-val'),
      impactEnergyVal: document.getElementById('impact-energy-val'),

      // Modals
      championModal: document.getElementById('champion-modal'),
      championModalMascot: document.getElementById('champion-mascot-container'),
      howItWorksModal: document.getElementById('how-it-works-modal'),
      resetModal: document.getElementById('reset-modal'),
      demoBar: document.getElementById('demo-quick-bar'),
      toastContainer: document.getElementById('toast-container')
    };
  }

  start() {
    this.applyTheme(this.state.theme || 'light');
    setSoundEnabled(this.state.soundEnabled ?? true);
    this.updateSoundToggleUI();

    // Start background floating leaves
    if (this.elements.leavesCanvas) {
      initAmbientLeaves(this.elements.leavesCanvas);
    }

    // Render Mascots
    this.heroMascot.render();
    this.motivationMascot.render();

    // Render Filters and Checklist
    this.renderCategoryFilters();
    this.renderActivities();

    // Render Badges and Static views
    this.renderStreakCalendar();

    // Calculate Week Remaining Days
    this.updateCountdownDays();

    // Perform full score and UI sync
    this.sync(false);

    // Attach Event Listeners
    this.attachEventListeners();
  }

  /**
   * Important: Total Eco Points strictly computed dynamically from completed activities
   */
  calculateTotalPoints() {
    return this.state.completedIds.reduce((sum, id) => {
      const act = ACTIVITIES.find(a => a.id === id);
      return sum + (act ? act.points : 0);
    }, 0);
  }

  /**
   * Synchronize all views based on the current state
   */
  sync(playSound = false) {
    const totalPoints = this.calculateTotalPoints();
    const completedCount = this.state.completedIds.length;
    const weeklyGoal = 100;
    const progressPct = Math.min(100, Math.round((totalPoints / weeklyGoal) * 100));

    // 1. Update Header Pills
    if (this.elements.pointsPill) {
      this.elements.pointsPill.textContent = `${totalPoints} pts`;
    }
    if (this.elements.streakPill) {
      this.elements.streakPill.textContent = `${this.state.streak}d`;
    }
    if (this.elements.miniAvatar) {
      const currentStage = EcoByteController.getStageFromPoints(totalPoints);
      this.elements.miniAvatar.innerHTML = this.heroMascot.getMiniAvatarMarkup(currentStage);
    }

    // 2. Update Weekly Progress Card
    if (this.elements.pointsCurrentBig) {
      this.elements.pointsCurrentBig.textContent = totalPoints;
    }
    if (this.elements.progressBarFill) {
      this.elements.progressBarFill.style.width = `${progressPct}%`;
    }
    if (this.elements.circleFill) {
      // Circumference = 2 * PI * 60 ~= 377
      const offset = 377 - (377 * (progressPct / 100));
      this.elements.circleFill.style.strokeDashoffset = offset;
    }
    if (this.elements.circlePercentage) {
      this.elements.circlePercentage.textContent = `${progressPct}%`;
    }
    if (this.elements.statCompletedCount) {
      this.elements.statCompletedCount.textContent = `${completedCount}/${ACTIVITIES.length}`;
    }
    if (this.elements.statStreakDays) {
      this.elements.statStreakDays.textContent = `${this.state.streak} days`;
    }
    if (this.elements.statWeeklyGoal) {
      this.elements.statWeeklyGoal.textContent = `${weeklyGoal} pts`;
    }

    // 3. Update Mascots
    this.heroMascot.updateProgress(totalPoints);
    this.motivationMascot.updateProgress(totalPoints);

    // 4. Update Milestone Celebrations
    this.checkMilestones(totalPoints);

    // 5. Update Badges
    this.updateBadges(totalPoints);

    // 6. Update Impact Metrics
    this.updateImpactMetrics();

    // 7. Update Streak & Community
    if (this.elements.streakCountText) {
      this.elements.streakCountText.textContent = `${this.state.streak} Day Eco Streak`;
    }
    const communityBase = 328;
    const communityTotal = communityBase + completedCount;
    const communityGoal = 500;
    const communityPct = Math.min(100, ((communityTotal / communityGoal) * 100)).toFixed(1);

    if (this.elements.communityCountText) {
      this.elements.communityCountText.textContent = `${communityTotal} / ${communityGoal} actions`;
    }
    if (this.elements.communityBarFill) {
      this.elements.communityBarFill.style.width = `${communityPct}%`;
    }
    if (this.elements.communityPercentageText) {
      this.elements.communityPercentageText.textContent = `${communityPct}%`;
    }

    // 8. Update Analytics Charts
    renderWeeklyChart(this.elements.chartTrendContainer, totalPoints);
    renderCategoryBreakdown(this.elements.chartCategoryContainer, ACTIVITIES, this.state.completedIds);

    // 9. Update Leaderboard
    this.renderLeaderboard(totalPoints);

    // 10. Persist State
    saveState(this.state);
  }

  /**
   * Days remaining until end of current week (Sunday)
   */
  updateCountdownDays() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday
    const daysRemaining = currentDay === 0 ? 0 : (7 - currentDay);
    if (this.elements.countdownText) {
      this.elements.countdownText.textContent = `${daysRemaining} days remaining`;
    }
  }

  /**
   * Render category filter buttons
   */
  renderCategoryFilters() {
    const categories = [
      { key: "all", label: "All" },
      { key: "energy", label: "Energy" },
      { key: "water", label: "Water" },
      { key: "transport", label: "Transport" },
      { key: "waste", label: "Waste" },
      { key: "nature", label: "Nature" }
    ];

    this.elements.categoryFilterContainer.innerHTML = categories.map(cat => {
      const count = cat.key === "all" 
        ? ACTIVITIES.length 
        : ACTIVITIES.filter(a => a.category === cat.key).length;

      return `
        <button class="filter-pill ${this.activeCategory === cat.key ? 'active' : ''}" data-category="${cat.key}">
          ${cat.label} <span class="filter-count">${count}</span>
        </button>
      `;
    }).join('');

    this.elements.categoryFilterContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.dataset.category;
        this.activeCategory = cat;
        this.renderCategoryFilters();
        this.renderActivities();
      });
    });
  }

  /**
   * Render activity challenge cards with micro-interaction triggers
   */
  renderActivities() {
    const query = this.searchQuery.toLowerCase().trim();

    const filtered = ACTIVITIES.filter(act => {
      const matchesCat = this.activeCategory === 'all' || act.category === this.activeCategory;
      const matchesSearch = !query || 
        act.name.toLowerCase().includes(query) || 
        act.description.toLowerCase().includes(query) ||
        act.category.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      this.elements.activitiesList.innerHTML = `
        <div class="activities-empty-state">
          <div class="empty-mascot-slot" id="empty-mascot-slot"></div>
          <p class="empty-state-text">
            “Hmm… EcoByte couldn’t find a challenge here. Try another category! 🌱”
          </p>
          <button class="btn btn-secondary" id="btn-reset-filters">Show All Challenges</button>
        </div>
      `;

      const emptySlot = document.getElementById('empty-mascot-slot');
      if (emptySlot) {
        emptySlot.innerHTML = this.heroMascot.getSVGMarkup(0, 'normal');
      }

      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.activeCategory = 'all';
          this.searchQuery = '';
          if (this.elements.searchInput) this.elements.searchInput.value = '';
          this.renderCategoryFilters();
          this.renderActivities();
        });
      }
      return;
    }

    this.elements.activitiesList.innerHTML = filtered.map(act => {
      const isCompleted = this.state.completedIds.includes(act.id);
      return `
        <div class="activity-card ${isCompleted ? 'completed' : ''}" data-id="${act.id}" tabindex="0" role="checkbox" aria-checked="${isCompleted}">
          <div class="custom-checkbox-wrapper">
            <div class="custom-checkbox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <div class="activity-info">
            <div class="activity-top-row">
              <span class="activity-category-tag">${act.category}</span>
              <span class="activity-points-tag">+${act.points} Eco Points</span>
            </div>
            <h4 class="activity-title">${act.icon} ${act.name}</h4>
            <p class="activity-desc">${act.description}</p>
          </div>
        </div>
      `;
    }).join('');

    // Attach click and keyboard events
    this.elements.activitiesList.querySelectorAll('.activity-card').forEach(card => {
      const id = card.dataset.id;

      const toggleAction = (e) => {
        this.toggleActivity(id, card, e);
      };

      card.addEventListener('click', toggleAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleAction(e);
        }
      });
    });
  }

  /**
   * Handle checking / unchecking an activity
   */
  toggleActivity(id, cardElement, event) {
    const act = ACTIVITIES.find(a => a.id === id);
    if (!act) return;

    const isCurrentlyChecked = this.state.completedIds.includes(id);

    if (!isCurrentlyChecked) {
      // Check activity
      this.state.completedIds.push(id);
      playCheckSound();

      // Show floating points popup
      this.showPointsPopup(cardElement, `+${act.points}`);

      // EcoByte cheer
      this.heroMascot.cheer();
      this.motivationMascot.cheer();
      this.heroMascot.updateMessage(`Great choice! You just earned +${act.points} Eco Points for ${act.name}! 🌱`);

      // Toast notification
      this.showToast(`+${act.points} Eco Points 🌱`, `Awesome! Completed: "${act.name}"`);
    } else {
      // Uncheck activity
      this.state.completedIds = this.state.completedIds.filter(item => item !== id);
      playUncheckSound();
      this.heroMascot.updateMessage(`Activity unchecked. Keep striving for green habits!`);
      this.showToast(`Points updated`, `Removed "${act.name}"`);
    }

    // Re-render card state smoothly
    this.renderActivities();
    this.sync(true);
  }

  /**
   * Show floating +X points micro-animation on top of card
   */
  showPointsPopup(cardElement, text) {
    const popup = document.createElement('div');
    popup.className = 'points-floating-popup';
    popup.textContent = text;
    cardElement.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
  }

  /**
   * Check milestone points: 25, 50, 75, 100
   */
  checkMilestones(points) {
    const milestones = [25, 50, 75, 100];
    for (let m of milestones) {
      if (points >= m && !this.previousMilestones.has(m)) {
        this.previousMilestones.add(m);

        if (m === 100) {
          playChampionFanfare();
          triggerCelebration({ duration: 4000, particleCount: 120 });
          this.openChampionModal();
        } else {
          playMilestoneSound();
          triggerCelebration({ duration: 2500, particleCount: 50 });
          this.showToast(`Milestone Reached! 🎉`, `You reached ${m} Eco Points!`);
        }
      } else if (points < m && this.previousMilestones.has(m)) {
        this.previousMilestones.delete(m);
      }
    }
  }

  /**
   * Update achievements / badges
   */
  updateBadges(points) {
    const currentState = {
      completedIds: this.state.completedIds,
      totalPoints: points,
      streak: this.state.streak
    };

    let newlyUnlocked = [];

    this.elements.badgesGrid.innerHTML = BADGES.map(badge => {
      const isUnlocked = badge.condition(currentState);
      if (isUnlocked && !this.unlockedBadgeIds.has(badge.id)) {
        newlyUnlocked.push(badge);
        this.unlockedBadgeIds.add(badge.id);
      } else if (!isUnlocked && this.unlockedBadgeIds.has(badge.id)) {
        this.unlockedBadgeIds.delete(badge.id);
      }

      return `
        <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}" tabindex="0" role="article" aria-label="${badge.name}: ${badge.description}">
          <div class="badge-status-tag">${isUnlocked ? 'Unlocked ✨' : 'Locked 🔒'}</div>
          <div class="badge-icon-box">${badge.icon}</div>
          <div class="badge-info">
            <h4 class="badge-name">${badge.name}</h4>
            <p class="badge-desc">${badge.description}</p>
          </div>
        </div>
      `;
    }).join('');

    // If new badge was unlocked during active session, announce it!
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(b => {
        this.showToast(`Badge Unlocked! 🏆`, `You earned "${b.name}"`);
      });
    }
  }

  /**
   * Update tangible impact metrics
   */
  updateImpactMetrics() {
    let trees = 0;
    let waterLiters = 0;
    let plasticItems = 0;
    let transportKm = 0;
    let energyKwh = 0;

    for (let id of this.state.completedIds) {
      const act = ACTIVITIES.find(a => a.id === id);
      if (!act || !act.impact) continue;
      if (act.impact.trees) trees += act.impact.trees;
      if (act.impact.water) waterLiters += act.impact.water;
      if (act.impact.plastic) plasticItems += act.impact.plastic;
      if (act.impact.transport) transportKm += act.impact.transport;
      if (act.impact.energy) energyKwh += act.impact.energy;
    }

    if (this.elements.impactTreesVal) this.elements.impactTreesVal.textContent = trees;
    if (this.elements.impactWaterVal) this.elements.impactWaterVal.textContent = `${waterLiters}L`;
    if (this.elements.impactPlasticVal) this.elements.impactPlasticVal.textContent = plasticItems;
    if (this.elements.impactTransportVal) this.elements.impactTransportVal.textContent = `${transportKm}km`;
    if (this.elements.impactEnergyVal) this.elements.impactEnergyVal.textContent = `${energyKwh} actions`;
  }

  /**
   * Render weekly streak mini calendar
   */
  renderStreakCalendar() {
    const daysLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const currentDayIndex = ((new Date().getDay() + 6) % 7); // Monday = 0

    this.elements.weeklyCalendar.innerHTML = daysLabels.map((lbl, idx) => {
      const isCompleted = this.state.streakDays[idx];
      const isToday = idx === currentDayIndex;

      return `
        <div class="streak-day-item ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}">
          <span class="streak-day-label">${lbl}</span>
          <div class="streak-day-dot" title="${isCompleted ? 'Day completed' : 'Pending'}" tabindex="0">
            ${isCompleted ? '🔥' : '○'}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render community demo leaderboard dynamically with live user positioning
   */
  renderLeaderboard(userPoints) {
    const list = [...BASE_LEADERBOARD, { name: "You (Live)", points: userPoints, isUser: true, avatar: "🌱" }];
    list.sort((a, b) => b.points - a.points);

    this.elements.leaderboardList.innerHTML = list.map((item, idx) => {
      const isUser = item.isUser;
      return `
        <div class="leaderboard-item ${isUser ? 'current-user' : ''}">
          <div class="leaderboard-user-info">
            <span class="leaderboard-rank">${idx + 1}</span>
            <span style="font-size: 1.3rem;">${item.avatar}</span>
            <span class="leaderboard-name">
              ${item.name} ${isUser ? '<span class="user-badge-tag">You</span>' : ''}
            </span>
          </div>
          <span class="leaderboard-points">${item.points} pts</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Open Climate Champion full-modal celebration
   */
  openChampionModal() {
    if (!this.elements.championModal) return;
    if (this.elements.championModalMascot) {
      this.elements.championModalMascot.innerHTML = this.heroMascot.getSVGMarkup(3, 'happy');
    }
    this.elements.championModal.classList.add('open');
  }

  closeChampionModal() {
    if (this.elements.championModal) {
      this.elements.championModal.classList.remove('open');
    }
  }

  /**
   * Toast notification system
   */
  showToast(title, message) {
    if (!this.elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <div class="toast-icon">🌱</div>
      <div class="toast-text-group">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 320);
    }, 3600);
  }

  /**
   * Theme toggle Light / Dark
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.state.theme = theme;
    if (this.elements.themeToggleBtn) {
      this.elements.themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>` 
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      this.elements.themeToggleBtn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
  }

  toggleTheme() {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    saveState(this.state);
  }

  toggleSound() {
    const current = isSoundEnabled();
    setSoundEnabled(!current);
    this.state.soundEnabled = !current;
    this.updateSoundToggleUI();
    saveState(this.state);
    if (!current) playCheckSound();
  }

  updateSoundToggleUI() {
    if (!this.elements.soundToggleBtn) return;
    const enabled = isSoundEnabled();
    this.elements.soundToggleBtn.innerHTML = enabled
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    this.elements.soundToggleBtn.title = enabled ? "Sound On (Click to Mute)" : "Sound Muted (Click to Enable)";
  }

  /**
   * Reset all weekly progress
   */
  resetProgress() {
    this.state = clearState();
    this.previousMilestones.clear();
    this.unlockedBadgeIds.clear();
    this.renderActivities();
    this.renderStreakCalendar();
    this.sync(false);
    this.showToast("Progress Reset", "All weekly activities have been reset.");
  }

  /**
   * Demo Mode Presets for rapid testing & live evaluation
   */
  applyDemoPreset(presetName) {
    if (presetName === 'clean') {
      this.state.completedIds = [];
      this.previousMilestones.clear();
    } else if (presetName === 'beginner') {
      // 25 pts: Bottle (10) + Public Transit (15)
      this.state.completedIds = ['refillable_bottle', 'public_transport'];
    } else if (presetName === 'champion') {
      // 75 pts: Bottle (10) + Tree (25) + Cycling (20) + Electricity (10) + Water (10)
      this.state.completedIds = ['refillable_bottle', 'plant_tree', 'cycle_trip', 'save_electricity', 'save_water'];
    } else if (presetName === 'master') {
      // 105 pts: Bottle (10) + Tree (25) + Cycling (20) + Recycle (15) + Transit (15) + Water (10) + Plastic (10)
      this.state.completedIds = [
        'refillable_bottle', 'plant_tree', 'cycle_trip', 'recycle_waste', 
        'public_transport', 'save_water', 'avoid_plastic'
      ];
    }
    this.renderActivities();
    this.sync(true);
  }

  attachEventListeners() {
    // Theme toggle
    if (this.elements.themeToggleBtn) {
      this.elements.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Sound toggle
    if (this.elements.soundToggleBtn) {
      this.elements.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    }

    // Mobile nav toggle
    if (this.elements.mobileMenuBtn && this.elements.mobileDrawer) {
      this.elements.mobileMenuBtn.addEventListener('click', () => {
        this.elements.mobileDrawer.classList.toggle('open');
      });
      this.elements.mobileDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          this.elements.mobileDrawer.classList.remove('open');
        });
      });
    }

    // Search input
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderActivities();
      });
    }

    // Poke mascot button in motivation card
    if (this.elements.btnPokeMascot) {
      this.elements.btnPokeMascot.addEventListener('click', () => {
        this.motivationMascot.poke();
      });
    }

    // Demo Mode Quick Buttons
    document.querySelectorAll('[data-demo-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.currentTarget.dataset.demoPreset;
        this.applyDemoPreset(preset);
      });
    });

    // How It Works Modal
    const btnHowItWorks = document.getElementById('btn-how-it-works');
    if (btnHowItWorks && this.elements.howItWorksModal) {
      btnHowItWorks.addEventListener('click', () => {
        this.elements.howItWorksModal.classList.add('open');
      });
    }

    // Settings / Reset Modal
    const btnOpenSettings = document.getElementById('btn-open-settings');
    if (btnOpenSettings && this.elements.resetModal) {
      btnOpenSettings.addEventListener('click', () => {
        this.elements.resetModal.classList.add('open');
      });
    }

    // Close modals
    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) modal.classList.remove('open');
      });
    });

    // Reset Confirm Button
    const btnConfirmReset = document.getElementById('btn-confirm-reset');
    if (btnConfirmReset && this.elements.resetModal) {
      btnConfirmReset.addEventListener('click', () => {
        this.resetProgress();
        this.elements.resetModal.classList.remove('open');
      });
    }
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.ecoRise = new EcoRiseApp();
  window.ecoRise.start();
});
