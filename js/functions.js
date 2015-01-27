/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function login() {
    loginSuccess();
}

function loginSuccess() {
    setMainPage("dashboard.html");
    menu.setSwipeable(true);
}

function setMainPage(e){
    menu.setMainPage(e, {closeMenu: true});
}

function tambahTransaksi(jenis){
    alert(jenis);
}

function logout(){
    alert("logout");
    setMainPage("login.html");
    menu.setSwipeable(false);
}