import { API_PATH } from '../constants';
import formDataRequest from '../helpers/axios/formDataRequest';

/**
 * Get room information
 * @param {*} file
 * @return Promise
 */
const uploadAvatar = async (file) => {
    const response = await formDataRequest.post(`${API_PATH.UPLOAD_IMAGES}/upload-avatar`, { file: file });
    return response;
}

/**
 * Get room information
 * @param {*} file
 * @return Promise
 */
const uploadCover = async (file) => {
    const response = await formDataRequest.post(`${API_PATH.UPLOAD_IMAGES}/upload-Cover`, { file: file });
    return response;
}

/**
 * Get room information
 * @param {*} file
 * @return Promise
 */
const uploadFacility = async (file) => {
    const response = await formDataRequest.post(`${API_PATH.UPLOAD_IMAGES}/upload-Facility`, { file: file });
    return response;
}


export const uploadService = {
  uploadAvatar,
  uploadCover,
  uploadFacility
}
