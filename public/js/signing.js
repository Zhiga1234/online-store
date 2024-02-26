// Sample data store (in a real application, you'd use a database)
var users = [];

function signup() {
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;

    // Basic validation
    if (username === '' || password === '') {
        alert('Username and Password are required!');
        return;
    }

    // Check if user already exists
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            alert('Username already exists. Choose another.');
            return;
        }
    }

    // Save new user
    users.push({
        username: username,
        password: password
    });

    alert('Signup successful!');
    // Switch to login form
    $("#signupForm").hide();
    $("#loginForm").show();
}

function signin() {
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;

    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            alert('Login successful!');
            // Here, you can redirect to a new page or make other changes as needed
            return;
        }
    }

    alert('Incorrect username or password!');
}

// Now, let's bind the signin and signup functions to the button clicks

$(document).ready(function() {
    // ... [Your existing code]

    $('#loginForm button[type="button"]').click(signin);
    $('#signupForm button[type="button"]').click(signup);
});
