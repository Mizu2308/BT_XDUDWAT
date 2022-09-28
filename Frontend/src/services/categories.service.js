import { ADMIN_API_PATH } from '../constants';
import axios from '../helpers/axios';

/**
 * Get Categories
 * @param {*} params 
 * @returns Promise
 */
 const getCategories = async (params) => {
  try {
      const response = await axios.get(`${ADMIN_API_PATH.ADMIN_CATEGORIES}`, { params: params});
      return response;
  } catch (err) {
      return null;
  }
}

export const categoriesService = {
  getCategories
}
