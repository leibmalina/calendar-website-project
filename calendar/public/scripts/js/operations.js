/**
 * Complex operations for calendar.
 */

const MONTH_NAME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


let current_date = new Date();
let current_month = new Month(current_date.getFullYear(), current_date.getMonth());

function refreshMonth() {
    for (let btn of document.getElementsByClassName("event_button"))
        btn.removeEventListener("click", onEventButtonClicked, false);
    document.getElementById("calendar_tbody").textContent = "";
    getEventList(current_month.month, current_month.year, document.getElementById("event_token").value, (data) => {
        let daysData = daysJSON(data, current_month.month, current_month.year);
        fillDatesCall(daysData);
        updateTags();
    });
}

function fillDatesCall(eventList) {
    let monthElement = document.getElementById("month_label");
    monthElement.innerText = MONTH_NAME[current_month.month] + ", " + current_month.year.toString();

    let calendarElement = document.getElementById("calendar_tbody");
    let weeks = current_month.getWeeks();
    while (weeks.length < 6) {
        weeks.push(weeks[weeks.length - 1].nextWeek());
    }
    for (let week of weeks) {
        let week_row = document.createElement("tr");
        calendarElement.appendChild(week_row);
        for (let day of week.getDates()) {
            let day_cell = document.createElement("td");
            let day_contents = document.createElement("div");
            day_cell.className = "day_cell";
            day_contents.className = "day_contents";
            calendarElement.appendChild(day_cell);
            day_cell.appendChild(day_contents);
            week_row.appendChild(day_cell);

            if (day.getMonth() === current_month.month) {
                day_cell.classList.add("valid_day");
                day_contents.appendChild(document.createTextNode(day.getDate()));

                if (current_date.getFullYear() === day.getFullYear() &&
                    current_date.getMonth() === day.getMonth() &&
                    current_date.getDate() === day.getDate()) {
                    day_cell.classList.add("today");
                }

                appendEvents(eventList[day.getDate() - 1].events, day_contents);

            } else {
                day_cell.classList.add("invalid_day");
            }
        }
    }
}

// create event button and fill in information
function appendEvents(events, container) {
    events.forEach(s => {
        let event_btn = document.createElement("input");
        event_btn.type = "button";
        event_btn.className = "event_button";
        event_btn.setAttribute("eid", s.eid.toString());
        event_btn.setAttribute("tags", s.tags);
        event_btn.value = "📄 " + s.title;
        // if event button clicked, open the event view window
        event_btn.addEventListener("click", onEventButtonClicked, false);
        container.appendChild(event_btn);
    })
}

function updateTags() {
    let tag_panel = document.getElementById("tag_panel");
    tag_panel.innerHTML = "<div>Tags</div>";
    let tags = [];
    for (let btn of document.getElementsByClassName("event_button"))
        btn.getAttribute("tags").split(" ").forEach(tag => {
            if (tag.trim().length > 0 && !tags.includes(tag)) {
                tags.push(tag);
                tag_panel.innerHTML += `
                <label>
                    <input type="checkbox" class="tag_toggler" checked>${tag}
                </label>
                `;
            }
        });
    for (let t of document.getElementsByClassName("tag_toggler"))
        t.addEventListener("change", onTagToggled, false);
}

// given json string with the events, this creates a new json string with an entry for each day
function daysJSON(data, month, year) {
    // create array to store values with number of days in the month
    let jsonArr = [];

    // add an entry for each day in the month, with the events for each day
    //  create an object to store each of the fields, then add it to the array
    for (let i = 0; i < getMonthDays(month, year); i++) {
        let dayEntry = {};
        dayEntry.day = i; // record the day number

        dayEntry.events = []; // store events in array

        // iterate through events data (in json format)
        data.forEach(e => {
            // if the event happens on this day
            if (e.day - 1 === i) {
                let dayEvent = {};
                // store event details:
                dayEvent.eid = e.eid;
                dayEvent.title = e.title;
                dayEvent.tags = e.tags;
                dayEntry.events.push(dayEvent); // add the event to the list of events
            }
        });

        // add the new day entry to the json array
        jsonArr.push(dayEntry);
    }

    // return json string with list of days and events for each day
    // return JSON.stringify(jsonArr);
    return jsonArr;
}

// given the month, find the number of days in the month
function getMonthDays(month, year) {
    return new Month(year, month).nextMonth().getDateObject(0).getDate()
}
