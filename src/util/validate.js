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

function isMobileDevice() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) === "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) === "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) === "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) === "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) === "android";
    var bIsCE = sUserAgent.match(/windows ce/i) === "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) === "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    } else {
        return false;
    }
}

function unescapeHtml(str) {
    var s = "";
    if(str.length == 0) return "";
    s = str.replace(/&amp;/g,"&");
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    s = s.replace(/&nbsp;/g," ");
    s = s.replace(/&#39;/g,"\'");
    s = s.replace(/&quot;/g,"\"");
    return s;
}

export default {
    isUndefined: isUndefined,
    isMobile: isMobile,
    isEmail: isEmail,
    isMobileDevice: isMobileDevice,
    unescapeHtml: unescapeHtml
};