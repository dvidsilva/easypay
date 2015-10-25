angular.module('starter').controller('profileController1', function () {});

angular.module('starter').service('Payment', function ($http, $q) {
  var payment = this;

  var url = "http://easypay.hackership.co";

  payment.getProducts = function (company_id) {
    if (!company_id) {
      return $q.reject({error: 'invalid_id'});
    }
    return $http({
      method : 'POST',
      url : url + '/companies/get/' + company_id,
      data: {}
    });
  };

  payment.pay = function (data) {
    if (!data) {
      return $q.reject({error: 'invalid_id'});
    }
    angular.extend(data, {user_id: 'ZHZpZHNpbHZh12'});
    return $http({
      method : 'POST',
      url : url + '/payment/new',
      data: data
    });
  };

  payment.getReceipt = function (id) {
    if (!id) {
      return $q.reject({error: 'invalid_id'});
    }
    return $http({
      method : 'POST',
      url : url + '/payment/get/' + id,
    });
  };

  payment.getReceipts = function () {
    return $http({
      method : 'POST',
      url : url + '/payment/get/all',
    });
  };


  payment.saveToken = function (data) {
    if (!data) {
      return $q.reject({error: 'invaliddata'});
    }
    return $http({
      method : 'POST',
      url : url + '/user/token/new',
      data: data
    });
  };

  return payment;
});
angular.module('starter').directive('home', function () {
  var template = [];
  template.push('<ion-view view-title="Pay">');
  template.push('  <ion-content>');
  template.push('  <div class="home">');
  template.push('      <img src="img/coffe-shop.png" style="max-width: 100%; margin-top: 1em;">');
  template.push('      <p><strong>Earlz Coffee detected</strong></p>');
  template.push('     <div style="margin: 13px; 0;"><a href="#/app/menu/562cf057a4f5467906013afe" class="button button-full button-positive" style="display:block;">See Menu</a></div>');
  template.push('   </div>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function (Payment, $log) {
    var card = this;

  };

  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'card',
    replace: true,
    restrict : 'E'
  };
});
angular.module('starter').directive('menu', function () {
  var template = [];
  template.push('<ion-view class="product-list" view-title="Menu - Earlz Coffee">');
  template.push('  <ion-content>');
  template.push('  <div class="company-cover"><h1>{{menu.company.name}}</h1><h2>Menu</h2></div>');
  template.push('  <ion-list ng-class="{confirming : menu.confirming }">');
  template.push('   <ion-item ng-repeat="p in menu.products" class="item item-thumbnail-left" ');
  template.push('    ng-class="{selected: menu.selectedKeys.indexOf(p._id) > -1 }">');
  template.push('    <img ng-src="{{p.picture}}">');
  template.push('    <h2 >{{p.name}}</h2>');
  template.push('    <p class="desc">{{p.description}}</p>');
  template.push('    <p class="price">${{p.price | number:2}}</p>');
  template.push('    <button class="add" ng-click="menu.select(p)">+</button>');
  template.push('   </ion-item>');
  template.push('   </ion-list>');
  template.push('   <button ng-hide="menu.confirming" ng-click="menu.confirmSelect()" ');
  template.push('    class="button button-full button-positive">Select</button>');
  template.push('   <button ng-show="menu.confirming" ng-click="menu.pay()" ');
  template.push('    class="button button-full button-positive">Confirm ${{menu.totalPrice}}</button>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function (Payment, $log, $stateParams, $state) {
    var menu = this;

    menu.selected = [];
    menu.selectedKeys = [];

    Payment.getProducts($stateParams.id).then( function (response) {
      menu.products = response.data ? response.data.products || [] : [];
      menu.company = response.data ? response.data.company || {} : {};
    });

    menu.select = function (product) {
      var idx =menu.selectedKeys.indexOf(product._id);
      if (idx > -1) {
        menu.selectedKeys.splice(idx, 1);
        menu.selected = menu.selected.filter( function (v, i) {
          if (v._id === product._id) {
            return false;
          }
          return true;
        });
        return;
      }
      menu.selected.push(product);
      menu.selectedKeys.push(product._id);
    };

    menu.confirmSelect = function () {
      if (menu.selected.length < 1) {
        return;
      }
      menu.confirming = true;
      menu.totalPrice = 0;
      menu.selected.forEach(function (v) {
        menu.totalPrice += parseFloat(v.price);
      });
    };

    menu.pay = function () {
      Payment.pay({products: menu.selected,
                  total: menu.totalPrice, company_id: menu.company._id})
      .then( function (response) {
        console.log(response);
        menu.selected = [];
        menu.selectedKeys = [];
        menu.confirming = false;
        $state.go('app.receipt', {id: response.data._id});
      });
    };

  };

  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'menu',
    replace: true,
    restrict : 'E'
  };
});

angular.module('starter').directive('receipt', function () {
  var template = [];
  template.push('<ion-view class="product-list" view-title="Menu - Earlz Coffee">');
  template.push('  <ion-content>');
  template.push('  <div class="company-cover"><h1>Earlz Coffee</h1>');
  template.push('    <h2>Thanks for your purchase</h2>');
  template.push('    <h3>$ {{receipt.total}}</h3>');
  template.push('  </div>');
  template.push('  <ion-list ng-class="{confirming : menu.confirming }">');
  template.push('   <ion-item ng-repeat="p in receipt.products" class="item item-thumbnail-left" >');
  template.push('    <h2>{{p.name}}</h2>');
  template.push('    <p class="price">${{p.price | number:2}}</p>');
  template.push('   </ion-item>');
  template.push('   <div class="divider"></div>');
  template.push('   <ion-item  class="item item-thumbnail-left" >');
  template.push('    <h2>Subtotal</h2>');
  template.push('    <p class="price">${{receipt.total * 0.9 | number:2}}</p>');
  template.push('   </ion-item>');
  template.push('   <ion-item  class="item item-thumbnail-left" >');
  template.push('    <h2>Tax</h2>');
  template.push('    <p class="price">${{receipt.total * 0.1 | number:2}}</p>');
  template.push('   </ion-item>');
  template.push('   </ion-list>');
  template.push('  <a class="button button-full button-positive" style="display: block; "href="#/app/feed">Friends</a>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function (Payment, $log, $stateParams, $state) {
    var receipt = this;
    Payment.getReceipt($stateParams.id).then( function (response) {
      receipt.total = response.data.total;
      receipt.products = response.data.products;
    });


  };

  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'receipt',
    replace: true,
    restrict : 'E'
  };
});
angular.module('starter').directive('history', function () {
  var template = [];
  template.push('<ion-view class="history" view-title="Menu - Earlz Coffee">');
  template.push('  <ion-content>');
  template.push('  <ion-list ng-repeat="c in receipt.list">');
  template.push('   <ion-item  class="item item-thumbnail-left" >');
  template.push('    <h2>Subtotal</h2>');
  template.push('    <p class="price">${{c.total * 0.9 | number:2}}</p>');
  template.push('   </ion-item>');
  template.push('   <ion-item  class="item item-thumbnail-left" >');
  template.push('    <h2>Tax</h2>');
  template.push('    <p class="price">${{c.total * 0.1 | number:2}}</p>');
  template.push('   </ion-item>');
  template.push('   <div class="" style="margin: 1em 0; border-bottom: 1px solid black;">&nbsp;</div>');
  template.push('   </ion-list>');
  template.push('  <a class="button button-full button-positive" style="display: block; "href="#/app/feed">Friends</a>');
  template.push('  </ion-content>');
  template.push('</ion-view>');

  var controller = function (Payment, $log, $stateParams, $state) {
    var receipt = this;
    receipt.list = [];
    Payment.getReceipts().then( function (response) {
      receipt.list = response.data;
    });


  };

  return {
    template : template.join(''),
    controller : controller,
    controllerAs : 'receipt',
    replace: true,
    restrict : 'E'
  };
});


