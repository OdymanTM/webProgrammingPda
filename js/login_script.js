document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;

        // Here you can add your authentication logic
        if (username === "admin" && password === "password") {
            alert('Login successful!');
            window.location.replace("/posts.html");
            // Redirect or perform other actions after successful login
        } else {
            alert('Invalid username or password');
        }
    });
});