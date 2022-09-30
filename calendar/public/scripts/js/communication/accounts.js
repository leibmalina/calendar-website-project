/**
 * Functions doing I/O directly with server. Mainly about accounts.
 */

function registerAccount(username, password, callback) {
    // send login credentials to php page to add to db
    fetch("scripts/php/create_account.php", {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        headers: { 'content-type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}

function login() {
    // get username and password from form values entered
    const loginFormElement = document.getElementById("login_window");
    const username = loginFormElement.querySelector("input[name='username']").value;
    const password = loginFormElement.querySelector("input[name='password']").value;

    // URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    // send login credentials to php page to verify with db
    fetch("scripts/php/verify_login.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            // if login successful, record login
            if(data.success) {
                document.getElementById("event_token").value = data.token;
                current_user.setLogin();
                hideLoginWindow();
                setUserButtons(true);
                refreshMonth();
            } else {
                document.getElementById("login_info").textContent = "Wrong name or password!";
            }
        })
        .catch(err => console.error(err));
}

function logout() {
    // destroy the user session and update the login state
    fetch('scripts/php/logout.php', {
        method: "POST",
        headers: {'content-type': 'application/json'}
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) { // if user successfuly logged out
                document.getElementById("event_token").value = "";
                current_user.setLogout();
                setUserButtons(false);
                refreshMonth();
            }
            console.log(data.success ? "You've been logged out!" : `You were not logged out`);
        })
        .catch(err => console.error(err));
}

function checkLoginState() {
    fetch("scripts/php/verify_login.php", {
        method: 'POST',
        body: "{}",
        headers: {'content-type': 'application/json'}
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("event_token").value = data.token;
            }
            setUserButtons(data.success === true);
            refreshMonth();
            registerEvents();
            current_user.login = data.success;
            console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`)
        })
        .catch(err => console.error(err));
    return current_user.login; // true if logged in, false if logged out
}
