/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function login() {
    var data = $("#login").serialize();
    login_button.startSpin();
    login_button.setDisabled(true);
//    $.ajax({
//        type: "POST",
//        url: service_url + "anggotas/login.json",
//        data: data,
//        dataType: "json",
//        success: function (data) {
//            if (data.response.status == 202) {
//                loginSuccess(data.response.data);
//            } else if (data.response.status == 402) {
//                alert("Email/kata sandi salah");
//                login_button.stopSpin();
//                login_button.setDisabled(false);
//            } else {
//                alert(data.response.message);
//                login_button.stopSpin();
//                login_button.setDisabled(false);
//            }
//        },
//        error: function () {
//            login_button.stopSpin();
//            login_button.setDisabled(false);
//            alert('Tidak dapat mencapai server');
//        }
//    });
    callGoogle();
    login_button.stopSpin();
    login_button.setDisabled(false);
}

function loginSuccess(data) {
    localStorage['credential'] = JSON.stringify(data);
    login_button.stopSpin();
    login_button.setDisabled(false);
    credential = data;
    fetchStaticData();
    fetchTransaksi(function () {
        init();
    });

}

function setMainPage(e) {
    menu.setMainPage(e, {closeMenu: true});
}

function logout() {
    localStorage.clear();
    buku.clear();
    hubungan_anggota = [];
    jenis_anggota = [];
    kategori = [];
    setMainPage("login.html");
    menu.setSwipeable(false);
    disconnectUser();
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

function dashboard() {
    setMainPage("dashboard.html");
    menu.setSwipeable(true);
    $(".profile-image").attr("src", credential.anggota.pp_link);
    $(".profile-name").html(credential.anggota.nama);
    $(".profile-id").html(credential.jenis_anggota.nama);
}

function init() {
    if (credential.rumah_tangga.setup_up == 0) {
        setMainPage("profilRumahTangga.html");
    } else {
        dashboard();
    }
}

function simpanProfilRumahTangga() {
    var data = $("#profilRumahTangga").serializeArray();
    $.ajax({
        type: "POST",
        url: service_url + "rumah_tanggas/edit.json",
        data: data.concat({name: "id", value: credential.rumah_tangga.id}),
        dataType: "json",
        success: function () {
            credential.rumah_tangga.setup_up = 1;
            updateCredential();
            alert("Tersimpan");
            dashboard();
        },
        error: function () {
            alert("Unable to connect to server.");
        }
    })
}

function updateCredential() {
    localStorage['credential'] = JSON.stringify(credential);
}

function fetchTransaksi(callback) {
    $.ajax({
        type: "POST",
        url: service_url + "anggotas/get.json",
        data: {id: credential.anggota.id},
        dataType: "JSON",
        success: function (data) {
            $.each(data.response.data.Transaksi, function (k, v) {
                buku.add(new Record(v.besaran, v.deskripsi, new Date(v.waktu).getTime(), jenis_kategori[v.Kategori.jenis_kategori_id], v.kategori_id));
            });
            callback();
        },
        error: function () {
            alert("Unable to connect to server.");
        }
    })
}

function sendTransaksi(transaksi) {
    $.ajax({
        type: "POST",
        url: service_url + "transaksis/add.json",
        data: transaksi,
        dataType: "JSON",
        success: function () {

        },
        error: function () {
            //flagnotsave
        }
    })
}

function toSqlDatetime(timestamp) {
    return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
}

function fetchStaticData() {
    $.ajax({
        type: "POST",
        url: service_url + "jenis_anggotas/all.json",
        dataType: "JSON",
        success: function (data) {
            $.each(data.response.data, function (k, v) {
                jenis_anggota.push({id: v.JenisAnggota.id, name: v.JenisAnggota.nama});
            });
            localStorage['jenis_anggota'] = JSON.stringify(jenis_anggota);
        },
        error: function () {

        }
    })
    $.ajax({
        type: "POST",
        url: service_url + "hubungan_anggotas/all.json",
        dataType: "JSON",
        success: function (data) {
            $.each(data.response.data, function (k, v) {
                hubungan_anggota.push({id: v.HubunganAnggota.id, name: v.HubunganAnggota.nama});
            });
            localStorage['hubungan_anggota'] = JSON.stringify(hubungan_anggota);
        },
        error: function () {

        }
    })
}

function loginTest() {
    $.ajax({
        url: service_url + "anggotas/loginTest.json",
        type: "POST",
        data: {},
        dataType: "JSON",
        success: function (data) {
            dataLogin = data;
            if (data.response.status == 202) {
                loginSuccess(data.response.data);
                console.log("login success");
            } else {
                alert("Login gagal");
                console.log("login fail");
            }
        },
    })
}