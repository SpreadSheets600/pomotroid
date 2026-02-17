<template>
  <div class="StatsHistoryView">
    <div v-if="stats" class="StatsHistoryView-content">
      <div class="StatsHistoryView-header">
        <h2 class="StatsHistoryView-title">All-Time Overview</h2>
        <div class="StatsHistoryView-subtitle">Statistics since you started using Pomotroid</div>
      </div>

      <div class="StatsHistoryView-highlights">
        <div class="HighlightCard HighlightCard--primary">
          <div class="HighlightCard-icon">🏆</div>
          <div class="HighlightCard-content">
            <div class="HighlightCard-value">{{ stats.totalCompleted }}</div>
            <div class="HighlightCard-label">Total Completed Sessions</div>
          </div>
        </div>

        <div class="HighlightCard">
          <div class="HighlightCard-icon">⏰</div>
          <div class="HighlightCard-content">
            <div class="HighlightCard-value">{{ stats.totalHours }}</div>
            <div class="HighlightCard-label">Total Focus Time (hours)</div>
          </div>
        </div>

        <div class="HighlightCard">
          <div class="HighlightCard-icon">🔥</div>
          <div class="HighlightCard-content">
            <div class="HighlightCard-value">{{ stats.currentStreak }}</div>
            <div class="HighlightCard-label">Current Streak (days)</div>
          </div>
        </div>
      </div>

      <div class="StatsHistoryView-heatmap">
        <app-heatmap />
      </div>

      <div class="StatsHistoryView-stats">
        <div class="StatsGrid">
          <div class="StatItem">
            <div class="StatItem-label">Total Sessions</div>
            <div class="StatItem-value">{{ stats.totalSessions }}</div>
          </div>

          <div class="StatItem">
            <div class="StatItem-label">Completion Rate</div>
            <div class="StatItem-value">{{ completionRate }}%</div>
          </div>

          <div class="StatItem">
            <div class="StatItem-label">Interruptions</div>
            <div class="StatItem-value">{{ stats.totalInterrupted }}</div>
          </div>

          <div class="StatItem">
            <div class="StatItem-label">Avg Duration</div>
            <div class="StatItem-value">{{ stats.avgPerSession }}m</div>
          </div>

          <div class="StatItem">
            <div class="StatItem-label">First Record</div>
            <div class="StatItem-value StatItem-value--small">
              {{ formatDate(stats.firstSessionDate) }}
            </div>
          </div>

          <div class="StatItem">
            <div class="StatItem-label">Latest Record</div>
            <div class="StatItem-value StatItem-value--small">
              {{ formatDate(stats.lastSessionDate) }}
            </div>
          </div>
        </div>
      </div>

      <div class="StatsHistoryView-interruptions">
        <app-interruption-stats />
      </div>

      <div class="StatsHistoryView-achievement">
        <div class="Achievement-title">🎉 Milestones</div>
        <div class="Achievements">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="Achievement"
            :class="{ 'Achievement--unlocked': achievement.unlocked }"
          >
            <div class="Achievement-icon">{{ achievement.icon }}</div>
            <div class="Achievement-content">
              <div class="Achievement-name">{{ achievement.name }}</div>
              <div class="Achievement-desc">{{ achievement.desc }}</div>
            </div>
            <div v-if="achievement.unlocked" class="Achievement-badge">✓</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="StatsHistoryView-loading">
      Loading...
    </div>
  </div>
</template>

<script>
import AppHeatmap from './Stats-heatmap.vue'
import AppInterruptionStats from './Stats-interruptions.vue'

export default {
  name: 'StatsHistoryView',

  components: {
    AppHeatmap,
    AppInterruptionStats
  },

  computed: {
    stats() {
      return this.$store.getters.historyStats
    },

    completionRate() {
      if (!this.stats || this.stats.totalSessions === 0) return 0
      return ((this.stats.totalCompleted / (this.stats.totalCompleted + this.stats.totalInterrupted)) * 100).toFixed(1)
    },

    achievements() {
      const completed = this.stats?.totalCompleted || 0
      const streak = this.stats?.currentStreak || 0
      const hours = parseFloat(this.stats?.totalHours || 0)

      return [
        {
          id: 'first',
          icon: '🌱',
          name: 'Started',
          desc: 'Complete your first focus session',
          unlocked: completed >= 1
        },
        {
          id: 'ten',
          icon: '🔟',
          name: 'Getting Momentum',
          desc: 'Complete 10 focus sessions',
          unlocked: completed >= 10
        },
        {
          id: 'fifty',
          icon: '⭐',
          name: 'Consistent',
          desc: 'Complete 50 focus sessions',
          unlocked: completed >= 50
        },
        {
          id: 'hundred',
          icon: '💯',
          name: 'Centurion',
          desc: 'Complete 100 focus sessions',
          unlocked: completed >= 100
        },
        {
          id: 'streak7',
          icon: '🔥',
          name: 'One Week Streak',
          desc: 'Maintain a 7-day streak',
          unlocked: streak >= 7
        },
        {
          id: 'streak30',
          icon: '💪',
          name: 'Habit Builder',
          desc: 'Maintain a 30-day streak',
          unlocked: streak >= 30
        },
        {
          id: 'hours10',
          icon: '⏰',
          name: 'Focus Pro',
          desc: 'Accumulate 10 focused hours',
          unlocked: hours >= 10
        },
        {
          id: 'hours100',
          icon: '🏅',
          name: 'Time Master',
          desc: 'Accumulate 100 focused hours',
          unlocked: hours >= 100
        }
      ]
    }
  },

  mounted() {
    this.$store.dispatch('loadHistoryStats')
  },

  methods: {
    parseLocalDate(dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    },

    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = this.parseLocalDate(dateStr)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.StatsHistoryView {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 40px;
}

.StatsHistoryView-content {
  max-width: 1000px;
  margin: 0 auto;
}

.StatsHistoryView-header {
  margin-bottom: 32px;
  text-align: center;
}

.StatsHistoryView-title {
  color: var(--color-foreground);
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.StatsHistoryView-subtitle {
  color: var(--color-foreground-darker);
  font-size: 14px;
}

.StatsHistoryView-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.HighlightCard {
  background-color: var(--color-background);
  border-radius: 16px;
  display: flex;
  gap: 16px;
  padding: 24px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &--primary {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark, var(--color-accent)) 100%);

    .HighlightCard-value,
    .HighlightCard-label {
      color: white;
    }
  }
}

.HighlightCard-icon {
  font-size: 48px;
}

.HighlightCard-content {
  flex: 1;
}

.HighlightCard-value {
  color: var(--color-foreground);
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 4px;
}

.HighlightCard-label {
  color: var(--color-foreground-darker);
  font-size: 13px;
  line-height: 1.4;
}

.StatsHistoryView-heatmap,
.StatsHistoryView-interruptions {
  margin-bottom: 32px;
}

.StatsHistoryView-stats {
  background-color: var(--color-background);
  border-radius: 16px;
  margin-bottom: 32px;
  padding: 24px;
}

.StatsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.StatItem {
  text-align: center;
}

.StatItem-label {
  color: var(--color-foreground-darker);
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.StatItem-value {
  color: var(--color-foreground);
  font-size: 28px;
  font-weight: 700;

  &--small {
    font-size: 16px;
  }
}

.StatsHistoryView-achievement {
  background-color: var(--color-background);
  border-radius: 16px;
  padding: 24px;
}

.Achievement-title {
  color: var(--color-foreground);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.Achievements {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.Achievement {
  background-color: var(--color-background-light);
  border: 2px solid transparent;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  opacity: 0.4;
  padding: 16px;
  position: relative;
  transition: all 0.2s ease;

  &--unlocked {
    border-color: var(--color-accent);
    opacity: 1;

    &:hover {
      transform: translateX(4px);
    }
  }
}

.Achievement-icon {
  font-size: 32px;
}

.Achievement-content {
  flex: 1;
}

.Achievement-name {
  color: var(--color-foreground);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.Achievement-desc {
  color: var(--color-foreground-darker);
  font-size: 12px;
}

.Achievement-badge {
  align-items: center;
  background-color: var(--color-accent);
  border-radius: 50%;
  color: white;
  display: flex;
  font-size: 12px;
  font-weight: 700;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.StatsHistoryView-loading {
  align-items: center;
  color: var(--color-foreground-darker);
  display: flex;
  font-size: 16px;
  height: 100%;
  justify-content: center;
}
</style>
