reportingList = {
    "Tahunan": 1,
    "Bulanan": 2,
    "Mingguan": 3,
    "Harian": 4
}

currentReporting = -1;

module.factory('numberService', function () {
    return{
        formatAngka: function (angka) {
            angka = angka.toString().replace(/\./g, "");
            return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        getColor: function (amount) {
            if (amount > 0) {
                return "green";
            } else if (amount < 0) {
                return "red";
            } else {
                return "";
            }
        },
        getColorPemasukan: function (amount) {
            if (amount > 0) {
                return "green";
            } else {
                return "";
            }
        },
        getColorPengeluaran: function (amount) {
            if (amount > 0) {
                return "red";
            } else {
                return "";
            }
        },
    }
})

module.filter('reverse', function () {
    return function (items) {
        return items.slice().reverse();
    };
});

module.controller('logincontroller', ['$scope', function ($scope) {
        $scope.name = '';
        $scope.email = '';

        $scope.doLogin = function () {
            login();
        }
    }]);
module.controller('registercontroller', ['$scope', function ($scope) {

        $scope.doRegister = function () {
            register();
        }
    }]);
module.controller('dashboardcontroller', ['$scope', 'numberService', function ($scope, numberService) {
        $scope.total_pemasukan = 0;
        $scope.total_pengeluaran = 0;
        $scope.total = 0;
        $scope.numberService = numberService;

        $scope.init = function () {
            buku.viewTotal(function () {
                $scope.$apply(function () {
                    $scope.total_pemasukan = totalPemasukan;
                    $scope.total_pengeluaran = totalPengeluaran;
                    $scope.total = totalPemasukan - totalPengeluaran;
                })
            });
        }
    }]);
module.controller('tambahanggotacontroller', ['$scope', function ($scope) {
        $scope.jenisanggota = jenis_anggota;
        $scope.hubungananggota = hubungan_anggota;
        $scope.defaultFormData = {
            "rumah_tangga_id": credential.rumah_tangga.id,
            "email": "",
            "jenis_anggota_id": $scope.jenisanggota[0].id,
            "hubungan_anggota_id": $scope.hubungananggota[0].id,
        };

        $scope.kirim = function () {
            $.ajax({
                type: "POST",
                url: service_url + "anggotas/add.json",
                data: $scope.formData,
                dataType: "json",
                success: function (data) {
                    if (data.response.status == 101) {
                        errorHandle(data.response.data.errors);
                    } else if (data.response.status == 200) {
                        alert("Penambahan berhasil");
                        $scope.$apply(function () {
                            $scope.reset();
                        })
                    }
                },
                error: function () {
                    alert('Tidak dapat mencapai server');
                }
            });
        }

        $scope.reset = function () {
            $scope.formData = angular.copy($scope.defaultFormData);
        }

        $scope.reset();
    }]);

module.controller('laporancontroller', ['$scope', function ($scope) {
        $scope.jeniswaktu = ['Bulanan', 'Mingguan', 'Harian'];
        $scope.rentangwaktu = [];
        $scope.entity_laporan_list = [];

        $scope.gantirentang = function () {
            switch ($scope.selectedJenis) {
                case "Tahunan":
                    $scope.rentangTahunan();
                    break;
                case "Bulanan":
                    $scope.rentangBulanan();
                    break;
                case "Mingguan":
                    $scope.rentangMingguan();
                    break;
            }
        }

        $scope.rentangBulanan = function () {
            var startyear = 2000;
            var currentyear = new Date().getFullYear();
            for (currentyear; currentyear >= startyear; currentyear--) {
                $scope.rentangwaktu.push(currentyear);
            }
            $scope.selectedRentang = $scope.rentangwaktu[0];
        }

        $scope.rentangMingguan = function () {
            $scope.rentangwaktu = ['Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November'];
            $scope.selectedRentang = $scope.rentangwaktu[0];
        }

        $scope.tampillaporan = function () {
            currentReporting = reportingList[$scope.selectedJenis];
            tahun_laporan = $scope.selectedRentang;
            setMainPage('laporanDetail.html')
        }

        $scope.selectedJenis = $scope.jeniswaktu[0];

    }]);

module.controller('anggotacontroller', ['$scope', '$http', function ($scope, $http) {
        $scope.anggotas = [];

        $scope.init = function () {
            $.ajax({
                type: "POST",
                url: service_url + "rumah_tanggas/get.json",
                data: {id: credential.rumah_tangga.id},
                dataType: "json",
                success: function (data) {
                    $scope.$apply(function () {
                        $scope.anggotas = data.response.data.Anggota;
                    });
                },
                error: function () {
                    alert('Tidak dapat mencapai server');
                }
            });
        }

        $scope.detail = function (id) {
            menu.setMainPage("editAnggota.html");
        }
    }]);

module.controller("laporandetailcontroller", ['$scope', '$http', 'numberService', function ($scope, $http, numberService) {
        $scope.bulanList = ['Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November'];
        $scope.judul_laporan = "Laporan";
        $scope.numberService = numberService;
        $scope.total_pemasukan = 0;
        $scope.total_pengeluaran = 0;

        $scope.fetchLaporan = function () {
            switch (currentReporting) {
                case reportingList['Tahunan']:
                    $scope.judul_laporan = "Laporan Tahunan";
                    break;
                case reportingList['Bulanan']:
                    $scope.judul_laporan = "Laporan Bulanan";
                    $.ajax({
                        type: "POST",
                        url: service_url + "transaksis/laporan.json",
                        data: {id: credential.anggota.id, jenis: "bulanan", tahun: tahun_laporan},
                        dataType: "json",
                        success: function (data) {
                            var root = data;
                            $scope.$apply(function () {
                                var entity_laporan_list = [];
                                var total_pemasukan = 0;
                                var total_pengeluaran = 0;
                                notEmpty = [];
                                root.response.data.transaksi.forEach(function (e) {
                                    entity_laporan_list[parseInt(e[0].bulan) - 1] = {
                                        nama: namaBulan[parseInt(e[0].bulan)],
                                        pemasukan: e[0].pemasukan,
                                        pengeluaran: e[0].pengeluaran,
                                    };
                                    total_pemasukan += parseInt(e[0].pemasukan);
                                    total_pengeluaran += parseInt(e[0].pengeluaran);
                                    notEmpty.push(parseInt(e[0].bulan) - 1);
                                })
                                for (var i = 1; i <= 12; i++) {
                                    if (notEmpty.indexOf(i - 1) == -1) {
                                        entity_laporan_list[i - 1] = {
                                            nama: namaBulan[i],
                                            pemasukan: 0,
                                            pengeluaran: 0,
                                        };
                                    }
                                }
                                $scope.entity_laporan_list = entity_laporan_list;
                                $scope.total_pemasukan = total_pemasukan;
                                $scope.total_pengeluaran = total_pengeluaran;
                            });
                        },
                        error: function () {
                            alert('Tidak dapat mencapai server');
                        }
                    });
                    break;
                case reportingList['Mingguan']:
                    $scope.judul_laporan = "Laporan Mingguan";
                    break;
                case reportingList['Harian']:
                    $scope.judul_laporan = "Laporan Harian";
                    break;
            }
        }
    }]);

ons.ready(function () {
    menu.setSwipeable(false);
    if (localStorage['credential']) {
        credential = JSON.parse(localStorage['credential']);
        jenis_anggota = JSON.parse(localStorage['jenis_anggota']);
        hubungan_anggota = JSON.parse(localStorage['hubungan_anggota']);
        init();
    } else {
        menu.setMainPage("login.html");
    }
})