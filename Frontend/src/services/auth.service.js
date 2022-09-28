import { ADMIN_API_PATH } from '../constants';
import axios from '../helpers/axios';

/**
 * Login SAUNA
 * @param {String} username
 * @param {String} password 
 * @returns Promise login status
 */

const login = async (user) => {
    const response = await axios.post(ADMIN_API_PATH.ADMIN_AUTH, user);
    console.log(response);
    return response;
}

const getUserProfile = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_USER}/me`);
        return response?.data || response;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const updateUserProfile = async (params) => {
    try {
        const response = await axios.put(`${ADMIN_API_PATH.ADMIN_USER}/me`, params);
        return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const authService = {
    login,
    getUserProfile,
    updateUserProfile
}