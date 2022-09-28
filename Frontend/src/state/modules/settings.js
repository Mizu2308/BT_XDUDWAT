export const state = {
  alert: {
    show: false,
    type: 'success',
    message: 'Success'
  },
  refreshData: false,
  seconds: 30
}

export const mutations = {
  SET_ALERT(state, data) {
    state.alert = data;
  },
  SET_REFRESH_DATA(state, data) {
    state.refreshData = data;
  },
  SET_SECONDS(state, data) {
    state.seconds = data;
  },
}

export const getters = {
  getAlertInfo: state => state.alert,
  getRefreshData: state => state.refreshData,
  getSeconds: state => state.seconds,
}

export const actions = {
}