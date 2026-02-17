<template>
  <div class="StatsWeekView">
    <div v-if="stats" class="StatsWeekView-content">
      <div class="StatsWeekView-header">
        <h2 class="StatsWeekView-title">This Week</h2>
        <div class="StatsWeekView-date">{{ formattedWeek }}</div>
      </div>

      <div class="StatsWeekView-summary">
        <div class="SummaryCard">
          <div class="SummaryCard-label">Total Completed</div>
          <div class="SummaryCard-value">{{ stats.totalCompleted }}</div>
        </div>
        <div class="SummaryCard">
          <div class="SummaryCard-label">Total Time</div>
          <div class="SummaryCard-value">{{ stats.totalHours }}h</div>
        </div>
        <div class="SummaryCard">
          <div class="SummaryCard-label">Daily Avg</div>
          <div class="SummaryCard-value">{{ stats.avgPerDay }}</div>
        </div>
      </div>

      <div class="StatsWeekView-chart">
        <div class="Chart-title">Daily Completion</div>
        <div class="BarChart">
          <div
            v-for="(day, index) in stats.dailyStats"
            :key="index"
            class="BarChart-item"
          >
            <div class="BarChart-bar-wrapper">
              <div
                class="BarChart-bar"
                :style="{ height: getBarHeight(day.completedCount) + 'px' }"
                :title="`${day.completedCount} sessions`"
              >
                <span class="BarChart-value">{{ day.completedCount }}</span>
              </div>
            </div>
            <div class="BarChart-label">{{ getDayLabel(index) }}</div>
          </div>
        </div>
      </div>

      <div class="StatsWeekView-insights">
        <div class="Insight-card Insight-card--best">
          <div class="Insight-icon">🏆</div>
          <div class="Insight-content">
            <div class="Insight-label">Best Day</div>
            <div class="Insight-value" v-if="stats.bestDay">
              {{ formatDate(stats.bestDay.date) }} - {{ stats.bestDay.completedCount }}
            </div>
            <div class="Insight-value" v-else>No data</div>
          </div>
        </div>

        <div class="Insight-card Insight-card--worst" v-if="stats.worstDay">
          <div class="Insight-icon">💪</div>
          <div class="Insight-content">
            <div class="Insight-label">Needs Attention</div>
            <div class="Insight-value">
              {{ formatDate(stats.worstDay.date) }} - {{ stats.worstDay.completedCount }}
            </div>
          </div>
        </div>
      </div>

      <div class="StatsWeekView-details">
        <div class="Details-title">Daily Details</div>
        <div class="Details-list">
          <div
            v-for="(day, index) in stats.dailyStats"
            :key="index"
            class="Details-item"
            :class="{ 'Details-item--today': isToday(day.date) }"
          >
            <div class="Details-date">
              <div class="Details-day">{{ getDayLabel(index) }}</div>
              <div class="Details-date-num">{{ formatShortDate(day.date) }}</div>
            </div>
            <div class="Details-stats">
              <div class="Details-stat">
                <span class="Details-stat-label">Completed:</span>
                <span class="Details-stat-value">{{ day.completedCount }}</span>
              </div>
              <div class="Details-stat">
                <span class="Details-stat-label">Time:</span>
                <span class="Details-stat-value">{{ day.totalHours }}h</span>
              </div>
              <div class="Details-stat">
                <span class="Details-stat-label">Rate:</span>
                <span class="Details-stat-value">{{ day.completionRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="StatsWeekView-loading">
      Loading...
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsWeekView',

  computed: {
    stats() {
      return this.$store.getters.weekStats
    },

    formattedWeek() {
      if (!this.stats) return ''
      const start = this.parseLocalDate(this.stats.weekStart)
      const end = this.parseLocalDate(this.stats.weekEnd)
      return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
    },

    maxCompleted() {
      if (!this.stats) return 0
      return Math.max(...this.stats.dailyStats.map(d => d.completedCount), 1)
    }
  },

  mounted() {
    this.$store.dispatch('loadWeekStats')
  },

  methods: {
    parseLocalDate(dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number)
      return new Date(year, month - 1, day)
    },

    getBarHeight(count) {
      const maxHeight = 150
      const minHeight = 30
      if (this.maxCompleted === 0) return minHeight
      return Math.max((count / this.maxCompleted) * maxHeight, minHeight)
    },

    getDayLabel(index) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      return days[index]
    },

    formatDate(dateStr) {
      const date = this.parseLocalDate(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    },

    formatShortDate(dateStr) {
      const date = this.parseLocalDate(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    },

    isToday(dateStr) {
      const date = this.parseLocalDate(dateStr)
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }
  }
}
</script>

<style lang="scss" scoped>
.StatsWeekView {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 40px;
}

.StatsWeekView-content {
  max-width: 900px;
  margin: 0 auto;
}

.StatsWeekView-header {
  margin-bottom: 24px;
  text-align: center;
}

.StatsWeekView-title {
  color: var(--color-foreground);
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.StatsWeekView-date {
  color: var(--color-foreground-darker);
  font-size: 14px;
}

.StatsWeekView-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.SummaryCard {
  background-color: var(--color-background);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.SummaryCard-label {
  color: var(--color-foreground-darker);
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.SummaryCard-value {
  color: var(--color-foreground);
  font-size: 28px;
  font-weight: 700;
}

.StatsWeekView-chart {
  background-color: var(--color-background);
  border-radius: 12px;
  margin-bottom: 24px;
  padding: 24px;
}

.Chart-title {
  color: var(--color-foreground);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
}

.BarChart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  justify-content: space-between;
  padding-top: 20px;
}

.BarChart-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.BarChart-bar-wrapper {
  display: flex;
  align-items: flex-end;
  width: 100%;
  flex: 1;
}

.BarChart-bar {
  background: linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-dark, var(--color-accent)) 100%);
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    opacity: 0.8;
  }
}

.BarChart-value {
  color: var(--color-background);
  font-size: 14px;
  font-weight: 700;
}

.BarChart-label {
  color: var(--color-foreground-darker);
  font-size: 12px;
  margin-top: 8px;
}

.StatsWeekView-insights {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 24px;
}

.Insight-card {
  background-color: var(--color-background);
  border-radius: 12px;
  display: flex;
  gap: 16px;
  padding: 20px;
}

.Insight-icon {
  font-size: 36px;
}

.Insight-content {
  flex: 1;
}

.Insight-label {
  color: var(--color-foreground-darker);
  font-size: 12px;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.Insight-value {
  color: var(--color-foreground);
  font-size: 16px;
  font-weight: 600;
}

.StatsWeekView-details {
  background-color: var(--color-background);
  border-radius: 12px;
  padding: 24px;
}

.Details-title {
  color: var(--color-foreground);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.Details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.Details-item {
  background-color: var(--color-background-light);
  border-left: 3px solid transparent;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-background-lightest);
  }

  &--today {
    border-left-color: var(--color-accent);
  }
}

.Details-date {
  display: flex;
  flex-direction: column;
}

.Details-day {
  color: var(--color-foreground);
  font-size: 14px;
  font-weight: 600;
}

.Details-date-num {
  color: var(--color-foreground-darker);
  font-size: 12px;
  margin-top: 2px;
}

.Details-stats {
  display: flex;
  gap: 24px;
}

.Details-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.Details-stat-label {
  color: var(--color-foreground-darker);
  font-size: 11px;
  margin-bottom: 2px;
}

.Details-stat-value {
  color: var(--color-foreground);
  font-size: 14px;
  font-weight: 600;
}

.StatsWeekView-loading {
  align-items: center;
  color: var(--color-foreground-darker);
  display: flex;
  font-size: 16px;
  height: 100%;
  justify-content: center;
}
</style>
