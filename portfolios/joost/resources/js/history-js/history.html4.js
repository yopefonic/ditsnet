(function (a, b) {
  "use strict";
  var c = a.document, d = a.setTimeout || d, e = a.clearTimeout || e, f = a.setInterval || f, g = a.History = a.History || {};
  if (typeof g.initHtml4 != "undefined")throw new Error("History.js HTML4 Support has already been loaded...");
  g.initHtml4 = function () {
    if (typeof g.initHtml4.initialized != "undefined")return!1;
    g.initHtml4.initialized = !0, g.enabled = !0, g.savedHashes = [], g.isLastHash = function (a) {
      var b = g.getHashByIndex(), c = a === b;
      return c
    }, g.saveHash = function (a) {
      if (g.isLastHash(a))return!1;
      g.savedHashes.push(a);
      return!0
    }, g.getHashByIndex = function (a) {
      var b = null;
      typeof a == "undefined" ? b = g.savedHashes[g.savedHashes.length - 1] : a < 0 ? b = g.savedHashes[g.savedHashes.length + a] : b = g.savedHashes[a];
      return b
    }, g.discardedHashes = {}, g.discardedStates = {}, g.discardState = function (a, b, c) {
      var d = g.getHashByState(a), e = {discardedState:a, backState:c, forwardState:b};
      g.discardedStates[d] = e;
      return!0
    }, g.discardHash = function (a, b, c) {
      var d = {discardedHash:a, backState:c, forwardState:b};
      g.discardedHashes[a] = d;
      return!0
    }, g.discardedState = function (a) {
      var b = g.getHashByState(a), c = g.discardedStates[b] || !1;
      return c
    }, g.discardedHash = function (a) {
      var b = g.discardedHashes[a] || !1;
      return b
    }, g.recycleState = function (a) {
      var b = g.getHashByState(a);
      g.discardedState(a) && delete g.discardedStates[b];
      return!0
    }, g.emulated.hashChange && (g.hashChangeInit = function () {
      g.checkerFunction = null;
      var b = "";
      if (g.isInternetExplorer()) {
        var d = "historyjs-iframe", e = c.createElement("iframe");
        e.setAttribute("id", d), e.style.display = "none", c.body.appendChild(e), e.contentWindow.document.open(), e.contentWindow.document.close();
        var h = "", i = !1;
        g.checkerFunction = function () {
          if (i)return!1;
          i = !0;
          var c = g.getHash() || "", d = g.unescapeHash(e.contentWindow.document.location.hash) || "";
          c !== b ? (b = c, d !== c && (h = d = c, e.contentWindow.document.open(), e.contentWindow.document.close(), e.contentWindow.document.location.hash = g.escapeHash(c)), g.Adapter.trigger(a, "hashchange")) : d !== h && (h = d, g.setHash(d, !1)), i = !1;
          return!0
        }
      } else g.checkerFunction = function () {
        var c = g.getHash();
        c !== b && (b = c, g.Adapter.trigger(a, "hashchange"));
        return!0
      };
      g.intervalList.push(f(g.checkerFunction, g.options.hashChangeInterval));
      return!0
    }, g.Adapter.onDomLoad(g.hashChangeInit)), g.emulated.pushState && (g.onHashChange = function (b) {
      var d = b && b.newURL || c.location.href, e = g.getHashByUrl(d), f = null, h = null, i = null;
      if (g.isLastHash(e)) {
        g.busy(!1);
        return!1
      }
      g.doubleCheckComplete(), g.saveHash(e);
      if (e && g.isTraditionalAnchor(e)) {
        g.Adapter.trigger(a, "anchorchange"), g.busy(!1);
        return!1
      }
      f = g.extractState(g.getFullUrl(e || c.location.href, !1), !0);
      if (g.isLastSavedState(f)) {
        g.busy(!1);
        return!1
      }
      h = g.getHashByState(f);
      var j = g.discardedState(f);
      if (j) {
        g.getHashByIndex(-2) === g.getHashByState(j.forwardState) ? g.back(!1) : g.forward(!1);
        return!1
      }
      g.pushState(f.data, f.title, f.url, !1);
      return!0
    }, g.Adapter.bind(a, "hashchange", g.onHashChange), g.pushState = function (b, d, e, f) {
      if (g.getHashByUrl(e))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
      if (f !== !1 && g.busy()) {
        g.pushQueue({scope:g, callback:g.pushState, args:arguments, queue:f});
        return!1
      }
      g.busy(!0);
      var h = g.createStateObject(b, d, e), i = g.getHashByState(h), j = g.getState(!1), k = g.getHashByState(j), l = g.getHash();
      g.storeState(h), g.expectedStateId = h.id, g.recycleState(h), g.setTitle(h);
      if (i === k) {
        g.busy(!1);
        return!1
      }
      if (i !== l && i !== g.getShortUrl(c.location.href)) {
        g.setHash(i, !1);
        return!1
      }
      g.saveState(h), g.Adapter.trigger(a, "statechange"), g.busy(!1);
      return!0
    }, g.replaceState = function (a, b, c, d) {
      if (g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
      if (d !== !1 && g.busy()) {
        g.pushQueue({scope:g, callback:g.replaceState, args:arguments, queue:d});
        return!1
      }
      g.busy(!0);
      var e = g.createStateObject(a, b, c), f = g.getState(!1), h = g.getStateByIndex(-2);
      g.discardState(f, e, h), g.pushState(e.data, e.title, e.url, !1);
      return!0
    }, g.getHash() && !g.emulated.hashChange && g.Adapter.onDomLoad(function () {
      g.Adapter.trigger(a, "hashchange")
    }))
  }, g.init()
})(window)