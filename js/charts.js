/**
 * EcoRise - Local Eco-Challenge
 * Custom Responsive Vector SVG Charts for Progress Analytics
 * High performance, zero external libraries.
 */

import { HISTORICAL_WEEKS } from './data.js';

/**
 * Render the 4-week trend bar chart incorporating the live user score for Week 4
 */
export function renderWeeklyChart(container, livePoints = 0) {
  if (!container) return;

  const data = [
    { label: "Week 1", points: 65, isLive: false },
    { label: "Week 2", points: 80, isLive: false },
    { label: "Week 3", points: 45, isLive: false },
    { label: "Week 4 (Live)", points: livePoints, isLive: true }
  ];

  const maxPoints = Math.max(120, ...data.map(d => d.points));
  const chartHeight = 180;
  const chartWidth = 460;
  const barWidth = 48;
  const startX = 45;
  const gap = 100;
  const baselineY = 160;

  // Gridlines at 25, 50, 75, 100 points
  const gridLevels = [0, 50, 100];
  const gridLinesSVG = gridLevels.map(lvl => {
    const y = baselineY - (lvl / maxPoints) * 125;
    return `
      <line x1="35" y1="${y}" x2="${chartWidth - 20}" y2="${y}" stroke="currentColor" stroke-dasharray="3,3" opacity="0.15" />
      <text x="28" y="${y + 4}" font-size="10" fill="currentColor" opacity="0.6" text-anchor="end">${lvl}</text>
    `;
  }).join('');

  const barsSVG = data.map((d, i) => {
    const x = startX + i * gap;
    const barHeight = Math.max(6, (d.points / maxPoints) * 125);
    const y = baselineY - barHeight;
    const fill = d.isLive 
      ? 'url(#liveBarGrad)' 
      : 'url(#historyBarGrad)';

    return `
      <g class="chart-bar-group" tabindex="0" role="graphics-symbol" aria-label="${d.label}: ${d.points} points">
        <!-- Bar Rect -->
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${fill}" />
        
        <!-- Score Label on Top -->
        <text x="${x + barWidth / 2}" y="${y - 8}" font-size="12" font-weight="800" fill="currentColor" text-anchor="middle" class="bar-value-text">
          ${d.points}
        </text>

        <!-- Week Label at Bottom -->
        <text x="${x + barWidth / 2}" y="${baselineY + 20}" font-size="11" font-weight="${d.isLive ? '800' : '600'}" fill="currentColor" opacity="${d.isLive ? '1' : '0.75'}" text-anchor="middle">
          ${d.label}
        </text>

        ${d.isLive ? `
          <!-- Live Indicator Badge -->
          <circle cx="${x + barWidth / 2}" cy="${y - 24}" r="3.5" fill="#10b981" />
        ` : ''}
      </g>
    `;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${chartWidth} 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" class="chart-svg">
      <defs>
        <linearGradient id="historyBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#34d399" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.4" />
        </linearGradient>
        <linearGradient id="liveBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#10b981" />
        </linearGradient>
      </defs>
      ${gridLinesSVG}
      ${barsSVG}
    </svg>
  `;
}

/**
 * Render category performance breakdown bars
 */
export function renderCategoryBreakdown(container, activities, completedIds) {
  if (!container) return;

  const categories = [
    { key: "nature", label: "Nature & Trees", icon: "🌱", color: "#10b981" },
    { key: "water", label: "Water Saving", icon: "💧", color: "#06b6d4" },
    { key: "transport", label: "Clean Transit", icon: "🚲", color: "#8b5cf6" },
    { key: "energy", label: "Energy Conservation", icon: "💡", color: "#f59e0b" },
    { key: "waste", label: "Waste Reduction", icon: "♻️", color: "#14b8a6" }
  ];

  const html = categories.map(cat => {
    const totalInCat = activities.filter(a => a.category === cat.key).length;
    const completedInCat = activities.filter(a => a.category === cat.key && completedIds.includes(a.id)).length;
    const pct = totalInCat > 0 ? Math.round((completedInCat / totalInCat) * 100) : 0;

    return `
      <div class="category-stat-row" style="margin-bottom: 0.85rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.3rem;">
          <span style="display: flex; align-items: center; gap: 0.4rem;">
            <span>${cat.icon}</span> ${cat.label}
          </span>
          <span style="color: var(--text-muted);">${completedInCat}/${totalInCat} done (${pct}%)</span>
        </div>
        <div style="width: 100%; height: 8px; background: var(--border-subtle); border-radius: 99px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background: ${cat.color}; border-radius: 99px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}
