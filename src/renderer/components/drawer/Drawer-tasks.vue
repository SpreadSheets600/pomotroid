<template>
  <div class="Container">
    <p class="Drawer-heading">Tasks</p>

    <div class="Setting-wrapper Setting-wrapper--input">
      <input
        class="Task-input"
        type="text"
        maxlength="120"
        placeholder="Add a focus task..."
        v-model="newTaskTitle"
        @keyup.enter="addTask"
      />
      <p class="TextButton TextButton--action" @click="addTask">Add</p>
    </div>

    <p v-if="tasks.length === 0" class="Empty-state">
      No tasks yet. Add one and mark it as your focus.
    </p>

    <div class="Task-item" v-for="task in tasks" :key="task.id">
      <div class="Task-main" @click="setFocusTask(task.id)">
        <div
          class="Task-radio"
          :class="{ 'is-active': task.id === activeTaskId }"
        ></div>
        <p class="Task-title" :title="task.title">{{ task.title }}</p>
      </div>
      <p class="TextButton TextButton--danger" @click.stop="removeTask(task.id)">
        Delete
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Drawer-tasks',

  data() {
    return {
      newTaskTitle: ''
    }
  },

  computed: {
    tasks() {
      return this.$store.getters.tasks
    },

    activeTaskId() {
      return this.$store.getters.activeTaskId
    }
  },

  methods: {
    addTask() {
      this.$store.dispatch('addTask', this.newTaskTitle)
      this.newTaskTitle = ''
    },

    removeTask(taskId) {
      this.$store.dispatch('removeTask', taskId)
    },

    setFocusTask(taskId) {
      this.$store.dispatch('selectTaskForFocus', taskId)
    }
  }
}
</script>

<style lang="scss" scoped>
.Container {
  max-height: calc(100% - 36px);
  overflow-y: auto;
}

.Setting-wrapper {
  background-color: var(--color-background);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  padding: 12px;
}

.Setting-wrapper--input {
  align-items: center;
  gap: 10px;
}

.Task-input {
  background-color: var(--color-background-light);
  border: 1px solid var(--color-background-lightest);
  border-radius: 4px;
  color: var(--color-foreground);
  flex: 1;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  outline: none;
  padding: 8px;
  transition: $transitionDefault;

  &:focus {
    border-color: var(--color-accent);
  }
}

.Task-item {
  align-items: center;
  background-color: var(--color-background);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 12px;
}

.Task-main {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 1;
  min-width: 0;
}

.Task-radio {
  background-color: transparent;
  border: 2px solid var(--color-background-lightest);
  border-radius: 100%;
  height: 14px;
  margin-right: 10px;
  transition: $transitionDefault;
  width: 14px;

  &.is-active {
    background-color: var(--color-accent);
    border-color: var(--color-background);
  }
}

.Task-title {
  color: var(--color-foreground-darker);
  font-size: 14px;
  letter-spacing: 0.03em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.TextButton--action {
  margin-top: 0;
}

.TextButton--danger {
  margin-top: 0;

  &:hover {
    color: #ff7474;
  }
}

.Empty-state {
  color: var(--color-foreground-darker);
  font-size: 13px;
  letter-spacing: 0.03em;
  margin-top: 14px;
  text-align: center;
}
</style>
