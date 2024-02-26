document.addEventListener('DOMContentLoaded', function() {
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginUsernameError = document.getElementById('loginUsernameError');
    const loginPasswordError = document.getElementById('loginPasswordError');

    function validateUsername(username) {
        const regex = /^[a-z][a-z0-9]*$/i; // Username should start with a letter
        return regex.test(username);
    }

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }

    function updateLoginUsernameError() {
        const username = loginUsernameInput.value.trim();
        if (!username) {
            loginUsernameError.textContent = 'Username is required.';
        } else if (!validateUsername(username)) {
            loginUsernameError.textContent = 'Username must start with a letter and contain only letters and integers.';
        } else {
            loginUsernameError.textContent = '';
        }
    }

    function updateLoginPasswordError() {
        const password = loginPasswordInput.value.trim();
        if (!password) {
            loginPasswordError.textContent = 'Password is required.';
        } else if (!validatePassword(password)) {
            loginPasswordError.textContent = 'Password must be at least 8 characters and contain at least one letter and one number.';
        } else {
            loginPasswordError.textContent = '';
        }
    }

    loginUsernameInput.addEventListener('input', updateLoginUsernameError);
    loginPasswordInput.addEventListener('input', updateLoginPasswordError);
    const authIcon = document.querySelector('.fa-user');

    authIcon.addEventListener('click', function(e) {
    e.preventDefault();  

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const alreadyRegisteredModal = new bootstrap.Modal(document.getElementById('alreadyRegisteredModal'));
        alreadyRegisteredModal.show();
    } else {
        const modalForm = new bootstrap.Modal(document.getElementById('ModalForm'));
        modalForm.show();
    }
    });
    function saveUserAndRedirect(username) {
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
        exitButton.classList.remove('d-none');

    }

    const loginFormDiv = document.getElementById('loginForm');
    const signupFormDiv = document.getElementById('signupForm');
    const showSignupFormButton = document.getElementById('showSignupForm');
    const showLoginFormButton = document.getElementById('showLoginForm');
    const modalForm = document.getElementById('ModalForm');
    const loginFormActual = document.getElementById('loginFormActual');
    const signupFormActual = document.getElementById('signupFormActual');

    showSignupFormButton.addEventListener('click', function(e) {
        e.preventDefault();
        loginFormDiv.style.display = 'none';
        signupFormDiv.style.display = 'block';
    });

    showLoginFormButton.addEventListener('click', function(e) {
        e.preventDefault();
        signupFormDiv.style.display = 'none';
        loginFormDiv.style.display = 'block';
    });

    modalForm.addEventListener('shown.bs.modal', function() {
        loginFormActual.reset();
        signupFormActual.reset();
    });

    modalForm.addEventListener('hidden.bs.modal', function() {
        loginFormDiv.style.display = 'block';
        signupFormDiv.style.display = 'none';
    });

    function validateUsername(username) {
        const regex = /^[a-z0-9]+$/;
        const valid = regex.test(username);
        document.getElementById('usernameError').textContent = valid ? '' : 'Username must contain only lowercase letters and integers.';
        return valid;
    }

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
        const valid = regex.test(password);
        document.getElementById('passwordError').textContent = valid ? '' : 'Password must be at least 8 characters and contain at least one letter and one number.';
        return valid;
    }

    function validateConfirmPassword(password, confirmPassword) {
        const valid = password === confirmPassword;
        document.getElementById('confirmPasswordError').textContent = valid ? '' : 'Passwords do not match.';
        return valid;
    }

    document.getElementById('signupButton').addEventListener('click', function(e) {
        e.preventDefault();
    
        const username = document.getElementById('signUpUsername').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    
        const isUsernameValid = validateUsername(username);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
        if (isUsernameValid && isPasswordValid && isConfirmPasswordValid) {
            if (!localStorage.getItem('user_' + username)) {
                localStorage.setItem('user_' + username, password);
                saveUserAndRedirect(username);
            } else {
                alert('User already exists.');
            }
        }
    });
    

    document.getElementById('loginButton').addEventListener('click', function(e) {
        e.preventDefault();
    
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
    
        if(username === 'tabo' && password === 'assignment4') {
            window.location.href = 'admin.html'; 
            return; 
        }
    
        const storedPassword = localStorage.getItem('user_' + username);
    
        if (storedPassword && storedPassword === password) {
            saveUserAndRedirect(username); 
        } else {
            alert('Incorrect username or password.');
        }
    });
    

    const exitButton = document.getElementById('exitButton');

    if (localStorage.getItem('currentUser')) {
        exitButton.classList.remove('d-none');
    }

    exitButton.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        exitButton.classList.add('d-none');
        document.getElementById('currentUser').textContent = '';

        alert('Logged out successfully.');
    });

    function displayUsername() {
        const username = localStorage.getItem('currentUser');
        if (username) {
            document.getElementById('currentUser').textContent = username;
        }
    }
    displayUsername();

});
