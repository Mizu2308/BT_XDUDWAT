import { ADMIN_API_PATH, API_PATH } from '../constants';
import axios from '../helpers/axios';


/**
 * Get room information
 * @param {*} params
 * @return Promise
 */
 const getRooms = async (params) => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_ROOM}`, { params: params });
        return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}
/**
 * Create SAUNA room
 * @param {*} room 
 * @returns Promise
 */
const create = async (room) => {
    try {
        const response = await axios.post(ADMIN_API_PATH.ADMIN_ROOM, room);
        return response.data;
    } catch (err) {
        console.log(`create`, ADMIN_API_PATH.ADMIN_ROOM, JSON.stringify(err));
        return null;
    }
}

/**
 * Create SAUNA room
 * @param {*} rooms
 * @returns Promise
 */
 const createUpdateRooms = async (rooms) => {
    const response = await axios.post(`${ ADMIN_API_PATH.ADMIN_ROOM }/create-update`, rooms);
    return response;
}

/**
 * Update a room
 * @param {*} roomId 
 * @param {*} room 
 * @returns Promise
 */
const updateRoom = async (roomId, room) => {
    try {
        const response = await axios.put(`${ADMIN_API_PATH.ADMIN_ROOM}/${roomId}`, room);
        return response.data;
    } catch (err) {
        console.log(`updateRoom`, `${ADMIN_API_PATH.ADMIN_ROOM}/${roomId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Delete a room
 * @param {*} roomId 
 * @returns Promise
 */
const deleteRoom = async (roomId) => {
    try {
        const response = await axios.delete(`${ADMIN_API_PATH.ADMIN_ROOM}/${roomId}`);
        return response;
    } catch (err) {
        console.log(`deleteRoom`, `${ADMIN_API_PATH.ADMIN_ROOM}/${roomId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Get room information
 * @param {*} roomId
 * @return Promise
 */
const getRoom = async (roomId) => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_ROOM}/${roomId}`);
        return response.data;
    } catch (err) {
        console.log(`getRoom`, `${ADMIN_API_PATH.ADMIN_ROOM}/${roomId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Get room information
 * @param {*} params
 * @return Promise
 */
 const getRoomsDashboard = async (params) => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_ROOM}/dashboard/get-all`, { params: params });
        return response;
    } catch (err) {
        return null;
    }
}

/**
 * Get room information
 * @param {*} params
 * @return Promise
 */
 const getRoomMore = async (params) => {
    try {
        const response = await axios.get(`${API_PATH.MORE_ROOM}`, { params: params });
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}


export const roomService = {
    getRooms,
    getRoomMore,
    create,
    updateRoom,
    createUpdateRooms,
    getRoom,
    getRoomsDashboard,
    deleteRoom
}