(function($, angular, window){
    'use strict';
    /**
    * @author Jesse Chrestler (JesseChrestler@gmail.com)
    */
    angular.module('app.datatable', []).directive('table', function ($parse, $compile, $timeout) {
        return {
            restrict: 'A',
            //share scope with parent
            scope : false,
            transclude : true,
            //directive main scope.
            link: function postLink(scope, element, attrs, ctrl, transclude) {
                transclude(scope, function(clone, scope) {
                    element.append(clone);
                });
                //set a default if one isn't defined.
                if(angular.isUndefined(attrs.table)){
                    attrs.table = 'table';
                }
                if(angular.isUndefined(attrs.local) || attrs.local !== "true"){
                    attrs.local = false;
                }else {
                    attrs.local = true;
                }

                //unfortunately element doesn't work so i have to convert it to a jquery object
                var $element = $(element[0]);
                if(!$element.is('table')){
                    throw new Error('Datatable can only be added to a table ex: <table data-table="myTable">');
                }
                //determines the columns based on the names.
                function getColumns(){
                    return $element.find('th').map(function(){
                        var column = $(this);
                        var columnData = column.data('column');
                        var classData = column.data('class');
                        var isVisible = !column.hasClass('hidden');
                        var isSortable = column.data('sortable')  !== 'false';
                        var isOrderable = column.data('orderable') !== 'false';
                        var format = column.data('format');
                        var formatFunctionName = column.data('formatfunction');
                        var defaultContent = '';
                        if(columnData === undefined){
                            isSortable = false;
                            isOrderable = false;
                            if(column.text() === '' && angular.isUndefined(format) && angular.isUndefined(formatFunctionName)){
                                defaultContent = '';
                            }
                        }
                        return {
                            data : columnData,
                            defaultContent : defaultContent,
                            visible : isVisible,
                            sortable : isSortable,
                            orderable : isOrderable,
                            className : classData
                        };
                    }).toArray();
                }
                //base call for ajax might need to prune the search data to a simple object.
                function ajax(serverData, callback, settings){
                    var getDataSource = scope[attrs.source];
                    if(angular.isDefined(getDataSource) && typeof getDataSource === 'function' ){
                        scope[attrs.source](serverData, processData(callback), settings);
                    }
                }
                //all data will be processed in this function
                function processData(callback){
                    return function(data){
                        //here we can evaluate the data from the callback before we pass it to the datatables.
                        var response;
                        if(angular.isArray(data)){
                            //this is to handle simple cases where we only pass an array of data.
                            response = {
                                draw:1,
                                recordsTotal:data.length,
                                recordsFiltered:data.length,
                                data:data
                            };
                        }
                        else{
                            response = data;
                        }
                        callback(response);
                    };
                }
                //rows that are created call this. this let's us do some cool stuff on a per row basis
                function processRow(row, data, index){
                   var columns = $(row).find('td');
                   for(var i = 0; i < columns.length;i++){
                        var column = $(columns[i]);
                        var header = $element.find('th').eq(i);
                        //we need to figure out if we have a format
                        var format = header.data('format');
                        var formatFunctionName = header.data('formatfunction');
                        if(angular.isDefined(format) || angular.isDefined(formatFunctionName)){
                            var formatFunction = scope[formatFunctionName];
                            if(angular.isDefined(formatFunction) && typeof formatFunction === 'function'){
                                column.html(formatFunction(row, data, index));
                            }else{
                                column.html(format);    
                            }
                        }
                   }
                   data.index = index;
                   applyTokens(row, data);
                   $compile(row)(scope);
                   return row;
                }
                function applyTokens(row, data){
                    var html = row.innerHTML;
                    var matches = html.match(/\{\{([^}]+)\}\}/g);
                    if(matches !== null){
                        for(var i = 0; i < matches.length;i++){
                            var match = matches[i];
                            var name = match.replace(/[\{\}]/g, '');
                            var val = data[name];
                            if(angular.isDefined(val)){
                                html = html.replace(match, val);
                            }
                        }
                    }
                    $(row).html(html);
                }
                //instantiate the datatable plugin with all configuration options
                var dt = $element.DataTable({
                    //ajax: 
                    //dom : template,
                    processing : true,
                    serverSide : !attrs.local,
                    ajax : ajax,
                    columns:getColumns(),
                    rowCallback:processRow
                });
                
                var table = $('[data-table="' + attrs.table + '"]');
                var lastSelected;
                //live binding for any elements added after rendering.
                //this event handles all section types (shift, control and regular click)
                table.on('click', 'tr', function(e){
                    var shiftKey = e.shiftKey;
                    var ctrlKey = e.ctrlKey;
                    var isMultipleSelect = attrs.selection === 'multiple';

                    if(!isMultipleSelect || (!shiftKey && !ctrlKey)){
                        var selected = table.find('.selected');
                        if(selected.length == 1 && $(this).hasClass('selected')){
                            $(this).removeClass('selected');
                        }else{
                            selected.removeClass('selected');
                            $(this).addClass('selected');
                        }
                    }else if(isMultipleSelect && shiftKey){
                        //this is to clear the selection range so that we dont' accidently select the text while changing selection
                        window.document.getSelection().removeAllRanges();
                        if(angular.isDefined(lastSelected)){
                            var lastIndex = table.find('tr').index(lastSelected);
                            var thisIndex = table.find('tr').index(this);
                            var start = lastIndex+1;
                            var end = thisIndex;
                            if(lastIndex > thisIndex){
                                start = thisIndex;
                                end = lastIndex-1;
                            }
                            if(lastIndex !== thisIndex){
                                var rows = table.find('tr');
                                for(var i = start; i <= end;i++){
                                    $(rows[i]).toggleClass('selected');
                                }
                            }else{
                                $(this).toggleClass('selected');
                            }
                        }else{
                            $(this).toggleClass('selected');
                        }
                        
                    }else if (isMultipleSelect && ctrlKey){
                        $(this).toggleClass('selected');
                    }
                    lastSelected = $(this);
                });

                //expose functions to controller (we only want to expose certain things)
                scope[attrs.table] = {
                    refresh : function(){
                        dt.ajax.reload();
                    }, 
                    getSelected : function(){
                        return dt.rows('.selected').data();
                    },
                    setColumnVisibility:function(index, isVisible){
                        return dt.column(index).visible(isVisible);
                    }
                };


            }
        };
    });
})(jQuery, angular, window);//yes jquery is a requirement of datatables, so we use it here folks.