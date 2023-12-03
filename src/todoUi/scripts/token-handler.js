function saveUserToken(userName, userToken, expireTime) {

    const encodedToken = encodeURIComponent(userToken);
    const encodedExpireTime = encodeURIComponent(expireTime.toUTCString());
    const encodedUserName = encodeURIComponent(userName);
    const tokenCookieString = `token=${encodedToken}; expires=${encodedExpireTime}; path=/`;
    const userNameCookieString = `userName=${encodedUserName}; expires=${encodedExpireTime}; path=/`;
    document.cookie = tokenCookieString;
    document.cookie = userNameCookieString;
}

function getUserToken() {
    // Read the user token from the cookie
    return getCookieValue("token");
}

function getUserName() {
    // Read the user token from the cookie
    return getCookieValue("userName");
}

function getCookieValue(valueName) {
    const allCookies = document.cookie.split('; ');
    const cookie = allCookies.find((cookie) => cookie.startsWith(`${valueName}=`));
    const cookieValue = cookie ? cookie.split('=')[1] : null;

    return cookieValue;
}

export { saveUserToken, getUserToken, getUserName, getCookieValue } 