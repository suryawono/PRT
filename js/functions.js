/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    $("#login").on("submit", function (e) {
        e.preventDefault();
        $.mobile.loading("show", {
            text: "Sedang Login",
            textVisible: true,
            theme: $.mobile.loader.prototype.options.theme,
            textonly: false,
            html: ""
        });
        login($("#email").val(), $("#password").val(), function () {
            $.mobile.loading("hide");
        });

    })
})

function login(username, password, callback) {
    var login = true;
    if (username == "suryawono@yahoo.co.id" && password == "suhendilau") {

    } else {
        login = false;
    }
    callback();
    if (!login) {
        $("#loginTooltip p").html("Email/kata sandi salah");
        $("#loginTooltip").popup("open");
    }else{
        $("#loginTooltip p").html("Login sukses");
        $("#loginTooltip").popup("open");
    }
}