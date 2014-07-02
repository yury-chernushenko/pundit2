angular.module('korboee-templates', ['src/KorboEE/Korboee-callback.tmpl.html', 'src/KorboEE/Korboee-error-config.tmpl.html', 'src/KorboEE/autocompleteList.tmpl.html', 'src/KorboEE/korboee-entity.tmpl.html']);

angular.module("src/KorboEE/Korboee-callback.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/KorboEE/Korboee-callback.tmpl.html",
    "<!--\n" +
    "Use only callback mode.\n" +
    "You can use API registered on Global Object defined in your configuration\n" +
    "-->\n" +
    "\n" +
    "");
}]);

angular.module("src/KorboEE/Korboee-error-config.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/KorboEE/Korboee-error-config.tmpl.html",
    "<div class=\"container error-ee-config\">\n" +
    "    <div class=\"row container alert alert-danger error col-md-4 error-ee-globalobject\" ng-show=\"errorType == 'globalObject'\">\n" +
    "        Configuration Error. Object {{conf.globalObjectName}} existing. Please check your configuration!\n" +
    "    </div>\n" +
    "    <div class=\"row container alert alert-danger error col-md-4 error-ee-autocomplete\" ng-show=\"errorType == 'autoComplete'\">\n" +
    "        CONFIGURATION ERROR. <br> You can choise only one mode: useAutocompleteWithNew or useAutocompleteWithSearch. <br> Please check your configuration!\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("src/KorboEE/autocompleteList.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/KorboEE/autocompleteList.tmpl.html",
    "<ul tabindex=\"-1\" class=\"typeahead dropdown-menu\" ng-show=\"$isVisible()\" role=\"select\">\n" +
    "  <li role=\"presentation\" ng-repeat=\"match in $matches\" ng-class=\"{active: $index == $activeIndex}\">\n" +
    "    <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"$select($index, $event);isSelect(match)\" ng-bind=\"match.label\" ng-if=\"match.label!== 'no found'\"></a>\n" +
    "    <a role=\"menuitem\" tabindex=\"-1\" disabled ng-bind=\"noFound\" ng-if=\"match.value.noResult === true\"></a>\n" +
    "  </li>\n" +
    "    <li class=\"divider\"></li>\n" +
    "    <li>\n" +
    "        <span>{{elemToSearch}}</span>\n" +
    "        <button> New </button>\n" +
    "        <button> Search </button>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("src/KorboEE/korboee-entity.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/KorboEE/korboee-entity.tmpl.html",
    "<div class=\"container ee-wrp\" id=\"korbo-ee-container\" ng-if=\"renderElement()\">\n" +
    "        <div class=\"left-inner-icon\">\n" +
    "            <span class=\"pnd-icon pnd-icon-refresh\" ng-show=\"isLoading()\"></span>\n" +
    "            <input class=\"form-control ee-input-elem-to-search\"\n" +
    "                   name=\"{{conf.tafonyName}}\"\n" +
    "                   id=\"{{conf.tafonyId}}\"\n" +
    "                   placeholder=\"Type at least {{conf.labelMinLength}} characters...\"\n" +
    "                   ng-keypress=\"keyPressHandle($event)\"\n" +
    "                   type=\"text\"\n" +
    "                   autocomplete=\"off\"\n" +
    "                   ng-model=\"elemToSearch\"\n" +
    "                   template=\"{{autocompleteListTemplate}}\"\n" +
    "                   ng-options=\"e.label for e in autoCompleteSearch($viewValue)\"\n" +
    "                   bs-typeahead/>\n" +
    "\n" +
    "        </div> <!-- div ee-input-container -->\n" +
    "\n" +
    "\n" +
    "    <!-- input hidden -->\n" +
    "    <input type=\"hidden\" name=\"{{conf.nameInputHiddenUri}}\" value=\"{{location}}\" class=\"ee-uri-hidden\" />\n" +
    "    <input type=\"hidden\" name=\"{{conf.nameInputHiddenLabel}}\" value=\"{{label}}\" class=\"ee-label-hidden\" />\n" +
    "    <!-- fine input hidden -->\n" +
    "\n" +
    "</div> <!-- div container -->\n" +
    "");
}]);
