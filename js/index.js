
var app = angular.module('kaifanla',['ng','ngRoute']);

app.config(function ($routeProvider) {

  $routeProvider
    .when('/start',{
      templateUrl:'tpl/start.html'
    })
    .when('/main',{
      templateUrl:'tpl/main.html',
      controller:'mainCtrl'
    })
    .when('/detail',{
      templateUrl:'tpl/detail.html'
    })
    .when('/detail/:did',{
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .when('/order',{
      templateUrl:'tpl/order.html'
    })
    .when('/order/:did',{
      templateUrl:'tpl/order.html',
      controller:"orderCtrl"
    })
    .when('/myOrder',{
      templateUrl:'tpl/myOrder.html',
      controller:'myOrderCtrl'
    })
    .otherwise({redirectTo:'/start'})

});

app.controller('parentCtrl',
  ['$scope','$location', 
    function ($scope,$location) {
      $scope.jump = function (arg) {
        $location.path(arg);
      }
    }]);


//声明控制器 main.html
app.controller('mainCtrl',['$scope','$http',
  function($scope,$http){

    $scope.hasMore = true;

    $http.get('data/dish_getbypage.php')
      .success(function (data) {
        $scope.dishList = data;
    });
    
    $scope.loadMore = function () {
      $http.get('data/dish_getbypage.php?start='+$scope.dishList.length)
        .success(function (data) {
          $scope.dishList=$scope.dishList.concat(data);
          if(data.length < 5)
          {
            $scope.hasMore = false;
          }
        });
    };
    
    $scope.$watch('kw', function () {
      if($scope.kw)
      {
        $http.get('data/dish_getbykw.php?kw='+$scope.kw)
          .success(function (data) {
            $scope.dishList = data;
          });
      }
    });

}]);

//声明控制器 detail.html
app.controller('detailCtrl',
  ['$scope','$http','$routeParams',
    function($scope,$http,$routeParams){
      $http.get('data/dish_getbyid.php?id='+$routeParams.did)
        .success(function (data) {
          $scope.dish = data[0];
        })
    }]);

//声明控制器 order.html
app.controller('orderCtrl',
  ['$scope','$http','$routeParams','$rootScope',
    function($scope,$http,$routeParams,$rootScope){
      $scope.order = {'did':$routeParams.did};
      $scope.submitOrder = function () {
        //console.log($scope.order);
        console.log($.param($scope.order));
        $http.get('data/order_add.php?'+$.param($scope.order))
          .success(function (data) {
            //console.log(data);
            if(data[0].msg == 'success')
            {
              $rootScope.phone = $scope.order.phone;
              $scope.succMsg = "订餐成功，订单编号为"+data[0].oid;
            }
            else
            {
              $scope.errMsg = '下单失败';
            }
          })

      }

    }]);

//声明控制器 myOrder.html
app.controller('myOrderCtrl',
  ['$scope','$http','$rootScope',
    function ($scope,$http,$rootScope) {
      //$rootScope.phone
      $http
        .get('data/order_getbyphone.php?phone='+$rootScope.phone)
        .success(function (data) {
          //console.log(data);
          $scope.orderList = data;
        })
    }]);











