// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
      arguments.callee = arguments.callee.caller;
      console.log( Array.prototype.slice.call(arguments) );
  }
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.


// remap jQuery to $
(function($){

/**
 * Toggle grid for ninesixty
 * Created by: Emil Stjerneman - <http://www.anon-design.se> (anon - <http://drupal.org/user/464598>)
 *
 * Press "shift + g" to toggle 
 */
$(document).ready(function() {
  $(document).keypress(function(e){
    var target = e.target || e.srcElement;
    // Defeat Safari bug 
    if (target.nodeType==3) { 
      target = targ.parentNode;
    }
    // Prevent toggle of you are in a textarea for input field.
    if(target.tagName != "TEXTAREA" && target.tagName != "INPUT" && e.which==71 && e.shiftKey) {
      $('body').toggleClass('show-grid');
    }    
  });
});


})(this.jQuery);
