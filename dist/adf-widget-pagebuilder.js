(function(window, undefined) {'use strict';


angular.module('adf.widget.pagebuilder', ['adf.provider','ngSanitize',
            'com.2fdevs.videogular',
            'com.2fdevs.videogular.plugins.controls',
            'com.2fdevs.videogular.plugins.overlayplay',
            'com.2fdevs.videogular.plugins.poster'
           ])
    .config(["dashboardProvider", function(dashboardProvider) {
        dashboardProvider
            .widget('placeholder',{
                title: '',
                description: '',
                template: '<div class="hide"/>',
                frameless:true,
                styleClass: 'hide'   
            }).widget('lexfeed',{
                title: 'LexFeed',
                description: 'RSS Feed Reader',
                templateUrl: '{widgetsPath}/pagebuilder/src/rssfeeds.html',
                controller: 'FeedCtrl',
                frameless:true,
                reload: true,
                styleClass: 'panel-info'   
            })
            .widget('videoplayer',{
                title: 'LexScreen',
                description: 'videoplayer',
                templateUrl: '{widgetsPath}/pagebuilder/src/videoplayer.html',
                controller: 'VideoCtrl',
                controllerAs: 'video',
                frameless: false,
                reload: true,
                styleClass: 'dark-bg',
                edit:{
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
                frameless: 'frameless',
                controller: 'PageBuilderCtrl',
                controllerAs: 'page',
		styleClass: 'panel-default',
                //reload: true,
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
    }]);
angular.module('adf.widget.pagebuilder').controller('PageBuilderConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce','$templateCache',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce, $templateCache) {
          var page = this;
          page.config = config;
            page.loadTemplate = function(config) {
                $http.get(config.url).then(function(resp) {
                    page.data = resp.data;
                });
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
    .controller('PageBuilderCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce','Collection',
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
    ]).factory('FeedyService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    };
}])
.controller("FeedCtrl", ['$scope','FeedyService','config', function ($scope,FeedyService,config) {
    var config = config;
    $scope.loadFeed=function(e){
        FeedyService.parseFeed($scope.feedSrc).then(function(res){
            $scope.loadButonText=angular.element(e.target).text();
            $scope.feeds=res.data.responseData.feed.entries;
            config.src = $scope.feedSrc;
        });
    };
    $scope.loadFeed(config.src);
    $scope.loadButonText=null;
}]).controller('VideoCtrl',
        ["$sce","$scope","$window","config", function ($sce,$scope,$window,config) {
            var video = this;
            $scope.config = config;
            video,config = {
                sources: [],
                tracks: []
            };
            angular.forEach(config.videosrc, function(source, key){
                video.config.sources.push($sce.trustAsResourceUrl(source));
            });
            angular.forEach(config.audiosrc, function(source, key){
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
$templateCache.put("{widgetsPath}/pagebuilder/src/rssfeeds.html","<div id=rssfeedspanel class=\"panel panel-info sub-independent\" style=\"overflow: hidden;max-height: 75.5rem;\"><div class=panel-heading style=\"max-height: 5rem;\"><h4 class=splash style=margin-top:0rem;>News</h4></div><div class=panel-body style=\"width: 100%; height: 55.5rem; overflow: scroll;\"><div class=container ng-controller=FeedCtrl><div class=row><form><div class=row><div class=input-prepend><div class=\"btn-group col-xs-6 pull-right\" uib-dropdown uib-keyboard-nav dropdown-append-to-body><button uib-dropdown-toggle class=\"btn btn-info dropdown-toggle pull-right btn-sm\" tabindex=-1 style=\"border-top-right-radius: 1rem;border-bottom-right-radius:1rem;font-size: 0.6rem;\"><span class=caret>&nbsp</span></button> <button class=\"btn btn-info pull-right btn-sm\" type=button tabindex=-1 style=\"font-size: 0.6rem;border-bottom-left-radius: 1rem;border-top-left-radius: 1rem;\" ng-show=\"loadButtonText = !null\">{{loadButonText}} &nbsp</button><ul class=\"uib-dropdown-menu dropdown-menu\"><li><a ng-click=\"feedSrc=\'http://patentlyo.com/feed\';loadFeed($event);\" style=\"font-size: 0.8rem;\">Patently-O</a></li><li><a ng-click=\"feedSrc=\'http://ptolitigationcenter.com/feed/\';loadFeed($event);\" style=\"font-size: 0.8rem;\">PTO Litigation Center</a></li><li><a ng-click=\"feedSrc=\'http://www.law360.com/ip/rss\';loadFeed($event)\" style=\"font-size: 0.8rem;\">IP Law360</a></li><li><a ng-click=\"feedSrc=\'http://feeds.feedblitz.com/AMLaw\';loadFeed($event)\" style=\"font-size: 0.8rem;\">AMLaw Daily</a></li><li><a ng-click=\"feedSrc=\'http://feeds.feedblitz.com/TAL\';loadFeed($event)\" style=\"font-size: 0.8rem;\">AM Law</a></li></ul></div><input type=text class=\"col-xs-6 pull-right\" autocomplete=off placeholder=\"Enter Feed URL\" data-ng-model=feedSrc></div></div><div class=\"row input-prepend\" ng-show=\"feeds.length > 0\"><input class=pull-left type=text placeholder=Search data-ng-model=filterText> <span class=\"label label-warning pull-right\" ng-show=\"feeds.length > 0\" style=\"border-radius: 0.5rem;margin-top: 0.5rem;\">{{(feeds | filter:filterText).length}} Items</span></div></form></div><div class=row-fluid><ul class=list-group style=\"text-align: left;\"><li ng-repeat=\"feed in feeds | filter:filterText\" class=list-group-item><h6><a href={{feed.link}} onclick=\"window.open(this.href, \'\', \'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=yes,dependent=no,width=800,left=150,height=500,top=150\'); return false;\">{{feed.title}}</a></h6><p class=text-left style=\"line-height: 1;\">{{feed.contentSnippet}} <small class=\"pull-right small\">{{feed.publishedDate | date}}</small></p></li></ul></div></div></div></div>");
$templateCache.put("{widgetsPath}/pagebuilder/src/videoedit.html","<form role=form style=overflow:visible><div class=form-group><div class=col-sm-8><label for=poster>Poster/CoverArt</label> <input type=text class=form-control id=poster ng-model=config.poster placeholder=\"Enter URL\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"></div><div class=col-sm-4><img ng-src=\"{{config.poster || \'https://placehold.it/250x200/222222/ffa/&text=G%20%26%20S\'}}\" class=\"img img-thumbnail img-responsive\"></div></div><div class=form-group><label for=videosource>Video Source(s)</label><div class=input-group><input type=text class=form-control id=videosource ng-model=config.videosrc[0] placeholder=\"Enter URL\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"> <button class=\"btn input-group-addon btn-primary fa fa-plus\" ng-click=\"config.videosrc.unshift(\'about:blank\')\"></button></div><small ng-repeat=\"source in config.videosrc\">{{source}}<a class=\"fa fa-remove text-danger\" ng-click=config.videosrc.slice(config.videosrc.indexOf(source),1)></a></small></div><div class=form-group><div class=col-sm-6><label for=autoplay>AutoPlay?</label> <input type=checkbox class=form-control id=autoplay value=true ng-model=config.autoplay></div><div class=col-sm-6><label for=starttime>StartTime</label> <input type=time class=form-control id=starttime ng-model=config.starttime></div></div><div class=form-group><label for=audiosource>Audio Track(s)</label><div class=input-group><input type=text class=form-control id=audiosource ng-model=config.audiosrc[0] placeholder=\"Enter URL\" ng-model-options=\"{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }\"> <button class=\"btn btn-primary input-group-addon fa fa-plus\" ng-click=\"config.audiosrc.unshift(\'about:blank\')\"></button></div><small ng-repeat=\"source in config.audiosrc\">{{source}}<a class=\"fa fa-remove text-danger\" ng-click=config.audiosrc.slice(config.audiosrc.indexOf(source),1)></a></small></div></form>");
$templateCache.put("{widgetsPath}/pagebuilder/src/videoplayer.html","<div class=videogular-container style=\"padding: 15px;margin:10px;display:flex;position:absolute;top:10px;right:-10px;bottom:20px;left:10px;\"><videogular vg-theme=\"\'/lexlab-starter/node_modules/videogular-themes-default/videogular.css\'\" vg-complete vg-auto-play=config.autoplay vg-start-time={{config.starttime}}><vg-media vg-src=video.config.sources vg-tracks=video.config.tracks><vg-controls><vg-play-pause-button></vg-play-pause-button><vg-time-display ng-bind-template=\"{{ currentTime | date:\'mm:ss\' }}\"></vg-time-display><vg-scrub-bar><vg-scrub-bar-buffer></vg-scrub-bar-buffer><vg-scrub-bar-current-time></vg-scrub-bar-current-time></vg-scrub-bar><vg-time-display ng-bind-template=\"{{ timeLeft | date:\'mm:ss\' }}\"></vg-time-display><vg-volume><vg-mute-button></vg-mute-button><vg-volume-bar></vg-volume-bar></vg-volume><vg-fullscreen-button></vg-fullscreen-button></vg-controls></vg-media><vg-overlay-play></vg-overlay-play><vg-poster vg-url=config.poster></vg-poster></videogular></div>");
$templateCache.put("{widgetsPath}/pagebuilder/src/view.html","<div ng-include=config.url></div><div ng-bind-html=page.template></div>");}]);})(window);