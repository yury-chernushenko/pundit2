angular.module('Pundit2.ResourcePanel')
.constant('RESOURCEPANELDEFAULTS', {

})
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS, $rootScope, $popover, $q, ItemsExchange, MyItems, PageItemsContainer, Client, NameSpace) {

    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);

    var state = {};

    state.popover = null;
    state.selectors = ['freebase', 'dbpedia', 'korbo'];
    state.defaultPlacement = 'bottom';
    state.resourcePromise = null;

    // hide and destroy a popover
    resourcePanel.hide = function(){

        if(state.popover === null){
            return;
        }
        state.popover.hide();
        state.popover.destroy();
        state.popover = null;
    };
    /*
    *
    * LITERAL POPOVER METHOD
    *
    */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-literal-popover-literalAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.literalAnchor = angular.element('.pnd-literal-popover-literalAnchor');


    // scope needed to instantiate a new popover using $popover provider
    state.popoverOptions = {scope: $rootScope.$new()};

    // initialize popoverLiteral text popover
    var initPopoverLiteral = function(x, y, content, target){
        // move literalAnchor to correct position
        state.literalAnchor.css({
            left: x,
            top: y
        });

        if(typeof(content) === 'undefined') {
            state.popoverOptions.scope.literalText = '';
        } else {
            state.popoverOptions.scope.literalText = content;
        }

        // handle save a new popoverLiteral
        state.popoverOptions.scope.save = function() {
            state.resourcePromise.resolve(this.literalText);
            resourcePanel.hide();
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hide();
        };

        state.popoverOptions.placement = state.defaultPlacement;
        state.popoverOptions.template = 'src/ResourcePanel/popoverLiteralText.tmpl.html';
        state.popover = $popover(state.literalAnchor, state.popoverOptions);
        state.popover.clickTarget = target;
        return state.popover;
    };

    // show popover literal
    // x,y --> coordinate where popover will be shown
    // content --> text to show in textarea
    // target -->  targer element clicked
    resourcePanel.showPopoverLiteral = function(x, y, content, target){

        // if click the same popover, hide it
        if (state.popover !== null && state.popover.clickTarget === target) {
            resourcePanel.hide();
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopoverLiteral(x, y, content, target);
            state.popover.$promise.then(state.popover.show);
        }

        // if no popover is shown, just show it
        else if (state.popover === null) {
            state.popover = initPopoverLiteral(x, y, content, target);
            state.popover.$promise.then(state.popover.show);
         }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    /*
     *
     * CALENDAR POPOVER METHOD
     *
     *
     */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-calendar-popover-calendarAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.calendarAnchor = angular.element('.pnd-calendar-popover-calendarAnchor');

    // initialize calendar popover
    var initPopoverCalendar = function(x, y, date, target){
        // move literalAnchor to correct position
        state.calendarAnchor.css({
            left: x,
            top: y
        });

        // handle save a new popoverLiteral
        state.popoverOptions.scope.save = function() {
            state.resourcePromise.resolve(this.selectedDate);
            resourcePanel.hide();
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hide();
        };

        state.popoverOptions.placement = state.defaultPlacement;
        state.popoverOptions.template = 'src/ResourcePanel/popoverCalendar.tmpl.html';
        state.popover = $popover(state.calendarAnchor, state.popoverOptions);
        state.popover.clickTarget = target;
        return state.popover;
    };

    resourcePanel.showPopoverCalendar = function(x, y, date, target){

        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopoverCalendar(x, y, date, target);
            state.popover.$promise.then(function() {
                state.popover.show();

            });
        }

        // if click the same popover, toggle it
        else if (state.popover !== null && state.popover.clickTarget === target) {
            resourcePanel.hide();
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopoverCalendar(x, y, date, target);
            state.popover.$promise.then(state.popover.show);
        }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };


    /*
     *
     * RESOURCE PANEL POPOVER METHOD
     *
     *
     */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-reousrce-panel-popover-rpAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.resourcePanelAnchor = angular.element('.pnd-calendar-popover-calendarAnchor');

    state.popoverResourcePanel = null;

    // initialize calendar popover
    var initPopoverResourcePanel = function(x, y, target, pageItems, myItems, properties){

        // move literalAnchor to correct position
        state.resourcePanelAnchor.css({
            left: x,
            top: y
        });
        state.popoverOptions.scope.pageItems = pageItems;
        state.popoverOptions.scope.myItems = myItems;
        state.popoverOptions.scope.properties = properties;
        // handle save a new popoverLiteral
        state.popoverOptions.scope.save = function(elem) {
            resourcePanel.hide();
            state.resourcePromise.resolve(elem);
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hide();
        };

        state.popoverOptions.placement = state.defaultPlacement;
        state.popoverOptions.template = 'src/ResourcePanel/popoverResourcePanel.tmpl.html';
        state.popover = $popover(state.resourcePanelAnchor, state.popoverOptions);
        state.popover.clickTarget = target;
        return state.popover;
    };

    var showPopoverResourcePanel = function(x, y, target, pageItems, myItems, properties){

        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopoverResourcePanel(x, y, target, pageItems, myItems, properties);
            state.popover.$promise.then(state.popover.show);
        }

        // if click the same popover, toggle it
        else if (state.popover !== null && state.popover.clickTarget === target) {
            resourcePanel.hide();
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopoverResourcePanel(x, y, target, pageItems, myItems, properties);
            state.popover.$promise.then(state.popover.show);
        }

    };

    // triple is an array of URI [subject, predicate, object]
    // show all items compatibile as subject
    resourcePanel.showItemsForSubject = function(x, y, triple, target) {

        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;
        var myItems, pageItems;

        if(typeof(triple) !== 'undefined'){

            // predicate is the second element of the triple
            var predicate = triple[1];

            // if predicate is not defined
            if( typeof(predicate) === 'undefined' || predicate === "") {
                // all items are good
                myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);

            // if predicate is a valid uri
            } else {
                // get item predicate and check his domain
                var itemPredicate = ItemsExchange.getItemByUri(predicate);
                // predicate with empty domain
                if(typeof(itemPredicate.domain) === 'undefined' || itemPredicate.domain.length === 0 || itemPredicate.domain[0] === ""){
                    // all items are good
                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                } else {
                    // predicate with a valid domain
                    var domain = itemPredicate.domain;

                    // get only items matching with predicate domain
                    var filter = function(item) {

                      for(var i=0; i<domain.length; i++){
                          for (var j=0; j<item.type.length; j++){
                              if(domain[i] === item.type[j]) {
                                  return true;
                              }
                          }
                      }
                        return false;
                    };

                    myItems = ItemsExchange.getItemsFromContainerByFilter(myItemsContainer, filter);
                    pageItems = ItemsExchange.getItemsFromContainerByFilter(pageItemsContainer, filter);
                } // end else domain defined

            } // end else predicate valid uri

        } // end if triple undefined

        showPopoverResourcePanel(x, y, target, pageItems, myItems, "");

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;

    };

    // triple is an array of URI [subject, predicate, object]
    // show all items compatibile as object
    resourcePanel.showItemsForObject = function(x, y, triple, target) {

        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;
        var myItems, pageItems;

        if(typeof(triple) !== 'undefined'){

            // predicate is the second element of the triple
            var predicate = triple[1];

            // if predicate is not defined
            if( typeof(predicate) === 'undefined' || predicate === "") {
                // all items are good
                myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                showPopoverResourcePanel(x, y, target, pageItems, myItems, "");

            } else {
                // get item predicate and check his domain
                var itemPredicate = ItemsExchange.getItemByUri(predicate);
                // predicate with empty domain
                if(typeof(itemPredicate.range) === 'undefined' || itemPredicate.range.length === 0 || itemPredicate.range[0] === ""){
                    // all items are good
                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    showPopoverResourcePanel(x, y, target, pageItems, myItems, "");

                // if predicate is literal, show popover literal
                } else if(itemPredicate.range.length === 1 && itemPredicate.range[0] === NameSpace.rdfs.literal){
                    resourcePanel.showPopoverLiteral(x, y, "", target);

                // if predicate is dateTime, show popover calendar
                } else if(itemPredicate.range.length === 1 && itemPredicate.range[0] === NameSpace.dateTime){
                    resourcePanel.showPopoverCalendar(x, y, "", target);

                } else {
                    // predicate with a valid domain
                    var range = itemPredicate.range;

                    // get only items matching with predicate domain
                    var filter = function(item) {

                        for(var i=0; i<range.length; i++){
                            for (var j=0; j<item.type.length; j++){
                                if(range[i] === item.type[j]) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    myItems = ItemsExchange.getItemsFromContainerByFilter(myItemsContainer, filter);
                    pageItems = ItemsExchange.getItemsFromContainerByFilter(pageItemsContainer, filter);
                    showPopoverResourcePanel(x, y, target, pageItems, myItems, "");
                }

            } // end else predicate !== undefined

        } // end if triple !== undefined

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    var objTypes,
        subTypes;

    // show only properties
    // will be executed for predicates
    resourcePanel.showProperties = function(x, y, triple, target) {
        var propertiesContainer = Client.options.relationsContainer;
        var properties;

        if(typeof(triple) !== 'undefined'){
            // subject is the first element of the triple
            var subject = triple[0];
            // object is the third element of the triple
            var object = triple[2];

            // if subject and object are both not defined
            if( (typeof(subject) === 'undefined' || subject === "") && (typeof(object) === 'undefined' || object === "")) {
                // all properties are good
                properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                showPopoverResourcePanel(x, y, target, "", "", properties);

            // if only subject is defined
            } else if( (typeof(subject) !== 'undefined' && subject !== "") && (typeof(object) === 'undefined' || object === "")) {

                // get subject item
                var itemSubject = ItemsExchange.getItemByUri(subject);
                // if subject item has no type
                if(typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === ""){
                    // all properties are good
                    properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                } else {
                    // predicate with a valid domain
                    subTypes = itemSubject.type;
                    properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByDomain);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                }

            // if only object is defined
            } else if( (typeof(object) !== 'undefined' && object !== "") && (typeof(subject) === 'undefined' || subject === "")) {
                // get object item
                var itemObject = ItemsExchange.getItemByUri(object);
                // if oject has no type
                if(typeof(itemObject.type) === 'undefined' || itemObject.type.length === 0 || itemObject.type[0] === ""){
                    // all properties are good
                    properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                } else {
                    objTypes = itemObject.type;
                    properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByRange);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                }

            // subject and object are both defined
            } else if( (typeof(object) !== 'undefined' && object !== "") && (typeof(subject) !== 'undefined' || subject !== "")) {
                var itemObject = ItemsExchange.getItemByUri(object);
                var itemSubject = ItemsExchange.getItemByUri(subject);

                // both subject and object have empty types
                if((typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === "") && (typeof(itemObject.type) === 'undefined' || itemObject.type.length === 0 || itemObject.type[0] === "")){
                    // all items are good
                    properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                }

                // subjecy has no type, object has valid types --> filterByRange
                else if((typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === "") && (typeof(itemObject.type) !== 'undefined' && itemObject.type[0] !== "")){
                    objTypes = itemObject.type;
                    properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByRange);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                }

                // object has no type, subject has valid types --> filterByDomain
                else if((typeof(itemSubject.type) !== 'undefined' && itemSubject.type[0] !== "") && (typeof(itemObject.type) === 'undefined' || itemObject.type.length === 0 || itemObject.type[0] === "")){
                    subTypes = itemSubject.type;
                    properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByDomain);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                }

                // both object and subject have valid types --> filterByDomainAndRange
                else if((typeof(itemSubject.type) !== 'undefined' && itemSubject.type[0] !== "") && (typeof(itemObject.type) !== 'undefined' && itemObject.type[0] !== "")){
                    subTypes = itemSubject.type;
                    objTypes = itemObject.type;
                    properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByRangeAndDomain);
                    showPopoverResourcePanel(x, y, target, "", "", properties);
                }

            } // end else both subject and object are defined

        } // end triple !== undefined

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    // get only items matching with predicate domain
    var filterByDomain = function(item) {
        if(typeof(item.domain) !== 'undefined'){
            for(var i=0; i<subTypes.length; i++){
                for (var j=0; j<item.domain.length; j++){
                    if(subTypes[i] === item.domain[j]) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    };

    // get only items matching with predicate domain
    var filterByRange = function(item) {
        if(typeof(item.range) !== 'undefined'){
            for(var i=0; i<objTypes.length; i++){
                for (var j=0; j<item.range.length; j++){
                    if(objTypes[i] === item.range[j]) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    };

    // get only items matching with predicate domain and range
    var filterByRangeAndDomain = function(item) {
        var ret = filterByRange(item) && filterByDomain(item);
        return ret;
    };

    return resourcePanel;
});
