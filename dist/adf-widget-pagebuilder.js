(function(window, undefined) {'use strict';


angular.module('adf.widget.pagebuilder', ['adf.provider', 'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
])
    .config(["dashboardProvider", function(dashboardProvider) {
        dashboardProvider
            .widget('lexfeed', {
                title: 'LexFeed',
                description: 'RSS Feed Reader',
                templateUrl: '{widgetsPath}/pagebuilder/src/rssfeeds.html',
                controller: 'FeedyCtrl',
                frameless: false,
                reload: false,
                styleClass: 'panel-info',
                edit: {
                    template: '<input ng-model="config.src" placeholder="feed source" type="url" />'
                }
            })
            .widget('videoplayer', {
                title: 'LexScreen',
                description: 'videoplayer',
                templateUrl: '{widgetsPath}/pagebuilder/src/videoplayer.html',
                controller: 'VideoCtrl',
                controllerAs: 'video',
                frameless: true,
                reload: true,
                styleClass: 'dark-bg',
                edit: {
                    controller: 'VideoCtrl',
                    controllerAs: 'video',
                    reload: true,
                    immediate: true,
                    templateUrl: '{widgetsPath}/pagebuilder/src/videoedit.html'
                }
            })
            .widget('pagebuilder', {
                title: 'Page Builder',
                description: 'construct a multipage weblog from your collection data',
                templateUrl: '{widgetsPath}/pagebuilder/src/view.html',
                frameless: false,
                controller: 'PageBuilderCtrl',
                controllerAs: 'page',
                styleClass: 'panel-default',
                reload: false,
                //titleTemplateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
                edit: {
                    templateUrl: '{widgetsPath}/pagebuilder/src/edit.html',
                    controller: 'PageBuilderConfigCtrl',
                    controllerAs: 'page',
                    modalSize: 'lg',
                    reload: true,
                    immediate: true
                }

             });
            //.widget("metadata", {
            //     title: "Metadata",
            //     description: "Configure metadata",
            //     templateUrl: "../src/templates/dashboard-edit.html",
            //     controller: "MessageWidgetController",
            //     styleClass: 'panel panel-default',
            //     frameless: false,
            //     resolve: {
            //         config: ["config","$scope", function(config, $scope) {
            //             return config.id = $scope.$parent.adfModel.$id;
            //         }]
            //     },
            //      edit: {
            //         templateUrl: '{widgetsPath}/testwidget/src/edit.html',
            //         modalSize: 'lg',
            //         controller: 'CKEditorCtrl',
            //         reload: false
            //     }
            // })
            // .widget("tabs", {
            //     title: "Tabs",
            //     description: "Demonstrates UI Bootstrap tabs in a widget",
            //     templateUrl: "{widgetsPath}/pagebuilder/src/tabwidget.html",
            //     //controller: "TabsWidgetController",
            //     styleClass: 'panel-default',
            //     edit: {
            //         templateUrl: '{widgetsPath}/testwidget/src/edit.html',
            //         modalSize: 'lg',
            //         controller: 'CKEditorCtrl',
            //         reload: false
            //     }
            // }).widget('d3claimtreemap', {
            //     title: 'Patent Claim Dependency',
            //     titleTemplateUrl: '{widgetsPath}/testwidget/src/title.html',
            //    templateUrl: "{widgetsPath}/pagebuilder/src/patenttabwidget.html",
            //     description: 'view dependency tree of any published patent claim set',

            //     controller: ['$sce', 'config', '$scope', '$compile', function($sce, config, $scope, $compile) {
            //         $scope.configs = $compile($sce.trustAsHtml(config.content))($scope);
            //     }],
            //     styleClass: 'card card-block',
            //     frameless: false,
            //     reload: true,
            //     edit: {
            //         template: '<form class="card"><label for="patentnumber">Enter numbers</label><input name="patentnumber" class="form-control" ng-model="config.patentnumbers" ng-list /></form>',
            //         immediate: true,
            //         reload: true
            //     }
            // });
    }]);
angular.module('adf.widget.pagebuilder')
.controller('ContentTreeCtrl', ['Collections','$scope',function(Collections, $scope){
    var cs = Collections();
    $scope.tree = {
        roarlist: cs
    };
}])


.controller('PageBuilderConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce', '$templateCache',
    function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce, $templateCache) {
        var page = this;
        page.config = config;
        page.loadTemplate = function(config) {
            if (!config.template) {
                $http.get(config.url).then(function(resp) {
                    page.data = $sce.trustAsHtml(resp.data);
                });
            } else {
                page.data = $sce.trustAsHtml(config.template);
            }
        };
        if (page.config.url) {
            page.url = $sce.trustAsResourceUrl(page.config.url);
        }
        if (page.config.data) {
            page.data = $sce.trustAsHtml(page.config.data);
        }
        page.compsources = [{
            url: '/llp_core/modules/lionlawlabs/partial/zigzag/zigzag.html',
            label: 'Timeline Z'
        }, {
                url: '/llp_core/modules/lionlawlabs/partial/blogconffoto.html',
                label: 'Post w/ thumbnail'
            }, {
                url: '/llp_core/modules/lionlawlabs/partial/collection_preview_carousel',
                label: 'Preview Carousel'
            }, {
                url: '/llp_core/modules/lionlawlabs/partial/googleplusstyle/googleplusstyle.html',
                label: 'Post (G+ Style)'
            }, {
                url: '/llp_core/modules/lionlawlabs/partial/blogfooter/blogfooter.html',
                label: 'Footer Section'
            }, {
                url: '/llp_core/modules/lionlawlabs/partial/searchresults/searchresults.html',
                label: 'Search Query w/ Results'
            }, {
                url: '/llp_core/modules/admin/directive/matterstrip/matterstrip.html',
                label: 'MatterStrip'
            }, {
                url: '/llp_core/modules/roarmap/directive/roargrid/roargrid.html',
                label: 'ROARgrid'
            }, {
                url: '/llp_core/modules/phd/partial/resume/resume.html',
                label: 'Resume'
            }, {
                url: '/llp_core/modules/phd/partial/vscroller/vscroller.html',
                label: 'VerticalScoll-Banner'
            }, {
                url: '/llp_core/modules/directive/responsiveaccordion/responsiveaccordion.html',
                label: 'Accordion'
            }, {
                url: '/llp_core/modules/templates/responsetpl.html',
                label: 'Response'
            }, {
                url: '/llp_core/modules/templates/pagedocumentbody.html',
                label: 'Document Body'
            }, {
                url: '/llp_core/modules/templates/memotemplate2page.html',
                label: 'Memo'
            }];
    }
])
    .controller('PageBuilderCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce', 'Collection',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce, Collection) {
            var page = this;
            $scope.collection = Collection(config.id);
            page.config = config;
            page.template = $sce.trustAsHtml(page.config.data);
            if (page.config.url) {
                page.url = $sce.trustAsResourceUrl(page.config.url);
            }
            if (page.config.data) {
                page.data = $sce.trustAsHtml(page.config.data);
            }
        }
    ]).factory('FeedyService', ['$http', function($http) {
        return {
            parseFeed: function(url) {
                return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
            }
        };
    }])
    .factory('Feedz', function() {
        return [
            { title: 'Federal Circuit IP Blog', url: 'http://federalcircuitipblog.com/feed/' },
            { title: 'PTO Litigation Center Report', url: 'http://ptolitigationcenter.com/feed/' },
            { title: 'Big Molecule Watch Blog', url: 'http://feeds.feedburner.com/GoodwinProcter-BigMoleculeWatchBlog' },
            { title: 'IT Law Today', url: 'http://feeds.lexblog.com/ItLawToday' }
        ];
    })
    .controller('FeedyCtrl', ['$scope', 'FeedyService', 'config', 'Feedz', function($scope, FeedyService, config, Feedz) {
        $scope.feedsources = Feedz;
        $scope.loadFeed = function(e, source) {
            FeedyService.parseFeed(source.url).then(function(res) {
                $scope.loadButonText = source.title;
                $scope.feeds = res.data.responseData.feed.entries;
                $scope.response = res;
            });
        };

        $scope.loadButonText = null;
        $scope.tabularize = function(feed){
            var dates = [];
            angular.forEach(feed.content, function(content, key){
                var itemdata =  Papa.parse(feed.content,{delimiter:'–', skipEmptyLines: true});
            dates.push(itemdata);
        });

            // var dates = [];
            // var children = $(data).children();

            $scope.dates = dates;
        };
    }]).controller('VideoCtrl',
    ["$sce", "$scope", "$window", "config", function($sce, $scope, $window, config) {
        var video = this;
        $scope.config = config;


        video.config = {
            sources: [],
            tracks: []
        };
        angular.forEach(config.videosrc, function(source, key) {
            video.config.sources.push($sce.trustAsResourceUrl(source));
        });
        angular.forEach(config.audiosrc, function(source, key) {
            video.config.tracks.push($sce.trustAsResourceUrl(source));
        });

        // video.config = {
        //     sources: [
        //         //{src: $sce.trustAsResourceUrl("https://cdn.filepicker.io/api/file/bbQUjDxLTUumApIUStAg"), type: "video/webm"}
        //          {src: $sce.trustAsResourceUrl("https://lexlab.io/files/public/charm.webm"), type: "video/webm"}
        //         //{src: $sce.trustAsResourceUrl("https://lexlab.io/files/public/lexspacevideo1.mov"), type: "video/mp4"}
        //         //{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
        //         //{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
        //     ],
        //     tracks: [
        //         // {
        //         //     src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
        //         //     kind: "subtitles",
        //         //     srclang: "en",
        //         //     label: "English",
        //         //     default: ""
        //         // }
        //     ],
        //     theme: "/lexlab-starter/node_modules/videogular-themes-default/videogular.css",
        //     plugins: {
        //         poster: "https://lexlab.io/llp_core/img/lexlab.svg"
        //     }
        //};

    }]
    );

angular.module("adf.widget.pagebuilder").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/pagebuilder/src/edit.html","<form role=form><div class=form-group><label for=templateurl>TemplateUrl</label> <input type=text class=form-control id=templateurl ng-model=page.config.url placeholder=\"Enter URL\" ng-change=loadTemplate(page.config) ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"><select ng-model=page.config.url ng-change=loadTemplate(config) ng-options=\"option.url as option.label for option in page.compsources\"><option label></option></select></div></form><p ng-bind-html=page.config.data></p><pre class=code><code>{{page.config.data}}</code></pre>");
$templateCache.put("{widgetsPath}/pagebuilder/src/patenttabwidget.html","<uib-tabset type=tabs justified=true class=\"panel panel-dark tabbable top-tabs\" style=width:100%;height:auto;><uib-tab class=\"panel-heading ng-click-active\" ng-repeat=\"num in config.patentnumbers\" heading=\"US {{num ||config.patentnumber | number:0}}\"><uib-tabset type=tabs justified=true class=\"panel panel-dark tabbable top-tabs\" style=width:100%;height:auto;><uib-tab heading=Cover><ng-annotate-text class=\"bs-callout bs-callout-NOA\" text=tree.abstract></ng-annotate-text></uib-tab><uib-tab heading=Figures><uib-carousel active=active interval=5000 no-wrap=false><uib-slide ng-repeat=\"drawing in tree.drawings track by $index\" index=$index><img ng-src={{drawing}} style=margin:auto;width:100%;height:fit-content;><div class=\"carousel-caption btn-dark\"><h4>Figure {{$index}}</h4><p>{{drawing}}</p></div></uib-slide></uib-carousel></uib-tab><uib-tab heading=\"Grant Text\"><ng-annotate-text class=\"card card-block\" text=tree.text></ng-annotate-text></uib-tab><uib-tab heading=Claims><input ng-model=query><d3pendingtree patent={{num}} tree=tree pattern={{query}}></d3pendingtree></uib-tab><uib-tab class=\"panel-heading ng-click-active\" ng-if=tree.pub heading=\"{{tree.pub.slice(0,4) + \'/ \' + tree.pub.slice(4,tree.pub.length)}}\"><input ng-model=query><d3pendingtree patent={{tree.pub}} tree=altree pattern={{query}}></d3pendingtree></uib-tab></uib-tabset></uib-tab></uib-tabset>");
$templateCache.put("{widgetsPath}/pagebuilder/src/rssfeeds.html","<form class=card-header style=width:100%;margin:0;><div class=row><div class=input-prepend><div class=btn-group uib-dropdown uib-keyboard-nav dropdown-append-to-body><button uib-dropdown-toggle class=\"btn btn-default btn-sm\" tabindex=-1 style=\"font-size: 1rem;\"><span class=caret>&nbsp</span></button> <button class=\"btn btn-glass btn-info btn-sm\" type=button tabindex=-1 style=\"font-size: 1rem;\" ng-show=\"loadButtonText == !null\">{{loadButtonText}} &nbsp</button><ul class=\"uib-dropdown-menu dropdown-menu\"><li ng-repeat=\"feedsource in feedsources | orderBy: [\'title\',\'url\']\"><a ng-click=loadFeed($event,feedsource); style=font-size:1rem;>{{feedsource.title}}</a></li></ul></div></div></div><div class=\"row input-prepend\" ng-show=\"feeds.length > 0\"><input class=pull-left type=text placeholder=Search data-ng-model=filterText> <span class=\"label label-warning pull-right\" ng-show=\"feeds.length > 0\" style=\"border-radius: 0.5rem;margin-top: 0.5rem;\">{{(feeds | filter:filterText).length}} Items</span></div></form><div class=card style=width:100%;height:100%;overflow:scroll;><dir-pagination-controls pagination-id=rsspagination template-url=/llp_core/bower_components/angular-utils-pagination/dirPagination.tpl.html></dir-pagination-controls><ul class=list-group style=\"text-align: left;\"><li dir-paginate=\"feed in feeds | filter:filterText | itemsPerPage: 15\" pagination-id=rsspagination class=list-group-item><h6><a ng-click=tabularize(feed) ng-bind-html=\"feed.title | highlight: filterText | trustAsHTML\"></a></h6><p class=text-left style=\"line-height: 1;\">{{feed.contentSnippet}} <small class=\"pull-right small\">{{feed.publishedDate | date:medium}}</small></p><pre class=code ng-bind=\"dates | json: 4\" ng-show=dates></pre><table><thead></thead><tbody><tr><td>{{feed.publishedDate | date:medium}}</td><td><table><thead></thead><tbody><tr ng-repeat=\"datum in dates\"><td><pre ng-bind=datum|json:2></pre></td></tr></tbody></table></td></tr></tbody><tfoot><tr><td>Data source: {{feed.author}}</td></tr></tfoot></table><div ng-bind-html=\"feed.content|patentlink | highlight: filterText | trustAsHTML\" ng-show=\"filterText.length > 0\"></div></li></ul></div>");
$templateCache.put("{widgetsPath}/pagebuilder/src/tabwidget.html","<uib-tabset><uib-tab heading=View><div ng-include=\"\'../src/templates/dashboard-edit.html\'\"></div></uib-tab><uib-tab ng-repeat=\"tab in tabs\" heading={{tab.title}} active=tab.active disable=tab.disabled>{{tab.content}}</uib-tab><uib-tab ng-repeat=\"tab in config.tabs\" heading={{tab.title}} active=tab.active disable=tab.disabled>{{tab.content}}</uib-tab><uib-tab heading=Data><div class=form-group ng-controller=ContentTreeCtrl ui-tree><label for=draftid>Select Document</label><ol ui-tree-nodes ng-model=tree.roarlist><li ui-tree-node ng-repeat=\"node in tree.roarlist | parents\" ng-include=\"\'quicklinkid\'\" node={{node}} data-collapsed=true></li></ol><script type=text/ng-template id=quicklinkid><div class=\"card card-rounded\" ng-class=\"{\'text-success\': (config.id === node.id)}\"> <a class=\"btn btn-xs\" ng-click=\"toggle(this)\" ng-if=\"node.roarlist\" style=\"\"><span class=\"fa \" ng-class=\"{\'fa-chevron-right\': collapsed, \'fa-chevron-down\': !collapsed}\" style=\"color:steelblue;transition:all 0.25s ease;\"></span></a> <a ng-click=\"config.id = node.id;$close();\" ng-class=\"{\'text-success\': (config.id === node.id)}\" class=\"\"><span class=\"fa fa-stack fa-pull-left fa-border\"><span class=\"fa fa-stack-2x fa-file-o\"><span class=\"fa fa-stack-1x\" style=\"font-size: 10px;vertical-align:bottom;\">{{node.roarlist.length}}</span></span></span>&nbsp;&nbsp;{{node.title}}<br><small class=\"text-muted\">{{node.date | date}}</small></a> </div> <ol ui-tree-nodes=\"\" ng-model=\"node.roarlist\" ng-class=\"{hidden: collapsed}\" style=\"\"> <li class=\"\" ng-repeat=\"(key, node) in node.roarlist\" ui-tree-node ng-include=\"\'quicklinkid\'\" style=\"padding-right:0rem;padding-bottom:0.1rem;\" node=\"{{node.id || node.$id || node.$value || node}}\" data-collapsed=\"true\"> </li> </ol></script></div></uib-tab></uib-tabset><script type=text/ng-template id=widgets/message/view.html>{{config.message}}</script><script type=text/ng-template id=widgets/message/edit.html><form role=\"form\"> <div class=\"form-group\"> <label for=\"editMessage\">Message</label> <input type=\"text\" id=\"editMessage\" class=\"form-control\" ng-model=\"config.message\"/> </div> </form></script>");
$templateCache.put("{widgetsPath}/pagebuilder/src/videoedit.html","<form role=form style=overflow:visible><div class=form-group><label for=loop>Loop?</label><switch ng-model=config.loop></switch></div><div class=form-group><label for=mute>Mute?</label><switch ng-model=config.mute></switch></div><div class=form-group><label for=clickevents>Allow User Clicks?</label><switch ng-model=config.clickevents></switch></div><div class=form-group><label for=startime>StartTime</label> <input type=number ng-model=config.start></div><div class=form-group><label for=ratio>Ratio</label> <input type=text ng-model=config.ratio></div><div class=form-group><label for=videoId>Video or Channel ID</label> <input type=text ng-model=config.videoId></div></form>");
$templateCache.put("{widgetsPath}/pagebuilder/src/videoplayer.html","<div class=well style=display:block;width:100%;height:100%;min-height:300px;><video-bg video-id=config.videoId ratio=config.ratio loop=config.loop mute=config.mute start=config.start content-z-index=config.contentz allow-click-events=config.clickevents></video-bg></div>");
$templateCache.put("{widgetsPath}/pagebuilder/src/view.html","<div ng-include=config.url></div><div ng-bind-html=page.data></div>");}]);})(window);