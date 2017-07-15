$(document).ready(function(){
    var util = {
        sectionPaddingTop : function(){
            return $('section:eq(0)').css('paddingTop');
        },

        chkMobile: function(){
            return window.matchMedia('(max-width: 801px)').matches;


        },

        chkSmallHeight: function(){
          return window.matchMedia('(max-height: 740px)').matches;
        },

        setAutoScrollingOff : function(){
            if(this.chkMobile()){
                // $('body').addClass('autoScrollingOff');
                $.fn.fullpage.setAutoScrolling(false);
                $.fn.fullpage.setFitToSection(false);
            }else{
                // $('body').removeClass('autoScrollingOff');
                $.fn.fullpage.setAutoScrolling(true);
                $.fn.fullpage.setFitToSection(true);
            }
        },


        fullPageReBuild: function(){
            setTimeout(function(){
                $.fn.fullpage.reBuild();
            },100);
        }
    };

    var showHideHeader = {
        touchStartY: 0,
        touchEndY: 0,
        init : function(e){
            var _this = this,
                _target = $(document);

            _target.on('touchstart', function(e){
                var el = e.originalEvent;
                _this.touchStartY = el.targetTouches[0].pageY;
            });

            _target.on('touchmove', function(e){
                var el = e.originalEvent;
                _this.touchEndY = el.targetTouches[0].pageY;
            });

            _target.on('touchend', function(e){
                var touchDirection = {};

                touchDirection.type = 'touch';
                touchDirection.direction = '';

                if((_this.touchStartY < _this.touchEndY)){
                    touchDirection.direction = 'down';
                    _target.trigger(touchDirection);
                }else if(_this.touchEndY !== 0){
                    touchDirection.direction = 'up';
                    _target.trigger(touchDirection);
                }

                _this.touchStartY = 0;
                _this.touchEndY = 0;
            });
        }
    };

    // circle progress
    var circleProgess = function(id, val, total, htOptions){
        $('#' + id).find('svg').remove();

        var w = 230,
            h = 230,
            stroke = 1,
            r = Raphael(id, w, h),
            R = (w/2) - (stroke/2) - 5,
            delay = htOptions ? htOptions.delay : 0,
            rColor = {
                'bgColor' : htOptions ? htOptions.bgColor : '#CCCCCC',
                'fgColor' : htOptions ? htOptions.fgColor : '#FF9C01'
            },
            rAniColor = rColor.bgColor,
            param = {stroke: rColor.bgcolor, "stroke-width": stroke},
            html = ['.val', '.total'],
            updateVal = function(id, value, total, R, hand, string, color) {
                rAniColor = color;
                hand.animate({arc: [value, total, R]}, 900, ">");

                // if(string === true){
                //     $('#' + id).parent().find(html[0]).html(value);
                //     $('#' + id).parent().find(html[1]).html(total);
                // }
            };

        // Custom Attribute
        r.customAttributes.arc = function (value, total, R) {
            if(value > 0){
                var alpha = 360 / total * value,
                    a = (90 - alpha) * Math.PI / 180,
                    x = w/2 + R * Math.cos(a),
                    y = w/2 - R * Math.sin(a),
                    color = rAniColor,
                    path;
                if (total == value) {
                    path = [["M", w/2, w/2 - R], ["A", R, R, 0, 1, 1, w/2-0.11, w/2 - R]];
                } else {
                    path = [["M", w/2, w/2 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
                }

                return {path: path, stroke: color};
            }
        };

        var cirlce = r.path().attr(param).attr({arc: [10, 10, R]}),
            cirlce2 = r.path().attr(param).attr({arc: [0, 10, R]});

        // updateVal(10, 10, R, cirlce, false, '#EFEFEF');
        setTimeout(function(){
            updateVal(id, val, total, R, cirlce2, true, rColor.fgColor);
        }, delay);
    };

    // history page circle animation value
    var historyCircleProgess = {
        init: function(){
            circleProgess('y2013', 3, 6, {
                'bgColor': '#5C5B5B',
                'fgColor': '#21c175',
                'delay': 500
            });

            circleProgess('y2014', 4.5, 6, {
                'bgColor': '#5C5B5B',
                'fgColor': '#21c175',
                'delay': 500
            });

            circleProgess('y2015', 6, 6, {
                'bgColor': '#5C5B5B',
                'fgColor': '#21c175',
                'delay': 500
            });
        },

        reset: function(){
            circleProgess('y2013', 0, 6, {
                'bgColor': '#5C5B5B',
                'fgColor': '#21c175',
                'delay': 0
            });

            circleProgess('y2014', 0, 6, {
                'bgColor': '#5C5B5B',
                'fgColor': '#21c175',
                'delay': 0
            });

            circleProgess('y2015', 0, 6, {
                'bgColor': '#5C5B5B',
                'fgColor': '#21c175',
                'delay': 0
            });
        }
    };

    var vimeoPlayerObj = null,
        vimeoPlayer = {
            init: function(e, playerId, videoWraper, type){
                $(videoWraper).addClass('active');
                $(videoWraper).attr('data-kind', type);

                var _this = $(e.target),
                    iframe = null,
                    ifrm = document.createElement('IFRAME');

                ifrm.setAttribute('src', 'https://player.vimeo.com/video/' + _this.attr('data-videoId') + '?api=1&player_id=' + _this.attr('data-id'));
                ifrm.setAttribute('id', _this.attr('data-id'));
                ifrm.setAttribute('class', 'videoPlayerIframe');
                ifrm.setAttribute('frameborder', 0);
                ifrm.setAttribute('webkitallowfullscreen', '');
                ifrm.setAttribute('mozallowfullscreen', '');
                ifrm.setAttribute('allowfullscreen', '');

                $('.vimeoPlayer').append(ifrm);

                iframe = $('#' + _this.attr('data-id'))[0];

                vimeoPlayerObj = $f(iframe);

                vimeoPlayerObj.addEvent('ready', function() {
                    setTimeout(function(){
/*
                        if(!util.chkMobile()){

                        }
*/
vimeoPlayerObj.api('play');
$('#introVideo').hide();
                        $(videoWraper).addClass('init');

                        vimeoPlayerObj.addEvent('pause', onPause);
                        vimeoPlayerObj.addEvent('finish', onFinish);
                    }, 300);
                });

                function onPause(id) {
                    window.scrollTo(0,0);
                }

                function onFinish(id) {
                    $(videoWraper).removeClass('active init');
                    $('body').removeClass('touchDown');

                    //iphone bug fix
                    window.scrollTo(0,0);
                }
            },
            close: function(e){
                var _this = $(e.target);
/*
                if(util.chkMobile() && !_this.hasClass('close')){
                    return false;
                }else
                */
                    _this = (!_this.hasClass('videoPlayerWrap')) ? _this.parents('.videoPlayerWrap') : _this ;


                vimeoPlayerObj = null;

                $('.videoPlayerIframe').remove();

          if(!util.chkMobile())
            $('#introVideo').show();

         if(util.chkMobile() && $('html').hasClass('iphone')){
             if(_this.attr('data-kind') === 'intro') $.fn.fullpage.moveTo('intro');
            else $.fn.fullpage.moveTo('people');
         }

                _this.removeAttr('data-kind').removeClass('active init');
                $('body').removeClass('touchDown');
            }
        };

    var fullpageInit = function(){
        var introVideoControllTimer = null;

        $('#fullpage').fullpage({
            paddingTop: util.sectionPaddingTop(),
            paddingBottom: '0',
            fixedElements:'#header',
            menu: '#header nav ul',
            navigation:true,
            slidesNavigation: true,
            slidesNavPosition: 'bottom',
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 99999999,

            afterLoad: function(anchorLink, index){
                var loadedSection = $(this);

                // afterLoad 중복 발생 오류 해결용
                // fullpage.js 최신버전에서는 해결되었으나 #footer 섹션 처리 오류 발생으로 인해 버전업 X
                introVideoControllTimer = setTimeout(function(){
                    // service > intro video 제어
                    if(anchorLink === 'intro') {
                        $('#introVideo').trigger('play');
                    }else{
                        $('#introVideo').trigger('pause');
                    }
                }, 500);

                //service 페이지 배경 처리를 위한 class 처리
                $('#fullpage .section').removeClass('prev');
                if(index > 1){
                    $('#fullpage .section').eq(index-1).addClass('prev');
                }

                // service footer 활성화시 dodollauncher 처리
                if(anchorLink === 'footer'){
                    $('#fullpage .section.dodollauncher').removeClass('deactived');
                    loadedSection.prev().addClass('keep');
                }else{
                    $('#fullpage .keep').removeClass('keep');
                }

                // history2 메뉴 및 라운드 애니메이션 처리
                // if(loadedSection.hasClass('history2')){
                //     // $('#header nav [data-menuanchor="history"]').addClass('active');
                //
                //     // circleProgess init
                //     historyCircleProgess.init();
                // }

                // Service 페이지 시작시 BAND 애니메이션 처리
                if(window.location.hash === '' && anchorLink === 'dummy'){
                    setTimeout(function () {
                        $.fn.fullpage.moveTo('band');
                        $('.section.dummy').remove();
                        $('#fp-nav li:first-child').remove();
                    }, 100);
                }else if(anchorLink === 'dummy'){
                    $('.section.dummy').remove();
                    $('#fp-nav li:first-child').remove();
                }

                if(index === 1){
                    $('body').removeClass('touchDown');
                }
            },

            afterRender: function(){
                var pluginContainer = $(this);

                // history2 라운드 애니메이션 초기화
                if(pluginContainer.hasClass('sCompany')){
                    // historyCircleProgess.reset();

                    // 높이가 좁은 노트북 등에서 발생하는 height 오류 수정
                    if(!util.chkMobile()) util.fullPageReBuild();
                }

                util.setAutoScrollingOff();
            },

            onLeave: function(index, nextIndex, direction){
                var leavingSection = $(this);

                clearTimeout(introVideoControllTimer);

                $('#fullpage .section').removeClass('deactived');
                leavingSection.addClass('deactived');

                // history2 라운드 에니메이션 reset
                // if(leavingSection.hasClass('history2')){
                //     historyCircleProgess.reset();
                // }
            },

            afterResize: function(){
                util.setAutoScrollingOff();
                util.fullPageReBuild();

                // service > intro video 제어
            /*    if(util.chkMobile()){
                    $('#introVideo').trigger('pause');
                }else
                */
                if(window.location.hash === '#intro'){
                    $('#introVideo').trigger('play');
                }
            }
        });
    };

    // 언어 선택
    $('.lang button').on('click', function(){
        $(this).parent().toggleClass('on');
    });

    $('.langList').on('mouseleave', function(){
        $(this).parent().removeClass('on');
    });

    // 상단 메뉴선택시
    $('.btnMenu').on('click', function(){
        $('.lang.on').removeClass('on');
        $(this).parent().toggleClass('on');
    });

    $('#header nav a').on('click', function(){
        $(this).parents('nav').removeClass('on');
    });

    // sitemap
    $('#sitemap .close').on('click', function(){
        $(this).parent().removeClass('on');
        $('#fp-nav').removeClass('sitemapOn');
    });

    $('.openSitemap').on('click', function(e){
        $('#sitemap').toggleClass('on');
        $('#fp-nav').toggleClass('sitemapOn');
        e.preventDefault();
    });

    $('#infoNav').on('change', function(){
        window.location.href = $(this).val();
    });

    $(document).on('touch', function(e){
        if(!$('#header nav').hasClass('on')){
            if(e.direction === 'up'){
                $('body').addClass('touchDown');
            }else{
                $('body').removeClass('touchDown');
            }

            if($('#fullpage').length){
                $.fn.fullpage.setFitToSection(true);
            }
        }
    });

    $('#btnIntroPlay, #btnRecruitPlayer').on('click', function(e){
        vimeoPlayer.init(e, '#' + $(this).attr('data-id') + 'Wrap', '.videoPlayerWrap', $(this).attr('data-kind'));
        e.preventDefault();
    });

    $('body').on('click', '.videoPlayerWrap.active', function(e){
        vimeoPlayer.close(e);
    });

    $(window).on('mousewheel DOMMouseScroll touchmove', function(e){
        if($('.videoPlayerWrap.active').length){
          /*  if(util.chkMobile()){
                e.preventDefault();
            }else{
            */
                if($(this).attr('data-kind') === 'intro') $.fn.fullpage.moveTo('intro');
                else $.fn.fullpage.moveTo('people');

        }
    });

    showHideHeader.init();

    //비 fullpage 리사이즈시 발생하는 body scoll 오류 수정
    if($('#fullpage').length) fullpageInit();
});

// ie9 matchMedia 적용
window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());
