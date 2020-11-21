$(document).ready(function () {

    "use strict";


    /* _____________________________________

     Device Detection
     _____________________________________ */

    // Mobile Detect
    var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(self._navigator && self._navigator.userAgent);
    var isTouch = !!(('ontouchend' in window) || (self._navigator && self._navigator.maxTouchPoints > 0) || (self._navigator && self._navigator.msMaxTouchPoints > 0));


    /* _____________________________________

     Preloader
     _____________________________________ */

    var loader = $(".loader");

    if (loader.length) {
      $('.fade-in').css({ position: 'relative', opacity: 0, top: -14 });
		setTimeout(function(){
			$('#preload-content').fadeOut(800, function(){
				$('.loader').fadeOut(1000);
				setTimeout(function(){
					$('.fade-in').each(function(index) {
						$(this).delay(800*index).animate({ top : 0, opacity: 1 }, 800);
					});
				}, 800);
			});
		}, 400);
    }
	
	
	$(window).load(function(){
    $(".animate").addClass("in");

	});
	

	/* _____________________________________

     Count Down
     _____________________________________ */

    var time = $('.count-down');
    if (time.length) {
      var endDate = new Date(time.data("end-date"));
      time.countdown({
        date: endDate,
        render: function (data) {
          $(this.el).html('<div class="cd-row"><div><h1>' 
			+ this.leadingZeros(data.days, 3)
            + '</h1><p>Days</p></div><div><h1>'
            + this.leadingZeros(data.hours, 2)
            + '</h1><p>Hours</p></div></div><div class="cd-row"><div><h1>'
            + this.leadingZeros(data.min, 2)
            + '</h1><p>Minutes</p></div><div><h1>'
            + this.leadingZeros(data.sec, 2)
            + '</h1><p>Seconds</p></div></div>');
        }
      });
    }
	
	
    /* _____________________________________

     Smooth Scroll
     _____________________________________ */


    function initScroll(anchor) {
      $("html, body").stop().animate({
        scrollTop: $(anchor).offset().top
      }, {
        duration: 1000,
        specialEasing: {
          width: "linear",
          height: "easeInOutCubic"
        }
      });

    }

    $("a.smooth-scroll").on("click", function (event) {
      var anchor = $(this).attr("href");
      initScroll(anchor);
      event.preventDefault();
    });


    /* _____________________________________

     Scroll Reveal
     _____________________________________ */

    var reveal = $(".reveal");

    if (reveal.length) {
      window.sr = ScrollReveal();

      // Add class to <html> if ScrollReveal is supported
      if (sr.isSupported()) {
        document.documentElement.classList.add('sr');
      }

      sr.reveal('.reveal.scale-in', {
        origin: 'bottom',
        distance: '20px',
        duration: 1500,
        delay: 400,
        opacity: 1,
        scale: 1.1,
        easing: 'linear',
        reset: false
      });


      sr.reveal('.reveal.scale-out', {
        origin: 'bottom',
        distance: '20px',
        duration: 1500,
        delay: 400,
        opacity: 1,
        scale: 0.9,
        easing: 'linear',
        reset: false
      });
    }

    /* _____________________________________

     Show Content
     _____________________________________ */

    var navLinks = $('.navbar-links li'),
      content = $("body"),
      navbar = $(".navbar"),
      col = $(".col-transform");

    $(".show-info").click(function () {
      if (window.innerWidth > 990) {
        if (content.hasClass('show-content')) {
          col.removeClass('col-md-6').addClass('col-md-6');
          content.removeClass('show-content');
          setTimeout(function () {
            navbar.removeClass('navbar-open')
          }, 900);
          initTranslateOpacity(navLinks, '100%', '0', 'hidden', 600);
        } else {
          col.removeClass('col-md-6').addClass('col-md-6');
          content.addClass('show-content');
          setTimeout(function () {
            navbar.addClass('navbar-open')
          }, 300);
          initTranslateOpacity(navLinks.get().reverse(), '0', '1', 'visible', 600);
        }
      }
      var anchor = $(this).data("href");
      initScroll(anchor);
    });


    function initTranslateOpacity(selector, translate, opacity, visibility, time) {
      $(selector).each(function () {
        var _this = this;
        window.setTimeout(function () {
          $(_this).css({
            '-webkit-transform': 'translate(' + translate + ',0)',
            'opacity': opacity,
            'visibility': visibility
          });
        }, time);
        time += 300;
      });
    }
	
	/* _____________________________________

     Form Validation & Send Mail code
     _____________________________________ */

	if(typeof($('.contactForm form')) != 'undefined') {
		$.each($('.contactForm form'), function(index, el) {
			var cform = $(el),
				cResponse = $('<div class="cf_response"></div>');
			cform.prepend(cResponse);
			cform.h5Validate();

			cform.submit(function(e) {
				e.preventDefault();
				if(cform.h5Validate('allValid')) {
					cResponse.hide();
					$.post(
						$(this).attr('action'),
						cform.serialize(),
						function(data){
							cResponse.html(data).fadeIn('fast');
							if(data.match('success') != null) {
								cform.get(0).reset();
							}
						}
					); // end post
				}
				return false;
			});
		});
	};

    /* _____________________________________

     Gallery PhotoSwipe
     _____________________________________ */

    var initPhotoSwipeFromDOM = function (gallerySelector) {

      var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;

        for (var i = 0; i < numNodes; i++) {

          figureEl = thumbElements[i];

          if (figureEl.nodeType !== 1) {
            continue;
          }

          linkEl = figureEl.children[0];

          size = linkEl.getAttribute('data-size').split('x');


          // create slide object
          item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
          };


          if (figureEl.children.length > 1) {
            // <figcaption> content
            item.title = '<h3>' + figureEl.children[1].innerHTML + '</h3><p>' + figureEl.children[2].innerHTML + '</p>';
          }

          if (linkEl.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkEl.children[0].getAttribute('src');
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }

        return items;
      };

      // find nearest parent element
      var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };

      // triggers when user clicks on thumbnail
      var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
          return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;

        for (var i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }

          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }


        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
          params = {};

        if (hash.length < 5) {
          return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          var pair = vars[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }

        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }

        return params;
      };

      var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;

        items = parseThumbnailElements(galleryElement);

        // options
        options = {
          barsSize: {top: 64, bottom: 'auto', padding: '10px'},
          bgOpacity: 0.90,
          closeEl: true,
          captionEl: true,
          fullscreenEl: true,
          zoomEl: false,
          shareEl: true,
          counterEl: true,
          arrowEl: true,
          preloaderEl: true,
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),

          getThumbBoundsFn: function (index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
              rect = thumbnail.getBoundingClientRect();

            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
          }

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (var j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
      };

      // loop through all gallery elements and bind events
      var galleryElements = document.querySelectorAll(gallerySelector);

      for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
      }
    };

	  // execute above function
	  initPhotoSwipeFromDOM('.gallery');


    /* _____________________________________

     Mail Chimp
     _____________________________________ */

    var form = $('#mc-form');

    if (form.length) {
      form.ajaxChimp({
        callback: mailchimpCallback,
        // Replace the URL above with your mailchimp URL (put your URL inside '').
        url: 'http://artsoundgroup.us16.list-manage.com/subscribe/post?u=dd46cd6a6db7dc37e865ccf55&amp;id=a1711ff12d'
      });
    }

    // callback function when the form submitted, show the notification box
    function mailchimpCallback(resp) {
      var messageContainer = $('#message-newsletter');
      messageContainer.removeClass('error');

      form.find('.form-group').removeClass('error');
      if (resp.result === 'error') {
        form.find('.input-group').addClass('error');
        messageContainer.addClass('error');
      } else {
        form.find('.form-control').fadeIn().val('');
      }

      messageContainer.slideDown('slow', 'swing');

      setTimeout(function () {
        messageContainer.slideUp('slow', 'swing');
      }, 10000);
    }


    /* _____________________________________

     Map
     _____________________________________ */

    function initMap(map) {

      // centered map point
      var latlng = new google.maps.LatLng(53.9280711, 27.5149951);

      // points marker info and coordinates
      var points = [
        ['<div class="wrapper"><h4>General Office</h4><p>Pobeditelei ave. 28</p><h5>Opening Hours</h5><p>Mo – Fr: 10:00 – 20:00</p></div>', 53.934739, 27.503374],
        ['<div class="wrapper"><h4>Office</h4><p>Masherova ave. 35</p><h5>Opening Hours</h5><p>Mo – Fr: 09:00 – 19:00</p></div>', 53.917011, 27.549800]
      ];
      // marker
      var iconMarker = 'assets/img/map-marker.png';

      // marker size
      var markerSize = new google.maps.Size(28, 38);


      // map options
      var options = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false,
        streetViewControl: true,
        scrollwheel: false,

        // styles for monchrome map
        styles: [{
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {'visibility': 'simplified'}
          ]
        }, {
          featureType: 'poi',
          elementType: 'label',
          stylers: [
            {'visibility': 'off'}
          ]
        }, {
          featureType: 'all',
          stylers: [
            {saturation: -100},
            {gamma: 0.90}
          ]
        }]

      };

      var setMap = new google.maps.Map(map[0], options);

      var info = new google.maps.InfoWindow();


      // custom infoWindow
      google.maps.event.addListener(info, 'domready', function () {

        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');

        var iwBackground = iwOuter.prev();
        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({
          'box-shadow': 'none',
          'background-color': 'rgba(0, 0, 0, 0.1)'
        });

        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({
          'box-shadow': 'none',
          'border-top-color': 'rgba(0, 0, 0, 0.1)'
        });

      });
      var marker, i;
      var image = {
        url: iconMarker,
        scaledSize: markerSize
      };

      for (i = 0; i < points.length; i++) {
        var stations = points[i][0];
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(points[i][1], points[i][2]),
          map: setMap,
          icon: image
        });
        google.maps.event.addListener(marker, 'click', (function (stations) {
          return function () {
            info.setContent(stations);
            info.open(setMap, this);
          }
        })(stations));
      }
    }

    var map = $('#map');

    if (map.length) {
      google.maps.event.addDomListener(window, 'load', initMap(map));
      google.maps.event.addDomListener(window, 'resize', initMap(map));
    }


    /* _____________________________________

     Bootstrap Fix: IE10 in Win 8 & Win Phone 8
     _____________________________________ */


    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement("style");
      msViewportStyle.appendChild(
        document.createTextNode(
          "@-ms-viewport{width:auto!important}"
        )
      );
      document.querySelector("head").appendChild(msViewportStyle)
    }
  }
)
;
