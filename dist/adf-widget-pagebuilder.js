(function(window, undefined) {'use strict';


angular.module('adf.widget.pagebuilder', ['adf.provider', 'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
])
    .config(["dashboardProvider", function(dashboardProvider) {
        dashboardProvider
            .widget('placeholder', {
                title: '-',
                description: '-',
                template: '<uib-alert type="warning" close><span class="fa fa-5x fa-ra"></span></uib-alert>',
                frameless: false,
                styleClass: 'alert alert=warning'
            }).widget('lexfeed', {
                title: 'LexFeed',
                description: 'RSS Feed Reader',
                templateUrl: '{widgetsPath}/pagebuilder/src/rssfeeds.html',
                controller: 'FeedyCtrl',
                frameless: false,
                reload: true,
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
                reload: true,
                //titleTemplateUrl: '{widgetsPath}/getphd/src/titleTemplate.html',
                edit: {
                    templateUrl: '{widgetsPath}/pagebuilder/src/edit.html',
                    controller: 'PageBuilderConfigCtrl',
                    controllerAs: 'page',
                    modalSize: 'lg',
                    reload: true,
                    immediate: true
                }

            }).widget("message", {
                title: "Message",
                description: "Displays a message",
                templateUrl: "widgets/message/view.html",
                //controller: "MessageWidgetController",
                styleClass: 'alert alert-info',
                frameless: false,
                config: {
                    message: "This is the default message."
                },
                edit: {
                    templateUrl: "widgets/message/edit.html"
                }
            })
            .widget("tabs", {
                title: "Tabs",
                description: "Demonstrates UI Bootstrap tabs in a widget",
                templateUrl: "{widgetsPath}/pagebuilder/src/tabwidget.html",
                //controller: "TabsWidgetController",
                styleClass: 'panel-default',
                resolve: {
                    tabs: [function() {
                        return [
                            { title: "Resolved", content: "Tab content from widget resolve" }
                        ];
                    }]
                },
                frameless: false,
                config: {
                    tabs: [
                        { title: "Default Tab 1", content: "Default tab content 1" },
                        { title: "Default Tab 2", content: "Default tab content 2" }
                    ]
                }
            }).widget('d3claimtreemap', {
                title: 'Patent Claim Dependency',
                titleTemplateUrl: '{widgetsPath}/testwidget/src/title.html',
               templateUrl: "{widgetsPath}/pagebuilder/src/patenttabwidget.html",
                description: 'view dependency tree of any published patent claim set',
             
                controller: ['$sce', 'config', '$scope', '$compile', function($sce, config, $scope, $compile) {
                    $scope.configs = $compile($sce.trustAsHtml(config.content))($scope);
                }],
                styleClass: 'card card-block',
                frameless: false,
                reload: true,
                edit: {
                    template: '<form class="card"><label for="patentnumber">Enter embed code</label><input name="patentnumber" class="form-control" ng-model="config.patentnumber"></input></form>',
                    immediate: true,
                    reload: true
                }
            });
    }]);
angular.module('adf.widget.pagebuilder').controller('PageBuilderConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce', '$templateCache',
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
            }]
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
$templateCache.put("{widgetsPath}/pagebuilder/src/patenttabwidget.html","<uib-tabset type=tabs justified class=\"panel panel-dark tabbable top-tabs\" style=width:100%;height:auto;><uib-tab heading=\"US {{config.pnum | number:0}}\"><d3pendingtree patent=config.pnum tree=tree pattern={{query}}></d3pendingtree></uib-tab><uib-tab heading=\"{{tree.pub.slice(0,4) + \'/\' + tree.pub.slice(4,tree.pub.length)}}\"><d3pendingtree patent=tree.pub tree=altree pattern={{query}}></d3pendingtree></uib-tab><uib-tab ng-repeat=\"tab in tabs\" heading={{tab.title}} active=tab.active disable=tab.disabled>{{tab.content}}</uib-tab><uib-tab ng-repeat=\"tab in config.tabs\" heading={{tab.title}} active=tab.active disable=tab.disabled>{{tab.content}}</uib-tab><uib-tab heading=View><button class=\"alert btn-glass btn-primary img card-rounded row\" style=\"position:relative;display:flex;display:-webkit-flex;align-items:center;align-content:center;justify-content:space-between;flex-direction:row;background-color:#35688F;padding:2px;box-shadow:inset 10px 2px 50px rgba(0,0,0,0.5);\" ng-click=main.collapse()><div style=display:flex;justify-content:flex-end;flex-direction:column;align-content:flex-end;vertical-align:middle;align-items:flex-end;><h4 class=\"card-title ng-binding display-4\" style=\"margin-bottom:0;color: #fff;\">US {{phd.patent.number | number:0 }}</h4><h5 class=\"card-subtitle ng-binding\" style=color:#ddd;><span class=lead>USSN {{phd.application[\'Application Number\']}}</span></h5></div><img src=/llp_core/img/GoldLion.svg class=\"img lionlogofilter\" style=\"width:75px;height: auto;\"><div style=display:flex;flex-direction:column;align-items:flex-start;justify-content:space-around;><img src=/llp_core/img/GoldLogoLong.svg class=img style=height:45px;> <img src=/llp_core/img/GoldPhdLogoLong.svg class=img style=height:25px;padding-left:2px;></div></button>Tab content hard-coded in view.</uib-tab></uib-tabset>");
$templateCache.put("{widgetsPath}/pagebuilder/src/rssfeeds.html","<form class=card-header style=width:100%;margin:0;><div class=row><div class=input-prepend><div class=btn-group uib-dropdown uib-keyboard-nav dropdown-append-to-body><button uib-dropdown-toggle class=\"btn btn-glass btn-info btn-sm\" tabindex=-1 style=\"font-size: 1rem;\"><span class=caret>&nbsp</span></button> <button class=\"btn btn-glass btn-info btn-sm\" type=button tabindex=-1 style=\"font-size: 1rem;\" ng-show=\"loadButtonText == !null\">{{loadButtonText}} &nbsp</button><ul class=\"uib-dropdown-menu dropdown-menu\"><li ng-repeat=\"feedsource in feedsources | orderBy: [\'title\',\'url\']\"><a ng-click=loadFeed($event,feedsource); style=font-size:1rem;>{{feedsource.title}}</a></li></ul></div></div></div><div class=\"row input-prepend\" ng-show=\"feeds.length > 0\"><input class=pull-left type=text placeholder=Search data-ng-model=filterText> <span class=\"label label-warning pull-right\" ng-show=\"feeds.length > 0\" style=\"border-radius: 0.5rem;margin-top: 0.5rem;\">{{(feeds | filter:filterText).length}} Items</span></div></form><div class=card style=width:100%;height:100%;overflow:scroll;><dir-pagination-controls pagination-id=rsspagination template-url=/llp_core/bower_components/angular-utils-pagination/dirPagination.tpl.html></dir-pagination-controls><ul class=list-group style=\"text-align: left;\"><li dir-paginate=\"feed in feeds | filter:filterText | itemsPerPage: 15\" pagination-id=rsspagination class=list-group-item><h6><a ng-href={{feed.link}} onclick=\"window.open(this.href, \'\', \'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=yes,dependent=no,width=800,left=150,height=500,top=150\');\">{{feed.title}}</a></h6><p class=text-left style=\"line-height: 1;\">{{feed.contentSnippet}} <small class=\"pull-right small\">{{feed.publishedDate | date}}</small></p><div ng-bind-html=\"feed.content | highlight: filterText | trustAsHTML\" ng-show=\"filterText.length > 0\"></div></li></ul></div>");
$templateCache.put("{widgetsPath}/pagebuilder/src/tabwidget.html","<uib-tabset><uib-tab ng-repeat=\"tab in tabs\" heading={{tab.title}} active=tab.active disable=tab.disabled>{{tab.content}}</uib-tab><uib-tab ng-repeat=\"tab in config.tabs\" heading={{tab.title}} active=tab.active disable=tab.disabled>{{tab.content}}</uib-tab><uib-tab heading=View>Tab content hard-coded in view.</uib-tab></uib-tabset><script type=text/ng-template id=widgets/message/view.html>{{config.message}}</script><script type=text/ng-template id=widgets/message/edit.html><form role=\"form\"> <div class=\"form-group\"> <label for=\"editMessage\">Message</label> <input type=\"text\" id=\"editMessage\" class=\"form-control\" ng-model=\"config.message\"/> </div> </form></script>");
$templateCache.put("{widgetsPath}/pagebuilder/src/videoedit.html","<form role=form style=overflow:visible><div class=form-group><div class=col-sm-8><label for=poster>Poster/CoverArt</label> <input type=text class=form-control id=poster ng-model=config.poster placeholder=\"Enter URL\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"></div><div class=col-sm-4><img ng-src=\"{{config.poster || \'https://placehold.it/250x200/222222/ffa/&text=G%20%26%20S\'}}\" class=\"img img-thumbnail img-responsive\"></div></div><div class=form-group><label for=videosource>Video Source(s)</label><div class=input-group><input type=text class=form-control id=videosource ng-model=config.videosrc[0] placeholder=\"Enter URL\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"> <button class=\"btn input-group-addon btn-primary fa fa-plus\" ng-click=\"config.videosrc.unshift(\'about:blank\')\"></button></div><small ng-repeat=\"source in config.videosrc\">{{source}}<a class=\"fa fa-remove text-danger\" ng-click=config.videosrc.slice(config.videosrc.indexOf(source),1)></a></small></div><div class=form-group><div class=col-sm-6><label for=autoplay>AutoPlay?</label> <input type=checkbox class=form-control id=autoplay value=true ng-model=config.autoplay></div><div class=col-sm-6><label for=starttime>StartTime</label> <input type=time class=form-control id=starttime ng-model=config.starttime></div></div><div class=form-group><label for=audiosource>Audio Track(s)</label><div class=input-group><input type=text class=form-control id=audiosource ng-model=config.audiosrc[0] placeholder=\"Enter URL\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"> <button class=\"btn btn-primary input-group-addon fa fa-plus\" ng-click=\"config.audiosrc.unshift(\'about:blank\')\"></button></div><small ng-repeat=\"source in config.audiosrc\">{{source}}<a class=\"fa fa-remove text-danger\" ng-click=config.audiosrc.slice(config.audiosrc.indexOf(source),1)></a></small></div></form>");
$templateCache.put("{widgetsPath}/pagebuilder/src/videoplayer.html","<div class=\"videogular-container img img-responsive\" style=\"padding: 0;margin:0;display:flex;width:100%;height:auto;border:5px ridge #ffa;\"><videogular vg-theme=\"\'/lexlab-starter/node_modules/videogular-themes-default/videogular.css\'\" vg-complete vg-auto-play vg-start-time><vg-media vg-src=video.config.sources vg-tracks=video.config.tracks></vg-media><vg-controls><vg-play-pause-button></vg-play-pause-button><vg-time-display ng-bind-template=\"{{ currentTime | date:\'mm:ss\' }}\"></vg-time-display><vg-scrub-bar><vg-scrub-bar-buffer></vg-scrub-bar-buffer><vg-scrub-bar-current-time></vg-scrub-bar-current-time></vg-scrub-bar><vg-time-display ng-bind-template=\"{{ timeLeft | date:\'mm:ss\' }}\"></vg-time-display><vg-volume><vg-mute-button></vg-mute-button><vg-volume-bar></vg-volume-bar></vg-volume><vg-fullscreen-button></vg-fullscreen-button></vg-controls><vg-overlay-play></vg-overlay-play><vg-poster vg-url=config.poster></vg-poster></videogular></div>");
$templateCache.put("{widgetsPath}/pagebuilder/src/view.html","<div ng-include=config.url></div><div ng-bind-html=page.data></div>");}]);})(window);