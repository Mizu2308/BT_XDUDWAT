import Request from './request.js';
import { CONTENT_TYPE } from "@/constants";

const API_ROOT = process.env.VUE_APP_SAUNA_URL;
const formDataRequest = new Request(API_ROOT, CONTENT_TYPE.FORMDATA);

export default formDataRequest;