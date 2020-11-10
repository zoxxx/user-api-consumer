var user = {
    containerId: 'userAuth',
    apiServer: '',
    loginTemplate: `
        <div class="userAuth">
            <div class="userForm">
                <div class="spinner" id="spinner"></div>
                <div class="error" id="error">
                </div>
                <input type="text" placeholder="email" id="emailField" />
                <input type="password" placeholder="password" id="passwordField">
                <button class="button" id="loginButton">Login</button>
                <div class="float-right">
                    <button class="button button-outline" id="signUpButton">Sign Up</button>
                </div>
                <div class="center">
                    <button class="button button-clear" id="forgotButton">forgot password?</button>
                </div>
            </div>
        </div>`.trim(),
    showLogin: function (errMsg) {
        document.getElementById(this.containerId).innerHTML = this.loginTemplate;
        document.getElementById('loginButton').onclick = this.submitLoginData.bind(this);
        document.getElementById('signUpButton').onclick = this.showSignUp.bind(this);
        document.getElementById('forgotButton').onclick = this.showForgot.bind(this);
        if (typeof errMsg == 'string') this.showError(errMsg);
    },
    submitLoginData: function () {
        var email = document.getElementById('emailField').value;
        var password = document.getElementById('passwordField').value;

        if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showError("Invalid email format!");
            return;
        }
        if (password.length < 1) {
            this.showError("Password field can't be empty!");
            return;
        }

        this.hideError();
        this.showSpinner();

        var user = {
            'email': email,
            'password': password
        }
        //console.log(user);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4) {
                this.hideSpinner();
                switch (xhttp.status) {
                    case 200:
                        var res = JSON.parse(xhttp.responseText);
                        //console.log(res);
                        console.log(this.parseJwt(res.token));
                        localStorage.setItem('token', res.token);
                        this.exitAuthAndMsg('Login success. You may access protected route.');
                        break;
                    case 401:
                        //console.log(xhttp.responseText);
                        var res = JSON.parse(xhttp.responseText);
                        this.showError(res.message);
                        break;
                    default:
                        console.log('unknown error');
                        this.showError("Unknown Error Occured. Server response not received. Try again later.");
                }
            }
        }.bind(this);

        xhttp.open("POST", this.apiServer + '/user/login', true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(user));
    },
    signUpTemplate: `
        <div class="userAuth">
            <div class="userForm">
                <div class="spinner" id="spinner"></div>
                <div class="error" id="error"></div>
                <input type="text" placeholder="email" id="emailField">
                <input type="password" placeholder="password" id="passwordField">
                <input type="password" placeholder="repeat password" id="repeatPasswordField">
                <button class="button" id="signUpButton">Sign Up</button>
                <div class="float-right">
                    <button class="button button-outline" id="loginButton">Login</button>
                </div>
                <div class="center">
                    <button class="button button-clear" id="forgotButton">forgot password?</button>
                </div>
            </div>
        </div>`.trim(),
    showSignUp: function () {
        document.getElementById(this.containerId).innerHTML = this.signUpTemplate;
        document.getElementById('signUpButton').onclick = this.submitSignUpOrForgotData.bind(this);
        document.getElementById('loginButton').onclick = this.showLogin.bind(this);
        document.getElementById('forgotButton').onclick = this.showForgot.bind(this);
    },
    submitSignUpOrForgotData: function (isForgot) {
        console.log("isForgot: " , isForgot);
        let apiPath = '/user/signup';
        if (isForgot === true) apiPath = '/user/forgot'; 

        var email = document.getElementById('emailField').value;
        var password = document.getElementById('passwordField').value;
        var repeatPassword = document.getElementById('repeatPasswordField').value;

        // test email format https://ui.dev/validate-email-address-javascript/
        if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showError("Invalid email format!");
            return;
        }
        if (password !== repeatPassword) {
            this.showError("Passwords doesn't match!");
            return;
        } else {
            if (password.length < 8) {
                this.showError("Password must be at leat 8 characters long!");
                return;
            }
        }

        this.hideError();
        this.showSpinner();

        var user = {
            'email': email,
            'password': password
        }
        //console.log(user);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4) {
                switch (xhttp.status) {
                    case 200:
                        var res = JSON.parse(xhttp.responseText);
                        console.log(res);
                        this.showLogin(res.message);
                        break;
                    case 403:
                        var res = JSON.parse(xhttp.responseText);
                        console.log(res);
                        this.showError(res.message);
                        break;
                    default:
                        console.log("unknown error");
                        this.showError("Unknown Error Occured. Server response not received. Try again later.");
                }
                this.hideSpinner();
            }
        }.bind(this);

        xhttp.open("POST", this.apiServer + apiPath, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(user));
    },
    forgotTemplate: `
        <div class="userAuth">
            <div class="userForm">
                <div class="spinner" id="spinner"></div>
                <div class="error" id="error"></div>
                <input type="text" placeholder="email" id="emailField">
                <input type="password" placeholder="new password" id="passwordField">
                <input type="password" placeholder="repeat password" id="repeatPasswordField">
                <button class="button" id="resetButton">Reset password</button>
                <div>
                    <button class="button button-outline" id="loginButton">Login</button>
                    <div class="float-right">
                        <button class="button button-outline" id="signUpButton">Sign Up</button>
                    </div>
                </div>
            </div>
        </div>`.trim(),
    showForgot: function () {
        document.getElementById(this.containerId).innerHTML = this.forgotTemplate;
        // pass true as argument if it's forgot password form
        document.getElementById('resetButton').onclick = this.submitSignUpOrForgotData.bind(this, true);
        document.getElementById('loginButton').onclick = this.showLogin.bind(this);
        document.getElementById('signUpButton').onclick = this.showSignUp.bind(this);
    },
    exitAuthAndMsg: function (msg) {
        var authContainer = document.getElementById(this.containerId);

        authContainer.innerHTML = '<div id="snackbar">' + msg + '</div>';
        var snackbarElement = document.getElementById("snackbar");
        snackbarElement.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { authContainer.innerHTML = ''; }, 3000);
    },
    showError: function (msg) {
        var errorDiv = document.getElementById('error');
        errorDiv.textContent = msg;
        errorDiv.style.display = "block";
    },
    hideError: function () {
        var errorDiv = document.getElementById('error');
        errorDiv.style.display = "none";
    },
    showSpinner: function () {
        var spinnerDiv = document.getElementById('spinner');
        spinnerDiv.style.display = "block";
    },
    hideSpinner: function () {
        var spinnerDiv = document.getElementById('spinner');
        spinnerDiv.style.display = "none";
    },
    logout: function () {
        // to logout user just set token to empty string
        localStorage.setItem('token', '');
    },
    getToken: function () {
        return localStorage.getItem('token');
    },
    parseJwt: function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
};