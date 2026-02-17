import { localStore } from './index'

const state = {
  tasks: localStore.get('tasks') || [],
  activeTaskId: localStore.get('activeTaskId') || null
}

const getters = {
  tasks() {
    return state.tasks
  },

  activeTaskId() {
    return state.activeTaskId
  },

  activeTask() {
    return state.tasks.find(task => task.id === state.activeTaskId) || null
  }
}

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },

  SET_ACTIVE_TASK_ID(state, taskId) {
    state.activeTaskId = taskId
  }
}

const actions = {
  setTasks({ commit }, tasks) {
    commit('SET_TASKS', tasks)
    localStore.set('tasks', tasks)
  },

  setActiveTaskId({ commit }, taskId) {
    commit('SET_ACTIVE_TASK_ID', taskId)
    localStore.set('activeTaskId', taskId)
  },

  addTask({ state, dispatch }, title) {
    const taskTitle = (title || '').trim()

    if (!taskTitle) {
      return
    }

    const task = {
      id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      title: taskTitle
    }
    const tasks = [...state.tasks, task]

    dispatch('setTasks', tasks)

    if (!state.activeTaskId) {
      dispatch('setActiveTaskId', task.id)
    }
  },

  removeTask({ state, dispatch }, taskId) {
    const tasks = state.tasks.filter(task => task.id !== taskId)
    dispatch('setTasks', tasks)

    if (state.activeTaskId === taskId) {
      dispatch('setActiveTaskId', tasks.length > 0 ? tasks[0].id : null)
    }
  },

  selectTaskForFocus({ dispatch }, taskId) {
    dispatch('setActiveTaskId', taskId)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
