//BASE_AJAX_URL = 'http://ebooks.isaacdontjelindell.com/ajax';
BASE_AJAX_URL = 'http://localhost/ajax';


angular.module('verso', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'SearchCtrl',
            templateUrl: 'views/search.html'
        })
        .when('/book/:bookId', {
            controller: 'BookInfoCtrl',
            templateUrl: 'views/bookinfo.html'
        })
        .otherwise({
            redirectTo:'/'
        });
})

.controller('SearchCtrl', function ($scope) {
    $scope.searchResultsBookInfo = [];

    $scope.search = function () {
        var searchTerm = $scope.searchText;

        $.get(BASE_AJAX_URL + '/search', {num:25, query:searchTerm}, function success (data) {
            console.log(data);
            $.each(data.book_ids, function (index, item) {
                $.get(BASE_AJAX_URL + '/book/' + item, function success (bookInfo) {
                    $scope.$apply(function () {
                        $scope.searchResultsBookInfo.push(bookInfo);
                    });
                });
            });
        });
    }
})

.controller('BookInfoCtrl', function ($scope, $routeParams) {
    $scope.getBookInfo = function () {

        $.get(BASE_AJAX_URL + '/book/' + $routeParams.bookId, function success (data) {
            console.log(data);
            $scope.$apply(function () {
                $scope.bookInfo = data;
            });
        });
    }
});
