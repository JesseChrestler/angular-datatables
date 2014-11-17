(function(){
  "use strict";
  angular.module( "appSample", ['app.datatable'])
  .controller( "AppController", function AppCtrl ( $scope, $http ) {
    $scope.reload=function(){
      //$scope.myTable.reload();
      $scope.myTable.reload();
    };
    $scope.getGridData = function(serverData, update){
      $http.get("app/data.json").success(function(response){
        update(response);
      })
      
    };

    $scope.getTestData = function(serverData, update){
      update([{
        "id":1,
        "Name" : "Tom",
        "Salary" : "55432.24"
      },{
        "id":2,
        "Name" : "Joe",
        "Salary" : "34033.54"
      },{
        "id":3,
        "Name" : "Bob",
        "Salary" : "22123"
      }]);
    };
  });

})();