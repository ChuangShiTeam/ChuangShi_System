import constant from './constant';

const token_key = ('token_' + constant.version);

function getToken() {
    let token = localStorage.getItem(token_key);

    token = 'wmJBcFTSlHj6oXSjmbuZiGWgCGlzvC9xtQayXDLAxgAO9gQ25t2rDUujOu1YD1EiKtEuDb5qbUHFuI3SOyq8hOsfPcb1aKR1V/eNPz1gK8k=';

    if (token == null || typeof (token) === 'undefined') {
        return '';
    }

    return token;
}

function setToken(token) {
    localStorage.clear();

    localStorage.setItem(token_key, token);
}

export default {
    getToken: getToken,
    setToken: setToken
};
