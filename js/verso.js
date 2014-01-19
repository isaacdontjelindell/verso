//BASE_AJAX_URL = 'http://ebooks.isaacdontjelindell.com/ajax';
BASE_AJAX_URL = 'http://localhost/ajax';


angular.module('verso', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/search', {
            controller: 'SearchCtrl',
            templateUrl: 'views/search_results.html'
        })
        .when('/book/:bookId', {
            controller: 'BookInfoCtrl',
            templateUrl: 'views/bookinfo.html'
        })
        .otherwise({
            redirectTo:'/'
        });
})

.controller('SearchCtrl', function ($scope, $http, $location) {
    $scope.searchResultsBookInfo = [];

    var search = function (searchTerm) {
        console.log(searchTerm); // TODO remove

        if (searchTerm) {
            $http({method: 'GET', url: BASE_AJAX_URL + '/search', params: {num: 25, query: searchTerm}})
                .success(function (data, status, headers, config) {
                    $.each(data.book_ids, function (index, item) {
                        $http({method: 'GET', url: BASE_AJAX_URL + '/book/' + item})
                            .success(function (d, s, h, c) {
                                $scope.searchResultsBookInfo.push(d);
                            })
                    })
                })
                .error(function (data, status, headers, config) {
                    console.error('Shit, something broke doing the search');
                });
        }
    };

    angular.element(document).ready(function init () {
        var searchTerm = $location.search().s;
        search(searchTerm);
    });

})

.controller('BookInfoCtrl', function ($scope, $routeParams, $http) {
    $scope.getBookInfo = function () {

        $http({method: 'GET', url: BASE_AJAX_URL + '/book/' + $routeParams.bookId})
            .success(function (data, status, headers, config) {
                $scope.bookInfo = data;
            })
            .error(function (data, status, headers, config) {
                console.error('Shit, something broke getting book info');
            });

    }
});
