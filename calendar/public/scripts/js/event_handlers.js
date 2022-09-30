/**
 * Handles events statically.
 */

document.addEventListener("DOMContentLoaded", checkLoginState, false);

function registerEvents() {
    // previous month selected
    document.getElementById("prev_month").addEventListener("click", () => {
        // shift month back 1 and re-display days and events for month
        current_month = current_month.prevMonth();
        refreshMonth();
    }, false);
    // next month selected
    document.getElementById("next_month").addEventListener("click", () => {
        current_month = current_month.nextMonth();
        refreshMonth();
    }, false);

    /** buttons for managing accounts **/
    document.getElementById("login_btn").addEventListener("click", () => {
        document.getElementById("login_window").style.visibility = "visible";
        document.getElementById("login_window").style.display = "flex";
    }, false);
    document.getElementById("logout_btn").addEventListener("click", logout, false);

    // when login submit is clicked: 
    let loginForm = document.getElementById("login_window"); // get form element
    let login_buttons = loginForm.getElementsByClassName("login_buttons")[0]; // login buttons div
    login_buttons.querySelector("#login_submit").addEventListener("click", login, false); // submit button

    document.getElementById("login_cancel").addEventListener("click", hideLoginWindow, false);
    // event listeners for "create account" form
    document.getElementById("create_account_btn").addEventListener("click", () => { // display create account form
        document.getElementById("create_account_window").style.visibility = "visible";
        document.getElementById("create_account_window").style.display = "flex";
    });

    let createAccountForm = document.getElementById("create_account_window"); // get form element
    let create_account_buttons = createAccountForm.getElementsByClassName("create_account_buttons")[0]; // login buttons div

    create_account_buttons.querySelector("#create_account_submit").addEventListener("click", () => {
        registerAccount(
            createAccountForm.querySelector("input[name='username']").value,
            createAccountForm.querySelector("input[name='password']").value,
            (data) => {
                if (data.success) {
                    document.getElementById("event_token").value = data.token;
                    hideRegisterWindow();
                    setUserButtons(true);
                    refreshMonth();
                } else {
                    document.getElementById("create_account_info").textContent = data.message;
                }
            });
    }, false); // submit button

    create_account_buttons.querySelector("#create_account_cancel").addEventListener("click", hideRegisterWindow, false);

    /** buttons for managing events **/
    document.getElementById("add_event").addEventListener("click", () => {
        document.getElementById("event_window").style.visibility = "visible";
        document.getElementById("event_window").style.display = "flex";
    });
    document.getElementById("event_cancel").addEventListener("click", () => {
        hideEventWindow();
    });
    document.getElementById("event_delete").addEventListener("click", () => {
        deleteEvent(document.getElementById("event_eid").value, document.getElementById("event_token").value, (data) => {
            if (data.success) refreshMonth();
        });
        hideEventWindow();
    });
    document.getElementById("event_submit").addEventListener("click", () => {
        let event_window = document.getElementById("event_window");
        submitEvent(
            event_window.querySelector("input[name='title']").value, // get title
            event_window.querySelector("input[name='date']").value, // get date: format is YYYY-MM-DD (this will be converted to proper format with php)
            event_window.querySelector("input[name='time']").value, // get time
            event_window.querySelector("input[name='tags']").value, // get list of tags (separated by comma and space)
            event_window.querySelector("select[name='group']").value, // name of group - default "none"
            document.getElementById("event_token").value, (data) => {
                if (data.success) refreshMonth();
            }
        );
        hideEventWindow();
    });
    document.getElementById("event_update").addEventListener("click", () => {
        let event_window = document.getElementById("event_window");
        updateEvent(
            event_window.querySelector("input[name='title']").value, // get title
            event_window.querySelector("input[name='date']").value, // get date: format is YYYY-MM-DD (this will be converted to proper format with php)
            event_window.querySelector("input[name='time']").value, // get time
            event_window.querySelector("input[name='tags']").value, // get list of tags (separated by comma and space)
            event_window.querySelector("select[name='group']").value, // name of group - default "none"
            document.getElementById("event_eid").value, document.getElementById("event_token").value, (data) => {
                if (data.success) refreshMonth();
            }
        );
        hideEventWindow();
    });
}

// event is selected
function onEventButtonClicked(event) {
    let eid = parseInt(event.currentTarget.getAttribute("eid"));
    getEventDetails(eid, document.getElementById("event_token").value, (data) => {
        let event_window = document.getElementById("event_window");
        event_window.style.visibility = "visible";
        event_window.style.display = "flex";
        document.getElementById("event_eid").value = data.eid;
        document.getElementById("event_title").value = data.title;
        document.getElementById("event_date").value = data.date;
        document.getElementById("event_time").value = data.time;
        document.getElementById("event_tags").value = data.tags;
        document.getElementById("event_delete").style.display = "inherit";
        document.getElementById("event_update").style.display = "inherit";
        document.getElementById("event_submit").style.display = "none";
    });
}

function onTagToggled() {
    let disabled_tags = [];
    for (let t of document.getElementsByClassName("tag_toggler")) {
        if (!t.checked) {
            disabled_tags.push(t.parentNode.innerText);
        }
    }
    for (let btn of document.getElementsByClassName("event_button")) {
        btn.style.opacity = "100%";
        for (let tag of btn.getAttribute("tags").split(" ")) {
            if (disabled_tags.includes(tag)) {
                btn.style.opacity = "30%";
                break;
            }
        }
    }
}


/** Helper functions **/

function hideRegisterWindow() {
    document.getElementById("create_account_window").style.visibility = "hidden";
    document.getElementById("create_account_window").style.display = "none";
    document.getElementById("create_username").value = "";
    document.getElementById("create_password").value = "";
}

function hideLoginWindow() {
    document.getElementById("login_window").style.visibility = "hidden";
    document.getElementById("login_window").style.display = "none";
    document.getElementById("login_info").textContent = "";
    document.getElementById("login_username").value = "";
    document.getElementById("login_password").value = "";
}

function hideEventWindow() {
    document.getElementById("event_window").style.visibility = "hidden";
    document.getElementById("event_window").style.display = "none";
    document.getElementById("event_delete").style.display = "none";
    document.getElementById("event_update").style.display = "none";
    document.getElementById("event_submit").style.display = "inherit";
    document.getElementById("event_title").value = "";
    document.getElementById("event_date").value = "";
    document.getElementById("event_time").value = "";
    document.getElementById("event_tags").value = "";
    document.getElementById("event_group").value = "none";
}

function setUserButtons(logged) {
    document.getElementById("add_event").style.visibility = logged ? "visible" : "hidden";
    document.getElementById("add_event").style.display = logged ? "initial" : "none";
    document.getElementById("logout_btn").style.visibility = logged ? "visible" : "hidden";
    document.getElementById("logout_btn").style.display = logged ? "inherit" : "none";
    document.getElementById("login_btn").style.visibility = !logged ? "visible" : "hidden";
    document.getElementById("login_btn").style.display = !logged ? "inherit" : "none";
    document.getElementById("create_account_btn").style.visibility = !logged ? "visible" : "hidden";
    document.getElementById("create_account_btn").style.display = !logged ? "inherit" : "none";
}
