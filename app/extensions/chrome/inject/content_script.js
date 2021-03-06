/**
 * Created by Enrico Giusti on 06/08/15.
 */

var addLivereload = function() {
    var validUrlRegExp = /^(http:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/; // at the moment, only http (add s? to add https support)
    if (validUrlRegExp.test(window.location.href) === false) {
        return;
    }

    var b = document.getElementsByTagName('body')[0],
        script = document.createElement('script');
    
    script.setAttribute('src', 'http://localhost:31331/livereload.js?snipver=1');
    b.appendChild(script);
};

var switchPundit = function(on) {
    var bodyStyle = document.body.style;
    var cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';

    if (on) {
        if (document.getElementById('pundit2') !== null) {
            angular.element(document).trigger('Pundit.show');
            chrome.runtime.sendMessage({action: 'setLoading', loading: false});
            angular.element(document).trigger('Pundit.requestAnnotationsNumber');
            angular.element('span[text-fragment-bit]').addClass('pnd-cons');
            angular.element('span.pnd-text-fragment-icon').removeClass('pnd-text-fragment-icon-hidden');
            return;
        }

        // Turn on.
        var b = document.getElementsByTagName('body')[0],
            div = document.createElement('div'),
            preloadDiv = document.createElement('div');

        var toolbarHeight = 30,
            isClientInLiteMode = false;

        var innerHtml = '';
        innerHtml += '<div class="navbar navbar-inverse navbar-fixed-top pnd-toolbar-navbar pnd-ignore">';
        innerHtml += '  <div class="container-fluid pnd-toolbar-navbar-container">';
        innerHtml += '      <div class="pnd-toolbar-navbar-collapse">';
        innerHtml += '          <div class="pnd-toolbar-notification-text">';
        innerHtml += '              Pundit is loading, please wait ...';
        innerHtml += '          </div> <!-- pnd-navbar-left -->';
        innerHtml += '      </div><!-- pnd-toolbar-navbar-collapse -->';
        innerHtml += '  </div><!-- pnd-toolbar-navbar-container -->';
        innerHtml += '</div><!-- navbar-inverse navbar-fixed-top -->';

        if (punditConfig) {
            if (punditConfig.clientMode === 'lite') {
                isClientInLiteMode = true;
            } else if (punditConfig.modules &&
                punditConfig.modules.Toolbar) {
                toolbarHeight = punditConfig.modules.Toolbar.toolbarHeight || toolbarHeight;
            }
        }

        bodyStyle.position = 'static';

        div.setAttribute('data-ng-app', 'Pundit2');
        div.setAttribute('id', 'pundit2');
        div.setAttribute('class', 'pnd-wrp');
        b.appendChild(div);
        
        if (isClientInLiteMode === false) {
            bodyStyle[cssTransform] = 'translateY(' + toolbarHeight + ')';
            bodyStyle.marginTop = toolbarHeight + 'px';

            preloadDiv.setAttribute('id', 'pundit2_preload');
            div.appendChild(preloadDiv);
            preloadDiv.innerHTML = innerHtml;
        } 

        // Boot angular app.
        setTimeout(function() {
            angular.bootstrap(div, ['Pundit2']);
        }, 92);
    }
    else {
        // Turn off.
        if (typeof angular !== 'undefined') {
            //angular.element('div[data-ng-app='Pundit2']').remove();
            angular.element(document).trigger('Pundit.hide');
            angular.element('span[text-fragment-bit]').removeClass('pnd-cons');
            angular.element('span.pnd-text-fragment-icon').addClass('pnd-text-fragment-icon-hidden');
        }
        //bodyStyle[cssTransform] = 'translateY(' - 30 + ')';
    }
};

var dispatchDocumentEvent = function(eventName, details) {
    var evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();
        evt.details = details;
        document.fireEvent(eventName, evt);
    }
    else {
        // dispatch for firefox + others
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, true); // event type,bubbling,cancelable
        evt.details = details;
        return !document.dispatchEvent(evt);
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    switch (request.action) {
        case 'checkPundit':
            var responseObject = {isPresent: (document.getElementsByClassName('pnd-wrp').length !== 0)};
            sendResponse(responseObject);
            break;
        case 'switchOn':
            switchPundit(true);
            break;
        case 'switchOff':
            switchPundit(false);
            break;
        case 'livereload':
            addLivereload();
            break;
        case 'requestUserProfileUpdate':
            angular.element(document).trigger('Pundit.requestUserProfileUpdate');
            break;
        case 'requestUserLoggedStatus':
            angular.element(document).trigger('Pundit.requestUserLoggedStatus');
            break;
        case 'requestAnnotationsNumber':
            if (typeof angular !== 'undefined') {
                angular.element(document).trigger('Pundit.requestAnnotationsNumber');
            }
            else {
                dispatchDocumentEvent('Pundit.requestAnnotationsNumberRaw', 0);
            }
            break;
    }
});

document.addEventListener('Pundit.updateAnnotationsNumber', function(evt){
    chrome.runtime.sendMessage({action: 'updateAnnotationsNumber', number: evt.detail}, function(response) {
        /*NO OP*/
    });
});

document.addEventListener('Pundit.consolidation', function(evt){
    chrome.runtime.sendMessage({action: 'consolidation', active: evt.detail}, function(response) {
        /*NO OP*/
    });
});

document.addEventListener('Pundit.loading', function(evt){
    chrome.runtime.sendMessage({action: 'setLoading', loading: evt.detail}, function(response) {
        if (response.action === 'updateAnnotationsNumber') {
            angular.element(document).trigger('Pundit.requestAnnotationsNumber');
        }
    });
});

document.addEventListener('Pundit.userProfileUpdated', function(evt){
    chrome.runtime.sendMessage({action: 'userProfileUpdated', number: evt.detail}, function(response) {
        /*NO OP*/
    });
});

document.addEventListener('Pundit.userLoggedStatusChanged', function(evt){
    chrome.runtime.sendMessage({action: 'userLoggedStatusChanged', number: evt.detail}, function(response) {
        /*NO OP*/
    });
});
