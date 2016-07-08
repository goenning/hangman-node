var hangmanApp = angular.module('hangmanApp', []);

hangmanApp.controller('HangmanController', ['$scope', '$http', function($scope, $http) {

  $scope.guesses = [ ];
  $scope.letters = [ ];

  $scope.inProgress = function() { return $scope.status === 1; };
  $scope.won = function() { return $scope.status === 2; };
  $scope.failed = function() { return $scope.status === 3; };

  $scope.request = function(url, data, cb) {
    return $http.post(url, data).then(function(res) {
      if (res.data.success)
        cb(res.data);
      else
        $scope.error = res.data.error;
      return res.data;
    }).catch(function(e) {
      $scope.error = 'Something went wrong, maybe the server is down.';
    });
  };

  $scope.guessed = function(letter) {
    return $scope.guesses.indexOf(letter) >= 0;
  };

  $scope.cssForLetter = function(letter) {
    if ($scope.letters.indexOf(letter) >= 0)
      return 'btn-success';

    if ($scope.guesses.indexOf(letter) >= 0)
      return 'btn-danger';

      return 'btn-info';
  };

  $scope.refresh = function(data) {
    $scope.id = data.id;
    $scope.word = data.word;
    $scope.status = data.status;
    $scope.guesses = data.guesses;
    $scope.letters = data.letters.join(' ');
    $scope.remainingMissesCount = data.remainingMissesCount;
    $scope.error = undefined;
    return data;
  };

  $scope.startNewGame = function() {
    $scope.request('/game/new', { id: $scope.id, word: $scope.newWord }, $scope.refresh).then(function(){
      $scope.newWord = '';
    });
  };

  $scope.guessLetter = function(letter, $event) {
    $scope.request('/game/guess', { id: $scope.id, letter: letter }, $scope.refresh);
  };

}]);
