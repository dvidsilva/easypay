angular.module('starter').controller('profileController', function () {});


angular.module('starter').directive('newCard', function () {
  var template = [""];
  template.push('<ion-view view-title="Add Card">');
  template.push('  <ion-content>');
  template.push('    <p><strong>Please enter your card information</strong></p>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function () {
    function tokenize() {
      var publicKey = setPublicKey('bc397f1a-4a97-4022-a31d-ef2060a771f8');
      var response = tokenizeCard({
        "publicKey": publicKey,
        "card": {
          "number": document.getElementById('cc_number').value,
          "cvv": document.getElementById('cc_cvv').value,
          "expirationDate": document.getElementById('cc_expiration').value,
          "firstName": document.getElementById('first_name').value,
          "lastName": document.getElementById('last_name').value,
          "address": {
            "zip": document.getElementById('zip').value
          }
        },
        "addToVault": true,
        "developerApplication": {
          "developerId": 8005207,
          "version": '1.2'
        }
      }).done(function (result) {

        var responseObj = $.parseJSON(JSON.stringify(result));

        if (responseObj.success) {
          alert(responseObj.token);
          // do something with responseObj.token
        } else {
          alert("token was not created");
          // do something with responseObj.message

        }

      }).fail(function () {
        alert("error");
        // an error occurred
      });
    }
  };

  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'newCrd',
    replace: true,
    restrict : 'E'
  };
});
