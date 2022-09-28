import { HEADER_KEY } from "../constants"

export const toBearerAuth = (token) => {
    return `${HEADER_KEY.BEARER} ${token}`
}