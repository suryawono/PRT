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

ons.ready(function () {
    menu.setSwipeable(false);
    if (localStorage['credential_email']) {
        menu.setMainPage("dashboard.html");
        menu.setSwipeable(true);
    }else{
        menu.setMainPage("login.html");
    }
})