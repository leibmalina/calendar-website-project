/**
 * Handle user login tracking with methods for updating login status
 */

class User {
    // initially user is not logged in
    constructor() {
        this.loggedIn = false;
    }

    // switch the login status (after loggin in or out)
    switchLoginState() {
        if (this.loggedIn === false) {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    setLogin() {
        this.loggedIn = true;
    }

    setLogout() {
        this.loggedIn = false;
    }

    get login() {
        return this.loggedIn;
    }
}

let current_user = new User();
