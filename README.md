angular-datatables
==================

Combining AngularJS and Datatables in an expressive way. 


Implementation 
------------------------------


```
<!--HTML Setup-->
<div ng-controller="MyController">
	<table data-table="tablename" data-source="getGridData">
		<thead>
			<tr>
				<th data-format="{{firstName}} {{lastName}}">Employee Name</th>
				<th data-column="salary">Employee Salary</th>
				<th data-column="<a href='javascript:void(0);' ng-click='edit({{index}})'">Edit</th>
			</tr>
		</thead>
	</table>
</div>
```

```
//Controller Setup
.controller( "MyController", function MyController ( $scope ) {
	$scope.getGridData = function(serverData, update){
		//you could do your ajax call to get data instead of returning a local array.
		update([
		{
	        "id":1,
	        "FirstName" : "Tom",
	        "LastName" : "Jones",
	        "Salary" : "$120,800"
	    },{
	        "id":2,
	        "FirstName" : "Joe",
	        "LastName" : "Jones",
	        "Salary" : "$220,800"
	    },{
	        "id":3,
	        "FirstName" : "Bob",
	        "LastName" : "Jones",
	        "Salary" : "$75,800"
      }]);
	};
});

```

Options
----------------------

#### Table Element Attributes
>  **data-table:** data table is a name that will be used to reference the table within the controller. In the controller you can reference your data table by calling $scope.nameoftable
>
>  **data-selection:** data selection allows you to choose between multiple and single (default:multiple)
>
>  **data-source:** data source tells the datatables where to go to when it needs data. This method passes two parameters (serverdata, update). serverdata is an object with all the information about limit, order, and paging. update is a callback that expects you to pass the data so that it can be populated into the database. 
>
>  **data-local:** data local tells the datatables if your data is local or on a server. (default: false)

#### Table Header Element Attributes
>  **data-column:** data column represents the key in the object being passed back. 
>
>  **data-format:** data format let's you use angular syntax to format your columns any way you choose
>  >  **Example:** data-format="{{firstName}} {{lastName}}"
>  >
>  > **Note:** 
>  >data format doesn't currently support sorting. I will be adding this in the near future.
>  
>  **data-formatFuntion:** data format function gives you yet another way to format a given cell.

#### Datatables Exposed Functions

>  **refresh:** will call the grid to reload the data.
>
>  **getSelected:** returns the selected records.
>
>  **setColumnVisibility(index, isVisible):** hides and shows columns
