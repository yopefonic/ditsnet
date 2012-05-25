(function (a, b) {
  "use strict";
  var c = a.console || b, d = a.document, e = a.navigator, f = a.amplify || !1, g = a.setTimeout, h = a.clearTimeout, i = a.setInterval, j = a.clearInterval, k = a.JSON, l = a.History = a.History || {}, m = a.history;
  k.stringify = k.stringify || k.encode, k.parse = k.parse || k.decode;
  if (typeof l.init != "undefined")throw new Error("History.js Core has already been loaded...");
  l.init = function () {
    if (typeof l.Adapter == "undefined")return!1;
    typeof l.initCore != "undefined" && l.initCore(), typeof l.initHtml4 != "undefined" && l.initHtml4();
    return!0
  }, l.initCore = function () {
    if (typeof l.initCore.initialized != "undefined")return!1;
    l.initCore.initialized = !0, l.options = l.options || {}, l.options.hashChangeInterval = l.options.hashChangeInterval || 100, l.options.safariPollInterval = l.options.safariPollInterval || 500, l.options.doubleCheckInterval = l.options.doubleCheckInterval || 500, l.options.storeInterval = l.options.storeInterval || 1e3, l.options.busyDelay = l.options.busyDelay || 250, l.options.debug = l.options.debug || !1, l.options.initialTitle = l.options.initialTitle || d.title, l.intervalList = [], l.clearAllIntervals = function () {
      var a, b = l.intervalList;
      if (typeof b != "undefined" && b !== null) {
        for (a = 0; a < b.length; a++)j(b[a]);
        l.intervalList = null
      }
    }, l.Adapter.bind(a, "beforeunload", l.clearAllIntervals), l.Adapter.bind(a, "unload", l.clearAllIntervals), l.debug = function () {
      (l.options.debug || !1) && l.log.apply(l, arguments)
    }, l.log = function () {
      var a = typeof c != "undefined" && typeof c.log != "undefined" && typeof c.log.apply != "undefined", b = d.getElementById("log"), e, f, g;
      if (a) {
        var h = Array.prototype.slice.call(arguments);
        e = h.shift(), typeof c.debug != "undefined" ? c.debug.apply(c, [e, h]) : c.log.apply(c, [e, h])
      } else e = "\n" + arguments[0] + "\n";
      for (f = 1, g = arguments.length; f < g; ++f) {
        var i = arguments[f];
        if (typeof i == "object" && typeof k != "undefined")try {
          i = k.stringify(i)
        } catch (j) {
        }
        e += "\n" + i + "\n"
      }
      b ? (b.value += e + "\n-----\n", b.scrollTop = b.scrollHeight - b.clientHeight) : a || alert(e);
      return!0
    }, l.getInternetExplorerMajorVersion = function () {
      var a = l.getInternetExplorerMajorVersion.cached = typeof l.getInternetExplorerMajorVersion.cached != "undefined" ? l.getInternetExplorerMajorVersion.cached : function () {
        var a = 3, b = d.createElement("div"), c = b.getElementsByTagName("i");
        while ((b.innerHTML = "<!--[if gt IE " + ++a + "]><i></i><![endif]-->") && c[0]);
        return a > 4 ? a : !1
      }();
      return a
    }, l.isInternetExplorer = function () {
      var a = l.isInternetExplorer.cached = typeof l.isInternetExplorer.cached != "undefined" ? l.isInternetExplorer.cached : Boolean(l.getInternetExplorerMajorVersion());
      return a
    }, l.emulated = {pushState:!Boolean(a.history && a.history.pushState && a.history.replaceState && !/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent) && !/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)), hashChange:Boolean(!("onhashchange"in a || "onhashchange"in d) || l.isInternetExplorer() && l.getInternetExplorerMajorVersion() < 8)}, l.enabled = !l.emulated.pushState, l.bugs = {setHash:Boolean(!l.emulated.pushState && e.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)), safariPoll:Boolean(!l.emulated.pushState && e.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)), ieDoubleCheck:Boolean(l.isInternetExplorer() && l.getInternetExplorerMajorVersion() < 8), hashEscape:Boolean(l.isInternetExplorer() && l.getInternetExplorerMajorVersion() < 7)}, l.isEmptyObject = function (a) {
      for (var b in a)return!1;
      return!0
    }, l.cloneObject = function (a) {
      var b, c;
      a ? (b = k.stringify(a), c = k.parse(b)) : c = {};
      return c
    }, l.getRootUrl = function () {
      var a = d.location.protocol + "//" + (d.location.hostname || d.location.host);
      if (d.location.port || !1)a += ":" + d.location.port;
      a += "/";
      return a
    }, l.getBaseHref = function () {
      var a = d.getElementsByTagName("base"), b = null, c = "";
      a.length === 1 && (b = a[0], c = b.href.replace(/[^\/]+$/, "")), c = c.replace(/\/+$/, ""), c && (c += "/");
      return c
    }, l.getBaseUrl = function () {
      var a = l.getBaseHref() || l.getBasePageUrl() || l.getRootUrl();
      return a
    }, l.getPageUrl = function () {
      var a = l.getState(!1, !1), b = (a || {}).url || d.location.href, c = b.replace(/\/+$/, "").replace(/[^\/]+$/, function (a, b, c) {
        return/\./.test(a) ? a : a + "/"
      });
      return c
    }, l.getBasePageUrl = function () {
      var a = d.location.href.replace(/[#\?].*/, "").replace(/[^\/]+$/,
        function (a, b, c) {
          return/[^\/]$/.test(a) ? "" : a
        }).replace(/\/+$/, "") + "/";
      return a
    }, l.getFullUrl = function (a, b) {
      var c = a, d = a.substring(0, 1);
      b = typeof b == "undefined" ? !0 : b, /[a-z]+\:\/\//.test(a) || (d === "/" ? c = l.getRootUrl() + a.replace(/^\/+/, "") : d === "#" ? c = l.getPageUrl().replace(/#.*/, "") + a : d === "?" ? c = l.getPageUrl().replace(/[\?#].*/, "") + a : b ? c = l.getBaseUrl() + a.replace(/^(\.\/)+/, "") : c = l.getBasePageUrl() + a.replace(/^(\.\/)+/, ""));
      return c.replace(/\#$/, "")
    }, l.getShortUrl = function (a) {
      var b = a, c = l.getBaseUrl(), d = l.getRootUrl();
      l.emulated.pushState && (b = b.replace(c, "")), b = b.replace(d, "/"), l.isTraditionalAnchor(b) && (b = "./" + b), b = b.replace(/^(\.\/)+/g, "./").replace(/\#$/, "");
      return b
    }, l.store = f ? f.store("History.store") || {} : {}, l.store.idToState = l.store.idToState || {}, l.store.urlToId = l.store.urlToId || {}, l.store.stateToId = l.store.stateToId || {}, l.idToState = l.idToState || {}, l.stateToId = l.stateToId || {}, l.urlToId = l.urlToId || {}, l.storedStates = l.storedStates || [], l.savedStates = l.savedStates || [], l.getState = function (a, b) {
      typeof a == "undefined" && (a = !0), typeof b == "undefined" && (b = !0);
      var c = l.getLastSavedState();
      !c && b && (c = l.createStateObject()), a && (c = l.cloneObject(c), c.url = c.cleanUrl || c.url);
      return c
    }, l.getIdByState = function (a) {
      var b = l.extractId(a.url);
      if (!b) {
        var c = l.getStateString(a);
        if (typeof l.stateToId[c] != "undefined")b = l.stateToId[c]; else if (typeof l.store.stateToId[c] != "undefined")b = l.store.stateToId[c]; else {
          for (; ;) {
            b = String(Math.floor(Math.random() * 1e3));
            if (typeof l.idToState[b] == "undefined" && typeof l.store.idToState[b] == "undefined")break
          }
          l.stateToId[c] = b, l.idToState[b] = a
        }
      }
      return b
    }, l.normalizeState = function (a) {
      if (!a || typeof a != "object")a = {};
      if (typeof a.normalized != "undefined")return a;
      if (!a.data || typeof a.data != "object")a.data = {};
      var b = {};
      b.normalized = !0, b.title = a.title || "", b.url = l.getFullUrl(l.unescapeString(a.url || d.location.href)), b.hash = l.getShortUrl(b.url), b.data = l.cloneObject(a.data), b.id = l.getIdByState(b), b.cleanUrl = b.url.replace(/\??\&_suid.*/, ""), b.url = b.cleanUrl;
      var c = !l.isEmptyObject(b.data);
      if (b.title || c)b.hash = l.getShortUrl(b.url).replace(/\??\&_suid.*/, ""), /\?/.test(b.hash) || (b.hash += "?"), b.hash += "&_suid=" + b.id;
      b.hashedUrl = l.getFullUrl(b.hash), (l.emulated.pushState || l.bugs.safariPoll) && l.hasUrlDuplicate(b) && (b.url = b.hashedUrl);
      return b
    }, l.createStateObject = function (a, b, c) {
      var d = {data:a, title:b, url:c};
      d = l.normalizeState(d);
      return d
    }, l.getStateById = function (a) {
      a = String(a);
      var c = l.idToState[a] || l.store.idToState[a] || b;
      return c
    }, l.getStateString = function (a) {
      var b = l.normalizeState(a), c = {data:b.data, title:a.title, url:a.url}, d = k.stringify(c);
      return d
    }, l.getStateId = function (a) {
      var b = l.normalizeState(a), c = b.id;
      return c
    }, l.getHashByState = function (a) {
      var b, c = l.normalizeState(a);
      b = c.hash;
      return b
    }, l.extractId = function (a) {
      var b, c, d;
      c = /(.*)\&_suid=([0-9]+)$/.exec(a), d = c ? c[1] || a : a, b = c ? String(c[2] || "") : "";
      return b || !1
    }, l.isTraditionalAnchor = function (a) {
      var b = !/[\/\?\.]/.test(a);
      return b
    }, l.extractState = function (a, b) {
      var c = null;
      b = b || !1;
      var d = l.extractId(a);
      d && (c = l.getStateById(d));
      if (!c) {
        var e = l.getFullUrl(a);
        d = l.getIdByUrl(e) || !1, d && (c = l.getStateById(d)), !c && b && !l.isTraditionalAnchor(a) && (c = l.createStateObject(null, null, e))
      }
      return c
    }, l.getIdByUrl = function (a) {
      var c = l.urlToId[a] || l.store.urlToId[a] || b;
      return c
    }, l.getLastSavedState = function () {
      return l.savedStates[l.savedStates.length - 1] || b
    }, l.getLastStoredState = function () {
      return l.storedStates[l.storedStates.length - 1] || b
    }, l.hasUrlDuplicate = function (a) {
      var b = !1, c = l.extractState(a.url);
      b = c && c.id !== a.id;
      return b
    }, l.storeState = function (a) {
      l.urlToId[a.url] = a.id, l.storedStates.push(l.cloneObject(a));
      return a
    }, l.isLastSavedState = function (a) {
      var b = !1;
      if (l.savedStates.length) {
        var c = a.id, d = l.getLastSavedState(), e = d.id;
        b = c === e
      }
      return b
    }, l.saveState = function (a) {
      if (l.isLastSavedState(a))return!1;
      l.savedStates.push(l.cloneObject(a));
      return!0
    }, l.getStateByIndex = function (a) {
      var b = null;
      typeof a == "undefined" ? b = l.savedStates[l.savedStates.length - 1] : a < 0 ? b = l.savedStates[l.savedStates.length + a] : b = l.savedStates[a];
      return b
    }, l.getHash = function () {
      var a = l.unescapeHash(d.location.hash);
      return a
    }, l.unescapeString = function (b) {
      var c = b, d;
      for (; ;) {
        d = a.unescape(c);
        if (d === c)break;
        c = d
      }
      return c
    }, l.unescapeHash = function (a) {
      var b = l.normalizeHash(a);
      b = l.unescapeString(b);
      return b
    }, l.normalizeHash = function (a) {
      var b = a.replace(/[^#]*#/, "").replace(/#.*/, "");
      return b
    }, l.setHash = function (a, b) {
      if (b !== !1 && l.busy()) {
        l.pushQueue({scope:l, callback:l.setHash, args:arguments, queue:b});
        return!1
      }
      var c = l.escapeHash(a);
      l.busy(!0);
      var e = l.extractState(a, !0);
      if (e && !l.emulated.pushState)l.pushState(e.data, e.title, e.url, !1); else if (d.location.hash !== c)if (l.bugs.setHash) {
        var f = l.getPageUrl();
        l.pushState(null, null, f + "#" + c, !1)
      } else d.location.hash = c;
      return l
    }, l.escapeHash = function (b) {
      var c = l.normalizeHash(b);
      c = a.escape(c), l.bugs.hashEscape || (c = c.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?"));
      return c
    }, l.getHashByUrl = function (a) {
      var b = String(a).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
      b = l.unescapeHash(b);
      return b
    }, l.setTitle = function (a) {
      var b = a.title;
      if (!b) {
        var c = l.getStateByIndex(0);
        c && c.url === a.url && (b = c.title || l.options.initialTitle)
      }
      try {
        d.getElementsByTagName("title")[0].innerHTML = b.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ")
      } catch (e) {
      }
      d.title = b;
      return l
    }, l.queues = [], l.busy = function (a) {
      typeof a != "undefined" ? l.busy.flag = a : typeof l.busy.flag == "undefined" && (l.busy.flag = !1);
      if (!l.busy.flag) {
        h(l.busy.timeout);
        var b = function () {
          if (!l.busy.flag)for (var a = l.queues.length - 1; a >= 0; --a) {
            var c = l.queues[a];
            if (c.length === 0)continue;
            var d = c.shift();
            l.fireQueueItem(d), l.busy.timeout = g(b, l.options.busyDelay)
          }
        };
        l.busy.timeout = g(b, l.options.busyDelay)
      }
      return l.busy.flag
    }, l.fireQueueItem = function (a) {
      return a.callback.apply(a.scope || l, a.args || [])
    }, l.pushQueue = function (a) {
      l.queues[a.queue || 0] = l.queues[a.queue || 0] || [], l.queues[a.queue || 0].push(a);
      return l
    }, l.queue = function (a, b) {
      typeof a == "function" && (a = {callback:a}), typeof b != "undefined" && (a.queue = b), l.busy() ? l.pushQueue(a) : l.fireQueueItem(a);
      return l
    }, l.clearQueue = function () {
      l.busy.flag = !1, l.queues = [];
      return l
    }, l.stateChanged = !1, l.doubleChecker = !1, l.doubleCheckComplete = function () {
      l.stateChanged = !0, l.doubleCheckClear();
      return l
    }, l.doubleCheckClear = function () {
      l.doubleChecker && (h(l.doubleChecker), l.doubleChecker = !1);
      return l
    }, l.doubleCheck = function (a) {
      l.stateChanged = !1, l.doubleCheckClear(), l.bugs.ieDoubleCheck && (l.doubleChecker = g(function () {
        l.doubleCheckClear(), l.stateChanged || a();
        return!0
      }, l.options.doubleCheckInterval));
      return l
    }, l.safariStatePoll = function () {
      var b = l.extractState(d.location.href), c;
      if (!l.isLastSavedState(b))c = b; else return;
      c || (c = l.createStateObject()), l.Adapter.trigger(a, "popstate");
      return l
    }, l.back = function (a) {
      if (a !== !1 && l.busy()) {
        l.pushQueue({scope:l, callback:l.back, args:arguments, queue:a});
        return!1
      }
      l.busy(!0), l.doubleCheck(function () {
        l.back(!1)
      }), m.go(-1);
      return!0
    }, l.forward = function (a) {
      if (a !== !1 && l.busy()) {
        l.pushQueue({scope:l, callback:l.forward, args:arguments, queue:a});
        return!1
      }
      l.busy(!0), l.doubleCheck(function () {
        l.forward(!1)
      }), m.go(1);
      return!0
    }, l.go = function (a, b) {
      var c;
      if (a > 0)for (c = 1; c <= a; ++c)l.forward(b); else {
        if (!(a < 0))throw new Error("History.go: History.go requires a positive or negative integer passed.");
        for (c = -1; c >= a; --c)l.back(b)
      }
      return l
    }, l.saveState(l.storeState(l.extractState(d.location.href, !0))), f && (l.onUnload = function () {
      var a = f.store("History.store") || {}, b;
      a.idToState = a.idToState || {}, a.urlToId = a.urlToId || {}, a.stateToId = a.stateToId || {};
      for (b in l.idToState) {
        if (!l.idToState.hasOwnProperty(b))continue;
        a.idToState[b] = l.idToState[b]
      }
      for (b in l.urlToId) {
        if (!l.urlToId.hasOwnProperty(b))continue;
        a.urlToId[b] = l.urlToId[b]
      }
      for (b in l.stateToId) {
        if (!l.stateToId.hasOwnProperty(b))continue;
        a.stateToId[b] = l.stateToId[b]
      }
      l.store = a, f.store("History.store", a)
    }, l.intervalList.push(i(l.onUnload, l.options.storeInterval)), l.Adapter.bind(a, "beforeunload", l.onUnload), l.Adapter.bind(a, "unload", l.onUnload));
    if (l.emulated.pushState) {
      var n = function () {
      };
      l.pushState = l.pushState || n, l.replaceState = l.replaceState || n
    } else {
      l.onPopState = function (b) {
        l.doubleCheckComplete();
        var c = l.getHash();
        if (c) {
          var e = l.extractState(c || d.location.href, !0);
          e ? l.replaceState(e.data, e.title, e.url, !1) : (l.Adapter.trigger(a, "anchorchange"), l.busy(!1)), l.expectedStateId = !1;
          return!1
        }
        var f = !1;
        b = b || {}, typeof b.state == "undefined" && (typeof b.originalEvent != "undefined" && typeof b.originalEvent.state != "undefined" ? b.state = b.originalEvent.state || !1 : typeof b.event != "undefined" && typeof b.event.state != "undefined" && (b.state = b.event.state || !1)), b.state = b.state || !1, b.state ? f = l.getStateById(b.state) : l.expectedStateId ? f = l.getStateById(l.expectedStateId) : f = l.extractState(d.location.href), f || (f = l.createStateObject(null, null, d.location.href)), l.expectedStateId = !1;
        if (l.isLastSavedState(f)) {
          l.busy(!1);
          return!1
        }
        l.storeState(f), l.saveState(f), l.setTitle(f), l.Adapter.trigger(a, "statechange"), l.busy(!1);
        return!0
      }, l.Adapter.bind(a, "popstate", l.onPopState), l.pushState = function (b, c, d, e) {
        if (l.getHashByUrl(d) && l.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
        if (e !== !1 && l.busy()) {
          l.pushQueue({scope:l, callback:l.pushState, args:arguments, queue:e});
          return!1
        }
        l.busy(!0);
        var f = l.createStateObject(b, c, d);
        l.isLastSavedState(f) ? l.busy(!1) : (l.storeState(f), l.expectedStateId = f.id, m.pushState(f.id, f.title, f.url), l.Adapter.trigger(a, "popstate"));
        return!0
      }, l.replaceState = function (b, c, d, e) {
        if (l.getHashByUrl(d) && l.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
        if (e !== !1 && l.busy()) {
          l.pushQueue({scope:l, callback:l.replaceState, args:arguments, queue:e});
          return!1
        }
        l.busy(!0);
        var f = l.createStateObject(b, c, d);
        l.isLastSavedState(f) ? l.busy(!1) : (l.storeState(f), l.expectedStateId = f.id, m.replaceState(f.id, f.title, f.url), l.Adapter.trigger(a, "popstate"));
        return!0
      }, l.bugs.safariPoll && l.intervalList.push(i(l.safariStatePoll, l.options.safariPollInterval));
      if (e.vendor === "Apple Computer, Inc." || (e.appCodeName || "") === "Mozilla")l.Adapter.bind(a, "hashchange", function () {
        l.Adapter.trigger(a, "popstate")
      }), l.getHash() && l.Adapter.onDomLoad(function () {
        l.Adapter.trigger(a, "hashchange")
      })
    }
  }, l.init()
})(window)