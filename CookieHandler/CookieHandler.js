class CookieHandler {
    // Session Storage of cookies
    static SetSessionCookie(id_of_cookie, value_to_store) {
        sessionStorage.setItem(id_of_cookie, value_to_store);
    }
    static GetSessionCookie(id_of_cookie) {
        sessionStorage.getItem(id_of_cookie);
    }

    // Local Storage of cookies
    static SetLocalCookie(id_of_cookie, value_to_store, cookie_expiration_time) {

    }
    static GetLocalCookie(id_of_cookie) {

    }
}