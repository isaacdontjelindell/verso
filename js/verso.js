//BASE_AJAX_URL = 'http://ebooks.isaacdontjelindell.com/ajax';
BASE_CALIBRE_URL = 'http://localhost';
BASE_AJAX_URL = BASE_CALIBRE_URL + '/ajax';


angular.module('verso', ['ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'IndexCtrl',
            templateUrl: 'views/index.html'
        })
        .when('/search', {
            controller: 'SearchCtrl',
            templateUrl: 'views/search_results.html'
        })
        .when('/book/:bookId', {
            controller: 'BookInfoCtrl',
            templateUrl: 'views/bookinfo.html'
        })
        .when('/authors', {
            controller: 'AuthorsCtrl',
            templateUrl: 'views/authors.html'
        })
        .otherwise({
            redirectTo:'/'
        });
})

.controller('IndexCtrl', function ($scope) {
    angular.element(document).ready(function init () {
        $("form[role='search']").submit(function (event) {
            document.location.href = '/#/search?s=' + $('#srch-term').val();
            return false;
        });

    })
})

.controller('AuthorsCtrl', function($scope) {

})


.controller('SearchCtrl', function ($scope, $http, $location) {
    $scope.searchResultsBookInfo = [];
    $scope.spinnerIntervalId = null;

    $scope.goToBook = function (loc) {
        clearInterval($scope.spinnerIntervalId);
        window.location = "/#/book/" + loc;
    };

    var search = function (searchTerm) {
        if (searchTerm) {
            $("#loading-indicator").show();
            var counter = 0;
            $scope.spinnerIntervalId = setInterval(function() {
                var frames=19; var frameWidth = 30;
                var offset=counter * -frameWidth;
                document.getElementById("loading-indicator").style.backgroundPosition=0 + "px" + " " + offset + "px";
                counter++; if (counter>=frames) counter =0;
            }, 50);

            $http({method: 'GET', url: BASE_AJAX_URL + '/search', params: {num: 25, query: searchTerm}})
                .success(function (data, status, headers, config) {
                    if (data.book_ids.length == 0) {
                        $scope.searchResultsBookInfo.push({'title':'No results', 'authors':['']})
                        $("#loading-indicator").hide();
                        clearInterval($scope.spinnerIntervalId);
                    }

                    $.each(data.book_ids, function (index, item) {
                        $http({method: 'GET', url: BASE_AJAX_URL + '/book/' + item})
                            .success(function (d, s, h, c) {
                                // TODO is there any way to do this just ONCE after all results have been shown?
                                $("#loading-indicator").hide();
                                clearInterval($scope.spinnerIntervalId);
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
    // pass it to the view to build the file download links
    $scope.BASE_CALIBRE_URL = BASE_CALIBRE_URL;

    var getBookInfo = function () {
        $http({method: 'GET', url: BASE_AJAX_URL + '/book/' + $routeParams.bookId})
            .success(function (data, status, headers, config) {
                $scope.bookInfo = data;
            })
            .error(function (data, status, headers, config) {
                console.error('Shit, something broke getting book info');
            });

    };

    angular.element(document).ready(function init () {
        getBookInfo();
    });

});
