/**
 * 这里是书籍列表模块
 * @type {[type]}
 */
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl',function($scope,$http,$state,$stateParams){
	$scope.filterOptions = {
		filterText: '',
		useExternalFilter: true
	};
	$scope.totalServerItems = 0;
	$scope.pageOptions = {
		pageSizes: [5,10,20],
		pageSize: 5,
		curPage: 1
	};
	$scope.setPageData = function(data,page,pageSize){
		var pageData = data.slice((page - 1) * pageSize, page * pageSize);
		$scope.books = pageData;
		$scope.totalServerItems = data.length;
		//不懂这个代码是什么意思是
		if(!$scope.$$phase){
			$scope.$apply();
		}
	};
	//这里可以根据路由上传递过来的bookType参数加载不同的数据
	$scope.getPageDataAsync = function(pageSize,page,searchText){
		setTimeout(function(){
			var data;
			if(searchText){
				var ft = searchText.toLowerCase();
				$http.get('../data/book'+$stateParams.bookType+'.json').success(function(resp){
					data = resp.filter(function(item){
						return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
					});
					$scope.setPageData(data,page,pageSize);
				});
			}else{
				$http.get('../data/book'+$stateParams.bookType+'.json').success(function(resp){
					$scope.setPageData(resp,page,pageSize);
				});
			}
		},100);
	};
	$scope.getPageDataAsync($scope.pageOptions.pageSize,$scope.pageOptions.curPage);

	$scope.$watch('pageOptions',function(newVal,oldVal){
		if(newVal !== oldVal && newVal.curPage !== oldVal.curPage){
			$scope.getPageDataAsync($scope.pageOptions.pageSize,$scope.pageOptions.curPage,$scope.filterOptions.filterText);
		}
	},true);
	$scope.$watch('filterOptions',function(newVal,oldVal){
		if(newVal !== oldVal){
			$scope.getPageDataAsync($scope.pageOptions.pageSize,$scope.pageOptions.curPage,$scope.filterOptions.filterText);
		}
	},true);
	$scope.gridOptions = {
		data: 'books',
		rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
		multiSelect: false,
		enableCellSelection: true,
		enableRowSelection: true,
		enableCellEdit: true,
		enablePinning: true,
		columnDefs: [{
			field: 'index',
			displayName: '序号',
			width: 50,
			pinnable: false,
			sortable: false
		},{
			field: 'name',
			displayName: '书名',
			enableCellEdit: true,
			width: 280
		},{
			field: 'author',
			displayName: '作者',
			enableCellEdit: true,
			width: 100
		},{
			field: 'pubTime',
            displayName: '出版日期',
            enableCellEdit: true,
            width: 100
		},{
            field: 'price',
            displayName: '定价',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'bookId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookDetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pageOptions,
        filterOptions: $scope.filterOptions
	};
});

/**
 * 这里是书籍详情模块
 * @type {[type]}
 */
var bookDetailModule = angular.module('BookDetailModule',[]);
bookDetailModule.controller('BookDetailCtrl',function($scope,$http,$state,$stateParams){
	
});