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
        $scope.parent_email=localStorage['credential_email'];
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