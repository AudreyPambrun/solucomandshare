// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // Register users in Parse
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.quiz', {
    url: '/quiz',
    views: {
      'tab-quiz': {
        templateUrl: 'templates/tab-quiz.html',
        controller: 'QuizCtrl'
      }
    }
  })

  .state('tab.leaderboard', {
    url: '/leaderboard',
    views: {
      'tab-leaderboard': {
        templateUrl: 'templates/tab-leaderboard.html',
        controller: 'LeaderboardCtrl'
      }
    }
  })

  .state('tab.about', {
    url: '/about',
    views: {
      'tab-about': {
        templateUrl: 'templates/tab-about.html',
        controller: 'AboutCtrl'
      }
    }
  })

  .state('score', {
    url: '/score',
    templateUrl: 'templates/score.html',
    controller: 'ScoreCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/register');

})

.run(function ($state, $rootScope) {
  Parse.initialize('9ECkmaz81SlHalLV1kZAHmEUT02OPb9XL4dPfqSt', 'cRI4YU3rsri3lFjnzMtaBH321N92neAKF8LWLT6h');
  var currentUser = Parse.User.current();
  if (currentUser) {
    $rootScope.user = currentUser;
    $state.go('tab.quiz');
  }
});
