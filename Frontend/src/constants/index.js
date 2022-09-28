export const STORAGE_KEY = {
    USER: 'user',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    REMEMBER_USER: 'remember_user',
    REMEMBER_USERNAME: 'remember_username',
}

export const HEADER_KEY = {
    AUTHORIZATION: 'Authorization',
    BEARER: 'Bearer'
}

export const ADMIN_API_PATH = {
    ADMIN_AUTH: '/auth/login',
    ADMIN_USER: '/users',
    ADMIN_FACILITIES: '/web/facilities',
    ADMIN_ROOM: '/web/rooms',
    ADMIN_CATEGORIES: '/web/categories',
    ADMIN_SERVICES: '/web/services',
    ADMIN_FACILITIES_SERVICES: '/web/facility_services',
    ADMIN_SENSOR_LOGS: '/web/sensor_logs',
}

export const API_PATH = {
    ROOM: '/rooms',
    MORE_ROOM: '/rooms/moreRoom',
    FACILITIES: '/facilities',
    UPLOAD_IMAGES: '/upload-images',
    PASSWORD: 'change_password',
}

export const DEFAULT_PARAMS = {
    PAGE: 1,
    PAGE_SIZE: 10,
}

export const REGEX = {
    ALPHABET_CHARACTER_ONLY: /[a-zA-Z]/i,
    PHONE_NUMBER_CHARACTER: /[0-9-]/i,
    SPECIAL_CHARACTERS: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/,
    EMAIL_VALIDATE: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    NUMBER_HAFTWIDTH: /^[0-9]+$/,
    URL: /[-a-zA-Z0-9@:%._,~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_,.~#?&]*)$/,
}

export const USER_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
}

export const USER_ACTION = {
    CREATE_UPDATE_ACCOUNT: "CREATE_UPDATE_ACCOUNT",
    CHANGE_PASSWORD: "CHANGE_PASSWORD"
}

export const ROLES = {
    ADMIN: 'ADMIN',
    FACILITY_MANAGER: 'FACILITY_MANAGER',
    FACILITY_ACCOUNT: 'FACILITY_ACCOUNT',
    TABLET: 'TABLET',
    STAFF: 'STAFF',
    USER: 'USER',
}

export const ORIGIN_URL = {
    ADMIN: '/profile',
    FACILITY_MANAGER: '/admin',
    FACILITY_ACCOUNT: '/admin'
}

export const CONTENT_TYPE = {
    JSON: 'application/json',
    JAVASCRIPT: 'application/javascript',
    XML: 'application/xml',
    ZIP: 'application/zip',
    PDF: 'application/pdf',
    SQL: 'application/sql',
    MPEG: 'audio/mpeg',
    OGG: 'audio/ogg',
    FORMDATA: 'multipart/form-data',
    CSS: 'text/css',
    HTML: 'text/html',
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    GIF: 'image/gif',
};

export const DATE_FORMAT = 'DD-MM-YYYY';