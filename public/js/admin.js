function refreshUsersList() {
    usersListDiv.innerHTML = '';  

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key.startsWith('user_')) {
            const username = key.replace('user_', '');
            const password = localStorage.getItem(key);
            usersListDiv.innerHTML += `
                <div>
                    <p>Username: ${username}, Password: ${password}</p>
                    <button onclick="deleteUser('${username}')">Delete</button>
                    <button onclick="showUpdateForm('${username}', '${password}')">Update</button>
                    <div id="updateForm_${username}" style="display:none;">
                        <input type="text" placeholder="New Username" id="newUsername_${username}" value="${username}">
                        <input type="password" placeholder="New Password" id="newPassword_${username}" value="${password}">
                        <button onclick="updateUser('${username}')">Save Changes</button>
                    </div>
                </div>
            `;
        }
    }
}


function deleteUser(username) {
    if (confirm('Are you sure you want to delete this user?')) {
        localStorage.removeItem('user_' + username);
        refreshUsersList();
    }
}


function showUpdateForm(username, password) {
    const formDiv = document.getElementById('updateForm_' + username);
    formDiv.style.display = formDiv.style.display === 'none' ? 'block' : 'none';
}

function updateUser(originalUsername) {
    const newUsername = document.getElementById('newUsername_' + originalUsername).value;
    const newPassword = document.getElementById('newPassword_' + originalUsername).value;


    localStorage.removeItem('user_' + originalUsername); 
    localStorage.setItem('user_' + newUsername, newPassword); 
    refreshUsersList();
}

const usersListDiv = document.getElementById('usersList');
refreshUsersList(); 

document.getElementById('adminLogout').addEventListener('click', function() {
    window.location.href = 'index.html';
});