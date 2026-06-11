/*** 
     JAVASCRIPT CONNECTION CHECK
     Purpose:
     - Confirms that index.js is properly connected to index.html
***/
console.log("JavaScript connected!");

/*** 
     DARK MODE FEATURE
     Purpose:
     - Toggles dark mode on and off
     - Works with the body.dark-mode styles in styles.css
***/

// Step 1: Select the theme button
const themeButton = document.getElementById("theme-button");

// Step 2: Write the callback function for dark mode
const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
};

// Step 3: Register the click event listener for the theme button
themeButton.addEventListener("click", toggleDarkMode);


/*** 
     RSVP FORM ELEMENTS
     Purpose:
     - Selects the form, inputs, and participant list
     - These elements are used by the RSVP validation and participant functions
***/

// Step 1: Select the RSVP form
const rsvpForm = document.getElementById("rsvp-form");

// Step 2: Select each RSVP input
const nameInput = document.getElementById("name");
const stateInput = document.getElementById("state");
const emailInput = document.getElementById("email");

// Step 3: Select the section where new RSVP participants will be added
const participantsDiv = document.querySelector(".rsvp-participants");

// Step 4: Set the starting RSVP count to match the three default participants in HTML
let count = 3;


/*** 
     REDUCE MOTION FEATURE
     Purpose:
     - Lets users turn the modal image animation on and off
     - Improves accessibility for users who prefer less motion
***/

// Step 1: Track whether motion should be reduced
let motionReduced = false;

// Step 2: Select the reduce motion button
const reduceMotionBtn = document.getElementById("reduce-motion-btn");

// Step 3: Turns the modal image animation on and off
const reduceMotion = () => {
    motionReduced = !motionReduced;

    if (motionReduced === true) {
        reduceMotionBtn.textContent = "Reduce Motion ON";
    } else {
        reduceMotionBtn.textContent = "Reduce Motion";
    }
};

// Step 4: Add click event listener to the reduce motion button
reduceMotionBtn.addEventListener("click", reduceMotion);


/*** 
     SUCCESS MODAL ELEMENTS
     Purpose:
     - Selects the modal, modal text, modal image, and close button
     - These elements are used after a valid RSVP submission
***/

// Step 1: Select modal elements from the HTML
const successModal = document.getElementById("success-modal");
const modalText = document.getElementById("modal-text");
const modalImage = document.getElementById("modal-img");
const closeModalBtn = document.getElementById("close-modal-btn");

// Step 2: Create variables for modal image animation and timer control
let rotateFactor = 0;
let intervalId = null;
let timeoutId = null;


/*** 
     MODAL IMAGE ANIMATION
     Purpose:
     - Rotates the modal image back and forth while the modal is visible
***/

// Step 1: Create the animation function
const animateImage = () => {
    if (rotateFactor === 0) {
        rotateFactor = -10;
    } else {
        rotateFactor = 0;
    }

    modalImage.style.transform = `rotate(${rotateFactor}deg)`;
};


/*** 
     CLOSE MODAL FUNCTION
     Purpose:
     - Hides the success modal
     - Stops the image animation
     - Resets the modal image rotation
***/

const closeModal = () => {
    // Hide the modal
    successModal.style.display = "none";
    successModal.setAttribute("aria-hidden", "true");

    // Stop the image animation if it is running
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }

    // Stop the auto-close timer if it is running
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    // Reset the image rotation
    rotateFactor = 0;
    modalImage.style.transform = "rotate(0deg)";
};

// Add click event listener to the close button
closeModalBtn.addEventListener("click", closeModal);


/*** 
     TOGGLE MODAL FUNCTION
     Purpose:
     - Shows the success modal after a valid RSVP
     - Adds a personalized message using the user's name
     - Starts image animation unless Reduce Motion is turned on
     - Automatically closes the modal after 5 seconds
***/

const toggleModal = (person) => {
    // Stop any previous timer or animation before showing a new modal
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }

    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    // Reset image rotation before showing the modal again
    rotateFactor = 0;
    modalImage.style.transform = "rotate(0deg)";

    // Show the centered modal overlay
    successModal.style.display = "flex";
    successModal.setAttribute("aria-hidden", "false");

    // Add personalized message using the name from the RSVP form
    modalText.textContent =
        `Mission Completed! Thank you for RSVPing, ${person.name}! We are excited to see you at the CRM event. I hope you have a nice experience and learn more about CRM.`;

    // Start image animation only if Reduce Motion is OFF
    if (motionReduced === false) {
        intervalId = setInterval(animateImage, 500);
    }

    // Hide modal and stop animation after 5 seconds
    timeoutId = setTimeout(() => {
        closeModal();
    }, 5000);
};


/*** 
     ADD PARTICIPANT FUNCTION
     Purpose:
     - Adds a valid RSVP participant to the participant list
     - Updates the RSVP count on the page
***/

const addParticipant = (person) => {
    // Create a new participant element
    const newParticipant = document.createElement("p");

    // Add the new participant text
    newParticipant.textContent = `🎟️ ${person.name} from ${person.hometown} has RSVP'd.`;

    // Add the participant to the RSVP participant list
    participantsDiv.appendChild(newParticipant);

    // Remove the old RSVP count before adding the updated count
    const oldCount = document.getElementById("rsvp-count");

    if (oldCount) {
        oldCount.remove();
    }

    // Increase the RSVP count
    count++;

    // Create the updated RSVP count
    const newCount = document.createElement("p");
    newCount.id = "rsvp-count";
    newCount.textContent = `⭐ ${count} people have RSVP'd to this event!`;

    // Put the updated count back under the RSVP heading
    const rsvpSection = document.getElementById("rsvp");
    const rsvpHeading = rsvpSection.querySelector("h2");
    rsvpHeading.insertAdjacentElement("afterend", newCount);
};


/*** 
     VALIDATE FORM FUNCTION
     Purpose:
     - Checks that the RSVP form is filled out correctly
     - Adds error styling to invalid inputs
     - Creates a person object for valid input
     - Adds the participant and shows the success modal
***/

const validateForm = (event) => {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Create a person object using the RSVP input values
    const person = {
        name: nameInput.value.trim(),
        hometown: stateInput.value.trim(),
        email: emailInput.value.trim()
    };

    // Track whether the form has any errors
    let containsErrors = false;

    // Validate name
    if (person.name.length < 2) {
        containsErrors = true;
        nameInput.classList.add("error");
    } else {
        nameInput.classList.remove("error");
    }

    // Validate hometown/state
    if (person.hometown.length < 2) {
        containsErrors = true;
        stateInput.classList.add("error");
    } else {
        stateInput.classList.remove("error");
    }

    // Validate email
    if (!person.email.includes("@")) {
        containsErrors = true;
        emailInput.classList.add("error");
    } else {
        emailInput.classList.remove("error");
    }

    // If there are no errors, add participant and show modal
    if (containsErrors === false) {
        addParticipant(person);
        toggleModal(person);

        // Clear the form inputs after successful RSVP
        nameInput.value = "";
        stateInput.value = "";
        emailInput.value = "";
    }
};


/*** 
     FORM EVENT LISTENER
     Purpose:
     - Runs validateForm when the RSVP form is submitted
***/

// Add the event listener to the form submit
rsvpForm.addEventListener("submit", validateForm);