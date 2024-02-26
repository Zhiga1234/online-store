function validateName() {
    var name = document.getElementById("name").value;
    var namePattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

    if (name.trim() === "") {
        document.getElementById("nameError").textContent = "Name field is required.";
        return false;
    } else if (!namePattern.test(name)) {
        document.getElementById("nameError").textContent = "Please enter a valid name.";
        return false;
    }
    document.getElementById("nameError").textContent = "";
    return true;
}

function validateEmail() {
    var email = document.getElementById("email").value;
    var emailPattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(gmail\.com|mail\.ru)$/i;

    if (email.trim() === "") {
        document.getElementById("emailError").textContent = "Email field is required.";
        return false;
    } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = "Please enter '@gmail.com' or '@mail.ru' domain";
        return false;
    }
    document.getElementById("emailError").textContent = "";
    return true;
}

function validateMessage() {
    var message = document.getElementById("message").value;
    var messagePattern = /^[a-zA-Z0-9 ]*$/;

    if (message.trim() === "") {
        document.getElementById("messageError").textContent = "Message field is required.";
        return false;
    } else if (!messagePattern.test(message)) {
        document.getElementById("messageError").textContent = "Please enter a valid message. Only alphabets and numbers are allowed.";
        return false;
    }
    document.getElementById("messageError").textContent = "";
    return true;
}

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let isValidName = validateName();
    let isValidEmail = validateEmail();
    let isValidMessage = validateMessage();

    if (isValidName && isValidEmail && isValidMessage) {
        var params = {
            from_name : document.getElementById("name").value,
            email_id: document.getElementById("email").value,
            message: document.getElementById("message").value
        }
    
        emailjs.send("service_ds58sky","template_9s11lbg",params)
        alert("Form submitted successfully!");
        
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
    }
});

document.getElementById("name").addEventListener("input", validateName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("message").addEventListener("input", validateMessage);
