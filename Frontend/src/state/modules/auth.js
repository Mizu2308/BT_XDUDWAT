import { authService } from "@/services/auth.service";

export const state = {
    currentUser: sessionStorage.getItem('authUser') || localStorage.getItem('currentUser'),
}

export const mutations = {
    SET_CURRENT_USER(state, newValue) {
        state.currentUser = newValue
        saveState('currentUser', newValue);
        localStorage.setItem('currentUser', JSON.stringify(newValue))
    }
}

export const getters = {
    // Whether the user is currently logged in.
    loggedIn(state) {
        return !!state.currentUser
    },
    currentUser(state) {
        return typeof state.currentUser === 'string' ? JSON.parse(state.currentUser) : state.currentUser;
    },
}

export const actions = {
    async getUserProfile({ commit }) {
        try {
            let res = await authService.getUserProfile();
            commit('SET_CURRENT_USER', res);
        } catch (error) {
            console.log(error);
        }
    }
}

// ===
// Private helpers
// ===

function saveState(key, state) {
    window.sessionStorage.setItem(key, JSON.stringify(state))
}
