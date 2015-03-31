angular.module('starter.controllers', [])

.controller('RegisterCtrl', function ($scope, $state, $ionicLoading,$rootScope) {

  localStorage.setItem("points", "0");
  localStorage.removeItem("questionsAnswered");
  //localStorage.setItem("registered", "false");

  $scope.user = {};
  $scope.error = {};
  //var registered = localStorage.getItem("registered");
  var answeredAllQuestions = localStorage.getItem("answeredAllQuestions");

  console.log("in registered");

  //console.log("registered : " + registered + " answeredAllQuestions " + answeredAllQuestions);

  /*if ( registered == "true" )
  {
      //console.log("here registered true");
      if ( answeredAllQuestions == null || answeredAllQuestions == false )
      {
          //console.log("here go to quiz");
          $state.go('tab.quiz', {clear: true});
      }
      else
      {
          $state.go('score', {clear: true});
      }
  }
  else
  {*/
    $scope.register = function () {

      $ionicLoading.show({
        template: 'Inscription en cours...'
      });

      //console.log("username : "  + $scope.user.username + " email " + $scope.user.email);

      if ( (typeof $scope.user.username === "undefined" && typeof $scope.user.email === "undefined") || ($scope.user.username == "" && $scope.user.email == "") )
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un username & un email';
          $scope.$apply();
      }
      else if (typeof $scope.user.email === "undefined" || $scope.user.email == "")
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un email';
          $scope.$apply();
      }
      else if ( typeof $scope.user.username === "undefined" || $scope.user.username == "")
      {
          $ionicLoading.hide();
          $scope.error.message = 'Veuillez saisir un username';
          $scope.$apply();
      }
      else // The user can be registered
      {
          var user = new Parse.User();
          user.set("username", $scope.user.username);
          user.set("password", "solucom");
          user.set("email", $scope.user.email);
          localStorage.setItem("email", $scope.user.email);

          user.signUp(null, {
            success: function(user) {
              $ionicLoading.hide();
              $rootScope.user = user;
              //localStorage.setItem("registered", "true");

              Parse.User.logIn($scope.user.username, "solucom", {
                success: function(user) {
                  // Do stuff after successful login.
                },
                error: function(user, error) {
                  // The login failed. Check error to see why.
                }
              });

              $state.go('tab.quiz', {clear: true});
            },
            error: function(user, error) {
              $ionicLoading.hide();
              if (error.code === 125) {
                $scope.error.message = 'Veuillez saisir une adresse mail valide';
              } else if (error.code === 202) {
                $scope.error.message = 'Ce username est déjà utilisé';
              } else {
                $scope.error.message = error.message;
              }
              $scope.$apply();
            }
          });
      }
    };
  //}
})

.controller('QuizCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $ionicModal, $rootScope, $timeout) {

  // Hide block or answer and contribution button
  $scope.questionBlockAnswer = false;
  $scope.questionContribution = "hide";

  $ionicLoading.show({
    template: 'Chargement...'
  });

  // Modify contains prototype to check if an object is contained in an array
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  }

  $scope.saveAnswerToQuestion = function(data) {
    var a;
    //is anything in localstorage?
    if (localStorage.getItem('questionsAnswered') === null) {
        a = [];
    } else {
         // Parse the serialized data back into an array of objects
         a = JSON.parse(localStorage.getItem('questionsAnswered'));
     }
     // Push the new data (whether it be an object or anything else) onto the array
     a.push(data);
     // Alert the array value
     console.log("In questions answered : " + a);  // Should be something like [Object array]
     // Re-serialize the array back into a string and store it in localStorage
     localStorage.setItem('questionsAnswered', JSON.stringify(a));
  };

  $scope.getQuestion = function() {

    var questionObj = Parse.Object.extend("Question"),
        questionCount = 4,
        randomQuestion = 0,
        randomQuery = new Parse.Query(questionObj);

    if ( typeof localStorage["questionsAnswered"] === "undefined" )
    {
        randomQuestion = Math.floor(Math.random() * questionCount) + 1;
    }
    else
    {
        $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);
        console.log("in GetQuestion $scope.questionsAnswered.length "  + $scope.questionsAnswered.length + " $scope.questionsAnswered value " + $scope.questionsAnswered);
    }

    if ( typeof $scope.questionsAnswered === "undefined" || $scope.questionsAnswered.length == 0 ) // Never answered
    {
        randomQuestion = Math.floor(Math.random() * questionCount) + 1;
    }
    else if ( $scope.questionsAnswered.length == 4 ) // Last question
    {
        randomQuestion = 5;
    }
    else if ( $scope.questionsAnswered.length == 5 ) // Last question
    {
        $state.go('tab.leaderboard', {clear: true});
    }
    else // In between
    {
        console.log("in between");
        $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

        for (var i = 0 ; i < questionCount ; i++ )
        {
            randomQuestion = Math.floor(Math.random() * questionCount) + 1;

            console.log("randomQuestion " + randomQuestion);
            console.log("contains " + $scope.questionsAnswered.contains(randomQuestion));

            if ( $scope.questionsAnswered.contains(randomQuestion.toString()) ) // already answered
            {
                console.log("already answered loop");
            }
            else
            {
                break;
            }
        }
    }

    randomQuery.equalTo("idQuestion", randomQuestion); // Specify the question id
    randomQuery.limit(1);
    randomQuery.find().then(function(results) {

      var obj = results[0]; // Get the only object

      // Set new values
      localStorage.setItem("idQuestion", obj.get('idQuestion'));
      localStorage.setItem("title", obj.get('title'));
      localStorage.setItem("text", obj.get('text'));
      localStorage.setItem("asw1", obj.get('asw1'));
      localStorage.setItem("asw2", obj.get('asw2'));
      localStorage.setItem("asw3", obj.get('asw3'));
      localStorage.setItem("asw4", obj.get('asw4'));
      localStorage.setItem("goodAnswerIndex", obj.get('goodAnswerIndex'));
      localStorage.setItem("wrongAnswer", obj.get('wrongAnswer'));
      localStorage.setItem("nameConsultant", obj.get('nameConsultant'));

      $scope.idQuestion = localStorage.getItem("idQuestion"),
      $scope.titleQuestion = localStorage.getItem("title"),
      $scope.text = localStorage.getItem("text"),
      $scope.asw1 = localStorage.getItem("asw1"),
      $scope.asw2 = localStorage.getItem("asw2"),
      $scope.asw3 = localStorage.getItem("asw3"),
      $scope.asw4 = localStorage.getItem("asw4"),
      $scope.goodAnswerIndex = localStorage.getItem("goodAnswerIndex"),
      $scope.wrongAnswer = localStorage.getItem("wrongAnswer");
      $scope.nameConsultant = localStorage.getItem("nameConsultant");

      if ( $scope.idQuestion == 5 )
      {
        $scope.questionContribution = "show";
      }
      else
      {
        $scope.questionContribution = "hide";
        $scope.questionBlockAnswer = true;
      }

      $scope.$apply(); // Render view and apply data modification

      $ionicLoading.hide();

    }, function(error) {
      console.log("Error retrieving questions!");
    });
  };

  $scope.getQuestion();

  $scope.verifyResult = function(itemAnswer) {

    console.log("$scope.idQuestion " + $scope.idQuestion);

    // Add question answered to array
    $scope.saveAnswerToQuestion($scope.idQuestion);
    $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

    console.log("$scope.questionsAnswered.length "  + $scope.questionsAnswered.length + " $scope.questionsAnswered value " + $scope.questionsAnswered[0]);
    console.log("idQuestion " + $scope.idQuestion + " title " + $scope.titleQuestion + "\ngoodAnswerIndex " + $scope.goodAnswerIndex + "\nwrongAnswer " + $scope.wrongAnswer);

    // Good answer
    if ( itemAnswer == $scope.goodAnswerIndex )
    {
        $scope.answerType = 'Bonne réponse';
        $scope.answerText = 'Vous gagnez 10 points !';
        $scope.classAnswerModal = '#66cc33';
        $scope.data = {};

        $ionicModal.fromTemplateUrl('templates/modal-checkConsultant.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          // Add points
          var points = parseInt(localStorage.getItem("points"));
          localStorage.setItem("points", points + 10);

          console.log("Points : " + localStorage.getItem("points"));

          $scope.modal = modal;
          $scope.openModal();
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
    }
    else // Wrong answer
    {
        $scope.answerType = 'Mauvaise réponse';
        $scope.answerText = $scope.wrongAnswer;
        $scope.classAnswerModal = '#ef4e3a';
        $scope.data = {};

        console.log("classAnswerModal " + $scope.classAnswerModal);

        $ionicModal.fromTemplateUrl('templates/modal-checkConsultant.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.openModal();
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
    }

  };

  $scope.nextQuestion = function() {

    console.log("codeNextQuestion " + $scope.data.codeNextQuestion);

    if ( $scope.data.codeNextQuestion == "2014nxt" )
    {
        // Add points
        var points = parseInt(localStorage.getItem("points"));
        localStorage.setItem("points", points + 10);

        var alertPopup = $ionicPopup.alert({
              template: '<p align="center" class="balanced" style="font-size:18px;color:#66cc33;">Vous avez gagné 10 points grâce à cet échange!</p>',
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-dark',
                  onClick: function(e) {

                  }
                },
              ]
            });

        alertPopup.then(function(res) {
            $scope.closeModal();
            $state.go($state.current, {}, {reload: true});
            $scope.$apply();
        });
    }
    else
    {
        $scope.closeModal();
        $state.go($state.current, {}, {reload: true});
        $scope.$apply();
    }
  };

  $scope.sendContribution = function() {

    $scope.data = {};

    console.log("$scope.idQuestion " + $scope.idQuestion);

    // Add question answered to array
    $scope.saveAnswerToQuestion($scope.idQuestion);
    $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

    var myPopup = $ionicPopup.show({
          title: '<h3>Merci!</h3>',
          template: '<textarea ng-model="data.contributionText" placeholder="Une idée ?"></textarea>',
          scope: $scope,
          buttons: [
            {
              text: '<b>Envoyer</b>',
              type: 'button-dark',
              onClick: function(e) {
                return $scope.data.contributionText;
              }
            },
          ]
        });

    myPopup.then(function(res) {
      var Contribution = Parse.Object.extend("Contribution");
      var contribution = new Contribution();
      var currentUser = Parse.User.current();

      contribution.set("email", currentUser.get("email"));
      contribution.set("text", $scope.data.contributionText);

      console.log("contributionText ", $scope.data.contributionText);

      if ( typeof $scope.contributionText != "undefined" )
      {
          // Add points
          var points = parseInt(localStorage.getItem("points"));
          localStorage.setItem("points", points + 10);

          console.log("Points : " + localStorage.getItem("points"));
      }

      contribution.save(null, {
        success: function(result) {
          // Execute any logic that should take place after the object is saved.
          console.log('New object created with objectId: ' + result.id);
          $state.go('score', {clear: true});
        },
        error: function(result, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
    });
  };

})

.controller('LeaderboardCtrl', function($scope, $state, $stateParams,$ionicLoading, $rootScope) {

  //localStorage.setItem("points", "0");
  //localStorage.removeItem("questionsAnswered");
  //localStorage.setItem("registered", "false");

  // Security access to the app
  /*if ( localStorage.getItem("registered") == "false" )
  {
      $state.go('register', {clear: true});
  }*/

  $ionicLoading.show({
    template: 'Chargement...'
  });

  var userQuery = new Parse.Query(Parse.User);
  $scope.users = [];

  userQuery.descending("score"); // Sort from best to lowest
  userQuery.find().then(function(results) {

    for (var i = 0 ; i < results.length ; i ++) // Get all users
    {
      var obj = results[i];

      $scope.users.push({
        username :  obj.get('username'),
        score: obj.get('score'),
        rank: i+1
      });
    }
    $scope.$apply();

    $ionicLoading.hide();

  }, function(error) {
    console.log("Error retrieving questions!");
  });

  $scope.refreshLeaderboard = function () {
    $state.go($state.current, {}, {reload: true});
    $scope.$apply();
  };

})

.controller('AboutCtrl', function($scope, $ionicPopup, $state) {

  //localStorage.setItem("points", "0");
  //localStorage.removeItem("questionsAnswered");
  //localStorage.setItem("registered", "false");

  // Security access to the app
  /*if ( localStorage.getItem("registered") == "false" )
  {
      $state.go('register', {clear: true});
  }*/

  $scope.feedback = function(itemAnswer) {

    $scope.data = {};

    var alertPopup = $ionicPopup.alert({
          title: '<h3>Vos impressions</h3>',
          template: '<textarea ng-model="data.feedbackText" placeholder="Commentaires" style="height:200px;"></textarea>',
          scope: $scope,
          buttons: [
            {
              text: '<b>Envoyer</b>',
              type: 'button-dark',
              onClick: function(e) {
                return $scope.data.feedbackText;
              }
            },
          ]
        });

    alertPopup.then(function(res) {

      var Feedback = Parse.Object.extend("Feedback");
      var feedback = new Feedback();
      var currentUser = Parse.User.current();

      feedback.set("text", $scope.data.feedbackText);
      feedback.set("email", currentUser.get("email"));

      feedback.save(null, {
        success: function(result) {
          // Execute any logic that should take place after the object is saved.
          console.log('New object created with objectId: ' + result.id);
        },
        error: function(result, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });

    });

  };

})

.controller('ScoreCtrl', function($scope, $state) {

  // Security access to the app
  /*if ( localStorage.getItem("registered") == "false" )
  {
      $state.go('register', {clear: true});
  }*/

  //alert("score " + localStorage.getItem("points"));

  $scope.score = localStorage.getItem("points");

  var currentUser = Parse.User.current();

  currentUser.set("score", parseInt($scope.score));

  setTimeout(function(){

      Parse.Cloud.run("sendMail", { score : $scope.score, email : currentUser.get("email"), username : currentUser.get("username") }, {
        success: function(ratings) {
          console.log("sendMail");
        },
        error: function(error) {
          console.log(error.message);
        }
      });

  }, 3000);

  currentUser.save(null, {
    success: function(result) {
      // Execute any logic that should take place after the object is saved.
      console.log('New object created with objectId: ' + result.id);
    },
    error: function(result, error) {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    }
  });

  $scope.goToLeaderboard = function () {
    $state.go('tab.leaderboard', {clear: true});
  };

})

.controller('tabsCtrl', function($scope, $state) {

  $scope.endGame = function(){

    if ( typeof localStorage["questionsAnswered"] === "undefined" )
    {
        return "ng-show";
    }

    $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

    if ( $scope.questionsAnswered.length == 5 ) {
      return "ng-hide";
    } else {
      return "ng-show";
    }
  }

});
