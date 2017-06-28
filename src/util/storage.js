import constant from './constant';

const token_key = ('token_' + constant.version);

function getToken() {
    return localStorage.getItem(token_key);
}

function setToken(token) {
    localStorage.clear();

    localStorage.setItem(token_key, token);
}

export default {
    getToken: getToken,
    setToken: setToken
};
