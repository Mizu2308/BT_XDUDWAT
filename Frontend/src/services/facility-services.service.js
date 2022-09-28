import { ADMIN_API_PATH } from '../constants';
import axios from '../helpers/axios';

/**
 * Create SAUNA facility facility-facility-account
 * @param {*} services 
 * @returns Promise
 */
const updateFacilityServices = async (services) => {
    try {
        const response = await axios.post(ADMIN_API_PATH.ADMIN_FACILITIES, facility);
        return response;
    } catch (err) {
        return null;
    }
}
