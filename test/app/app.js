(function(){
  "use strict";
  angular.module( "appSample", ['app.datatable'])
  .controller( "AppController", function AppCtrl ( $scope ) {
    $scope.reload=function(){
      //$scope.myTable.reload();
      $scope.myTable.reload();
    };
    $scope.getGridData = function(serverData, update){
      update([{
        "Name":"Tiger Nixon",
        "Position" : "System Architect",
        "Office" : "Edinburgh", 
        "Age" : "61",
        "StartDate" : "2011/01/12",
        "Salary" : "$120,800"
      },{
        "Name":"John Doe",
        "Position" : "Architect",
        "Office" : "New York", 
        "Age" : "42",
        "StartDate" : "2012/06/25",
        "Salary" : "$220,800"
      },{
        "Name":"Dave Miller",
        "Position" : "BA",
        "Office" : "Charlotte", 
        "Age" : "33",
        "StartDate" : "2008/04/12",
        "Salary" : "$75,800"
      }]);
    };

    $scope.getTestData = function(serverData, update){
      update([{
        "id":1,
        "Name" : "Tom",
        "Salary" : "$120,800"
      },{
        "id":2,
        "Name" : "Joe",
        "Salary" : "$220,800"
      },{
        "id":3,
        "Name" : "Bob",
        "Salary" : "$75,800"
      }]);
    };
  });

})();