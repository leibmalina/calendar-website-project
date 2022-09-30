/**
 * Functions doing I/O directly with server. Mainly about calendar events.
 */

function getEventList(month, year, token, callback) {

    // pass the current month to fetch request:
    const data = {'month': month, 'year': year, 'token': token};

    // send login credentials to php page to verify with db
    fetch("scripts/php/get_events.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}

function getEventDetails(eid, token, callback) {
    fetch("scripts/php/event_details.php", {
        method: 'POST',
        body: JSON.stringify({'eid': eid, 'token': token}),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}

// add an event to the database after event form submit
function submitEvent(title, date, time, tags, group, token, callback) {

    // use fetch api to send data to server side
    fetch("scripts/php/add_event.php", {
        method: 'POST',
        body: JSON.stringify({
            'title': title,
            'date': date,
            'time': time,
            'tags': tags,
            'group': group,
            'token': token
        }),
        headers: {'content-type': 'application/json'}
    }).then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}

function deleteEvent(eid, token, callback) {
    fetch("scripts/php/event_delete.php", {
        method: 'POST',
        body: JSON.stringify({'eid': eid, 'token': token}),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}

function updateEvent(title, date, time, tags, group, eid, token, callback) {
    // use fetch api to send data to server side
    fetch("scripts/php/event_update.php", {
        method: 'POST',
        body: JSON.stringify({
            'eid': eid,
            'title': title,
            'date': date,
            'time': time,
            'tags': tags,
            'group': group,
            'token': token
        }),
        headers: {'content-type': 'application/json'}
    }).then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}
