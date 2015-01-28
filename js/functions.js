/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function login() {
    var data = $("#login").serialize();
    login_button.startSpin();
    login_button.setDisabled(true);
    $.ajax({
        type: "POST",
        url: service_url + "anggotas/login.json",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.response.status == 202) {
                loginSuccess(data.response.data.email);
            } else if (data.response.status == 402) {
                alert("Email/kata sandi salah");
                login_button.stopSpin();
                login_button.setDisabled(false);
            } else {
                alert(data.response.message);
                login_button.stopSpin();
                login_button.setDisabled(false);
            }
        },
        error: function () {
            login_button.stopSpin();
            login_button.setDisabled(false);
            alert('Tidak dapat mencapai server');
        }
    });

}

function loginSuccess(email) {
    localStorage['credential_email'] = email;
    login_button.stopSpin();
    login_button.setDisabled(false);
    setMainPage("dashboard.html");
    menu.setSwipeable(true);
}

function setMainPage(e) {
    menu.setMainPage(e, {closeMenu: true});
}

function logout() {
    localStorage.clear();
    setMainPage("login.html");
    menu.setSwipeable(false);
}

function register() {
    var data = $("#register").serialize();
    register_button.startSpin();
    $.ajax({
        type: "POST",
        url: service_url + "anggotas.json",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.response.status == 101) {
                errorHandle(data.response.data.errors);
            } else if (data.response.status == 200) {
                alert("Pendaftaran berhasil");
                setMainPage("login.html");
            }
            register_button.stopSpin();
            register_button.setDisabled(false);
        },
        error: function () {
            register_button.stopSpin();
            register_button.setDisabled(false);
            alert('Tidak dapat mencapai server');
        }
    });
}

function errorHandle(errors) {
    for (x in errors) {
        alert(errors[x]);
        break;
    }
}