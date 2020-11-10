/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
       app.onDeviceReady();
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log("Received event: " + id);

        document.getElementById('testProtectedButton').onclick = this.testProtected;
        //user.init('userAuth');
    },
    testProtected: function () {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4) {
                switch (this.status) {
                    case 200:
                        var res = JSON.parse(xhttp.responseText);
                        console.log(res.message);
                        break;
                    case 401:
                        var res = JSON.parse(xhttp.responseText);
                        console.log(res.message);
                        user.showLogin('Please log in to access protected route.');
                        break;
                    case 403:
                        var res = JSON.parse(xhttp.responseText);
                        console.log(res.message);
                        user.showLogin('Please log in to access protected route.');
                        break;
                    default:
                        // unhandled error
                        console.log("Unhandled error");
                }
            }
        };
        xhttp.onerror = function (err) {
            var authContainer = document.getElementById('userAuth');

            authContainer.innerHTML = '<div id="snackbar">Service possibly down.</div>';
            var snackbarElement = document.getElementById("snackbar");
            snackbarElement.className = "show";

            // After 3 seconds, remove the show class from DIV
            setTimeout(function () { authContainer.innerHTML = ''; }, 3000);
            console.log(err);
        };

        xhttp.open("GET", "http://185.39.3.120:8000/test-protected", true);
        xhttp.setRequestHeader("Authorization", "Bearer: " + user.getToken());
        xhttp.send();
    }
};

app.initialize();