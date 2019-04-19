// Avoid `console` errors in browsers that lack a console.
(function () {
  var method;
  var noop = function () { };
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

// iOS-like scroll behaviour
$(function (o) {
  o = $("#venueGallery").overscroll({
    cancelOn: '.no-drag',
    captureWheel: false,
    hoverThumbs: true,
    persistThumbs: true,
    showThumbs: false,
    scrollLeft: 200,
    scrollTop: 100
  }).on('overscroll:dragstart overscroll:dragend overscroll:driftstart overscroll:driftend', function (event) {
    console.log(event.type);
  });
});


jQuery.fn.overscroll.settings = {
  captureThreshold:   3,   // The number of mouse move events before considering the gesture a "drag"
  driftDecay:         1.1, // The linear-friction coefficient for drift decay (must be > 1)
  driftSequences:     22,  // The number of animation frames to constrain a drift to
  driftTimeout:       100, // The amount of time to imply the user is no longer trying to drift (in ms)
  thumbOpacity:       0.7, // The default active opacity for the thumbs
  thumbThickness:     6,   // The thickness, in pixels, of the generated thumbs
  thumbTimeout:       400, // The amount of time to wait before fading out thumbs
}