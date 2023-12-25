// Global Variables
let storedMeetingBuildings;
let storedMeetingFloors;
let storedHosts;
let guests = [];
let allMeetings = [];

// DOM Elements
const modal = document.getElementById("myModal");
const personId = document.getElementById("personId");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phoneNumber = document.getElementById("phoneNumber");
const comment = document.getElementById("comment");

const meetingBuilding = document.getElementById("meetingBuilding");
const meetingFloor = document.getElementById("meetingFloor");
const meetingHost = document.getElementById("meetingHost");
const meetingDate = document.getElementById("meetingDate");
const meetingStartTime = document.getElementById("meetingStartTime");
const meetingEndTime = document.getElementById("meetingEndTime");

// Initialization Function to Retrieve Data from Local Storage
function getDataFromLocalStorage() {
    // Retrieve data from local storage
    storedMeetingBuildings = JSON.parse(localStorage.getItem("meetingBuildings"));
    storedMeetingFloors = JSON.parse(localStorage.getItem("meetingFloors"));
    storedHosts = JSON.parse(localStorage.getItem("hosts"));

    // If data doesn't exist, insert default data
    if (storedMeetingBuildings === null || storedMeetingFloors === null || storedHosts === null) {
        insertDataToLocalStorage();
    }

    // Set default date and time if not provided
    if (meetingDate?.value === "") {
        const currentDate = new Date().toISOString().split('T')[0];
        meetingDate.value = currentDate;

        const currentTime = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        meetingStartTime.value = currentTime;
    }
    // Retrieve all meetings from local storage
    getAllMeetingsFromLocalStorage();
}

// Function to Insert Default Data to Local Storage
function insertDataToLocalStorage() {

    // Default data for meeting buildings, floors, and hosts
    const meetingBuildings = ["הראל - רמת גן", "הראל - פתח תקווה", "הראל - אשדוד"];
    const meetingFloors = [];

    for (let i = 1; i <= 25; i++) {
        meetingFloors.push(i);
    }

    const hosts = ["חיים", "יוסי", "עידן להב", "יובל חיימוב", "מנחם בגין", "טרומפלדור"];

    // Store default data if not already stored
    if (storedMeetingBuildings === null) {
        localStorage.setItem("meetingBuildings", JSON.stringify(meetingBuildings));
    }
    if (storedMeetingFloors === null) {
        localStorage.setItem("meetingFloors", JSON.stringify(meetingFloors));
    }
    if (storedHosts === null) {
        localStorage.setItem("hosts", JSON.stringify(hosts));
    }
}

// Function to Populate HTML
function pushDataToHtml() {
    let optionsMeetingBuilding = "";
    let optionsMeetingFloor = "";
    let optionsMeetingHost = "";

    // Populate options for meeting buildings
    for (const building of storedMeetingBuildings) {
        optionsMeetingBuilding += `<option>${building}</option>`;
    }
    // Populate options for meeting floors
    for (const floor of storedMeetingFloors) {
        optionsMeetingFloor += `<option>${floor}</option>`;
    }
    // Populate options for meeting hosts
    for (const host of storedHosts) {
        optionsMeetingHost += `<option>${host}</option>`;
    }

    // Set minimum date for meetingDate input
    meetingDate.min = new Date().toLocaleDateString('en-CA');

    // Inject options into HTML
    meetingBuilding.innerHTML += optionsMeetingBuilding;
    meetingFloor.innerHTML += optionsMeetingFloor;
    meetingHost.innerHTML += optionsMeetingHost;
}

// Validation Check for Meeting Time
function timeChecking() {

    // Check if meetingEndTime is before meetingStartTime
    if (meetingStartTime.value > meetingEndTime.value && meetingEndTime.value !== "") {
        meetingEndTime.value = null;
        alert("זמן סיום חייב אחרי זמן ההתחלה");
    }
}

// Function to Manage Modal Popup
function modalPopup() {
    // Get the button that opens the modal
    const openPopup = document.getElementById("openPopup");

    // Get the <span> element that closes the modal
    const closeSpan = document.getElementsByClassName("closeSpan")[0];

    // Get the button that closes the modal
    const cancel = document.getElementById("cancel");

    // When the user clicks on the button, open the modal
    openPopup.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    closeSpan.onclick = function () {
        modal.style.display = "none";
        clearPopupInputs();
    }

    // When the user clicks on <button> (״בטל״), close the modal
    cancel.onclick = function () {
        modal.style.display = "none";
        clearPopupInputs();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            clearPopupInputs();
        }
    }
}

// Function to Clear Popup Inputs
function clearPopupInputs() {
    personId.value = "";
    firstName.value = "";
    lastName.value = "";
    phoneNumber.value = "";
    comment.value = "";
}

// Function to Add Guest Information
function AddGuest() {

    // Get the table body element
    const tBody = document.getElementById("tBody");

    // Create guest information object
    let guestInformation = {
        guestNumber: guests.length + 1,
        personId: personId.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        comment: comment.value
    }

    // Push guest information to the guests array
    guests.push(guestInformation);

    let tableGuests = "";

    // Build HTML for each guest and update the table
    for (const guest of guests) {
        tableGuests += `
        <tr>
            <td>${guest.guestNumber}</td>
            <td>${guest.personId}</td>
            <td>${guest.firstName}</td>
            <td>${guest.lastName}</td>
            <td>${guest.phoneNumber}</td>
            <td>${guest?.comment}</td>
        </tr>`;
        tBody.innerHTML = tableGuests;
    }

    // Clear input fields in the modal and hide the modal
    clearPopupInputs();
    modal.style.display = "none";
}

// Function to Add Meeting and Save to Local Storage
function addMeeting() {

    // Get validation popup element
    const validationPopup = document.getElementById("validationPopup");

    // Check if there are guests added to the meeting
    if (guests.length > 0) {

        // Create a new meeting object
        const newMeeting = {
            meetingNumber: allMeetings?.length + 1,
            meetingGoal: meetingGoal.value,
            meetingBuilding: meetingBuilding.value,
            meetingFloor: meetingFloor.value,
            meetingDate: meetingDate.value,
            meetingStartTime: meetingStartTime.value,
            meetingEndTime: meetingEndTime.value,
            meetingHost: meetingHost.value,
            guests: guests
        }

        // Push the new meeting to the allMeetings array
        allMeetings.push(newMeeting);

        // Save all meetings to local storage
        saveAllMeetingsToLocalStorage();

        // Display success popup and navigate after a delay
        const popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
        setTimeout(() => {
            location.href = "meetings.html";
        }, 3000);
    }
    else {
        // Display validation popup and hide after a delay
        validationPopup.classList.toggle("show");
        setTimeout(() => {
            validationPopup.classList.remove("show");
        }, 1500);
    }
}

// Function to Save All Meetings to Local Storage
function saveAllMeetingsToLocalStorage() {
    // Save all meetings to local storage
    localStorage.setItem("allMeetings", JSON.stringify(allMeetings));
}

// Function to Retrieve All Meetings from Local Storage
function getAllMeetingsFromLocalStorage() {
    // Retrieve all meetings from local storage
    if (JSON.parse(localStorage.getItem("allMeetings")) != null) {
        allMeetings = JSON.parse(localStorage.getItem("allMeetings"));
    }
}

// Function to Display All Meetings in HTML
function displayAllMeetings() {

    // Retrieve all meetings and display them in HTML
    getAllMeetingsFromLocalStorage();
    const allMeetingsTBody = document.getElementById("allMeetingsTBody");
    if (allMeetings?.length > 0) {
        let allMeetingsData = "";

        // Build HTML for each meeting and its guests
        for (const meeting of allMeetings) {
            allMeetingsData += `
        <tr>
            <td>${meeting.meetingNumber}</td>
            <td>${meeting.meetingGoal}</td>
            <td>${meeting.meetingBuilding}</td>
            <td>${meeting.meetingFloor}</td>
            <td>${meeting.meetingDate}</td>
            <td>${meeting.meetingStartTime}</td>
            <td>${meeting.meetingEndTime}</td>
            <td>${meeting.meetingHost}</td></tr><tr><td colspan="8" style="border:none; text-align:right;"><ol>`
            for (let i = 0; i < allMeetings[meeting.meetingNumber - 1].guests.length; i++) {
                allMeetingsData +=
                    `<li>שם מלא: ${meeting.guests[i].firstName} ${meeting.guests[i].lastName}, ת״ז: ${meeting.guests[i].personId}, טלפון: ${meeting.guests[i].phoneNumber}</li>`
            };
            allMeetingsData +=
                `</ol></td></tr>`
        }
        // Update the HTML content with all meetings data
        allMeetingsTBody.innerHTML = allMeetingsData;
    }

}

// Function to Change Page Based on Current Location
function changePage() {
    // Change page based on the current location
    if (window.location.pathname.endsWith("/index.html")) {
        window.location.href = "meetings.html";
    }
    else {
        window.location.href = "index.html";
        getDataFromLocalStorage();
        pushDataToHtml();
    }
}

// Initialization: Load Data and Populate HTML on Index Page
if (window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("/Harel-Insurance")) {
    getDataFromLocalStorage();
    pushDataToHtml();
}
else {
    // Display all meetings on the meetings page
    displayAllMeetings();
}
