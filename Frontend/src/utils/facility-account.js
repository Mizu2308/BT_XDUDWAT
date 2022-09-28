import {REGEX, USER_ACTION} from "@/constants";

export const checkDuplicate = async (vm, message) => {
    const errorMessage = {
        firstName: {
            message: "",
            params: {}
        },
        lastName: {
            message: "",
            params: {}
        },
        phoneNumber: {
            message: "",
            params: {}
        },
        email: {
            message: "",
            params: {}
        }
    };

    if (message.includes('phone')) {
        errorMessage.phoneNumber.message = "Duplicate phone number";
    } else if (message.includes('email')) {
        errorMessage.email.message = "t-create-update-facility-account.error-message.duplicate_email";
        errorMessage.email.params = {
            field_name: vm.$t('t-email-address')
        };
    }
    return errorMessage;
}

export const checkValidateInput = async (vm, form, action) => {
    if (action === USER_ACTION.CREATE_UPDATE_ACCOUNT) {
        const errorMessage = {
            firstName: {
                message: "",
                params: {}
            },
            lastName: {
                message: "",
                params: {}
            },
            phoneNumber: {
                message: "",
                params: {}
            },
            email: {
                message: "",
                params: {}
            }
        };

        errorMessage.firstName = checkNameInput(vm, form.firstName, "t-firstname");
        errorMessage.lastName = checkNameInput(vm, form.lastName, "t-lastname");
        errorMessage.phoneNumber = checkPhoneNumberInput(vm, form.phone, "t-phone-number");
        errorMessage.email = checkEmailInput(vm, form.email, "t-email-address");

        return errorMessage;
    } else {
        const errorChangePasswordMessage = {
            newPassword: {
                message: "",
                params: {},
                field: "t-new-password"
            },
            confirmPassword: {
                message: "",
                params: {},
                field: "t-confirm-new-password",
            }
        };

        for (const key in errorChangePasswordMessage){
            errorChangePasswordMessage[key] = checkRequiredInput(vm,form[key], errorChangePasswordMessage[key].field);
        }

        if (!errorChangePasswordMessage.newPassword.message) {
            // check validate password
            if (form.newPassword.length < 6) {
                errorChangePasswordMessage.newPassword = checkMinLength(vm, form.newPassword, "t-new-password", 6);
            } else if (form.newPassword.length >255) {
                errorChangePasswordMessage.newPassword = checkMaxLength(vm, form.newPassword, "t-new-password");
            }
        }

        // check unmatch password
        if (form.newPassword !== form.confirmPassword){
            errorChangePasswordMessage.confirmPassword.message = "t-create-update-facility-account.error-message.confirm_password_not_match";
        }
        return errorChangePasswordMessage;
    }
}

export const checkRequiredInput = (vm, data, field) => {
    const errorMessage = {
        message: "",
        params: {}
    };

    if (!data || data === "") {
        errorMessage.message = "t-create-update-facility-account.error-message.empty_value";
        errorMessage.params = { field_name: vm.$t(`${field}`)};
    }
    return errorMessage;
}

export const checkNameInput = (vm, data, field) => {
    let errorMessage = checkRequiredInput(vm, data, field);

    if (errorMessage.message === "") {
        errorMessage = checkMaxLength(vm, data, field);
    }
    return errorMessage;
}

export const checkPhoneNumberInput = (vm, data, field) => {
    let errorMessage = {
        message: "",
        params: {}
    };
    if (data) {
        if (data.length > 17) {
            errorMessage = checkMaxLength(vm, data, field, 17);
        } else if (data.length < 10) {
            errorMessage = checkMinLength(vm, data, field, 10);
        }
    }
    return errorMessage;
}

export const checkEmailInput = (vm, data, field) => {
    let errorMessage = checkRequiredInput(vm, data, field);
    if (errorMessage.message === "") {
        errorMessage = checkMaxLength(vm, data, field);
        if (errorMessage.message === "" && !REGEX.EMAIL_VALIDATE.test(data)) {
            errorMessage.message = "t-create-update-facility-account.error-message.incorrect_email_format";
        }
    }
    return errorMessage;
}

export const checkMaxLength = (vm, data, field, maxLength = 255) => {
    let errorMessage = {
        message: "",
        params: {}
    };

    if (data.length > maxLength){
        errorMessage.message = "t-create-update-facility-account.error-message.field_maxlength";
        errorMessage.params = {
            field_name: vm.$t(`${field}`),
            maxlength: maxLength
        };
    }

    return errorMessage;
}

export const checkMinLength = (vm, data, field, minLength = 10) => {
    let errorMessage = {
        message: "",
        params: {}
    };

    if (data.length < minLength){
        errorMessage.message = "t-create-update-facility-account.error-message.field_minlength";
        errorMessage.params = {
            field_name: vm.$t(`${field}`),
            minlength: minLength
        };
    }

    return errorMessage;
}