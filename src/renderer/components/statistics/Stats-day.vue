<template>
  <div class="StatsDayView">
    <div v-if="stats" class="StatsDayView-content">
      <div class="StatsDayView-header">
        <h2 class="StatsDayView-title">Today</h2>
        <div class="StatsDayView-date">{{ formattedDate }}</div>
      </div>

      <div class="StatsDayView-cards">
        <div class="StatsCard">
          <div class="StatsCard-icon">🍅</div>
          <div class="StatsCard-value">{{ stats.completedCount }}</div>
          <div class="StatsCard-label">Completed</div>
        </div>

        <div class="StatsCard">
          <div class="StatsCard-icon">⏱️</div>
          <div class="StatsCard-value">{{ stats.totalHours }}</div>
          <div class="StatsCard-label">Total Time (hours)</div>
        </div>

        <div class="StatsCard">
          <div class="StatsCard-icon">📊</div>
          <div class="StatsCard-value">{{ stats.avgFocusTime }}</div>
          <div class="StatsCard-label">Avg Focus (minutes)</div>
        </div>

        <div class="StatsCard">
          <div class="StatsCard-icon">✅</div>
          <div class="StatsCard-value">{{ stats.completionRate }}%</div>
          <div class="StatsCard-label">Completion Rate</div>
        </div>
      </div>

      <div v-if="stats.interruptedCount > 0" class="StatsDayView-interruptions">
        <div class="StatsDayView-section-title">
          <span class="StatsDayView-section-icon">⚠️</span>
          Interruptions: {{ stats.interruptedCount }}
        </div>
      </div>

      <div v-if="stats.sessions.length > 0" class="StatsDayView-timeline">
        <div class="StatsDayView-section-title">
          <span class="StatsDayView-section-icon">📅</span>
          Today's Timeline
        </div>
        <div class="Timeline">
          <div
            v-for="session in workSessions"
            :key="session.id"
            class="Timeline-item"
            :class="{
              'Timeline-item--completed': session.completed,
              'Timeline-item--interrupted': session.interrupted
            }"
          >
            <div class="Timeline-time">{{ formatTime(session.startTime) }}</div>
            <div class="Timeline-marker"></div>
            <div class="Timeline-content">
              <div class="Timeline-type">{{ getSessionTypeName(session.type) }}</div>
              <div v-if="session.taskName" class="Timeline-task">{{ session.taskName }}</div>
              <div v-if="session.interrupted" class="Timeline-reason">
                Reason: {{ session.interruptReason }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="StatsDayView-empty">
        <div class="StatsDayView-empty-icon">📝</div>
        <p>No completed focus sessions today yet.</p>
        <p class="StatsDayView-empty-hint">Start your first one.</p>
      </div>
    </div>

    <div v-else class="StatsDayView-loading">
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsDayView',

  computed: {
    stats() {
      return this.$store.getters.dayStats
    },

    workSessions() {
      if (!this.stats || !this.stats.sessions) return []
      return this.stats.sessions
        .filter(s => s.type === 'work')
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    },

    formattedDate() {
      const today = new Date()
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return `${today.getMonth() + 1}/${today.getDate()} ${days[today.getDay()]}`
    }
  },

  mounted() {
    this.$store.dispatch('loadDayStats')
  },

  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    getSessionTypeName(type) {
      const names = {
        work: 'Work',
        'short-break': 'Short Break',
        'long-break': 'Long Break'
      }
      return names[type] || type
    }
  }
}
</script>

<style lang="scss" scoped>
.StatsDayView {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 40px;
}

.StatsDayView-content {
  max-width: 800px;
  margin: 0 auto;
}

.StatsDayView-header {
  margin-bottom: 24px;
  text-align: center;
}

.StatsDayView-title {
  color: var(--color-foreground);
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.StatsDayView-date {
  color: var(--color-foreground-darker);
  font-size: 14px;
}

.StatsDayView-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.StatsCard {
  background-color: var(--color-background);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &--primary {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark, var(--color-accent)) 100%);

    .StatsCard-value,
    .StatsCard-label {
      color: var(--color-background);
    }
  }
}

.StatsCard-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.StatsCard-value {
  color: var(--color-foreground);
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.StatsCard-label {
  color: var(--color-foreground-darker);
  font-size: 12px;
  text-transform: uppercase;
}

.StatsDayView-section-title {
  align-items: center;
  color: var(--color-foreground);
  display: flex;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.StatsDayView-section-icon {
  margin-right: 8px;
}

.StatsDayView-interruptions {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 24px;
  padding: 16px;
}

.StatsDayView-timeline {
  margin-bottom: 24px;
}

.Timeline {
  position: relative;
}

.Timeline-item {
  display: grid;
  grid-template-columns: 60px 24px 1fr;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;

  &:not(:last-child)::before {
    background-color: var(--color-background-lightest);
    content: '';
    position: absolute;
    left: 71px;
    top: 24px;
    width: 2px;
    height: calc(100% + 16px);
  }
}

.Timeline-time {
  color: var(--color-foreground-darker);
  font-size: 12px;
  font-weight: 600;
  padding-top: 4px;
  text-align: right;
}

.Timeline-marker {
  background-color: var(--color-accent);
  border: 3px solid var(--color-background-light);
  border-radius: 50%;
  height: 16px;
  margin-top: 4px;
  position: relative;
  width: 16px;
  z-index: 1;

  .Timeline-item--interrupted & {
    background-color: #ffc107;
  }
}

.Timeline-content {
  background-color: var(--color-background);
  border-radius: 8px;
  padding: 12px 16px;
}

.Timeline-type {
  color: var(--color-foreground);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.Timeline-task {
  color: var(--color-foreground-darker);
  font-size: 13px;
  margin-bottom: 4px;
}

.Timeline-reason {
  color: #ffc107;
  font-size: 12px;
  font-style: italic;
}

.StatsDayView-empty {
  padding: 60px 20px;
  text-align: center;
}

.StatsDayView-empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.StatsDayView-empty p {
  color: var(--color-foreground-darker);
  font-size: 16px;
  margin: 8px 0;
}

.StatsDayView-empty-hint {
  color: var(--color-foreground-darkest);
  font-size: 14px;
}

.StatsDayView-loading {
  align-items: center;
  color: var(--color-foreground-darker);
  display: flex;
  font-size: 16px;
  height: 100%;
  justify-content: center;
}
</style>
