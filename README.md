# 🌱 ECORISE2.O – Local Eco-Challenge (SDG 13: Climate Action)

> **Ramaiah University Applied Science Micro Hackathon 2026**  
> **Event date:** 16 September 2026

Created by **Samrat Choudhury**, **Sanjana SD**, and **Rohith S**.

For project-related queries, contact **[sanjanasd111@gmail.com](mailto:sanjanasd111@gmail.com)**.

> **Small Habits. Big Climate Impact.**  
> A polished, presentation-ready digital sustainability dashboard that turns weekly eco-friendly habits into measurable climate action, dynamic progress tracking, and companion mascot evolution.

The landing page includes animated feature cards and an animated three-step setup guide so judges can quickly understand what the project does and how to run it.

---

## 🌟 Key Highlights & Features

### 1. 🤖 Original Mascot: EcoByte 🌱🤖
- **Identity**: A futuristic eco-robot companion with a rounded metallic-pod chassis, digital LED visor, glowing eco-energy chest core, and a live plant sprouting from its head.
- **Evolution System**:
  - **Stage 1 (0–19 pts)**: *Sprout Robot* — Tender seedling with 2 small leaves, curious blinking eyes, gentle core pulse.
  - **Stage 2 (20–49 pts)**: *Energy Seedling* — Stronger stem with 3 leaves, happy expression, brightening green core glow.
  - **Stage 3 (50–99 pts)**: *Eco Champion* — Flourishing 5-leaf canopy, vibrant eco-aura, joyful arcs.
  - **Stage 4 (100+ pts)**: *Climate Master* — Golden-green blooming solar crown, spinning orbital particles, golden star eyes!
- **Interactive**: Tap EcoByte to hear synthesized chimes and discover real-world sustainability facts.

### 2. ⚡ Dynamic Real-Time Calculations
- **Strictly Derived**: Total Eco Points are strictly calculated as the sum of currently completed activities. Unchecking an activity instantly recalculates points, progress bar, circular gauge, impact metrics, and mascot stage.
- **Visual Progress Dial**: Circular SVG progress gauge (`stroke-dashoffset`) synchronized with linear gradient progress bar.
- **Tangible Impact Translation**: Automatically translates checked actions into estimated trees supported, liters of water conserved, single-use plastics avoided, green commute distance (km), and energy saved.

### 3. 🎯 Weekly Challenge Checklist
- 10 curated high-impact activities across 5 core categories:
  - 🌱 **Nature**: Plant a tree (+25), Community clean-up (+25)
  - 💧 **Water**: Use a refillable bottle (+10), Save water (+10)
  - 🚲 **Transport**: Cycle instead of driving (+20), Use public transport (+15)
  - 💡 **Energy**: Save electricity (+10), Switch off unused lights (+10)
  - ♻️ **Waste**: Recycle waste (+15), Avoid single-use plastic (+10)
- Instant category filter pills with live counters.
- Real-time search with instant fuzzy matching.
- Floating `+X Eco Points` popups, custom animated checkboxes, and toast notifications.
- Custom friendly EcoByte empty state when search filters return no results.

### 4. 🏆 Badges & Milestones
- **8 Dynamic Badges**: *First Step, Water Saver, Tree Champion, Green Commuter, Waste Warrior, Energy Guardian, Eco Streaker, Climate Champion*.
- **Celebrations**: Confetti particle engine triggers at 25, 50, 75 points, plus a grand **Climate Champion Full-Screen Modal** at 100+ points with mascot animation.

### 5. 🔥 Eco Streak & Community Hub
- **7-Day Weekly Tracker**: Mon–Sun visual mini calendar with completed streak indicators.
- **Community Goal Meter**: Collective "500 Eco-Actions Together" progress tracker (328 baseline + live user actions).
- **Demo Community Leaderboard**: Live ranking with the user's score dynamically positioned.

### 6. 📊 Progress Analytics & SDG 13 Hub
- **4-Week Trend Bar Chart**: Vector SVG chart showing historical weeks and the user's live Week 4 score.
- **Category Performance Breakdown**: Progress bars comparing performance across Nature, Water, Transport, Energy, and Waste.
- **SDG 13 Education**: Clear mapping of how local everyday actions directly support UN Goal 13: Climate Action.

### 7. 🎨 Polish & Accessibility
- **Light & Dark Mode**: Seamless theme switching with persistent user preference.
- **Web Audio API Chimes**: Synthesized acoustic double-tone chimes and fanfare with mute toggle (zero audio file dependencies).
- **Ambient Floating Leaves**: Dynamic HTML5 Canvas background particle system.
- **Demo Mode Bar**: Dedicated 1-click test buttons (0 pts, 25 pts, 75 pts, 105 pts) for instant presentation to judges.
- **Local Privacy**: 100% client-side persistence using `localStorage` with a safe reset confirmation modal.

---

## 🚀 How to Run the Project

### Option A: Direct Open (Zero Setup Required)
Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option B: Local Web Server
If you prefer running via a local server:

Using Node.js:
```bash
npx serve .
# or
npm start
```

Using Python:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

---

## 🎬 Suggested 2–3 Minute Presentation Flow for Judges

1. **Introduction**: Open `index.html`. Introduce the concept: *“EcoRise makes climate action accessible through small habits, local challenges, and our companion mascot EcoByte.”*
2. **EcoByte Introduction**: Point out the hero section and EcoByte's Sprout Robot stage (0 points). Tap "Tap for Eco Tip" to demonstrate the interactive dialogue.
3. **Interactive Habit Completion**: Scroll to the Weekly Challenge checklist.
   - Check *"Use a refillable bottle"* (+10 pts) — observe the floating `+10` popup, sound chime, circular progress dial moving, and toast notification.
   - Check *"Plant a tree"* (+25 pts) — points reach 35! Watch EcoByte evolve to **Stage 2 (Energy Seedling)** with growing leaves and brighter green core.
   - Observe the **Tree Champion** badge unlock with shine.
4. **Dynamic Recalculation**: Uncheck *"Use a refillable bottle"* to show judges that points immediately drop to 25 and recalculate live without hardcoding.
5. **Fast Demo Mode**: In the top purple Demo Bar, click **"105 Pts (Climate Champion)"**:
   - Watch the grand celebration confetti fire!
