angular.module('starter.controllers', [])

.controller('RegisterCtrl', function ($scope, $state, $ionicLoading,$rootScope) {

  localStorage.removeItem("questionsAnswered");
  localStorage.removeItem("questionsImgResult");
  localStorage.removeItem("questionsNameResult");
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
          $scope.error.message = 'Veuillez saisir un nom & un email';
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
          $scope.error.message = 'Veuillez saisir un nom';
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
                $scope.error.message = 'Veuillez saisir une adresse email valide';
              } else if (error.code === 202) {
                $scope.error.message = 'Ce nom est déjà utilisé';
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
  
  $scope.saveImgResultToQuestion = function(data) {
    var a;
    //is anything in localstorage?
    if (localStorage.getItem('questionsImgResult') === null) {
        a = [];
    } else {
         // Parse the serialized data back into an array of objects
         a = JSON.parse(localStorage.getItem('questionsImgResult'));
     }
     // Push the new data (whether it be an object or anything else) onto the array
     a.push(data);
     // Alert the array value
     // Re-serialize the array back into a string and store it in localStorage
     localStorage.setItem('questionsImgResult', JSON.stringify(a));
  };
  
  $scope.saveNameResultToQuestion = function(data) {
    var a;
    //is anything in localstorage?
    if (localStorage.getItem('questionsNameResult') === null) {
        a = [];
    } else {
         // Parse the serialized data back into an array of objects
         a = JSON.parse(localStorage.getItem('questionsNameResult'));
     }
     // Push the new data (whether it be an object or anything else) onto the array
     a.push(data);
     // Alert the array value
     // Re-serialize the array back into a string and store it in localStorage
     localStorage.setItem('questionsNameResult', JSON.stringify(a));
  };

  $scope.getQuestion = function() {

    var questionObj = Parse.Object.extend("Question"),
        questionCount = 3,
        choosenQuestion = 1,
        randomQuery = new Parse.Query(questionObj);

    if ( typeof localStorage["questionsAnswered"] === "undefined" )
    {
        choosenQuestion = 1;
		localStorage.setItem('questionsImgResult', JSON.stringify([]));
		$scope.questionsAnswered = JSON.parse(localStorage["questionsImgResult"]);
		localStorage.setItem('questionsNameResult', JSON.stringify([]));
		$scope.questionsAnswered = JSON.parse(localStorage["questionsNameResult"]);
    }
    else
    {
        $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);
        console.log("in GetQuestion $scope.questionsAnswered.length "  + $scope.questionsAnswered.length + " $scope.questionsAnswered value " + $scope.questionsAnswered);    }

    if ( typeof $scope.questionsAnswered === "undefined" || $scope.questionsAnswered.length == 0 ) // Never answered
    {
        choosenQuestion = 1;
    }
    else if ( $scope.questionsAnswered.length == questionCount ) // All done
    {
		$state.go('tab.end'); //
    }
    else // In between
    {
        console.log("in between");
		
        $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);
		choosenQuestion = $scope.questionsAnswered.length + 1;
    }

    randomQuery.equalTo("idQuestion", choosenQuestion); // Specify the question id
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
      localStorage.setItem("goodAnswerIndex", obj.get('goodAnswerIndex'));
      localStorage.setItem("wrongAnswer", obj.get('wrongAnswer'));
      localStorage.setItem("nameConsultantAnsw1", obj.get('nameConsultantAnsw1'));
	  localStorage.setItem("nameConsultantAnsw2", obj.get('nameConsultantAnsw2'));
	  localStorage.setItem("nameConsultantAnsw3", obj.get('nameConsultantAnsw3'));
	  localStorage.setItem("imgConsultantAnsw1", obj.get('imgConsultantAnsw1'));
	  localStorage.setItem("imgConsultantAnsw2", obj.get('imgConsultantAnsw2'));
	  localStorage.setItem("imgConsultantAnsw3", obj.get('imgConsultantAnsw3'));

      $scope.idQuestion = localStorage.getItem("idQuestion"),
      $scope.titleQuestion = localStorage.getItem("title"),
      $scope.text = localStorage.getItem("text"),
      $scope.asw1 = localStorage.getItem("asw1"),
      $scope.asw2 = localStorage.getItem("asw2"),
      $scope.asw3 = localStorage.getItem("asw3"),
      $scope.goodAnswerIndex = localStorage.getItem("goodAnswerIndex"),
      $scope.wrongAnswer = localStorage.getItem("wrongAnswer");
	  
      $scope.nameConsultantAnsw1 = localStorage.getItem("nameConsultantAnsw1");
	  $scope.nameConsultantAnsw2 = localStorage.getItem("nameConsultantAnsw2");
	  $scope.nameConsultantAnsw3 = localStorage.getItem("nameConsultantAnsw3");
	  $scope.imgConsultantAnsw1 = localStorage.getItem("imgConsultantAnsw1");
	  $scope.imgConsultantAnsw2 = localStorage.getItem("imgConsultantAnsw2");
	  $scope.imgConsultantAnsw3 = localStorage.getItem("imgConsultantAnsw3");
	  
	  $scope.nameConsultant = "";
	  $scope.imgConsultant = "";

      $scope.questionBlockAnswer = true;

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
    console.log("idQuestion " + $scope.idQuestion + " title " + $scope.titleQuestion);

    // Good answer
/*     if ( itemAnswer == $scope.goodAnswerIndex )
    { */
	$scope.answerType = 'Bonne réponse';
	$scope.answerText = '';
	$scope.classAnswerModal = '#B00058';
	$scope.data = {};
	$scope.nameConsultant = "";
	$scope.imgConsultant = "";
	
	if(itemAnswer == 0)
	{
		$scope.answer = $scope.asw1;
		$scope.nameConsultant = $scope.nameConsultantAnsw1;
		$scope.imgConsultant = $scope.imgConsultantAnsw1;
	}
	else if(itemAnswer == 1)
	{
		$scope.answer = $scope.asw2;
		$scope.nameConsultant = $scope.nameConsultantAnsw2;
		$scope.imgConsultant = $scope.imgConsultantAnsw2;
	}
	else
	{
		$scope.answer = $scope.asw3;
		$scope.nameConsultant = $scope.nameConsultantAnsw3;
		$scope.imgConsultant = $scope.imgConsultantAnsw3;
	}
	$scope.saveImgResultToQuestion($scope.imgConsultant);
	$scope.saveNameResultToQuestion($scope.nameConsultant);
	
	$ionicModal.fromTemplateUrl('templates/modal-checkConsultant.html', {
	  scope: $scope,
	  animation: 'slide-in-up',
	  backdropClickToClose: false,
	  hardwareBackButtonClose: false
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

  };

  $scope.nextQuestion = function() {
	$scope.closeModal();
	$state.go($state.current, {}, {reload: true});
	$scope.$apply();
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

.controller('AboutCtrl', function($scope, $ionicPopup, $state) {

	$scope.extfile = function() {
		var f = "../img/revue_VF.pdf";
		console.log(f);
		var ref = window.open(f, '_self', 'location=yes', 'closebuttoncaption=Return');
	  };
  
    $scope.pageLoaded = function() {
    };
	
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

.controller('EndCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicLoading, $ionicModal, $rootScope, $timeout) {
	$scope.questionsImgResult = JSON.parse(localStorage["questionsImgResult"]);
	$scope.questionsNameResult = JSON.parse(localStorage["questionsNameResult"]);
	$scope.questionsResult = {name: $scope.questionsNameResult, img: $scope.questionsImgResult};
	
	$scope.restart = function() 
	{
		var a = [];
		var currentUser = Parse.User.current();
		
		$rootScope.user = currentUser;
		
		localStorage.setItem('questionsAnswered', JSON.stringify(a));
		$scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);
		localStorage.setItem('questionsImgResult', JSON.stringify(a));
		$scope.questionsAnswered = JSON.parse(localStorage["questionsImgResult"]);
		localStorage.setItem('questionsNameResult', JSON.stringify(a));
		$scope.questionsAnswered = JSON.parse(localStorage["questionsNameResult"]);
		
		console.log($scope.questionsAnswered);
		$scope.$apply();
		
		$state.go('tab.quiz', {clear: true});
	}

})

.controller('tabsCtrl', function($scope, $state) {

  $scope.endGame = function(){

    if ( typeof localStorage["questionsAnswered"] === "undefined" )
    {
        return "ng-show";
    }

    $scope.questionsAnswered = JSON.parse(localStorage["questionsAnswered"]);

    if ( $scope.questionsAnswered.length == 3 ) {
      return "ng-hide";
    } else {
      return "ng-show";
    }
  }

});
