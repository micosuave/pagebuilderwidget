'use strict';

angular.module('adf.widget.pagebuilder', ['adf.provider', 'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster'
])
    .config(function(dashboardProvider) {
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

             })
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
            //})
            .widget('d3claimtreemap', {
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
                url: '/llp_core/modules/roarmap/directive/roargrid/roarpage.html',
                label: 'ROARpages'
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
    ]).factory('FeedyService', ['$http','$sce', function($http, $sce) {
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
    .factory('ffeeds', function($firebaseArray, $rootScope){
        return function(){
            var ref = firebase.database().ref().child('users').child($rootScope.authData.uid).child('RSS');
            return $firebaseArray(ref);
        }
    })
    .controller('FeedyCtrl', ['$scope', 'FeedyService', 'config', 'Feedz','ffeeds', function($scope, FeedyService, config, Feedz, ffeeds) {
        $scope.feedsources = Feedz;
        $scope.user_feeds = ffeeds();

        $scope.loadFeed = function(e, source) {
            FeedyService.parseFeed(source.url).then(function(res) {
                $scope.loadButonText = source.title;
                $scope.response = res;
                $scope.feeds = res.data ? res.data.responseData ? res.data.responseData.feed.entries : [] : []
 
            });
        };

        $scope.loadButonText = null;
        $scope.tabularize = function(feed){
            var dates = [];
            angular.forEach(feed.content, function(content, key){
                var itemdata =  Papa.parse(feed.content,{delimiter:'–', skipEmptyLines: true});
            dates.push(itemdata);
        });
        $scope.addFeed = function(title, url){
            $scope.user_feeds.$add({"title": title, "url": url});
        }

            // var dates = [];
            // var children = $(data).children();

            // $scope.dates = dates;
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
        //          {src: $sce.trustAsResourceUrl("./files/public/charm.webm"), type: "video/webm"}
        //         //{src: $sce.trustAsResourceUrl("./files/public/lexspacevideo1.mov"), type: "video/mp4"}
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
        //         poster: "./llp_core/img/lexlab.svg"
        //     }
        //};

    }]
    );
