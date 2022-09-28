import { ADMIN_API_PATH, API_PATH } from '../constants';
import axios from '../helpers/axios';

/**
 * Create SAUNA facility facility-facility-account
 * @param {*} facility 
 * @returns Promise
 */
const create = async (facility) => {
    try {
        const response = await axios.post(ADMIN_API_PATH.ADMIN_FACILITIES, facility);
        return response.data;
    } catch (err) {
        console.log(`create`, ADMIN_API_PATH.ADMIN_FACILITIES, JSON.stringify(err));
        return null;
    }
}

/**
 * Get facility information
 * @param {*} facilityId 
 */
const getAdminFacility = async (facilityId) => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_FACILITIES}/${facilityId}`);
        return response;
    } catch (err) {
        console.log(`getFacility`,`${ADMIN_API_PATH.ADMIN_FACILITIES}/${facilityId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Get facility information
 * @param {*} facilityId 
 */
 const getFacility = async (facilityId) => {
    try {
        const response = await axios.get(`${API_PATH.FACILITIES}/${facilityId}`);
        return response;
    } catch (err) {
        console.log(`getFacility`,`${API_PATH.FACILITIES}/${facilityId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Get facility information
 * @param {*} 
 */
 const getMyFacility = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_FACILITIES}/my-facility`);
        return response;
    } catch (err) {
        console.log(`getFacility`,`${ADMIN_API_PATH.ADMIN_FACILITIES}/my-facility`, JSON.stringify(err));
        return null;
    }
}

/**
 * Update facility
 * @param {*} facilityId 
 * @param {*} facility 
 * @returns Promise
 */
const updateFacility = async (facilityId, facility) => {
    try {
        const response = await axios.put(`${ADMIN_API_PATH.ADMIN_FACILITIES}/${facilityId}`, facility);
        return response;
    } catch (err) {
        console.log(`updateFacility`, `${ADMIN_API_PATH.ADMIN_FACILITIES}/${facilityId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Update facility
 * @param {*} facilityId 
 * @param {*} facility 
 * @returns Promise
 */
 const updateMyFacility = async (facility) => {
    const response = await axios.patch(`${ADMIN_API_PATH.ADMIN_FACILITIES}/my-facility`, facility);
    return response;
}

/**
 * Delete a facility
 * @param {*} facilityId 
 * @returns Promise
 */
const deleteFacility = async (facilityId) => {
    try {
        const response = await axios.delete(`${ADMIN_API_PATH.ADMIN_FACILITIES}/${facilityId}`);
        return response.data;
    } catch (err) {
        console.log(`deleteFacility`, `${ADMIN_API_PATH.ADMIN_FACILITIES}/${facilityId}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Get facilities
 * @param {*} facilityFilter 
 * @returns Promise
 */
const getFacilities = async (facilityFilter) => {
    const query = new URLSearchParams(facilityFilter);

    try {
        const response = await axios.get(`${ADMIN_API_PATH.ADMIN_FACILITIES}?${query}`);
        return response;
    } catch (err) {
        console.log(`getFacilities`, `${ADMIN_API_PATH.ADMIN_FACILITIES}?${query}`, JSON.stringify(err));
        return null;
    }
}

/**
 * Create SAUNA facility facility-facility-account
 * @param {*} services 
 * @returns Promise
 */
 const updateFacilityServices = async (services) => {
    try {
        const response = await axios.post(`${ADMIN_API_PATH.ADMIN_FACILITIES_SERVICES}/update-many`, services);
        return response;
    } catch (err) {
        return null;
    }
}

/**
 * Get facility information
 * @param {*} params 
 */
 const getPostalCodeInfo = async (params) => {
    try {
        const response = await axios.get(`/zip-cloud`, { params: params });
        return response;
    } catch (err) {
        return null;
    }
}


export const facilityService = {
    getFacilities,
    create,
    getFacility,
    getMyFacility,
    getAdminFacility,
    deleteFacility,
    updateFacility,
    updateMyFacility,
    updateFacilityServices,
    getPostalCodeInfo,
}