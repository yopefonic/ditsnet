(function (a, b) {
  var c = a.History = a.History || {}, d = a.jQuery;
  if (typeof c.Adapter != "undefined")throw new Error("History.js Adapter has already been loaded...");
  c.Adapter = {bind:function (a, b, c) {
    d(a).bind(b, c)
  }, trigger:function (a, b) {
    d(a).trigger(b)
  }, onDomLoad:function (a) {
    d(a)
  }}, typeof c.init != "undefined" && c.init()
})(window)