var app = angular.module("review", ["ngResource", "ngRoute"]);

app.factory('placesService', function ($resource) {
    return $resource('/api/Places/:id',
        { id: "@Id" },
        {
            update: { method: 'PUT' },
            
        });
});

app.factory('reviewsService', function ($resource) {
    return $resource('api/Reviews/:id',
        { id: '@Id' },
        {
            update: { method: 'PUT' },
            
        });
});

app.controller("mainController", function ($scope, placesService, $window) {
    $scope.places = placesService.query();
    

    $scope.calculateAverage = function(review){ 
        var sum = 0.0;
        for (var i = 0; i < review.length; i++) {
         sum += parseInt(review[i].Rate, 10); //don't forget to add the base 
        }
        var avg
        if (review.length == 0) {
            avg = 0
        }else{
         avg=sum/review.length;
        }
        return avg.toFixed(2);
    };
    $scope.Redirect = function (place) {
        //redirectTo: "/"
        $window.location.href = "/#details/" + place.Id;
    };

});

app.controller("placeController", function ($scope, placesService, $window) {
    $scope.title = '';
    $scope.errors = [];
    $scope.places = placesService.query();
    $scope.place = {
        Id: 0,
        Name: '',
        Type:''
    }
    $scope.deletePlace = function (place) {
        placesService.remove(place, $scope.refreshData, $scope.errorMessage);
    };

    $scope.Redirect = function (place) {
        //redirectTo: "/"
        $window.location.href = "/#details/" + place.Id;
    };

    $scope.refreshData = function () {
        $scope.places = placesService.query();
        $("#modal-dialog").modal("hide");
    };

    $scope.showUpdateDialog = function () {
        $scope.clearErrors();
        $scope.title = 'Update Place';
        $("#modal-dialog").modal("show");
    };

    $scope.showAddDialog = function () {
        $scope.clearErrors();
        $scope.clearCurrentPlace();
        $scope.title = 'Add Place';
        $("#modal-dialog").modal("show");
    };

    $scope.savePlace = function () {
        
        if($scope.place.Id > 0){
            placesService.update($scope.place, $scope.refreshData, $scope.errorMessage)
        }else{
            placesService.save($scope.place, $scope.refreshData,$scope.errorMessage);}
        //$scope.clearCurrentPlace();
    };

    $scope.clearErrors = function () {
        $scope.errors = [];
    };

    $scope.selectPlace = function (place) {
        $scope.place = place;
        $scope.showUpdateDialog();
    }

    $scope.clearCurrentPlace = function () {
        $("#modal-dialog").modal("hide");
        $scope.place = {
            Id: 0,
            Name: '',
            Type: ''
        };
    };

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };
});

app.controller('detailsController', function ($scope, reviewsService, placesService, $routeParams, $http,$sce) {
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer({safe:true});
   // var parsed = reader.parse("> Hello world");
    $scope.reader = new commonmark.Parser(); // parsed is a 'Node' tree
    // transform parsed if you like...
    //var result = writer.render(parsed); // result is a String
    var PlaceId = $routeParams.Id;
    //$scope.place = $http.get("/api/Places/" + PlaceId);
    $scope.place = placesService.get({ Id: $routeParams.Id });
    $scope.calculateAverage = function (review) {
        var sum = 0.0;
        for (var i = 0; i < review.length; i++) {
            sum += parseInt(review[i].Rate, 10); //don't forget to add the base 
        }
        var avg
        if (review.length == 0) {
            avg = 0
        } else {
            avg = sum / review.length;
        }
        return avg.toFixed(2);
    };
    
    $scope.name = function (place) {
        var parsed = reader.parse("## " + place.Name);
        parsed = writer.render(parsed);
        $scope.nameB = $sce.trustAsHtml(parsed);

        var type = reader.parse("*Type:**" + place.Type + "***");
        type = writer.render(type);
        $scope.typeB = $sce.trustAsHtml(type);

        var promedio = $scope.calculateAverage(place.Review);
        promedio = reader.parse("*Average Rate **" + promedio + "***");
        promedio = writer.render(promedio);
        $scope.promedio = $sce.trustAsHtml(promedio);

    }

    $scope.showReview = function (review) {
        var reviewer = reader.parse("Reviewer: **" + review.Reviewer+"**");
        reviewer = writer.render(reviewer);
        $scope.reviewer = $sce.trustAsHtml(reviewer);

        var rate = reader.parse("*Rate: **" + review.Rate + "***");
        rate = writer.render(rate);
        $scope.rate = $sce.trustAsHtml(rate);

        var comments = reader.parse("> " + review.Comments);
        var comenttitle = reader.parse("*Comments:*");
        comenttitle = writer.render(comenttitle);
        comments = writer.render(comments);
        $scope.comments = $sce.trustAsHtml(comenttitle + comments);

    }
    
});

app.controller("reviewController", function ($scope, reviewsService, placesService) {
    $scope.title = '';
    $scope.errors = [];
    $scope.reviews = reviewsService.query();
    $scope.places = placesService.query();
    $scope.review = {
        Id: 0,
        Reviewer: '',
        Rate: 0,
        Comments: '',
        PlaceId: 0
    };

    $scope.deleteReview = function (review) {
        reviewsService.remove(review, $scope.refreshData, $scope.errorMessage);
    };
    $scope.refreshData = function () {
        $scope.reviews = reviewsService.query();
        $("#modal-dialog").modal("hide");
    };
    $scope.showUpdateDialog = function () {
        $scope.clearErrors();
        $scope.title = 'Update review';
        $("#modal-dialog").modal("show");
    };

    $scope.showAddDialog = function () {
        $scope.clearErrors();
        $scope.clearCurrentReview();
        $scope.review = {
            Id: 0,
            Reviewer: '',
            Rate: 0,
            Comments: '',
            PlaceId: $scope.places[0].Id
        };
        $scope.title = 'Add review';
        $("#modal-dialog").modal("show");
    };
    $scope.saveReview = function () {
        if ($scope.review.Id > 0) {
            reviewsService.update($scope.review, $scope.refreshData, $scope.errorMessage)
        } else {
            reviewsService.save($scope.review, $scope.refreshData, $scope.errorMessage);
        }
        //$scope.clearCurrentReview();

    };
    $scope.clearErrors = function () {
        $scope.errors = [];
    };
    $scope.selectReview = function (review) {
        $scope.review = review;
        $scope.showUpdateDialog();
    };
    $scope.clearCurrentReview = function () {
        $("#modal-dialog").modal("hide");

        $scope.review = {
            Id: 0,
            Reviewer: '',
            Rate: 0,
            Comments: '',
            PlaceId: 0
        };
    };
    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/Content/Views/Index.html',
            controller: 'mainController'
        })
        .when('/places', {
            templateUrl: '/Content/Views/Places.html',
            controller: 'placeController'
        })
        .when('/reviews', {
            templateUrl: '/Content/Views/Reviews.html',
            controller: 'reviewController'
        })
        .when('/details/:Id',{
            templateUrl:'/Content/Views/Details.html',
            controller:'detailsController'
        })
});