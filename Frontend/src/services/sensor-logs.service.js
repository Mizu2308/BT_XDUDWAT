import { ADMIN_API_PATH } from '../constants';
import axios from '../helpers/axios';


/**
 * Get room information
 * @param {*} params
 * @return Promise
 */
const getSensorLogsDashboard = async (params) => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_SENSOR_LOGS}/dashboard`, { params: params });
        return response?.data || response || [];
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const sensorLogsService = {
  getSensorLogsDashboard,
}