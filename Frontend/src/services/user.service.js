import { ADMIN_API_PATH, API_PATH } from '../constants';
import axios from '../helpers/axios';

/**
 * Create SAUNA user facility-facility-account
 * @param {*} user 
 * @returns Promise
 */
const createUser = async (user) => {
    try {
        const response = await axios.post(`${ADMIN_API_PATH.ADMIN_USER}/create`, user);
        console.log("response", response)
        return response;
    } catch (err) {
        console.log(`create`, `${ADMIN_API_PATH.ADMIN_USER}/create`, JSON.stringify(err));
        return err?.response?.data || err;
    }
}

/**
 * Get user information
 * @param {*} userId 
 */
const getUser = async (userId) => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_USER}/${userId}`);
        return response;
    } catch (err) {
        console.log(`getUser`,`${ADMIN_API_PATH.ADMIN_USER}/${userId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Change user password by admin
 * @param {*} userId
 * @param {*} body
 */
 const changeUserPasswdByAdmin = async (userId, body) => {
    try {
        const response = await axios.put(`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/${userId}`, body);
        return response;
    } catch (err) {
        console.log(`changeUserPasswdByAdmin`,`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/${userId}`, JSON.stringify(err));
        throw err;
    }
}

/**
 * Change my password
 * @param {*} body
 */
 const changeMyPasswd = async (body) => {
    try {
        const response = await axios.post(`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}`, body);
        return response;
    } catch (err) {
        console.log(`changeMyPasswd`,`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}`, JSON.stringify(err));
        throw err?.response?.data || err;
    }
}

/**
 * Forgot password
 * @param {*} body
 */
 const forgotPassword = async (body) => {
    try {
        const response = await axios.post(`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/forgot`, body);
        return response;
    } catch (err) {
        console.log(`forgotPassword`,`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/forgot`, JSON.stringify(err));
        throw err?.response?.data || err;
    }
}

/**
 * Reset password
 * @param {*} body
 */
 const resetPassword = async (body) => {
    try {
        const response = await axios.post(`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/reset`, body);
        return response;
    } catch (err) {
        console.log(`resetPassword`,`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/reset`, JSON.stringify(err));
        throw err?.response?.data || err;
    }
}

/**
 * Validate expires reset link
 * @param {*} body
 */
 const validateExpiresResetLink = async (body) => {
    try {
        const response = await axios.post(`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/reset/validate-token`, body);
        return response;
    } catch (err) {
        console.log(`validateExpiresResetLink`,`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/reset/validate-token`, JSON.stringify(err));
        throw err?.response?.data || err;
    }
}

/**
 * Update user
 * @param {*} userId 
 * @param {*} user 
 * @returns Promise
 */
const updateUser = async (userId, user) => {
    try {
        const response = await axios.put(`${ADMIN_API_PATH.ADMIN_USER}/${userId}`, user);
        return response;
    } catch (err) {
        console.log(`updateUser`, `${ADMIN_API_PATH.ADMIN_USER}/${userId}`, JSON.stringify(err));
        throw err?.response?.data || err;
    }
}

/**
 * Delete a user
 * @param {*} userId 
 * @returns Promise
 */
const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${ADMIN_API_PATH.ADMIN_USER}/${userId}`);
        return response;
    } catch (err) {
        console.log(`deleteUser`, `${ADMIN_API_PATH.ADMIN_USER}/${userId}`, JSON.stringify(err));
        throw err?.response?.data || err;
    }
}

/**
 * Get users
 * @param {*} usersFilter 
 * @returns Promise
 */
const getUsers = async (usersFilter) => {
    const query = new URLSearchParams(usersFilter);
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_USER}?${query}`);
        return response;
    } catch (err) {
        console.log(`getUsers`, `${ADMIN_API_PATH.ADMIN_USER}?${query}`, JSON.stringify(err));
        return null;
    }
}


 const getRequest = async () => {
    try {
        const response = await axios.get(`/requests`);
        return response;
    } catch (err) {
        console.log(`getRequest`, `/requests`, JSON.stringify(err));
        return null;
    }
}

/**
 * Get users
 * @param {*} 
 * @returns Promise
 */
 const getUserTablets = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_USER}/userTablets`);
        return response;
    } catch (err) {
        return null;
    }
}

const changeUserPassword = async (accountId, params) => {
    try {
        const response = await axios.put(`${ADMIN_API_PATH.ADMIN_USER}/${API_PATH.PASSWORD}/${accountId}`, params);
        return response;
    } catch (err) {
        return err;
    }
}

export const userService = {
    createUser,
    getUsers,
    getUser,
    getRequest,
    deleteUser,
    updateUser,
    changeUserPasswdByAdmin,
    getUserTablets,
    changeUserPassword,
    forgotPassword,
    resetPassword,
    changeMyPasswd,
    validateExpiresResetLink
}