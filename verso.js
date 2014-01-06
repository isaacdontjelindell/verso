BASE_AJAX_URL = 'http://ebooks.isaacdontjelindell.com/ajax';

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
    $scope.testData = ['book1', 'book2'];
    $scope.searchResultsBookIds = [];

    $scope.search = function() {
        var searchTerm = $scope.searchText;

        $.get(BASE_AJAX_URL + '/search', {num:25, query:searchTerm}, function success (data) {
            console.log(data);
            $scope.$apply(function () {
                $scope.searchResultsBookIds = data.book_ids;
            });
        });
    }
})

.controller('BookInfoCtrl', function ($scope, $routeParams) {
    $scope.init = function () {
        console.log($routeParams.bookId);
    }
});