'use strict';

angular.module('adf.widget.pagebuilder', ['adf.provider', 'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
])
    .config(function(dashboardProvider) {
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
                    template: '<form class="card"><label for="patentnumber">Enter numbers</label><input name="patentnumber" class="form-control" ng-model="config.patentnumbers" ng-list /></form>',
                    immediate: true,
                    reload: true
                }
            });
    });
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
            var data = feed.content;
            var dates = [];
            angular.forEach(data, function(datum, key){
                var props = [];
               try{
               var line = datum.split('<br/>');
               props.push(line);
               angular.forEach(props, function(prop, key){
                   var pop = prop.indexOf('-');
                   var kley = prop.slice(0,pop);
                   var value = prop.slice(pop, prop.length);
               debugger;
               var da = new Object.create({kley: value});
               debugger;
               dates.push(da);
               });
               }catch(ex){console.log(ex);}
               finally{}
            });
            debugger;
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