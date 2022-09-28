/**
 * Build query from array string
 * @param {string} keyName
 * @param {string[]} strings 
 */
export const serializeArray = (keyName, strings) => {
    return strings.map(text => encodeURIComponent(keyName) + '=' + encodeURIComponent(text));
}