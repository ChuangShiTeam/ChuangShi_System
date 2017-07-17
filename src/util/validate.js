function isUndefined(object) {
    return typeof (object) === 'undefined';
}

function isMobile(str) {
    const re = /^1\d{10}$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

function isEmail(str) {
    const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

export default {
    isUndefined: isUndefined,
    isMobile: isMobile,
    isEmail: isEmail
};