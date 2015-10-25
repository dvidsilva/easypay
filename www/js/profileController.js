angular.module('starter').controller('profileController', function () {});

angular.module('starter').config(function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.headers.post['Cache-Control'] = 'no-cache';
  //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
});

angular.module('starter').service('User', function ($http, $q) {
  var user = this;

  var url = "http://easypay.hackership.co";

  user.saveToken = function (data) {
    if (!data) {
      return $q.reject({error: 'invaliddata'});
    }
    return $http({
      method : 'POST',
      url : url + '/user/token/new',
      data: data
    });
  };

  user.getCards = function () {
    return $http({
      method : 'POST',
      url : url + '/user/token/get/all',
    });
  };

  user.getFeed = function () {
    return $http({
      method : 'POST',
      url : url + '/user/feed/get',
    });
  };


  return user;
});

angular.module('starter').directive('newCard', function () {
  var template = [""];
  template.push('<ion-view view-title="Cards">');
  template.push('  <ion-content>');
  template.push('     <ion-list>');
  template.push('       <ion-item ng-repeat="c in card.cards">');
  template.push('         <div style="background: rgba(56, 126, 245, 0.34); padding: 4px 10px; border-radius: 5px;">');
  template.push('         <h2>{{c.firstName | capitalize}} {{c.lastName | capitalize}}</h2>');
  template.push('         <p>**** **** **** {{c.lastDigits}}</h2>');
  template.push('         <p><strong>Default</strong></p>');
  template.push('         </div>');
  template.push('       </ion-item>');
  template.push('     </ion-list>');
  template.push('     <div style="margin: 13px; 0;"><button ng-click="card.showForm = true;" ng-hide="card.showForm" class="button button-full button-positive">Add A Card</button></div>');
  template.push('     <form ng-show="card.showForm">');
  template.push('     <p><strong>Please enter your card information</strong></p>');
  template.push('     <label class="item item-input"><span class="input-label">First Name</span><input type="text" ng-model="card.new.firstName"></label>');
  template.push('     <label class="item item-input"><span class="input-label">Last Name</span><input type="text" ng-model="card.new.lasttName"></label>');
  template.push('     <label class="item item-input"><span class="input-label">Card Number</span><input type="tel" ng-model="card.new.cardNumber"></label>');
  template.push('     <label class="item item-input"><span class="input-label">CVV</span><input type="tel" ng-model="card.new.cvv" maxlength=3></label>');
  template.push('     <label class="item item-input"><span class="input-label">Expiration Date</span><input type="month" ng-model="card.new.expDate" ></label>');
  template.push('     <label class="item item-input"><span class="input-label">Zip Code</span><input type="tel" ng-model="card.new.zipCode" maxlength=5></label>');
  template.push('     <button class="button button-full button-positive" ng-click="card.addCard()">Submit</button>');
  template.push('     </form>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function (User, $log) {
    var card = this;

    card.addCard = function () {
      tokenize();
    };

    User.getCards().then( function (response) {
      card.cards = response.data;
    });

    function tokenize() {
      var publicKey = setPublicKey('bc397f1a-4a97-4022-a31d-ef2060a771f8');
      var expDate = new Date(card.new.expDate);
      expDate = ("0" + (expDate.getMonth() + 1)).slice(-2) + '/' + expDate.getFullYear();
      return tokenizeCard({
        "publicKey": publicKey,
        "card": {
          "number": card.new.cardNumber,
          "cvv": card.new.cvv,
          "expirationDate": expDate,
          "firstName": card.new.firstName,
          "lastName": card.new.lastName,
          "address": {
            "zip": card.new.zipCode
          }
        },
        "addToVault": true,
        "developerApplication": {
          "developerId": 12345678,
          "version": '1.2'
        }
      }).done(function (result) {

        var responseObj = angular.fromJson(JSON.stringify(result));

        if (responseObj.success) {
          // alert(responseObj.token);
          // do something with responseObj.token
          angular.extend(responseObj, {lastDigits : card.new.cardNumber.split(" ").pop(),
                         firstName : card.new.firstName,
                         lastName : card.new.lastName,
                         zipCode : card.new.zipCode,
                         expDate : card.new.expDate
          });
          User.saveToken(responseObj).then(function (data) {
            $log.info(data);
            card.new = {};
            card.showForm = false;
          });
        } else {
          $log.error("token was not created");
          // do something with responseObj.message
        }
      }).fail(function () {
        $log.error("token was not created");
        // alert("error");
        // an error occurred
      });
    }
  };

  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'card',
    replace: true,
    restrict : 'E'
  };
}).filter('capitalize', function() {
  return function(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  };
});

angular.module('starter').directive('feed', function () {
  var template = [];
  template.push('<ion-view view-title="Friends Activity">');
  template.push('  <ion-content>');
  template.push('     <ion-list class="feed">');
  template.push('       <ion-item ng-repeat="c in feed.list" class="item item-thumbnail-left">');
  template.push('         <img ng-src="{{c.Picture}}" class="pic">');
  template.push('         <h2>{{c.name | capitalize}} <small>at</small> {{c.location}} <small>{{c.time_ago}}</h2>');
  template.push('         <p>{{c.comment}}</p>');
  template.push('       </ion-item>');
  template.push('     </ion-list>');
  template.push('     <div style="margin: 13px; 0;"><a href="#/app/pay" style="display: block;" class="button button-full button-positive">Scan</a></div>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function (User) {
    var feed = this;

    feed.list = [];

    User.getFeed().then(function (response) {
      feed.list = response.data;
    });

    return feed;
  };
  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'feed',
    replace: true,
    restrict : 'E'
  };

});
