module.factory('numberService', function () {
    return{
        formatAngka: function (angka) {
            angka = angka.toString().replace(/\./g, "");
            return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }
})

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

        $scope.getColor = function (amount) {
            if (amount > 0) {
                return "green";
            } else if (amount < 0) {
                return "red";
            } else {
                return "";
            }
        }
    }]);
module.controller('tambahanggotacontroller', ['$scope', function ($scope) {
        $scope.defaultFormData = {
            "parent_email": localStorage['credential_email'],
            "email": "",
            "password": "",
            "repeat_password": "",
            "nama_depan": "",
            "nama_belakang": "",
            "alamat": "",
        };

        $scope.kirim = function () {
            $.ajax({
                type: "POST",
                url: service_url + "anggotas.json",
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
        
        $scope.reset=function(){
            $scope.formData=angular.copy($scope.defaultFormData);
        }
        
        $scope.reset();
    }]);

ons.ready(function () {
    menu.setSwipeable(false);
    if (localStorage['credential_email']) {
        menu.setMainPage("dashboard.html");
        menu.setSwipeable(true);
    } else {
        menu.setMainPage("login.html");
    }
})