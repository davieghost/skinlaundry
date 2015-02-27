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

//For GA
var extract_event = function(){
		
		var category		=	$(this).data("ev-cat");
		if(!(category && category.length))
			return;

		var action = $(this).data("ev-act");
		if(!(action && action.length))
			return;

		var value 			=	parseInt($(this).data("ev-val"));
		value = isNaN(value) ? 0 : value;

		var labels 			=	$(this).data("ev-lbls");

		return {
		  'hitType': 'event',          // Required.
		  'eventCategory': category,   // Required.
		  'eventAction': action,      // Required.
		  'eventLabel': labels,
		  'eventValue': value
		}
	};

// form on submit 
if ($('form.subscriptionform').length) {
	$('form.subscriptionform').on("submit", function(event) {
		event.preventDefault();
		var self = $(this);
		var ga_element = $("*[data-ga-ajx-success]", this);

		var xhr_req = $.post(self.attr("action"), self.serialize(), function(data) {
			if (data.status == "success") {

				var event_obj = extract_event.call(self);
				typeof ga != "undefined" ? ga('send', event_obj) : '';

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
			$('form.subscriptionform').submit();
		}
	});
}
// if the submission happens successful 
if ($("#close-thanksDiv").length)
	$("#close-thanksDiv").on("click", function() {
		$("#thanksDiv").hide();
		$("form.subscriptionform").show().find("input[type='text'], input[type='email'], input[type = 'tel']").val("")
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
			this.removeCookie(key); //Firstly remove the cookie and then set
			return _set_cookie(key, value);
		},
		removeCookie : function(key){
			return _remove_cookie(key);
		}
	};
}]);

SLWebApp.controller("BaseCtrl", [ '$scope', 'localCache', 'cookiemgr', '$rootScope', 'location', '$timeout', 'treatmentfactory', function($scope, localCache, cookiemgr, $rootScope, location, $timeout, treatmentfactory){	
	var self = this;
	var init = function(){
		$(".till-ng-loaded").removeClass("till-ng-loaded");
		location.getSortedStores(function(data){
			$timeout(function(){
				self.sorted_stores = data;
				self.default_location = location.getDefault();
				//If user doesn't already have a chosen location. Try to locate the nearest store as default for him
				if(!(self.default_location && self.default_location.length)){
					var default_store =  self.sorted_stores.length && self.sorted_stores[0].distance_details.status == "OK" ? self.sorted_stores[0] : null;
					default_store ? (location.setDefault(default_store.name) && (self.default_location = default_store)) : '';
				}
				var loc_object = location.getLocationObj(self.default_location);
				self.default_location_key = loc_object.key;
				self.default_zone = location.getDefaultZone();
				self.default_treatment = treatmentfactory.getDefaultTreatment(self.default_zone);
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

	this.loadTreatments = function(zone, group_by_category){
		self.treatments = treatmentfactory.getTreatments(zone, group_by_category);
	};

	this.setDefaultLocation = function(location_name, reloadPage){
		location.setDefault(location_name);
		reloadPage ? window.location.reload() : '';
	};

	this.setDefaultZone = function(zone, should_redirect){
		location.setDefaultZone(zone);
		if(should_redirect){
			window.location.href = "/" + zone + "/treatments.html";
		}
		return true;
	}

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
	var def_store_cookie_key = 'defzone';
	var test_origin = [34.130352, -117.708338];
	if(!geocoder)
		console.warn("Geocoder not defined. Must resolve this dependency");

	var getByLocationName = function(location_name){
		return  _.find(stores, function(store){return store.name == location_name});
	}

	var locationfactory =  {
		getDefault : function(){
			return cookiemgr.getCookie(def_cookie_key);
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
			if(!(location_name && location_name.length))
				return null;
			var location = getByLocationName(location_name);
			if(!location)
				return null;
			cookiemgr.setCookie(def_cookie_key, location.name);
			this.setDefaultZone(location.zone);
			return true;
		},
		setDefaultZone : function(zone){
			cookiemgr.setCookie(def_store_cookie_key, zone);
			return true;
		},
		getDefaultZone : function(){
			return cookiemgr.getCookie(def_store_cookie_key);
		},
		getLocationObj : function(loc_name){
			if(!loc_name)
				return false;
			return getByLocationName(loc_name);
		}	
	};

	return locationfactory;

}]);

SLWebApp.factory('treatmentfactory', [function(){
	

	var processTreatment = function(treatment, zone){
		var temp = {};
		temp = angular.copy(treatment);
		temp = _.extend(temp, temp.zonal_specific_details[zone]);
		delete temp.zonal_specific_details;
		return temp;
	};

	var processTreatments = function(treatments, zone, group_by_category){
		var temp = {};
		for(var treatment_key in treatments){
			if(!treatments.hasOwnProperty(treatment_key))
				continue;
			var treatment = processTreatment(treatments[treatment_key], zone);

			if(group_by_category){
				var category = treatments[treatment_key].category;
				temp[category] ? temp[category].push(treatment) : (temp[category] = [treatment]);
			}
			else
				temp[treatment_key] = processTreatment(treatments[treatment_key], zone);
		}
		return temp;
	};

	var treatmentfactory = {
		getTreatments : function(zone, group_by_category){
			if(!zone){
				console.error("Cannot process request without zone");
				return false;
			}
			return processTreatments(treatments["treatments"], zone, group_by_category);
		},
		getDefaultTreatment : function(zone){
			if(!zone){
				console.error("Cannot process request without zone");
				return false;
			}
			var treatment = treatments["treatments"][treatments["default"]];
			if(!treatment){
				console.error("Could not location default treatment");
				return false;
			}
			return processTreatment(treatment, zone);
		}	
	};
	return treatmentfactory;
}]);

SLWebApp.directive('slideToggle', function(){
	return{
		scope : {target : '@', hide : '@'},
		link : function(scope, elem, attr){
			elem.on("click", function(event){
				$(scope.hide).not(scope.target).slideUp('fast', function(){
				});
				$(scope.target).slideToggle('fast');
				return false;
			});

		}
	}
})