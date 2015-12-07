(function(window, undefined) {'use strict';


angular.module('adf.widget.pagebuilder', ['adf.provider'])
    .config(["dashboardProvider", function(dashboardProvider) {
        dashboardProvider
            .widget('pagebuilder', {
                title: 'Page Builder',
                description: 'construct a multipage weblog from your collection data',
                templateUrl: '{widgetsPath}/pagebuilder/src/view.html',
                frameless: false,
                controller: 'PageBuilderCtrl',
                reload: true,
                titleTemplateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
                edit: {
                    templateUrl: '{widgetsPath}/pagebuilder/src/edit.html',
                    controller: 'PageBuilderConfigCtrl',
                    controllerAs: 'config',
                    modalSize: 'lg',
                    reload: true,
                    immediate: true
                }

            });
    }]);
angular.module('adf.widget.pagebuilder').controller('PageBuilderConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce','$templateCache',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce, $templateCache) {
            $scope.config = config;
            $scope.loadTemplate = function(config) {
                var req = $templateCache.get(config.url).then(function(resp) {
                    config.data = resp.data;
                });
            };
            if (config.url) {
                this.url = $sce.trustAsResourceUrl(config.url);
            }
            if (config.data) {
                this.data = $sce.trustAsHtml(config.data);
            }
            $scope.compOps = [{
                url: './modules/lionlawlabs/partial/zigzag/zigzag.html',
                label: 'Timeline Z'
            }, {
                url: './modules/lionlawlabs/partial/blogconffoto.html',
                label: 'Post w/ thumbnail'
            }, {
                url: './modules/lionlawlabs/partial/collection_preview_carousel',
                label: 'Preview Carousel'
            }, {
                url: './modules/lionlawlabs/partial/googleplusstyle/googleplusstyle.html',
                label: 'Post (G+ Style)'
            }, {
                url: './modules/lionlawlabs/partial/blogfooter/blogfooter.html',
                label: 'Footer Section'
            }, {
                url: './modules/lionlawlabs/partial/searchresults/searchresults.html',
                label: 'Search Query w/ Results'
            }, {
                url: './modules/admin/directive/matterstrip/matterstrip.html',
                label: 'MatterStrip'
            }, {
                url: './modules/roarmap/directive/roargrid/roargrid.html',
                label: 'ROARgrid'
            }, {
                url: './modules/phd/partial/resume/resume.html',
                label: 'Resume'
            }, {
                url: './modules/phd/partial/vscroller/vscroller.html',
                label: 'VerticalScoll-Banner'
            }, {
                url: './modules/directive/responsiveaccordion/responsiveaccordion.html',
                label: 'Accordion'
            }, {
                url: './modules/templates/responsetpl.html',
                label: 'Response'
            }, {
                url: './modules/templates/pagedocumentbody.html',
                label: 'Document Body'
            }, {
                url: './modules/templates/memotemplate2page.html',
                label: 'Memo'
            }]
        }
    ])
    .controller('PageBuilderCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
            $scope.config = config;
            $scope.template = $sce.trustAsHtml(config.data);
            if (config.url) {
                this.url = $sce.trustAsResourceUrl(config.url);
            }
            if (config.data) {
                this.data = $sce.trustAsHtml(config.data);
            }
        }
    ]);

angular.module("adf.widget.pagebuilder").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/pagebuilder/src/edit.html","<form role=form><div class=form-group><label for=templateurl>TemplateUrl</label> <input type=text class=form-control id=templateurl ng-model=config.url placeholder=\"Enter URL\" ng-change=loadTemplate(config) ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"><select ng-model=config.url ng-change=loadTemplate(config) ng-options=\"option.url as option.label for option in compOps\"><option label></option></select></div></form><p ng-bind-html=config.data></p><pre class=code><code>{{config.data}}</code></pre>");
$templateCache.put("{widgetsPath}/pagebuilder/src/view.html","<div ng-include=config.url></div><div ng-bind-html=template></div>");}]);})(window);