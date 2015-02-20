'use strict'

/*
	utility objects

*/
var sl_ga = (function() {

	var extract_event = function() {

		var category = $(this).data("ev-cat");
		if (!(category && category.length))
			return;

		var action = $(this).data("ev-act");
		if (!(action && action.length))
			return;

		var value = parseInt($(this).data("ev-val"));
		value = isNaN(value) ? 0 : value;

		var labels = $(this).data("ev-lbls");

		return {
			'hitType': 'event', // Required.
			'eventCategory': category, // Required.
			'eventAction': action, // Required.
			'eventLabel': labels,
			'eventValue': value
		}
	};

	var utility = {
		extract_event: extract_event
	};
	return utility;

})(this);

$(document).ready(function() {

/*
	You can define google analytics on events in this format:
	<a data-ga-ev data-ev-cat = "Leads" data-ev-act = "Call" data-ev-val = "5" data-ev-lbls = "Call - First Visit page" href = "tel:877-754-6832" class="greenHighight2">877-skin-team</a>
	where above attributes intepret following:
	1. data-ev-cat -> Data Event Category
	2. data-ev-act -> Data Event Action
	3. data-ev-val -> Data Event value
	4. data-ev-lbls -> Data Event Labels
*/
$("*[data-ga-ev]").on("click", function(event) {
	if (!ga)
		return;
	var event_obj = sl_ga.extract_event.call(this);
	ga('send', event_obj);
	return true;
});

// form on submit 
if ($('#subscriptionform').length) {
	$('#subscriptionform').on("submit", function(event) {
		event.preventDefault();
		var self = $(this);
		var ga_element = $("*[data-ga-ajx-success]", this);

		var xhr_req = $.post(self.attr("action"), self.serialize(), function(data) {
			if (data.status == "success") {

				var event_obj = extract_event.call(self);
				ga('send', event_obj);

				$(self).hide();
				$("#thanksDiv").show();
			} else
				alert("Sorry. Failed to subscribe. Please try again");
		}, "json");
		xhr_req.fail(function() {
			alert("failed to subscribe");
		});
		return false;
	});
	$('#invokeSubmit').on("keypress", function(event) {
		if (event.keyCode == 13) {
			$('#subscriptionform').submit();
		}
	});
}
// if the submission happens successful 
if ($("#close-thanksDiv").length)
	$("#close-thanksDiv").on("click", function() {
		$("#thanksDiv").hide();
		$("#subscriptionform").show().find("input[type='text'], input[type='email'], input[type = 'tel']").val("")
	});
});


//Angular snippets:
var SLWebApp = angular.module("SLWeb", ['ngResource', 'ngRoute', 'ngAnimate']).factory('requestInterceptor',[ '$q', '$rootScope',function ($q, $rootScope){
    $rootScope.loadingRequests = {global : 0};
    var incrementCount = function(loaderflag){
      $rootScope.loadingRequests.global++;
      typeof $rootScope.loadingRequests[loaderflag] != "undefined" ? $rootScope.loadingRequests[loaderflag]++ : ($rootScope.loadingRequests[loaderflag] = 1)
    };
    var decrementCount = function(loaderflag){
      $rootScope.loadingRequests.global--;
      typeof $rootScope.loadingRequests[loaderflag] != "undefined" ? $rootScope.loadingRequests[loaderflag]-- : ($rootScope.loadingRequests[loaderflag] = 1)
    };
    return {
         'request': function (config) {
                config.headers && config.headers.loaderflag ? incrementCount(config.headers.loaderflag) : '';
                return config || $q.when(config);
            },

          'requestError': function(rejection) {
              rejection.config.headers && rejection.config.headers.loaderflag ? decrementCount(rejection.config.headers.loaderflag) : '';
              return $q.reject(rejection);
          },

          'response': function(response) {
              response.config.headers && response.config.headers.loaderflag ? decrementCount(response.config.headers.loaderflag) : '';
              return response || $q.when(response);
          },

          'responseError': function(rejection) {
              rejection.config.headers && rejection.config.headers.loaderflag ? decrementCount(rejection.config.headers.loaderflag) : '';
              return $q.reject(rejection);
          }
        }
}]).directive("listenXhr",['$rootScope','$compile', '$timeout', function($rootScope, $compile, $timeout){
  //Keep listening for $rootScope.pendingRequests
  return{
    restrict : 'A',
    scope : {flag : '=', loaderType : '@'
    },
    link : function(scope, elem, attr){
      if (scope.loaderType == 'small'){
        $(elem).after($compile('<div class="new-loader" ng-show="flag > 0"><img src="images/ajax-loader-small.gif"></div>')(scope));
      } else {
        $(elem).after($compile("<div class='fc1 center1' ng-show='flag > 0'><img class='imgloader' src='/kiosk/images/ajax-loading-img.gif' style='padding-top: 12px' class = 'goright comPad'/></div>")(scope));
      }
      scope.$watch('flag', function(new_value, old_value){
        if(scope.flag > 0)
          $(elem).hide();
        else
          $(elem).show();
        $timeout(function(){scope.$apply();},0);
      });
    }
  };
}]);

SLWebApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.interceptors.push('requestInterceptor');
}]);

SLWebApp.factory("cookiemgr", [function(){
	var config = {expires : 365, path: '/'};
	if(globalvar.cookie_domain){
		config.domain = globalvar.cookie_domain;
	}
	var _set_cookie = function(key, value, conf){
		conf = conf ? conf : config;
		conf.path = "/";
		return $.cookie(key, value, conf);
	};
	var _get_cookie = function(key){
		return key ? $.cookie(key) : null;
	};
	var _remove_cookie = function(key, conf){
		//return $.cookie(key, null, {expires : -1, path : '/'});
		return $.removeCookie(key, {path : '/'});
	};

	return{
		getCookie : function(key){
			return _get_cookie(key);
		},
		setCookie : function(key, value){
			return _set_cookie(key, value);
		},
		removeCookie : function(key){
			return _remove_cookie(key);
		}
	};
}]);

SLWebApp.controller("BaseCtrl", [ '$scope', 'localCache', 'cookiemgr', '$rootScope', 'location', '$timeout', function($scope, localCache, cookiemgr, $rootScope, location, $timeout){	
	var self = this;
	var init = function(){
		$(".till-ng-loaded").removeClass("till-ng-loaded");
		location.getSortedStores(function(data){
			$timeout(function(){
				self.sorted_stores = data;
				location.getDefault(function(store){
					if(store && store.length)
						self.default_location = store;
					else{
						self.sorted_stores.length && self.sorted_stores[0].distance_details.status == "OK" ? location.setDefault(self.sorted_stores[0].name) : '';
					}
				});
			},0);
		})
	};

	this.parseJSON = function(str){
		try{
			return JSON.parse(str);
		}catch(e){
			return {"error" : "Bad JSON"};
		}
	};

	this.setDefaultLocation = function(location_name){
		location.setDefault(location_name);
	};

	this.isAjaxProgress = function(flag){
		return $rootScope.loadingRequests[flag];
	};
	init();
}]);

SLWebApp.factory("localCache", function(){
	var cache = {};
	return {
		get : function(key){
			return cache[key];
		},
		set : function(key, value){
			cache[key] = value;
			return this;
		}
	};
});

SLWebApp.factory('location', ['cookiemgr', function(cookiemgr){
	
	var stores_sorted_by_distance = [];
	var def_cookie_key = 'defstore';
	var test_origin = [34.130352, -117.708338];
	if(!geocoder)
		console.warn("Geocoder not defined. Must resolve this dependency");

	var locationfactory =  {
		getDefault : function(callback){
			var default_location = cookiemgr.getCookie(def_cookie_key);
			callback(default_location);
		},
		getSortedStores : function(callback){
			if(stores_sorted_by_distance.length)
				callback(stores_sorted_by_distance);
			else
				geocoder.getNearestDestination(null, stores, function(sorted_stores){
						stores_sorted_by_distance = sorted_stores;
						callback(sorted_stores);
				});
		},
		setDefault : function(location_name){
			location_name ? cookiemgr.setCookie(def_cookie_key, location_name) : '';
		}	
	};

	return locationfactory;

}])