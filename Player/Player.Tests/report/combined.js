/*! jQuery v1.11.2 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!(function(a, b) {
  'object' == typeof module && 'object' == typeof module.exports
    ? (module.exports = a.document
        ? b(a, !0)
        : function(a) {
            if (!a.document) throw new Error('jQuery requires a window with a document');
            return b(a);
          })
    : b(a);
})('undefined' != typeof window ? window : this, function(a, b) {
  var c = [],
    d = c.slice,
    e = c.concat,
    f = c.push,
    g = c.indexOf,
    h = {},
    i = h.toString,
    j = h.hasOwnProperty,
    k = {},
    l = '1.11.2',
    m = function(a, b) {
      return new m.fn.init(a, b);
    },
    n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    o = /^-ms-/,
    p = /-([\da-z])/gi,
    q = function(a, b) {
      return b.toUpperCase();
    };
  (m.fn = m.prototype = {
    jquery: l,
    constructor: m,
    selector: '',
    length: 0,
    toArray: function() {
      return d.call(this);
    },
    get: function(a) {
      return null != a ? (0 > a ? this[a + this.length] : this[a]) : d.call(this);
    },
    pushStack: function(a) {
      var b = m.merge(this.constructor(), a);
      return (b.prevObject = this), (b.context = this.context), b;
    },
    each: function(a, b) {
      return m.each(this, a, b);
    },
    map: function(a) {
      return this.pushStack(
        m.map(this, function(b, c) {
          return a.call(b, c, b);
        })
      );
    },
    slice: function() {
      return this.pushStack(d.apply(this, arguments));
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(a) {
      var b = this.length,
        c = +a + (0 > a ? b : 0);
      return this.pushStack(c >= 0 && b > c ? [this[c]] : []);
    },
    end: function() {
      return this.prevObject || this.constructor(null);
    },
    push: f,
    sort: c.sort,
    splice: c.splice
  }),
    (m.extend = m.fn.extend = function() {
      var a,
        b,
        c,
        d,
        e,
        f,
        g = arguments[0] || {},
        h = 1,
        i = arguments.length,
        j = !1;
      for (
        'boolean' == typeof g && ((j = g), (g = arguments[h] || {}), h++),
          'object' == typeof g || m.isFunction(g) || (g = {}),
          h === i && ((g = this), h--);
        i > h;
        h++
      )
        if (null != (e = arguments[h]))
          for (d in e)
            (a = g[d]),
              (c = e[d]),
              g !== c &&
                (j && c && (m.isPlainObject(c) || (b = m.isArray(c)))
                  ? (b
                      ? ((b = !1), (f = a && m.isArray(a) ? a : []))
                      : (f = a && m.isPlainObject(a) ? a : {}),
                    (g[d] = m.extend(j, f, c)))
                  : void 0 !== c && (g[d] = c));
      return g;
    }),
    m.extend({
      expando: 'jQuery' + (l + Math.random()).replace(/\D/g, ''),
      isReady: !0,
      error: function(a) {
        throw new Error(a);
      },
      noop: function() {},
      isFunction: function(a) {
        return 'function' === m.type(a);
      },
      isArray:
        Array.isArray ||
        function(a) {
          return 'array' === m.type(a);
        },
      isWindow: function(a) {
        return null != a && a == a.window;
      },
      isNumeric: function(a) {
        return !m.isArray(a) && a - parseFloat(a) + 1 >= 0;
      },
      isEmptyObject: function(a) {
        var b;
        for (b in a) return !1;
        return !0;
      },
      isPlainObject: function(a) {
        var b;
        if (!a || 'object' !== m.type(a) || a.nodeType || m.isWindow(a)) return !1;
        try {
          if (
            a.constructor &&
            !j.call(a, 'constructor') &&
            !j.call(a.constructor.prototype, 'isPrototypeOf')
          )
            return !1;
        } catch (c) {
          return !1;
        }
        if (k.ownLast) for (b in a) return j.call(a, b);
        for (b in a);
        return void 0 === b || j.call(a, b);
      },
      type: function(a) {
        return null == a
          ? a + ''
          : 'object' == typeof a || 'function' == typeof a ? h[i.call(a)] || 'object' : typeof a;
      },
      globalEval: function(b) {
        b &&
          m.trim(b) &&
          (a.execScript ||
            function(b) {
              a.eval.call(a, b);
            })(b);
      },
      camelCase: function(a) {
        return a.replace(o, 'ms-').replace(p, q);
      },
      nodeName: function(a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
      },
      each: function(a, b, c) {
        var d,
          e = 0,
          f = a.length,
          g = r(a);
        if (c) {
          if (g) {
            for (; f > e; e++) if (((d = b.apply(a[e], c)), d === !1)) break;
          } else for (e in a) if (((d = b.apply(a[e], c)), d === !1)) break;
        } else if (g) {
          for (; f > e; e++) if (((d = b.call(a[e], e, a[e])), d === !1)) break;
        } else for (e in a) if (((d = b.call(a[e], e, a[e])), d === !1)) break;
        return a;
      },
      trim: function(a) {
        return null == a ? '' : (a + '').replace(n, '');
      },
      makeArray: function(a, b) {
        var c = b || [];
        return (
          null != a && (r(Object(a)) ? m.merge(c, 'string' == typeof a ? [a] : a) : f.call(c, a)), c
        );
      },
      inArray: function(a, b, c) {
        var d;
        if (b) {
          if (g) return g.call(b, a, c);
          for (d = b.length, c = c ? (0 > c ? Math.max(0, d + c) : c) : 0; d > c; c++)
            if (c in b && b[c] === a) return c;
        }
        return -1;
      },
      merge: function(a, b) {
        var c = +b.length,
          d = 0,
          e = a.length;
        while (c > d) a[e++] = b[d++];
        if (c !== c) while (void 0 !== b[d]) a[e++] = b[d++];
        return (a.length = e), a;
      },
      grep: function(a, b, c) {
        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
          (d = !b(a[f], f)), d !== h && e.push(a[f]);
        return e;
      },
      map: function(a, b, c) {
        var d,
          f = 0,
          g = a.length,
          h = r(a),
          i = [];
        if (h) for (; g > f; f++) (d = b(a[f], f, c)), null != d && i.push(d);
        else for (f in a) (d = b(a[f], f, c)), null != d && i.push(d);
        return e.apply([], i);
      },
      guid: 1,
      proxy: function(a, b) {
        var c, e, f;
        return (
          'string' == typeof b && ((f = a[b]), (b = a), (a = f)),
          m.isFunction(a)
            ? ((c = d.call(arguments, 2)),
              (e = function() {
                return a.apply(b || this, c.concat(d.call(arguments)));
              }),
              (e.guid = a.guid = a.guid || m.guid++),
              e)
            : void 0
        );
      },
      now: function() {
        return +new Date();
      },
      support: k
    }),
    m.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(
      a,
      b
    ) {
      h['[object ' + b + ']'] = b.toLowerCase();
    });
  function r(a) {
    var b = a.length,
      c = m.type(a);
    return 'function' === c || m.isWindow(a)
      ? !1
      : 1 === a.nodeType && b
        ? !0
        : 'array' === c || 0 === b || ('number' == typeof b && b > 0 && b - 1 in a);
  }
  var s = (function(a) {
    var b,
      c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t,
      u = 'sizzle' + 1 * new Date(),
      v = a.document,
      w = 0,
      x = 0,
      y = hb(),
      z = hb(),
      A = hb(),
      B = function(a, b) {
        return a === b && (l = !0), 0;
      },
      C = 1 << 31,
      D = {}.hasOwnProperty,
      E = [],
      F = E.pop,
      G = E.push,
      H = E.push,
      I = E.slice,
      J = function(a, b) {
        for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return c;
        return -1;
      },
      K =
        'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
      L = '[\\x20\\t\\r\\n\\f]',
      M = '(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+',
      N = M.replace('w', 'w#'),
      O =
        '\\[' +
        L +
        '*(' +
        M +
        ')(?:' +
        L +
        '*([*^$|!~]?=)' +
        L +
        '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' +
        N +
        '))|)' +
        L +
        '*\\]',
      P =
        ':(' +
        M +
        ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' +
        O +
        ')*)|.*)\\)|)',
      Q = new RegExp(L + '+', 'g'),
      R = new RegExp('^' + L + '+|((?:^|[^\\\\])(?:\\\\.)*)' + L + '+$', 'g'),
      S = new RegExp('^' + L + '*,' + L + '*'),
      T = new RegExp('^' + L + '*([>+~]|' + L + ')' + L + '*'),
      U = new RegExp('=' + L + '*([^\\]\'"]*?)' + L + '*\\]', 'g'),
      V = new RegExp(P),
      W = new RegExp('^' + N + '$'),
      X = {
        ID: new RegExp('^#(' + M + ')'),
        CLASS: new RegExp('^\\.(' + M + ')'),
        TAG: new RegExp('^(' + M.replace('w', 'w*') + ')'),
        ATTR: new RegExp('^' + O),
        PSEUDO: new RegExp('^' + P),
        CHILD: new RegExp(
          '^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(' +
            L +
            '*(even|odd|(([+-]|)(\\d*)n|)' +
            L +
            '*(?:([+-]|)' +
            L +
            '*(\\d+)|))' +
            L +
            '*\\)|)',
          'i'
        ),
        bool: new RegExp('^(?:' + K + ')$', 'i'),
        needsContext: new RegExp(
          '^' +
            L +
            '*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(' +
            L +
            '*((?:-\\d)?\\d*)' +
            L +
            '*\\)|)(?=[^-]|$)',
          'i'
        )
      },
      Y = /^(?:input|select|textarea|button)$/i,
      Z = /^h\d$/i,
      $ = /^[^{]+\{\s*\[native \w/,
      _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      ab = /[+~]/,
      bb = /'|\\/g,
      cb = new RegExp('\\\\([\\da-f]{1,6}' + L + '?|(' + L + ')|.)', 'ig'),
      db = function(a, b, c) {
        var d = '0x' + b - 65536;
        return d !== d || c
          ? b
          : 0 > d
            ? String.fromCharCode(d + 65536)
            : String.fromCharCode((d >> 10) | 55296, (1023 & d) | 56320);
      },
      eb = function() {
        m();
      };
    try {
      H.apply((E = I.call(v.childNodes)), v.childNodes), E[v.childNodes.length].nodeType;
    } catch (fb) {
      H = {
        apply: E.length
          ? function(a, b) {
              G.apply(a, I.call(b));
            }
          : function(a, b) {
              var c = a.length,
                d = 0;
              while ((a[c++] = b[d++]));
              a.length = c - 1;
            }
      };
    }
    function gb(a, b, d, e) {
      var f, h, j, k, l, o, r, s, w, x;
      if (
        ((b ? b.ownerDocument || b : v) !== n && m(b),
        (b = b || n),
        (d = d || []),
        (k = b.nodeType),
        'string' != typeof a || !a || (1 !== k && 9 !== k && 11 !== k))
      )
        return d;
      if (!e && p) {
        if (11 !== k && (f = _.exec(a)))
          if ((j = f[1])) {
            if (9 === k) {
              if (((h = b.getElementById(j)), !h || !h.parentNode)) return d;
              if (h.id === j) return d.push(h), d;
            } else if (
              b.ownerDocument &&
              (h = b.ownerDocument.getElementById(j)) &&
              t(b, h) &&
              h.id === j
            )
              return d.push(h), d;
          } else {
            if (f[2]) return H.apply(d, b.getElementsByTagName(a)), d;
            if ((j = f[3]) && c.getElementsByClassName)
              return H.apply(d, b.getElementsByClassName(j)), d;
          }
        if (c.qsa && (!q || !q.test(a))) {
          if (
            ((s = r = u),
            (w = b),
            (x = 1 !== k && a),
            1 === k && 'object' !== b.nodeName.toLowerCase())
          ) {
            (o = g(a)),
              (r = b.getAttribute('id')) ? (s = r.replace(bb, '\\$&')) : b.setAttribute('id', s),
              (s = "[id='" + s + "'] "),
              (l = o.length);
            while (l--) o[l] = s + rb(o[l]);
            (w = (ab.test(a) && pb(b.parentNode)) || b), (x = o.join(','));
          }
          if (x)
            try {
              return H.apply(d, w.querySelectorAll(x)), d;
            } catch (y) {
            } finally {
              r || b.removeAttribute('id');
            }
        }
      }
      return i(a.replace(R, '$1'), b, d, e);
    }
    function hb() {
      var a = [];
      function b(c, e) {
        return a.push(c + ' ') > d.cacheLength && delete b[a.shift()], (b[c + ' '] = e);
      }
      return b;
    }
    function ib(a) {
      return (a[u] = !0), a;
    }
    function jb(a) {
      var b = n.createElement('div');
      try {
        return !!a(b);
      } catch (c) {
        return !1;
      } finally {
        b.parentNode && b.parentNode.removeChild(b), (b = null);
      }
    }
    function kb(a, b) {
      var c = a.split('|'),
        e = a.length;
      while (e--) d.attrHandle[c[e]] = b;
    }
    function lb(a, b) {
      var c = b && a,
        d =
          c &&
          1 === a.nodeType &&
          1 === b.nodeType &&
          (~b.sourceIndex || C) - (~a.sourceIndex || C);
      if (d) return d;
      if (c) while ((c = c.nextSibling)) if (c === b) return -1;
      return a ? 1 : -1;
    }
    function mb(a) {
      return function(b) {
        var c = b.nodeName.toLowerCase();
        return 'input' === c && b.type === a;
      };
    }
    function nb(a) {
      return function(b) {
        var c = b.nodeName.toLowerCase();
        return ('input' === c || 'button' === c) && b.type === a;
      };
    }
    function ob(a) {
      return ib(function(b) {
        return (
          (b = +b),
          ib(function(c, d) {
            var e,
              f = a([], c.length, b),
              g = f.length;
            while (g--) c[(e = f[g])] && (c[e] = !(d[e] = c[e]));
          })
        );
      });
    }
    function pb(a) {
      return a && 'undefined' != typeof a.getElementsByTagName && a;
    }
    (c = gb.support = {}),
      (f = gb.isXML = function(a) {
        var b = a && (a.ownerDocument || a).documentElement;
        return b ? 'HTML' !== b.nodeName : !1;
      }),
      (m = gb.setDocument = function(a) {
        var b,
          e,
          g = a ? a.ownerDocument || a : v;
        return g !== n && 9 === g.nodeType && g.documentElement
          ? ((n = g),
            (o = g.documentElement),
            (e = g.defaultView),
            e &&
              e !== e.top &&
              (e.addEventListener
                ? e.addEventListener('unload', eb, !1)
                : e.attachEvent && e.attachEvent('onunload', eb)),
            (p = !f(g)),
            (c.attributes = jb(function(a) {
              return (a.className = 'i'), !a.getAttribute('className');
            })),
            (c.getElementsByTagName = jb(function(a) {
              return a.appendChild(g.createComment('')), !a.getElementsByTagName('*').length;
            })),
            (c.getElementsByClassName = $.test(g.getElementsByClassName)),
            (c.getById = jb(function(a) {
              return (
                (o.appendChild(a).id = u), !g.getElementsByName || !g.getElementsByName(u).length
              );
            })),
            c.getById
              ? ((d.find.ID = function(a, b) {
                  if ('undefined' != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : [];
                  }
                }),
                (d.filter.ID = function(a) {
                  var b = a.replace(cb, db);
                  return function(a) {
                    return a.getAttribute('id') === b;
                  };
                }))
              : (delete d.find.ID,
                (d.filter.ID = function(a) {
                  var b = a.replace(cb, db);
                  return function(a) {
                    var c = 'undefined' != typeof a.getAttributeNode && a.getAttributeNode('id');
                    return c && c.value === b;
                  };
                })),
            (d.find.TAG = c.getElementsByTagName
              ? function(a, b) {
                  return 'undefined' != typeof b.getElementsByTagName
                    ? b.getElementsByTagName(a)
                    : c.qsa ? b.querySelectorAll(a) : void 0;
                }
              : function(a, b) {
                  var c,
                    d = [],
                    e = 0,
                    f = b.getElementsByTagName(a);
                  if ('*' === a) {
                    while ((c = f[e++])) 1 === c.nodeType && d.push(c);
                    return d;
                  }
                  return f;
                }),
            (d.find.CLASS =
              c.getElementsByClassName &&
              function(a, b) {
                return p ? b.getElementsByClassName(a) : void 0;
              }),
            (r = []),
            (q = []),
            (c.qsa = $.test(g.querySelectorAll)) &&
              (jb(function(a) {
                (o.appendChild(a).innerHTML =
                  "<a id='" +
                  u +
                  "'></a><select id='" +
                  u +
                  "-\f]' msallowcapture=''><option selected=''></option></select>"),
                  a.querySelectorAll("[msallowcapture^='']").length &&
                    q.push('[*^$]=' + L + '*(?:\'\'|"")'),
                  a.querySelectorAll('[selected]').length ||
                    q.push('\\[' + L + '*(?:value|' + K + ')'),
                  a.querySelectorAll('[id~=' + u + '-]').length || q.push('~='),
                  a.querySelectorAll(':checked').length || q.push(':checked'),
                  a.querySelectorAll('a#' + u + '+*').length || q.push('.#.+[+~]');
              }),
              jb(function(a) {
                var b = g.createElement('input');
                b.setAttribute('type', 'hidden'),
                  a.appendChild(b).setAttribute('name', 'D'),
                  a.querySelectorAll('[name=d]').length && q.push('name' + L + '*[*^$|!~]?='),
                  a.querySelectorAll(':enabled').length || q.push(':enabled', ':disabled'),
                  a.querySelectorAll('*,:x'),
                  q.push(',.*:');
              })),
            (c.matchesSelector = $.test(
              (s =
                o.matches ||
                o.webkitMatchesSelector ||
                o.mozMatchesSelector ||
                o.oMatchesSelector ||
                o.msMatchesSelector)
            )) &&
              jb(function(a) {
                (c.disconnectedMatch = s.call(a, 'div')), s.call(a, "[s!='']:x"), r.push('!=', P);
              }),
            (q = q.length && new RegExp(q.join('|'))),
            (r = r.length && new RegExp(r.join('|'))),
            (b = $.test(o.compareDocumentPosition)),
            (t =
              b || $.test(o.contains)
                ? function(a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a,
                      d = b && b.parentNode;
                    return (
                      a === d ||
                      !(
                        !d ||
                        1 !== d.nodeType ||
                        !(c.contains
                          ? c.contains(d)
                          : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d))
                      )
                    );
                  }
                : function(a, b) {
                    if (b) while ((b = b.parentNode)) if (b === a) return !0;
                    return !1;
                  }),
            (B = b
              ? function(a, b) {
                  if (a === b) return (l = !0), 0;
                  var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                  return d
                    ? d
                    : ((d =
                        (a.ownerDocument || a) === (b.ownerDocument || b)
                          ? a.compareDocumentPosition(b)
                          : 1),
                      1 & d || (!c.sortDetached && b.compareDocumentPosition(a) === d)
                        ? a === g || (a.ownerDocument === v && t(v, a))
                          ? -1
                          : b === g || (b.ownerDocument === v && t(v, b))
                            ? 1
                            : k ? J(k, a) - J(k, b) : 0
                        : 4 & d ? -1 : 1);
                }
              : function(a, b) {
                  if (a === b) return (l = !0), 0;
                  var c,
                    d = 0,
                    e = a.parentNode,
                    f = b.parentNode,
                    h = [a],
                    i = [b];
                  if (!e || !f)
                    return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0;
                  if (e === f) return lb(a, b);
                  c = a;
                  while ((c = c.parentNode)) h.unshift(c);
                  c = b;
                  while ((c = c.parentNode)) i.unshift(c);
                  while (h[d] === i[d]) d++;
                  return d ? lb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0;
                }),
            g)
          : n;
      }),
      (gb.matches = function(a, b) {
        return gb(a, null, null, b);
      }),
      (gb.matchesSelector = function(a, b) {
        if (
          ((a.ownerDocument || a) !== n && m(a),
          (b = b.replace(U, "='$1']")),
          !(!c.matchesSelector || !p || (r && r.test(b)) || (q && q.test(b))))
        )
          try {
            var d = s.call(a, b);
            if (d || c.disconnectedMatch || (a.document && 11 !== a.document.nodeType)) return d;
          } catch (e) {}
        return gb(b, n, null, [a]).length > 0;
      }),
      (gb.contains = function(a, b) {
        return (a.ownerDocument || a) !== n && m(a), t(a, b);
      }),
      (gb.attr = function(a, b) {
        (a.ownerDocument || a) !== n && m(a);
        var e = d.attrHandle[b.toLowerCase()],
          f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
        return void 0 !== f
          ? f
          : c.attributes || !p
            ? a.getAttribute(b)
            : (f = a.getAttributeNode(b)) && f.specified ? f.value : null;
      }),
      (gb.error = function(a) {
        throw new Error('Syntax error, unrecognized expression: ' + a);
      }),
      (gb.uniqueSort = function(a) {
        var b,
          d = [],
          e = 0,
          f = 0;
        if (((l = !c.detectDuplicates), (k = !c.sortStable && a.slice(0)), a.sort(B), l)) {
          while ((b = a[f++])) b === a[f] && (e = d.push(f));
          while (e--) a.splice(d[e], 1);
        }
        return (k = null), a;
      }),
      (e = gb.getText = function(a) {
        var b,
          c = '',
          d = 0,
          f = a.nodeType;
        if (f) {
          if (1 === f || 9 === f || 11 === f) {
            if ('string' == typeof a.textContent) return a.textContent;
            for (a = a.firstChild; a; a = a.nextSibling) c += e(a);
          } else if (3 === f || 4 === f) return a.nodeValue;
        } else while ((b = a[d++])) c += e(b);
        return c;
      }),
      (d = gb.selectors = {
        cacheLength: 50,
        createPseudo: ib,
        match: X,
        attrHandle: {},
        find: {},
        relative: {
          '>': { dir: 'parentNode', first: !0 },
          ' ': { dir: 'parentNode' },
          '+': { dir: 'previousSibling', first: !0 },
          '~': { dir: 'previousSibling' }
        },
        preFilter: {
          ATTR: function(a) {
            return (
              (a[1] = a[1].replace(cb, db)),
              (a[3] = (a[3] || a[4] || a[5] || '').replace(cb, db)),
              '~=' === a[2] && (a[3] = ' ' + a[3] + ' '),
              a.slice(0, 4)
            );
          },
          CHILD: function(a) {
            return (
              (a[1] = a[1].toLowerCase()),
              'nth' === a[1].slice(0, 3)
                ? (a[3] || gb.error(a[0]),
                  (a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ('even' === a[3] || 'odd' === a[3]))),
                  (a[5] = +(a[7] + a[8] || 'odd' === a[3])))
                : a[3] && gb.error(a[0]),
              a
            );
          },
          PSEUDO: function(a) {
            var b,
              c = !a[6] && a[2];
            return X.CHILD.test(a[0])
              ? null
              : (a[3]
                  ? (a[2] = a[4] || a[5] || '')
                  : c &&
                    V.test(c) &&
                    (b = g(c, !0)) &&
                    (b = c.indexOf(')', c.length - b) - c.length) &&
                    ((a[0] = a[0].slice(0, b)), (a[2] = c.slice(0, b))),
                a.slice(0, 3));
          }
        },
        filter: {
          TAG: function(a) {
            var b = a.replace(cb, db).toLowerCase();
            return '*' === a
              ? function() {
                  return !0;
                }
              : function(a) {
                  return a.nodeName && a.nodeName.toLowerCase() === b;
                };
          },
          CLASS: function(a) {
            var b = y[a + ' '];
            return (
              b ||
              ((b = new RegExp('(^|' + L + ')' + a + '(' + L + '|$)')) &&
                y(a, function(a) {
                  return b.test(
                    ('string' == typeof a.className && a.className) ||
                      ('undefined' != typeof a.getAttribute && a.getAttribute('class')) ||
                      ''
                  );
                }))
            );
          },
          ATTR: function(a, b, c) {
            return function(d) {
              var e = gb.attr(d, a);
              return null == e
                ? '!=' === b
                : b
                  ? ((e += ''),
                    '=' === b
                      ? e === c
                      : '!=' === b
                        ? e !== c
                        : '^=' === b
                          ? c && 0 === e.indexOf(c)
                          : '*=' === b
                            ? c && e.indexOf(c) > -1
                            : '$=' === b
                              ? c && e.slice(-c.length) === c
                              : '~=' === b
                                ? (' ' + e.replace(Q, ' ') + ' ').indexOf(c) > -1
                                : '|=' === b ? e === c || e.slice(0, c.length + 1) === c + '-' : !1)
                  : !0;
            };
          },
          CHILD: function(a, b, c, d, e) {
            var f = 'nth' !== a.slice(0, 3),
              g = 'last' !== a.slice(-4),
              h = 'of-type' === b;
            return 1 === d && 0 === e
              ? function(a) {
                  return !!a.parentNode;
                }
              : function(b, c, i) {
                  var j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p = f !== g ? 'nextSibling' : 'previousSibling',
                    q = b.parentNode,
                    r = h && b.nodeName.toLowerCase(),
                    s = !i && !h;
                  if (q) {
                    if (f) {
                      while (p) {
                        l = b;
                        while ((l = l[p]))
                          if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                        o = p = 'only' === a && !o && 'nextSibling';
                      }
                      return !0;
                    }
                    if (((o = [g ? q.firstChild : q.lastChild]), g && s)) {
                      (k = q[u] || (q[u] = {})),
                        (j = k[a] || []),
                        (n = j[0] === w && j[1]),
                        (m = j[0] === w && j[2]),
                        (l = n && q.childNodes[n]);
                      while ((l = (++n && l && l[p]) || (m = n = 0) || o.pop()))
                        if (1 === l.nodeType && ++m && l === b) {
                          k[a] = [w, n, m];
                          break;
                        }
                    } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) m = j[1];
                    else
                      while ((l = (++n && l && l[p]) || (m = n = 0) || o.pop()))
                        if (
                          (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) &&
                          ++m &&
                          (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)
                        )
                          break;
                    return (m -= e), m === d || (m % d === 0 && m / d >= 0);
                  }
                };
          },
          PSEUDO: function(a, b) {
            var c,
              e =
                d.pseudos[a] ||
                d.setFilters[a.toLowerCase()] ||
                gb.error('unsupported pseudo: ' + a);
            return e[u]
              ? e(b)
              : e.length > 1
                ? ((c = [a, a, '', b]),
                  d.setFilters.hasOwnProperty(a.toLowerCase())
                    ? ib(function(a, c) {
                        var d,
                          f = e(a, b),
                          g = f.length;
                        while (g--) (d = J(a, f[g])), (a[d] = !(c[d] = f[g]));
                      })
                    : function(a) {
                        return e(a, 0, c);
                      })
                : e;
          }
        },
        pseudos: {
          not: ib(function(a) {
            var b = [],
              c = [],
              d = h(a.replace(R, '$1'));
            return d[u]
              ? ib(function(a, b, c, e) {
                  var f,
                    g = d(a, null, e, []),
                    h = a.length;
                  while (h--) (f = g[h]) && (a[h] = !(b[h] = f));
                })
              : function(a, e, f) {
                  return (b[0] = a), d(b, null, f, c), (b[0] = null), !c.pop();
                };
          }),
          has: ib(function(a) {
            return function(b) {
              return gb(a, b).length > 0;
            };
          }),
          contains: ib(function(a) {
            return (
              (a = a.replace(cb, db)),
              function(b) {
                return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
              }
            );
          }),
          lang: ib(function(a) {
            return (
              W.test(a || '') || gb.error('unsupported lang: ' + a),
              (a = a.replace(cb, db).toLowerCase()),
              function(b) {
                var c;
                do
                  if ((c = p ? b.lang : b.getAttribute('xml:lang') || b.getAttribute('lang')))
                    return (c = c.toLowerCase()), c === a || 0 === c.indexOf(a + '-');
                while ((b = b.parentNode) && 1 === b.nodeType);
                return !1;
              }
            );
          }),
          target: function(b) {
            var c = a.location && a.location.hash;
            return c && c.slice(1) === b.id;
          },
          root: function(a) {
            return a === o;
          },
          focus: function(a) {
            return (
              a === n.activeElement &&
              (!n.hasFocus || n.hasFocus()) &&
              !!(a.type || a.href || ~a.tabIndex)
            );
          },
          enabled: function(a) {
            return a.disabled === !1;
          },
          disabled: function(a) {
            return a.disabled === !0;
          },
          checked: function(a) {
            var b = a.nodeName.toLowerCase();
            return ('input' === b && !!a.checked) || ('option' === b && !!a.selected);
          },
          selected: function(a) {
            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
          },
          empty: function(a) {
            for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1;
            return !0;
          },
          parent: function(a) {
            return !d.pseudos.empty(a);
          },
          header: function(a) {
            return Z.test(a.nodeName);
          },
          input: function(a) {
            return Y.test(a.nodeName);
          },
          button: function(a) {
            var b = a.nodeName.toLowerCase();
            return ('input' === b && 'button' === a.type) || 'button' === b;
          },
          text: function(a) {
            var b;
            return (
              'input' === a.nodeName.toLowerCase() &&
              'text' === a.type &&
              (null == (b = a.getAttribute('type')) || 'text' === b.toLowerCase())
            );
          },
          first: ob(function() {
            return [0];
          }),
          last: ob(function(a, b) {
            return [b - 1];
          }),
          eq: ob(function(a, b, c) {
            return [0 > c ? c + b : c];
          }),
          even: ob(function(a, b) {
            for (var c = 0; b > c; c += 2) a.push(c);
            return a;
          }),
          odd: ob(function(a, b) {
            for (var c = 1; b > c; c += 2) a.push(c);
            return a;
          }),
          lt: ob(function(a, b, c) {
            for (var d = 0 > c ? c + b : c; --d >= 0; ) a.push(d);
            return a;
          }),
          gt: ob(function(a, b, c) {
            for (var d = 0 > c ? c + b : c; ++d < b; ) a.push(d);
            return a;
          })
        }
      }),
      (d.pseudos.nth = d.pseudos.eq);
    for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) d.pseudos[b] = mb(b);
    for (b in { submit: !0, reset: !0 }) d.pseudos[b] = nb(b);
    function qb() {}
    (qb.prototype = d.filters = d.pseudos),
      (d.setFilters = new qb()),
      (g = gb.tokenize = function(a, b) {
        var c,
          e,
          f,
          g,
          h,
          i,
          j,
          k = z[a + ' '];
        if (k) return b ? 0 : k.slice(0);
        (h = a), (i = []), (j = d.preFilter);
        while (h) {
          (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push((f = []))),
            (c = !1),
            (e = T.exec(h)) &&
              ((c = e.shift()),
              f.push({ value: c, type: e[0].replace(R, ' ') }),
              (h = h.slice(c.length)));
          for (g in d.filter)
            !(e = X[g].exec(h)) ||
              (j[g] && !(e = j[g](e))) ||
              ((c = e.shift()), f.push({ value: c, type: g, matches: e }), (h = h.slice(c.length)));
          if (!c) break;
        }
        return b ? h.length : h ? gb.error(a) : z(a, i).slice(0);
      });
    function rb(a) {
      for (var b = 0, c = a.length, d = ''; c > b; b++) d += a[b].value;
      return d;
    }
    function sb(a, b, c) {
      var d = b.dir,
        e = c && 'parentNode' === d,
        f = x++;
      return b.first
        ? function(b, c, f) {
            while ((b = b[d])) if (1 === b.nodeType || e) return a(b, c, f);
          }
        : function(b, c, g) {
            var h,
              i,
              j = [w, f];
            if (g) {
              while ((b = b[d])) if ((1 === b.nodeType || e) && a(b, c, g)) return !0;
            } else
              while ((b = b[d]))
                if (1 === b.nodeType || e) {
                  if (((i = b[u] || (b[u] = {})), (h = i[d]) && h[0] === w && h[1] === f))
                    return (j[2] = h[2]);
                  if (((i[d] = j), (j[2] = a(b, c, g)))) return !0;
                }
          };
    }
    function tb(a) {
      return a.length > 1
        ? function(b, c, d) {
            var e = a.length;
            while (e--) if (!a[e](b, c, d)) return !1;
            return !0;
          }
        : a[0];
    }
    function ub(a, b, c) {
      for (var d = 0, e = b.length; e > d; d++) gb(a, b[d], c);
      return c;
    }
    function vb(a, b, c, d, e) {
      for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
        (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
      return g;
    }
    function wb(a, b, c, d, e, f) {
      return (
        d && !d[u] && (d = wb(d)),
        e && !e[u] && (e = wb(e, f)),
        ib(function(f, g, h, i) {
          var j,
            k,
            l,
            m = [],
            n = [],
            o = g.length,
            p = f || ub(b || '*', h.nodeType ? [h] : h, []),
            q = !a || (!f && b) ? p : vb(p, m, a, h, i),
            r = c ? (e || (f ? a : o || d) ? [] : g) : q;
          if ((c && c(q, r, h, i), d)) {
            (j = vb(r, n)), d(j, [], h, i), (k = j.length);
            while (k--) (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
          }
          if (f) {
            if (e || a) {
              if (e) {
                (j = []), (k = r.length);
                while (k--) (l = r[k]) && j.push((q[k] = l));
                e(null, (r = []), j, i);
              }
              k = r.length;
              while (k--) (l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l));
            }
          } else (r = vb(r === g ? r.splice(o, r.length) : r)), e ? e(null, g, r, i) : H.apply(g, r);
        })
      );
    }
    function xb(a) {
      for (
        var b,
          c,
          e,
          f = a.length,
          g = d.relative[a[0].type],
          h = g || d.relative[' '],
          i = g ? 1 : 0,
          k = sb(
            function(a) {
              return a === b;
            },
            h,
            !0
          ),
          l = sb(
            function(a) {
              return J(b, a) > -1;
            },
            h,
            !0
          ),
          m = [
            function(a, c, d) {
              var e = (!g && (d || c !== j)) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
              return (b = null), e;
            }
          ];
        f > i;
        i++
      )
        if ((c = d.relative[a[i].type])) m = [sb(tb(m), c)];
        else {
          if (((c = d.filter[a[i].type].apply(null, a[i].matches)), c[u])) {
            for (e = ++i; f > e; e++) if (d.relative[a[e].type]) break;
            return wb(
              i > 1 && tb(m),
              i > 1 &&
                rb(a.slice(0, i - 1).concat({ value: ' ' === a[i - 2].type ? '*' : '' })).replace(
                  R,
                  '$1'
                ),
              c,
              e > i && xb(a.slice(i, e)),
              f > e && xb((a = a.slice(e))),
              f > e && rb(a)
            );
          }
          m.push(c);
        }
      return tb(m);
    }
    function yb(a, b) {
      var c = b.length > 0,
        e = a.length > 0,
        f = function(f, g, h, i, k) {
          var l,
            m,
            o,
            p = 0,
            q = '0',
            r = f && [],
            s = [],
            t = j,
            u = f || (e && d.find.TAG('*', k)),
            v = (w += null == t ? 1 : Math.random() || 0.1),
            x = u.length;
          for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
            if (e && l) {
              m = 0;
              while ((o = a[m++]))
                if (o(l, g, h)) {
                  i.push(l);
                  break;
                }
              k && (w = v);
            }
            c && ((l = !o && l) && p--, f && r.push(l));
          }
          if (((p += q), c && q !== p)) {
            m = 0;
            while ((o = b[m++])) o(r, s, g, h);
            if (f) {
              if (p > 0) while (q--) r[q] || s[q] || (s[q] = F.call(i));
              s = vb(s);
            }
            H.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && gb.uniqueSort(i);
          }
          return k && ((w = v), (j = t)), r;
        };
      return c ? ib(f) : f;
    }
    return (
      (h = gb.compile = function(a, b) {
        var c,
          d = [],
          e = [],
          f = A[a + ' '];
        if (!f) {
          b || (b = g(a)), (c = b.length);
          while (c--) (f = xb(b[c])), f[u] ? d.push(f) : e.push(f);
          (f = A(a, yb(e, d))), (f.selector = a);
        }
        return f;
      }),
      (i = gb.select = function(a, b, e, f) {
        var i,
          j,
          k,
          l,
          m,
          n = 'function' == typeof a && a,
          o = !f && g((a = n.selector || a));
        if (((e = e || []), 1 === o.length)) {
          if (
            ((j = o[0] = o[0].slice(0)),
            j.length > 2 &&
              'ID' === (k = j[0]).type &&
              c.getById &&
              9 === b.nodeType &&
              p &&
              d.relative[j[1].type])
          ) {
            if (((b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0]), !b)) return e;
            n && (b = b.parentNode), (a = a.slice(j.shift().value.length));
          }
          i = X.needsContext.test(a) ? 0 : j.length;
          while (i--) {
            if (((k = j[i]), d.relative[(l = k.type)])) break;
            if (
              (m = d.find[l]) &&
              (f = m(k.matches[0].replace(cb, db), (ab.test(j[0].type) && pb(b.parentNode)) || b))
            ) {
              if ((j.splice(i, 1), (a = f.length && rb(j)), !a)) return H.apply(e, f), e;
              break;
            }
          }
        }
        return (n || h(a, o))(f, b, !p, e, (ab.test(a) && pb(b.parentNode)) || b), e;
      }),
      (c.sortStable =
        u
          .split('')
          .sort(B)
          .join('') === u),
      (c.detectDuplicates = !!l),
      m(),
      (c.sortDetached = jb(function(a) {
        return 1 & a.compareDocumentPosition(n.createElement('div'));
      })),
      jb(function(a) {
        return (a.innerHTML = "<a href='#'></a>"), '#' === a.firstChild.getAttribute('href');
      }) ||
        kb('type|href|height|width', function(a, b, c) {
          return c ? void 0 : a.getAttribute(b, 'type' === b.toLowerCase() ? 1 : 2);
        }),
      (c.attributes &&
        jb(function(a) {
          return (
            (a.innerHTML = '<input/>'),
            a.firstChild.setAttribute('value', ''),
            '' === a.firstChild.getAttribute('value')
          );
        })) ||
        kb('value', function(a, b, c) {
          return c || 'input' !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
        }),
      jb(function(a) {
        return null == a.getAttribute('disabled');
      }) ||
        kb(K, function(a, b, c) {
          var d;
          return c
            ? void 0
            : a[b] === !0
              ? b.toLowerCase()
              : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
        }),
      gb
    );
  })(a);
  (m.find = s),
    (m.expr = s.selectors),
    (m.expr[':'] = m.expr.pseudos),
    (m.unique = s.uniqueSort),
    (m.text = s.getText),
    (m.isXMLDoc = s.isXML),
    (m.contains = s.contains);
  var t = m.expr.match.needsContext,
    u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    v = /^.[^:#\[\.,]*$/;
  function w(a, b, c) {
    if (m.isFunction(b))
      return m.grep(a, function(a, d) {
        return !!b.call(a, d, a) !== c;
      });
    if (b.nodeType)
      return m.grep(a, function(a) {
        return (a === b) !== c;
      });
    if ('string' == typeof b) {
      if (v.test(b)) return m.filter(b, a, c);
      b = m.filter(b, a);
    }
    return m.grep(a, function(a) {
      return m.inArray(a, b) >= 0 !== c;
    });
  }
  (m.filter = function(a, b, c) {
    var d = b[0];
    return (
      c && (a = ':not(' + a + ')'),
      1 === b.length && 1 === d.nodeType
        ? m.find.matchesSelector(d, a) ? [d] : []
        : m.find.matches(
            a,
            m.grep(b, function(a) {
              return 1 === a.nodeType;
            })
          )
    );
  }),
    m.fn.extend({
      find: function(a) {
        var b,
          c = [],
          d = this,
          e = d.length;
        if ('string' != typeof a)
          return this.pushStack(
            m(a).filter(function() {
              for (b = 0; e > b; b++) if (m.contains(d[b], this)) return !0;
            })
          );
        for (b = 0; e > b; b++) m.find(a, d[b], c);
        return (
          (c = this.pushStack(e > 1 ? m.unique(c) : c)),
          (c.selector = this.selector ? this.selector + ' ' + a : a),
          c
        );
      },
      filter: function(a) {
        return this.pushStack(w(this, a || [], !1));
      },
      not: function(a) {
        return this.pushStack(w(this, a || [], !0));
      },
      is: function(a) {
        return !!w(this, 'string' == typeof a && t.test(a) ? m(a) : a || [], !1).length;
      }
    });
  var x,
    y = a.document,
    z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    A = (m.fn.init = function(a, b) {
      var c, d;
      if (!a) return this;
      if ('string' == typeof a) {
        if (
          ((c =
            '<' === a.charAt(0) && '>' === a.charAt(a.length - 1) && a.length >= 3
              ? [null, a, null]
              : z.exec(a)),
          !c || (!c[1] && b))
        )
          return !b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a);
        if (c[1]) {
          if (
            ((b = b instanceof m ? b[0] : b),
            m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)),
            u.test(c[1]) && m.isPlainObject(b))
          )
            for (c in b) m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
          return this;
        }
        if (((d = y.getElementById(c[2])), d && d.parentNode)) {
          if (d.id !== c[2]) return x.find(a);
          (this.length = 1), (this[0] = d);
        }
        return (this.context = y), (this.selector = a), this;
      }
      return a.nodeType
        ? ((this.context = this[0] = a), (this.length = 1), this)
        : m.isFunction(a)
          ? 'undefined' != typeof x.ready ? x.ready(a) : a(m)
          : (void 0 !== a.selector && ((this.selector = a.selector), (this.context = a.context)),
            m.makeArray(a, this));
    });
  (A.prototype = m.fn), (x = m(y));
  var B = /^(?:parents|prev(?:Until|All))/,
    C = { children: !0, contents: !0, next: !0, prev: !0 };
  m.extend({
    dir: function(a, b, c) {
      var d = [],
        e = a[b];
      while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c)))
        1 === e.nodeType && d.push(e), (e = e[b]);
      return d;
    },
    sibling: function(a, b) {
      for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
      return c;
    }
  }),
    m.fn.extend({
      has: function(a) {
        var b,
          c = m(a, this),
          d = c.length;
        return this.filter(function() {
          for (b = 0; d > b; b++) if (m.contains(this, c[b])) return !0;
        });
      },
      closest: function(a, b) {
        for (
          var c,
            d = 0,
            e = this.length,
            f = [],
            g = t.test(a) || 'string' != typeof a ? m(a, b || this.context) : 0;
          e > d;
          d++
        )
          for (c = this[d]; c && c !== b; c = c.parentNode)
            if (
              c.nodeType < 11 &&
              (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))
            ) {
              f.push(c);
              break;
            }
        return this.pushStack(f.length > 1 ? m.unique(f) : f);
      },
      index: function(a) {
        return a
          ? 'string' == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this)
          : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      },
      add: function(a, b) {
        return this.pushStack(m.unique(m.merge(this.get(), m(a, b))));
      },
      addBack: function(a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
      }
    });
  function D(a, b) {
    do a = a[b];
    while (a && 1 !== a.nodeType);
    return a;
  }
  m.each(
    {
      parent: function(a) {
        var b = a.parentNode;
        return b && 11 !== b.nodeType ? b : null;
      },
      parents: function(a) {
        return m.dir(a, 'parentNode');
      },
      parentsUntil: function(a, b, c) {
        return m.dir(a, 'parentNode', c);
      },
      next: function(a) {
        return D(a, 'nextSibling');
      },
      prev: function(a) {
        return D(a, 'previousSibling');
      },
      nextAll: function(a) {
        return m.dir(a, 'nextSibling');
      },
      prevAll: function(a) {
        return m.dir(a, 'previousSibling');
      },
      nextUntil: function(a, b, c) {
        return m.dir(a, 'nextSibling', c);
      },
      prevUntil: function(a, b, c) {
        return m.dir(a, 'previousSibling', c);
      },
      siblings: function(a) {
        return m.sibling((a.parentNode || {}).firstChild, a);
      },
      children: function(a) {
        return m.sibling(a.firstChild);
      },
      contents: function(a) {
        return m.nodeName(a, 'iframe')
          ? a.contentDocument || a.contentWindow.document
          : m.merge([], a.childNodes);
      }
    },
    function(a, b) {
      m.fn[a] = function(c, d) {
        var e = m.map(this, b, c);
        return (
          'Until' !== a.slice(-5) && (d = c),
          d && 'string' == typeof d && (e = m.filter(d, e)),
          this.length > 1 && (C[a] || (e = m.unique(e)), B.test(a) && (e = e.reverse())),
          this.pushStack(e)
        );
      };
    }
  );
  var E = /\S+/g,
    F = {};
  function G(a) {
    var b = (F[a] = {});
    return (
      m.each(a.match(E) || [], function(a, c) {
        b[c] = !0;
      }),
      b
    );
  }
  (m.Callbacks = function(a) {
    a = 'string' == typeof a ? F[a] || G(a) : m.extend({}, a);
    var b,
      c,
      d,
      e,
      f,
      g,
      h = [],
      i = !a.once && [],
      j = function(l) {
        for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++)
          if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
            c = !1;
            break;
          }
        (b = !1), h && (i ? i.length && j(i.shift()) : c ? (h = []) : k.disable());
      },
      k = {
        add: function() {
          if (h) {
            var d = h.length;
            !(function f(b) {
              m.each(b, function(b, c) {
                var d = m.type(c);
                'function' === d
                  ? (a.unique && k.has(c)) || h.push(c)
                  : c && c.length && 'string' !== d && f(c);
              });
            })(arguments),
              b ? (e = h.length) : c && ((g = d), j(c));
          }
          return this;
        },
        remove: function() {
          return (
            h &&
              m.each(arguments, function(a, c) {
                var d;
                while ((d = m.inArray(c, h, d)) > -1)
                  h.splice(d, 1), b && (e >= d && e--, f >= d && f--);
              }),
            this
          );
        },
        has: function(a) {
          return a ? m.inArray(a, h) > -1 : !(!h || !h.length);
        },
        empty: function() {
          return (h = []), (e = 0), this;
        },
        disable: function() {
          return (h = i = c = void 0), this;
        },
        disabled: function() {
          return !h;
        },
        lock: function() {
          return (i = void 0), c || k.disable(), this;
        },
        locked: function() {
          return !i;
        },
        fireWith: function(a, c) {
          return (
            !h ||
              (d && !i) ||
              ((c = c || []), (c = [a, c.slice ? c.slice() : c]), b ? i.push(c) : j(c)),
            this
          );
        },
        fire: function() {
          return k.fireWith(this, arguments), this;
        },
        fired: function() {
          return !!d;
        }
      };
    return k;
  }),
    m.extend({
      Deferred: function(a) {
        var b = [
            ['resolve', 'done', m.Callbacks('once memory'), 'resolved'],
            ['reject', 'fail', m.Callbacks('once memory'), 'rejected'],
            ['notify', 'progress', m.Callbacks('memory')]
          ],
          c = 'pending',
          d = {
            state: function() {
              return c;
            },
            always: function() {
              return e.done(arguments).fail(arguments), this;
            },
            then: function() {
              var a = arguments;
              return m
                .Deferred(function(c) {
                  m.each(b, function(b, f) {
                    var g = m.isFunction(a[b]) && a[b];
                    e[f[1]](function() {
                      var a = g && g.apply(this, arguments);
                      a && m.isFunction(a.promise)
                        ? a
                            .promise()
                            .done(c.resolve)
                            .fail(c.reject)
                            .progress(c.notify)
                        : c[f[0] + 'With'](this === d ? c.promise() : this, g ? [a] : arguments);
                    });
                  }),
                    (a = null);
                })
                .promise();
            },
            promise: function(a) {
              return null != a ? m.extend(a, d) : d;
            }
          },
          e = {};
        return (
          (d.pipe = d.then),
          m.each(b, function(a, f) {
            var g = f[2],
              h = f[3];
            (d[f[1]] = g.add),
              h &&
                g.add(
                  function() {
                    c = h;
                  },
                  b[1 ^ a][2].disable,
                  b[2][2].lock
                ),
              (e[f[0]] = function() {
                return e[f[0] + 'With'](this === e ? d : this, arguments), this;
              }),
              (e[f[0] + 'With'] = g.fireWith);
          }),
          d.promise(e),
          a && a.call(e, e),
          e
        );
      },
      when: function(a) {
        var b = 0,
          c = d.call(arguments),
          e = c.length,
          f = 1 !== e || (a && m.isFunction(a.promise)) ? e : 0,
          g = 1 === f ? a : m.Deferred(),
          h = function(a, b, c) {
            return function(e) {
              (b[a] = this),
                (c[a] = arguments.length > 1 ? d.call(arguments) : e),
                c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c);
            };
          },
          i,
          j,
          k;
        if (e > 1)
          for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++)
            c[b] && m.isFunction(c[b].promise)
              ? c[b]
                  .promise()
                  .done(h(b, k, c))
                  .fail(g.reject)
                  .progress(h(b, j, i))
              : --f;
        return f || g.resolveWith(k, c), g.promise();
      }
    });
  var H;
  (m.fn.ready = function(a) {
    return m.ready.promise().done(a), this;
  }),
    m.extend({
      isReady: !1,
      readyWait: 1,
      holdReady: function(a) {
        a ? m.readyWait++ : m.ready(!0);
      },
      ready: function(a) {
        if (a === !0 ? !--m.readyWait : !m.isReady) {
          if (!y.body) return setTimeout(m.ready);
          (m.isReady = !0),
            (a !== !0 && --m.readyWait > 0) ||
              (H.resolveWith(y, [m]),
              m.fn.triggerHandler && (m(y).triggerHandler('ready'), m(y).off('ready')));
        }
      }
    });
  function I() {
    y.addEventListener
      ? (y.removeEventListener('DOMContentLoaded', J, !1), a.removeEventListener('load', J, !1))
      : (y.detachEvent('onreadystatechange', J), a.detachEvent('onload', J));
  }
  function J() {
    (y.addEventListener || 'load' === event.type || 'complete' === y.readyState) &&
      (I(), m.ready());
  }
  m.ready.promise = function(b) {
    if (!H)
      if (((H = m.Deferred()), 'complete' === y.readyState)) setTimeout(m.ready);
      else if (y.addEventListener)
        y.addEventListener('DOMContentLoaded', J, !1), a.addEventListener('load', J, !1);
      else {
        y.attachEvent('onreadystatechange', J), a.attachEvent('onload', J);
        var c = !1;
        try {
          c = null == a.frameElement && y.documentElement;
        } catch (d) {}
        c &&
          c.doScroll &&
          !(function e() {
            if (!m.isReady) {
              try {
                c.doScroll('left');
              } catch (a) {
                return setTimeout(e, 50);
              }
              I(), m.ready();
            }
          })();
      }
    return H.promise(b);
  };
  var K = 'undefined',
    L;
  for (L in m(k)) break;
  (k.ownLast = '0' !== L),
    (k.inlineBlockNeedsLayout = !1),
    m(function() {
      var a, b, c, d;
      (c = y.getElementsByTagName('body')[0]),
        c &&
          c.style &&
          ((b = y.createElement('div')),
          (d = y.createElement('div')),
          (d.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
          c.appendChild(d).appendChild(b),
          typeof b.style.zoom !== K &&
            ((b.style.cssText = 'display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1'),
            (k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth),
            a && (c.style.zoom = 1)),
          c.removeChild(d));
    }),
    (function() {
      var a = y.createElement('div');
      if (null == k.deleteExpando) {
        k.deleteExpando = !0;
        try {
          delete a.test;
        } catch (b) {
          k.deleteExpando = !1;
        }
      }
      a = null;
    })(),
    (m.acceptData = function(a) {
      var b = m.noData[(a.nodeName + ' ').toLowerCase()],
        c = +a.nodeType || 1;
      return 1 !== c && 9 !== c ? !1 : !b || (b !== !0 && a.getAttribute('classid') === b);
    });
  var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    N = /([A-Z])/g;
  function O(a, b, c) {
    if (void 0 === c && 1 === a.nodeType) {
      var d = 'data-' + b.replace(N, '-$1').toLowerCase();
      if (((c = a.getAttribute(d)), 'string' == typeof c)) {
        try {
          c =
            'true' === c
              ? !0
              : 'false' === c
                ? !1
                : 'null' === c ? null : +c + '' === c ? +c : M.test(c) ? m.parseJSON(c) : c;
        } catch (e) {}
        m.data(a, b, c);
      } else c = void 0;
    }
    return c;
  }
  function P(a) {
    var b;
    for (b in a) if (('data' !== b || !m.isEmptyObject(a[b])) && 'toJSON' !== b) return !1;
    return !0;
  }
  function Q(a, b, d, e) {
    if (m.acceptData(a)) {
      var f,
        g,
        h = m.expando,
        i = a.nodeType,
        j = i ? m.cache : a,
        k = i ? a[h] : a[h] && h;
      if ((k && j[k] && (e || j[k].data)) || void 0 !== d || 'string' != typeof b)
        return (
          k || (k = i ? (a[h] = c.pop() || m.guid++) : h),
          j[k] || (j[k] = i ? {} : { toJSON: m.noop }),
          ('object' == typeof b || 'function' == typeof b) &&
            (e ? (j[k] = m.extend(j[k], b)) : (j[k].data = m.extend(j[k].data, b))),
          (g = j[k]),
          e || (g.data || (g.data = {}), (g = g.data)),
          void 0 !== d && (g[m.camelCase(b)] = d),
          'string' == typeof b ? ((f = g[b]), null == f && (f = g[m.camelCase(b)])) : (f = g),
          f
        );
    }
  }
  function R(a, b, c) {
    if (m.acceptData(a)) {
      var d,
        e,
        f = a.nodeType,
        g = f ? m.cache : a,
        h = f ? a[m.expando] : m.expando;
      if (g[h]) {
        if (b && (d = c ? g[h] : g[h].data)) {
          m.isArray(b)
            ? (b = b.concat(m.map(b, m.camelCase)))
            : b in d ? (b = [b]) : ((b = m.camelCase(b)), (b = b in d ? [b] : b.split(' '))),
            (e = b.length);
          while (e--) delete d[b[e]];
          if (c ? !P(d) : !m.isEmptyObject(d)) return;
        }
        (c || (delete g[h].data, P(g[h]))) &&
          (f
            ? m.cleanData([a], !0)
            : k.deleteExpando || g != g.window ? delete g[h] : (g[h] = null));
      }
    }
  }
  m.extend({
    cache: {},
    noData: {
      'applet ': !0,
      'embed ': !0,
      'object ': 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'
    },
    hasData: function(a) {
      return (a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando]), !!a && !P(a);
    },
    data: function(a, b, c) {
      return Q(a, b, c);
    },
    removeData: function(a, b) {
      return R(a, b);
    },
    _data: function(a, b, c) {
      return Q(a, b, c, !0);
    },
    _removeData: function(a, b) {
      return R(a, b, !0);
    }
  }),
    m.fn.extend({
      data: function(a, b) {
        var c,
          d,
          e,
          f = this[0],
          g = f && f.attributes;
        if (void 0 === a) {
          if (this.length && ((e = m.data(f)), 1 === f.nodeType && !m._data(f, 'parsedAttrs'))) {
            c = g.length;
            while (c--)
              g[c] &&
                ((d = g[c].name),
                0 === d.indexOf('data-') && ((d = m.camelCase(d.slice(5))), O(f, d, e[d])));
            m._data(f, 'parsedAttrs', !0);
          }
          return e;
        }
        return 'object' == typeof a
          ? this.each(function() {
              m.data(this, a);
            })
          : arguments.length > 1
            ? this.each(function() {
                m.data(this, a, b);
              })
            : f ? O(f, a, m.data(f, a)) : void 0;
      },
      removeData: function(a) {
        return this.each(function() {
          m.removeData(this, a);
        });
      }
    }),
    m.extend({
      queue: function(a, b, c) {
        var d;
        return a
          ? ((b = (b || 'fx') + 'queue'),
            (d = m._data(a, b)),
            c && (!d || m.isArray(c) ? (d = m._data(a, b, m.makeArray(c))) : d.push(c)),
            d || [])
          : void 0;
      },
      dequeue: function(a, b) {
        b = b || 'fx';
        var c = m.queue(a, b),
          d = c.length,
          e = c.shift(),
          f = m._queueHooks(a, b),
          g = function() {
            m.dequeue(a, b);
          };
        'inprogress' === e && ((e = c.shift()), d--),
          e && ('fx' === b && c.unshift('inprogress'), delete f.stop, e.call(a, g, f)),
          !d && f && f.empty.fire();
      },
      _queueHooks: function(a, b) {
        var c = b + 'queueHooks';
        return (
          m._data(a, c) ||
          m._data(a, c, {
            empty: m.Callbacks('once memory').add(function() {
              m._removeData(a, b + 'queue'), m._removeData(a, c);
            })
          })
        );
      }
    }),
    m.fn.extend({
      queue: function(a, b) {
        var c = 2;
        return (
          'string' != typeof a && ((b = a), (a = 'fx'), c--),
          arguments.length < c
            ? m.queue(this[0], a)
            : void 0 === b
              ? this
              : this.each(function() {
                  var c = m.queue(this, a, b);
                  m._queueHooks(this, a), 'fx' === a && 'inprogress' !== c[0] && m.dequeue(this, a);
                })
        );
      },
      dequeue: function(a) {
        return this.each(function() {
          m.dequeue(this, a);
        });
      },
      clearQueue: function(a) {
        return this.queue(a || 'fx', []);
      },
      promise: function(a, b) {
        var c,
          d = 1,
          e = m.Deferred(),
          f = this,
          g = this.length,
          h = function() {
            --d || e.resolveWith(f, [f]);
          };
        'string' != typeof a && ((b = a), (a = void 0)), (a = a || 'fx');
        while (g--) (c = m._data(f[g], a + 'queueHooks')), c && c.empty && (d++, c.empty.add(h));
        return h(), e.promise(b);
      }
    });
  var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    T = ['Top', 'Right', 'Bottom', 'Left'],
    U = function(a, b) {
      return (a = b || a), 'none' === m.css(a, 'display') || !m.contains(a.ownerDocument, a);
    },
    V = (m.access = function(a, b, c, d, e, f, g) {
      var h = 0,
        i = a.length,
        j = null == c;
      if ('object' === m.type(c)) {
        e = !0;
        for (h in c) m.access(a, b, h, c[h], !0, f, g);
      } else if (
        void 0 !== d &&
        ((e = !0),
        m.isFunction(d) || (g = !0),
        j &&
          (g
            ? (b.call(a, d), (b = null))
            : ((j = b),
              (b = function(a, b, c) {
                return j.call(m(a), c);
              }))),
        b)
      )
        for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
      return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    }),
    W = /^(?:checkbox|radio)$/i;
  !(function() {
    var a = y.createElement('input'),
      b = y.createElement('div'),
      c = y.createDocumentFragment();
    if (
      ((b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
      (k.leadingWhitespace = 3 === b.firstChild.nodeType),
      (k.tbody = !b.getElementsByTagName('tbody').length),
      (k.htmlSerialize = !!b.getElementsByTagName('link').length),
      (k.html5Clone = '<:nav></:nav>' !== y.createElement('nav').cloneNode(!0).outerHTML),
      (a.type = 'checkbox'),
      (a.checked = !0),
      c.appendChild(a),
      (k.appendChecked = a.checked),
      (b.innerHTML = '<textarea>x</textarea>'),
      (k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue),
      c.appendChild(b),
      (b.innerHTML = "<input type='radio' checked='checked' name='t'/>"),
      (k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (k.noCloneEvent = !0),
      b.attachEvent &&
        (b.attachEvent('onclick', function() {
          k.noCloneEvent = !1;
        }),
        b.cloneNode(!0).click()),
      null == k.deleteExpando)
    ) {
      k.deleteExpando = !0;
      try {
        delete b.test;
      } catch (d) {
        k.deleteExpando = !1;
      }
    }
  })(),
    (function() {
      var b,
        c,
        d = y.createElement('div');
      for (b in { submit: !0, change: !0, focusin: !0 })
        (c = 'on' + b),
          (k[b + 'Bubbles'] = c in a) ||
            (d.setAttribute(c, 't'), (k[b + 'Bubbles'] = d.attributes[c].expando === !1));
      d = null;
    })();
  var X = /^(?:input|select|textarea)$/i,
    Y = /^key/,
    Z = /^(?:mouse|pointer|contextmenu)|click/,
    $ = /^(?:focusinfocus|focusoutblur)$/,
    _ = /^([^.]*)(?:\.(.+)|)$/;
  function ab() {
    return !0;
  }
  function bb() {
    return !1;
  }
  function cb() {
    try {
      return y.activeElement;
    } catch (a) {}
  }
  (m.event = {
    global: {},
    add: function(a, b, c, d, e) {
      var f,
        g,
        h,
        i,
        j,
        k,
        l,
        n,
        o,
        p,
        q,
        r = m._data(a);
      if (r) {
        c.handler && ((i = c), (c = i.handler), (e = i.selector)),
          c.guid || (c.guid = m.guid++),
          (g = r.events) || (g = r.events = {}),
          (k = r.handle) ||
            ((k = r.handle = function(a) {
              return typeof m === K || (a && m.event.triggered === a.type)
                ? void 0
                : m.event.dispatch.apply(k.elem, arguments);
            }),
            (k.elem = a)),
          (b = (b || '').match(E) || ['']),
          (h = b.length);
        while (h--)
          (f = _.exec(b[h]) || []),
            (o = q = f[1]),
            (p = (f[2] || '').split('.').sort()),
            o &&
              ((j = m.event.special[o] || {}),
              (o = (e ? j.delegateType : j.bindType) || o),
              (j = m.event.special[o] || {}),
              (l = m.extend(
                {
                  type: o,
                  origType: q,
                  data: d,
                  handler: c,
                  guid: c.guid,
                  selector: e,
                  needsContext: e && m.expr.match.needsContext.test(e),
                  namespace: p.join('.')
                },
                i
              )),
              (n = g[o]) ||
                ((n = g[o] = []),
                (n.delegateCount = 0),
                (j.setup && j.setup.call(a, d, p, k) !== !1) ||
                  (a.addEventListener
                    ? a.addEventListener(o, k, !1)
                    : a.attachEvent && a.attachEvent('on' + o, k))),
              j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)),
              e ? n.splice(n.delegateCount++, 0, l) : n.push(l),
              (m.event.global[o] = !0));
        a = null;
      }
    },
    remove: function(a, b, c, d, e) {
      var f,
        g,
        h,
        i,
        j,
        k,
        l,
        n,
        o,
        p,
        q,
        r = m.hasData(a) && m._data(a);
      if (r && (k = r.events)) {
        (b = (b || '').match(E) || ['']), (j = b.length);
        while (j--)
          if (((h = _.exec(b[j]) || []), (o = q = h[1]), (p = (h[2] || '').split('.').sort()), o)) {
            (l = m.event.special[o] || {}),
              (o = (d ? l.delegateType : l.bindType) || o),
              (n = k[o] || []),
              (h = h[2] && new RegExp('(^|\\.)' + p.join('\\.(?:.*\\.|)') + '(\\.|$)')),
              (i = f = n.length);
            while (f--)
              (g = n[f]),
                (!e && q !== g.origType) ||
                  (c && c.guid !== g.guid) ||
                  (h && !h.test(g.namespace)) ||
                  (d && d !== g.selector && ('**' !== d || !g.selector)) ||
                  (n.splice(f, 1),
                  g.selector && n.delegateCount--,
                  l.remove && l.remove.call(a, g));
            i &&
              !n.length &&
              ((l.teardown && l.teardown.call(a, p, r.handle) !== !1) ||
                m.removeEvent(a, o, r.handle),
              delete k[o]);
          } else for (o in k) m.event.remove(a, o + b[j], c, d, !0);
        m.isEmptyObject(k) && (delete r.handle, m._removeData(a, 'events'));
      }
    },
    trigger: function(b, c, d, e) {
      var f,
        g,
        h,
        i,
        k,
        l,
        n,
        o = [d || y],
        p = j.call(b, 'type') ? b.type : b,
        q = j.call(b, 'namespace') ? b.namespace.split('.') : [];
      if (
        ((h = l = d = d || y),
        3 !== d.nodeType &&
          8 !== d.nodeType &&
          !$.test(p + m.event.triggered) &&
          (p.indexOf('.') >= 0 && ((q = p.split('.')), (p = q.shift()), q.sort()),
          (g = p.indexOf(':') < 0 && 'on' + p),
          (b = b[m.expando] ? b : new m.Event(p, 'object' == typeof b && b)),
          (b.isTrigger = e ? 2 : 3),
          (b.namespace = q.join('.')),
          (b.namespace_re = b.namespace
            ? new RegExp('(^|\\.)' + q.join('\\.(?:.*\\.|)') + '(\\.|$)')
            : null),
          (b.result = void 0),
          b.target || (b.target = d),
          (c = null == c ? [b] : m.makeArray(c, [b])),
          (k = m.event.special[p] || {}),
          e || !k.trigger || k.trigger.apply(d, c) !== !1))
      ) {
        if (!e && !k.noBubble && !m.isWindow(d)) {
          for (i = k.delegateType || p, $.test(i + p) || (h = h.parentNode); h; h = h.parentNode)
            o.push(h), (l = h);
          l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a);
        }
        n = 0;
        while ((h = o[n++]) && !b.isPropagationStopped())
          (b.type = n > 1 ? i : k.bindType || p),
            (f = (m._data(h, 'events') || {})[b.type] && m._data(h, 'handle')),
            f && f.apply(h, c),
            (f = g && h[g]),
            f &&
              f.apply &&
              m.acceptData(h) &&
              ((b.result = f.apply(h, c)), b.result === !1 && b.preventDefault());
        if (
          ((b.type = p),
          !e &&
            !b.isDefaultPrevented() &&
            (!k._default || k._default.apply(o.pop(), c) === !1) &&
            m.acceptData(d) &&
            g &&
            d[p] &&
            !m.isWindow(d))
        ) {
          (l = d[g]), l && (d[g] = null), (m.event.triggered = p);
          try {
            d[p]();
          } catch (r) {}
          (m.event.triggered = void 0), l && (d[g] = l);
        }
        return b.result;
      }
    },
    dispatch: function(a) {
      a = m.event.fix(a);
      var b,
        c,
        e,
        f,
        g,
        h = [],
        i = d.call(arguments),
        j = (m._data(this, 'events') || {})[a.type] || [],
        k = m.event.special[a.type] || {};
      if (
        ((i[0] = a),
        (a.delegateTarget = this),
        !k.preDispatch || k.preDispatch.call(this, a) !== !1)
      ) {
        (h = m.event.handlers.call(this, a, j)), (b = 0);
        while ((f = h[b++]) && !a.isPropagationStopped()) {
          (a.currentTarget = f.elem), (g = 0);
          while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())
            (!a.namespace_re || a.namespace_re.test(e.namespace)) &&
              ((a.handleObj = e),
              (a.data = e.data),
              (c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i)),
              void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
        }
        return k.postDispatch && k.postDispatch.call(this, a), a.result;
      }
    },
    handlers: function(a, b) {
      var c,
        d,
        e,
        f,
        g = [],
        h = b.delegateCount,
        i = a.target;
      if (h && i.nodeType && (!a.button || 'click' !== a.type))
        for (; i != this; i = i.parentNode || this)
          if (1 === i.nodeType && (i.disabled !== !0 || 'click' !== a.type)) {
            for (e = [], f = 0; h > f; f++)
              (d = b[f]),
                (c = d.selector + ' '),
                void 0 === e[c] &&
                  (e[c] = d.needsContext
                    ? m(c, this).index(i) >= 0
                    : m.find(c, this, null, [i]).length),
                e[c] && e.push(d);
            e.length && g.push({ elem: i, handlers: e });
          }
      return h < b.length && g.push({ elem: this, handlers: b.slice(h) }), g;
    },
    fix: function(a) {
      if (a[m.expando]) return a;
      var b,
        c,
        d,
        e = a.type,
        f = a,
        g = this.fixHooks[e];
      g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}),
        (d = g.props ? this.props.concat(g.props) : this.props),
        (a = new m.Event(f)),
        (b = d.length);
      while (b--) (c = d[b]), (a[c] = f[c]);
      return (
        a.target || (a.target = f.srcElement || y),
        3 === a.target.nodeType && (a.target = a.target.parentNode),
        (a.metaKey = !!a.metaKey),
        g.filter ? g.filter(a, f) : a
      );
    },
    props: 'altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
      ' '
    ),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter: function(a, b) {
        return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a;
      }
    },
    mouseHooks: {
      props: 'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(
        ' '
      ),
      filter: function(a, b) {
        var c,
          d,
          e,
          f = b.button,
          g = b.fromElement;
        return (
          null == a.pageX &&
            null != b.clientX &&
            ((d = a.target.ownerDocument || y),
            (e = d.documentElement),
            (c = d.body),
            (a.pageX =
              b.clientX +
              ((e && e.scrollLeft) || (c && c.scrollLeft) || 0) -
              ((e && e.clientLeft) || (c && c.clientLeft) || 0)),
            (a.pageY =
              b.clientY +
              ((e && e.scrollTop) || (c && c.scrollTop) || 0) -
              ((e && e.clientTop) || (c && c.clientTop) || 0))),
          !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g),
          a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
          a
        );
      }
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function() {
          if (this !== cb() && this.focus)
            try {
              return this.focus(), !1;
            } catch (a) {}
        },
        delegateType: 'focusin'
      },
      blur: {
        trigger: function() {
          return this === cb() && this.blur ? (this.blur(), !1) : void 0;
        },
        delegateType: 'focusout'
      },
      click: {
        trigger: function() {
          return m.nodeName(this, 'input') && 'checkbox' === this.type && this.click
            ? (this.click(), !1)
            : void 0;
        },
        _default: function(a) {
          return m.nodeName(a.target, 'a');
        }
      },
      beforeunload: {
        postDispatch: function(a) {
          void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
        }
      }
    },
    simulate: function(a, b, c, d) {
      var e = m.extend(new m.Event(), c, { type: a, isSimulated: !0, originalEvent: {} });
      d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e),
        e.isDefaultPrevented() && c.preventDefault();
    }
  }),
    (m.removeEvent = y.removeEventListener
      ? function(a, b, c) {
          a.removeEventListener && a.removeEventListener(b, c, !1);
        }
      : function(a, b, c) {
          var d = 'on' + b;
          a.detachEvent && (typeof a[d] === K && (a[d] = null), a.detachEvent(d, c));
        }),
    (m.Event = function(a, b) {
      return this instanceof m.Event
        ? (a && a.type
            ? ((this.originalEvent = a),
              (this.type = a.type),
              (this.isDefaultPrevented =
                a.defaultPrevented || (void 0 === a.defaultPrevented && a.returnValue === !1)
                  ? ab
                  : bb))
            : (this.type = a),
          b && m.extend(this, b),
          (this.timeStamp = (a && a.timeStamp) || m.now()),
          void (this[m.expando] = !0))
        : new m.Event(a, b);
    }),
    (m.Event.prototype = {
      isDefaultPrevented: bb,
      isPropagationStopped: bb,
      isImmediatePropagationStopped: bb,
      preventDefault: function() {
        var a = this.originalEvent;
        (this.isDefaultPrevented = ab),
          a && (a.preventDefault ? a.preventDefault() : (a.returnValue = !1));
      },
      stopPropagation: function() {
        var a = this.originalEvent;
        (this.isPropagationStopped = ab),
          a && (a.stopPropagation && a.stopPropagation(), (a.cancelBubble = !0));
      },
      stopImmediatePropagation: function() {
        var a = this.originalEvent;
        (this.isImmediatePropagationStopped = ab),
          a && a.stopImmediatePropagation && a.stopImmediatePropagation(),
          this.stopPropagation();
      }
    }),
    m.each(
      {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout',
        pointerenter: 'pointerover',
        pointerleave: 'pointerout'
      },
      function(a, b) {
        m.event.special[a] = {
          delegateType: b,
          bindType: b,
          handle: function(a) {
            var c,
              d = this,
              e = a.relatedTarget,
              f = a.handleObj;
            return (
              (!e || (e !== d && !m.contains(d, e))) &&
                ((a.type = f.origType), (c = f.handler.apply(this, arguments)), (a.type = b)),
              c
            );
          }
        };
      }
    ),
    k.submitBubbles ||
      (m.event.special.submit = {
        setup: function() {
          return m.nodeName(this, 'form')
            ? !1
            : void m.event.add(this, 'click._submit keypress._submit', function(a) {
                var b = a.target,
                  c = m.nodeName(b, 'input') || m.nodeName(b, 'button') ? b.form : void 0;
                c &&
                  !m._data(c, 'submitBubbles') &&
                  (m.event.add(c, 'submit._submit', function(a) {
                    a._submit_bubble = !0;
                  }),
                  m._data(c, 'submitBubbles', !0));
              });
        },
        postDispatch: function(a) {
          a._submit_bubble &&
            (delete a._submit_bubble,
            this.parentNode && !a.isTrigger && m.event.simulate('submit', this.parentNode, a, !0));
        },
        teardown: function() {
          return m.nodeName(this, 'form') ? !1 : void m.event.remove(this, '._submit');
        }
      }),
    k.changeBubbles ||
      (m.event.special.change = {
        setup: function() {
          return X.test(this.nodeName)
            ? (('checkbox' === this.type || 'radio' === this.type) &&
                (m.event.add(this, 'propertychange._change', function(a) {
                  'checked' === a.originalEvent.propertyName && (this._just_changed = !0);
                }),
                m.event.add(this, 'click._change', function(a) {
                  this._just_changed && !a.isTrigger && (this._just_changed = !1),
                    m.event.simulate('change', this, a, !0);
                })),
              !1)
            : void m.event.add(this, 'beforeactivate._change', function(a) {
                var b = a.target;
                X.test(b.nodeName) &&
                  !m._data(b, 'changeBubbles') &&
                  (m.event.add(b, 'change._change', function(a) {
                    !this.parentNode ||
                      a.isSimulated ||
                      a.isTrigger ||
                      m.event.simulate('change', this.parentNode, a, !0);
                  }),
                  m._data(b, 'changeBubbles', !0));
              });
        },
        handle: function(a) {
          var b = a.target;
          return this !== b ||
            a.isSimulated ||
            a.isTrigger ||
            ('radio' !== b.type && 'checkbox' !== b.type)
            ? a.handleObj.handler.apply(this, arguments)
            : void 0;
        },
        teardown: function() {
          return m.event.remove(this, '._change'), !X.test(this.nodeName);
        }
      }),
    k.focusinBubbles ||
      m.each({ focus: 'focusin', blur: 'focusout' }, function(a, b) {
        var c = function(a) {
          m.event.simulate(b, a.target, m.event.fix(a), !0);
        };
        m.event.special[b] = {
          setup: function() {
            var d = this.ownerDocument || this,
              e = m._data(d, b);
            e || d.addEventListener(a, c, !0), m._data(d, b, (e || 0) + 1);
          },
          teardown: function() {
            var d = this.ownerDocument || this,
              e = m._data(d, b) - 1;
            e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0), m._removeData(d, b));
          }
        };
      }),
    m.fn.extend({
      on: function(a, b, c, d, e) {
        var f, g;
        if ('object' == typeof a) {
          'string' != typeof b && ((c = c || b), (b = void 0));
          for (f in a) this.on(f, b, c, a[f], e);
          return this;
        }
        if (
          (null == c && null == d
            ? ((d = b), (c = b = void 0))
            : null == d &&
              ('string' == typeof b ? ((d = c), (c = void 0)) : ((d = c), (c = b), (b = void 0))),
          d === !1)
        )
          d = bb;
        else if (!d) return this;
        return (
          1 === e &&
            ((g = d),
            (d = function(a) {
              return m().off(a), g.apply(this, arguments);
            }),
            (d.guid = g.guid || (g.guid = m.guid++))),
          this.each(function() {
            m.event.add(this, a, d, c, b);
          })
        );
      },
      one: function(a, b, c, d) {
        return this.on(a, b, c, d, 1);
      },
      off: function(a, b, c) {
        var d, e;
        if (a && a.preventDefault && a.handleObj)
          return (
            (d = a.handleObj),
            m(a.delegateTarget).off(
              d.namespace ? d.origType + '.' + d.namespace : d.origType,
              d.selector,
              d.handler
            ),
            this
          );
        if ('object' == typeof a) {
          for (e in a) this.off(e, b, a[e]);
          return this;
        }
        return (
          (b === !1 || 'function' == typeof b) && ((c = b), (b = void 0)),
          c === !1 && (c = bb),
          this.each(function() {
            m.event.remove(this, a, c, b);
          })
        );
      },
      trigger: function(a, b) {
        return this.each(function() {
          m.event.trigger(a, b, this);
        });
      },
      triggerHandler: function(a, b) {
        var c = this[0];
        return c ? m.event.trigger(a, b, c, !0) : void 0;
      }
    });
  function db(a) {
    var b = eb.split('|'),
      c = a.createDocumentFragment();
    if (c.createElement) while (b.length) c.createElement(b.pop());
    return c;
  }
  var eb =
      'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video',
    fb = / jQuery\d+="(?:null|\d+)"/g,
    gb = new RegExp('<(?:' + eb + ')[\\s/>]', 'i'),
    hb = /^\s+/,
    ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    jb = /<([\w:]+)/,
    kb = /<tbody/i,
    lb = /<|&#?\w+;/,
    mb = /<(?:script|style|link)/i,
    nb = /checked\s*(?:[^=]|=\s*.checked.)/i,
    ob = /^$|\/(?:java|ecma)script/i,
    pb = /^true\/(.*)/,
    qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    rb = {
      option: [1, "<select multiple='multiple'>", '</select>'],
      legend: [1, '<fieldset>', '</fieldset>'],
      area: [1, '<map>', '</map>'],
      param: [1, '<object>', '</object>'],
      thead: [1, '<table>', '</table>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      _default: k.htmlSerialize ? [0, '', ''] : [1, 'X<div>', '</div>']
    },
    sb = db(y),
    tb = sb.appendChild(y.createElement('div'));
  (rb.optgroup = rb.option),
    (rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead),
    (rb.th = rb.td);
  function ub(a, b) {
    var c,
      d,
      e = 0,
      f =
        typeof a.getElementsByTagName !== K
          ? a.getElementsByTagName(b || '*')
          : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || '*') : void 0;
    if (!f)
      for (f = [], c = a.childNodes || a; null != (d = c[e]); e++)
        !b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b));
    return void 0 === b || (b && m.nodeName(a, b)) ? m.merge([a], f) : f;
  }
  function vb(a) {
    W.test(a.type) && (a.defaultChecked = a.checked);
  }
  function wb(a, b) {
    return m.nodeName(a, 'table') && m.nodeName(11 !== b.nodeType ? b : b.firstChild, 'tr')
      ? a.getElementsByTagName('tbody')[0] || a.appendChild(a.ownerDocument.createElement('tbody'))
      : a;
  }
  function xb(a) {
    return (a.type = (null !== m.find.attr(a, 'type')) + '/' + a.type), a;
  }
  function yb(a) {
    var b = pb.exec(a.type);
    return b ? (a.type = b[1]) : a.removeAttribute('type'), a;
  }
  function zb(a, b) {
    for (var c, d = 0; null != (c = a[d]); d++)
      m._data(c, 'globalEval', !b || m._data(b[d], 'globalEval'));
  }
  function Ab(a, b) {
    if (1 === b.nodeType && m.hasData(a)) {
      var c,
        d,
        e,
        f = m._data(a),
        g = m._data(b, f),
        h = f.events;
      if (h) {
        delete g.handle, (g.events = {});
        for (c in h) for (d = 0, e = h[c].length; e > d; d++) m.event.add(b, c, h[c][d]);
      }
      g.data && (g.data = m.extend({}, g.data));
    }
  }
  function Bb(a, b) {
    var c, d, e;
    if (1 === b.nodeType) {
      if (((c = b.nodeName.toLowerCase()), !k.noCloneEvent && b[m.expando])) {
        e = m._data(b);
        for (d in e.events) m.removeEvent(b, d, e.handle);
        b.removeAttribute(m.expando);
      }
      'script' === c && b.text !== a.text
        ? ((xb(b).text = a.text), yb(b))
        : 'object' === c
          ? (b.parentNode && (b.outerHTML = a.outerHTML),
            k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML))
          : 'input' === c && W.test(a.type)
            ? ((b.defaultChecked = b.checked = a.checked),
              b.value !== a.value && (b.value = a.value))
            : 'option' === c
              ? (b.defaultSelected = b.selected = a.defaultSelected)
              : ('input' === c || 'textarea' === c) && (b.defaultValue = a.defaultValue);
    }
  }
  m.extend({
    clone: function(a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i = m.contains(a.ownerDocument, a);
      if (
        (k.html5Clone || m.isXMLDoc(a) || !gb.test('<' + a.nodeName + '>')
          ? (f = a.cloneNode(!0))
          : ((tb.innerHTML = a.outerHTML), tb.removeChild((f = tb.firstChild))),
        !(
          (k.noCloneEvent && k.noCloneChecked) ||
          (1 !== a.nodeType && 11 !== a.nodeType) ||
          m.isXMLDoc(a)
        ))
      )
        for (d = ub(f), h = ub(a), g = 0; null != (e = h[g]); ++g) d[g] && Bb(e, d[g]);
      if (b)
        if (c) for (h = h || ub(a), d = d || ub(f), g = 0; null != (e = h[g]); g++) Ab(e, d[g]);
        else Ab(a, f);
      return (
        (d = ub(f, 'script')), d.length > 0 && zb(d, !i && ub(a, 'script')), (d = h = e = null), f
      );
    },
    buildFragment: function(a, b, c, d) {
      for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++)
        if (((f = a[q]), f || 0 === f))
          if ('object' === m.type(f)) m.merge(p, f.nodeType ? [f] : f);
          else if (lb.test(f)) {
            (h = h || o.appendChild(b.createElement('div'))),
              (i = (jb.exec(f) || ['', ''])[1].toLowerCase()),
              (l = rb[i] || rb._default),
              (h.innerHTML = l[1] + f.replace(ib, '<$1></$2>') + l[2]),
              (e = l[0]);
            while (e--) h = h.lastChild;
            if (
              (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])),
              !k.tbody)
            ) {
              (f =
                'table' !== i || kb.test(f)
                  ? '<table>' !== l[1] || kb.test(f) ? 0 : h
                  : h.firstChild),
                (e = f && f.childNodes.length);
              while (e--)
                m.nodeName((j = f.childNodes[e]), 'tbody') &&
                  !j.childNodes.length &&
                  f.removeChild(j);
            }
            m.merge(p, h.childNodes), (h.textContent = '');
            while (h.firstChild) h.removeChild(h.firstChild);
            h = o.lastChild;
          } else p.push(b.createTextNode(f));
      h && o.removeChild(h), k.appendChecked || m.grep(ub(p, 'input'), vb), (q = 0);
      while ((f = p[q++]))
        if (
          (!d || -1 === m.inArray(f, d)) &&
          ((g = m.contains(f.ownerDocument, f)),
          (h = ub(o.appendChild(f), 'script')),
          g && zb(h),
          c)
        ) {
          e = 0;
          while ((f = h[e++])) ob.test(f.type || '') && c.push(f);
        }
      return (h = null), o;
    },
    cleanData: function(a, b) {
      for (
        var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special;
        null != (d = a[h]);
        h++
      )
        if ((b || m.acceptData(d)) && ((f = d[i]), (g = f && j[f]))) {
          if (g.events)
            for (e in g.events) n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle);
          j[f] &&
            (delete j[f],
            l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : (d[i] = null),
            c.push(f));
        }
    }
  }),
    m.fn.extend({
      text: function(a) {
        return V(
          this,
          function(a) {
            return void 0 === a
              ? m.text(this)
              : this.empty().append(((this[0] && this[0].ownerDocument) || y).createTextNode(a));
          },
          null,
          a,
          arguments.length
        );
      },
      append: function() {
        return this.domManip(arguments, function(a) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var b = wb(this, a);
            b.appendChild(a);
          }
        });
      },
      prepend: function() {
        return this.domManip(arguments, function(a) {
          if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
            var b = wb(this, a);
            b.insertBefore(a, b.firstChild);
          }
        });
      },
      before: function() {
        return this.domManip(arguments, function(a) {
          this.parentNode && this.parentNode.insertBefore(a, this);
        });
      },
      after: function() {
        return this.domManip(arguments, function(a) {
          this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
        });
      },
      remove: function(a, b) {
        for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
          b || 1 !== c.nodeType || m.cleanData(ub(c)),
            c.parentNode &&
              (b && m.contains(c.ownerDocument, c) && zb(ub(c, 'script')),
              c.parentNode.removeChild(c));
        return this;
      },
      empty: function() {
        for (var a, b = 0; null != (a = this[b]); b++) {
          1 === a.nodeType && m.cleanData(ub(a, !1));
          while (a.firstChild) a.removeChild(a.firstChild);
          a.options && m.nodeName(a, 'select') && (a.options.length = 0);
        }
        return this;
      },
      clone: function(a, b) {
        return (
          (a = null == a ? !1 : a),
          (b = null == b ? a : b),
          this.map(function() {
            return m.clone(this, a, b);
          })
        );
      },
      html: function(a) {
        return V(
          this,
          function(a) {
            var b = this[0] || {},
              c = 0,
              d = this.length;
            if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(fb, '') : void 0;
            if (
              !(
                'string' != typeof a ||
                mb.test(a) ||
                (!k.htmlSerialize && gb.test(a)) ||
                (!k.leadingWhitespace && hb.test(a)) ||
                rb[(jb.exec(a) || ['', ''])[1].toLowerCase()]
              )
            ) {
              a = a.replace(ib, '<$1></$2>');
              try {
                for (; d > c; c++)
                  (b = this[c] || {}),
                    1 === b.nodeType && (m.cleanData(ub(b, !1)), (b.innerHTML = a));
                b = 0;
              } catch (e) {}
            }
            b && this.empty().append(a);
          },
          null,
          a,
          arguments.length
        );
      },
      replaceWith: function() {
        var a = arguments[0];
        return (
          this.domManip(arguments, function(b) {
            (a = this.parentNode), m.cleanData(ub(this)), a && a.replaceChild(b, this);
          }),
          a && (a.length || a.nodeType) ? this : this.remove()
        );
      },
      detach: function(a) {
        return this.remove(a, !0);
      },
      domManip: function(a, b) {
        a = e.apply([], a);
        var c,
          d,
          f,
          g,
          h,
          i,
          j = 0,
          l = this.length,
          n = this,
          o = l - 1,
          p = a[0],
          q = m.isFunction(p);
        if (q || (l > 1 && 'string' == typeof p && !k.checkClone && nb.test(p)))
          return this.each(function(c) {
            var d = n.eq(c);
            q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b);
          });
        if (
          l &&
          ((i = m.buildFragment(a, this[0].ownerDocument, !1, this)),
          (c = i.firstChild),
          1 === i.childNodes.length && (i = c),
          c)
        ) {
          for (g = m.map(ub(i, 'script'), xb), f = g.length; l > j; j++)
            (d = i),
              j !== o && ((d = m.clone(d, !0, !0)), f && m.merge(g, ub(d, 'script'))),
              b.call(this[j], d, j);
          if (f)
            for (h = g[g.length - 1].ownerDocument, m.map(g, yb), j = 0; f > j; j++)
              (d = g[j]),
                ob.test(d.type || '') &&
                  !m._data(d, 'globalEval') &&
                  m.contains(h, d) &&
                  (d.src
                    ? m._evalUrl && m._evalUrl(d.src)
                    : m.globalEval((d.text || d.textContent || d.innerHTML || '').replace(qb, '')));
          i = c = null;
        }
        return this;
      }
    }),
    m.each(
      {
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith'
      },
      function(a, b) {
        m.fn[a] = function(a) {
          for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++)
            (c = d === h ? this : this.clone(!0)), m(g[d])[b](c), f.apply(e, c.get());
          return this.pushStack(e);
        };
      }
    );
  var Cb,
    Db = {};
  function Eb(b, c) {
    var d,
      e = m(c.createElement(b)).appendTo(c.body),
      f =
        a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0]))
          ? d.display
          : m.css(e[0], 'display');
    return e.detach(), f;
  }
  function Fb(a) {
    var b = y,
      c = Db[a];
    return (
      c ||
        ((c = Eb(a, b)),
        ('none' !== c && c) ||
          ((Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(
            b.documentElement
          )),
          (b = (Cb[0].contentWindow || Cb[0].contentDocument).document),
          b.write(),
          b.close(),
          (c = Eb(a, b)),
          Cb.detach()),
        (Db[a] = c)),
      c
    );
  }
  !(function() {
    var a;
    k.shrinkWrapBlocks = function() {
      if (null != a) return a;
      a = !1;
      var b, c, d;
      return (
        (c = y.getElementsByTagName('body')[0]),
        c && c.style
          ? ((b = y.createElement('div')),
            (d = y.createElement('div')),
            (d.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
            c.appendChild(d).appendChild(b),
            typeof b.style.zoom !== K &&
              ((b.style.cssText =
                '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1'),
              (b.appendChild(y.createElement('div')).style.width = '5px'),
              (a = 3 !== b.offsetWidth)),
            c.removeChild(d),
            a)
          : void 0
      );
    };
  })();
  var Gb = /^margin/,
    Hb = new RegExp('^(' + S + ')(?!px)[a-z%]+$', 'i'),
    Ib,
    Jb,
    Kb = /^(top|right|bottom|left)$/;
  a.getComputedStyle
    ? ((Ib = function(b) {
        return b.ownerDocument.defaultView.opener
          ? b.ownerDocument.defaultView.getComputedStyle(b, null)
          : a.getComputedStyle(b, null);
      }),
      (Jb = function(a, b, c) {
        var d,
          e,
          f,
          g,
          h = a.style;
        return (
          (c = c || Ib(a)),
          (g = c ? c.getPropertyValue(b) || c[b] : void 0),
          c &&
            ('' !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)),
            Hb.test(g) &&
              Gb.test(b) &&
              ((d = h.width),
              (e = h.minWidth),
              (f = h.maxWidth),
              (h.minWidth = h.maxWidth = h.width = g),
              (g = c.width),
              (h.width = d),
              (h.minWidth = e),
              (h.maxWidth = f))),
          void 0 === g ? g : g + ''
        );
      }))
    : y.documentElement.currentStyle &&
      ((Ib = function(a) {
        return a.currentStyle;
      }),
      (Jb = function(a, b, c) {
        var d,
          e,
          f,
          g,
          h = a.style;
        return (
          (c = c || Ib(a)),
          (g = c ? c[b] : void 0),
          null == g && h && h[b] && (g = h[b]),
          Hb.test(g) &&
            !Kb.test(b) &&
            ((d = h.left),
            (e = a.runtimeStyle),
            (f = e && e.left),
            f && (e.left = a.currentStyle.left),
            (h.left = 'fontSize' === b ? '1em' : g),
            (g = h.pixelLeft + 'px'),
            (h.left = d),
            f && (e.left = f)),
          void 0 === g ? g : g + '' || 'auto'
        );
      }));
  function Lb(a, b) {
    return {
      get: function() {
        var c = a();
        if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments);
      }
    };
  }
  !(function() {
    var b, c, d, e, f, g, h;
    if (
      ((b = y.createElement('div')),
      (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
      (d = b.getElementsByTagName('a')[0]),
      (c = d && d.style))
    ) {
      (c.cssText = 'float:left;opacity:.5'),
        (k.opacity = '0.5' === c.opacity),
        (k.cssFloat = !!c.cssFloat),
        (b.style.backgroundClip = 'content-box'),
        (b.cloneNode(!0).style.backgroundClip = ''),
        (k.clearCloneStyle = 'content-box' === b.style.backgroundClip),
        (k.boxSizing = '' === c.boxSizing || '' === c.MozBoxSizing || '' === c.WebkitBoxSizing),
        m.extend(k, {
          reliableHiddenOffsets: function() {
            return null == g && i(), g;
          },
          boxSizingReliable: function() {
            return null == f && i(), f;
          },
          pixelPosition: function() {
            return null == e && i(), e;
          },
          reliableMarginRight: function() {
            return null == h && i(), h;
          }
        });
      function i() {
        var b, c, d, i;
        (c = y.getElementsByTagName('body')[0]),
          c &&
            c.style &&
            ((b = y.createElement('div')),
            (d = y.createElement('div')),
            (d.style.cssText = 'position:absolute;border:0;width:0;height:0;top:0;left:-9999px'),
            c.appendChild(d).appendChild(b),
            (b.style.cssText =
              '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute'),
            (e = f = !1),
            (h = !0),
            a.getComputedStyle &&
              ((e = '1%' !== (a.getComputedStyle(b, null) || {}).top),
              (f = '4px' === (a.getComputedStyle(b, null) || { width: '4px' }).width),
              (i = b.appendChild(y.createElement('div'))),
              (i.style.cssText = b.style.cssText =
                '-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0'),
              (i.style.marginRight = i.style.width = '0'),
              (b.style.width = '1px'),
              (h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight)),
              b.removeChild(i)),
            (b.innerHTML = '<table><tr><td></td><td>t</td></tr></table>'),
            (i = b.getElementsByTagName('td')),
            (i[0].style.cssText = 'margin:0;border:0;padding:0;display:none'),
            (g = 0 === i[0].offsetHeight),
            g &&
              ((i[0].style.display = ''),
              (i[1].style.display = 'none'),
              (g = 0 === i[0].offsetHeight)),
            c.removeChild(d));
      }
    }
  })(),
    (m.swap = function(a, b, c, d) {
      var e,
        f,
        g = {};
      for (f in b) (g[f] = a.style[f]), (a.style[f] = b[f]);
      e = c.apply(a, d || []);
      for (f in b) a.style[f] = g[f];
      return e;
    });
  var Mb = /alpha\([^)]*\)/i,
    Nb = /opacity\s*=\s*([^)]*)/,
    Ob = /^(none|table(?!-c[ea]).+)/,
    Pb = new RegExp('^(' + S + ')(.*)$', 'i'),
    Qb = new RegExp('^([+-])=(' + S + ')', 'i'),
    Rb = { position: 'absolute', visibility: 'hidden', display: 'block' },
    Sb = { letterSpacing: '0', fontWeight: '400' },
    Tb = ['Webkit', 'O', 'Moz', 'ms'];
  function Ub(a, b) {
    if (b in a) return b;
    var c = b.charAt(0).toUpperCase() + b.slice(1),
      d = b,
      e = Tb.length;
    while (e--) if (((b = Tb[e] + c), b in a)) return b;
    return d;
  }
  function Vb(a, b) {
    for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
      (d = a[g]),
        d.style &&
          ((f[g] = m._data(d, 'olddisplay')),
          (c = d.style.display),
          b
            ? (f[g] || 'none' !== c || (d.style.display = ''),
              '' === d.style.display && U(d) && (f[g] = m._data(d, 'olddisplay', Fb(d.nodeName))))
            : ((e = U(d)),
              ((c && 'none' !== c) || !e) &&
                m._data(d, 'olddisplay', e ? c : m.css(d, 'display'))));
    for (g = 0; h > g; g++)
      (d = a[g]),
        d.style &&
          ((b && 'none' !== d.style.display && '' !== d.style.display) ||
            (d.style.display = b ? f[g] || '' : 'none'));
    return a;
  }
  function Wb(a, b, c) {
    var d = Pb.exec(b);
    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || 'px') : b;
  }
  function Xb(a, b, c, d, e) {
    for (var f = c === (d ? 'border' : 'content') ? 4 : 'width' === b ? 1 : 0, g = 0; 4 > f; f += 2)
      'margin' === c && (g += m.css(a, c + T[f], !0, e)),
        d
          ? ('content' === c && (g -= m.css(a, 'padding' + T[f], !0, e)),
            'margin' !== c && (g -= m.css(a, 'border' + T[f] + 'Width', !0, e)))
          : ((g += m.css(a, 'padding' + T[f], !0, e)),
            'padding' !== c && (g += m.css(a, 'border' + T[f] + 'Width', !0, e)));
    return g;
  }
  function Yb(a, b, c) {
    var d = !0,
      e = 'width' === b ? a.offsetWidth : a.offsetHeight,
      f = Ib(a),
      g = k.boxSizing && 'border-box' === m.css(a, 'boxSizing', !1, f);
    if (0 >= e || null == e) {
      if (((e = Jb(a, b, f)), (0 > e || null == e) && (e = a.style[b]), Hb.test(e))) return e;
      (d = g && (k.boxSizingReliable() || e === a.style[b])), (e = parseFloat(e) || 0);
    }
    return e + Xb(a, b, c || (g ? 'border' : 'content'), d, f) + 'px';
  }
  m.extend({
    cssHooks: {
      opacity: {
        get: function(a, b) {
          if (b) {
            var c = Jb(a, 'opacity');
            return '' === c ? '1' : c;
          }
        }
      }
    },
    cssNumber: {
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: { float: k.cssFloat ? 'cssFloat' : 'styleFloat' },
    style: function(a, b, c, d) {
      if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
        var e,
          f,
          g,
          h = m.camelCase(b),
          i = a.style;
        if (
          ((b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h))),
          (g = m.cssHooks[b] || m.cssHooks[h]),
          void 0 === c)
        )
          return g && 'get' in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
        if (
          ((f = typeof c),
          'string' === f &&
            (e = Qb.exec(c)) &&
            ((c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b))), (f = 'number')),
          null != c &&
            c === c &&
            ('number' !== f || m.cssNumber[h] || (c += 'px'),
            k.clearCloneStyle || '' !== c || 0 !== b.indexOf('background') || (i[b] = 'inherit'),
            !(g && 'set' in g && void 0 === (c = g.set(a, c, d)))))
        )
          try {
            i[b] = c;
          } catch (j) {}
      }
    },
    css: function(a, b, c, d) {
      var e,
        f,
        g,
        h = m.camelCase(b);
      return (
        (b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h))),
        (g = m.cssHooks[b] || m.cssHooks[h]),
        g && 'get' in g && (f = g.get(a, !0, c)),
        void 0 === f && (f = Jb(a, b, d)),
        'normal' === f && b in Sb && (f = Sb[b]),
        '' === c || c ? ((e = parseFloat(f)), c === !0 || m.isNumeric(e) ? e || 0 : f) : f
      );
    }
  }),
    m.each(['height', 'width'], function(a, b) {
      m.cssHooks[b] = {
        get: function(a, c, d) {
          return c
            ? Ob.test(m.css(a, 'display')) && 0 === a.offsetWidth
              ? m.swap(a, Rb, function() {
                  return Yb(a, b, d);
                })
              : Yb(a, b, d)
            : void 0;
        },
        set: function(a, c, d) {
          var e = d && Ib(a);
          return Wb(
            a,
            c,
            d ? Xb(a, b, d, k.boxSizing && 'border-box' === m.css(a, 'boxSizing', !1, e), e) : 0
          );
        }
      };
    }),
    k.opacity ||
      (m.cssHooks.opacity = {
        get: function(a, b) {
          return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || '')
            ? 0.01 * parseFloat(RegExp.$1) + ''
            : b ? '1' : '';
        },
        set: function(a, b) {
          var c = a.style,
            d = a.currentStyle,
            e = m.isNumeric(b) ? 'alpha(opacity=' + 100 * b + ')' : '',
            f = (d && d.filter) || c.filter || '';
          (c.zoom = 1),
            ((b >= 1 || '' === b) &&
              '' === m.trim(f.replace(Mb, '')) &&
              c.removeAttribute &&
              (c.removeAttribute('filter'), '' === b || (d && !d.filter))) ||
              (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + ' ' + e);
        }
      }),
    (m.cssHooks.marginRight = Lb(k.reliableMarginRight, function(a, b) {
      return b ? m.swap(a, { display: 'inline-block' }, Jb, [a, 'marginRight']) : void 0;
    })),
    m.each({ margin: '', padding: '', border: 'Width' }, function(a, b) {
      (m.cssHooks[a + b] = {
        expand: function(c) {
          for (var d = 0, e = {}, f = 'string' == typeof c ? c.split(' ') : [c]; 4 > d; d++)
            e[a + T[d] + b] = f[d] || f[d - 2] || f[0];
          return e;
        }
      }),
        Gb.test(a) || (m.cssHooks[a + b].set = Wb);
    }),
    m.fn.extend({
      css: function(a, b) {
        return V(
          this,
          function(a, b, c) {
            var d,
              e,
              f = {},
              g = 0;
            if (m.isArray(b)) {
              for (d = Ib(a), e = b.length; e > g; g++) f[b[g]] = m.css(a, b[g], !1, d);
              return f;
            }
            return void 0 !== c ? m.style(a, b, c) : m.css(a, b);
          },
          a,
          b,
          arguments.length > 1
        );
      },
      show: function() {
        return Vb(this, !0);
      },
      hide: function() {
        return Vb(this);
      },
      toggle: function(a) {
        return 'boolean' == typeof a
          ? a ? this.show() : this.hide()
          : this.each(function() {
              U(this) ? m(this).show() : m(this).hide();
            });
      }
    });
  function Zb(a, b, c, d, e) {
    return new Zb.prototype.init(a, b, c, d, e);
  }
  (m.Tween = Zb),
    (Zb.prototype = {
      constructor: Zb,
      init: function(a, b, c, d, e, f) {
        (this.elem = a),
          (this.prop = c),
          (this.easing = e || 'swing'),
          (this.options = b),
          (this.start = this.now = this.cur()),
          (this.end = d),
          (this.unit = f || (m.cssNumber[c] ? '' : 'px'));
      },
      cur: function() {
        var a = Zb.propHooks[this.prop];
        return a && a.get ? a.get(this) : Zb.propHooks._default.get(this);
      },
      run: function(a) {
        var b,
          c = Zb.propHooks[this.prop];
        return (
          (this.pos = b = this.options.duration
            ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration)
            : a),
          (this.now = (this.end - this.start) * b + this.start),
          this.options.step && this.options.step.call(this.elem, this.now, this),
          c && c.set ? c.set(this) : Zb.propHooks._default.set(this),
          this
        );
      }
    }),
    (Zb.prototype.init.prototype = Zb.prototype),
    (Zb.propHooks = {
      _default: {
        get: function(a) {
          var b;
          return null == a.elem[a.prop] || (a.elem.style && null != a.elem.style[a.prop])
            ? ((b = m.css(a.elem, a.prop, '')), b && 'auto' !== b ? b : 0)
            : a.elem[a.prop];
        },
        set: function(a) {
          m.fx.step[a.prop]
            ? m.fx.step[a.prop](a)
            : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop])
              ? m.style(a.elem, a.prop, a.now + a.unit)
              : (a.elem[a.prop] = a.now);
        }
      }
    }),
    (Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {
      set: function(a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
      }
    }),
    (m.easing = {
      linear: function(a) {
        return a;
      },
      swing: function(a) {
        return 0.5 - Math.cos(a * Math.PI) / 2;
      }
    }),
    (m.fx = Zb.prototype.init),
    (m.fx.step = {});
  var $b,
    _b,
    ac = /^(?:toggle|show|hide)$/,
    bc = new RegExp('^(?:([+-])=|)(' + S + ')([a-z%]*)$', 'i'),
    cc = /queueHooks$/,
    dc = [ic],
    ec = {
      '*': [
        function(a, b) {
          var c = this.createTween(a, b),
            d = c.cur(),
            e = bc.exec(b),
            f = (e && e[3]) || (m.cssNumber[a] ? '' : 'px'),
            g = (m.cssNumber[a] || ('px' !== f && +d)) && bc.exec(m.css(c.elem, a)),
            h = 1,
            i = 20;
          if (g && g[3] !== f) {
            (f = f || g[3]), (e = e || []), (g = +d || 1);
            do (h = h || '.5'), (g /= h), m.style(c.elem, a, g + f);
            while (h !== (h = c.cur() / d) && 1 !== h && --i);
          }
          return (
            e &&
              ((g = c.start = +g || +d || 0),
              (c.unit = f),
              (c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2])),
            c
          );
        }
      ]
    };
  function fc() {
    return (
      setTimeout(function() {
        $b = void 0;
      }),
      ($b = m.now())
    );
  }
  function gc(a, b) {
    var c,
      d = { height: a },
      e = 0;
    for (b = b ? 1 : 0; 4 > e; e += 2 - b) (c = T[e]), (d['margin' + c] = d['padding' + c] = a);
    return b && (d.opacity = d.width = a), d;
  }
  function hc(a, b, c) {
    for (var d, e = (ec[b] || []).concat(ec['*']), f = 0, g = e.length; g > f; f++)
      if ((d = e[f].call(c, b, a))) return d;
  }
  function ic(a, b, c) {
    var d,
      e,
      f,
      g,
      h,
      i,
      j,
      l,
      n = this,
      o = {},
      p = a.style,
      q = a.nodeType && U(a),
      r = m._data(a, 'fxshow');
    c.queue ||
      ((h = m._queueHooks(a, 'fx')),
      null == h.unqueued &&
        ((h.unqueued = 0),
        (i = h.empty.fire),
        (h.empty.fire = function() {
          h.unqueued || i();
        })),
      h.unqueued++,
      n.always(function() {
        n.always(function() {
          h.unqueued--, m.queue(a, 'fx').length || h.empty.fire();
        });
      })),
      1 === a.nodeType &&
        ('height' in b || 'width' in b) &&
        ((c.overflow = [p.overflow, p.overflowX, p.overflowY]),
        (j = m.css(a, 'display')),
        (l = 'none' === j ? m._data(a, 'olddisplay') || Fb(a.nodeName) : j),
        'inline' === l &&
          'none' === m.css(a, 'float') &&
          (k.inlineBlockNeedsLayout && 'inline' !== Fb(a.nodeName)
            ? (p.zoom = 1)
            : (p.display = 'inline-block'))),
      c.overflow &&
        ((p.overflow = 'hidden'),
        k.shrinkWrapBlocks() ||
          n.always(function() {
            (p.overflow = c.overflow[0]),
              (p.overflowX = c.overflow[1]),
              (p.overflowY = c.overflow[2]);
          }));
    for (d in b)
      if (((e = b[d]), ac.exec(e))) {
        if ((delete b[d], (f = f || 'toggle' === e), e === (q ? 'hide' : 'show'))) {
          if ('show' !== e || !r || void 0 === r[d]) continue;
          q = !0;
        }
        o[d] = (r && r[d]) || m.style(a, d);
      } else j = void 0;
    if (m.isEmptyObject(o)) 'inline' === ('none' === j ? Fb(a.nodeName) : j) && (p.display = j);
    else {
      r ? 'hidden' in r && (q = r.hidden) : (r = m._data(a, 'fxshow', {})),
        f && (r.hidden = !q),
        q
          ? m(a).show()
          : n.done(function() {
              m(a).hide();
            }),
        n.done(function() {
          var b;
          m._removeData(a, 'fxshow');
          for (b in o) m.style(a, b, o[b]);
        });
      for (d in o)
        (g = hc(q ? r[d] : 0, d, n)),
          d in r ||
            ((r[d] = g.start),
            q && ((g.end = g.start), (g.start = 'width' === d || 'height' === d ? 1 : 0)));
    }
  }
  function jc(a, b) {
    var c, d, e, f, g;
    for (c in a)
      if (
        ((d = m.camelCase(c)),
        (e = b[d]),
        (f = a[c]),
        m.isArray(f) && ((e = f[1]), (f = a[c] = f[0])),
        c !== d && ((a[d] = f), delete a[c]),
        (g = m.cssHooks[d]),
        g && 'expand' in g)
      ) {
        (f = g.expand(f)), delete a[d];
        for (c in f) c in a || ((a[c] = f[c]), (b[c] = e));
      } else b[d] = e;
  }
  function kc(a, b, c) {
    var d,
      e,
      f = 0,
      g = dc.length,
      h = m.Deferred().always(function() {
        delete i.elem;
      }),
      i = function() {
        if (e) return !1;
        for (
          var b = $b || fc(),
            c = Math.max(0, j.startTime + j.duration - b),
            d = c / j.duration || 0,
            f = 1 - d,
            g = 0,
            i = j.tweens.length;
          i > g;
          g++
        )
          j.tweens[g].run(f);
        return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1);
      },
      j = h.promise({
        elem: a,
        props: m.extend({}, b),
        opts: m.extend(!0, { specialEasing: {} }, c),
        originalProperties: b,
        originalOptions: c,
        startTime: $b || fc(),
        duration: c.duration,
        tweens: [],
        createTween: function(b, c) {
          var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
          return j.tweens.push(d), d;
        },
        stop: function(b) {
          var c = 0,
            d = b ? j.tweens.length : 0;
          if (e) return this;
          for (e = !0; d > c; c++) j.tweens[c].run(1);
          return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this;
        }
      }),
      k = j.props;
    for (jc(k, j.opts.specialEasing); g > f; f++) if ((d = dc[f].call(j, a, k, j.opts))) return d;
    return (
      m.map(k, hc, j),
      m.isFunction(j.opts.start) && j.opts.start.call(a, j),
      m.fx.timer(m.extend(i, { elem: a, anim: j, queue: j.opts.queue })),
      j
        .progress(j.opts.progress)
        .done(j.opts.done, j.opts.complete)
        .fail(j.opts.fail)
        .always(j.opts.always)
    );
  }
  (m.Animation = m.extend(kc, {
    tweener: function(a, b) {
      m.isFunction(a) ? ((b = a), (a = ['*'])) : (a = a.split(' '));
      for (var c, d = 0, e = a.length; e > d; d++)
        (c = a[d]), (ec[c] = ec[c] || []), ec[c].unshift(b);
    },
    prefilter: function(a, b) {
      b ? dc.unshift(a) : dc.push(a);
    }
  })),
    (m.speed = function(a, b, c) {
      var d =
        a && 'object' == typeof a
          ? m.extend({}, a)
          : {
              complete: c || (!c && b) || (m.isFunction(a) && a),
              duration: a,
              easing: (c && b) || (b && !m.isFunction(b) && b)
            };
      return (
        (d.duration = m.fx.off
          ? 0
          : 'number' == typeof d.duration
            ? d.duration
            : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default),
        (null == d.queue || d.queue === !0) && (d.queue = 'fx'),
        (d.old = d.complete),
        (d.complete = function() {
          m.isFunction(d.old) && d.old.call(this), d.queue && m.dequeue(this, d.queue);
        }),
        d
      );
    }),
    m.fn.extend({
      fadeTo: function(a, b, c, d) {
        return this.filter(U)
          .css('opacity', 0)
          .show()
          .end()
          .animate({ opacity: b }, a, c, d);
      },
      animate: function(a, b, c, d) {
        var e = m.isEmptyObject(a),
          f = m.speed(b, c, d),
          g = function() {
            var b = kc(this, m.extend({}, a), f);
            (e || m._data(this, 'finish')) && b.stop(!0);
          };
        return (g.finish = g), e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
      },
      stop: function(a, b, c) {
        var d = function(a) {
          var b = a.stop;
          delete a.stop, b(c);
        };
        return (
          'string' != typeof a && ((c = b), (b = a), (a = void 0)),
          b && a !== !1 && this.queue(a || 'fx', []),
          this.each(function() {
            var b = !0,
              e = null != a && a + 'queueHooks',
              f = m.timers,
              g = m._data(this);
            if (e) g[e] && g[e].stop && d(g[e]);
            else for (e in g) g[e] && g[e].stop && cc.test(e) && d(g[e]);
            for (e = f.length; e--; )
              f[e].elem !== this ||
                (null != a && f[e].queue !== a) ||
                (f[e].anim.stop(c), (b = !1), f.splice(e, 1));
            (b || !c) && m.dequeue(this, a);
          })
        );
      },
      finish: function(a) {
        return (
          a !== !1 && (a = a || 'fx'),
          this.each(function() {
            var b,
              c = m._data(this),
              d = c[a + 'queue'],
              e = c[a + 'queueHooks'],
              f = m.timers,
              g = d ? d.length : 0;
            for (
              c.finish = !0,
                m.queue(this, a, []),
                e && e.stop && e.stop.call(this, !0),
                b = f.length;
              b--;

            )
              f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
            for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
            delete c.finish;
          })
        );
      }
    }),
    m.each(['toggle', 'show', 'hide'], function(a, b) {
      var c = m.fn[b];
      m.fn[b] = function(a, d, e) {
        return null == a || 'boolean' == typeof a
          ? c.apply(this, arguments)
          : this.animate(gc(b, !0), a, d, e);
      };
    }),
    m.each(
      {
        slideDown: gc('show'),
        slideUp: gc('hide'),
        slideToggle: gc('toggle'),
        fadeIn: { opacity: 'show' },
        fadeOut: { opacity: 'hide' },
        fadeToggle: { opacity: 'toggle' }
      },
      function(a, b) {
        m.fn[a] = function(a, c, d) {
          return this.animate(b, a, c, d);
        };
      }
    ),
    (m.timers = []),
    (m.fx.tick = function() {
      var a,
        b = m.timers,
        c = 0;
      for ($b = m.now(); c < b.length; c++) (a = b[c]), a() || b[c] !== a || b.splice(c--, 1);
      b.length || m.fx.stop(), ($b = void 0);
    }),
    (m.fx.timer = function(a) {
      m.timers.push(a), a() ? m.fx.start() : m.timers.pop();
    }),
    (m.fx.interval = 13),
    (m.fx.start = function() {
      _b || (_b = setInterval(m.fx.tick, m.fx.interval));
    }),
    (m.fx.stop = function() {
      clearInterval(_b), (_b = null);
    }),
    (m.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (m.fn.delay = function(a, b) {
      return (
        (a = m.fx ? m.fx.speeds[a] || a : a),
        (b = b || 'fx'),
        this.queue(b, function(b, c) {
          var d = setTimeout(b, a);
          c.stop = function() {
            clearTimeout(d);
          };
        })
      );
    }),
    (function() {
      var a, b, c, d, e;
      (b = y.createElement('div')),
        b.setAttribute('className', 't'),
        (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
        (d = b.getElementsByTagName('a')[0]),
        (c = y.createElement('select')),
        (e = c.appendChild(y.createElement('option'))),
        (a = b.getElementsByTagName('input')[0]),
        (d.style.cssText = 'top:1px'),
        (k.getSetAttribute = 't' !== b.className),
        (k.style = /top/.test(d.getAttribute('style'))),
        (k.hrefNormalized = '/a' === d.getAttribute('href')),
        (k.checkOn = !!a.value),
        (k.optSelected = e.selected),
        (k.enctype = !!y.createElement('form').enctype),
        (c.disabled = !0),
        (k.optDisabled = !e.disabled),
        (a = y.createElement('input')),
        a.setAttribute('value', ''),
        (k.input = '' === a.getAttribute('value')),
        (a.value = 't'),
        a.setAttribute('type', 'radio'),
        (k.radioValue = 't' === a.value);
    })();
  var lc = /\r/g;
  m.fn.extend({
    val: function(a) {
      var b,
        c,
        d,
        e = this[0];
      {
        if (arguments.length)
          return (
            (d = m.isFunction(a)),
            this.each(function(c) {
              var e;
              1 === this.nodeType &&
                ((e = d ? a.call(this, c, m(this).val()) : a),
                null == e
                  ? (e = '')
                  : 'number' == typeof e
                    ? (e += '')
                    : m.isArray(e) &&
                      (e = m.map(e, function(a) {
                        return null == a ? '' : a + '';
                      })),
                (b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()]),
                (b && 'set' in b && void 0 !== b.set(this, e, 'value')) || (this.value = e));
            })
          );
        if (e)
          return (
            (b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()]),
            b && 'get' in b && void 0 !== (c = b.get(e, 'value'))
              ? c
              : ((c = e.value), 'string' == typeof c ? c.replace(lc, '') : null == c ? '' : c)
          );
      }
    }
  }),
    m.extend({
      valHooks: {
        option: {
          get: function(a) {
            var b = m.find.attr(a, 'value');
            return null != b ? b : m.trim(m.text(a));
          }
        },
        select: {
          get: function(a) {
            for (
              var b,
                c,
                d = a.options,
                e = a.selectedIndex,
                f = 'select-one' === a.type || 0 > e,
                g = f ? null : [],
                h = f ? e + 1 : d.length,
                i = 0 > e ? h : f ? e : 0;
              h > i;
              i++
            )
              if (
                ((c = d[i]),
                !(
                  (!c.selected && i !== e) ||
                  (k.optDisabled ? c.disabled : null !== c.getAttribute('disabled')) ||
                  (c.parentNode.disabled && m.nodeName(c.parentNode, 'optgroup'))
                ))
              ) {
                if (((b = m(c).val()), f)) return b;
                g.push(b);
              }
            return g;
          },
          set: function(a, b) {
            var c,
              d,
              e = a.options,
              f = m.makeArray(b),
              g = e.length;
            while (g--)
              if (((d = e[g]), m.inArray(m.valHooks.option.get(d), f) >= 0))
                try {
                  d.selected = c = !0;
                } catch (h) {
                  d.scrollHeight;
                }
              else d.selected = !1;
            return c || (a.selectedIndex = -1), e;
          }
        }
      }
    }),
    m.each(['radio', 'checkbox'], function() {
      (m.valHooks[this] = {
        set: function(a, b) {
          return m.isArray(b) ? (a.checked = m.inArray(m(a).val(), b) >= 0) : void 0;
        }
      }),
        k.checkOn ||
          (m.valHooks[this].get = function(a) {
            return null === a.getAttribute('value') ? 'on' : a.value;
          });
    });
  var mc,
    nc,
    oc = m.expr.attrHandle,
    pc = /^(?:checked|selected)$/i,
    qc = k.getSetAttribute,
    rc = k.input;
  m.fn.extend({
    attr: function(a, b) {
      return V(this, m.attr, a, b, arguments.length > 1);
    },
    removeAttr: function(a) {
      return this.each(function() {
        m.removeAttr(this, a);
      });
    }
  }),
    m.extend({
      attr: function(a, b, c) {
        var d,
          e,
          f = a.nodeType;
        if (a && 3 !== f && 8 !== f && 2 !== f)
          return typeof a.getAttribute === K
            ? m.prop(a, b, c)
            : ((1 === f && m.isXMLDoc(a)) ||
                ((b = b.toLowerCase()),
                (d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc))),
              void 0 === c
                ? d && 'get' in d && null !== (e = d.get(a, b))
                  ? e
                  : ((e = m.find.attr(a, b)), null == e ? void 0 : e)
                : null !== c
                  ? d && 'set' in d && void 0 !== (e = d.set(a, c, b))
                    ? e
                    : (a.setAttribute(b, c + ''), c)
                  : void m.removeAttr(a, b));
      },
      removeAttr: function(a, b) {
        var c,
          d,
          e = 0,
          f = b && b.match(E);
        if (f && 1 === a.nodeType)
          while ((c = f[e++]))
            (d = m.propFix[c] || c),
              m.expr.match.bool.test(c)
                ? (rc && qc) || !pc.test(c)
                  ? (a[d] = !1)
                  : (a[m.camelCase('default-' + c)] = a[d] = !1)
                : m.attr(a, c, ''),
              a.removeAttribute(qc ? c : d);
      },
      attrHooks: {
        type: {
          set: function(a, b) {
            if (!k.radioValue && 'radio' === b && m.nodeName(a, 'input')) {
              var c = a.value;
              return a.setAttribute('type', b), c && (a.value = c), b;
            }
          }
        }
      }
    }),
    (nc = {
      set: function(a, b, c) {
        return (
          b === !1
            ? m.removeAttr(a, c)
            : (rc && qc) || !pc.test(c)
              ? a.setAttribute((!qc && m.propFix[c]) || c, c)
              : (a[m.camelCase('default-' + c)] = a[c] = !0),
          c
        );
      }
    }),
    m.each(m.expr.match.bool.source.match(/\w+/g), function(a, b) {
      var c = oc[b] || m.find.attr;
      oc[b] =
        (rc && qc) || !pc.test(b)
          ? function(a, b, d) {
              var e, f;
              return (
                d ||
                  ((f = oc[b]),
                  (oc[b] = e),
                  (e = null != c(a, b, d) ? b.toLowerCase() : null),
                  (oc[b] = f)),
                e
              );
            }
          : function(a, b, c) {
              return c ? void 0 : a[m.camelCase('default-' + b)] ? b.toLowerCase() : null;
            };
    }),
    (rc && qc) ||
      (m.attrHooks.value = {
        set: function(a, b, c) {
          return m.nodeName(a, 'input') ? void (a.defaultValue = b) : mc && mc.set(a, b, c);
        }
      }),
    qc ||
      ((mc = {
        set: function(a, b, c) {
          var d = a.getAttributeNode(c);
          return (
            d || a.setAttributeNode((d = a.ownerDocument.createAttribute(c))),
            (d.value = b += ''),
            'value' === c || b === a.getAttribute(c) ? b : void 0
          );
        }
      }),
      (oc.id = oc.name = oc.coords = function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && '' !== d.value ? d.value : null;
      }),
      (m.valHooks.button = {
        get: function(a, b) {
          var c = a.getAttributeNode(b);
          return c && c.specified ? c.value : void 0;
        },
        set: mc.set
      }),
      (m.attrHooks.contenteditable = {
        set: function(a, b, c) {
          mc.set(a, '' === b ? !1 : b, c);
        }
      }),
      m.each(['width', 'height'], function(a, b) {
        m.attrHooks[b] = {
          set: function(a, c) {
            return '' === c ? (a.setAttribute(b, 'auto'), c) : void 0;
          }
        };
      })),
    k.style ||
      (m.attrHooks.style = {
        get: function(a) {
          return a.style.cssText || void 0;
        },
        set: function(a, b) {
          return (a.style.cssText = b + '');
        }
      });
  var sc = /^(?:input|select|textarea|button|object)$/i,
    tc = /^(?:a|area)$/i;
  m.fn.extend({
    prop: function(a, b) {
      return V(this, m.prop, a, b, arguments.length > 1);
    },
    removeProp: function(a) {
      return (
        (a = m.propFix[a] || a),
        this.each(function() {
          try {
            (this[a] = void 0), delete this[a];
          } catch (b) {}
        })
      );
    }
  }),
    m.extend({
      propFix: { for: 'htmlFor', class: 'className' },
      prop: function(a, b, c) {
        var d,
          e,
          f,
          g = a.nodeType;
        if (a && 3 !== g && 8 !== g && 2 !== g)
          return (
            (f = 1 !== g || !m.isXMLDoc(a)),
            f && ((b = m.propFix[b] || b), (e = m.propHooks[b])),
            void 0 !== c
              ? e && 'set' in e && void 0 !== (d = e.set(a, c, b)) ? d : (a[b] = c)
              : e && 'get' in e && null !== (d = e.get(a, b)) ? d : a[b]
          );
      },
      propHooks: {
        tabIndex: {
          get: function(a) {
            var b = m.find.attr(a, 'tabindex');
            return b
              ? parseInt(b, 10)
              : sc.test(a.nodeName) || (tc.test(a.nodeName) && a.href) ? 0 : -1;
          }
        }
      }
    }),
    k.hrefNormalized ||
      m.each(['href', 'src'], function(a, b) {
        m.propHooks[b] = {
          get: function(a) {
            return a.getAttribute(b, 4);
          }
        };
      }),
    k.optSelected ||
      (m.propHooks.selected = {
        get: function(a) {
          var b = a.parentNode;
          return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
        }
      }),
    m.each(
      [
        'tabIndex',
        'readOnly',
        'maxLength',
        'cellSpacing',
        'cellPadding',
        'rowSpan',
        'colSpan',
        'useMap',
        'frameBorder',
        'contentEditable'
      ],
      function() {
        m.propFix[this.toLowerCase()] = this;
      }
    ),
    k.enctype || (m.propFix.enctype = 'encoding');
  var uc = /[\t\r\n\f]/g;
  m.fn.extend({
    addClass: function(a) {
      var b,
        c,
        d,
        e,
        f,
        g,
        h = 0,
        i = this.length,
        j = 'string' == typeof a && a;
      if (m.isFunction(a))
        return this.each(function(b) {
          m(this).addClass(a.call(this, b, this.className));
        });
      if (j)
        for (b = (a || '').match(E) || []; i > h; h++)
          if (
            ((c = this[h]),
            (d =
              1 === c.nodeType && (c.className ? (' ' + c.className + ' ').replace(uc, ' ') : ' ')))
          ) {
            f = 0;
            while ((e = b[f++])) d.indexOf(' ' + e + ' ') < 0 && (d += e + ' ');
            (g = m.trim(d)), c.className !== g && (c.className = g);
          }
      return this;
    },
    removeClass: function(a) {
      var b,
        c,
        d,
        e,
        f,
        g,
        h = 0,
        i = this.length,
        j = 0 === arguments.length || ('string' == typeof a && a);
      if (m.isFunction(a))
        return this.each(function(b) {
          m(this).removeClass(a.call(this, b, this.className));
        });
      if (j)
        for (b = (a || '').match(E) || []; i > h; h++)
          if (
            ((c = this[h]),
            (d =
              1 === c.nodeType && (c.className ? (' ' + c.className + ' ').replace(uc, ' ') : '')))
          ) {
            f = 0;
            while ((e = b[f++]))
              while (d.indexOf(' ' + e + ' ') >= 0) d = d.replace(' ' + e + ' ', ' ');
            (g = a ? m.trim(d) : ''), c.className !== g && (c.className = g);
          }
      return this;
    },
    toggleClass: function(a, b) {
      var c = typeof a;
      return 'boolean' == typeof b && 'string' === c
        ? b ? this.addClass(a) : this.removeClass(a)
        : this.each(
            m.isFunction(a)
              ? function(c) {
                  m(this).toggleClass(a.call(this, c, this.className, b), b);
                }
              : function() {
                  if ('string' === c) {
                    var b,
                      d = 0,
                      e = m(this),
                      f = a.match(E) || [];
                    while ((b = f[d++])) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                  } else
                    (c === K || 'boolean' === c) &&
                      (this.className && m._data(this, '__className__', this.className),
                      (this.className =
                        this.className || a === !1 ? '' : m._data(this, '__className__') || ''));
                }
          );
    },
    hasClass: function(a) {
      for (var b = ' ' + a + ' ', c = 0, d = this.length; d > c; c++)
        if (
          1 === this[c].nodeType &&
          (' ' + this[c].className + ' ').replace(uc, ' ').indexOf(b) >= 0
        )
          return !0;
      return !1;
    }
  }),
    m.each(
      'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(
        ' '
      ),
      function(a, b) {
        m.fn[b] = function(a, c) {
          return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
        };
      }
    ),
    m.fn.extend({
      hover: function(a, b) {
        return this.mouseenter(a).mouseleave(b || a);
      },
      bind: function(a, b, c) {
        return this.on(a, null, b, c);
      },
      unbind: function(a, b) {
        return this.off(a, null, b);
      },
      delegate: function(a, b, c, d) {
        return this.on(b, a, c, d);
      },
      undelegate: function(a, b, c) {
        return 1 === arguments.length ? this.off(a, '**') : this.off(b, a || '**', c);
      }
    });
  var vc = m.now(),
    wc = /\?/,
    xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
  (m.parseJSON = function(b) {
    if (a.JSON && a.JSON.parse) return a.JSON.parse(b + '');
    var c,
      d = null,
      e = m.trim(b + '');
    return e &&
      !m.trim(
        e.replace(xc, function(a, b, e, f) {
          return c && b && (d = 0), 0 === d ? a : ((c = e || b), (d += !f - !e), '');
        })
      )
      ? Function('return ' + e)()
      : m.error('Invalid JSON: ' + b);
  }),
    (m.parseXML = function(b) {
      var c, d;
      if (!b || 'string' != typeof b) return null;
      try {
        a.DOMParser
          ? ((d = new DOMParser()), (c = d.parseFromString(b, 'text/xml')))
          : ((c = new ActiveXObject('Microsoft.XMLDOM')), (c.async = 'false'), c.loadXML(b));
      } catch (e) {
        c = void 0;
      }
      return (
        (c && c.documentElement && !c.getElementsByTagName('parsererror').length) ||
          m.error('Invalid XML: ' + b),
        c
      );
    });
  var yc,
    zc,
    Ac = /#.*$/,
    Bc = /([?&])_=[^&]*/,
    Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Ec = /^(?:GET|HEAD)$/,
    Fc = /^\/\//,
    Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    Hc = {},
    Ic = {},
    Jc = '*/'.concat('*');
  try {
    zc = location.href;
  } catch (Kc) {
    (zc = y.createElement('a')), (zc.href = ''), (zc = zc.href);
  }
  yc = Gc.exec(zc.toLowerCase()) || [];
  function Lc(a) {
    return function(b, c) {
      'string' != typeof b && ((c = b), (b = '*'));
      var d,
        e = 0,
        f = b.toLowerCase().match(E) || [];
      if (m.isFunction(c))
        while ((d = f[e++]))
          '+' === d.charAt(0)
            ? ((d = d.slice(1) || '*'), (a[d] = a[d] || []).unshift(c))
            : (a[d] = a[d] || []).push(c);
    };
  }
  function Mc(a, b, c, d) {
    var e = {},
      f = a === Ic;
    function g(h) {
      var i;
      return (
        (e[h] = !0),
        m.each(a[h] || [], function(a, h) {
          var j = h(b, c, d);
          return 'string' != typeof j || f || e[j]
            ? f ? !(i = j) : void 0
            : (b.dataTypes.unshift(j), g(j), !1);
        }),
        i
      );
    }
    return g(b.dataTypes[0]) || (!e['*'] && g('*'));
  }
  function Nc(a, b) {
    var c,
      d,
      e = m.ajaxSettings.flatOptions || {};
    for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
    return c && m.extend(!0, a, c), a;
  }
  function Oc(a, b, c) {
    var d,
      e,
      f,
      g,
      h = a.contents,
      i = a.dataTypes;
    while ('*' === i[0])
      i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader('Content-Type'));
    if (e)
      for (g in h)
        if (h[g] && h[g].test(e)) {
          i.unshift(g);
          break;
        }
    if (i[0] in c) f = i[0];
    else {
      for (g in c) {
        if (!i[0] || a.converters[g + ' ' + i[0]]) {
          f = g;
          break;
        }
        d || (d = g);
      }
      f = f || d;
    }
    return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
  }
  function Pc(a, b, c, d) {
    var e,
      f,
      g,
      h,
      i,
      j = {},
      k = a.dataTypes.slice();
    if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
    f = k.shift();
    while (f)
      if (
        (a.responseFields[f] && (c[a.responseFields[f]] = b),
        !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)),
        (i = f),
        (f = k.shift()))
      )
        if ('*' === f) f = i;
        else if ('*' !== i && i !== f) {
          if (((g = j[i + ' ' + f] || j['* ' + f]), !g))
            for (e in j)
              if (((h = e.split(' ')), h[1] === f && (g = j[i + ' ' + h[0]] || j['* ' + h[0]]))) {
                g === !0 ? (g = j[e]) : j[e] !== !0 && ((f = h[0]), k.unshift(h[1]));
                break;
              }
          if (g !== !0)
            if (g && a['throws']) b = g(b);
            else
              try {
                b = g(b);
              } catch (l) {
                return {
                  state: 'parsererror',
                  error: g ? l : 'No conversion from ' + i + ' to ' + f
                };
              }
        }
    return { state: 'success', data: b };
  }
  m.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: zc,
      type: 'GET',
      isLocal: Dc.test(yc[1]),
      global: !0,
      processData: !0,
      async: !0,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      accepts: {
        '*': Jc,
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript'
      },
      contents: { xml: /xml/, html: /html/, json: /json/ },
      responseFields: { xml: 'responseXML', text: 'responseText', json: 'responseJSON' },
      converters: {
        '* text': String,
        'text html': !0,
        'text json': m.parseJSON,
        'text xml': m.parseXML
      },
      flatOptions: { url: !0, context: !0 }
    },
    ajaxSetup: function(a, b) {
      return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a);
    },
    ajaxPrefilter: Lc(Hc),
    ajaxTransport: Lc(Ic),
    ajax: function(a, b) {
      'object' == typeof a && ((b = a), (a = void 0)), (b = b || {});
      var c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k = m.ajaxSetup({}, b),
        l = k.context || k,
        n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event,
        o = m.Deferred(),
        p = m.Callbacks('once memory'),
        q = k.statusCode || {},
        r = {},
        s = {},
        t = 0,
        u = 'canceled',
        v = {
          readyState: 0,
          getResponseHeader: function(a) {
            var b;
            if (2 === t) {
              if (!j) {
                j = {};
                while ((b = Cc.exec(f))) j[b[1].toLowerCase()] = b[2];
              }
              b = j[a.toLowerCase()];
            }
            return null == b ? null : b;
          },
          getAllResponseHeaders: function() {
            return 2 === t ? f : null;
          },
          setRequestHeader: function(a, b) {
            var c = a.toLowerCase();
            return t || ((a = s[c] = s[c] || a), (r[a] = b)), this;
          },
          overrideMimeType: function(a) {
            return t || (k.mimeType = a), this;
          },
          statusCode: function(a) {
            var b;
            if (a)
              if (2 > t) for (b in a) q[b] = [q[b], a[b]];
              else v.always(a[v.status]);
            return this;
          },
          abort: function(a) {
            var b = a || u;
            return i && i.abort(b), x(0, b), this;
          }
        };
      if (
        ((o.promise(v).complete = p.add),
        (v.success = v.done),
        (v.error = v.fail),
        (k.url = ((a || k.url || zc) + '').replace(Ac, '').replace(Fc, yc[1] + '//')),
        (k.type = b.method || b.type || k.method || k.type),
        (k.dataTypes = m
          .trim(k.dataType || '*')
          .toLowerCase()
          .match(E) || ['']),
        null == k.crossDomain &&
          ((c = Gc.exec(k.url.toLowerCase())),
          (k.crossDomain = !(
            !c ||
            (c[1] === yc[1] &&
              c[2] === yc[2] &&
              (c[3] || ('http:' === c[1] ? '80' : '443')) ===
                (yc[3] || ('http:' === yc[1] ? '80' : '443')))
          ))),
        k.data &&
          k.processData &&
          'string' != typeof k.data &&
          (k.data = m.param(k.data, k.traditional)),
        Mc(Hc, k, b, v),
        2 === t)
      )
        return v;
      (h = m.event && k.global),
        h && 0 === m.active++ && m.event.trigger('ajaxStart'),
        (k.type = k.type.toUpperCase()),
        (k.hasContent = !Ec.test(k.type)),
        (e = k.url),
        k.hasContent ||
          (k.data && ((e = k.url += (wc.test(e) ? '&' : '?') + k.data), delete k.data),
          k.cache === !1 &&
            (k.url = Bc.test(e)
              ? e.replace(Bc, '$1_=' + vc++)
              : e + (wc.test(e) ? '&' : '?') + '_=' + vc++)),
        k.ifModified &&
          (m.lastModified[e] && v.setRequestHeader('If-Modified-Since', m.lastModified[e]),
          m.etag[e] && v.setRequestHeader('If-None-Match', m.etag[e])),
        ((k.data && k.hasContent && k.contentType !== !1) || b.contentType) &&
          v.setRequestHeader('Content-Type', k.contentType),
        v.setRequestHeader(
          'Accept',
          k.dataTypes[0] && k.accepts[k.dataTypes[0]]
            ? k.accepts[k.dataTypes[0]] + ('*' !== k.dataTypes[0] ? ', ' + Jc + '; q=0.01' : '')
            : k.accepts['*']
        );
      for (d in k.headers) v.setRequestHeader(d, k.headers[d]);
      if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();
      u = 'abort';
      for (d in { success: 1, error: 1, complete: 1 }) v[d](k[d]);
      if ((i = Mc(Ic, k, b, v))) {
        (v.readyState = 1),
          h && n.trigger('ajaxSend', [v, k]),
          k.async &&
            k.timeout > 0 &&
            (g = setTimeout(function() {
              v.abort('timeout');
            }, k.timeout));
        try {
          (t = 1), i.send(r, x);
        } catch (w) {
          if (!(2 > t)) throw w;
          x(-1, w);
        }
      } else x(-1, 'No Transport');
      function x(a, b, c, d) {
        var j,
          r,
          s,
          u,
          w,
          x = b;
        2 !== t &&
          ((t = 2),
          g && clearTimeout(g),
          (i = void 0),
          (f = d || ''),
          (v.readyState = a > 0 ? 4 : 0),
          (j = (a >= 200 && 300 > a) || 304 === a),
          c && (u = Oc(k, v, c)),
          (u = Pc(k, u, v, j)),
          j
            ? (k.ifModified &&
                ((w = v.getResponseHeader('Last-Modified')),
                w && (m.lastModified[e] = w),
                (w = v.getResponseHeader('etag')),
                w && (m.etag[e] = w)),
              204 === a || 'HEAD' === k.type
                ? (x = 'nocontent')
                : 304 === a
                  ? (x = 'notmodified')
                  : ((x = u.state), (r = u.data), (s = u.error), (j = !s)))
            : ((s = x), (a || !x) && ((x = 'error'), 0 > a && (a = 0))),
          (v.status = a),
          (v.statusText = (b || x) + ''),
          j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]),
          v.statusCode(q),
          (q = void 0),
          h && n.trigger(j ? 'ajaxSuccess' : 'ajaxError', [v, k, j ? r : s]),
          p.fireWith(l, [v, x]),
          h && (n.trigger('ajaxComplete', [v, k]), --m.active || m.event.trigger('ajaxStop')));
      }
      return v;
    },
    getJSON: function(a, b, c) {
      return m.get(a, b, c, 'json');
    },
    getScript: function(a, b) {
      return m.get(a, void 0, b, 'script');
    }
  }),
    m.each(['get', 'post'], function(a, b) {
      m[b] = function(a, c, d, e) {
        return (
          m.isFunction(c) && ((e = e || d), (d = c), (c = void 0)),
          m.ajax({ url: a, type: b, dataType: e, data: c, success: d })
        );
      };
    }),
    (m._evalUrl = function(a) {
      return m.ajax({ url: a, type: 'GET', dataType: 'script', async: !1, global: !1, throws: !0 });
    }),
    m.fn.extend({
      wrapAll: function(a) {
        if (m.isFunction(a))
          return this.each(function(b) {
            m(this).wrapAll(a.call(this, b));
          });
        if (this[0]) {
          var b = m(a, this[0].ownerDocument)
            .eq(0)
            .clone(!0);
          this[0].parentNode && b.insertBefore(this[0]),
            b
              .map(function() {
                var a = this;
                while (a.firstChild && 1 === a.firstChild.nodeType) a = a.firstChild;
                return a;
              })
              .append(this);
        }
        return this;
      },
      wrapInner: function(a) {
        return this.each(
          m.isFunction(a)
            ? function(b) {
                m(this).wrapInner(a.call(this, b));
              }
            : function() {
                var b = m(this),
                  c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a);
              }
        );
      },
      wrap: function(a) {
        var b = m.isFunction(a);
        return this.each(function(c) {
          m(this).wrapAll(b ? a.call(this, c) : a);
        });
      },
      unwrap: function() {
        return this.parent()
          .each(function() {
            m.nodeName(this, 'body') || m(this).replaceWith(this.childNodes);
          })
          .end();
      }
    }),
    (m.expr.filters.hidden = function(a) {
      return (
        (a.offsetWidth <= 0 && a.offsetHeight <= 0) ||
        (!k.reliableHiddenOffsets() &&
          'none' === ((a.style && a.style.display) || m.css(a, 'display')))
      );
    }),
    (m.expr.filters.visible = function(a) {
      return !m.expr.filters.hidden(a);
    });
  var Qc = /%20/g,
    Rc = /\[\]$/,
    Sc = /\r?\n/g,
    Tc = /^(?:submit|button|image|reset|file)$/i,
    Uc = /^(?:input|select|textarea|keygen)/i;
  function Vc(a, b, c, d) {
    var e;
    if (m.isArray(b))
      m.each(b, function(b, e) {
        c || Rc.test(a) ? d(a, e) : Vc(a + '[' + ('object' == typeof e ? b : '') + ']', e, c, d);
      });
    else if (c || 'object' !== m.type(b)) d(a, b);
    else for (e in b) Vc(a + '[' + e + ']', b[e], c, d);
  }
  (m.param = function(a, b) {
    var c,
      d = [],
      e = function(a, b) {
        (b = m.isFunction(b) ? b() : null == b ? '' : b),
          (d[d.length] = encodeURIComponent(a) + '=' + encodeURIComponent(b));
      };
    if (
      (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional),
      m.isArray(a) || (a.jquery && !m.isPlainObject(a)))
    )
      m.each(a, function() {
        e(this.name, this.value);
      });
    else for (c in a) Vc(c, a[c], b, e);
    return d.join('&').replace(Qc, '+');
  }),
    m.fn.extend({
      serialize: function() {
        return m.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var a = m.prop(this, 'elements');
          return a ? m.makeArray(a) : this;
        })
          .filter(function() {
            var a = this.type;
            return (
              this.name &&
              !m(this).is(':disabled') &&
              Uc.test(this.nodeName) &&
              !Tc.test(a) &&
              (this.checked || !W.test(a))
            );
          })
          .map(function(a, b) {
            var c = m(this).val();
            return null == c
              ? null
              : m.isArray(c)
                ? m.map(c, function(a) {
                    return { name: b.name, value: a.replace(Sc, '\r\n') };
                  })
                : { name: b.name, value: c.replace(Sc, '\r\n') };
          })
          .get();
      }
    }),
    (m.ajaxSettings.xhr =
      void 0 !== a.ActiveXObject
        ? function() {
            return (
              (!this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc()) ||
              $c()
            );
          }
        : Zc);
  var Wc = 0,
    Xc = {},
    Yc = m.ajaxSettings.xhr();
  a.attachEvent &&
    a.attachEvent('onunload', function() {
      for (var a in Xc) Xc[a](void 0, !0);
    }),
    (k.cors = !!Yc && 'withCredentials' in Yc),
    (Yc = k.ajax = !!Yc),
    Yc &&
      m.ajaxTransport(function(a) {
        if (!a.crossDomain || k.cors) {
          var b;
          return {
            send: function(c, d) {
              var e,
                f = a.xhr(),
                g = ++Wc;
              if ((f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields))
                for (e in a.xhrFields) f[e] = a.xhrFields[e];
              a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType),
                a.crossDomain ||
                  c['X-Requested-With'] ||
                  (c['X-Requested-With'] = 'XMLHttpRequest');
              for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + '');
              f.send((a.hasContent && a.data) || null),
                (b = function(c, e) {
                  var h, i, j;
                  if (b && (e || 4 === f.readyState))
                    if ((delete Xc[g], (b = void 0), (f.onreadystatechange = m.noop), e))
                      4 !== f.readyState && f.abort();
                    else {
                      (j = {}),
                        (h = f.status),
                        'string' == typeof f.responseText && (j.text = f.responseText);
                      try {
                        i = f.statusText;
                      } catch (k) {
                        i = '';
                      }
                      h || !a.isLocal || a.crossDomain
                        ? 1223 === h && (h = 204)
                        : (h = j.text ? 200 : 404);
                    }
                  j && d(h, i, j, f.getAllResponseHeaders());
                }),
                a.async
                  ? 4 === f.readyState ? setTimeout(b) : (f.onreadystatechange = Xc[g] = b)
                  : b();
            },
            abort: function() {
              b && b(void 0, !0);
            }
          };
        }
      });
  function Zc() {
    try {
      return new a.XMLHttpRequest();
    } catch (b) {}
  }
  function $c() {
    try {
      return new a.ActiveXObject('Microsoft.XMLHTTP');
    } catch (b) {}
  }
  m.ajaxSetup({
    accepts: {
      script:
        'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
    },
    contents: { script: /(?:java|ecma)script/ },
    converters: {
      'text script': function(a) {
        return m.globalEval(a), a;
      }
    }
  }),
    m.ajaxPrefilter('script', function(a) {
      void 0 === a.cache && (a.cache = !1), a.crossDomain && ((a.type = 'GET'), (a.global = !1));
    }),
    m.ajaxTransport('script', function(a) {
      if (a.crossDomain) {
        var b,
          c = y.head || m('head')[0] || y.documentElement;
        return {
          send: function(d, e) {
            (b = y.createElement('script')),
              (b.async = !0),
              a.scriptCharset && (b.charset = a.scriptCharset),
              (b.src = a.url),
              (b.onload = b.onreadystatechange = function(a, c) {
                (c || !b.readyState || /loaded|complete/.test(b.readyState)) &&
                  ((b.onload = b.onreadystatechange = null),
                  b.parentNode && b.parentNode.removeChild(b),
                  (b = null),
                  c || e(200, 'success'));
              }),
              c.insertBefore(b, c.firstChild);
          },
          abort: function() {
            b && b.onload(void 0, !0);
          }
        };
      }
    });
  var _c = [],
    ad = /(=)\?(?=&|$)|\?\?/;
  m.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback: function() {
      var a = _c.pop() || m.expando + '_' + vc++;
      return (this[a] = !0), a;
    }
  }),
    m.ajaxPrefilter('json jsonp', function(b, c, d) {
      var e,
        f,
        g,
        h =
          b.jsonp !== !1 &&
          (ad.test(b.url)
            ? 'url'
            : 'string' == typeof b.data &&
              !(b.contentType || '').indexOf('application/x-www-form-urlencoded') &&
              ad.test(b.data) &&
              'data');
      return h || 'jsonp' === b.dataTypes[0]
        ? ((e = b.jsonpCallback = m.isFunction(b.jsonpCallback)
            ? b.jsonpCallback()
            : b.jsonpCallback),
          h
            ? (b[h] = b[h].replace(ad, '$1' + e))
            : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? '&' : '?') + b.jsonp + '=' + e),
          (b.converters['script json'] = function() {
            return g || m.error(e + ' was not called'), g[0];
          }),
          (b.dataTypes[0] = 'json'),
          (f = a[e]),
          (a[e] = function() {
            g = arguments;
          }),
          d.always(function() {
            (a[e] = f),
              b[e] && ((b.jsonpCallback = c.jsonpCallback), _c.push(e)),
              g && m.isFunction(f) && f(g[0]),
              (g = f = void 0);
          }),
          'script')
        : void 0;
    }),
    (m.parseHTML = function(a, b, c) {
      if (!a || 'string' != typeof a) return null;
      'boolean' == typeof b && ((c = b), (b = !1)), (b = b || y);
      var d = u.exec(a),
        e = !c && [];
      return d
        ? [b.createElement(d[1])]
        : ((d = m.buildFragment([a], b, e)),
          e && e.length && m(e).remove(),
          m.merge([], d.childNodes));
    });
  var bd = m.fn.load;
  (m.fn.load = function(a, b, c) {
    if ('string' != typeof a && bd) return bd.apply(this, arguments);
    var d,
      e,
      f,
      g = this,
      h = a.indexOf(' ');
    return (
      h >= 0 && ((d = m.trim(a.slice(h, a.length))), (a = a.slice(0, h))),
      m.isFunction(b) ? ((c = b), (b = void 0)) : b && 'object' == typeof b && (f = 'POST'),
      g.length > 0 &&
        m
          .ajax({ url: a, type: f, dataType: 'html', data: b })
          .done(function(a) {
            (e = arguments),
              g.html(
                d
                  ? m('<div>')
                      .append(m.parseHTML(a))
                      .find(d)
                  : a
              );
          })
          .complete(
            c &&
              function(a, b) {
                g.each(c, e || [a.responseText, b, a]);
              }
          ),
      this
    );
  }),
    m.each(
      ['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'],
      function(a, b) {
        m.fn[b] = function(a) {
          return this.on(b, a);
        };
      }
    ),
    (m.expr.filters.animated = function(a) {
      return m.grep(m.timers, function(b) {
        return a === b.elem;
      }).length;
    });
  var cd = a.document.documentElement;
  function dd(a) {
    return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1;
  }
  (m.offset = {
    setOffset: function(a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k = m.css(a, 'position'),
        l = m(a),
        n = {};
      'static' === k && (a.style.position = 'relative'),
        (h = l.offset()),
        (f = m.css(a, 'top')),
        (i = m.css(a, 'left')),
        (j = ('absolute' === k || 'fixed' === k) && m.inArray('auto', [f, i]) > -1),
        j
          ? ((d = l.position()), (g = d.top), (e = d.left))
          : ((g = parseFloat(f) || 0), (e = parseFloat(i) || 0)),
        m.isFunction(b) && (b = b.call(a, c, h)),
        null != b.top && (n.top = b.top - h.top + g),
        null != b.left && (n.left = b.left - h.left + e),
        'using' in b ? b.using.call(a, n) : l.css(n);
    }
  }),
    m.fn.extend({
      offset: function(a) {
        if (arguments.length)
          return void 0 === a
            ? this
            : this.each(function(b) {
                m.offset.setOffset(this, a, b);
              });
        var b,
          c,
          d = { top: 0, left: 0 },
          e = this[0],
          f = e && e.ownerDocument;
        if (f)
          return (
            (b = f.documentElement),
            m.contains(b, e)
              ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()),
                (c = dd(f)),
                {
                  top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                  left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                })
              : d
          );
      },
      position: function() {
        if (this[0]) {
          var a,
            b,
            c = { top: 0, left: 0 },
            d = this[0];
          return (
            'fixed' === m.css(d, 'position')
              ? (b = d.getBoundingClientRect())
              : ((a = this.offsetParent()),
                (b = this.offset()),
                m.nodeName(a[0], 'html') || (c = a.offset()),
                (c.top += m.css(a[0], 'borderTopWidth', !0)),
                (c.left += m.css(a[0], 'borderLeftWidth', !0))),
            {
              top: b.top - c.top - m.css(d, 'marginTop', !0),
              left: b.left - c.left - m.css(d, 'marginLeft', !0)
            }
          );
        }
      },
      offsetParent: function() {
        return this.map(function() {
          var a = this.offsetParent || cd;
          while (a && !m.nodeName(a, 'html') && 'static' === m.css(a, 'position'))
            a = a.offsetParent;
          return a || cd;
        });
      }
    }),
    m.each({ scrollLeft: 'pageXOffset', scrollTop: 'pageYOffset' }, function(a, b) {
      var c = /Y/.test(b);
      m.fn[a] = function(d) {
        return V(
          this,
          function(a, d, e) {
            var f = dd(a);
            return void 0 === e
              ? f ? (b in f ? f[b] : f.document.documentElement[d]) : a[d]
              : void (f
                  ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop())
                  : (a[d] = e));
          },
          a,
          d,
          arguments.length,
          null
        );
      };
    }),
    m.each(['top', 'left'], function(a, b) {
      m.cssHooks[b] = Lb(k.pixelPosition, function(a, c) {
        return c ? ((c = Jb(a, b)), Hb.test(c) ? m(a).position()[b] + 'px' : c) : void 0;
      });
    }),
    m.each({ Height: 'height', Width: 'width' }, function(a, b) {
      m.each({ padding: 'inner' + a, content: b, '': 'outer' + a }, function(c, d) {
        m.fn[d] = function(d, e) {
          var f = arguments.length && (c || 'boolean' != typeof d),
            g = c || (d === !0 || e === !0 ? 'margin' : 'border');
          return V(
            this,
            function(b, c, d) {
              var e;
              return m.isWindow(b)
                ? b.document.documentElement['client' + a]
                : 9 === b.nodeType
                  ? ((e = b.documentElement),
                    Math.max(
                      b.body['scroll' + a],
                      e['scroll' + a],
                      b.body['offset' + a],
                      e['offset' + a],
                      e['client' + a]
                    ))
                  : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g);
            },
            b,
            f ? d : void 0,
            f,
            null
          );
        };
      });
    }),
    (m.fn.size = function() {
      return this.length;
    }),
    (m.fn.andSelf = m.fn.addBack),
    'function' == typeof define &&
      define.amd &&
      define('jquery', [], function() {
        return m;
      });
  var ed = a.jQuery,
    fd = a.$;
  return (
    (m.noConflict = function(b) {
      return a.$ === m && (a.$ = fd), b && a.jQuery === m && (a.jQuery = ed), m;
    }),
    typeof b === K && (a.jQuery = a.$ = m),
    m
  );
});

/*
 AngularJS v1.3.0-beta.14
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(M, U, r) {
  'use strict';
  function G(b) {
    return function() {
      var a = arguments[0],
        c,
        a =
          '[' +
          (b ? b + ':' : '') +
          a +
          '] http://errors.angularjs.org/1.3.0-beta.14/' +
          (b ? b + '/' : '') +
          a;
      for (c = 1; c < arguments.length; c++)
        a =
          a +
          (1 == c ? '?' : '&') +
          'p' +
          (c - 1) +
          '=' +
          encodeURIComponent(
            'function' == typeof arguments[c]
              ? arguments[c].toString().replace(/ \{[\s\S]*$/, '')
              : 'undefined' == typeof arguments[c]
                ? 'undefined'
                : 'string' != typeof arguments[c] ? JSON.stringify(arguments[c]) : arguments[c]
          );
      return Error(a);
    };
  }
  function db(b) {
    if (null == b || Oa(b)) return !1;
    var a = b.length;
    return 1 === b.nodeType && a
      ? !0
      : v(b) || L(b) || 0 === a || ('number' === typeof a && 0 < a && a - 1 in b);
  }
  function q(b, a, c) {
    var d, e;
    if (b)
      if (P(b))
        for (d in b)
          'prototype' == d ||
            ('length' == d || 'name' == d || (b.hasOwnProperty && !b.hasOwnProperty(d))) ||
            a.call(c, b[d], d);
      else if (L(b) || db(b)) for (d = 0, e = b.length; d < e; d++) a.call(c, b[d], d);
      else if (b.forEach && b.forEach !== q) b.forEach(a, c);
      else for (d in b) b.hasOwnProperty(d) && a.call(c, b[d], d);
    return b;
  }
  function Wb(b) {
    var a = [],
      c;
    for (c in b) b.hasOwnProperty(c) && a.push(c);
    return a.sort();
  }
  function id(b, a, c) {
    for (var d = Wb(b), e = 0; e < d.length; e++) a.call(c, b[d[e]], d[e]);
    return d;
  }
  function Xb(b) {
    return function(a, c) {
      b(c, a);
    };
  }
  function jd() {
    return ++eb;
  }
  function Yb(b, a) {
    a ? (b.$$hashKey = a) : delete b.$$hashKey;
  }
  function z(b) {
    var a = b.$$hashKey;
    q(arguments, function(a) {
      a !== b &&
        q(a, function(a, c) {
          b[c] = a;
        });
    });
    Yb(b, a);
    return b;
  }
  function Y(b) {
    return parseInt(b, 10);
  }
  function Zb(b, a) {
    return z(new (z(function() {}, { prototype: b }))(), a);
  }
  function A() {}
  function Ea(b) {
    return b;
  }
  function da(b) {
    return function() {
      return b;
    };
  }
  function w(b) {
    return 'undefined' === typeof b;
  }
  function E(b) {
    return 'undefined' !== typeof b;
  }
  function S(b) {
    return null != b && 'object' === typeof b;
  }
  function v(b) {
    return 'string' === typeof b;
  }
  function Fa(b) {
    return 'number' === typeof b;
  }
  function ra(b) {
    return '[object Date]' === ya.call(b);
  }
  function P(b) {
    return 'function' === typeof b;
  }
  function fb(b) {
    return '[object RegExp]' === ya.call(b);
  }
  function Oa(b) {
    return b && b.window === b;
  }
  function kd(b) {
    return !(!b || !(b.nodeName || (b.prop && b.attr && b.find)));
  }
  function ld(b) {
    var a = {};
    b = b.split(',');
    var c;
    for (c = 0; c < b.length; c++) a[b[c]] = !0;
    return a;
  }
  function md(b, a, c) {
    var d = [];
    q(b, function(b, f, g) {
      d.push(a.call(c, b, f, g));
    });
    return d;
  }
  function Pa(b, a) {
    if (b.indexOf) return b.indexOf(a);
    for (var c = 0; c < b.length; c++) if (a === b[c]) return c;
    return -1;
  }
  function Ga(b, a) {
    var c = Pa(b, a);
    0 <= c && b.splice(c, 1);
    return a;
  }
  function za(b, a, c, d) {
    if (Oa(b) || (b && b.$evalAsync && b.$watch)) throw Qa('cpws');
    if (a) {
      if (b === a) throw Qa('cpi');
      c = c || [];
      d = d || [];
      if (S(b)) {
        var e = Pa(c, b);
        if (-1 !== e) return d[e];
        c.push(b);
        d.push(a);
      }
      if (L(b))
        for (var f = (a.length = 0); f < b.length; f++)
          (e = za(b[f], null, c, d)), S(b[f]) && (c.push(b[f]), d.push(e)), a.push(e);
      else {
        var g = a.$$hashKey;
        q(a, function(b, c) {
          delete a[c];
        });
        for (f in b)
          b.hasOwnProperty(f) &&
            ((e = za(b[f], null, c, d)), S(b[f]) && (c.push(b[f]), d.push(e)), (a[f] = e));
        Yb(a, g);
      }
    } else if ((a = b))
      L(b)
        ? (a = za(b, [], c, d))
        : ra(b)
          ? (a = new Date(b.getTime()))
          : fb(b)
            ? (a = RegExp(b.source))
            : S(b) && ((e = Object.create(Object.getPrototypeOf(b))), (a = za(b, e, c, d)));
    return a;
  }
  function ka(b, a) {
    var c = 0;
    if (L(b)) for (a = a || []; c < b.length; c++) a[c] = b[c];
    else if (S(b)) {
      a = a || {};
      for (var d = Object.keys(b), e = d.length; c < e; c++) {
        var f = d[c];
        if ('$' !== f.charAt(0) || '$' !== f.charAt(1)) a[f] = b[f];
      }
    }
    return a || b;
  }
  function Aa(b, a) {
    if (b === a) return !0;
    if (null === b || null === a) return !1;
    if (b !== b && a !== a) return !0;
    var c = typeof b,
      d;
    if (c == typeof a && 'object' == c)
      if (L(b)) {
        if (!L(a)) return !1;
        if ((c = b.length) == a.length) {
          for (d = 0; d < c; d++) if (!Aa(b[d], a[d])) return !1;
          return !0;
        }
      } else {
        if (ra(b)) return ra(a) && b.getTime() == a.getTime();
        if (fb(b) && fb(a)) return b.toString() == a.toString();
        if (
          (b && b.$evalAsync && b.$watch) ||
          (a && a.$evalAsync && a.$watch) ||
          Oa(b) ||
          Oa(a) ||
          L(a)
        )
          return !1;
        c = {};
        for (d in b)
          if ('$' !== d.charAt(0) && !P(b[d])) {
            if (!Aa(b[d], a[d])) return !1;
            c[d] = !0;
          }
        for (d in a)
          if (!c.hasOwnProperty(d) && '$' !== d.charAt(0) && a[d] !== r && !P(a[d])) return !1;
        return !0;
      }
    return !1;
  }
  function $b() {
    return (
      (U.securityPolicy && U.securityPolicy.isActive) ||
      (U.querySelector && !(!U.querySelector('[ng-csp]') && !U.querySelector('[data-ng-csp]')))
    );
  }
  function Ab(b, a) {
    var c = 2 < arguments.length ? la.call(arguments, 2) : [];
    return !P(a) || a instanceof RegExp
      ? a
      : c.length
        ? function() {
            return arguments.length ? a.apply(b, c.concat(la.call(arguments, 0))) : a.apply(b, c);
          }
        : function() {
            return arguments.length ? a.apply(b, arguments) : a.call(b);
          };
  }
  function nd(b, a) {
    var c = a;
    'string' === typeof b && '$' === b.charAt(0) && '$' === b.charAt(1)
      ? (c = r)
      : Oa(a)
        ? (c = '$WINDOW')
        : a && U === a ? (c = '$DOCUMENT') : a && (a.$evalAsync && a.$watch) && (c = '$SCOPE');
    return c;
  }
  function sa(b, a) {
    return 'undefined' === typeof b ? r : JSON.stringify(b, nd, a ? '  ' : null);
  }
  function ac(b) {
    return v(b) ? JSON.parse(b) : b;
  }
  function ha(b) {
    b = D(b).clone();
    try {
      b.empty();
    } catch (a) {}
    var c = D('<div>')
      .append(b)
      .html();
    try {
      return 3 === b[0].nodeType
        ? K(c)
        : c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(a, b) {
            return '<' + K(b);
          });
    } catch (d) {
      return K(c);
    }
  }
  function bc(b) {
    try {
      return decodeURIComponent(b);
    } catch (a) {}
  }
  function cc(b) {
    var a = {},
      c,
      d;
    q((b || '').split('&'), function(b) {
      b &&
        ((c = b.split('=')),
        (d = bc(c[0])),
        E(d) &&
          ((b = E(c[1]) ? bc(c[1]) : !0),
          a[d] ? (L(a[d]) ? a[d].push(b) : (a[d] = [a[d], b])) : (a[d] = b)));
    });
    return a;
  }
  function Bb(b) {
    var a = [];
    q(b, function(b, d) {
      L(b)
        ? q(b, function(b) {
            a.push(Ba(d, !0) + (!0 === b ? '' : '=' + Ba(b, !0)));
          })
        : a.push(Ba(d, !0) + (!0 === b ? '' : '=' + Ba(b, !0)));
    });
    return a.length ? a.join('&') : '';
  }
  function gb(b) {
    return Ba(b, !0)
      .replace(/%26/gi, '&')
      .replace(/%3D/gi, '=')
      .replace(/%2B/gi, '+');
  }
  function Ba(b, a) {
    return encodeURIComponent(b)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, a ? '%20' : '+');
  }
  function od(b, a) {
    var c,
      d,
      e = dc.length;
    b = D(b);
    for (d = 0; d < e; ++d) if (((c = dc[d] + a), v((c = b.attr(c))))) return c;
    return null;
  }
  function pd(b, a) {
    function c(a) {
      a && d.push(a);
    }
    var d = [b],
      e,
      f,
      g = {},
      h = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app'],
      n = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
    q(h, function(a) {
      h[a] = !0;
      c(U.getElementById(a));
      a = a.replace(':', '\\:');
      b.querySelectorAll &&
        (q(b.querySelectorAll('.' + a), c),
        q(b.querySelectorAll('.' + a + '\\:'), c),
        q(b.querySelectorAll('[' + a + ']'), c));
    });
    q(d, function(a) {
      if (!e) {
        var b = n.exec(' ' + a.className + ' ');
        b
          ? ((e = a), (f = (b[2] || '').replace(/\s+/g, ',')))
          : q(a.attributes, function(b) {
              !e && h[b.name] && ((e = a), (f = b.value));
            });
      }
    });
    e && ((g.strictDi = null !== od(e, 'strict-di')), a(e, f ? [f] : [], g));
  }
  function ec(b, a, c) {
    S(c) || (c = {});
    c = z({ strictDi: !1 }, c);
    var d = function() {
        b = D(b);
        if (b.injector()) {
          var d = b[0] === U ? 'document' : ha(b);
          throw Qa('btstrpd', d);
        }
        a = a || [];
        a.unshift([
          '$provide',
          function(a) {
            a.value('$rootElement', b);
          }
        ]);
        a.unshift('ng');
        d = Cb(a, c.strictDi);
        d.invoke([
          '$rootScope',
          '$rootElement',
          '$compile',
          '$injector',
          function(a, b, c, d) {
            a.$apply(function() {
              b.data('$injector', d);
              c(b)(a);
            });
          }
        ]);
        return d;
      },
      e = /^NG_DEFER_BOOTSTRAP!/;
    if (M && !e.test(M.name)) return d();
    M.name = M.name.replace(e, '');
    Ra.resumeBootstrap = function(b) {
      q(b, function(b) {
        a.push(b);
      });
      d();
    };
  }
  function hb(b, a) {
    a = a || '_';
    return b.replace(qd, function(b, d) {
      return (d ? a : '') + b.toLowerCase();
    });
  }
  function rd() {
    var b;
    (ta = M.jQuery) && ta.fn.on
      ? ((D = ta),
        z(ta.fn, {
          scope: Ha.scope,
          isolateScope: Ha.isolateScope,
          controller: Ha.controller,
          injector: Ha.injector,
          inheritedData: Ha.inheritedData
        }),
        (b = ta.cleanData),
        (b = b.$$original || b),
        (ta.cleanData = function(a) {
          for (var c = 0, d; null != (d = a[c]); c++) ta(d).triggerHandler('$destroy');
          b(a);
        }),
        (ta.cleanData.$$original = b))
      : (D = Q);
    Ra.element = D;
  }
  function Db(b, a, c) {
    if (!b) throw Qa('areq', a || '?', c || 'required');
    return b;
  }
  function Sa(b, a, c) {
    c && L(b) && (b = b[b.length - 1]);
    Db(
      P(b),
      a,
      'not a function, got ' +
        (b && 'object' === typeof b ? b.constructor.name || 'Object' : typeof b)
    );
    return b;
  }
  function Ca(b, a) {
    if ('hasOwnProperty' === b) throw Qa('badname', a);
  }
  function fc(b, a, c) {
    if (!a) return b;
    a = a.split('.');
    for (var d, e = b, f = a.length, g = 0; g < f; g++) (d = a[g]), b && (b = (e = b)[d]);
    return !c && P(b) ? Ab(e, b) : b;
  }
  function Eb(b) {
    var a = b[0];
    b = b[b.length - 1];
    if (a === b) return D(a);
    var c = [a];
    do {
      a = a.nextSibling;
      if (!a) break;
      c.push(a);
    } while (a !== b);
    return D(c);
  }
  function sd(b) {
    var a = G('$injector'),
      c = G('ng');
    b = b.angular || (b.angular = {});
    b.$$minErr = b.$$minErr || G;
    return (
      b.module ||
      (b.module = (function() {
        var b = {};
        return function(e, f, g) {
          if ('hasOwnProperty' === e) throw c('badname', 'module');
          f && b.hasOwnProperty(e) && (b[e] = null);
          return (
            b[e] ||
            (b[e] = (function() {
              function b(a, d, e, f) {
                f || (f = c);
                return function() {
                  f[e || 'push']([a, d, arguments]);
                  return k;
                };
              }
              if (!f) throw a('nomod', e);
              var c = [],
                d = [],
                m = [],
                p = b('$injector', 'invoke', 'push', d),
                k = {
                  _invokeQueue: c,
                  _configBlocks: d,
                  _runBlocks: m,
                  requires: f,
                  name: e,
                  provider: b('$provide', 'provider'),
                  factory: b('$provide', 'factory'),
                  service: b('$provide', 'service'),
                  value: b('$provide', 'value'),
                  constant: b('$provide', 'constant', 'unshift'),
                  animation: b('$animateProvider', 'register'),
                  filter: b('$filterProvider', 'register'),
                  controller: b('$controllerProvider', 'register'),
                  directive: b('$compileProvider', 'directive'),
                  config: p,
                  run: function(a) {
                    m.push(a);
                    return this;
                  }
                };
              g && p(g);
              return k;
            })())
          );
        };
      })())
    );
  }
  function td(b) {
    z(b, {
      bootstrap: ec,
      copy: za,
      extend: z,
      equals: Aa,
      element: D,
      forEach: q,
      injector: Cb,
      noop: A,
      bind: Ab,
      toJson: sa,
      fromJson: ac,
      identity: Ea,
      isUndefined: w,
      isDefined: E,
      isString: v,
      isFunction: P,
      isObject: S,
      isNumber: Fa,
      isElement: kd,
      isArray: L,
      version: ud,
      isDate: ra,
      lowercase: K,
      uppercase: ib,
      callbacks: { counter: 0 },
      $$minErr: G,
      $$csp: $b
    });
    Ta = sd(M);
    try {
      Ta('ngLocale');
    } catch (a) {
      Ta('ngLocale', []).provider('$locale', vd);
    }
    Ta(
      'ng',
      ['ngLocale'],
      [
        '$provide',
        function(a) {
          a.provider({ $$sanitizeUri: wd });
          a
            .provider('$compile', gc)
            .directive({
              a: xd,
              input: hc,
              textarea: hc,
              form: yd,
              script: zd,
              select: Ad,
              style: Bd,
              option: Cd,
              ngBind: Dd,
              ngBindHtml: Ed,
              ngBindTemplate: Fd,
              ngClass: Gd,
              ngClassEven: Hd,
              ngClassOdd: Id,
              ngCloak: Jd,
              ngController: Kd,
              ngForm: Ld,
              ngHide: Md,
              ngIf: Nd,
              ngInclude: Od,
              ngInit: Pd,
              ngNonBindable: Qd,
              ngPluralize: Rd,
              ngRepeat: Sd,
              ngShow: Td,
              ngStyle: Ud,
              ngSwitch: Vd,
              ngSwitchWhen: Wd,
              ngSwitchDefault: Xd,
              ngOptions: Yd,
              ngTransclude: Zd,
              ngModel: $d,
              ngList: ae,
              ngChange: be,
              pattern: ic,
              ngPattern: ic,
              required: jc,
              ngRequired: jc,
              minlength: kc,
              ngMinlength: kc,
              maxlength: lc,
              ngMaxlength: lc,
              ngValue: ce,
              ngModelOptions: de
            })
            .directive({ ngInclude: ee })
            .directive(jb)
            .directive(mc);
          a.provider({
            $anchorScroll: fe,
            $animate: ge,
            $browser: he,
            $cacheFactory: ie,
            $controller: je,
            $document: ke,
            $exceptionHandler: le,
            $filter: nc,
            $interpolate: me,
            $interval: ne,
            $http: oe,
            $httpBackend: pe,
            $location: qe,
            $log: re,
            $parse: se,
            $rootScope: te,
            $q: ue,
            $$q: ve,
            $sce: we,
            $sceDelegate: xe,
            $sniffer: ye,
            $templateCache: ze,
            $timeout: Ae,
            $window: Be,
            $$rAF: Ce,
            $$asyncCallback: De
          });
        }
      ]
    );
  }
  function Ua(b) {
    return b
      .replace(Ee, function(a, b, d, e) {
        return e ? d.toUpperCase() : d;
      })
      .replace(Fe, 'Moz$1');
  }
  function Ge(b, a) {
    var c,
      d,
      e = a.createDocumentFragment(),
      f = [];
    if (Fb.test(b)) {
      c = c || e.appendChild(a.createElement('div'));
      d = (He.exec(b) || ['', ''])[1].toLowerCase();
      d = fa[d] || fa._default;
      c.innerHTML = d[1] + b.replace(Ie, '<$1></$2>') + d[2];
      for (d = d[0]; d--; ) c = c.lastChild;
      f = f.concat(la.call(c.childNodes, void 0));
      c = e.firstChild;
      c.textContent = '';
    } else f.push(a.createTextNode(b));
    e.textContent = '';
    e.innerHTML = '';
    q(f, function(a) {
      e.appendChild(a);
    });
    return e;
  }
  function Q(b) {
    if (b instanceof Q) return b;
    v(b) && (b = aa(b));
    if (!(this instanceof Q)) {
      if (v(b) && '<' != b.charAt(0)) throw Gb('nosel');
      return new Q(b);
    }
    if (v(b)) {
      var a;
      a = U;
      var c;
      b = (c = Je.exec(b)) ? [a.createElement(c[1])] : (c = Ge(b, a)) ? c.childNodes : [];
    }
    oc(this, b);
  }
  function Hb(b) {
    return b.cloneNode(!0);
  }
  function Ia(b) {
    pc(b);
    for (var a = 0, c = b.children, d = (c && c.length) || 0; a < d; a++) (b = c[a]), Ia(b);
  }
  function qc(b, a, c, d) {
    if (E(d)) throw Gb('offargs');
    var e = ma(b, 'events');
    ma(b, 'handle') &&
      (w(a)
        ? q(e, function(a, c) {
            Va(b, c, a);
            delete e[c];
          })
        : q(a.split(' '), function(a) {
            w(c) ? (Va(b, a, e[a]), delete e[a]) : Ga(e[a] || [], c);
          }));
  }
  function pc(b, a) {
    var c = b.ng339,
      d = Wa[c];
    d &&
      (a
        ? delete Wa[c].data[a]
        : (d.handle && (d.events.$destroy && d.handle({}, '$destroy'), qc(b)),
          delete Wa[c],
          (b.ng339 = r)));
  }
  function ma(b, a, c) {
    var d = b.ng339,
      d = Wa[d || -1];
    if (E(c)) d || ((b.ng339 = d = ++Ke), (d = Wa[d] = {})), (d[a] = c);
    else return d && d[a];
  }
  function rc(b, a, c) {
    if (!b.nodeType || 1 === b.nodeType || 9 === b.nodeType) {
      var d = ma(b, 'data'),
        e = E(c),
        f = !e && E(a),
        g = f && !S(a);
      d || g || ma(b, 'data', (d = {}));
      if (e) d[a] = c;
      else if (f) {
        if (g) return d && d[a];
        z(d, a);
      } else return d;
    }
  }
  function Ib(b, a) {
    return b.getAttribute
      ? -1 <
          (' ' + (b.getAttribute('class') || '') + ' ')
            .replace(/[\n\t]/g, ' ')
            .indexOf(' ' + a + ' ')
      : !1;
  }
  function kb(b, a) {
    a &&
      b.setAttribute &&
      q(a.split(' '), function(a) {
        b.setAttribute(
          'class',
          aa(
            (' ' + (b.getAttribute('class') || '') + ' ')
              .replace(/[\n\t]/g, ' ')
              .replace(' ' + aa(a) + ' ', ' ')
          )
        );
      });
  }
  function lb(b, a) {
    if (a && b.setAttribute) {
      var c = (' ' + (b.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
      q(a.split(' '), function(a) {
        a = aa(a);
        -1 === c.indexOf(' ' + a + ' ') && (c += a + ' ');
      });
      b.setAttribute('class', aa(c));
    }
  }
  function oc(b, a) {
    if (a)
      if (a.nodeType) b[b.length++] = a;
      else {
        var c = a.length;
        'number' === typeof c && a.window !== a
          ? c && (a.item && (a = la.call(a)), sc.apply(b, a))
          : (b[b.length++] = a);
      }
  }
  function tc(b, a) {
    return mb(b, '$' + (a || 'ngController') + 'Controller');
  }
  function mb(b, a, c) {
    b = D(b);
    9 == b[0].nodeType && (b = b.find('html'));
    for (a = L(a) ? a : [a]; b.length; ) {
      for (var d = b[0], e = 0, f = a.length; e < f; e++) if ((c = b.data(a[e])) !== r) return c;
      b = D(d.parentNode || (11 === d.nodeType && d.host));
    }
  }
  function uc(b) {
    for (var a = 0, c = b.childNodes; a < c.length; a++) Ia(c[a]);
    for (; b.firstChild; ) b.removeChild(b.firstChild);
  }
  function vc(b, a) {
    var c = nb[a.toLowerCase()];
    return c && wc[na(b)] && c;
  }
  function Le(b, a) {
    var c = b.nodeName;
    return ('INPUT' === c || 'TEXTAREA' === c) && xc[a];
  }
  function Me(b, a) {
    var c = function(c, e) {
      c.preventDefault ||
        (c.preventDefault = function() {
          c.returnValue = !1;
        });
      c.stopPropagation ||
        (c.stopPropagation = function() {
          c.cancelBubble = !0;
        });
      c.target || (c.target = c.srcElement || U);
      if (w(c.defaultPrevented)) {
        var f = c.preventDefault;
        c.preventDefault = function() {
          c.defaultPrevented = !0;
          f.call(c);
        };
        c.defaultPrevented = !1;
      }
      c.isDefaultPrevented = function() {
        return c.defaultPrevented || !1 === c.returnValue;
      };
      var g = ka(a[e || c.type] || []);
      q(g, function(a) {
        a.call(b, c);
      });
      8 >= W
        ? ((c.preventDefault = null), (c.stopPropagation = null), (c.isDefaultPrevented = null))
        : (delete c.preventDefault, delete c.stopPropagation, delete c.isDefaultPrevented);
    };
    c.elem = b;
    return c;
  }
  function Ja(b, a) {
    var c = typeof b,
      d;
    'function' == c || ('object' == c && null !== b)
      ? 'function' == typeof (d = b.$$hashKey)
        ? (d = b.$$hashKey())
        : d === r && (d = b.$$hashKey = (a || jd)())
      : (d = b);
    return c + ':' + d;
  }
  function Xa(b, a) {
    if (a) {
      var c = 0;
      this.nextUid = function() {
        return ++c;
      };
    }
    q(b, this.put, this);
  }
  function Ne(b) {
    return (b = b
      .toString()
      .replace(yc, '')
      .match(zc))
      ? 'function(' + (b[1] || '').replace(/[\s\r\n]+/, ' ') + ')'
      : 'fn';
  }
  function Jb(b, a, c) {
    var d;
    if ('function' === typeof b) {
      if (!(d = b.$inject)) {
        d = [];
        if (b.length) {
          if (a) throw ((v(c) && c) || (c = b.name || Ne(b)), Ka('strictdi', c));
          a = b.toString().replace(yc, '');
          a = a.match(zc);
          q(a[1].split(Oe), function(a) {
            a.replace(Pe, function(a, b, c) {
              d.push(c);
            });
          });
        }
        b.$inject = d;
      }
    } else L(b) ? ((a = b.length - 1), Sa(b[a], 'fn'), (d = b.slice(0, a))) : Sa(b, 'fn', !0);
    return d;
  }
  function Cb(b, a) {
    function c(a) {
      return function(b, c) {
        if (S(b)) q(b, Xb(a));
        else return a(b, c);
      };
    }
    function d(a, b) {
      Ca(a, 'service');
      if (P(b) || L(b)) b = k.instantiate(b);
      if (!b.$get) throw Ka('pget', a);
      return (p[a + n] = b);
    }
    function e(a, b) {
      return d(a, { $get: b });
    }
    function f(a) {
      var b = [],
        c;
      q(a, function(a) {
        function d(a) {
          var b, c;
          b = 0;
          for (c = a.length; b < c; b++) {
            var e = a[b],
              f = k.get(e[0]);
            f[e[1]].apply(f, e[2]);
          }
        }
        if (!m.get(a)) {
          m.put(a, !0);
          try {
            v(a)
              ? ((c = Ta(a)),
                (b = b.concat(f(c.requires)).concat(c._runBlocks)),
                d(c._invokeQueue),
                d(c._configBlocks))
              : P(a) ? b.push(k.invoke(a)) : L(a) ? b.push(k.invoke(a)) : Sa(a, 'module');
          } catch (e) {
            throw (L(a) && (a = a[a.length - 1]),
            e.message &&
              (e.stack && -1 == e.stack.indexOf(e.message)) &&
              (e = e.message + '\n' + e.stack),
            Ka('modulerr', a, e.stack || e.message || e));
          }
        }
      });
      return b;
    }
    function g(b, c) {
      function d(a) {
        if (b.hasOwnProperty(a)) {
          if (b[a] === h) throw Ka('cdep', a + ' <- ' + l.join(' <- '));
          return b[a];
        }
        try {
          return l.unshift(a), (b[a] = h), (b[a] = c(a));
        } catch (e) {
          throw (b[a] === h && delete b[a], e);
        } finally {
          l.shift();
        }
      }
      function e(b, c, f, g) {
        'string' === typeof f && ((g = f), (f = null));
        var h = [];
        g = Jb(b, a, g);
        var n, k, l;
        k = 0;
        for (n = g.length; k < n; k++) {
          l = g[k];
          if ('string' !== typeof l) throw Ka('itkn', l);
          h.push(f && f.hasOwnProperty(l) ? f[l] : d(l));
        }
        L(b) && (b = b[n]);
        return b.apply(c, h);
      }
      return {
        invoke: e,
        instantiate: function(a, b, c) {
          var d = function() {};
          d.prototype = (L(a) ? a[a.length - 1] : a).prototype;
          d = new d();
          a = e(a, d, b, c);
          return S(a) || P(a) ? a : d;
        },
        get: d,
        annotate: Jb,
        has: function(a) {
          return p.hasOwnProperty(a + n) || b.hasOwnProperty(a);
        }
      };
    }
    a = !0 === a;
    var h = {},
      n = 'Provider',
      l = [],
      m = new Xa([], !0),
      p = {
        $provide: {
          provider: c(d),
          factory: c(e),
          service: c(function(a, b) {
            return e(a, [
              '$injector',
              function(a) {
                return a.instantiate(b);
              }
            ]);
          }),
          value: c(function(a, b) {
            return e(a, da(b));
          }),
          constant: c(function(a, b) {
            Ca(a, 'constant');
            p[a] = b;
            t[a] = b;
          }),
          decorator: function(a, b) {
            var c = k.get(a + n),
              d = c.$get;
            c.$get = function() {
              var a = s.invoke(d, c);
              return s.invoke(b, null, { $delegate: a });
            };
          }
        }
      },
      k = (p.$injector = g(
        p,
        function() {
          throw Ka('unpr', l.join(' <- '));
        },
        a
      )),
      t = {},
      s = (t.$injector = g(
        t,
        function(a) {
          var b = k.get(a + n);
          return s.invoke(b.$get, b, r, a);
        },
        a
      ));
    q(f(b), function(a) {
      s.invoke(a || A);
    });
    return s;
  }
  function fe() {
    var b = !0;
    this.disableAutoScrolling = function() {
      b = !1;
    };
    this.$get = [
      '$window',
      '$location',
      '$rootScope',
      function(a, c, d) {
        function e(a) {
          var b = null;
          q(a, function(a) {
            b || 'a' !== na(a) || (b = a);
          });
          return b;
        }
        function f() {
          var b = c.hash(),
            d;
          b
            ? (d = g.getElementById(b))
              ? d.scrollIntoView()
              : (d = e(g.getElementsByName(b)))
                ? d.scrollIntoView()
                : 'top' === b && a.scrollTo(0, 0)
            : a.scrollTo(0, 0);
        }
        var g = a.document;
        b &&
          d.$watch(
            function() {
              return c.hash();
            },
            function() {
              d.$evalAsync(f);
            }
          );
        return f;
      }
    ];
  }
  function De() {
    this.$get = [
      '$$rAF',
      '$timeout',
      function(b, a) {
        return b.supported
          ? function(a) {
              return b(a);
            }
          : function(b) {
              return a(b, 0, !1);
            };
      }
    ];
  }
  function Qe(b, a, c, d) {
    function e(a) {
      try {
        a.apply(null, la.call(arguments, 1));
      } finally {
        if ((s--, 0 === s))
          for (; I.length; )
            try {
              I.pop()();
            } catch (b) {
              c.error(b);
            }
      }
    }
    function f(a, b) {
      (function Re() {
        q(y, function(a) {
          a();
        });
        F = b(Re, a);
      })();
    }
    function g() {
      x = null;
      B != h.url() &&
        ((B = h.url()),
        q(X, function(a) {
          a(h.url());
        }));
    }
    var h = this,
      n = a[0],
      l = b.location,
      m = b.history,
      p = b.setTimeout,
      k = b.clearTimeout,
      t = {};
    h.isMock = !1;
    var s = 0,
      I = [];
    h.$$completeOutstandingRequest = e;
    h.$$incOutstandingRequestCount = function() {
      s++;
    };
    h.notifyWhenNoOutstandingRequests = function(a) {
      q(y, function(a) {
        a();
      });
      0 === s ? a() : I.push(a);
    };
    var y = [],
      F;
    h.addPollFn = function(a) {
      w(F) && f(100, p);
      y.push(a);
      return a;
    };
    var B = l.href,
      u = a.find('base'),
      x = null;
    h.url = function(a, c) {
      l !== b.location && (l = b.location);
      m !== b.history && (m = b.history);
      if (a) {
        if (B != a)
          return (
            (B = a),
            d.history
              ? c
                ? m.replaceState(null, '', a)
                : (m.pushState(null, '', a), u.attr('href', u.attr('href')))
              : ((x = a), c ? l.replace(a) : (l.href = a)),
            h
          );
      } else return x || l.href.replace(/%27/g, "'");
    };
    var X = [],
      N = !1;
    h.onUrlChange = function(a) {
      if (!N) {
        if (d.history) D(b).on('popstate', g);
        if (d.hashchange) D(b).on('hashchange', g);
        else h.addPollFn(g);
        N = !0;
      }
      X.push(a);
      return a;
    };
    h.baseHref = function() {
      var a = u.attr('href');
      return a ? a.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    };
    var T = {},
      O = '',
      V = h.baseHref();
    h.cookies = function(a, b) {
      var d, e, f, g;
      if (a)
        b === r
          ? (n.cookie = escape(a) + '=;path=' + V + ';expires=Thu, 01 Jan 1970 00:00:00 GMT')
          : v(b) &&
            ((d = (n.cookie = escape(a) + '=' + escape(b) + ';path=' + V).length + 1),
            4096 < d &&
              c.warn(
                "Cookie '" +
                  a +
                  "' possibly not set or overflowed because it was too large (" +
                  d +
                  ' > 4096 bytes)!'
              ));
      else {
        if (n.cookie !== O)
          for (O = n.cookie, d = O.split('; '), T = {}, f = 0; f < d.length; f++)
            (e = d[f]),
              (g = e.indexOf('=')),
              0 < g &&
                ((a = unescape(e.substring(0, g))),
                T[a] === r && (T[a] = unescape(e.substring(g + 1))));
        return T;
      }
    };
    h.defer = function(a, b) {
      var c;
      s++;
      c = p(function() {
        delete t[c];
        e(a);
      }, b || 0);
      t[c] = !0;
      return c;
    };
    h.defer.cancel = function(a) {
      return t[a] ? (delete t[a], k(a), e(A), !0) : !1;
    };
  }
  function he() {
    this.$get = [
      '$window',
      '$log',
      '$sniffer',
      '$document',
      function(b, a, c, d) {
        return new Qe(b, d, a, c);
      }
    ];
  }
  function ie() {
    this.$get = function() {
      function b(b, d) {
        function e(a) {
          a != p &&
            (k ? k == a && (k = a.n) : (k = a), f(a.n, a.p), f(a, p), (p = a), (p.n = null));
        }
        function f(a, b) {
          a != b && (a && (a.p = b), b && (b.n = a));
        }
        if (b in a) throw G('$cacheFactory')('iid', b);
        var g = 0,
          h = z({}, d, { id: b }),
          n = {},
          l = (d && d.capacity) || Number.MAX_VALUE,
          m = {},
          p = null,
          k = null;
        return (a[b] = {
          put: function(a, b) {
            if (l < Number.MAX_VALUE) {
              var c = m[a] || (m[a] = { key: a });
              e(c);
            }
            if (!w(b)) return a in n || g++, (n[a] = b), g > l && this.remove(k.key), b;
          },
          get: function(a) {
            if (l < Number.MAX_VALUE) {
              var b = m[a];
              if (!b) return;
              e(b);
            }
            return n[a];
          },
          remove: function(a) {
            if (l < Number.MAX_VALUE) {
              var b = m[a];
              if (!b) return;
              b == p && (p = b.p);
              b == k && (k = b.n);
              f(b.n, b.p);
              delete m[a];
            }
            delete n[a];
            g--;
          },
          removeAll: function() {
            n = {};
            g = 0;
            m = {};
            p = k = null;
          },
          destroy: function() {
            m = h = n = null;
            delete a[b];
          },
          info: function() {
            return z({}, h, { size: g });
          }
        });
      }
      var a = {};
      b.info = function() {
        var b = {};
        q(a, function(a, e) {
          b[e] = a.info();
        });
        return b;
      };
      b.get = function(b) {
        return a[b];
      };
      return b;
    };
  }
  function ze() {
    this.$get = [
      '$cacheFactory',
      function(b) {
        return b('templates');
      }
    ];
  }
  function gc(b, a) {
    var c = {},
      d = 'Directive',
      e = /^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,
      f = /(([\d\w_\-]+)(?:\:([^;]+))?;?)/,
      g = ld('ngSrc,ngSrcset,src,srcset'),
      h = /^(on[a-z]+|formaction)$/;
    this.directive = function l(a, e) {
      Ca(a, 'directive');
      v(a)
        ? (Db(e, 'directiveFactory'),
          c.hasOwnProperty(a) ||
            ((c[a] = []),
            b.factory(a + d, [
              '$injector',
              '$exceptionHandler',
              function(b, d) {
                var e = [];
                q(c[a], function(c, f) {
                  try {
                    var g = b.invoke(c);
                    P(g)
                      ? (g = { compile: da(g) })
                      : !g.compile && g.link && (g.compile = da(g.link));
                    g.priority = g.priority || 0;
                    g.index = f;
                    g.name = g.name || a;
                    g.require = g.require || (g.controller && g.name);
                    g.restrict = g.restrict || 'A';
                    e.push(g);
                  } catch (h) {
                    d(h);
                  }
                });
                return e;
              }
            ])),
          c[a].push(e))
        : q(a, Xb(l));
      return this;
    };
    this.aHrefSanitizationWhitelist = function(b) {
      return E(b) ? (a.aHrefSanitizationWhitelist(b), this) : a.aHrefSanitizationWhitelist();
    };
    this.imgSrcSanitizationWhitelist = function(b) {
      return E(b) ? (a.imgSrcSanitizationWhitelist(b), this) : a.imgSrcSanitizationWhitelist();
    };
    this.$get = [
      '$injector',
      '$interpolate',
      '$exceptionHandler',
      '$http',
      '$templateCache',
      '$parse',
      '$controller',
      '$rootScope',
      '$document',
      '$sce',
      '$animate',
      '$$sanitizeUri',
      function(a, b, p, k, t, s, I, y, F, B, u, x) {
        function X(a, b, c, d, e) {
          a instanceof D || (a = D(a));
          q(a, function(b, c) {
            3 == b.nodeType &&
              b.nodeValue.match(/\S+/) &&
              (a[c] = D(b)
                .wrap('<span></span>')
                .parent()[0]);
          });
          var f = T(a, b, a, c, d, e);
          N(a, 'ng-scope');
          return function(b, c, d, e) {
            Db(b, 'scope');
            var g = c ? Ha.clone.call(a) : a;
            q(d, function(a, b) {
              g.data('$' + b + 'Controller', a);
            });
            d = 0;
            for (var h = g.length; d < h; d++) {
              var k = g[d].nodeType;
              (1 !== k && 9 !== k) || g.eq(d).data('$scope', b);
            }
            c && c(g, b);
            f && f(b, g, g, e);
            return g;
          };
        }
        function N(a, b) {
          try {
            a.addClass(b);
          } catch (c) {}
        }
        function T(a, b, c, d, e, f) {
          function g(a, c, d, e) {
            var f, k, l, m, p, t, F;
            f = c.length;
            var s = Array(f);
            for (p = 0; p < f; p++) s[p] = c[p];
            F = p = 0;
            for (t = h.length; p < t; F++)
              (k = s[F]),
                (c = h[p++]),
                (f = h[p++]),
                (l = D(k)),
                c
                  ? (c.scope ? ((m = a.$new()), l.data('$scope', m)) : (m = a),
                    (l = c.transcludeOnThisElement
                      ? O(a, c.transclude, e)
                      : !c.templateOnThisElement && e ? e : !e && b ? O(a, b) : null),
                    c(f, m, k, d, l))
                  : f && f(a, k.childNodes, r, e);
          }
          for (var h = [], k, l, m, p, t = 0; t < a.length; t++)
            (k = new Kb()),
              (l = V(a[t], [], k, 0 === t ? d : r, e)),
              (f = l.length ? J(l, a[t], k, b, c, null, [], [], f) : null) &&
                f.scope &&
                N(D(a[t]), 'ng-scope'),
              (k =
                (f && f.terminal) || !(m = a[t].childNodes) || !m.length
                  ? null
                  : T(
                      m,
                      f
                        ? (f.transcludeOnThisElement || !f.templateOnThisElement) && f.transclude
                        : b
                    )),
              h.push(f, k),
              (p = p || f || k),
              (f = null);
          return p ? g : null;
        }
        function O(a, b, c) {
          return function(d, e, f) {
            var g = !1;
            d || ((d = a.$new()), (g = d.$$transcluded = !0));
            e = b(d, e, f, c);
            if (g)
              e.on('$destroy', function() {
                d.$destroy();
              });
            return e;
          };
        }
        function V(a, b, c, d, g) {
          var h = c.$attr,
            k;
          switch (a.nodeType) {
            case 1:
              ua(b, pa(na(a)), 'E', d, g);
              for (var l, m, p, t = a.attributes, F = 0, s = t && t.length; F < s; F++) {
                var I = !1,
                  B = !1;
                l = t[F];
                if (!W || 8 <= W || l.specified) {
                  k = l.name;
                  m = aa(l.value);
                  l = pa(k);
                  if ((p = Da.test(l))) k = hb(l.substr(6), '-');
                  var y = l.replace(/(Start|End)$/, '');
                  l === y + 'Start' &&
                    ((I = k),
                    (B = k.substr(0, k.length - 5) + 'end'),
                    (k = k.substr(0, k.length - 6)));
                  l = pa(k.toLowerCase());
                  h[l] = k;
                  if (p || !c.hasOwnProperty(l)) (c[l] = m), vc(a, l) && (c[l] = !0);
                  Z(a, b, m, l);
                  ua(b, l, 'A', d, g, I, B);
                }
              }
              a = a.className;
              if (v(a) && '' !== a)
                for (; (k = f.exec(a)); )
                  (l = pa(k[2])),
                    ua(b, l, 'C', d, g) && (c[l] = aa(k[3])),
                    (a = a.substr(k.index + k[0].length));
              break;
            case 3:
              G(b, a.nodeValue);
              break;
            case 8:
              try {
                if ((k = e.exec(a.nodeValue)))
                  (l = pa(k[1])), ua(b, l, 'M', d, g) && (c[l] = aa(k[2]));
              } catch (u) {}
          }
          b.sort(w);
          return b;
        }
        function C(a, b, c) {
          var d = [],
            e = 0;
          if (b && a.hasAttribute && a.hasAttribute(b)) {
            do {
              if (!a) throw ia('uterdir', b, c);
              1 == a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--);
              d.push(a);
              a = a.nextSibling;
            } while (0 < e);
          } else d.push(a);
          return D(d);
        }
        function $(a, b, c) {
          return function(d, e, f, g, h) {
            e = C(e[0], b, c);
            return a(d, e, f, g, h);
          };
        }
        function J(a, c, d, e, f, g, h, k, l) {
          function t(a, b, c, d) {
            if (a) {
              c && (a = $(a, c, d));
              a.require = H.require;
              a.directiveName = z;
              if (x === H || H.$$isolateScope) a = Bc(a, { isolateScope: !0 });
              h.push(a);
            }
            if (b) {
              c && (b = $(b, c, d));
              b.require = H.require;
              b.directiveName = z;
              if (x === H || H.$$isolateScope) b = Bc(b, { isolateScope: !0 });
              k.push(b);
            }
          }
          function F(a, b, c, d) {
            var e,
              f = 'data',
              g = !1;
            if (v(b)) {
              for (; '^' == (e = b.charAt(0)) || '?' == e; )
                (b = b.substr(1)), '^' == e && (f = 'inheritedData'), (g = g || '?' == e);
              e = null;
              d && 'data' === f && (e = d[b]);
              e = e || c[f]('$' + b + 'Controller');
              if (!e && !g) throw ia('ctreq', b, a);
            } else
              L(b) &&
                ((e = []),
                q(b, function(b) {
                  e.push(F(a, b, c, d));
                }));
            return e;
          }
          function B(a, e, f, g, l) {
            function t(a, b) {
              var c;
              2 > arguments.length && ((b = a), (a = r));
              w && (c = V);
              return l(a, b, c);
            }
            var y,
              u,
              Ac,
              C,
              X,
              J,
              V = {},
              $;
            y = c === f ? d : ka(d, new Kb(D(f), d.$attr));
            u = y.$$element;
            if (x) {
              var Se = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
              g = D(f);
              J = e.$new(!0);
              !T || (T !== x && T !== x.$$originalDirective)
                ? g.data('$isolateScopeNoTemplate', J)
                : g.data('$isolateScope', J);
              N(g, 'ng-isolate-scope');
              q(x.scope, function(a, c) {
                var d = a.match(Se) || [],
                  f = d[3] || c,
                  g = '?' == d[2],
                  d = d[1],
                  h,
                  k,
                  l,
                  p;
                J.$$isolateBindings[c] = d + f;
                switch (d) {
                  case '@':
                    y.$observe(f, function(a) {
                      J[c] = a;
                    });
                    y.$$observers[f].$$scope = e;
                    y[f] && (J[c] = b(y[f])(e));
                    break;
                  case '=':
                    if (g && !y[f]) break;
                    k = s(y[f]);
                    p = k.literal
                      ? Aa
                      : function(a, b) {
                          return a === b;
                        };
                    l =
                      k.assign ||
                      function() {
                        h = J[c] = k(e);
                        throw ia('nonassign', y[f], x.name);
                      };
                    h = J[c] = k(e);
                    J.$watch(
                      function Te() {
                        var a = k(e);
                        p(a, J[c]) || (p(a, h) ? l(e, (a = J[c])) : (J[c] = a));
                        Te.$$unwatch = k.$$unwatch;
                        return (h = a);
                      },
                      null,
                      k.literal
                    );
                    break;
                  case '&':
                    k = s(y[f]);
                    J[c] = function(a) {
                      return k(e, a);
                    };
                    break;
                  default:
                    throw ia('iscp', x.name, c, a);
                }
              });
            }
            $ = l && t;
            O &&
              q(O, function(a) {
                var b = {
                    $scope: a === x || a.$$isolateScope ? J : e,
                    $element: u,
                    $attrs: y,
                    $transclude: $
                  },
                  c;
                X = a.controller;
                '@' == X && (X = y[a.name]);
                c = I(X, b);
                V[a.name] = c;
                w || u.data('$' + a.name + 'Controller', c);
                a.controllerAs && (b.$scope[a.controllerAs] = c);
              });
            g = 0;
            for (Ac = h.length; g < Ac; g++)
              try {
                (C = h[g]),
                  C(
                    C.isolateScope ? J : e,
                    u,
                    y,
                    C.require && F(C.directiveName, C.require, u, V),
                    $
                  );
              } catch (oa) {
                p(oa, ha(u));
              }
            g = e;
            x && (x.template || null === x.templateUrl) && (g = J);
            a && a(g, f.childNodes, r, l);
            for (g = k.length - 1; 0 <= g; g--)
              try {
                (C = k[g]),
                  C(
                    C.isolateScope ? J : e,
                    u,
                    y,
                    C.require && F(C.directiveName, C.require, u, V),
                    $
                  );
              } catch (R) {
                p(R, ha(u));
              }
          }
          l = l || {};
          for (
            var y = -Number.MAX_VALUE,
              u,
              O = l.controllerDirectives,
              x = l.newIsolateScopeDirective,
              T = l.templateDirective,
              J = l.nonTlbTranscludeDirective,
              ua = !1,
              Ya = !1,
              w = l.hasElementTranscludeDirective,
              Z = (d.$$element = D(c)),
              H,
              z,
              R,
              K = e,
              G,
              M = 0,
              Q = a.length;
            M < Q;
            M++
          ) {
            H = a[M];
            var Da = H.$$start,
              ob = H.$$end;
            Da && (Z = C(c, Da, ob));
            R = r;
            if (y > H.priority) break;
            if ((R = H.scope))
              H.templateUrl ||
                (S(R)
                  ? (La('new/isolated scope', x || u, H, Z), (x = H))
                  : La('new/isolated scope', x, H, Z)),
                (u = u || H);
            z = H.name;
            !H.templateUrl &&
              H.controller &&
              ((R = H.controller),
              (O = O || {}),
              La("'" + z + "' controller", O[z], H, Z),
              (O[z] = H));
            if ((R = H.transclude))
              (ua = !0),
                H.$$tlb || (La('transclusion', J, H, Z), (J = H)),
                'element' == R
                  ? ((w = !0),
                    (y = H.priority),
                    (R = C(c, Da, ob)),
                    (Z = d.$$element = D(U.createComment(' ' + z + ': ' + d[z] + ' '))),
                    (c = Z[0]),
                    pb(f, D(la.call(R, 0)), c),
                    (K = X(R, e, y, g && g.name, { nonTlbTranscludeDirective: J })))
                  : ((R = D(Hb(c)).contents()), Z.empty(), (K = X(R, e)));
            if (H.template)
              if (
                ((Ya = !0),
                La('template', T, H, Z),
                (T = H),
                (R = P(H.template) ? H.template(Z, d) : H.template),
                (R = Cc(R)),
                H.replace)
              ) {
                g = H;
                R = Fb.test(R) ? D(Dc(H.type, aa(R))) : [];
                c = R[0];
                if (1 != R.length || 1 !== c.nodeType) throw ia('tplrt', z, '');
                pb(f, Z, c);
                Q = { $attr: {} };
                R = V(c, [], Q);
                var W = a.splice(M + 1, a.length - (M + 1));
                x && E(R);
                a = a.concat(R).concat(W);
                oa(d, Q);
                Q = a.length;
              } else Z.html(R);
            if (H.templateUrl)
              (Ya = !0),
                La('template', T, H, Z),
                (T = H),
                H.replace && (g = H),
                (B = A(a.splice(M, a.length - M), Z, d, f, ua && K, h, k, {
                  controllerDirectives: O,
                  newIsolateScopeDirective: x,
                  templateDirective: T,
                  nonTlbTranscludeDirective: J
                })),
                (Q = a.length);
            else if (H.compile)
              try {
                (G = H.compile(Z, d, K)), P(G) ? t(null, G, Da, ob) : G && t(G.pre, G.post, Da, ob);
              } catch (Y) {
                p(Y, ha(Z));
              }
            H.terminal && ((B.terminal = !0), (y = Math.max(y, H.priority)));
          }
          B.scope = u && !0 === u.scope;
          B.transcludeOnThisElement = ua;
          B.templateOnThisElement = Ya;
          B.transclude = K;
          l.hasElementTranscludeDirective = w;
          return B;
        }
        function E(a) {
          for (var b = 0, c = a.length; b < c; b++) a[b] = Zb(a[b], { $$isolateScope: !0 });
        }
        function ua(b, e, f, g, h, k, m) {
          if (e === h) return null;
          h = null;
          if (c.hasOwnProperty(e)) {
            var t;
            e = a.get(e + d);
            for (var F = 0, s = e.length; F < s; F++)
              try {
                (t = e[F]),
                  (g === r || g > t.priority) &&
                    -1 != t.restrict.indexOf(f) &&
                    (k && (t = Zb(t, { $$start: k, $$end: m })), b.push(t), (h = t));
              } catch (y) {
                p(y);
              }
          }
          return h;
        }
        function oa(a, b) {
          var c = b.$attr,
            d = a.$attr,
            e = a.$$element;
          q(a, function(d, e) {
            '$' != e.charAt(0) &&
              (b[e] && b[e] !== d && (d += ('style' === e ? ';' : ' ') + b[e]),
              a.$set(e, d, !0, c[e]));
          });
          q(b, function(b, f) {
            'class' == f
              ? (N(e, b), (a['class'] = (a['class'] ? a['class'] + ' ' : '') + b))
              : 'style' == f
                ? (e.attr('style', e.attr('style') + ';' + b),
                  (a.style = (a.style ? a.style + ';' : '') + b))
                : '$' == f.charAt(0) || a.hasOwnProperty(f) || ((a[f] = b), (d[f] = c[f]));
          });
        }
        function A(a, b, c, d, e, f, g, h) {
          var l = [],
            m,
            p,
            F = b[0],
            s = a.shift(),
            y = z({}, s, {
              templateUrl: null,
              transclude: null,
              replace: null,
              $$originalDirective: s
            }),
            u = P(s.templateUrl) ? s.templateUrl(b, c) : s.templateUrl,
            I = s.type;
          b.empty();
          k
            .get(B.getTrustedResourceUrl(u), { cache: t })
            .success(function(k) {
              var t, B;
              k = Cc(k);
              if (s.replace) {
                k = Fb.test(k) ? D(Dc(I, aa(k))) : [];
                t = k[0];
                if (1 != k.length || 1 !== t.nodeType) throw ia('tplrt', s.name, u);
                k = { $attr: {} };
                pb(d, b, t);
                var x = V(t, [], k);
                S(s.scope) && E(x);
                a = x.concat(a);
                oa(c, k);
              } else (t = F), b.html(k);
              a.unshift(y);
              m = J(a, t, c, e, b, s, f, g, h);
              q(d, function(a, c) {
                a == t && (d[c] = b[0]);
              });
              for (p = T(b[0].childNodes, e); l.length; ) {
                k = l.shift();
                B = l.shift();
                var C = l.shift(),
                  X = l.shift(),
                  x = b[0];
                if (B !== F) {
                  var $ = B.className;
                  (h.hasElementTranscludeDirective && s.replace) || (x = Hb(t));
                  pb(C, D(B), x);
                  N(D(x), $);
                }
                B = m.transcludeOnThisElement ? O(k, m.transclude, X) : X;
                m(p, k, x, d, B);
              }
              l = null;
            })
            .error(function(a, b, c, d) {
              throw ia('tpload', d.url);
            });
          return function(a, b, c, d, e) {
            a = e;
            l
              ? (l.push(b), l.push(c), l.push(d), l.push(a))
              : (m.transcludeOnThisElement && (a = O(b, m.transclude, e)), m(p, b, c, d, a));
          };
        }
        function w(a, b) {
          var c = b.priority - a.priority;
          return 0 !== c ? c : a.name !== b.name ? (a.name < b.name ? -1 : 1) : a.index - b.index;
        }
        function La(a, b, c, d) {
          if (b) throw ia('multidir', b.name, c.name, a, ha(d));
        }
        function G(a, c) {
          var d = b(c, !0);
          d &&
            a.push({
              priority: 0,
              compile: function(a) {
                var e = a.parent().length;
                e && N(a.parent(), 'ng-binding');
                return function(a, f) {
                  var g = f.parent(),
                    h = g.data('$binding') || [];
                  d = b(c);
                  h.push(d);
                  g.data('$binding', h);
                  e || N(g, 'ng-binding');
                  a.$watch(d, function(a) {
                    f[0].nodeValue = a;
                  });
                };
              }
            });
        }
        function Dc(a, b) {
          a = K(a || 'html');
          switch (a) {
            case 'svg':
            case 'math':
              var c = U.createElement('div');
              c.innerHTML = '<' + a + '>' + b + '</' + a + '>';
              return c.childNodes[0].childNodes;
            default:
              return b;
          }
        }
        function Ya(a, b) {
          if ('srcdoc' == b) return B.HTML;
          var c = na(a);
          if (
            'xlinkHref' == b ||
            ('form' == c && 'action' == b) ||
            ('img' != c && ('src' == b || 'ngSrc' == b))
          )
            return B.RESOURCE_URL;
        }
        function Z(a, c, d, e) {
          var f = b(d, !0);
          if (f) {
            if ('multiple' === e && 'select' === na(a)) throw ia('selmulti', ha(a));
            c.push({
              priority: 100,
              compile: function() {
                return {
                  pre: function(c, d, k) {
                    d = k.$$observers || (k.$$observers = {});
                    if (h.test(e)) throw ia('nodomevents');
                    if ((f = b(k[e], !0, Ya(a, e), g[e])))
                      (k[e] = f(c)),
                        ((d[e] || (d[e] = [])).$$inter = !0),
                        ((k.$$observers && k.$$observers[e].$$scope) || c).$watch(f, function(
                          a,
                          b
                        ) {
                          'class' === e && a != b ? k.$updateClass(a, b) : k.$set(e, a);
                        });
                  }
                };
              }
            });
          }
        }
        function pb(a, b, c) {
          var d = b[0],
            e = b.length,
            f = d.parentNode,
            g,
            h;
          if (a)
            for (g = 0, h = a.length; g < h; g++)
              if (a[g] == d) {
                a[g++] = c;
                h = g + e - 1;
                for (var k = a.length; g < k; g++, h++) h < k ? (a[g] = a[h]) : delete a[g];
                a.length -= e - 1;
                break;
              }
          f && f.replaceChild(c, d);
          a = U.createDocumentFragment();
          a.appendChild(d);
          c[D.expando] = d[D.expando];
          d = 1;
          for (e = b.length; d < e; d++) (f = b[d]), D(f).remove(), a.appendChild(f), delete b[d];
          b[0] = c;
          b.length = 1;
        }
        function Bc(a, b) {
          return z(
            function() {
              return a.apply(null, arguments);
            },
            a,
            b
          );
        }
        var Kb = function(a, b) {
          this.$$element = a;
          this.$attr = b || {};
        };
        Kb.prototype = {
          $normalize: pa,
          $addClass: function(a) {
            a && 0 < a.length && u.addClass(this.$$element, a);
          },
          $removeClass: function(a) {
            a && 0 < a.length && u.removeClass(this.$$element, a);
          },
          $updateClass: function(a, b) {
            var c = Ec(a, b),
              d = Ec(b, a);
            0 === c.length
              ? u.removeClass(this.$$element, d)
              : 0 === d.length ? u.addClass(this.$$element, c) : u.setClass(this.$$element, c, d);
          },
          $set: function(a, b, c, d) {
            var e = this.$$element[0],
              f = vc(e, a),
              g = Le(e, a),
              e = a;
            f ? (this.$$element.prop(a, b), (d = f)) : g && ((this[g] = b), (e = g));
            this[a] = b;
            d ? (this.$attr[a] = d) : (d = this.$attr[a]) || (this.$attr[a] = d = hb(a, '-'));
            f = na(this.$$element);
            if (('a' === f && 'href' === a) || ('img' === f && 'src' === a))
              this[a] = b = x(b, 'src' === a);
            !1 !== c &&
              (null === b || b === r ? this.$$element.removeAttr(d) : this.$$element.attr(d, b));
            (a = this.$$observers) &&
              q(a[e], function(a) {
                try {
                  a(b);
                } catch (c) {
                  p(c);
                }
              });
          },
          $observe: function(a, b) {
            var c = this,
              d = c.$$observers || (c.$$observers = {}),
              e = d[a] || (d[a] = []);
            e.push(b);
            y.$evalAsync(function() {
              e.$$inter || b(c[a]);
            });
            return function() {
              Ga(e, b);
            };
          }
        };
        var M = b.startSymbol(),
          Q = b.endSymbol(),
          Cc =
            '{{' == M || '}}' == Q
              ? Ea
              : function(a) {
                  return a.replace(/\{\{/g, M).replace(/}}/g, Q);
                },
          Da = /^ngAttr[A-Z]/;
        return X;
      }
    ];
  }
  function pa(b) {
    return Ua(b.replace(Ue, ''));
  }
  function Ec(b, a) {
    var c = '',
      d = b.split(/\s+/),
      e = a.split(/\s+/),
      f = 0;
    a: for (; f < d.length; f++) {
      for (var g = d[f], h = 0; h < e.length; h++) if (g == e[h]) continue a;
      c += (0 < c.length ? ' ' : '') + g;
    }
    return c;
  }
  function je() {
    var b = {},
      a = /^(\S+)(\s+as\s+(\w+))?$/;
    this.register = function(a, d) {
      Ca(a, 'controller');
      S(a) ? z(b, a) : (b[a] = d);
    };
    this.$get = [
      '$injector',
      '$window',
      function(c, d) {
        return function(e, f) {
          var g, h, n;
          v(e) &&
            ((g = e.match(a)),
            (h = g[1]),
            (n = g[3]),
            (e = b.hasOwnProperty(h) ? b[h] : fc(f.$scope, h, !0) || fc(d, h, !0)),
            Sa(e, h, !0));
          g = c.instantiate(e, f, h);
          if (n) {
            if (!f || 'object' !== typeof f.$scope) throw G('$controller')('noscp', h || e.name, n);
            f.$scope[n] = g;
          }
          return g;
        };
      }
    ];
  }
  function ke() {
    this.$get = [
      '$window',
      function(b) {
        return D(b.document);
      }
    ];
  }
  function le() {
    this.$get = [
      '$log',
      function(b) {
        return function(a, c) {
          b.error.apply(b, arguments);
        };
      }
    ];
  }
  function Fc(b) {
    var a = {},
      c,
      d,
      e;
    if (!b) return a;
    q(b.split('\n'), function(b) {
      e = b.indexOf(':');
      c = K(aa(b.substr(0, e)));
      d = aa(b.substr(e + 1));
      c && (a[c] = a[c] ? a[c] + (', ' + d) : d);
    });
    return a;
  }
  function Gc(b) {
    var a = S(b) ? b : r;
    return function(c) {
      a || (a = Fc(b));
      return c ? a[K(c)] || null : a;
    };
  }
  function Hc(b, a, c) {
    if (P(c)) return c(b, a);
    q(c, function(c) {
      b = c(b, a);
    });
    return b;
  }
  function oe() {
    var b = /^\s*(\[|\{[^\{])/,
      a = /[\}\]]\s*$/,
      c = /^\)\]\}',?\n/,
      d = { 'Content-Type': 'application/json;charset=utf-8' },
      e = (this.defaults = {
        transformResponse: [
          function(d) {
            v(d) && ((d = d.replace(c, '')), b.test(d) && a.test(d) && (d = ac(d)));
            return d;
          }
        ],
        transformRequest: [
          function(a) {
            return S(a) && '[object File]' !== ya.call(a) && '[object Blob]' !== ya.call(a)
              ? sa(a)
              : a;
          }
        ],
        headers: {
          common: { Accept: 'application/json, text/plain, */*' },
          post: ka(d),
          put: ka(d),
          patch: ka(d)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN'
      }),
      f = (this.interceptors = []);
    this.$get = [
      '$httpBackend',
      '$browser',
      '$cacheFactory',
      '$rootScope',
      '$q',
      '$injector',
      function(a, b, c, d, m, p) {
        function k(a) {
          function b(a) {
            var d = z({}, a, { data: Hc(a.data, a.headers, c.transformResponse) });
            return 200 <= a.status && 300 > a.status ? d : m.reject(d);
          }
          var c = {
              method: 'get',
              transformRequest: e.transformRequest,
              transformResponse: e.transformResponse
            },
            d = (function(a) {
              function b(a) {
                var c;
                q(a, function(b, d) {
                  P(b) && ((c = b()), null != c ? (a[d] = c) : delete a[d]);
                });
              }
              var c = e.headers,
                d = z({}, a.headers),
                f,
                g,
                c = z({}, c.common, c[K(a.method)]);
              b(c);
              b(d);
              a: for (f in c) {
                a = K(f);
                for (g in d) if (K(g) === a) continue a;
                d[f] = c[f];
              }
              return d;
            })(a);
          z(c, a);
          c.headers = d;
          c.method = ib(c.method);
          var f = [
              function(a) {
                d = a.headers;
                var c = Hc(a.data, Gc(d), a.transformRequest);
                w(a.data) &&
                  q(d, function(a, b) {
                    'content-type' === K(b) && delete d[b];
                  });
                w(a.withCredentials) &&
                  !w(e.withCredentials) &&
                  (a.withCredentials = e.withCredentials);
                return t(a, c, d).then(b, b);
              },
              r
            ],
            g = m.when(c);
          for (
            q(y, function(a) {
              (a.request || a.requestError) && f.unshift(a.request, a.requestError);
              (a.response || a.responseError) && f.push(a.response, a.responseError);
            });
            f.length;

          ) {
            a = f.shift();
            var h = f.shift(),
              g = g.then(a, h);
          }
          g.success = function(a) {
            g.then(function(b) {
              a(b.data, b.status, b.headers, c);
            });
            return g;
          };
          g.error = function(a) {
            g.then(null, function(b) {
              a(b.data, b.status, b.headers, c);
            });
            return g;
          };
          return g;
        }
        function t(c, f, n) {
          function t(a, b, c, e) {
            V && (200 <= a && 300 > a ? V.put($, [a, b, Fc(c), e]) : V.remove($));
            p(b, a, c, e);
            d.$$phase || d.$apply();
          }
          function p(a, b, d, e) {
            b = Math.max(b, 0);
            (200 <= b && 300 > b ? q.resolve : q.reject)({
              data: a,
              status: b,
              headers: Gc(d),
              config: c,
              statusText: e
            });
          }
          function y() {
            var a = Pa(k.pendingRequests, c);
            -1 !== a && k.pendingRequests.splice(a, 1);
          }
          var q = m.defer(),
            O = q.promise,
            V,
            C,
            $ = s(c.url, c.params);
          k.pendingRequests.push(c);
          O.then(y, y);
          (c.cache || e.cache) &&
            (!1 !== c.cache && 'GET' == c.method) &&
            (V = S(c.cache) ? c.cache : S(e.cache) ? e.cache : I);
          if (V)
            if (((C = V.get($)), E(C))) {
              if (C.then) return C.then(y, y), C;
              L(C) ? p(C[1], C[0], ka(C[2]), C[3]) : p(C, 200, {}, 'OK');
            } else V.put($, O);
          w(C) &&
            ((C = Lb(c.url) ? b.cookies()[c.xsrfCookieName || e.xsrfCookieName] : r) &&
              (n[c.xsrfHeaderName || e.xsrfHeaderName] = C),
            a(c.method, $, f, t, n, c.timeout, c.withCredentials, c.responseType));
          return O;
        }
        function s(a, b) {
          if (!b) return a;
          var c = [];
          id(b, function(a, b) {
            null === a ||
              w(a) ||
              (L(a) || (a = [a]),
              q(a, function(a) {
                S(a) && (a = sa(a));
                c.push(Ba(b) + '=' + Ba(a));
              }));
          });
          0 < c.length && (a += (-1 == a.indexOf('?') ? '?' : '&') + c.join('&'));
          return a;
        }
        var I = c('$http'),
          y = [];
        q(f, function(a) {
          y.unshift(v(a) ? p.get(a) : p.invoke(a));
        });
        k.pendingRequests = [];
        (function(a) {
          q(arguments, function(a) {
            k[a] = function(b, c) {
              return k(z(c || {}, { method: a, url: b }));
            };
          });
        })('get', 'delete', 'head', 'jsonp');
        (function(a) {
          q(arguments, function(a) {
            k[a] = function(b, c, d) {
              return k(z(d || {}, { method: a, url: b, data: c }));
            };
          });
        })('post', 'put', 'patch');
        k.defaults = e;
        return k;
      }
    ];
  }
  function Ve(b) {
    if (8 >= W && (!b.match(/^(get|post|head|put|delete|options)$/i) || !M.XMLHttpRequest))
      return new M.ActiveXObject('Microsoft.XMLHTTP');
    if (M.XMLHttpRequest) return new M.XMLHttpRequest();
    throw G('$httpBackend')('noxhr');
  }
  function pe() {
    this.$get = [
      '$browser',
      '$window',
      '$document',
      function(b, a, c) {
        return We(b, Ve, b.defer, a.angular.callbacks, c[0]);
      }
    ];
  }
  function We(b, a, c, d, e) {
    function f(a, b, c) {
      var f = e.createElement('script'),
        g = null;
      f.type = 'text/javascript';
      f.src = a;
      f.async = !0;
      g = function(a) {
        Va(f, 'load', g);
        Va(f, 'error', g);
        e.body.removeChild(f);
        f = null;
        var h = -1,
          s = 'unknown';
        a &&
          ('load' !== a.type || d[b].called || (a = { type: 'error' }),
          (s = a.type),
          (h = 'error' === a.type ? 404 : 200));
        c && c(h, s);
      };
      qb(f, 'load', g);
      qb(f, 'error', g);
      e.body.appendChild(f);
      return g;
    }
    var g = -1;
    return function(e, n, l, m, p, k, t, s) {
      function I() {
        F = g;
        u && u();
        x && x.abort();
      }
      function y(a, d, e, f, g) {
        N && c.cancel(N);
        u = x = null;
        0 === d && (d = e ? 200 : 'file' == va(n).protocol ? 404 : 0);
        a(1223 === d ? 204 : d, e, f, g || '');
        b.$$completeOutstandingRequest(A);
      }
      var F;
      b.$$incOutstandingRequestCount();
      n = n || b.url();
      if ('jsonp' == K(e)) {
        var B = '_' + (d.counter++).toString(36);
        d[B] = function(a) {
          d[B].data = a;
          d[B].called = !0;
        };
        var u = f(n.replace('JSON_CALLBACK', 'angular.callbacks.' + B), B, function(a, b) {
          y(m, a, d[B].data, '', b);
          d[B] = A;
        });
      } else {
        var x = a(e);
        x.open(e, n, !0);
        q(p, function(a, b) {
          E(a) && x.setRequestHeader(b, a);
        });
        x.onreadystatechange = function() {
          if (x && 4 == x.readyState) {
            var a = null,
              b = null,
              c = '';
            F !== g &&
              ((a = x.getAllResponseHeaders()),
              (b = 'response' in x ? x.response : x.responseText));
            (F === g && 10 > W) || (c = x.statusText);
            y(m, F || x.status, b, a, c);
          }
        };
        t && (x.withCredentials = !0);
        if (s)
          try {
            x.responseType = s;
          } catch (X) {
            if ('json' !== s) throw X;
          }
        x.send(l || null);
      }
      if (0 < k) var N = c(I, k);
      else k && k.then && k.then(I);
    };
  }
  function me() {
    var b = '{{',
      a = '}}';
    this.startSymbol = function(a) {
      return a ? ((b = a), this) : b;
    };
    this.endSymbol = function(b) {
      return b ? ((a = b), this) : a;
    };
    this.$get = [
      '$parse',
      '$exceptionHandler',
      '$sce',
      function(c, d, e) {
        function f(a) {
          return '\\\\\\' + a;
        }
        function g(f, g, t, s) {
          s = !!s;
          for (
            var I,
              y,
              F = 0,
              B = [],
              u = [],
              x = [],
              X = f.length,
              N = !1,
              T = !1,
              O = [],
              V = {},
              C = {};
            F < X;

          )
            if (-1 != (I = f.indexOf(b, F)) && -1 != (y = f.indexOf(a, I + h)))
              F !== I && (T = !0),
                B.push(f.substring(F, I)),
                (F = f.substring(I + h, y)),
                u.push(F),
                x.push(c(F)),
                (F = y + n),
                (N = !0);
            else {
              F !== X && ((T = !0), B.push(f.substring(F)));
              break;
            }
          q(B, function(c, d) {
            B[d] = B[d].replace(l, b).replace(m, a);
          });
          B.length === u.length && B.push('');
          if (t && N && (T || 1 < u.length)) throw Ic('noconcat', f);
          if (!g || N) {
            O.length = B.length + u.length;
            var $ = function(a) {
                for (var b = 0, c = u.length; b < c; b++) (O[2 * b] = B[b]), (O[2 * b + 1] = a[b]);
                O[2 * c] = B[c];
                return O.join('');
              },
              J = function(a) {
                return (a = t ? e.getTrusted(t, a) : e.valueOf(a));
              },
              D = function(a) {
                if (null == a) return '';
                switch (typeof a) {
                  case 'string':
                    break;
                  case 'number':
                    a = '' + a;
                    break;
                  default:
                    a = sa(a);
                }
                return a;
              };
            return z(
              function oa(a) {
                var b = (a && a.$id) || 'notAScope',
                  c = V[b],
                  e = C[b],
                  g = 0,
                  h = u.length,
                  k = Array(h),
                  n,
                  l = e === r ? !0 : !1;
                c ||
                  ((c = []),
                  (l = !0),
                  a &&
                    a.$on &&
                    a.$on('$destroy', function() {
                      V[b] = null;
                      C[b] = null;
                    }));
                try {
                  for (oa.$$unwatch = !0; g < h; g++) {
                    n = J(x[g](a));
                    if (s && w(n)) {
                      oa.$$unwatch = r;
                      return;
                    }
                    n = D(n);
                    n !== c[g] && (l = !0);
                    k[g] = n;
                    oa.$$unwatch = oa.$$unwatch && x[g].$$unwatch;
                  }
                  l && ((V[b] = k), (C[b] = e = $(k)));
                } catch (t) {
                  (a = Ic('interr', f, t.toString())), d(a);
                }
                return e;
              },
              { exp: f, separators: B, expressions: u }
            );
          }
        }
        var h = b.length,
          n = a.length,
          l = RegExp(b.replace(/./g, f), 'g'),
          m = RegExp(a.replace(/./g, f), 'g');
        g.startSymbol = function() {
          return b;
        };
        g.endSymbol = function() {
          return a;
        };
        return g;
      }
    ];
  }
  function ne() {
    this.$get = [
      '$rootScope',
      '$window',
      '$q',
      '$$q',
      function(b, a, c, d) {
        function e(e, h, n, l) {
          var m = a.setInterval,
            p = a.clearInterval,
            k = 0,
            t = E(l) && !l,
            s = (t ? d : c).defer(),
            I = s.promise;
          n = E(n) ? n : 0;
          I.then(null, null, e);
          I.$$intervalId = m(function() {
            s.notify(k++);
            0 < n && k >= n && (s.resolve(k), p(I.$$intervalId), delete f[I.$$intervalId]);
            t || b.$apply();
          }, h);
          f[I.$$intervalId] = s;
          return I;
        }
        var f = {};
        e.cancel = function(b) {
          return b && b.$$intervalId in f
            ? (f[b.$$intervalId].reject('canceled'),
              a.clearInterval(b.$$intervalId),
              delete f[b.$$intervalId],
              !0)
            : !1;
        };
        return e;
      }
    ];
  }
  function vd() {
    this.$get = function() {
      return {
        id: 'en-us',
        NUMBER_FORMATS: {
          DECIMAL_SEP: '.',
          GROUP_SEP: ',',
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              maxFrac: 3,
              posPre: '',
              posSuf: '',
              negPre: '-',
              negSuf: '',
              gSize: 3,
              lgSize: 3
            },
            {
              minInt: 1,
              minFrac: 2,
              maxFrac: 2,
              posPre: '\u00a4',
              posSuf: '',
              negPre: '(\u00a4',
              negSuf: ')',
              gSize: 3,
              lgSize: 3
            }
          ],
          CURRENCY_SYM: '$'
        },
        DATETIME_FORMATS: {
          MONTH: 'January February March April May June July August September October November December'.split(
            ' '
          ),
          SHORTMONTH: 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
          DAY: 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
          SHORTDAY: 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
          AMPMS: ['AM', 'PM'],
          medium: 'MMM d, y h:mm:ss a',
          short: 'M/d/yy h:mm a',
          fullDate: 'EEEE, MMMM d, y',
          longDate: 'MMMM d, y',
          mediumDate: 'MMM d, y',
          shortDate: 'M/d/yy',
          mediumTime: 'h:mm:ss a',
          shortTime: 'h:mm a'
        },
        pluralCat: function(b) {
          return 1 === b ? 'one' : 'other';
        }
      };
    };
  }
  function Mb(b) {
    b = b.split('/');
    for (var a = b.length; a--; ) b[a] = gb(b[a]);
    return b.join('/');
  }
  function Jc(b, a, c) {
    b = va(b, c);
    a.$$protocol = b.protocol;
    a.$$host = b.hostname;
    a.$$port = Y(b.port) || Xe[b.protocol] || null;
  }
  function Kc(b, a, c) {
    var d = '/' !== b.charAt(0);
    d && (b = '/' + b);
    b = va(b, c);
    a.$$path = decodeURIComponent(
      d && '/' === b.pathname.charAt(0) ? b.pathname.substring(1) : b.pathname
    );
    a.$$search = cc(b.search);
    a.$$hash = decodeURIComponent(b.hash);
    a.$$path && '/' != a.$$path.charAt(0) && (a.$$path = '/' + a.$$path);
  }
  function qa(b, a) {
    if (0 === a.indexOf(b)) return a.substr(b.length);
  }
  function Za(b) {
    var a = b.indexOf('#');
    return -1 == a ? b : b.substr(0, a);
  }
  function Nb(b) {
    return b.substr(0, Za(b).lastIndexOf('/') + 1);
  }
  function Lc(b, a) {
    this.$$html5 = !0;
    a = a || '';
    var c = Nb(b);
    Jc(b, this, b);
    this.$$parse = function(a) {
      var e = qa(c, a);
      if (!v(e)) throw Ob('ipthprfx', a, c);
      Kc(e, this, b);
      this.$$path || (this.$$path = '/');
      this.$$compose();
    };
    this.$$compose = function() {
      var a = Bb(this.$$search),
        b = this.$$hash ? '#' + gb(this.$$hash) : '';
      this.$$url = Mb(this.$$path) + (a ? '?' + a : '') + b;
      this.$$absUrl = c + this.$$url.substr(1);
    };
    this.$$rewrite = function(d) {
      var e;
      if ((e = qa(b, d)) !== r)
        return (d = e), (e = qa(a, e)) !== r ? c + (qa('/', e) || e) : b + d;
      if ((e = qa(c, d)) !== r) return c + e;
      if (c == d + '/') return c;
    };
  }
  function Pb(b, a) {
    var c = Nb(b);
    Jc(b, this, b);
    this.$$parse = function(d) {
      var e = qa(b, d) || qa(c, d),
        e = '#' == e.charAt(0) ? qa(a, e) : this.$$html5 ? e : '';
      if (!v(e)) throw Ob('ihshprfx', d, a);
      Kc(e, this, b);
      d = this.$$path;
      var f = /^\/[A-Z]:(\/.*)/;
      0 === e.indexOf(b) && (e = e.replace(b, ''));
      f.exec(e) || (d = (e = f.exec(d)) ? e[1] : d);
      this.$$path = d;
      this.$$compose();
    };
    this.$$compose = function() {
      var c = Bb(this.$$search),
        e = this.$$hash ? '#' + gb(this.$$hash) : '';
      this.$$url = Mb(this.$$path) + (c ? '?' + c : '') + e;
      this.$$absUrl = b + (this.$$url ? a + this.$$url : '');
    };
    this.$$rewrite = function(a) {
      if (Za(b) == Za(a)) return a;
    };
  }
  function Qb(b, a) {
    this.$$html5 = !0;
    Pb.apply(this, arguments);
    var c = Nb(b);
    this.$$rewrite = function(d) {
      var e;
      if (b == Za(d)) return d;
      if ((e = qa(c, d))) return b + a + e;
      if (c === d + '/') return c;
    };
    this.$$compose = function() {
      var c = Bb(this.$$search),
        e = this.$$hash ? '#' + gb(this.$$hash) : '';
      this.$$url = Mb(this.$$path) + (c ? '?' + c : '') + e;
      this.$$absUrl = b + a + this.$$url;
    };
  }
  function rb(b) {
    return function() {
      return this[b];
    };
  }
  function Mc(b, a) {
    return function(c) {
      if (w(c)) return this[b];
      this[b] = a(c);
      this.$$compose();
      return this;
    };
  }
  function qe() {
    var b = '',
      a = !1;
    this.hashPrefix = function(a) {
      return E(a) ? ((b = a), this) : b;
    };
    this.html5Mode = function(b) {
      return E(b) ? ((a = b), this) : a;
    };
    this.$get = [
      '$rootScope',
      '$browser',
      '$sniffer',
      '$rootElement',
      function(c, d, e, f) {
        function g(a) {
          c.$broadcast('$locationChangeSuccess', h.absUrl(), a);
        }
        var h,
          n,
          l = d.baseHref(),
          m = d.url(),
          p;
        a
          ? ((p = m.substring(0, m.indexOf('/', m.indexOf('//') + 2)) + (l || '/')),
            (n = e.history ? Lc : Qb))
          : ((p = Za(m)), (n = Pb));
        h = new n(p, '#' + b);
        h.$$parse(h.$$rewrite(m));
        f.on('click', function(a) {
          if (!a.ctrlKey && !a.metaKey && 2 != a.which) {
            for (var e = D(a.target); 'a' !== na(e[0]); )
              if (e[0] === f[0] || !(e = e.parent())[0]) return;
            var g = e.prop('href');
            S(g) && '[object SVGAnimatedString]' === g.toString() && (g = va(g.animVal).href);
            if (n === Qb) {
              var k = e.attr('href') || e.attr('xlink:href');
              if (0 > k.indexOf('://'))
                if (((g = '#' + b), '/' == k[0])) g = p + g + k;
                else if ('#' == k[0]) g = p + g + (h.path() || '/') + k;
                else {
                  for (var l = h.path().split('/'), k = k.split('/'), m = 0; m < k.length; m++)
                    '.' != k[m] && ('..' == k[m] ? l.pop() : k[m].length && l.push(k[m]));
                  g = p + g + l.join('/');
                }
            }
            l = h.$$rewrite(g);
            g &&
              (!e.attr('target') && l && !a.isDefaultPrevented()) &&
              (a.preventDefault(),
              l != d.url() &&
                (h.$$parse(l), c.$apply(), (M.angular['ff-684208-preventDefault'] = !0)));
          }
        });
        h.absUrl() != m && d.url(h.absUrl(), !0);
        d.onUrlChange(function(a) {
          h.absUrl() != a &&
            (c.$evalAsync(function() {
              var b = h.absUrl();
              h.$$parse(a);
              c.$broadcast('$locationChangeStart', a, b).defaultPrevented
                ? (h.$$parse(b), d.url(b))
                : g(b);
            }),
            c.$$phase || c.$digest());
        });
        var k = 0;
        c.$watch(function() {
          var a = d.url(),
            b = h.$$replace;
          (k && a == h.absUrl()) ||
            (k++,
            c.$evalAsync(function() {
              c.$broadcast('$locationChangeStart', h.absUrl(), a).defaultPrevented
                ? h.$$parse(a)
                : (d.url(h.absUrl(), b), g(a));
            }));
          h.$$replace = !1;
          return k;
        });
        return h;
      }
    ];
  }
  function re() {
    var b = !0,
      a = this;
    this.debugEnabled = function(a) {
      return E(a) ? ((b = a), this) : b;
    };
    this.$get = [
      '$window',
      function(c) {
        function d(a) {
          a instanceof Error &&
            (a.stack
              ? (a =
                  a.message && -1 === a.stack.indexOf(a.message)
                    ? 'Error: ' + a.message + '\n' + a.stack
                    : a.stack)
              : a.sourceURL && (a = a.message + '\n' + a.sourceURL + ':' + a.line));
          return a;
        }
        function e(a) {
          var b = c.console || {},
            e = b[a] || b.log || A;
          a = !1;
          try {
            a = !!e.apply;
          } catch (n) {}
          return a
            ? function() {
                var a = [];
                q(arguments, function(b) {
                  a.push(d(b));
                });
                return e.apply(b, a);
              }
            : function(a, b) {
                e(a, null == b ? '' : b);
              };
        }
        return {
          log: e('log'),
          info: e('info'),
          warn: e('warn'),
          error: e('error'),
          debug: (function() {
            var c = e('debug');
            return function() {
              b && c.apply(a, arguments);
            };
          })()
        };
      }
    ];
  }
  function ea(b, a) {
    if (
      '__defineGetter__' === b ||
      '__defineSetter__' === b ||
      '__lookupGetter__' === b ||
      '__lookupSetter__' === b ||
      '__proto__' === b
    )
      throw ja('isecfld', a);
    return b;
  }
  function Ma(b, a) {
    if (b) {
      if (b.constructor === b) throw ja('isecfn', a);
      if (b.window === b) throw ja('isecwindow', a);
      if (b.children && (b.nodeName || (b.prop && b.attr && b.find))) throw ja('isecdom', a);
      if (b === Object) throw ja('isecobj', a);
    }
    return b;
  }
  function sb(b, a, c, d) {
    a = a.split('.');
    for (var e, f = 0; 1 < a.length; f++) {
      e = ea(a.shift(), d);
      var g = b[e];
      g || ((g = {}), (b[e] = g));
      b = g;
    }
    e = ea(a.shift(), d);
    Ma(b, d);
    Ma(b[e], d);
    return (b[e] = c);
  }
  function Nc(b, a, c, d, e, f) {
    ea(b, f);
    ea(a, f);
    ea(c, f);
    ea(d, f);
    ea(e, f);
    return function(f, h) {
      var n = h && h.hasOwnProperty(b) ? h : f;
      if (null == n) return n;
      n = n[b];
      if (!a) return n;
      if (null == n) return r;
      n = n[a];
      if (!c) return n;
      if (null == n) return r;
      n = n[c];
      if (!d) return n;
      if (null == n) return r;
      n = n[d];
      return e ? (null == n ? r : (n = n[e])) : n;
    };
  }
  function Ye(b, a) {
    ea(b, a);
    return function(a, d) {
      return null == a ? r : (d && d.hasOwnProperty(b) ? d : a)[b];
    };
  }
  function Ze(b, a, c) {
    ea(b, c);
    ea(a, c);
    return function(c, e) {
      if (null == c) return r;
      c = (e && e.hasOwnProperty(b) ? e : c)[b];
      return null == c ? r : c[a];
    };
  }
  function Oc(b, a, c) {
    if (Rb.hasOwnProperty(b)) return Rb[b];
    var d = b.split('.'),
      e = d.length;
    if (1 === e) a = Ye(d[0], c);
    else if (2 === e) a = Ze(d[0], d[1], c);
    else if (a.csp)
      a =
        6 > e
          ? Nc(d[0], d[1], d[2], d[3], d[4], c)
          : function(a, b) {
              var f = 0,
                l;
              do (l = Nc(d[f++], d[f++], d[f++], d[f++], d[f++], c)(a, b)), (b = r), (a = l);
              while (f < e);
              return l;
            };
    else {
      var f = 'var p;\n';
      q(d, function(a, b) {
        ea(a, c);
        f +=
          'if(s == null) return undefined;\ns=' +
          (b ? 's' : '((k&&k.hasOwnProperty("' + a + '"))?k:s)') +
          '["' +
          a +
          '"];\n';
      });
      f += 'return s;';
      a = new Function('s', 'k', f);
      a.toString = da(f);
    }
    'hasOwnProperty' !== b && (Rb[b] = a);
    return a;
  }
  function se() {
    var b = {},
      a = { csp: !1 };
    this.$get = [
      '$filter',
      '$sniffer',
      function(c, d) {
        a.csp = d.csp;
        return function(d) {
          function f(a) {
            function b(e, f) {
              c ||
                ((d = a.constant && d ? d : a(e, f)),
                (b.$$unwatch = E(d)),
                b.$$unwatch &&
                  (e && e.$$postDigestQueue) &&
                  e.$$postDigestQueue.push(function() {
                    !(c = E(d)) || (null !== d && d.$$unwrapTrustedValue) || (d = za(d, null));
                  }));
              return d;
            }
            var c = !1,
              d;
            b.literal = a.literal;
            b.constant = a.constant;
            b.assign = a.assign;
            return b;
          }
          var g, h;
          switch (typeof d) {
            case 'string':
              d = aa(d);
              ':' === d.charAt(0) && ':' === d.charAt(1) && ((h = !0), (d = d.substring(2)));
              if (b.hasOwnProperty(d)) return h ? f(b[d]) : b[d];
              g = new Sb(a);
              g = new $a(g, c, a).parse(d);
              'hasOwnProperty' !== d && (b[d] = g);
              return h || g.constant ? f(g) : g;
            case 'function':
              return d;
            default:
              return A;
          }
        };
      }
    ];
  }
  function ue() {
    this.$get = [
      '$rootScope',
      '$exceptionHandler',
      function(b, a) {
        return Pc(function(a) {
          b.$evalAsync(a);
        }, a);
      }
    ];
  }
  function ve() {
    this.$get = [
      '$browser',
      '$exceptionHandler',
      function(b, a) {
        return Pc(function(a) {
          b.defer(a);
        }, a);
      }
    ];
  }
  function Pc(b, a) {
    function c(a) {
      return a;
    }
    function d(a) {
      return g(a);
    }
    var e = function() {
        var g = [],
          l,
          m;
        return (m = {
          resolve: function(a) {
            if (g) {
              var c = g;
              g = r;
              l = f(a);
              c.length &&
                b(function() {
                  for (var a, b = 0, d = c.length; b < d; b++) (a = c[b]), l.then(a[0], a[1], a[2]);
                });
            }
          },
          reject: function(a) {
            m.resolve(h(a));
          },
          notify: function(a) {
            if (g) {
              var c = g;
              g.length &&
                b(function() {
                  for (var b, d = 0, e = c.length; d < e; d++) (b = c[d]), b[2](a);
                });
            }
          },
          promise: {
            then: function(b, f, h) {
              var m = e(),
                I = function(d) {
                  try {
                    m.resolve((P(b) ? b : c)(d));
                  } catch (e) {
                    m.reject(e), a(e);
                  }
                },
                y = function(b) {
                  try {
                    m.resolve((P(f) ? f : d)(b));
                  } catch (c) {
                    m.reject(c), a(c);
                  }
                },
                F = function(b) {
                  try {
                    m.notify((P(h) ? h : c)(b));
                  } catch (d) {
                    a(d);
                  }
                };
              g ? g.push([I, y, F]) : l.then(I, y, F);
              return m.promise;
            },
            catch: function(a) {
              return this.then(null, a);
            },
            finally: function(a) {
              function b(a, c) {
                var d = e();
                c ? d.resolve(a) : d.reject(a);
                return d.promise;
              }
              function d(e, f) {
                var g = null;
                try {
                  g = (a || c)();
                } catch (h) {
                  return b(h, !1);
                }
                return g && P(g.then)
                  ? g.then(
                      function() {
                        return b(e, f);
                      },
                      function(a) {
                        return b(a, !1);
                      }
                    )
                  : b(e, f);
              }
              return this.then(
                function(a) {
                  return d(a, !0);
                },
                function(a) {
                  return d(a, !1);
                }
              );
            }
          }
        });
      },
      f = function(a) {
        return a && P(a.then)
          ? a
          : {
              then: function(c) {
                var d = e();
                b(function() {
                  d.resolve(c(a));
                });
                return d.promise;
              }
            };
      },
      g = function(a) {
        var b = e();
        b.reject(a);
        return b.promise;
      },
      h = function(c) {
        return {
          then: function(f, g) {
            var h = e();
            b(function() {
              try {
                h.resolve((P(g) ? g : d)(c));
              } catch (b) {
                h.reject(b), a(b);
              }
            });
            return h.promise;
          }
        };
      };
    return {
      defer: e,
      reject: g,
      when: function(h, l, m, p) {
        var k = e(),
          t,
          s = function(b) {
            try {
              return (P(l) ? l : c)(b);
            } catch (d) {
              return a(d), g(d);
            }
          },
          I = function(b) {
            try {
              return (P(m) ? m : d)(b);
            } catch (c) {
              return a(c), g(c);
            }
          },
          y = function(b) {
            try {
              return (P(p) ? p : c)(b);
            } catch (d) {
              a(d);
            }
          };
        b(function() {
          f(h).then(
            function(a) {
              t || ((t = !0), k.resolve(f(a).then(s, I, y)));
            },
            function(a) {
              t || ((t = !0), k.resolve(I(a)));
            },
            function(a) {
              t || k.notify(y(a));
            }
          );
        });
        return k.promise;
      },
      all: function(a) {
        var b = e(),
          c = 0,
          d = L(a) ? [] : {};
        q(a, function(a, e) {
          c++;
          f(a).then(
            function(a) {
              d.hasOwnProperty(e) || ((d[e] = a), --c || b.resolve(d));
            },
            function(a) {
              d.hasOwnProperty(e) || b.reject(a);
            }
          );
        });
        0 === c && b.resolve(d);
        return b.promise;
      }
    };
  }
  function Ce() {
    this.$get = [
      '$window',
      '$timeout',
      function(b, a) {
        var c =
            b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame,
          d =
            b.cancelAnimationFrame ||
            b.webkitCancelAnimationFrame ||
            b.mozCancelAnimationFrame ||
            b.webkitCancelRequestAnimationFrame,
          e = !!c,
          f = e
            ? function(a) {
                var b = c(a);
                return function() {
                  d(b);
                };
              }
            : function(b) {
                var c = a(b, 16.66, !1);
                return function() {
                  a.cancel(c);
                };
              };
        f.supported = e;
        return f;
      }
    ];
  }
  function te() {
    var b = 10,
      a = G('$rootScope'),
      c = null;
    this.digestTtl = function(a) {
      arguments.length && (b = a);
      return b;
    };
    this.$get = [
      '$injector',
      '$exceptionHandler',
      '$parse',
      '$browser',
      function(d, e, f, g) {
        function h() {
          this.$id = ++eb;
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this['this'] = this.$root = this;
          this.$$destroyed = !1;
          this.$$asyncQueue = [];
          this.$$postDigestQueue = [];
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$isolateBindings = {};
        }
        function n(b) {
          if (k.$$phase) throw a('inprog', k.$$phase);
          k.$$phase = b;
        }
        function l(a, b) {
          var c = f(a);
          Sa(c, b);
          return c;
        }
        function m(a, b, c) {
          do (a.$$listenerCount[c] -= b), 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c];
          while ((a = a.$parent));
        }
        function p() {}
        h.prototype = {
          constructor: h,
          $new: function(a) {
            a
              ? ((a = new h()),
                (a.$root = this.$root),
                (a.$$asyncQueue = this.$$asyncQueue),
                (a.$$postDigestQueue = this.$$postDigestQueue))
              : (this.$$childScopeClass ||
                  ((this.$$childScopeClass = function() {
                    this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
                    this.$$listeners = {};
                    this.$$listenerCount = {};
                    this.$id = ++eb;
                    this.$$childScopeClass = null;
                  }),
                  (this.$$childScopeClass.prototype = this)),
                (a = new this.$$childScopeClass()));
            a['this'] = a;
            a.$parent = this;
            a.$$prevSibling = this.$$childTail;
            this.$$childHead
              ? (this.$$childTail = this.$$childTail.$$nextSibling = a)
              : (this.$$childHead = this.$$childTail = a);
            return a;
          },
          $watch: function(a, b, d) {
            var e = l(a, 'watch'),
              f = this.$$watchers,
              g = { fn: b, last: p, get: e, exp: a, eq: !!d };
            c = null;
            if (!P(b)) {
              var h = l(b || A, 'listener');
              g.fn = function(a, b, c) {
                h(c);
              };
            }
            f || (f = this.$$watchers = []);
            f.unshift(g);
            return function() {
              Ga(f, g);
              c = null;
            };
          },
          $watchGroup: function(a, b) {
            function c() {
              return h;
            }
            var d = Array(a.length),
              e = Array(a.length),
              g = [],
              h = 0,
              k = this,
              l = Array(a.length),
              n = a.length;
            q(
              a,
              function(a, b) {
                var c = f(a);
                g.push(
                  k.$watch(c, function(a, f) {
                    e[b] = a;
                    d[b] = f;
                    h++;
                    l[b] && !c.$$unwatch && n++;
                    !l[b] && c.$$unwatch && n--;
                    l[b] = c.$$unwatch;
                  })
                );
              },
              this
            );
            g.push(
              k.$watch(c, function() {
                b(e, d, k);
                c.$$unwatch = 0 === n ? !0 : !1;
              })
            );
            return function() {
              q(g, function(a) {
                a();
              });
            };
          },
          $watchCollection: function(a, b) {
            function c() {
              e = n(d);
              var a, b;
              if (S(e))
                if (db(e))
                  for (
                    g !== m && ((g = m), (C = g.length = 0), l++),
                      a = e.length,
                      C !== a && (l++, (g.length = C = a)),
                      b = 0;
                    b < a;
                    b++
                  )
                    (g[b] !== g[b] && e[b] !== e[b]) || g[b] === e[b] || (l++, (g[b] = e[b]));
                else {
                  g !== p && ((g = p = {}), (C = 0), l++);
                  a = 0;
                  for (b in e)
                    e.hasOwnProperty(b) &&
                      (a++,
                      g.hasOwnProperty(b)
                        ? g[b] !== e[b] && (l++, (g[b] = e[b]))
                        : (C++, (g[b] = e[b]), l++));
                  if (C > a)
                    for (b in (l++, g))
                      g.hasOwnProperty(b) && !e.hasOwnProperty(b) && (C--, delete g[b]);
                }
              else g !== e && ((g = e), l++);
              c.$$unwatch = n.$$unwatch;
              return l;
            }
            var d = this,
              e,
              g,
              h,
              k = 1 < b.length,
              l = 0,
              n = f(a),
              m = [],
              p = {},
              q = !0,
              C = 0;
            return this.$watch(c, function() {
              q ? ((q = !1), b(e, e, d)) : b(e, h, d);
              if (k)
                if (S(e))
                  if (db(e)) {
                    h = Array(e.length);
                    for (var a = 0; a < e.length; a++) h[a] = e[a];
                  } else for (a in ((h = {}), e)) Qc.call(e, a) && (h[a] = e[a]);
                else h = e;
            });
          },
          $digest: function() {
            var d,
              f,
              g,
              h,
              l = this.$$asyncQueue,
              m = this.$$postDigestQueue,
              u,
              q,
              r = b,
              N,
              T = [],
              O = [],
              D,
              C,
              E;
            n('$digest');
            c = null;
            do {
              q = !1;
              for (N = this; l.length; ) {
                try {
                  (E = l.shift()), E.scope.$eval(E.expression);
                } catch (J) {
                  (k.$$phase = null), e(J);
                }
                c = null;
              }
              a: do {
                if ((h = N.$$watchers))
                  for (u = h.length; u--; )
                    try {
                      if ((d = h[u]))
                        if (
                          (f = d.get(N)) !== (g = d.last) &&
                          !(d.eq
                            ? Aa(f, g)
                            : 'number' === typeof f &&
                              'number' === typeof g &&
                              isNaN(f) &&
                              isNaN(g))
                        )
                          (q = !0),
                            (c = d),
                            (d.last = d.eq ? za(f, null) : f),
                            d.fn(f, g === p ? f : g, N),
                            5 > r &&
                              ((D = 4 - r),
                              T[D] || (T[D] = []),
                              (C = P(d.exp) ? 'fn: ' + (d.exp.name || d.exp.toString()) : d.exp),
                              (C += '; newVal: ' + sa(f) + '; oldVal: ' + sa(g)),
                              T[D].push(C)),
                            d.get.$$unwatch && O.push({ watch: d, array: h });
                        else if (d === c) {
                          q = !1;
                          break a;
                        }
                    } catch (v) {
                      (k.$$phase = null), e(v);
                    }
                if (!(u = N.$$childHead || (N !== this && N.$$nextSibling)))
                  for (; N !== this && !(u = N.$$nextSibling); ) N = N.$parent;
              } while ((N = u));
              if ((q || l.length) && !r--) throw ((k.$$phase = null), a('infdig', b, sa(T)));
            } while (q || l.length);
            for (k.$$phase = null; m.length; )
              try {
                m.shift()();
              } catch (z) {
                e(z);
              }
            for (u = O.length - 1; 0 <= u; --u)
              (d = O[u]), d.watch.get.$$unwatch && Ga(d.array, d.watch);
          },
          $destroy: function() {
            if (!this.$$destroyed) {
              var a = this.$parent;
              this.$broadcast('$destroy');
              this.$$destroyed = !0;
              this !== k &&
                (q(this.$$listenerCount, Ab(null, m, this)),
                a.$$childHead == this && (a.$$childHead = this.$$nextSibling),
                a.$$childTail == this && (a.$$childTail = this.$$prevSibling),
                this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling),
                this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling),
                (this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = null),
                (this.$$listeners = {}),
                (this.$$watchers = this.$$asyncQueue = this.$$postDigestQueue = []),
                (this.$destroy = this.$digest = this.$apply = A),
                (this.$on = this.$watch = this.$watchGroup = function() {
                  return A;
                }));
            }
          },
          $eval: function(a, b) {
            return f(a)(this, b);
          },
          $evalAsync: function(a) {
            k.$$phase ||
              k.$$asyncQueue.length ||
              g.defer(function() {
                k.$$asyncQueue.length && k.$digest();
              });
            this.$$asyncQueue.push({ scope: this, expression: a });
          },
          $$postDigest: function(a) {
            this.$$postDigestQueue.push(a);
          },
          $apply: function(a) {
            try {
              return n('$apply'), this.$eval(a);
            } catch (b) {
              e(b);
            } finally {
              k.$$phase = null;
              try {
                k.$digest();
              } catch (c) {
                throw (e(c), c);
              }
            }
          },
          $on: function(a, b) {
            var c = this.$$listeners[a];
            c || (this.$$listeners[a] = c = []);
            c.push(b);
            var d = this;
            do d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++;
            while ((d = d.$parent));
            var e = this;
            return function() {
              c[Pa(c, b)] = null;
              m(e, 1, a);
            };
          },
          $emit: function(a, b) {
            var c = [],
              d,
              f = this,
              g = !1,
              h = {
                name: a,
                targetScope: f,
                stopPropagation: function() {
                  g = !0;
                },
                preventDefault: function() {
                  h.defaultPrevented = !0;
                },
                defaultPrevented: !1
              },
              k = [h].concat(la.call(arguments, 1)),
              l,
              n;
            do {
              d = f.$$listeners[a] || c;
              h.currentScope = f;
              l = 0;
              for (n = d.length; l < n; l++)
                if (d[l])
                  try {
                    d[l].apply(null, k);
                  } catch (m) {
                    e(m);
                  }
                else d.splice(l, 1), l--, n--;
              if (g) return (h.currentScope = null), h;
              f = f.$parent;
            } while (f);
            h.currentScope = null;
            return h;
          },
          $broadcast: function(a, b) {
            for (
              var c = this,
                d = this,
                f = {
                  name: a,
                  targetScope: this,
                  preventDefault: function() {
                    f.defaultPrevented = !0;
                  },
                  defaultPrevented: !1
                },
                g = [f].concat(la.call(arguments, 1)),
                h,
                k;
              (c = d);

            ) {
              f.currentScope = c;
              d = c.$$listeners[a] || [];
              h = 0;
              for (k = d.length; h < k; h++)
                if (d[h])
                  try {
                    d[h].apply(null, g);
                  } catch (l) {
                    e(l);
                  }
                else d.splice(h, 1), h--, k--;
              if (!(d = (c.$$listenerCount[a] && c.$$childHead) || (c !== this && c.$$nextSibling)))
                for (; c !== this && !(d = c.$$nextSibling); ) c = c.$parent;
            }
            f.currentScope = null;
            return f;
          }
        };
        var k = new h();
        return k;
      }
    ];
  }
  function wd() {
    var b = /^\s*(https?|ftp|mailto|tel|file):/,
      a = /^\s*(https?|ftp|file|blob):|data:image\//;
    this.aHrefSanitizationWhitelist = function(a) {
      return E(a) ? ((b = a), this) : b;
    };
    this.imgSrcSanitizationWhitelist = function(b) {
      return E(b) ? ((a = b), this) : a;
    };
    this.$get = function() {
      return function(c, d) {
        var e = d ? a : b,
          f;
        if (!W || 8 <= W) if (((f = va(c).href), '' !== f && !f.match(e))) return 'unsafe:' + f;
        return c;
      };
    };
  }
  function $e(b) {
    if ('self' === b) return b;
    if (v(b)) {
      if (-1 < b.indexOf('***')) throw wa('iwcard', b);
      b = b
        .replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
        .replace(/\x08/g, '\\x08')
        .replace('\\*\\*', '.*')
        .replace('\\*', '[^:/.?&;]*');
      return RegExp('^' + b + '$');
    }
    if (fb(b)) return RegExp('^' + b.source + '$');
    throw wa('imatcher');
  }
  function Rc(b) {
    var a = [];
    E(b) &&
      q(b, function(b) {
        a.push($e(b));
      });
    return a;
  }
  function xe() {
    this.SCE_CONTEXTS = ga;
    var b = ['self'],
      a = [];
    this.resourceUrlWhitelist = function(a) {
      arguments.length && (b = Rc(a));
      return b;
    };
    this.resourceUrlBlacklist = function(b) {
      arguments.length && (a = Rc(b));
      return a;
    };
    this.$get = [
      '$injector',
      function(c) {
        function d(a) {
          var b = function(a) {
            this.$$unwrapTrustedValue = function() {
              return a;
            };
          };
          a && (b.prototype = new a());
          b.prototype.valueOf = function() {
            return this.$$unwrapTrustedValue();
          };
          b.prototype.toString = function() {
            return this.$$unwrapTrustedValue().toString();
          };
          return b;
        }
        var e = function(a) {
          throw wa('unsafe');
        };
        c.has('$sanitize') && (e = c.get('$sanitize'));
        var f = d(),
          g = {};
        g[ga.HTML] = d(f);
        g[ga.CSS] = d(f);
        g[ga.URL] = d(f);
        g[ga.JS] = d(f);
        g[ga.RESOURCE_URL] = d(g[ga.URL]);
        return {
          trustAs: function(a, b) {
            var c = g.hasOwnProperty(a) ? g[a] : null;
            if (!c) throw wa('icontext', a, b);
            if (null === b || b === r || '' === b) return b;
            if ('string' !== typeof b) throw wa('itype', a);
            return new c(b);
          },
          getTrusted: function(c, d) {
            if (null === d || d === r || '' === d) return d;
            var f = g.hasOwnProperty(c) ? g[c] : null;
            if (f && d instanceof f) return d.$$unwrapTrustedValue();
            if (c === ga.RESOURCE_URL) {
              var f = va(d.toString()),
                m,
                p,
                k = !1;
              m = 0;
              for (p = b.length; m < p; m++)
                if ('self' === b[m] ? Lb(f) : b[m].exec(f.href)) {
                  k = !0;
                  break;
                }
              if (k)
                for (m = 0, p = a.length; m < p; m++)
                  if ('self' === a[m] ? Lb(f) : a[m].exec(f.href)) {
                    k = !1;
                    break;
                  }
              if (k) return d;
              throw wa('insecurl', d.toString());
            }
            if (c === ga.HTML) return e(d);
            throw wa('unsafe');
          },
          valueOf: function(a) {
            return a instanceof f ? a.$$unwrapTrustedValue() : a;
          }
        };
      }
    ];
  }
  function we() {
    var b = !0;
    this.enabled = function(a) {
      arguments.length && (b = !!a);
      return b;
    };
    this.$get = [
      '$parse',
      '$sniffer',
      '$sceDelegate',
      function(a, c, d) {
        if (b && c.msie && 8 > c.msieDocumentMode) throw wa('iequirks');
        var e = ka(ga);
        e.isEnabled = function() {
          return b;
        };
        e.trustAs = d.trustAs;
        e.getTrusted = d.getTrusted;
        e.valueOf = d.valueOf;
        b ||
          ((e.trustAs = e.getTrusted = function(a, b) {
            return b;
          }),
          (e.valueOf = Ea));
        e.parseAs = function(b, c) {
          var d = a(c);
          return d.literal && d.constant
            ? d
            : function k(a, c) {
                var f = e.getTrusted(b, d(a, c));
                k.$$unwatch = d.$$unwatch;
                return f;
              };
        };
        var f = e.parseAs,
          g = e.getTrusted,
          h = e.trustAs;
        q(ga, function(a, b) {
          var c = K(b);
          e[Ua('parse_as_' + c)] = function(b) {
            return f(a, b);
          };
          e[Ua('get_trusted_' + c)] = function(b) {
            return g(a, b);
          };
          e[Ua('trust_as_' + c)] = function(b) {
            return h(a, b);
          };
        });
        return e;
      }
    ];
  }
  function ye() {
    this.$get = [
      '$window',
      '$document',
      function(b, a) {
        var c = {},
          d = Y((/android (\d+)/.exec(K((b.navigator || {}).userAgent)) || [])[1]),
          e = /Boxee/i.test((b.navigator || {}).userAgent),
          f = a[0] || {},
          g = f.documentMode,
          h,
          n = /^(Moz|webkit|O|ms)(?=[A-Z])/,
          l = f.body && f.body.style,
          m = !1,
          p = !1;
        if (l) {
          for (var k in l)
            if ((m = n.exec(k))) {
              h = m[0];
              h = h.substr(0, 1).toUpperCase() + h.substr(1);
              break;
            }
          h || (h = 'WebkitOpacity' in l && 'webkit');
          m = !!('transition' in l || h + 'Transition' in l);
          p = !!('animation' in l || h + 'Animation' in l);
          !d ||
            (m && p) ||
            ((m = v(f.body.style.webkitTransition)), (p = v(f.body.style.webkitAnimation)));
        }
        return {
          history: !(!b.history || !b.history.pushState || 4 > d || e),
          hashchange: 'onhashchange' in b && (!g || 7 < g),
          hasEvent: function(a) {
            if ('input' == a && 9 == W) return !1;
            if (w(c[a])) {
              var b = f.createElement('div');
              c[a] = 'on' + a in b;
            }
            return c[a];
          },
          csp: $b(),
          vendorPrefix: h,
          transitions: m,
          animations: p,
          android: d,
          msie: W,
          msieDocumentMode: g
        };
      }
    ];
  }
  function Ae() {
    this.$get = [
      '$rootScope',
      '$browser',
      '$q',
      '$$q',
      '$exceptionHandler',
      function(b, a, c, d, e) {
        function f(f, n, l) {
          var m = E(l) && !l,
            p = (m ? d : c).defer(),
            k = p.promise;
          n = a.defer(function() {
            try {
              p.resolve(f());
            } catch (a) {
              p.reject(a), e(a);
            } finally {
              delete g[k.$$timeoutId];
            }
            m || b.$apply();
          }, n);
          k.$$timeoutId = n;
          g[n] = p;
          return k;
        }
        var g = {};
        f.cancel = function(b) {
          return b && b.$$timeoutId in g
            ? (g[b.$$timeoutId].reject('canceled'),
              delete g[b.$$timeoutId],
              a.defer.cancel(b.$$timeoutId))
            : !1;
        };
        return f;
      }
    ];
  }
  function va(b, a) {
    var c = b;
    W && (ba.setAttribute('href', c), (c = ba.href));
    ba.setAttribute('href', c);
    return {
      href: ba.href,
      protocol: ba.protocol ? ba.protocol.replace(/:$/, '') : '',
      host: ba.host,
      search: ba.search ? ba.search.replace(/^\?/, '') : '',
      hash: ba.hash ? ba.hash.replace(/^#/, '') : '',
      hostname: ba.hostname,
      port: ba.port,
      pathname: '/' === ba.pathname.charAt(0) ? ba.pathname : '/' + ba.pathname
    };
  }
  function Lb(b) {
    b = v(b) ? va(b) : b;
    return b.protocol === Sc.protocol && b.host === Sc.host;
  }
  function Be() {
    this.$get = da(M);
  }
  function nc(b) {
    function a(d, e) {
      if (S(d)) {
        var f = {};
        q(d, function(b, c) {
          f[c] = a(c, b);
        });
        return f;
      }
      return b.factory(d + c, e);
    }
    var c = 'Filter';
    this.register = a;
    this.$get = [
      '$injector',
      function(a) {
        return function(b) {
          return a.get(b + c);
        };
      }
    ];
    a('currency', Tc);
    a('date', Uc);
    a('filter', af);
    a('json', bf);
    a('limitTo', cf);
    a('lowercase', df);
    a('number', Vc);
    a('orderBy', Wc);
    a('uppercase', ef);
  }
  function af() {
    return function(b, a, c) {
      if (!L(b)) return b;
      var d = typeof c,
        e = [];
      e.check = function(a) {
        for (var b = 0; b < e.length; b++) if (!e[b](a)) return !1;
        return !0;
      };
      'function' !== d &&
        (c =
          'boolean' === d && c
            ? function(a, b) {
                return Ra.equals(a, b);
              }
            : function(a, b) {
                if (a && b && 'object' === typeof a && 'object' === typeof b) {
                  for (var d in a)
                    if ('$' !== d.charAt(0) && Qc.call(a, d) && c(a[d], b[d])) return !0;
                  return !1;
                }
                b = ('' + b).toLowerCase();
                return -1 < ('' + a).toLowerCase().indexOf(b);
              });
      var f = function(a, b) {
        if ('string' == typeof b && '!' === b.charAt(0)) return !f(a, b.substr(1));
        switch (typeof a) {
          case 'boolean':
          case 'number':
          case 'string':
            return c(a, b);
          case 'object':
            switch (typeof b) {
              case 'object':
                return c(a, b);
              default:
                for (var d in a) if ('$' !== d.charAt(0) && f(a[d], b)) return !0;
            }
            return !1;
          case 'array':
            for (d = 0; d < a.length; d++) if (f(a[d], b)) return !0;
            return !1;
          default:
            return !1;
        }
      };
      switch (typeof a) {
        case 'boolean':
        case 'number':
        case 'string':
          a = { $: a };
        case 'object':
          for (var g in a)
            (function(b) {
              'undefined' !== typeof a[b] &&
                e.push(function(c) {
                  return f('$' == b ? c : c && c[b], a[b]);
                });
            })(g);
          break;
        case 'function':
          e.push(a);
          break;
        default:
          return b;
      }
      d = [];
      for (g = 0; g < b.length; g++) {
        var h = b[g];
        e.check(h) && d.push(h);
      }
      return d;
    };
  }
  function Tc(b) {
    var a = b.NUMBER_FORMATS;
    return function(b, d) {
      w(d) && (d = a.CURRENCY_SYM);
      return Xc(b, a.PATTERNS[1], a.GROUP_SEP, a.DECIMAL_SEP, 2).replace(/\u00A4/g, d);
    };
  }
  function Vc(b) {
    var a = b.NUMBER_FORMATS;
    return function(b, d) {
      return Xc(b, a.PATTERNS[0], a.GROUP_SEP, a.DECIMAL_SEP, d);
    };
  }
  function Xc(b, a, c, d, e) {
    if (null == b || !isFinite(b) || S(b)) return '';
    var f = 0 > b;
    b = Math.abs(b);
    var g = b + '',
      h = '',
      n = [],
      l = !1;
    if (-1 !== g.indexOf('e')) {
      var m = g.match(/([\d\.]+)e(-?)(\d+)/);
      m && '-' == m[2] && m[3] > e + 1 ? ((g = '0'), (b = 0)) : ((h = g), (l = !0));
    }
    if (l) 0 < e && (-1 < b && 1 > b) && (h = b.toFixed(e));
    else {
      g = (g.split(Yc)[1] || '').length;
      w(e) && (e = Math.min(Math.max(a.minFrac, g), a.maxFrac));
      b = +(Math.round(+(b.toString() + 'e' + e)).toString() + 'e' + -e);
      b = ('' + b).split(Yc);
      g = b[0];
      b = b[1] || '';
      var m = 0,
        p = a.lgSize,
        k = a.gSize;
      if (g.length >= p + k)
        for (m = g.length - p, l = 0; l < m; l++)
          0 === (m - l) % k && 0 !== l && (h += c), (h += g.charAt(l));
      for (l = m; l < g.length; l++)
        0 === (g.length - l) % p && 0 !== l && (h += c), (h += g.charAt(l));
      for (; b.length < e; ) b += '0';
      e && '0' !== e && (h += d + b.substr(0, e));
    }
    n.push(f ? a.negPre : a.posPre);
    n.push(h);
    n.push(f ? a.negSuf : a.posSuf);
    return n.join('');
  }
  function tb(b, a, c) {
    var d = '';
    0 > b && ((d = '-'), (b = -b));
    for (b = '' + b; b.length < a; ) b = '0' + b;
    c && (b = b.substr(b.length - a));
    return d + b;
  }
  function ca(b, a, c, d) {
    c = c || 0;
    return function(e) {
      e = e['get' + b]();
      if (0 < c || e > -c) e += c;
      0 === e && -12 == c && (e = 12);
      return tb(e, a, d);
    };
  }
  function ub(b, a) {
    return function(c, d) {
      var e = c['get' + b](),
        f = ib(a ? 'SHORT' + b : b);
      return d[f][e];
    };
  }
  function Zc(b) {
    var a = new Date(b, 0, 1).getDay();
    return new Date(b, 0, (4 >= a ? 5 : 12) - a);
  }
  function $c(b) {
    return function(a) {
      var c = Zc(a.getFullYear());
      a = +new Date(a.getFullYear(), a.getMonth(), a.getDate() + (4 - a.getDay())) - +c;
      a = 1 + Math.round(a / 6048e5);
      return tb(a, b);
    };
  }
  function Uc(b) {
    function a(a) {
      var b;
      if ((b = a.match(c))) {
        a = new Date(0);
        var f = 0,
          g = 0,
          h = b[8] ? a.setUTCFullYear : a.setFullYear,
          n = b[8] ? a.setUTCHours : a.setHours;
        b[9] && ((f = Y(b[9] + b[10])), (g = Y(b[9] + b[11])));
        h.call(a, Y(b[1]), Y(b[2]) - 1, Y(b[3]));
        f = Y(b[4] || 0) - f;
        g = Y(b[5] || 0) - g;
        h = Y(b[6] || 0);
        b = Math.round(1e3 * parseFloat('0.' + (b[7] || 0)));
        n.call(a, f, g, h, b);
      }
      return a;
    }
    var c = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    return function(c, e) {
      var f = '',
        g = [],
        h,
        n;
      e = e || 'mediumDate';
      e = b.DATETIME_FORMATS[e] || e;
      v(c) && (c = ff.test(c) ? Y(c) : a(c));
      Fa(c) && (c = new Date(c));
      if (!ra(c)) return c;
      for (; e; )
        (n = gf.exec(e)) ? ((g = g.concat(la.call(n, 1))), (e = g.pop())) : (g.push(e), (e = null));
      q(g, function(a) {
        h = hf[a];
        f += h ? h(c, b.DATETIME_FORMATS) : a.replace(/(^'|'$)/g, '').replace(/''/g, "'");
      });
      return f;
    };
  }
  function bf() {
    return function(b) {
      return sa(b, !0);
    };
  }
  function cf() {
    return function(b, a) {
      if (!L(b) && !v(b)) return b;
      a = Infinity === Math.abs(Number(a)) ? Number(a) : Y(a);
      if (v(b)) return a ? (0 <= a ? b.slice(0, a) : b.slice(a, b.length)) : '';
      var c = [],
        d,
        e;
      a > b.length ? (a = b.length) : a < -b.length && (a = -b.length);
      0 < a ? ((d = 0), (e = a)) : ((d = b.length + a), (e = b.length));
      for (; d < e; d++) c.push(b[d]);
      return c;
    };
  }
  function Wc(b) {
    return function(a, c, d) {
      function e(a, b) {
        return b
          ? function(b, c) {
              return a(c, b);
            }
          : a;
      }
      function f(a, b) {
        var c = typeof a,
          d = typeof b;
        return c == d
          ? ('string' == c && ((a = a.toLowerCase()), (b = b.toLowerCase())),
            a === b ? 0 : a < b ? -1 : 1)
          : c < d ? -1 : 1;
      }
      if (!L(a) || !c) return a;
      c = L(c) ? c : [c];
      c = md(c, function(a) {
        var c = !1,
          d = a || Ea;
        if (v(a)) {
          if ('+' == a.charAt(0) || '-' == a.charAt(0))
            (c = '-' == a.charAt(0)), (a = a.substring(1));
          d = b(a);
          if (d.constant) {
            var g = d();
            return e(function(a, b) {
              return f(a[g], b[g]);
            }, c);
          }
        }
        return e(function(a, b) {
          return f(d(a), d(b));
        }, c);
      });
      for (var g = [], h = 0; h < a.length; h++) g.push(a[h]);
      return g.sort(
        e(function(a, b) {
          for (var d = 0; d < c.length; d++) {
            var e = c[d](a, b);
            if (0 !== e) return e;
          }
          return 0;
        }, d)
      );
    };
  }
  function xa(b) {
    P(b) && (b = { link: b });
    b.restrict = b.restrict || 'AC';
    return da(b);
  }
  function ad(b, a, c, d) {
    function e(a, c) {
      c = c ? '-' + hb(c, '-') : '';
      d.removeClass(b, (a ? vb : wb) + c);
      d.addClass(b, (a ? wb : vb) + c);
    }
    var f = this,
      g = b.parent().controller('form') || xb,
      h = 0,
      n = (f.$error = {}),
      l = [];
    f.$name = a.name || a.ngForm;
    f.$dirty = !1;
    f.$pristine = !0;
    f.$valid = !0;
    f.$invalid = !1;
    g.$addControl(f);
    b.addClass(Na);
    e(!0);
    f.$commitViewValue = function() {
      q(l, function(a) {
        a.$commitViewValue();
      });
    };
    f.$addControl = function(a) {
      Ca(a.$name, 'input');
      l.push(a);
      a.$name && (f[a.$name] = a);
    };
    f.$removeControl = function(a) {
      a.$name && f[a.$name] === a && delete f[a.$name];
      q(n, function(b, c) {
        f.$setValidity(c, !0, a);
      });
      Ga(l, a);
    };
    f.$setValidity = function(a, b, c) {
      var d = n[a];
      if (b)
        d &&
          (Ga(d, c),
          d.length ||
            (h--,
            h || (e(b), (f.$valid = !0), (f.$invalid = !1)),
            (n[a] = !1),
            e(!0, a),
            g.$setValidity(a, !0, f)));
      else {
        h || e(b);
        if (d) {
          if (-1 != Pa(d, c)) return;
        } else (n[a] = d = []), h++, e(!1, a), g.$setValidity(a, !1, f);
        d.push(c);
        f.$valid = !1;
        f.$invalid = !0;
      }
    };
    f.$setDirty = function() {
      d.removeClass(b, Na);
      d.addClass(b, yb);
      f.$dirty = !0;
      f.$pristine = !1;
      g.$setDirty();
    };
    f.$setPristine = function() {
      d.removeClass(b, yb);
      d.addClass(b, Na);
      f.$dirty = !1;
      f.$pristine = !0;
      q(l, function(a) {
        a.$setPristine();
      });
    };
  }
  function Tb(b, a, c, d) {
    b.$setValidity(a, c);
    return c ? d : r;
  }
  function bd(b, a) {
    var c, d;
    if (a) for (c = 0; c < a.length; ++c) if (((d = a[c]), b[d])) return !0;
    return !1;
  }
  function jf(b, a, c, d, e) {
    S(e) &&
      ((b.$$hasNativeValidators = !0),
      b.$parsers.push(function(f) {
        if (b.$error[a] || bd(e, d) || !bd(e, c)) return f;
        b.$setValidity(a, !1);
      }));
  }
  function ab(b, a, c, d, e, f) {
    var g = a.prop(kf),
      h = a[0].placeholder,
      n = {};
    d.$$validityState = g;
    if (!e.android) {
      var l = !1;
      a.on('compositionstart', function(a) {
        l = !0;
      });
      a.on('compositionend', function() {
        l = !1;
        m();
      });
    }
    var m = function(e) {
      if (!l) {
        var f = a.val(),
          k = e && e.type;
        if (W && 'input' === (e || n).type && a[0].placeholder !== h) h = a[0].placeholder;
        else {
          (c.ngTrim && 'false' === c.ngTrim) || (f = aa(f));
          var m = g && d.$$hasNativeValidators;
          if (d.$viewValue !== f || ('' === f && m))
            b.$$phase
              ? d.$setViewValue(f, k, m)
              : b.$apply(function() {
                  d.$setViewValue(f, k, m);
                });
        }
      }
    };
    if (e.hasEvent('input')) a.on('input', m);
    else {
      var p,
        k = function(a) {
          p ||
            (p = f.defer(function() {
              m(a);
              p = null;
            }));
        };
      a.on('keydown', function(a) {
        var b = a.keyCode;
        91 === b || ((15 < b && 19 > b) || (37 <= b && 40 >= b)) || k(a);
      });
      if (e.hasEvent('paste')) a.on('paste cut', k);
    }
    a.on('change', m);
    d.$render = function() {
      a.val(d.$isEmpty(d.$viewValue) ? '' : d.$viewValue);
    };
  }
  function zb(b, a) {
    return function(c) {
      var d;
      return ra(c)
        ? c
        : v(c) && ((b.lastIndex = 0), (c = b.exec(c)))
          ? (c.shift(),
            (d = { yyyy: 0, MM: 1, dd: 1, HH: 0, mm: 0 }),
            q(c, function(b, c) {
              c < a.length && (d[a[c]] = +b);
            }),
            new Date(d.yyyy, d.MM - 1, d.dd, d.HH, d.mm))
          : NaN;
    };
  }
  function bb(b, a, c, d) {
    return function(e, f, g, h, n, l, m) {
      ab(e, f, g, h, n, l);
      h.$parsers.push(function(d) {
        if (h.$isEmpty(d)) return h.$setValidity(b, !0), null;
        if (a.test(d)) return h.$setValidity(b, !0), c(d);
        h.$setValidity(b, !1);
        return r;
      });
      h.$formatters.push(function(a) {
        return ra(a) ? m('date')(a, d) : '';
      });
      g.min &&
        ((e = function(a) {
          var b = h.$isEmpty(a) || c(a) >= c(g.min);
          h.$setValidity('min', b);
          return b ? a : r;
        }),
        h.$parsers.push(e),
        h.$formatters.push(e));
      g.max &&
        ((e = function(a) {
          var b = h.$isEmpty(a) || c(a) <= c(g.max);
          h.$setValidity('max', b);
          return b ? a : r;
        }),
        h.$parsers.push(e),
        h.$formatters.push(e));
    };
  }
  function Ub(b, a) {
    b = 'ngClass' + b;
    return [
      '$animate',
      function(c) {
        function d(a, b) {
          var c = [],
            d = 0;
          a: for (; d < a.length; d++) {
            for (var e = a[d], m = 0; m < b.length; m++) if (e == b[m]) continue a;
            c.push(e);
          }
          return c;
        }
        function e(a) {
          if (!L(a)) {
            if (v(a)) return a.split(' ');
            if (S(a)) {
              var b = [];
              q(a, function(a, c) {
                a && (b = b.concat(c.split(' ')));
              });
              return b;
            }
          }
          return a;
        }
        return {
          restrict: 'AC',
          link: function(f, g, h) {
            function n(a, b) {
              var c = g.data('$classCounts') || {},
                d = [];
              q(a, function(a) {
                if (0 < b || c[a]) (c[a] = (c[a] || 0) + b), c[a] === +(0 < b) && d.push(a);
              });
              g.data('$classCounts', c);
              return d.join(' ');
            }
            function l(b) {
              if (!0 === a || f.$index % 2 === a) {
                var k = e(b || []);
                if (!m) {
                  var l = n(k, 1);
                  h.$addClass(l);
                } else if (!Aa(b, m)) {
                  var q = e(m),
                    l = d(k, q),
                    k = d(q, k),
                    k = n(k, -1),
                    l = n(l, 1);
                  0 === l.length
                    ? c.removeClass(g, k)
                    : 0 === k.length ? c.addClass(g, l) : c.setClass(g, l, k);
                }
              }
              m = ka(b);
            }
            var m;
            f.$watch(h[b], l, !0);
            h.$observe('class', function(a) {
              l(f.$eval(h[b]));
            });
            'ngClass' !== b &&
              f.$watch('$index', function(c, d) {
                var g = c & 1;
                if (g !== (d & 1)) {
                  var l = e(f.$eval(h[b]));
                  g === a ? ((g = n(l, 1)), h.$addClass(g)) : ((g = n(l, -1)), h.$removeClass(g));
                }
              });
          }
        };
      }
    ];
  }
  var lf = /^\/(.+)\/([a-z]*)$/,
    kf = 'validity',
    K = function(b) {
      return v(b) ? b.toLowerCase() : b;
    },
    Qc = Object.prototype.hasOwnProperty,
    ib = function(b) {
      return v(b) ? b.toUpperCase() : b;
    },
    W,
    D,
    ta,
    la = [].slice,
    sc = [].push,
    ya = Object.prototype.toString,
    Qa = G('ng'),
    Ra = M.angular || (M.angular = {}),
    Ta,
    na,
    eb = 0;
  W = Y((/msie (\d+)/.exec(K(navigator.userAgent)) || [])[1]);
  isNaN(W) && (W = Y((/trident\/.*; rv:(\d+)/.exec(K(navigator.userAgent)) || [])[1]));
  A.$inject = [];
  Ea.$inject = [];
  var L = (function() {
      return P(Array.isArray)
        ? Array.isArray
        : function(b) {
            return '[object Array]' === ya.call(b);
          };
    })(),
    aa = (function() {
      return String.prototype.trim
        ? function(b) {
            return v(b) ? b.trim() : b;
          }
        : function(b) {
            return v(b) ? b.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : b;
          };
    })();
  na =
    9 > W
      ? function(b) {
          b = b.nodeName ? b : b[0];
          return K(
            b.scopeName && 'HTML' != b.scopeName ? b.scopeName + ':' + b.nodeName : b.nodeName
          );
        }
      : function(b) {
          return K(b.nodeName ? b.nodeName : b[0].nodeName);
        };
  var dc = ['ng-', 'data-ng-', 'ng:', 'x-ng-'],
    qd = /[A-Z]/g,
    ud = { full: '1.3.0-beta.14', major: 1, minor: 3, dot: 0, codeName: 'harmonious-cacophonies' };
  Q.expando = 'ng339';
  var Wa = (Q.cache = {}),
    Ke = 1,
    qb = M.document.addEventListener
      ? function(b, a, c) {
          b.addEventListener(a, c, !1);
        }
      : function(b, a, c) {
          b.attachEvent('on' + a, c);
        },
    Va = M.document.removeEventListener
      ? function(b, a, c) {
          b.removeEventListener(a, c, !1);
        }
      : function(b, a, c) {
          b.detachEvent('on' + a, c);
        };
  Q._data = function(b) {
    return this.cache[b[this.expando]] || {};
  };
  var Ee = /([\:\-\_]+(.))/g,
    Fe = /^moz([A-Z])/,
    Gb = G('jqLite'),
    Je = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    Fb = /<|&#?\w+;/,
    He = /<([\w:]+)/,
    Ie = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    fa = {
      option: [1, '<select multiple="multiple">', '</select>'],
      thead: [1, '<table>', '</table>'],
      col: [2, '<table><colgroup>', '</colgroup></table>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      _default: [0, '', '']
    };
  fa.optgroup = fa.option;
  fa.tbody = fa.tfoot = fa.colgroup = fa.caption = fa.thead;
  fa.th = fa.td;
  var Ha = (Q.prototype = {
      ready: function(b) {
        function a() {
          c || ((c = !0), b());
        }
        var c = !1;
        'complete' === U.readyState
          ? setTimeout(a)
          : (this.on('DOMContentLoaded', a), Q(M).on('load', a));
      },
      toString: function() {
        var b = [];
        q(this, function(a) {
          b.push('' + a);
        });
        return '[' + b.join(', ') + ']';
      },
      eq: function(b) {
        return 0 <= b ? D(this[b]) : D(this[this.length + b]);
      },
      length: 0,
      push: sc,
      sort: [].sort,
      splice: [].splice
    }),
    nb = {};
  q('multiple selected checked disabled readOnly required open'.split(' '), function(b) {
    nb[K(b)] = b;
  });
  var wc = {};
  q('input select option textarea button form details'.split(' '), function(b) {
    wc[b] = !0;
  });
  var xc = { ngMinlength: 'minlength', ngMaxlength: 'maxlength', ngPattern: 'pattern' };
  q(
    {
      data: rc,
      inheritedData: mb,
      scope: function(b) {
        return D(b).data('$scope') || mb(b.parentNode || b, ['$isolateScope', '$scope']);
      },
      isolateScope: function(b) {
        return D(b).data('$isolateScope') || D(b).data('$isolateScopeNoTemplate');
      },
      controller: tc,
      injector: function(b) {
        return mb(b, '$injector');
      },
      removeAttr: function(b, a) {
        b.removeAttribute(a);
      },
      hasClass: Ib,
      css: function(b, a, c) {
        a = Ua(a);
        if (E(c)) b.style[a] = c;
        else {
          var d;
          8 >= W && ((d = b.currentStyle && b.currentStyle[a]), '' === d && (d = 'auto'));
          d = d || b.style[a];
          8 >= W && (d = '' === d ? r : d);
          return d;
        }
      },
      attr: function(b, a, c) {
        var d = K(a);
        if (nb[d])
          if (E(c)) c ? ((b[a] = !0), b.setAttribute(a, d)) : ((b[a] = !1), b.removeAttribute(d));
          else return b[a] || (b.attributes.getNamedItem(a) || A).specified ? d : r;
        else if (E(c)) b.setAttribute(a, c);
        else if (b.getAttribute) return (b = b.getAttribute(a, 2)), null === b ? r : b;
      },
      prop: function(b, a, c) {
        if (E(c)) b[a] = c;
        else return b[a];
      },
      text: (function() {
        function b(a, b) {
          if (w(b)) {
            var d = a.nodeType;
            return 1 === d || 3 === d ? a.textContent : '';
          }
          a.textContent = b;
        }
        b.$dv = '';
        return b;
      })(),
      val: function(b, a) {
        if (w(a)) {
          if (b.multiple && 'select' === na(b)) {
            var c = [];
            q(b.options, function(a) {
              a.selected && c.push(a.value || a.text);
            });
            return 0 === c.length ? null : c;
          }
          return b.value;
        }
        b.value = a;
      },
      html: function(b, a) {
        if (w(a)) return b.innerHTML;
        for (var c = 0, d = b.childNodes; c < d.length; c++) Ia(d[c]);
        b.innerHTML = a;
      },
      empty: uc
    },
    function(b, a) {
      Q.prototype[a] = function(a, d) {
        var e,
          f,
          g = this.length;
        if (b !== uc && (2 == b.length && b !== Ib && b !== tc ? a : d) === r) {
          if (S(a)) {
            for (e = 0; e < g; e++)
              if (b === rc) b(this[e], a);
              else for (f in a) b(this[e], f, a[f]);
            return this;
          }
          e = b.$dv;
          g = e === r ? Math.min(g, 1) : g;
          for (f = 0; f < g; f++) {
            var h = b(this[f], a, d);
            e = e ? e + h : h;
          }
          return e;
        }
        for (e = 0; e < g; e++) b(this[e], a, d);
        return this;
      };
    }
  );
  q(
    {
      removeData: pc,
      dealoc: Ia,
      on: function a(c, d, e, f) {
        if (E(f)) throw Gb('onargs');
        if (!c.nodeType || 1 === c.nodeType || 9 === c.nodeType) {
          var g = ma(c, 'events'),
            h = ma(c, 'handle');
          g || ma(c, 'events', (g = {}));
          h || ma(c, 'handle', (h = Me(c, g)));
          q(d.split(' '), function(d) {
            var f = g[d];
            if (!f) {
              if ('mouseenter' == d || 'mouseleave' == d) {
                var m =
                  U.body.contains || U.body.compareDocumentPosition
                    ? function(a, c) {
                        var d = 9 === a.nodeType ? a.documentElement : a,
                          e = c && c.parentNode;
                        return (
                          a === e ||
                          !!(
                            e &&
                            1 === e.nodeType &&
                            (d.contains
                              ? d.contains(e)
                              : a.compareDocumentPosition && a.compareDocumentPosition(e) & 16)
                          )
                        );
                      }
                    : function(a, c) {
                        if (c) for (; (c = c.parentNode); ) if (c === a) return !0;
                        return !1;
                      };
                g[d] = [];
                a(c, { mouseleave: 'mouseout', mouseenter: 'mouseover' }[d], function(a) {
                  var c = a.relatedTarget;
                  (c && (c === this || m(this, c))) || h(a, d);
                });
              } else qb(c, d, h), (g[d] = []);
              f = g[d];
            }
            f.push(e);
          });
        }
      },
      off: qc,
      one: function(a, c, d) {
        a = D(a);
        a.on(c, function f() {
          a.off(c, d);
          a.off(c, f);
        });
        a.on(c, d);
      },
      replaceWith: function(a, c) {
        var d,
          e = a.parentNode;
        Ia(a);
        q(new Q(c), function(c) {
          d ? e.insertBefore(c, d.nextSibling) : e.replaceChild(c, a);
          d = c;
        });
      },
      children: function(a) {
        var c = [];
        q(a.childNodes, function(a) {
          1 === a.nodeType && c.push(a);
        });
        return c;
      },
      contents: function(a) {
        return a.contentDocument || a.childNodes || [];
      },
      append: function(a, c) {
        q(new Q(c), function(c) {
          (1 !== a.nodeType && 11 !== a.nodeType) || a.appendChild(c);
        });
      },
      prepend: function(a, c) {
        if (1 === a.nodeType) {
          var d = a.firstChild;
          q(new Q(c), function(c) {
            a.insertBefore(c, d);
          });
        }
      },
      wrap: function(a, c) {
        c = D(c)[0];
        var d = a.parentNode;
        d && d.replaceChild(c, a);
        c.appendChild(a);
      },
      remove: function(a) {
        Ia(a);
        var c = a.parentNode;
        c && c.removeChild(a);
      },
      after: function(a, c) {
        var d = a,
          e = a.parentNode;
        q(new Q(c), function(a) {
          e.insertBefore(a, d.nextSibling);
          d = a;
        });
      },
      addClass: lb,
      removeClass: kb,
      toggleClass: function(a, c, d) {
        c &&
          q(c.split(' '), function(c) {
            var f = d;
            w(f) && (f = !Ib(a, c));
            (f ? lb : kb)(a, c);
          });
      },
      parent: function(a) {
        return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
      },
      next: function(a) {
        if (a.nextElementSibling) return a.nextElementSibling;
        for (a = a.nextSibling; null != a && 1 !== a.nodeType; ) a = a.nextSibling;
        return a;
      },
      find: function(a, c) {
        return a.getElementsByTagName ? a.getElementsByTagName(c) : [];
      },
      clone: Hb,
      triggerHandler: function(a, c, d) {
        c = (ma(a, 'events') || {})[c];
        d = d || [];
        var e = [
          {
            preventDefault: function() {
              this.defaultPrevented = !0;
            },
            isDefaultPrevented: function() {
              return !0 === this.defaultPrevented;
            },
            stopPropagation: A
          }
        ];
        q(c, function(c) {
          c.apply(a, e.concat(d));
        });
      }
    },
    function(a, c) {
      Q.prototype[c] = function(c, e, f) {
        for (var g, h = 0; h < this.length; h++)
          w(g) ? ((g = a(this[h], c, e, f)), E(g) && (g = D(g))) : oc(g, a(this[h], c, e, f));
        return E(g) ? g : this;
      };
      Q.prototype.bind = Q.prototype.on;
      Q.prototype.unbind = Q.prototype.off;
    }
  );
  Xa.prototype = {
    put: function(a, c) {
      this[Ja(a, this.nextUid)] = c;
    },
    get: function(a) {
      return this[Ja(a, this.nextUid)];
    },
    remove: function(a) {
      var c = this[(a = Ja(a, this.nextUid))];
      delete this[a];
      return c;
    }
  };
  var zc = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    Oe = /,/,
    Pe = /^\s*(_?)(\S+?)\1\s*$/,
    yc = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm,
    Ka = G('$injector');
  Cb.$$annotate = Jb;
  var mf = G('$animate'),
    ge = [
      '$provide',
      function(a) {
        this.$$selectors = {};
        this.register = function(c, d) {
          var e = c + '-animation';
          if (c && '.' != c.charAt(0)) throw mf('notcsel', c);
          this.$$selectors[c.substr(1)] = e;
          a.factory(e, d);
        };
        this.classNameFilter = function(a) {
          1 === arguments.length && (this.$$classNameFilter = a instanceof RegExp ? a : null);
          return this.$$classNameFilter;
        };
        this.$get = [
          '$timeout',
          '$$asyncCallback',
          function(a, d) {
            return {
              enter: function(a, c, g, h) {
                g ? g.after(a) : c.prepend(a);
                h && d(h);
              },
              leave: function(a, c) {
                a.remove();
                c && d(c);
              },
              move: function(a, c, d, h) {
                this.enter(a, c, d, h);
              },
              addClass: function(a, c, g) {
                c = v(c) ? c : L(c) ? c.join(' ') : '';
                q(a, function(a) {
                  lb(a, c);
                });
                g && d(g);
              },
              removeClass: function(a, c, g) {
                c = v(c) ? c : L(c) ? c.join(' ') : '';
                q(a, function(a) {
                  kb(a, c);
                });
                g && d(g);
              },
              setClass: function(a, c, g, h) {
                q(a, function(a) {
                  lb(a, c);
                  kb(a, g);
                });
                h && d(h);
              },
              enabled: A
            };
          }
        ];
      }
    ],
    ia = G('$compile');
  gc.$inject = ['$provide', '$$sanitizeUriProvider'];
  var Ue = /^(x[\:\-_]|data[\:\-_])/i,
    Ic = G('$interpolate'),
    nf = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
    Xe = { http: 80, https: 443, ftp: 21 },
    Ob = G('$location');
  Qb.prototype = Pb.prototype = Lc.prototype = {
    $$html5: !1,
    $$replace: !1,
    absUrl: rb('$$absUrl'),
    url: function(a, c) {
      if (w(a)) return this.$$url;
      var d = nf.exec(a);
      d[1] && this.path(decodeURIComponent(d[1]));
      (d[2] || d[1]) && this.search(d[3] || '');
      this.hash(d[5] || '', c);
      return this;
    },
    protocol: rb('$$protocol'),
    host: rb('$$host'),
    port: rb('$$port'),
    path: Mc('$$path', function(a) {
      return '/' == a.charAt(0) ? a : '/' + a;
    }),
    search: function(a, c) {
      switch (arguments.length) {
        case 0:
          return this.$$search;
        case 1:
          if (v(a)) this.$$search = cc(a);
          else if (S(a)) this.$$search = a;
          else throw Ob('isrcharg');
          break;
        default:
          w(c) || null === c ? delete this.$$search[a] : (this.$$search[a] = c);
      }
      this.$$compose();
      return this;
    },
    hash: Mc('$$hash', Ea),
    replace: function() {
      this.$$replace = !0;
      return this;
    }
  };
  var ja = G('$parse'),
    of = Function.prototype.call,
    pf = Function.prototype.apply,
    qf = Function.prototype.bind,
    cb = {
      null: function() {
        return null;
      },
      true: function() {
        return !0;
      },
      false: function() {
        return !1;
      },
      undefined: A,
      '+': function(a, c, d, e) {
        d = d(a, c);
        e = e(a, c);
        return E(d) ? (E(e) ? d + e : d) : E(e) ? e : r;
      },
      '-': function(a, c, d, e) {
        d = d(a, c);
        e = e(a, c);
        return (E(d) ? d : 0) - (E(e) ? e : 0);
      },
      '*': function(a, c, d, e) {
        return d(a, c) * e(a, c);
      },
      '/': function(a, c, d, e) {
        return d(a, c) / e(a, c);
      },
      '%': function(a, c, d, e) {
        return d(a, c) % e(a, c);
      },
      '^': function(a, c, d, e) {
        return d(a, c) ^ e(a, c);
      },
      '=': A,
      '===': function(a, c, d, e) {
        return d(a, c) === e(a, c);
      },
      '!==': function(a, c, d, e) {
        return d(a, c) !== e(a, c);
      },
      '==': function(a, c, d, e) {
        return d(a, c) == e(a, c);
      },
      '!=': function(a, c, d, e) {
        return d(a, c) != e(a, c);
      },
      '<': function(a, c, d, e) {
        return d(a, c) < e(a, c);
      },
      '>': function(a, c, d, e) {
        return d(a, c) > e(a, c);
      },
      '<=': function(a, c, d, e) {
        return d(a, c) <= e(a, c);
      },
      '>=': function(a, c, d, e) {
        return d(a, c) >= e(a, c);
      },
      '&&': function(a, c, d, e) {
        return d(a, c) && e(a, c);
      },
      '||': function(a, c, d, e) {
        return d(a, c) || e(a, c);
      },
      '&': function(a, c, d, e) {
        return d(a, c) & e(a, c);
      },
      '|': function(a, c, d, e) {
        return e(a, c)(a, c, d(a, c));
      },
      '!': function(a, c, d) {
        return !d(a, c);
      }
    },
    rf = { n: '\n', f: '\f', r: '\r', t: '\t', v: '\v', "'": "'", '"': '"' },
    Sb = function(a) {
      this.options = a;
    };
  Sb.prototype = {
    constructor: Sb,
    lex: function(a) {
      this.text = a;
      this.index = 0;
      this.ch = r;
      for (this.tokens = []; this.index < this.text.length; )
        if (((this.ch = this.text.charAt(this.index)), this.is('"\''))) this.readString(this.ch);
        else if (this.isNumber(this.ch) || (this.is('.') && this.isNumber(this.peek())))
          this.readNumber();
        else if (this.isIdent(this.ch)) this.readIdent();
        else if (this.is('(){}[].,;:?'))
          this.tokens.push({ index: this.index, text: this.ch }), this.index++;
        else if (this.isWhitespace(this.ch)) this.index++;
        else {
          a = this.ch + this.peek();
          var c = a + this.peek(2),
            d = cb[this.ch],
            e = cb[a],
            f = cb[c];
          f
            ? (this.tokens.push({ index: this.index, text: c, fn: f }), (this.index += 3))
            : e
              ? (this.tokens.push({ index: this.index, text: a, fn: e }), (this.index += 2))
              : d
                ? (this.tokens.push({ index: this.index, text: this.ch, fn: d }), (this.index += 1))
                : this.throwError('Unexpected next character ', this.index, this.index + 1);
        }
      return this.tokens;
    },
    is: function(a) {
      return -1 !== a.indexOf(this.ch);
    },
    peek: function(a) {
      a = a || 1;
      return this.index + a < this.text.length ? this.text.charAt(this.index + a) : !1;
    },
    isNumber: function(a) {
      return '0' <= a && '9' >= a;
    },
    isWhitespace: function(a) {
      return ' ' === a || '\r' === a || '\t' === a || '\n' === a || '\v' === a || '\u00a0' === a;
    },
    isIdent: function(a) {
      return ('a' <= a && 'z' >= a) || ('A' <= a && 'Z' >= a) || '_' === a || '$' === a;
    },
    isExpOperator: function(a) {
      return '-' === a || '+' === a || this.isNumber(a);
    },
    throwError: function(a, c, d) {
      d = d || this.index;
      c = E(c) ? 's ' + c + '-' + this.index + ' [' + this.text.substring(c, d) + ']' : ' ' + d;
      throw ja('lexerr', a, c, this.text);
    },
    readNumber: function() {
      for (var a = '', c = this.index; this.index < this.text.length; ) {
        var d = K(this.text.charAt(this.index));
        if ('.' == d || this.isNumber(d)) a += d;
        else {
          var e = this.peek();
          if ('e' == d && this.isExpOperator(e)) a += d;
          else if (this.isExpOperator(d) && e && this.isNumber(e) && 'e' == a.charAt(a.length - 1))
            a += d;
          else if (
            !this.isExpOperator(d) ||
            (e && this.isNumber(e)) ||
            'e' != a.charAt(a.length - 1)
          )
            break;
          else this.throwError('Invalid exponent');
        }
        this.index++;
      }
      a *= 1;
      this.tokens.push({
        index: c,
        text: a,
        constant: !0,
        fn: function() {
          return a;
        }
      });
    },
    readIdent: function() {
      for (var a = this, c = '', d = this.index, e, f, g, h; this.index < this.text.length; ) {
        h = this.text.charAt(this.index);
        if ('.' === h || this.isIdent(h) || this.isNumber(h))
          '.' === h && (e = this.index), (c += h);
        else break;
        this.index++;
      }
      if (e)
        for (f = this.index; f < this.text.length; ) {
          h = this.text.charAt(f);
          if ('(' === h) {
            g = c.substr(e - d + 1);
            c = c.substr(0, e - d);
            this.index = f;
            break;
          }
          if (this.isWhitespace(h)) f++;
          else break;
        }
      d = { index: d, text: c };
      if (cb.hasOwnProperty(c)) (d.fn = cb[c]), (d.constant = !0);
      else {
        var n = Oc(c, this.options, this.text);
        d.fn = z(
          function(a, c) {
            return n(a, c);
          },
          {
            assign: function(d, e) {
              return sb(d, c, e, a.text);
            }
          }
        );
      }
      this.tokens.push(d);
      g && (this.tokens.push({ index: e, text: '.' }), this.tokens.push({ index: e + 1, text: g }));
    },
    readString: function(a) {
      var c = this.index;
      this.index++;
      for (var d = '', e = a, f = !1; this.index < this.text.length; ) {
        var g = this.text.charAt(this.index),
          e = e + g;
        if (f)
          'u' === g
            ? ((g = this.text.substring(this.index + 1, this.index + 5)),
              g.match(/[\da-f]{4}/i) || this.throwError('Invalid unicode escape [\\u' + g + ']'),
              (this.index += 4),
              (d += String.fromCharCode(parseInt(g, 16))))
            : (d = (f = rf[g]) ? d + f : d + g),
            (f = !1);
        else if ('\\' === g) f = !0;
        else {
          if (g === a) {
            this.index++;
            this.tokens.push({
              index: c,
              text: e,
              string: d,
              constant: !0,
              fn: function() {
                return d;
              }
            });
            return;
          }
          d += g;
        }
        this.index++;
      }
      this.throwError('Unterminated quote', c);
    }
  };
  var $a = function(a, c, d) {
    this.lexer = a;
    this.$filter = c;
    this.options = d;
  };
  $a.ZERO = z(
    function() {
      return 0;
    },
    { constant: !0 }
  );
  $a.prototype = {
    constructor: $a,
    parse: function(a) {
      this.text = a;
      this.tokens = this.lexer.lex(a);
      a = this.statements();
      0 !== this.tokens.length && this.throwError('is an unexpected token', this.tokens[0]);
      a.literal = !!a.literal;
      a.constant = !!a.constant;
      return a;
    },
    primary: function() {
      var a;
      if (this.expect('(')) (a = this.filterChain()), this.consume(')');
      else if (this.expect('[')) a = this.arrayDeclaration();
      else if (this.expect('{')) a = this.object();
      else {
        var c = this.expect();
        (a = c.fn) || this.throwError('not a primary expression', c);
        c.constant && ((a.constant = !0), (a.literal = !0));
      }
      for (var d; (c = this.expect('(', '[', '.')); )
        '(' === c.text
          ? ((a = this.functionCall(a, d)), (d = null))
          : '[' === c.text
            ? ((d = a), (a = this.objectIndex(a)))
            : '.' === c.text ? ((d = a), (a = this.fieldAccess(a))) : this.throwError('IMPOSSIBLE');
      return a;
    },
    throwError: function(a, c) {
      throw ja('syntax', c.text, a, c.index + 1, this.text, this.text.substring(c.index));
    },
    peekToken: function() {
      if (0 === this.tokens.length) throw ja('ueoe', this.text);
      return this.tokens[0];
    },
    peek: function(a, c, d, e) {
      if (0 < this.tokens.length) {
        var f = this.tokens[0],
          g = f.text;
        if (g === a || g === c || g === d || g === e || !(a || c || d || e)) return f;
      }
      return !1;
    },
    expect: function(a, c, d, e) {
      return (a = this.peek(a, c, d, e)) ? (this.tokens.shift(), a) : !1;
    },
    consume: function(a) {
      this.expect(a) || this.throwError('is unexpected, expecting [' + a + ']', this.peek());
    },
    unaryFn: function(a, c) {
      return z(
        function(d, e) {
          return a(d, e, c);
        },
        { constant: c.constant }
      );
    },
    ternaryFn: function(a, c, d) {
      return z(
        function(e, f) {
          return a(e, f) ? c(e, f) : d(e, f);
        },
        { constant: a.constant && c.constant && d.constant }
      );
    },
    binaryFn: function(a, c, d) {
      return z(
        function(e, f) {
          return c(e, f, a, d);
        },
        { constant: a.constant && d.constant }
      );
    },
    statements: function() {
      for (var a = []; ; )
        if (
          (0 < this.tokens.length && !this.peek('}', ')', ';', ']') && a.push(this.filterChain()),
          !this.expect(';'))
        )
          return 1 === a.length
            ? a[0]
            : function(c, d) {
                for (var e, f = 0; f < a.length; f++) {
                  var g = a[f];
                  g && (e = g(c, d));
                }
                return e;
              };
    },
    filterChain: function() {
      for (var a = this.expression(), c; ; )
        if ((c = this.expect('|'))) a = this.binaryFn(a, c.fn, this.filter());
        else return a;
    },
    filter: function() {
      for (var a = this.expect(), c = this.$filter(a.text), d = []; this.expect(':'); )
        d.push(this.expression());
      return da(function(a, f, g) {
        g = [g];
        for (var h = 0; h < d.length; h++) g.push(d[h](a, f));
        return c.apply(a, g);
      });
    },
    expression: function() {
      return this.assignment();
    },
    assignment: function() {
      var a = this.ternary(),
        c,
        d;
      return (d = this.expect('='))
        ? (a.assign ||
            this.throwError(
              'implies assignment but [' +
                this.text.substring(0, d.index) +
                '] can not be assigned to',
              d
            ),
          (c = this.ternary()),
          function(d, f) {
            return a.assign(d, c(d, f), f);
          })
        : a;
    },
    ternary: function() {
      var a = this.logicalOR(),
        c,
        d;
      if (this.expect('?')) {
        c = this.ternary();
        if ((d = this.expect(':'))) return this.ternaryFn(a, c, this.ternary());
        this.throwError('expected :', d);
      } else return a;
    },
    logicalOR: function() {
      for (var a = this.logicalAND(), c; ; )
        if ((c = this.expect('||'))) a = this.binaryFn(a, c.fn, this.logicalAND());
        else return a;
    },
    logicalAND: function() {
      var a = this.equality(),
        c;
      if ((c = this.expect('&&'))) a = this.binaryFn(a, c.fn, this.logicalAND());
      return a;
    },
    equality: function() {
      var a = this.relational(),
        c;
      if ((c = this.expect('==', '!=', '===', '!=='))) a = this.binaryFn(a, c.fn, this.equality());
      return a;
    },
    relational: function() {
      var a = this.additive(),
        c;
      if ((c = this.expect('<', '>', '<=', '>='))) a = this.binaryFn(a, c.fn, this.relational());
      return a;
    },
    additive: function() {
      for (var a = this.multiplicative(), c; (c = this.expect('+', '-')); )
        a = this.binaryFn(a, c.fn, this.multiplicative());
      return a;
    },
    multiplicative: function() {
      for (var a = this.unary(), c; (c = this.expect('*', '/', '%')); )
        a = this.binaryFn(a, c.fn, this.unary());
      return a;
    },
    unary: function() {
      var a;
      return this.expect('+')
        ? this.primary()
        : (a = this.expect('-'))
          ? this.binaryFn($a.ZERO, a.fn, this.unary())
          : (a = this.expect('!')) ? this.unaryFn(a.fn, this.unary()) : this.primary();
    },
    fieldAccess: function(a) {
      var c = this,
        d = this.expect().text,
        e = Oc(d, this.options, this.text);
      return z(
        function(c, d, h) {
          return e(h || a(c, d));
        },
        {
          assign: function(e, g, h) {
            return sb(a(e, h), d, g, c.text);
          }
        }
      );
    },
    objectIndex: function(a) {
      var c = this,
        d = this.expression();
      this.consume(']');
      return z(
        function(e, f) {
          var g = a(e, f),
            h = d(e, f);
          ea(h, c.text);
          return g ? Ma(g[h], c.text) : r;
        },
        {
          assign: function(e, f, g) {
            var h = d(e, g);
            return (Ma(a(e, g), c.text)[h] = f);
          }
        }
      );
    },
    functionCall: function(a, c) {
      var d = [];
      if (')' !== this.peekToken().text) {
        do d.push(this.expression());
        while (this.expect(','));
      }
      this.consume(')');
      var e = this;
      return function(f, g) {
        for (var h = [], n = c ? c(f, g) : f, l = 0; l < d.length; l++) h.push(d[l](f, g));
        l = a(f, g, n) || A;
        Ma(n, e.text);
        var m = e.text;
        if (l) {
          if (l.constructor === l) throw ja('isecfn', m);
          if (l === of || l === pf || l === qf) throw ja('isecff', m);
        }
        h = l.apply ? l.apply(n, h) : l(h[0], h[1], h[2], h[3], h[4]);
        return Ma(h, e.text);
      };
    },
    arrayDeclaration: function() {
      var a = [],
        c = !0;
      if (']' !== this.peekToken().text) {
        do {
          if (this.peek(']')) break;
          var d = this.expression();
          a.push(d);
          d.constant || (c = !1);
        } while (this.expect(','));
      }
      this.consume(']');
      return z(
        function(c, d) {
          for (var g = [], h = 0; h < a.length; h++) g.push(a[h](c, d));
          return g;
        },
        { literal: !0, constant: c }
      );
    },
    object: function() {
      var a = [],
        c = !0;
      if ('}' !== this.peekToken().text) {
        do {
          if (this.peek('}')) break;
          var d = this.expect(),
            d = d.string || d.text;
          this.consume(':');
          var e = this.expression();
          a.push({ key: d, value: e });
          e.constant || (c = !1);
        } while (this.expect(','));
      }
      this.consume('}');
      return z(
        function(c, d) {
          for (var e = {}, n = 0; n < a.length; n++) {
            var l = a[n];
            e[l.key] = l.value(c, d);
          }
          return e;
        },
        { literal: !0, constant: c }
      );
    }
  };
  var Rb = {},
    wa = G('$sce'),
    ga = { HTML: 'html', CSS: 'css', URL: 'url', RESOURCE_URL: 'resourceUrl', JS: 'js' },
    ba = U.createElement('a'),
    Sc = va(M.location.href, !0);
  nc.$inject = ['$provide'];
  Tc.$inject = ['$locale'];
  Vc.$inject = ['$locale'];
  var Yc = '.',
    hf = {
      yyyy: ca('FullYear', 4),
      yy: ca('FullYear', 2, 0, !0),
      y: ca('FullYear', 1),
      MMMM: ub('Month'),
      MMM: ub('Month', !0),
      MM: ca('Month', 2, 1),
      M: ca('Month', 1, 1),
      dd: ca('Date', 2),
      d: ca('Date', 1),
      HH: ca('Hours', 2),
      H: ca('Hours', 1),
      hh: ca('Hours', 2, -12),
      h: ca('Hours', 1, -12),
      mm: ca('Minutes', 2),
      m: ca('Minutes', 1),
      ss: ca('Seconds', 2),
      s: ca('Seconds', 1),
      sss: ca('Milliseconds', 3),
      EEEE: ub('Day'),
      EEE: ub('Day', !0),
      a: function(a, c) {
        return 12 > a.getHours() ? c.AMPMS[0] : c.AMPMS[1];
      },
      Z: function(a) {
        a = -1 * a.getTimezoneOffset();
        return (a =
          (0 <= a ? '+' : '') +
          (tb(Math[0 < a ? 'floor' : 'ceil'](a / 60), 2) + tb(Math.abs(a % 60), 2)));
      },
      ww: $c(2),
      w: $c(1)
    },
    gf = /((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,
    ff = /^\-?\d+$/;
  Uc.$inject = ['$locale'];
  var df = da(K),
    ef = da(ib);
  Wc.$inject = ['$parse'];
  var xd = da({
      restrict: 'E',
      compile: function(a, c) {
        8 >= W && (c.href || c.name || c.$set('href', ''), a.append(U.createComment('IE fix')));
        if (!c.href && !c.xlinkHref && !c.name)
          return function(a, c) {
            var f =
              '[object SVGAnimatedString]' === ya.call(c.prop('href')) ? 'xlink:href' : 'href';
            c.on('click', function(a) {
              c.attr(f) || a.preventDefault();
            });
          };
      }
    }),
    jb = {};
  q(nb, function(a, c) {
    if ('multiple' != a) {
      var d = pa('ng-' + c);
      jb[d] = function() {
        return {
          priority: 100,
          link: function(a, f, g) {
            a.$watch(g[d], function(a) {
              g.$set(c, !!a);
            });
          }
        };
      };
    }
  });
  q(xc, function(a, c) {
    jb[c] = function() {
      return {
        priority: 100,
        link: function(a, e, f) {
          if ('ngPattern' === c && '/' == f.ngPattern.charAt(0) && (e = f.ngPattern.match(lf))) {
            f.$set('ngPattern', RegExp(e[1], e[2]));
            return;
          }
          a.$watch(f[c], function(a) {
            f.$set(c, a);
          });
        }
      };
    };
  });
  q(['src', 'srcset', 'href'], function(a) {
    var c = pa('ng-' + a);
    jb[c] = function() {
      return {
        priority: 99,
        link: function(d, e, f) {
          var g = a,
            h = a;
          'href' === a &&
            '[object SVGAnimatedString]' === ya.call(e.prop('href')) &&
            ((h = 'xlinkHref'), (f.$attr[h] = 'xlink:href'), (g = null));
          f.$observe(c, function(a) {
            a && (f.$set(h, a), W && g && e.prop(g, f[h]));
          });
        }
      };
    };
  });
  var xb = { $addControl: A, $removeControl: A, $setValidity: A, $setDirty: A, $setPristine: A };
  ad.$inject = ['$element', '$attrs', '$scope', '$animate'];
  var cd = function(a) {
      return [
        '$timeout',
        function(c) {
          return {
            name: 'form',
            restrict: a ? 'EAC' : 'E',
            controller: ad,
            compile: function() {
              return {
                pre: function(a, e, f, g) {
                  if (!f.action) {
                    var h = function(c) {
                      a.$apply(function() {
                        g.$commitViewValue();
                      });
                      c.preventDefault ? c.preventDefault() : (c.returnValue = !1);
                    };
                    qb(e[0], 'submit', h);
                    e.on('$destroy', function() {
                      c(
                        function() {
                          Va(e[0], 'submit', h);
                        },
                        0,
                        !1
                      );
                    });
                  }
                  var n = e.parent().controller('form'),
                    l = f.name || f.ngForm;
                  l && sb(a, l, g, l);
                  if (n)
                    e.on('$destroy', function() {
                      n.$removeControl(g);
                      l && sb(a, l, r, l);
                      z(g, xb);
                    });
                }
              };
            }
          };
        }
      ];
    },
    yd = cd(),
    Ld = cd(!0),
    sf = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    tf = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
    uf = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    dd = /^(\d{4})-(\d{2})-(\d{2})$/,
    ed = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/,
    Vb = /^(\d{4})-W(\d\d)$/,
    fd = /^(\d{4})-(\d\d)$/,
    gd = /^(\d\d):(\d\d)$/,
    vf = /(\s+|^)default(\s+|$)/,
    hd = {
      text: ab,
      date: bb('date', dd, zb(dd, ['yyyy', 'MM', 'dd']), 'yyyy-MM-dd'),
      'datetime-local': bb(
        'datetimelocal',
        ed,
        zb(ed, ['yyyy', 'MM', 'dd', 'HH', 'mm']),
        'yyyy-MM-ddTHH:mm'
      ),
      time: bb('time', gd, zb(gd, ['HH', 'mm']), 'HH:mm'),
      week: bb(
        'week',
        Vb,
        function(a) {
          if (ra(a)) return a;
          if (v(a)) {
            Vb.lastIndex = 0;
            var c = Vb.exec(a);
            if (c) {
              a = +c[1];
              var d = +c[2],
                c = Zc(a),
                d = 7 * (d - 1);
              return new Date(a, 0, c.getDate() + d);
            }
          }
          return NaN;
        },
        'yyyy-Www'
      ),
      month: bb('month', fd, zb(fd, ['yyyy', 'MM']), 'yyyy-MM'),
      number: function(a, c, d, e, f, g) {
        ab(a, c, d, e, f, g);
        e.$parsers.push(function(a) {
          var c = e.$isEmpty(a);
          if (c || uf.test(a))
            return e.$setValidity('number', !0), '' === a ? null : c ? a : parseFloat(a);
          e.$setValidity('number', !1);
          return r;
        });
        jf(e, 'number', wf, null, e.$$validityState);
        e.$formatters.push(function(a) {
          return e.$isEmpty(a) ? '' : '' + a;
        });
        d.min &&
          ((a = function(a) {
            var c = parseFloat(d.min);
            return Tb(e, 'min', e.$isEmpty(a) || a >= c, a);
          }),
          e.$parsers.push(a),
          e.$formatters.push(a));
        d.max &&
          ((a = function(a) {
            var c = parseFloat(d.max);
            return Tb(e, 'max', e.$isEmpty(a) || a <= c, a);
          }),
          e.$parsers.push(a),
          e.$formatters.push(a));
        e.$formatters.push(function(a) {
          return Tb(e, 'number', e.$isEmpty(a) || Fa(a), a);
        });
      },
      url: function(a, c, d, e, f, g) {
        ab(a, c, d, e, f, g);
        e.$validators.url = function(a, c) {
          var d = a || c;
          return e.$isEmpty(d) || sf.test(d);
        };
      },
      email: function(a, c, d, e, f, g) {
        ab(a, c, d, e, f, g);
        e.$validators.email = function(a, c) {
          var d = a || c;
          return e.$isEmpty(d) || tf.test(d);
        };
      },
      radio: function(a, c, d, e) {
        w(d.name) && c.attr('name', ++eb);
        c.on('click', function(f) {
          c[0].checked &&
            a.$apply(function() {
              e.$setViewValue(d.value, f && f.type);
            });
        });
        e.$render = function() {
          c[0].checked = d.value == e.$viewValue;
        };
        d.$observe('value', e.$render);
      },
      checkbox: function(a, c, d, e) {
        var f = d.ngTrueValue,
          g = d.ngFalseValue;
        v(f) || (f = !0);
        v(g) || (g = !1);
        c.on('click', function(d) {
          a.$apply(function() {
            e.$setViewValue(c[0].checked, d && d.type);
          });
        });
        e.$render = function() {
          c[0].checked = e.$viewValue;
        };
        e.$isEmpty = function(a) {
          return a !== f;
        };
        e.$formatters.push(function(a) {
          return a === f;
        });
        e.$parsers.push(function(a) {
          return a ? f : g;
        });
      },
      hidden: A,
      button: A,
      submit: A,
      reset: A,
      file: A
    },
    wf = ['badInput'],
    hc = [
      '$browser',
      '$sniffer',
      '$filter',
      function(a, c, d) {
        return {
          restrict: 'E',
          require: ['?ngModel'],
          link: function(e, f, g, h) {
            h[0] && (hd[K(g.type)] || hd.text)(e, f, g, h[0], c, a, d);
          }
        };
      }
    ],
    wb = 'ng-valid',
    vb = 'ng-invalid',
    Na = 'ng-pristine',
    yb = 'ng-dirty',
    xf = [
      '$scope',
      '$exceptionHandler',
      '$attrs',
      '$element',
      '$parse',
      '$animate',
      '$timeout',
      function(a, c, d, e, f, g, h) {
        function n(a, c) {
          c = c ? '-' + hb(c, '-') : '';
          g.removeClass(e, (a ? vb : wb) + c);
          g.addClass(e, (a ? wb : vb) + c);
        }
        this.$modelValue = this.$viewValue = Number.NaN;
        this.$validators = {};
        this.$parsers = [];
        this.$formatters = [];
        this.$viewChangeListeners = [];
        this.$untouched = !0;
        this.$touched = !1;
        this.$pristine = !0;
        this.$dirty = !1;
        this.$valid = !0;
        this.$invalid = !1;
        this.$name = d.name;
        var l = f(d.ngModel),
          m = l.assign,
          p = null,
          k = this;
        if (!m) throw G('ngModel')('nonassign', d.ngModel, ha(e));
        this.$render = A;
        this.$isEmpty = function(a) {
          return w(a) || '' === a || null === a || a !== a;
        };
        var t = e.inheritedData('$formController') || xb,
          s = 0,
          I = (this.$error = {});
        e.addClass(Na).addClass('ng-untouched');
        n(!0);
        this.$setValidity = function(a, c) {
          I[a] !== !c &&
            (c
              ? (I[a] && s--, s || (n(!0), (k.$valid = !0), (k.$invalid = !1)))
              : (n(!1), (k.$invalid = !0), (k.$valid = !1), s++),
            (I[a] = !c),
            n(c, a),
            t.$setValidity(a, c, k));
        };
        this.$setPristine = function() {
          k.$dirty = !1;
          k.$pristine = !0;
          g.removeClass(e, yb);
          g.addClass(e, Na);
        };
        this.$setUntouched = function() {
          k.$touched = !1;
          k.$untouched = !0;
          g.setClass(e, 'ng-untouched', 'ng-touched');
        };
        this.$setTouched = function() {
          k.$touched = !0;
          k.$untouched = !1;
          g.setClass(e, 'ng-touched', 'ng-untouched');
        };
        this.$rollbackViewValue = function() {
          h.cancel(p);
          k.$viewValue = k.$$lastCommittedViewValue;
          k.$render();
        };
        this.$validate = function() {
          this.$$runValidators(k.$modelValue, k.$viewValue);
        };
        this.$$runValidators = function(a, c) {
          q(k.$validators, function(d, e) {
            k.$setValidity(e, d(a, c));
          });
        };
        this.$commitViewValue = function(d) {
          var f = k.$viewValue;
          h.cancel(p);
          if (d || k.$$lastCommittedViewValue !== f) {
            k.$$lastCommittedViewValue = f;
            k.$pristine &&
              ((k.$dirty = !0),
              (k.$pristine = !1),
              g.removeClass(e, Na),
              g.addClass(e, yb),
              t.$setDirty());
            var l = f;
            q(k.$parsers, function(a) {
              l = a(l);
            });
            k.$modelValue === l ||
              (!w(k.$$invalidModelValue) && k.$$invalidModelValue == l) ||
              (k.$$runValidators(l, f),
              (k.$modelValue = k.$valid ? l : r),
              (k.$$invalidModelValue = k.$valid ? r : l),
              m(a, k.$modelValue),
              q(k.$viewChangeListeners, function(a) {
                try {
                  a();
                } catch (d) {
                  c(d);
                }
              }));
          }
        };
        this.$setViewValue = function(a, c, d) {
          k.$viewValue = a;
          (k.$options && !k.$options.updateOnDefault) || k.$$debounceViewValueCommit(c, d);
        };
        this.$$debounceViewValueCommit = function(a, c) {
          var d = 0,
            e = k.$options;
          e &&
            E(e.debounce) &&
            ((e = e.debounce),
            Fa(e) ? (d = e) : Fa(e[a]) ? (d = e[a]) : Fa(e['default']) && (d = e['default']));
          h.cancel(p);
          d
            ? (p = h(function() {
                k.$commitViewValue(c);
              }, d))
            : k.$commitViewValue(c);
        };
        a.$watch(function() {
          var c = l(a);
          if (k.$modelValue !== c && (w(k.$$invalidModelValue) || k.$$invalidModelValue != c)) {
            for (var d = k.$formatters, e = d.length, f = c; e--; ) f = d[e](f);
            k.$$runValidators(c, f);
            k.$modelValue = k.$valid ? c : r;
            k.$$invalidModelValue = k.$valid ? r : c;
            k.$viewValue !== f && ((k.$viewValue = k.$$lastCommittedViewValue = f), k.$render());
          }
          return c;
        });
      }
    ],
    $d = function() {
      return {
        require: ['ngModel', '^?form', '^?ngModelOptions'],
        controller: xf,
        link: {
          pre: function(a, c, d, e) {
            e[2] && (e[0].$options = e[2].$options);
            var f = e[0],
              g = e[1] || xb;
            g.$addControl(f);
            a.$on('$destroy', function() {
              g.$removeControl(f);
            });
          },
          post: function(a, c, d, e) {
            var f = e[0];
            if (f.$options && f.$options.updateOn)
              c.on(f.$options.updateOn, function(c) {
                a.$apply(function() {
                  f.$$debounceViewValueCommit(c && c.type);
                });
              });
            c.on('blur', function(c) {
              a.$apply(function() {
                f.$setTouched();
              });
            });
          }
        }
      };
    },
    be = da({
      require: 'ngModel',
      link: function(a, c, d, e) {
        e.$viewChangeListeners.push(function() {
          a.$eval(d.ngChange);
        });
      }
    }),
    jc = function() {
      return {
        require: '?ngModel',
        link: function(a, c, d, e) {
          e &&
            ((d.required = !0),
            (e.$validators.required = function(a, c) {
              return !d.required || !e.$isEmpty(c);
            }),
            d.$observe('required', function() {
              e.$validate();
            }));
        }
      };
    },
    ic = function() {
      return {
        require: '?ngModel',
        link: function(a, c, d, e) {
          if (e) {
            var f,
              g = d.ngPattern || d.pattern;
            d.$observe('pattern', function(a) {
              v(a) && 0 < a.length && (a = RegExp(a));
              if (a && !a.test) throw G('ngPattern')('noregexp', g, a, ha(c));
              f = a || r;
              e.$validate();
            });
            e.$validators.pattern = function(a) {
              return e.$isEmpty(a) || w(f) || f.test(a);
            };
          }
        }
      };
    },
    lc = function() {
      return {
        require: '?ngModel',
        link: function(a, c, d, e) {
          if (e) {
            var f = 0;
            d.$observe('maxlength', function(a) {
              f = Y(a) || 0;
              e.$validate();
            });
            e.$validators.maxlength = function(a) {
              return e.$isEmpty(a) || a.length <= f;
            };
          }
        }
      };
    },
    kc = function() {
      return {
        require: '?ngModel',
        link: function(a, c, d, e) {
          if (e) {
            var f = 0;
            d.$observe('minlength', function(a) {
              f = Y(a) || 0;
              e.$validate();
            });
            e.$validators.minlength = function(a) {
              return e.$isEmpty(a) || a.length >= f;
            };
          }
        }
      };
    },
    ae = function() {
      return {
        require: 'ngModel',
        link: function(a, c, d, e) {
          var f = ((a = /\/(.*)\//.exec(d.ngList)) && RegExp(a[1])) || d.ngList || ',';
          e.$parsers.push(function(a) {
            if (!w(a)) {
              var c = [];
              a &&
                q(a.split(f), function(a) {
                  a && c.push(aa(a));
                });
              return c;
            }
          });
          e.$formatters.push(function(a) {
            return L(a) ? a.join(', ') : r;
          });
          e.$isEmpty = function(a) {
            return !a || !a.length;
          };
        }
      };
    },
    yf = /^(true|false|\d+)$/,
    ce = function() {
      return {
        priority: 100,
        compile: function(a, c) {
          return yf.test(c.ngValue)
            ? function(a, c, f) {
                f.$set('value', a.$eval(f.ngValue));
              }
            : function(a, c, f) {
                a.$watch(f.ngValue, function(a) {
                  f.$set('value', a);
                });
              };
        }
      };
    },
    de = function() {
      return {
        controller: [
          '$scope',
          '$attrs',
          function(a, c) {
            var d = this;
            this.$options = a.$eval(c.ngModelOptions);
            this.$options.updateOn !== r
              ? ((this.$options.updateOnDefault = !1),
                (this.$options.updateOn = aa(
                  this.$options.updateOn.replace(vf, function() {
                    d.$options.updateOnDefault = !0;
                    return ' ';
                  })
                )))
              : (this.$options.updateOnDefault = !0);
          }
        ]
      };
    },
    Dd = xa({
      compile: function(a) {
        a.addClass('ng-binding');
        return function(a, d, e) {
          d.data('$binding', e.ngBind);
          a.$watch(e.ngBind, function(a) {
            d.text(a == r ? '' : a);
          });
        };
      }
    }),
    Fd = [
      '$interpolate',
      function(a) {
        return function(c, d, e) {
          c = a(d.attr(e.$attr.ngBindTemplate));
          d.addClass('ng-binding').data('$binding', c);
          e.$observe('ngBindTemplate', function(a) {
            d.text(a);
          });
        };
      }
    ],
    Ed = [
      '$sce',
      '$parse',
      function(a, c) {
        return function(d, e, f) {
          function g() {
            var a = h(d);
            g.$$unwatch = h.$$unwatch;
            return (a || '').toString();
          }
          e.addClass('ng-binding').data('$binding', f.ngBindHtml);
          var h = c(f.ngBindHtml);
          d.$watch(g, function(c) {
            e.html(a.getTrustedHtml(h(d)) || '');
          });
        };
      }
    ],
    Gd = Ub('', !0),
    Id = Ub('Odd', 0),
    Hd = Ub('Even', 1),
    Jd = xa({
      compile: function(a, c) {
        c.$set('ngCloak', r);
        a.removeClass('ng-cloak');
      }
    }),
    Kd = [
      function() {
        return {
          scope: !0,
          controller: '@',
          priority: 500
        };
      }
    ],
    mc = {};
  q(
    'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(
      ' '
    ),
    function(a) {
      var c = pa('ng-' + a);
      mc[c] = [
        '$parse',
        function(d) {
          return {
            compile: function(e, f) {
              var g = d(f[c]);
              return function(c, d) {
                d.on(K(a), function(a) {
                  c.$apply(function() {
                    g(c, { $event: a });
                  });
                });
              };
            }
          };
        }
      ];
    }
  );
  var Nd = [
      '$animate',
      function(a) {
        return {
          transclude: 'element',
          priority: 600,
          terminal: !0,
          restrict: 'A',
          $$tlb: !0,
          link: function(c, d, e, f, g) {
            var h, n, l;
            c.$watch(e.ngIf, function(c) {
              c
                ? n ||
                  g(function(c, f) {
                    n = f;
                    c[c.length++] = U.createComment(' end ngIf: ' + e.ngIf + ' ');
                    h = { clone: c };
                    a.enter(c, d.parent(), d);
                  })
                : (l && (l.remove(), (l = null)),
                  n && (n.$destroy(), (n = null)),
                  h &&
                    ((l = Eb(h.clone)),
                    a.leave(l, function() {
                      l = null;
                    }),
                    (h = null)));
            });
          }
        };
      }
    ],
    Od = [
      '$http',
      '$templateCache',
      '$anchorScroll',
      '$animate',
      '$sce',
      function(a, c, d, e, f) {
        return {
          restrict: 'ECA',
          priority: 400,
          terminal: !0,
          transclude: 'element',
          controller: Ra.noop,
          compile: function(g, h) {
            var n = h.ngInclude || h.src,
              l = h.onload || '',
              m = h.autoscroll;
            return function(g, h, q, s, I) {
              var y = 0,
                r,
                B,
                u,
                x = function() {
                  B && (B.remove(), (B = null));
                  r && (r.$destroy(), (r = null));
                  u &&
                    (e.leave(u, function() {
                      B = null;
                    }),
                    (B = u),
                    (u = null));
                };
              g.$watch(f.parseAsResourceUrl(n), function(f) {
                var n = function() {
                    !E(m) || (m && !g.$eval(m)) || d();
                  },
                  q = ++y;
                f
                  ? (a
                      .get(f, { cache: c })
                      .success(function(a) {
                        if (q === y) {
                          var c = g.$new();
                          s.template = a;
                          a = I(c, function(a) {
                            x();
                            e.enter(a, null, h, n);
                          });
                          r = c;
                          u = a;
                          r.$emit('$includeContentLoaded');
                          g.$eval(l);
                        }
                      })
                      .error(function() {
                        q === y && (x(), g.$emit('$includeContentError'));
                      }),
                    g.$emit('$includeContentRequested'))
                  : (x(), (s.template = null));
              });
            };
          }
        };
      }
    ],
    ee = [
      '$compile',
      function(a) {
        return {
          restrict: 'ECA',
          priority: -400,
          require: 'ngInclude',
          link: function(c, d, e, f) {
            d.html(f.template);
            a(d.contents())(c);
          }
        };
      }
    ],
    Pd = xa({
      priority: 450,
      compile: function() {
        return {
          pre: function(a, c, d) {
            a.$eval(d.ngInit);
          }
        };
      }
    }),
    Qd = xa({ terminal: !0, priority: 1e3 }),
    Rd = [
      '$locale',
      '$interpolate',
      function(a, c) {
        var d = /{}/g;
        return {
          restrict: 'EA',
          link: function(e, f, g) {
            var h = g.count,
              n = g.$attr.when && f.attr(g.$attr.when),
              l = g.offset || 0,
              m = e.$eval(n) || {},
              p = {},
              k = c.startSymbol(),
              t = c.endSymbol(),
              s = /^when(Minus)?(.+)$/;
            q(g, function(a, c) {
              s.test(c) && (m[K(c.replace('when', '').replace('Minus', '-'))] = f.attr(g.$attr[c]));
            });
            q(m, function(a, e) {
              p[e] = c(a.replace(d, k + h + '-' + l + t));
            });
            e.$watch(
              function() {
                var c = parseFloat(e.$eval(h));
                if (isNaN(c)) return '';
                c in m || (c = a.pluralCat(c - l));
                return p[c](e);
              },
              function(a) {
                f.text(a);
              }
            );
          }
        };
      }
    ],
    Sd = [
      '$parse',
      '$animate',
      function(a, c) {
        var d = G('ngRepeat');
        return {
          transclude: 'element',
          priority: 1e3,
          terminal: !0,
          $$tlb: !0,
          link: function(e, f, g, h, n) {
            var l = g.ngRepeat,
              m = l.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
              p,
              k,
              t,
              s,
              r,
              y,
              F = { $id: Ja };
            if (!m) throw d('iexp', l);
            g = m[1];
            h = m[2];
            (m = m[3])
              ? ((p = a(m)),
                (k = function(a, c, d) {
                  y && (F[y] = a);
                  F[r] = c;
                  F.$index = d;
                  return p(e, F);
                }))
              : ((t = function(a, c) {
                  return Ja(c);
                }),
                (s = function(a) {
                  return a;
                }));
            m = g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
            if (!m) throw d('iidexp', g);
            r = m[3] || m[1];
            y = m[2];
            var B = {};
            e.$watchCollection(h, function(a) {
              var e,
                g,
                h = f[0],
                m,
                p = {},
                F,
                C,
                E,
                J,
                v,
                z,
                w,
                A = [],
                R = function(a, c) {
                  a[r] = E;
                  y && (a[y] = C);
                  a.$index = c;
                  a.$first = 0 === c;
                  a.$last = c === F - 1;
                  a.$middle = !(a.$first || a.$last);
                  a.$odd = !(a.$even = 0 === (c & 1));
                };
              if (db(a)) (z = a), (v = k || t);
              else {
                v = k || s;
                z = [];
                for (g in a) a.hasOwnProperty(g) && '$' != g.charAt(0) && z.push(g);
                z.sort();
              }
              F = z.length;
              g = A.length = z.length;
              for (e = 0; e < g; e++)
                if (
                  ((C = a === z ? e : z[e]),
                  (E = a[C]),
                  (J = v(C, E, e)),
                  Ca(J, '`track by` id'),
                  B.hasOwnProperty(J))
                )
                  (w = B[J]), delete B[J], (p[J] = w), (A[e] = w);
                else {
                  if (p.hasOwnProperty(J))
                    throw (q(A, function(a) {
                      a && a.scope && (B[a.id] = a);
                    }),
                    d('dupes', l, J));
                  A[e] = { id: J };
                  p[J] = !1;
                }
              for (m in B)
                B.hasOwnProperty(m) &&
                  ((w = B[m]),
                  (g = Eb(w.clone)),
                  c.leave(g),
                  q(g, function(a) {
                    a.$$NG_REMOVED = !0;
                  }),
                  w.scope.$destroy());
              e = 0;
              for (g = z.length; e < g; e++)
                if (
                  ((C = a === z ? e : z[e]),
                  (E = a[C]),
                  (w = A[e]),
                  A[e - 1] && (h = A[e - 1].clone[A[e - 1].clone.length - 1]),
                  w.scope)
                ) {
                  m = h;
                  do m = m.nextSibling;
                  while (m && m.$$NG_REMOVED);
                  w.clone[0] != m && c.move(Eb(w.clone), null, D(h));
                  h = w.clone[w.clone.length - 1];
                  R(w.scope, e);
                } else
                  n(function(a, d) {
                    w.scope = d;
                    a[a.length++] = U.createComment(' end ngRepeat: ' + l + ' ');
                    c.enter(a, null, D(h));
                    h = a;
                    w.clone = a;
                    p[w.id] = w;
                    R(w.scope, e);
                  });
              B = p;
            });
          }
        };
      }
    ],
    Td = [
      '$animate',
      function(a) {
        return function(c, d, e) {
          c.$watch(e.ngShow, function(c) {
            a[c ? 'removeClass' : 'addClass'](d, 'ng-hide');
          });
        };
      }
    ],
    Md = [
      '$animate',
      function(a) {
        return function(c, d, e) {
          c.$watch(e.ngHide, function(c) {
            a[c ? 'addClass' : 'removeClass'](d, 'ng-hide');
          });
        };
      }
    ],
    Ud = xa(function(a, c, d) {
      a.$watch(
        d.ngStyle,
        function(a, d) {
          d &&
            a !== d &&
            q(d, function(a, d) {
              c.css(d, '');
            });
          a && c.css(a);
        },
        !0
      );
    }),
    Vd = [
      '$animate',
      function(a) {
        return {
          restrict: 'EA',
          require: 'ngSwitch',
          controller: [
            '$scope',
            function() {
              this.cases = {};
            }
          ],
          link: function(c, d, e, f) {
            var g = [],
              h = [],
              n = [],
              l = [];
            c.$watch(e.ngSwitch || e.on, function(d) {
              var p, k;
              p = 0;
              for (k = n.length; p < k; ++p) n[p].remove();
              p = n.length = 0;
              for (k = l.length; p < k; ++p) {
                var t = h[p];
                l[p].$destroy();
                n[p] = t;
                a.leave(t, function() {
                  n.splice(p, 1);
                });
              }
              h.length = 0;
              l.length = 0;
              if ((g = f.cases['!' + d] || f.cases['?']))
                c.$eval(e.change),
                  q(g, function(d) {
                    var e = c.$new();
                    l.push(e);
                    d.transclude(e, function(c) {
                      var e = d.element;
                      h.push(c);
                      a.enter(c, e.parent(), e);
                    });
                  });
            });
          }
        };
      }
    ],
    Wd = xa({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function(a, c, d, e, f) {
        e.cases['!' + d.ngSwitchWhen] = e.cases['!' + d.ngSwitchWhen] || [];
        e.cases['!' + d.ngSwitchWhen].push({ transclude: f, element: c });
      }
    }),
    Xd = xa({
      transclude: 'element',
      priority: 800,
      require: '^ngSwitch',
      link: function(a, c, d, e, f) {
        e.cases['?'] = e.cases['?'] || [];
        e.cases['?'].push({ transclude: f, element: c });
      }
    }),
    Zd = xa({
      link: function(a, c, d, e, f) {
        if (!f) throw G('ngTransclude')('orphan', ha(c));
        f(function(a) {
          c.empty();
          c.append(a);
        });
      }
    }),
    zd = [
      '$templateCache',
      function(a) {
        return {
          restrict: 'E',
          terminal: !0,
          compile: function(c, d) {
            'text/ng-template' == d.type && a.put(d.id, c[0].text);
          }
        };
      }
    ],
    zf = G('ngOptions'),
    Yd = da({ terminal: !0 }),
    Ad = [
      '$compile',
      '$parse',
      function(a, c) {
        var d = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
          e = { $setViewValue: A };
        return {
          restrict: 'E',
          require: ['select', '?ngModel'],
          controller: [
            '$element',
            '$scope',
            '$attrs',
            function(a, c, d) {
              var n = this,
                l = {},
                m = e,
                p;
              n.databound = d.ngModel;
              n.init = function(a, c, d) {
                m = a;
                p = d;
              };
              n.addOption = function(c) {
                Ca(c, '"option value"');
                l[c] = !0;
                m.$viewValue == c && (a.val(c), p.parent() && p.remove());
              };
              n.removeOption = function(a) {
                this.hasOption(a) &&
                  (delete l[a], m.$viewValue == a && this.renderUnknownOption(a));
              };
              n.renderUnknownOption = function(c) {
                c = '? ' + Ja(c) + ' ?';
                p.val(c);
                a.prepend(p);
                a.val(c);
                p.prop('selected', !0);
              };
              n.hasOption = function(a) {
                return l.hasOwnProperty(a);
              };
              c.$on('$destroy', function() {
                n.renderUnknownOption = A;
              });
            }
          ],
          link: function(e, g, h, n) {
            function l(a, c, d, e) {
              d.$render = function() {
                var a = d.$viewValue;
                e.hasOption(a)
                  ? (u.parent() && u.remove(), c.val(a), '' === a && y.prop('selected', !0))
                  : w(a) && y ? c.val('') : e.renderUnknownOption(a);
              };
              c.on('change', function() {
                a.$apply(function() {
                  u.parent() && u.remove();
                  d.$setViewValue(c.val());
                });
              });
            }
            function m(a, c, d) {
              var e;
              d.$render = function() {
                var a = new Xa(d.$viewValue);
                q(c.find('option'), function(c) {
                  c.selected = E(a.get(c.value));
                });
              };
              a.$watch(function() {
                Aa(e, d.$viewValue) || ((e = ka(d.$viewValue)), d.$render());
              });
              c.on('change', function() {
                a.$apply(function() {
                  var a = [];
                  q(c.find('option'), function(c) {
                    c.selected && a.push(c.value);
                  });
                  d.$setViewValue(a);
                });
              });
            }
            function p(e, f, g) {
              function h() {
                var a = { '': [] },
                  c = [''],
                  d,
                  k,
                  r,
                  s,
                  w;
                s = g.$modelValue;
                w = y(e) || [];
                var C = n ? Wb(w) : w,
                  D,
                  v,
                  A;
                v = {};
                r = !1;
                var G, K;
                if (t)
                  if (u && L(s))
                    for (r = new Xa([]), A = 0; A < s.length; A++)
                      (v[m] = s[A]), r.put(u(e, v), s[A]);
                  else r = new Xa(s);
                for (A = 0; (D = C.length), A < D; A++) {
                  k = A;
                  if (n) {
                    k = C[A];
                    if ('$' === k.charAt(0)) continue;
                    v[n] = k;
                  }
                  v[m] = w[k];
                  d = p(e, v) || '';
                  (k = a[d]) || ((k = a[d] = []), c.push(d));
                  t
                    ? (d = E(r.remove(u ? u(e, v) : q(e, v))))
                    : (u ? ((d = {}), (d[m] = s), (d = u(e, d) === u(e, v))) : (d = s === q(e, v)),
                      (r = r || d));
                  G = l(e, v);
                  G = E(G) ? G : '';
                  k.push({ id: u ? u(e, v) : n ? C[A] : A, label: G, selected: d });
                }
                t ||
                  (z || null === s
                    ? a[''].unshift({ id: '', label: '', selected: !r })
                    : r || a[''].unshift({ id: '?', label: '', selected: !0 }));
                v = 0;
                for (C = c.length; v < C; v++) {
                  d = c[v];
                  k = a[d];
                  x.length <= v
                    ? ((s = { element: B.clone().attr('label', d), label: k.label }),
                      (w = [s]),
                      x.push(w),
                      f.append(s.element))
                    : ((w = x[v]),
                      (s = w[0]),
                      s.label != d && s.element.attr('label', (s.label = d)));
                  G = null;
                  A = 0;
                  for (D = k.length; A < D; A++)
                    (r = k[A]),
                      (d = w[A + 1])
                        ? ((G = d.element),
                          d.label !== r.label && G.text((d.label = r.label)),
                          d.id !== r.id && G.val((d.id = r.id)),
                          d.selected !== r.selected &&
                            G.prop('selected', (d.selected = r.selected)))
                        : ('' === r.id && z
                            ? (K = z)
                            : (K = F.clone())
                                .val(r.id)
                                .prop('selected', r.selected)
                                .text(r.label),
                          w.push({ element: K, label: r.label, id: r.id, selected: r.selected }),
                          G ? G.after(K) : s.element.append(K),
                          (G = K));
                  for (A++; w.length > A; ) w.pop().element.remove();
                }
                for (; x.length > v; ) x.pop()[0].element.remove();
              }
              var k;
              if (!(k = s.match(d))) throw zf('iexp', s, ha(f));
              var l = c(k[2] || k[1]),
                m = k[4] || k[6],
                n = k[5],
                p = c(k[3] || ''),
                q = c(k[2] ? k[1] : m),
                y = c(k[7]),
                u = k[8] ? c(k[8]) : null,
                x = [[{ element: f, label: '' }]];
              z && (a(z)(e), z.removeClass('ng-scope'), z.remove());
              f.empty();
              f.on('change', function() {
                e.$apply(function() {
                  var a,
                    c = y(e) || [],
                    d = {},
                    h,
                    k,
                    l,
                    p,
                    s,
                    w,
                    v;
                  if (t)
                    for (k = [], p = 0, w = x.length; p < w; p++)
                      for (a = x[p], l = 1, s = a.length; l < s; l++) {
                        if ((h = a[l].element)[0].selected) {
                          h = h.val();
                          n && (d[n] = h);
                          if (u) for (v = 0; v < c.length && ((d[m] = c[v]), u(e, d) != h); v++);
                          else d[m] = c[h];
                          k.push(q(e, d));
                        }
                      }
                  else {
                    h = f.val();
                    if ('?' == h) k = r;
                    else if ('' === h) k = null;
                    else if (u)
                      for (v = 0; v < c.length; v++) {
                        if (((d[m] = c[v]), u(e, d) == h)) {
                          k = q(e, d);
                          break;
                        }
                      }
                    else (d[m] = c[h]), n && (d[n] = h), (k = q(e, d));
                    1 < x[0].length && x[0][1].id !== h && (x[0][1].selected = !1);
                  }
                  g.$setViewValue(k);
                });
              });
              g.$render = h;
              e.$watch(h);
            }
            if (n[1]) {
              var k = n[0];
              n = n[1];
              var t = h.multiple,
                s = h.ngOptions,
                z = !1,
                y,
                F = D(U.createElement('option')),
                B = D(U.createElement('optgroup')),
                u = F.clone();
              h = 0;
              for (var x = g.children(), v = x.length; h < v; h++)
                if ('' === x[h].value) {
                  y = z = x.eq(h);
                  break;
                }
              k.init(n, z, u);
              t &&
                (n.$isEmpty = function(a) {
                  return !a || 0 === a.length;
                });
              s ? p(e, g, n) : t ? m(e, g, n) : l(e, g, n, k);
            }
          }
        };
      }
    ],
    Cd = [
      '$interpolate',
      function(a) {
        var c = { addOption: A, removeOption: A };
        return {
          restrict: 'E',
          priority: 100,
          compile: function(d, e) {
            if (w(e.value)) {
              var f = a(d.text(), !0);
              f || e.$set('value', d.text());
            }
            return function(a, d, e) {
              var l = d.parent(),
                m = l.data('$selectController') || l.parent().data('$selectController');
              m && m.databound ? d.prop('selected', !1) : (m = c);
              f
                ? a.$watch(f, function(a, c) {
                    e.$set('value', a);
                    c !== a && m.removeOption(c);
                    m.addOption(a);
                  })
                : m.addOption(e.value);
              d.on('$destroy', function() {
                m.removeOption(e.value);
              });
            };
          }
        };
      }
    ],
    Bd = da({
      restrict: 'E',
      terminal: !1
    });
  M.angular.bootstrap
    ? console.log('WARNING: Tried to load angular more than once.')
    : (rd(),
      td(Ra),
      D(U).ready(function() {
        pd(U, ec);
      }));
})(window, document);
!window.angular.$$csp() &&
  window.angular
    .element(document)
    .find('head')
    .prepend(
      '<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-animate){display:none !important;}ng\\:form{display:block;}</style>'
    );
//# sourceMappingURL=angular.min.js.map

/**
 * Applied patch
 * https://github.com/eddhannay/react/commit/69324c8f3dfb868d9ba37757b86fe75598da7faf
 * to address this issue
 * https://github.com/facebook/react/issues/554
 */

/**
 * React v0.11.1
 *
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
!(function(e) {
  if ('object' == typeof exports && 'undefined' != typeof module) module.exports = e();
  else if ('function' == typeof define && define.amd) define([], e);
  else {
    var t;
    'undefined' != typeof window
      ? (t = window)
      : 'undefined' != typeof global ? (t = global) : 'undefined' != typeof self && (t = self),
      (t.React = e());
  }
})(function() {
  return (function e(t, n, r) {
    function o(a, s) {
      if (!n[a]) {
        if (!t[a]) {
          var u = 'function' == typeof require && require;
          if (!s && u) return u(a, !0);
          if (i) return i(a, !0);
          throw new Error("Cannot find module '" + a + "'");
        }
        var c = (n[a] = { exports: {} });
        t[a][0].call(
          c.exports,
          function(e) {
            var n = t[a][1][e];
            return o(n ? n : e);
          },
          c,
          c.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[a].exports;
    }
    for (var i = 'function' == typeof require && require, a = 0; a < r.length; a++) o(r[a]);
    return o;
  })(
    {
      1: [
        function(e, t) {
          'use strict';
          var n = e('./focusNode'),
            r = {
              componentDidMount: function() {
                this.props.autoFocus && n(this.getDOMNode());
              }
            };
          t.exports = r;
        },
        { './focusNode': 104 }
      ],
      2: [
        function(e, t) {
          'use strict';
          function n() {
            var e = window.opera;
            return (
              'object' == typeof e &&
              'function' == typeof e.version &&
              parseInt(e.version(), 10) <= 12
            );
          }
          function r(e) {
            return (e.ctrlKey || e.altKey || e.metaKey) && !(e.ctrlKey && e.altKey);
          }
          var o = e('./EventConstants'),
            i = e('./EventPropagators'),
            a = e('./ExecutionEnvironment'),
            s = e('./SyntheticInputEvent'),
            u = e('./keyOf'),
            c = a.canUseDOM && 'TextEvent' in window && !('documentMode' in document || n()),
            l = 32,
            p = String.fromCharCode(l),
            d = o.topLevelTypes,
            f = {
              beforeInput: {
                phasedRegistrationNames: {
                  bubbled: u({ onBeforeInput: null }),
                  captured: u({ onBeforeInputCapture: null })
                },
                dependencies: [d.topCompositionEnd, d.topKeyPress, d.topTextInput, d.topPaste]
              }
            },
            h = null,
            v = {
              eventTypes: f,
              extractEvents: function(e, t, n, o) {
                var a;
                if (c)
                  switch (e) {
                    case d.topKeyPress:
                      var u = o.which;
                      if (u !== l) return;
                      a = String.fromCharCode(u);
                      break;
                    case d.topTextInput:
                      if (((a = o.data), a === p)) return;
                      break;
                    default:
                      return;
                  }
                else {
                  switch (e) {
                    case d.topPaste:
                      h = null;
                      break;
                    case d.topKeyPress:
                      o.which && !r(o) && (h = String.fromCharCode(o.which));
                      break;
                    case d.topCompositionEnd:
                      h = o.data;
                  }
                  if (null === h) return;
                  a = h;
                }
                if (a) {
                  var v = s.getPooled(f.beforeInput, n, o);
                  return (v.data = a), (h = null), i.accumulateTwoPhaseDispatches(v), v;
                }
              }
            };
          t.exports = v;
        },
        {
          './EventConstants': 15,
          './EventPropagators': 20,
          './ExecutionEnvironment': 21,
          './SyntheticInputEvent': 84,
          './keyOf': 125
        }
      ],
      3: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            return e + t.charAt(0).toUpperCase() + t.substring(1);
          }
          var r = {
              columnCount: !0,
              fillOpacity: !0,
              flex: !0,
              flexGrow: !0,
              flexShrink: !0,
              fontWeight: !0,
              lineClamp: !0,
              lineHeight: !0,
              opacity: !0,
              order: !0,
              orphans: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0
            },
            o = ['Webkit', 'ms', 'Moz', 'O'];
          Object.keys(r).forEach(function(e) {
            o.forEach(function(t) {
              r[n(t, e)] = r[e];
            });
          });
          var i = {
              background: {
                backgroundImage: !0,
                backgroundPosition: !0,
                backgroundRepeat: !0,
                backgroundColor: !0
              },
              border: { borderWidth: !0, borderStyle: !0, borderColor: !0 },
              borderBottom: { borderBottomWidth: !0, borderBottomStyle: !0, borderBottomColor: !0 },
              borderLeft: { borderLeftWidth: !0, borderLeftStyle: !0, borderLeftColor: !0 },
              borderRight: { borderRightWidth: !0, borderRightStyle: !0, borderRightColor: !0 },
              borderTop: { borderTopWidth: !0, borderTopStyle: !0, borderTopColor: !0 },
              font: {
                fontStyle: !0,
                fontVariant: !0,
                fontWeight: !0,
                fontSize: !0,
                lineHeight: !0,
                fontFamily: !0
              }
            },
            a = { isUnitlessNumber: r, shorthandPropertyExpansions: i };
          t.exports = a;
        },
        {}
      ],
      4: [
        function(e, t) {
          'use strict';
          var n = e('./CSSProperty'),
            r = e('./dangerousStyleValue'),
            o = e('./hyphenateStyleName'),
            i = e('./memoizeStringOnly'),
            a = i(function(e) {
              return o(e);
            }),
            s = {
              createMarkupForStyles: function(e) {
                var t = '';
                for (var n in e)
                  if (e.hasOwnProperty(n)) {
                    var o = e[n];
                    null != o && ((t += a(n) + ':'), (t += r(n, o) + ';'));
                  }
                return t || null;
              },
              setValueForStyles: function(e, t) {
                var o = e.style;
                for (var i in t)
                  if (t.hasOwnProperty(i)) {
                    var a = r(i, t[i]);
                    if (a) o[i] = a;
                    else {
                      var s = n.shorthandPropertyExpansions[i];
                      if (s) for (var u in s) o[u] = '';
                      else o[i] = '';
                    }
                  }
              }
            };
          t.exports = s;
        },
        {
          './CSSProperty': 3,
          './dangerousStyleValue': 99,
          './hyphenateStyleName': 116,
          './memoizeStringOnly': 127
        }
      ],
      5: [
        function(e, t) {
          'use strict';
          function n() {
            (this._callbacks = null), (this._contexts = null);
          }
          var r = e('./PooledClass'),
            o = e('./invariant'),
            i = e('./mixInto');
          i(n, {
            enqueue: function(e, t) {
              (this._callbacks = this._callbacks || []),
                (this._contexts = this._contexts || []),
                this._callbacks.push(e),
                this._contexts.push(t);
            },
            notifyAll: function() {
              var e = this._callbacks,
                t = this._contexts;
              if (e) {
                o(e.length === t.length), (this._callbacks = null), (this._contexts = null);
                for (var n = 0, r = e.length; r > n; n++) e[n].call(t[n]);
                (e.length = 0), (t.length = 0);
              }
            },
            reset: function() {
              (this._callbacks = null), (this._contexts = null);
            },
            destructor: function() {
              this.reset();
            }
          }),
            r.addPoolingTo(n),
            (t.exports = n);
        },
        { './PooledClass': 26, './invariant': 118, './mixInto': 131 }
      ],
      6: [
        function(e, t) {
          'use strict';
          function n(e) {
            return 'SELECT' === e.nodeName || 'INPUT' === e.nodeName;
          }
          function r(e) {
            var t = M.getPooled(P.change, _, e);
            C.accumulateTwoPhaseDispatches(t), R.batchedUpdates(o, t);
          }
          function o(e) {
            y.enqueueEvents(e), y.processEventQueue();
          }
          function i(e, t) {
            (I = e), (_ = t), I.attachEvent('onchange', r);
          }
          function a() {
            I && (I.detachEvent('onchange', r), (I = null), (_ = null));
          }
          function s(e, t, n) {
            return e === O.topChange ? n : void 0;
          }
          function u(e, t, n) {
            e === O.topFocus ? (a(), i(t, n)) : e === O.topBlur && a();
          }
          function c(e, t) {
            (I = e),
              (_ = t),
              (T = e.value),
              (N = Object.getOwnPropertyDescriptor(e.constructor.prototype, 'value')),
              Object.defineProperty(I, 'value', A),
              I.attachEvent('onpropertychange', p);
          }
          function l() {
            I &&
              (delete I.value,
              I.detachEvent('onpropertychange', p),
              (I = null),
              (_ = null),
              (T = null),
              (N = null));
          }
          function p(e) {
            if ('value' === e.propertyName) {
              var t = e.srcElement.value;
              t !== T && ((T = t), r(e));
            }
          }
          function d(e, t, n) {
            return e === O.topInput ? n : void 0;
          }
          function f(e, t, n) {
            e === O.topFocus ? (l(), c(t, n)) : e === O.topBlur && l();
          }
          function h(e) {
            return (e !== O.topSelectionChange && e !== O.topKeyUp && e !== O.topKeyDown) ||
              !I ||
              I.value === T
              ? void 0
              : ((T = I.value), _);
          }
          function v(e) {
            return 'INPUT' === e.nodeName && ('checkbox' === e.type || 'radio' === e.type);
          }
          function m(e, t, n) {
            return e === O.topClick ? n : void 0;
          }
          var g = e('./EventConstants'),
            y = e('./EventPluginHub'),
            C = e('./EventPropagators'),
            E = e('./ExecutionEnvironment'),
            R = e('./ReactUpdates'),
            M = e('./SyntheticEvent'),
            D = e('./isEventSupported'),
            x = e('./isTextInputElement'),
            b = e('./keyOf'),
            O = g.topLevelTypes,
            P = {
              change: {
                phasedRegistrationNames: {
                  bubbled: b({ onChange: null }),
                  captured: b({ onChangeCapture: null })
                },
                dependencies: [
                  O.topBlur,
                  O.topChange,
                  O.topClick,
                  O.topFocus,
                  O.topInput,
                  O.topKeyDown,
                  O.topKeyUp,
                  O.topSelectionChange
                ]
              }
            },
            I = null,
            _ = null,
            T = null,
            N = null,
            w = !1;
          E.canUseDOM &&
            (w = D('change') && (!('documentMode' in document) || document.documentMode > 8));
          var S = !1;
          E.canUseDOM &&
            (S = D('input') && (!('documentMode' in document) || document.documentMode > 9));
          var A = {
              get: function() {
                return N.get.call(this);
              },
              set: function(e) {
                (T = '' + e), N.set.call(this, e);
              }
            },
            k = {
              eventTypes: P,
              extractEvents: function(e, t, r, o) {
                var i, a;
                if (
                  (n(t)
                    ? w ? (i = s) : (a = u)
                    : x(t) ? (S ? (i = d) : ((i = h), (a = f))) : v(t) && (i = m),
                  i)
                ) {
                  var c = i(e, t, r);
                  if (c) {
                    var l = M.getPooled(P.change, c, o);
                    return C.accumulateTwoPhaseDispatches(l), l;
                  }
                }
                a && a(e, t, r);
              }
            };
          t.exports = k;
        },
        {
          './EventConstants': 15,
          './EventPluginHub': 17,
          './EventPropagators': 20,
          './ExecutionEnvironment': 21,
          './ReactUpdates': 74,
          './SyntheticEvent': 82,
          './isEventSupported': 119,
          './isTextInputElement': 121,
          './keyOf': 125
        }
      ],
      7: [
        function(e, t) {
          'use strict';
          var n = 0,
            r = {
              createReactRootIndex: function() {
                return n++;
              }
            };
          t.exports = r;
        },
        {}
      ],
      8: [
        function(e, t) {
          'use strict';
          function n(e) {
            switch (e) {
              case g.topCompositionStart:
                return C.compositionStart;
              case g.topCompositionEnd:
                return C.compositionEnd;
              case g.topCompositionUpdate:
                return C.compositionUpdate;
            }
          }
          function r(e, t) {
            return e === g.topKeyDown && t.keyCode === h;
          }
          function o(e, t) {
            switch (e) {
              case g.topKeyUp:
                return -1 !== f.indexOf(t.keyCode);
              case g.topKeyDown:
                return t.keyCode !== h;
              case g.topKeyPress:
              case g.topMouseDown:
              case g.topBlur:
                return !0;
              default:
                return !1;
            }
          }
          function i(e) {
            (this.root = e),
              (this.startSelection = c.getSelection(e)),
              (this.startValue = this.getText());
          }
          var a = e('./EventConstants'),
            s = e('./EventPropagators'),
            u = e('./ExecutionEnvironment'),
            c = e('./ReactInputSelection'),
            l = e('./SyntheticCompositionEvent'),
            p = e('./getTextContentAccessor'),
            d = e('./keyOf'),
            f = [9, 13, 27, 32],
            h = 229,
            v = u.canUseDOM && 'CompositionEvent' in window,
            m =
              !v ||
              ('documentMode' in document &&
                document.documentMode > 8 &&
                document.documentMode <= 11),
            g = a.topLevelTypes,
            y = null,
            C = {
              compositionEnd: {
                phasedRegistrationNames: {
                  bubbled: d({ onCompositionEnd: null }),
                  captured: d({ onCompositionEndCapture: null })
                },
                dependencies: [
                  g.topBlur,
                  g.topCompositionEnd,
                  g.topKeyDown,
                  g.topKeyPress,
                  g.topKeyUp,
                  g.topMouseDown
                ]
              },
              compositionStart: {
                phasedRegistrationNames: {
                  bubbled: d({ onCompositionStart: null }),
                  captured: d({ onCompositionStartCapture: null })
                },
                dependencies: [
                  g.topBlur,
                  g.topCompositionStart,
                  g.topKeyDown,
                  g.topKeyPress,
                  g.topKeyUp,
                  g.topMouseDown
                ]
              },
              compositionUpdate: {
                phasedRegistrationNames: {
                  bubbled: d({ onCompositionUpdate: null }),
                  captured: d({ onCompositionUpdateCapture: null })
                },
                dependencies: [
                  g.topBlur,
                  g.topCompositionUpdate,
                  g.topKeyDown,
                  g.topKeyPress,
                  g.topKeyUp,
                  g.topMouseDown
                ]
              }
            };
          (i.prototype.getText = function() {
            return this.root.value || this.root[p()];
          }),
            (i.prototype.getData = function() {
              var e = this.getText(),
                t = this.startSelection.start,
                n = this.startValue.length - this.startSelection.end;
              return e.substr(t, e.length - n - t);
            });
          var E = {
            eventTypes: C,
            extractEvents: function(e, t, a, u) {
              var c, p;
              if (
                (v
                  ? (c = n(e))
                  : y ? o(e, u) && (c = C.compositionEnd) : r(e, u) && (c = C.compositionStart),
                m &&
                  (y || c !== C.compositionStart
                    ? c === C.compositionEnd && y && ((p = y.getData()), (y = null))
                    : (y = new i(t))),
                c)
              ) {
                var d = l.getPooled(c, a, u);
                return p && (d.data = p), s.accumulateTwoPhaseDispatches(d), d;
              }
            }
          };
          t.exports = E;
        },
        {
          './EventConstants': 15,
          './EventPropagators': 20,
          './ExecutionEnvironment': 21,
          './ReactInputSelection': 56,
          './SyntheticCompositionEvent': 80,
          './getTextContentAccessor': 113,
          './keyOf': 125
        }
      ],
      9: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            e.insertBefore(t, e.childNodes[n] || null);
          }
          var r,
            o = e('./Danger'),
            i = e('./ReactMultiChildUpdateTypes'),
            a = e('./getTextContentAccessor'),
            s = e('./invariant'),
            u = a();
          r =
            'textContent' === u
              ? function(e, t) {
                  e.textContent = t;
                }
              : function(e, t) {
                  for (; e.firstChild; ) e.removeChild(e.firstChild);
                  if (t) {
                    var n = e.ownerDocument || document;
                    e.appendChild(n.createTextNode(t));
                  }
                };
          var c = {
            dangerouslyReplaceNodeWithMarkup: o.dangerouslyReplaceNodeWithMarkup,
            updateTextContent: r,
            processUpdates: function(e, t) {
              for (var a, u = null, c = null, l = 0; (a = e[l]); l++)
                if (a.type === i.MOVE_EXISTING || a.type === i.REMOVE_NODE) {
                  var p = a.fromIndex,
                    d = a.parentNode.childNodes[p],
                    f = a.parentID;
                  s(d), (u = u || {}), (u[f] = u[f] || []), (u[f][p] = d), (c = c || []), c.push(d);
                }
              var h = o.dangerouslyRenderMarkup(t);
              if (c) for (var v = 0; v < c.length; v++) c[v].parentNode.removeChild(c[v]);
              for (var m = 0; (a = e[m]); m++)
                switch (a.type) {
                  case i.INSERT_MARKUP:
                    n(a.parentNode, h[a.markupIndex], a.toIndex);
                    break;
                  case i.MOVE_EXISTING:
                    n(a.parentNode, u[a.parentID][a.fromIndex], a.toIndex);
                    break;
                  case i.TEXT_CONTENT:
                    r(a.parentNode, a.textContent);
                    break;
                  case i.REMOVE_NODE:
                }
            }
          };
          t.exports = c;
        },
        {
          './Danger': 12,
          './ReactMultiChildUpdateTypes': 61,
          './getTextContentAccessor': 113,
          './invariant': 118
        }
      ],
      10: [
        function(e, t) {
          'use strict';
          var n = e('./invariant'),
            r = {
              MUST_USE_ATTRIBUTE: 1,
              MUST_USE_PROPERTY: 2,
              HAS_SIDE_EFFECTS: 4,
              HAS_BOOLEAN_VALUE: 8,
              HAS_NUMERIC_VALUE: 16,
              HAS_POSITIVE_NUMERIC_VALUE: 48,
              HAS_OVERLOADED_BOOLEAN_VALUE: 64,
              injectDOMPropertyConfig: function(e) {
                var t = e.Properties || {},
                  o = e.DOMAttributeNames || {},
                  a = e.DOMPropertyNames || {},
                  s = e.DOMMutationMethods || {};
                e.isCustomAttribute && i._isCustomAttributeFunctions.push(e.isCustomAttribute);
                for (var u in t) {
                  n(!i.isStandardName.hasOwnProperty(u)), (i.isStandardName[u] = !0);
                  var c = u.toLowerCase();
                  if (((i.getPossibleStandardName[c] = u), o.hasOwnProperty(u))) {
                    var l = o[u];
                    (i.getPossibleStandardName[l] = u), (i.getAttributeName[u] = l);
                  } else i.getAttributeName[u] = c;
                  (i.getPropertyName[u] = a.hasOwnProperty(u) ? a[u] : u),
                    (i.getMutationMethod[u] = s.hasOwnProperty(u) ? s[u] : null);
                  var p = t[u];
                  (i.mustUseAttribute[u] = p & r.MUST_USE_ATTRIBUTE),
                    (i.mustUseProperty[u] = p & r.MUST_USE_PROPERTY),
                    (i.hasSideEffects[u] = p & r.HAS_SIDE_EFFECTS),
                    (i.hasBooleanValue[u] = p & r.HAS_BOOLEAN_VALUE),
                    (i.hasNumericValue[u] = p & r.HAS_NUMERIC_VALUE),
                    (i.hasPositiveNumericValue[u] = p & r.HAS_POSITIVE_NUMERIC_VALUE),
                    (i.hasOverloadedBooleanValue[u] = p & r.HAS_OVERLOADED_BOOLEAN_VALUE),
                    n(!i.mustUseAttribute[u] || !i.mustUseProperty[u]),
                    n(i.mustUseProperty[u] || !i.hasSideEffects[u]),
                    n(
                      !!i.hasBooleanValue[u] +
                        !!i.hasNumericValue[u] +
                        !!i.hasOverloadedBooleanValue[u] <=
                        1
                    );
                }
              }
            },
            o = {},
            i = {
              ID_ATTRIBUTE_NAME: 'data-reactid',
              isStandardName: {},
              getPossibleStandardName: {},
              getAttributeName: {},
              getPropertyName: {},
              getMutationMethod: {},
              mustUseAttribute: {},
              mustUseProperty: {},
              hasSideEffects: {},
              hasBooleanValue: {},
              hasNumericValue: {},
              hasPositiveNumericValue: {},
              hasOverloadedBooleanValue: {},
              _isCustomAttributeFunctions: [],
              isCustomAttribute: function(e) {
                for (var t = 0; t < i._isCustomAttributeFunctions.length; t++) {
                  var n = i._isCustomAttributeFunctions[t];
                  if (n(e)) return !0;
                }
                return !1;
              },
              getDefaultValueForProperty: function(e, t) {
                var n,
                  r = o[e];
                return (
                  r || (o[e] = r = {}),
                  t in r || ((n = document.createElement(e)), (r[t] = n[t])),
                  r[t]
                );
              },
              injection: r
            };
          t.exports = i;
        },
        { './invariant': 118 }
      ],
      11: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            return (
              null == t ||
              (r.hasBooleanValue[e] && !t) ||
              (r.hasNumericValue[e] && isNaN(t)) ||
              (r.hasPositiveNumericValue[e] && 1 > t) ||
              (r.hasOverloadedBooleanValue[e] && t === !1)
            );
          }
          var r = e('./DOMProperty'),
            o = e('./escapeTextForBrowser'),
            i = e('./memoizeStringOnly'),
            a = (e('./warning'),
            i(function(e) {
              return o(e) + '="';
            })),
            s = {
              createMarkupForID: function(e) {
                return a(r.ID_ATTRIBUTE_NAME) + o(e) + '"';
              },
              createMarkupForProperty: function(e, t) {
                if (r.isStandardName.hasOwnProperty(e) && r.isStandardName[e]) {
                  if (n(e, t)) return '';
                  var i = r.getAttributeName[e];
                  return r.hasBooleanValue[e] || (r.hasOverloadedBooleanValue[e] && t === !0)
                    ? o(i)
                    : a(i) + o(t) + '"';
                }
                return r.isCustomAttribute(e) ? (null == t ? '' : a(e) + o(t) + '"') : null;
              },
              setValueForProperty: function(e, t, o) {
                if (r.isStandardName.hasOwnProperty(t) && r.isStandardName[t]) {
                  var i = r.getMutationMethod[t];
                  if (i) i(e, o);
                  else if (n(t, o)) this.deleteValueForProperty(e, t);
                  else if (r.mustUseAttribute[t]) e.setAttribute(r.getAttributeName[t], '' + o);
                  else {
                    var a = r.getPropertyName[t];
                    (r.hasSideEffects[t] && e[a] === o) || (e[a] = o);
                  }
                } else
                  r.isCustomAttribute(t) &&
                    (null == o ? e.removeAttribute(t) : e.setAttribute(t, '' + o));
              },
              deleteValueForProperty: function(e, t) {
                if (r.isStandardName.hasOwnProperty(t) && r.isStandardName[t]) {
                  var n = r.getMutationMethod[t];
                  if (n) n(e, void 0);
                  else if (r.mustUseAttribute[t]) e.removeAttribute(r.getAttributeName[t]);
                  else {
                    var o = r.getPropertyName[t],
                      i = r.getDefaultValueForProperty(e.nodeName, o);
                    (r.hasSideEffects[t] && e[o] === i) || (e[o] = i);
                  }
                } else r.isCustomAttribute(t) && e.removeAttribute(t);
              }
            };
          t.exports = s;
        },
        {
          './DOMProperty': 10,
          './escapeTextForBrowser': 102,
          './memoizeStringOnly': 127,
          './warning': 139
        }
      ],
      12: [
        function(e, t) {
          'use strict';
          function n(e) {
            return e.substring(1, e.indexOf(' '));
          }
          var r = e('./ExecutionEnvironment'),
            o = e('./createNodesFromMarkup'),
            i = e('./emptyFunction'),
            a = e('./getMarkupWrap'),
            s = e('./invariant'),
            u = /^(<[^ \/>]+)/,
            c = 'data-danger-index',
            l = {
              dangerouslyRenderMarkup: function(e) {
                s(r.canUseDOM);
                for (var t, l = {}, p = 0; p < e.length; p++)
                  s(e[p]),
                    (t = n(e[p])),
                    (t = a(t) ? t : '*'),
                    (l[t] = l[t] || []),
                    (l[t][p] = e[p]);
                var d = [],
                  f = 0;
                for (t in l)
                  if (l.hasOwnProperty(t)) {
                    var h = l[t];
                    for (var v in h)
                      if (h.hasOwnProperty(v)) {
                        var m = h[v];
                        h[v] = m.replace(u, '$1 ' + c + '="' + v + '" ');
                      }
                    var g = o(h.join(''), i);
                    for (p = 0; p < g.length; ++p) {
                      var y = g[p];
                      y.hasAttribute &&
                        y.hasAttribute(c) &&
                        ((v = +y.getAttribute(c)),
                        y.removeAttribute(c),
                        s(!d.hasOwnProperty(v)),
                        (d[v] = y),
                        (f += 1));
                    }
                  }
                return s(f === d.length), s(d.length === e.length), d;
              },
              dangerouslyReplaceNodeWithMarkup: function(e, t) {
                s(r.canUseDOM), s(t), s('html' !== e.tagName.toLowerCase());
                var n = o(t, i)[0];
                e.parentNode.replaceChild(n, e);
              }
            };
          t.exports = l;
        },
        {
          './ExecutionEnvironment': 21,
          './createNodesFromMarkup': 98,
          './emptyFunction': 100,
          './getMarkupWrap': 110,
          './invariant': 118
        }
      ],
      13: [
        function(e, t) {
          'use strict';
          var n = e('./keyOf'),
            r = [
              n({ ResponderEventPlugin: null }),
              n({ SimpleEventPlugin: null }),
              n({ TapEventPlugin: null }),
              n({ EnterLeaveEventPlugin: null }),
              n({ ChangeEventPlugin: null }),
              n({ SelectEventPlugin: null }),
              n({ CompositionEventPlugin: null }),
              n({ BeforeInputEventPlugin: null }),
              n({ AnalyticsEventPlugin: null }),
              n({ MobileSafariClickEventPlugin: null })
            ];
          t.exports = r;
        },
        { './keyOf': 125 }
      ],
      14: [
        function(e, t) {
          'use strict';
          var n = e('./EventConstants'),
            r = e('./EventPropagators'),
            o = e('./SyntheticMouseEvent'),
            i = e('./ReactMount'),
            a = e('./keyOf'),
            s = n.topLevelTypes,
            u = i.getFirstReactDOM,
            c = {
              mouseEnter: {
                registrationName: a({ onMouseEnter: null }),
                dependencies: [s.topMouseOut, s.topMouseOver]
              },
              mouseLeave: {
                registrationName: a({ onMouseLeave: null }),
                dependencies: [s.topMouseOut, s.topMouseOver]
              }
            },
            l = [null, null],
            p = {
              eventTypes: c,
              extractEvents: function(e, t, n, a) {
                if (e === s.topMouseOver && (a.relatedTarget || a.fromElement)) return null;
                if (e !== s.topMouseOut && e !== s.topMouseOver) return null;
                var p;
                if (t.window === t) p = t;
                else {
                  var d = t.ownerDocument;
                  p = d ? d.defaultView || d.parentWindow : window;
                }
                var f, h;
                if (
                  (e === s.topMouseOut
                    ? ((f = t), (h = u(a.relatedTarget || a.toElement) || p))
                    : ((f = p), (h = t)),
                  f === h)
                )
                  return null;
                var v = f ? i.getID(f) : '',
                  m = h ? i.getID(h) : '',
                  g = o.getPooled(c.mouseLeave, v, a);
                (g.type = 'mouseleave'), (g.target = f), (g.relatedTarget = h);
                var y = o.getPooled(c.mouseEnter, m, a);
                return (
                  (y.type = 'mouseenter'),
                  (y.target = h),
                  (y.relatedTarget = f),
                  r.accumulateEnterLeaveDispatches(g, y, v, m),
                  (l[0] = g),
                  (l[1] = y),
                  l
                );
              }
            };
          t.exports = p;
        },
        {
          './EventConstants': 15,
          './EventPropagators': 20,
          './ReactMount': 59,
          './SyntheticMouseEvent': 86,
          './keyOf': 125
        }
      ],
      15: [
        function(e, t) {
          'use strict';
          var n = e('./keyMirror'),
            r = n({ bubbled: null, captured: null }),
            o = n({
              topBlur: null,
              topChange: null,
              topClick: null,
              topCompositionEnd: null,
              topCompositionStart: null,
              topCompositionUpdate: null,
              topContextMenu: null,
              topCopy: null,
              topCut: null,
              topDoubleClick: null,
              topDrag: null,
              topDragEnd: null,
              topDragEnter: null,
              topDragExit: null,
              topDragLeave: null,
              topDragOver: null,
              topDragStart: null,
              topDrop: null,
              topError: null,
              topFocus: null,
              topInput: null,
              topKeyDown: null,
              topKeyPress: null,
              topKeyUp: null,
              topLoad: null,
              topMouseDown: null,
              topMouseMove: null,
              topMouseOut: null,
              topMouseOver: null,
              topMouseUp: null,
              topPaste: null,
              topReset: null,
              topScroll: null,
              topSelectionChange: null,
              topSubmit: null,
              topTextInput: null,
              topTouchCancel: null,
              topTouchEnd: null,
              topTouchMove: null,
              topTouchStart: null,
              topWheel: null
            }),
            i = { topLevelTypes: o, PropagationPhases: r };
          t.exports = i;
        },
        { './keyMirror': 124 }
      ],
      16: [
        function(e, t) {
          var n = e('./emptyFunction'),
            r = {
              listen: function(e, t, n) {
                return e.addEventListener
                  ? (e.addEventListener(t, n, !1),
                    {
                      remove: function() {
                        e.removeEventListener(t, n, !1);
                      }
                    })
                  : e.attachEvent
                    ? (e.attachEvent('on' + t, n),
                      {
                        remove: function() {
                          e.detachEvent('on' + t, n);
                        }
                      })
                    : void 0;
              },
              capture: function(e, t, r) {
                return e.addEventListener
                  ? (e.addEventListener(t, r, !0),
                    {
                      remove: function() {
                        e.removeEventListener(t, r, !0);
                      }
                    })
                  : { remove: n };
              },
              registerDefault: function() {}
            };
          t.exports = r;
        },
        { './emptyFunction': 100 }
      ],
      17: [
        function(e, t) {
          'use strict';
          var n = e('./EventPluginRegistry'),
            r = e('./EventPluginUtils'),
            o = e('./accumulate'),
            i = e('./forEachAccumulated'),
            a = e('./invariant'),
            s = (e('./isEventSupported'), e('./monitorCodeUse'), {}),
            u = null,
            c = function(e) {
              if (e) {
                var t = r.executeDispatch,
                  o = n.getPluginModuleForEvent(e);
                o && o.executeDispatch && (t = o.executeDispatch),
                  r.executeDispatchesInOrder(e, t),
                  e.isPersistent() || e.constructor.release(e);
              }
            },
            l = null,
            p = {
              injection: {
                injectMount: r.injection.injectMount,
                injectInstanceHandle: function(e) {
                  l = e;
                },
                getInstanceHandle: function() {
                  return l;
                },
                injectEventPluginOrder: n.injectEventPluginOrder,
                injectEventPluginsByName: n.injectEventPluginsByName
              },
              eventNameDispatchConfigs: n.eventNameDispatchConfigs,
              registrationNameModules: n.registrationNameModules,
              putListener: function(e, t, n) {
                a(!n || 'function' == typeof n);
                var r = s[t] || (s[t] = {});
                r[e] = n;
              },
              getListener: function(e, t) {
                var n = s[t];
                return n && n[e];
              },
              deleteListener: function(e, t) {
                var n = s[t];
                n && delete n[e];
              },
              deleteAllListeners: function(e) {
                for (var t in s) delete s[t][e];
              },
              extractEvents: function(e, t, r, i) {
                for (var a, s = n.plugins, u = 0, c = s.length; c > u; u++) {
                  var l = s[u];
                  if (l) {
                    var p = l.extractEvents(e, t, r, i);
                    p && (a = o(a, p));
                  }
                }
                return a;
              },
              enqueueEvents: function(e) {
                e && (u = o(u, e));
              },
              processEventQueue: function() {
                var e = u;
                (u = null), i(e, c), a(!u);
              },
              __purge: function() {
                s = {};
              },
              __getListenerBank: function() {
                return s;
              }
            };
          t.exports = p;
        },
        {
          './EventPluginRegistry': 18,
          './EventPluginUtils': 19,
          './accumulate': 92,
          './forEachAccumulated': 105,
          './invariant': 118,
          './isEventSupported': 119,
          './monitorCodeUse': 132
        }
      ],
      18: [
        function(e, t) {
          'use strict';
          function n() {
            if (a)
              for (var e in s) {
                var t = s[e],
                  n = a.indexOf(e);
                if ((i(n > -1), !u.plugins[n])) {
                  i(t.extractEvents), (u.plugins[n] = t);
                  var o = t.eventTypes;
                  for (var c in o) i(r(o[c], t, c));
                }
              }
          }
          function r(e, t, n) {
            i(!u.eventNameDispatchConfigs.hasOwnProperty(n)), (u.eventNameDispatchConfigs[n] = e);
            var r = e.phasedRegistrationNames;
            if (r) {
              for (var a in r)
                if (r.hasOwnProperty(a)) {
                  var s = r[a];
                  o(s, t, n);
                }
              return !0;
            }
            return e.registrationName ? (o(e.registrationName, t, n), !0) : !1;
          }
          function o(e, t, n) {
            i(!u.registrationNameModules[e]),
              (u.registrationNameModules[e] = t),
              (u.registrationNameDependencies[e] = t.eventTypes[n].dependencies);
          }
          var i = e('./invariant'),
            a = null,
            s = {},
            u = {
              plugins: [],
              eventNameDispatchConfigs: {},
              registrationNameModules: {},
              registrationNameDependencies: {},
              injectEventPluginOrder: function(e) {
                i(!a), (a = Array.prototype.slice.call(e)), n();
              },
              injectEventPluginsByName: function(e) {
                var t = !1;
                for (var r in e)
                  if (e.hasOwnProperty(r)) {
                    var o = e[r];
                    (s.hasOwnProperty(r) && s[r] === o) || (i(!s[r]), (s[r] = o), (t = !0));
                  }
                t && n();
              },
              getPluginModuleForEvent: function(e) {
                var t = e.dispatchConfig;
                if (t.registrationName)
                  return u.registrationNameModules[t.registrationName] || null;
                for (var n in t.phasedRegistrationNames)
                  if (t.phasedRegistrationNames.hasOwnProperty(n)) {
                    var r = u.registrationNameModules[t.phasedRegistrationNames[n]];
                    if (r) return r;
                  }
                return null;
              },
              _resetEventPlugins: function() {
                a = null;
                for (var e in s) s.hasOwnProperty(e) && delete s[e];
                u.plugins.length = 0;
                var t = u.eventNameDispatchConfigs;
                for (var n in t) t.hasOwnProperty(n) && delete t[n];
                var r = u.registrationNameModules;
                for (var o in r) r.hasOwnProperty(o) && delete r[o];
              }
            };
          t.exports = u;
        },
        { './invariant': 118 }
      ],
      19: [
        function(e, t) {
          'use strict';
          function n(e) {
            return e === v.topMouseUp || e === v.topTouchEnd || e === v.topTouchCancel;
          }
          function r(e) {
            return e === v.topMouseMove || e === v.topTouchMove;
          }
          function o(e) {
            return e === v.topMouseDown || e === v.topTouchStart;
          }
          function i(e, t) {
            var n = e._dispatchListeners,
              r = e._dispatchIDs;
            if (Array.isArray(n))
              for (var o = 0; o < n.length && !e.isPropagationStopped(); o++) t(e, n[o], r[o]);
            else n && t(e, n, r);
          }
          function a(e, t, n) {
            e.currentTarget = h.Mount.getNode(n);
            var r = t(e, n);
            return (e.currentTarget = null), r;
          }
          function s(e, t) {
            i(e, t), (e._dispatchListeners = null), (e._dispatchIDs = null);
          }
          function u(e) {
            var t = e._dispatchListeners,
              n = e._dispatchIDs;
            if (Array.isArray(t)) {
              for (var r = 0; r < t.length && !e.isPropagationStopped(); r++)
                if (t[r](e, n[r])) return n[r];
            } else if (t && t(e, n)) return n;
            return null;
          }
          function c(e) {
            var t = u(e);
            return (e._dispatchIDs = null), (e._dispatchListeners = null), t;
          }
          function l(e) {
            var t = e._dispatchListeners,
              n = e._dispatchIDs;
            f(!Array.isArray(t));
            var r = t ? t(e, n) : null;
            return (e._dispatchListeners = null), (e._dispatchIDs = null), r;
          }
          function p(e) {
            return !!e._dispatchListeners;
          }
          var d = e('./EventConstants'),
            f = e('./invariant'),
            h = {
              Mount: null,
              injectMount: function(e) {
                h.Mount = e;
              }
            },
            v = d.topLevelTypes,
            m = {
              isEndish: n,
              isMoveish: r,
              isStartish: o,
              executeDirectDispatch: l,
              executeDispatch: a,
              executeDispatchesInOrder: s,
              executeDispatchesInOrderStopAtTrue: c,
              hasDispatches: p,
              injection: h,
              useTouchEvents: !1
            };
          t.exports = m;
        },
        { './EventConstants': 15, './invariant': 118 }
      ],
      20: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            var r = t.dispatchConfig.phasedRegistrationNames[n];
            return v(e, r);
          }
          function r(e, t, r) {
            var o = t ? h.bubbled : h.captured,
              i = n(e, r, o);
            i &&
              ((r._dispatchListeners = d(r._dispatchListeners, i)),
              (r._dispatchIDs = d(r._dispatchIDs, e)));
          }
          function o(e) {
            e &&
              e.dispatchConfig.phasedRegistrationNames &&
              p.injection.getInstanceHandle().traverseTwoPhase(e.dispatchMarker, r, e);
          }
          function i(e, t, n) {
            if (n && n.dispatchConfig.registrationName) {
              var r = n.dispatchConfig.registrationName,
                o = v(e, r);
              o &&
                ((n._dispatchListeners = d(n._dispatchListeners, o)),
                (n._dispatchIDs = d(n._dispatchIDs, e)));
            }
          }
          function a(e) {
            e && e.dispatchConfig.registrationName && i(e.dispatchMarker, null, e);
          }
          function s(e) {
            f(e, o);
          }
          function u(e, t, n, r) {
            p.injection.getInstanceHandle().traverseEnterLeave(n, r, i, e, t);
          }
          function c(e) {
            f(e, a);
          }
          var l = e('./EventConstants'),
            p = e('./EventPluginHub'),
            d = e('./accumulate'),
            f = e('./forEachAccumulated'),
            h = l.PropagationPhases,
            v = p.getListener,
            m = {
              accumulateTwoPhaseDispatches: s,
              accumulateDirectDispatches: c,
              accumulateEnterLeaveDispatches: u
            };
          t.exports = m;
        },
        {
          './EventConstants': 15,
          './EventPluginHub': 17,
          './accumulate': 92,
          './forEachAccumulated': 105
        }
      ],
      21: [
        function(e, t) {
          'use strict';
          var n = !(
              'undefined' == typeof window ||
              !window.document ||
              !window.document.createElement
            ),
            r = {
              canUseDOM: n,
              canUseWorkers: 'undefined' != typeof Worker,
              canUseEventListeners: n && !(!window.addEventListener && !window.attachEvent),
              canUseViewport: n && !!window.screen,
              isInWorker: !n
            };
          t.exports = r;
        },
        {}
      ],
      22: [
        function(e, t) {
          'use strict';
          var n,
            r = e('./DOMProperty'),
            o = e('./ExecutionEnvironment'),
            i = r.injection.MUST_USE_ATTRIBUTE,
            a = r.injection.MUST_USE_PROPERTY,
            s = r.injection.HAS_BOOLEAN_VALUE,
            u = r.injection.HAS_SIDE_EFFECTS,
            c = r.injection.HAS_NUMERIC_VALUE,
            l = r.injection.HAS_POSITIVE_NUMERIC_VALUE,
            p = r.injection.HAS_OVERLOADED_BOOLEAN_VALUE;
          if (o.canUseDOM) {
            var d = document.implementation;
            n =
              d &&
              d.hasFeature &&
              d.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
          }
          var f = {
            isCustomAttribute: RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),
            Properties: {
              accept: null,
              accessKey: null,
              action: null,
              allowFullScreen: i | s,
              allowTransparency: i,
              alt: null,
              async: s,
              autoComplete: null,
              autoPlay: s,
              cellPadding: null,
              cellSpacing: null,
              charSet: i,
              checked: a | s,
              className: n ? i : a,
              cols: i | l,
              colSpan: null,
              content: null,
              contentEditable: null,
              contextMenu: i,
              controls: a | s,
              coords: null,
              crossOrigin: null,
              data: null,
              dateTime: i,
              defer: s,
              dir: null,
              disabled: i | s,
              download: p,
              draggable: null,
              encType: null,
              form: i,
              formNoValidate: s,
              frameBorder: i,
              height: i,
              hidden: i | s,
              href: null,
              hrefLang: null,
              htmlFor: null,
              httpEquiv: null,
              icon: null,
              id: a,
              label: null,
              lang: null,
              list: null,
              loop: a | s,
              max: null,
              maxLength: i,
              mediaGroup: null,
              method: null,
              min: null,
              multiple: a | s,
              muted: a | s,
              name: null,
              noValidate: s,
              pattern: null,
              placeholder: null,
              poster: null,
              preload: null,
              radioGroup: null,
              readOnly: a | s,
              rel: null,
              required: s,
              role: i,
              rows: i | l,
              rowSpan: null,
              sandbox: null,
              scope: null,
              scrollLeft: a,
              scrolling: null,
              scrollTop: a,
              seamless: i | s,
              selected: a | s,
              shape: null,
              size: i | l,
              span: l,
              spellCheck: null,
              src: null,
              srcDoc: a,
              srcSet: null,
              start: c,
              step: null,
              style: null,
              tabIndex: null,
              target: null,
              title: null,
              type: null,
              useMap: null,
              value: a | u,
              width: i,
              wmode: i,
              autoCapitalize: null,
              autoCorrect: null,
              itemProp: i,
              itemScope: i | s,
              itemType: i,
              property: null
            },
            DOMAttributeNames: { className: 'class', htmlFor: 'for', httpEquiv: 'http-equiv' },
            DOMPropertyNames: {
              autoCapitalize: 'autocapitalize',
              autoComplete: 'autocomplete',
              autoCorrect: 'autocorrect',
              autoFocus: 'autofocus',
              autoPlay: 'autoplay',
              encType: 'enctype',
              hrefLang: 'hreflang',
              radioGroup: 'radiogroup',
              spellCheck: 'spellcheck',
              srcDoc: 'srcdoc',
              srcSet: 'srcset'
            }
          };
          t.exports = f;
        },
        { './DOMProperty': 10, './ExecutionEnvironment': 21 }
      ],
      23: [
        function(e, t) {
          'use strict';
          function n(e) {
            u(null == e.props.checkedLink || null == e.props.valueLink);
          }
          function r(e) {
            n(e), u(null == e.props.value && null == e.props.onChange);
          }
          function o(e) {
            n(e), u(null == e.props.checked && null == e.props.onChange);
          }
          function i(e) {
            this.props.valueLink.requestChange(e.target.value);
          }
          function a(e) {
            this.props.checkedLink.requestChange(e.target.checked);
          }
          var s = e('./ReactPropTypes'),
            u = e('./invariant'),
            c = {
              button: !0,
              checkbox: !0,
              image: !0,
              hidden: !0,
              radio: !0,
              reset: !0,
              submit: !0
            },
            l = {
              Mixin: {
                propTypes: {
                  value: function(e, t) {
                    return !e[t] || c[e.type] || e.onChange || e.readOnly || e.disabled
                      ? void 0
                      : new Error(
                          'You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.'
                        );
                  },
                  checked: function(e, t) {
                    return !e[t] || e.onChange || e.readOnly || e.disabled
                      ? void 0
                      : new Error(
                          'You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.'
                        );
                  },
                  onChange: s.func
                }
              },
              getValue: function(e) {
                return e.props.valueLink ? (r(e), e.props.valueLink.value) : e.props.value;
              },
              getChecked: function(e) {
                return e.props.checkedLink ? (o(e), e.props.checkedLink.value) : e.props.checked;
              },
              getOnChange: function(e) {
                return e.props.valueLink
                  ? (r(e), i)
                  : e.props.checkedLink ? (o(e), a) : e.props.onChange;
              }
            };
          t.exports = l;
        },
        { './ReactPropTypes': 67, './invariant': 118 }
      ],
      24: [
        function(e, t) {
          'use strict';
          function n(e) {
            e.remove();
          }
          var r = e('./ReactBrowserEventEmitter'),
            o = e('./accumulate'),
            i = e('./forEachAccumulated'),
            a = e('./invariant'),
            s = {
              trapBubbledEvent: function(e, t) {
                a(this.isMounted());
                var n = r.trapBubbledEvent(e, t, this.getDOMNode());
                this._localEventListeners = o(this._localEventListeners, n);
              },
              componentWillUnmount: function() {
                this._localEventListeners && i(this._localEventListeners, n);
              }
            };
          t.exports = s;
        },
        {
          './ReactBrowserEventEmitter': 29,
          './accumulate': 92,
          './forEachAccumulated': 105,
          './invariant': 118
        }
      ],
      25: [
        function(e, t) {
          'use strict';
          var n = e('./EventConstants'),
            r = e('./emptyFunction'),
            o = n.topLevelTypes,
            i = {
              eventTypes: null,
              extractEvents: function(e, t, n, i) {
                if (e === o.topTouchStart) {
                  var a = i.target;
                  a && !a.onclick && (a.onclick = r);
                }
              }
            };
          t.exports = i;
        },
        { './EventConstants': 15, './emptyFunction': 100 }
      ],
      26: [
        function(e, t) {
          'use strict';
          var n = e('./invariant'),
            r = function(e) {
              var t = this;
              if (t.instancePool.length) {
                var n = t.instancePool.pop();
                return t.call(n, e), n;
              }
              return new t(e);
            },
            o = function(e, t) {
              var n = this;
              if (n.instancePool.length) {
                var r = n.instancePool.pop();
                return n.call(r, e, t), r;
              }
              return new n(e, t);
            },
            i = function(e, t, n) {
              var r = this;
              if (r.instancePool.length) {
                var o = r.instancePool.pop();
                return r.call(o, e, t, n), o;
              }
              return new r(e, t, n);
            },
            a = function(e, t, n, r, o) {
              var i = this;
              if (i.instancePool.length) {
                var a = i.instancePool.pop();
                return i.call(a, e, t, n, r, o), a;
              }
              return new i(e, t, n, r, o);
            },
            s = function(e) {
              var t = this;
              n(e instanceof t),
                e.destructor && e.destructor(),
                t.instancePool.length < t.poolSize && t.instancePool.push(e);
            },
            u = 10,
            c = r,
            l = function(e, t) {
              var n = e;
              return (
                (n.instancePool = []),
                (n.getPooled = t || c),
                n.poolSize || (n.poolSize = u),
                (n.release = s),
                n
              );
            },
            p = {
              addPoolingTo: l,
              oneArgumentPooler: r,
              twoArgumentPooler: o,
              threeArgumentPooler: i,
              fiveArgumentPooler: a
            };
          t.exports = p;
        },
        { './invariant': 118 }
      ],
      27: [
        function(e, t) {
          'use strict';
          var n = e('./DOMPropertyOperations'),
            r = e('./EventPluginUtils'),
            o = e('./ReactChildren'),
            i = e('./ReactComponent'),
            a = e('./ReactCompositeComponent'),
            s = e('./ReactContext'),
            u = e('./ReactCurrentOwner'),
            c = e('./ReactDescriptor'),
            l = e('./ReactDOM'),
            p = e('./ReactDOMComponent'),
            d = e('./ReactDefaultInjection'),
            f = e('./ReactInstanceHandles'),
            h = e('./ReactMount'),
            v = e('./ReactMultiChild'),
            m = e('./ReactPerf'),
            g = e('./ReactPropTypes'),
            y = e('./ReactServerRendering'),
            C = e('./ReactTextComponent'),
            E = e('./onlyChild');
          d.inject();
          var R = {
            Children: { map: o.map, forEach: o.forEach, count: o.count, only: E },
            DOM: l,
            PropTypes: g,
            initializeTouchEvents: function(e) {
              r.useTouchEvents = e;
            },
            createClass: a.createClass,
            createDescriptor: function(e) {
              var t = Array.prototype.slice.call(arguments, 1);
              return e.apply(null, t);
            },
            constructAndRenderComponent: h.constructAndRenderComponent,
            constructAndRenderComponentByID: h.constructAndRenderComponentByID,
            renderComponent: m.measure('React', 'renderComponent', h.renderComponent),
            renderComponentToString: y.renderComponentToString,
            renderComponentToStaticMarkup: y.renderComponentToStaticMarkup,
            unmountComponentAtNode: h.unmountComponentAtNode,
            isValidClass: c.isValidFactory,
            isValidComponent: c.isValidDescriptor,
            withContext: s.withContext,
            __internals: {
              Component: i,
              CurrentOwner: u,
              DOMComponent: p,
              DOMPropertyOperations: n,
              InstanceHandles: f,
              Mount: h,
              MultiChild: v,
              TextComponent: C
            }
          };
          (R.version = '0.11.1'), (t.exports = R);
        },
        {
          './DOMPropertyOperations': 11,
          './EventPluginUtils': 19,
          './ReactChildren': 30,
          './ReactComponent': 31,
          './ReactCompositeComponent': 33,
          './ReactContext': 34,
          './ReactCurrentOwner': 35,
          './ReactDOM': 36,
          './ReactDOMComponent': 38,
          './ReactDefaultInjection': 48,
          './ReactDescriptor': 49,
          './ReactInstanceHandles': 57,
          './ReactMount': 59,
          './ReactMultiChild': 60,
          './ReactPerf': 63,
          './ReactPropTypes': 67,
          './ReactServerRendering': 71,
          './ReactTextComponent': 73,
          './onlyChild': 133
        }
      ],
      28: [
        function(e, t) {
          'use strict';
          var n = e('./ReactEmptyComponent'),
            r = e('./ReactMount'),
            o = e('./invariant'),
            i = {
              getDOMNode: function() {
                return (
                  o(this.isMounted()),
                  n.isNullComponentID(this._rootNodeID) ? null : r.getNode(this._rootNodeID)
                );
              }
            };
          t.exports = i;
        },
        { './ReactEmptyComponent': 51, './ReactMount': 59, './invariant': 118 }
      ],
      29: [
        function(e, t) {
          'use strict';
          function n(e) {
            return (
              Object.prototype.hasOwnProperty.call(e, h) || ((e[h] = d++), (l[e[h]] = {})), l[e[h]]
            );
          }
          var r = e('./EventConstants'),
            o = e('./EventPluginHub'),
            i = e('./EventPluginRegistry'),
            a = e('./ReactEventEmitterMixin'),
            s = e('./ViewportMetrics'),
            u = e('./isEventSupported'),
            c = e('./merge'),
            l = {},
            p = !1,
            d = 0,
            f = {
              topBlur: 'blur',
              topChange: 'change',
              topClick: 'click',
              topCompositionEnd: 'compositionend',
              topCompositionStart: 'compositionstart',
              topCompositionUpdate: 'compositionupdate',
              topContextMenu: 'contextmenu',
              topCopy: 'copy',
              topCut: 'cut',
              topDoubleClick: 'dblclick',
              topDrag: 'drag',
              topDragEnd: 'dragend',
              topDragEnter: 'dragenter',
              topDragExit: 'dragexit',
              topDragLeave: 'dragleave',
              topDragOver: 'dragover',
              topDragStart: 'dragstart',
              topDrop: 'drop',
              topFocus: 'focus',
              topInput: 'input',
              topKeyDown: 'keydown',
              topKeyPress: 'keypress',
              topKeyUp: 'keyup',
              topMouseDown: 'mousedown',
              topMouseMove: 'mousemove',
              topMouseOut: 'mouseout',
              topMouseOver: 'mouseover',
              topMouseUp: 'mouseup',
              topPaste: 'paste',
              topScroll: 'scroll',
              topSelectionChange: 'selectionchange',
              topTextInput: 'textInput',
              topTouchCancel: 'touchcancel',
              topTouchEnd: 'touchend',
              topTouchMove: 'touchmove',
              topTouchStart: 'touchstart',
              topWheel: 'wheel'
            },
            h = '_reactListenersID' + String(Math.random()).slice(2),
            v = c(a, {
              ReactEventListener: null,
              injection: {
                injectReactEventListener: function(e) {
                  e.setHandleTopLevel(v.handleTopLevel), (v.ReactEventListener = e);
                }
              },
              setEnabled: function(e) {
                v.ReactEventListener && v.ReactEventListener.setEnabled(e);
              },
              isEnabled: function() {
                return !(!v.ReactEventListener || !v.ReactEventListener.isEnabled());
              },
              listenTo: function(e, t) {
                for (
                  var o = t,
                    a = n(o),
                    s = i.registrationNameDependencies[e],
                    c = r.topLevelTypes,
                    l = 0,
                    p = s.length;
                  p > l;
                  l++
                ) {
                  var d = s[l];
                  (a.hasOwnProperty(d) && a[d]) ||
                    (d === c.topWheel
                      ? u('wheel')
                        ? v.ReactEventListener.trapBubbledEvent(c.topWheel, 'wheel', o)
                        : u('mousewheel')
                          ? v.ReactEventListener.trapBubbledEvent(c.topWheel, 'mousewheel', o)
                          : v.ReactEventListener.trapBubbledEvent(c.topWheel, 'DOMMouseScroll', o)
                      : d === c.topScroll
                        ? u('scroll', !0)
                          ? v.ReactEventListener.trapCapturedEvent(c.topScroll, 'scroll', o)
                          : v.ReactEventListener.trapBubbledEvent(
                              c.topScroll,
                              'scroll',
                              v.ReactEventListener.WINDOW_HANDLE
                            )
                        : d === c.topFocus || d === c.topBlur
                          ? (u('focus', !0)
                              ? (v.ReactEventListener.trapCapturedEvent(c.topFocus, 'focus', o),
                                v.ReactEventListener.trapCapturedEvent(c.topBlur, 'blur', o))
                              : u('focusin') &&
                                (v.ReactEventListener.trapBubbledEvent(c.topFocus, 'focusin', o),
                                v.ReactEventListener.trapBubbledEvent(c.topBlur, 'focusout', o)),
                            (a[c.topBlur] = !0),
                            (a[c.topFocus] = !0))
                          : f.hasOwnProperty(d) &&
                            v.ReactEventListener.trapBubbledEvent(d, f[d], o),
                    (a[d] = !0));
                }
              },
              trapBubbledEvent: function(e, t, n) {
                return v.ReactEventListener.trapBubbledEvent(e, t, n);
              },
              trapCapturedEvent: function(e, t, n) {
                return v.ReactEventListener.trapCapturedEvent(e, t, n);
              },
              ensureScrollValueMonitoring: function() {
                if (!p) {
                  var e = s.refreshScrollValues;
                  v.ReactEventListener.monitorScrollValue(e), (p = !0);
                }
              },
              eventNameDispatchConfigs: o.eventNameDispatchConfigs,
              registrationNameModules: o.registrationNameModules,
              putListener: o.putListener,
              getListener: o.getListener,
              deleteListener: o.deleteListener,
              deleteAllListeners: o.deleteAllListeners
            });
          t.exports = v;
        },
        {
          './EventConstants': 15,
          './EventPluginHub': 17,
          './EventPluginRegistry': 18,
          './ReactEventEmitterMixin': 53,
          './ViewportMetrics': 91,
          './isEventSupported': 119,
          './merge': 128
        }
      ],
      30: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            (this.forEachFunction = e), (this.forEachContext = t);
          }
          function r(e, t, n, r) {
            var o = e;
            o.forEachFunction.call(o.forEachContext, t, r);
          }
          function o(e, t, o) {
            if (null == e) return e;
            var i = n.getPooled(t, o);
            p(e, r, i), n.release(i);
          }
          function i(e, t, n) {
            (this.mapResult = e), (this.mapFunction = t), (this.mapContext = n);
          }
          function a(e, t, n, r) {
            var o = e,
              i = o.mapResult,
              a = !i.hasOwnProperty(n);
            if (a) {
              var s = o.mapFunction.call(o.mapContext, t, r);
              i[n] = s;
            }
          }
          function s(e, t, n) {
            if (null == e) return e;
            var r = {},
              o = i.getPooled(r, t, n);
            return p(e, a, o), i.release(o), r;
          }
          function u() {
            return null;
          }
          function c(e) {
            return p(e, u, null);
          }
          var l = e('./PooledClass'),
            p = e('./traverseAllChildren'),
            d = (e('./warning'), l.twoArgumentPooler),
            f = l.threeArgumentPooler;
          l.addPoolingTo(n, d), l.addPoolingTo(i, f);
          var h = { forEach: o, map: s, count: c };
          t.exports = h;
        },
        { './PooledClass': 26, './traverseAllChildren': 138, './warning': 139 }
      ],
      31: [
        function(e, t) {
          'use strict';
          var n = e('./ReactDescriptor'),
            r = e('./ReactOwner'),
            o = e('./ReactUpdates'),
            i = e('./invariant'),
            a = e('./keyMirror'),
            s = e('./merge'),
            u = a({ MOUNTED: null, UNMOUNTED: null }),
            c = !1,
            l = null,
            p = null,
            d = {
              injection: {
                injectEnvironment: function(e) {
                  i(!c),
                    (p = e.mountImageIntoNode),
                    (l = e.unmountIDFromEnvironment),
                    (d.BackendIDOperations = e.BackendIDOperations),
                    (c = !0);
                }
              },
              LifeCycle: u,
              BackendIDOperations: null,
              Mixin: {
                isMounted: function() {
                  return this._lifeCycleState === u.MOUNTED;
                },
                setProps: function(e, t) {
                  var n = this._pendingDescriptor || this._descriptor;
                  this.replaceProps(s(n.props, e), t);
                },
                replaceProps: function(e, t) {
                  i(this.isMounted()),
                    i(0 === this._mountDepth),
                    (this._pendingDescriptor = n.cloneAndReplaceProps(
                      this._pendingDescriptor || this._descriptor,
                      e
                    )),
                    o.enqueueUpdate(this, t);
                },
                _setPropsInternal: function(e, t) {
                  var r = this._pendingDescriptor || this._descriptor;
                  (this._pendingDescriptor = n.cloneAndReplaceProps(r, s(r.props, e))),
                    o.enqueueUpdate(this, t);
                },
                construct: function(e) {
                  (this.props = e.props),
                    (this._owner = e._owner),
                    (this._lifeCycleState = u.UNMOUNTED),
                    (this._pendingCallbacks = null),
                    (this._descriptor = e),
                    (this._pendingDescriptor = null);
                },
                mountComponent: function(e, t, n) {
                  i(!this.isMounted());
                  var o = this._descriptor.props;
                  if (null != o.ref) {
                    var a = this._descriptor._owner;
                    r.addComponentAsRefTo(this, o.ref, a);
                  }
                  (this._rootNodeID = e),
                    (this._lifeCycleState = u.MOUNTED),
                    (this._mountDepth = n);
                },
                unmountComponent: function() {
                  i(this.isMounted());
                  var e = this.props;
                  null != e.ref && r.removeComponentAsRefFrom(this, e.ref, this._owner),
                    l(this._rootNodeID),
                    (this._rootNodeID = null),
                    (this._lifeCycleState = u.UNMOUNTED);
                },
                receiveComponent: function(e, t) {
                  i(this.isMounted()),
                    (this._pendingDescriptor = e),
                    this.performUpdateIfNecessary(t);
                },
                performUpdateIfNecessary: function(e) {
                  if (null != this._pendingDescriptor) {
                    var t = this._descriptor,
                      n = this._pendingDescriptor;
                    (this._descriptor = n),
                      (this.props = n.props),
                      (this._owner = n._owner),
                      (this._pendingDescriptor = null),
                      this.updateComponent(e, t);
                  }
                },
                updateComponent: function(e, t) {
                  var n = this._descriptor;
                  (n._owner !== t._owner || n.props.ref !== t.props.ref) &&
                    (null != t.props.ref && r.removeComponentAsRefFrom(this, t.props.ref, t._owner),
                    null != n.props.ref && r.addComponentAsRefTo(this, n.props.ref, n._owner));
                },
                mountComponentIntoNode: function(e, t, n) {
                  var r = o.ReactReconcileTransaction.getPooled();
                  r.perform(this._mountComponentIntoNode, this, e, t, r, n),
                    o.ReactReconcileTransaction.release(r);
                },
                _mountComponentIntoNode: function(e, t, n, r) {
                  var o = this.mountComponent(e, n, 0);
                  p(o, t, r);
                },
                isOwnedBy: function(e) {
                  return this._owner === e;
                },
                getSiblingByRef: function(e) {
                  var t = this._owner;
                  return t && t.refs ? t.refs[e] : null;
                }
              }
            };
          t.exports = d;
        },
        {
          './ReactDescriptor': 49,
          './ReactOwner': 62,
          './ReactUpdates': 74,
          './invariant': 118,
          './keyMirror': 124,
          './merge': 128
        }
      ],
      32: [
        function(e, t) {
          'use strict';
          var n = e('./ReactDOMIDOperations'),
            r = e('./ReactMarkupChecksum'),
            o = e('./ReactMount'),
            i = e('./ReactPerf'),
            a = e('./ReactReconcileTransaction'),
            s = e('./getReactRootElementInContainer'),
            u = e('./invariant'),
            c = e('./setInnerHTML'),
            l = 1,
            p = 9,
            d = {
              ReactReconcileTransaction: a,
              BackendIDOperations: n,
              unmountIDFromEnvironment: function(e) {
                o.purgeID(e);
              },
              mountImageIntoNode: i.measure(
                'ReactComponentBrowserEnvironment',
                'mountImageIntoNode',
                function(e, t, n) {
                  if ((u(t && (t.nodeType === l || t.nodeType === p)), n)) {
                    if (r.canReuseMarkup(e, s(t))) return;
                    u(t.nodeType !== p);
                  }
                  u(t.nodeType !== p), c(t, e);
                }
              )
            };
          t.exports = d;
        },
        {
          './ReactDOMIDOperations': 40,
          './ReactMarkupChecksum': 58,
          './ReactMount': 59,
          './ReactPerf': 63,
          './ReactReconcileTransaction': 69,
          './getReactRootElementInContainer': 112,
          './invariant': 118,
          './setInnerHTML': 134
        }
      ],
      33: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = e._owner || null;
            return t && t.constructor && t.constructor.displayName
              ? ' Check the render method of `' + t.constructor.displayName + '`.'
              : '';
          }
          function r(e, t) {
            for (var n in t) t.hasOwnProperty(n) && D('function' == typeof t[n]);
          }
          function o(e, t) {
            var n = N.hasOwnProperty(t) ? N[t] : null;
            A.hasOwnProperty(t) && D(n === _.OVERRIDE_BASE),
              e.hasOwnProperty(t) && D(n === _.DEFINE_MANY || n === _.DEFINE_MANY_MERGED);
          }
          function i(e) {
            var t = e._compositeLifeCycleState;
            D(e.isMounted() || t === S.MOUNTING), D(t !== S.RECEIVING_STATE), D(t !== S.UNMOUNTING);
          }
          function a(e, t) {
            D(!h.isValidFactory(t)), D(!h.isValidDescriptor(t));
            var n = e.prototype;
            for (var r in t) {
              var i = t[r];
              if (t.hasOwnProperty(r))
                if ((o(n, r), w.hasOwnProperty(r))) w[r](e, i);
                else {
                  var a = N.hasOwnProperty(r),
                    s = n.hasOwnProperty(r),
                    u = i && i.__reactDontBind,
                    p = 'function' == typeof i,
                    d = p && !a && !s && !u;
                  if (d)
                    n.__reactAutoBindMap || (n.__reactAutoBindMap = {}),
                      (n.__reactAutoBindMap[r] = i),
                      (n[r] = i);
                  else if (s) {
                    var f = N[r];
                    D(a && (f === _.DEFINE_MANY_MERGED || f === _.DEFINE_MANY)),
                      f === _.DEFINE_MANY_MERGED
                        ? (n[r] = c(n[r], i))
                        : f === _.DEFINE_MANY && (n[r] = l(n[r], i));
                  } else n[r] = i;
                }
            }
          }
          function s(e, t) {
            if (t)
              for (var n in t) {
                var r = t[n];
                if (t.hasOwnProperty(n)) {
                  var o = n in e,
                    i = r;
                  if (o) {
                    var a = e[n],
                      s = typeof a,
                      u = typeof r;
                    D('function' === s && 'function' === u), (i = l(a, r));
                  }
                  e[n] = i;
                }
              }
          }
          function u(e, t) {
            return (
              D(e && t && 'object' == typeof e && 'object' == typeof t),
              P(t, function(t, n) {
                D(void 0 === e[n]), (e[n] = t);
              }),
              e
            );
          }
          function c(e, t) {
            return function() {
              var n = e.apply(this, arguments),
                r = t.apply(this, arguments);
              return null == n ? r : null == r ? n : u(n, r);
            };
          }
          function l(e, t) {
            return function() {
              e.apply(this, arguments), t.apply(this, arguments);
            };
          }
          var p = e('./ReactComponent'),
            d = e('./ReactContext'),
            f = e('./ReactCurrentOwner'),
            h = e('./ReactDescriptor'),
            v = (e('./ReactDescriptorValidator'), e('./ReactEmptyComponent')),
            m = e('./ReactErrorUtils'),
            g = e('./ReactOwner'),
            y = e('./ReactPerf'),
            C = e('./ReactPropTransferer'),
            E = e('./ReactPropTypeLocations'),
            R = (e('./ReactPropTypeLocationNames'), e('./ReactUpdates')),
            M = e('./instantiateReactComponent'),
            D = e('./invariant'),
            x = e('./keyMirror'),
            b = e('./merge'),
            O = e('./mixInto'),
            P = (e('./monitorCodeUse'), e('./mapObject')),
            I = e('./shouldUpdateReactComponent'),
            _ = (e('./warning'),
            x({
              DEFINE_ONCE: null,
              DEFINE_MANY: null,
              OVERRIDE_BASE: null,
              DEFINE_MANY_MERGED: null
            })),
            T = [],
            N = {
              mixins: _.DEFINE_MANY,
              statics: _.DEFINE_MANY,
              propTypes: _.DEFINE_MANY,
              contextTypes: _.DEFINE_MANY,
              childContextTypes: _.DEFINE_MANY,
              getDefaultProps: _.DEFINE_MANY_MERGED,
              getInitialState: _.DEFINE_MANY_MERGED,
              getChildContext: _.DEFINE_MANY_MERGED,
              render: _.DEFINE_ONCE,
              componentWillMount: _.DEFINE_MANY,
              componentDidMount: _.DEFINE_MANY,
              componentWillReceiveProps: _.DEFINE_MANY,
              shouldComponentUpdate: _.DEFINE_ONCE,
              componentWillUpdate: _.DEFINE_MANY,
              componentDidUpdate: _.DEFINE_MANY,
              componentWillUnmount: _.DEFINE_MANY,
              updateComponent: _.OVERRIDE_BASE
            },
            w = {
              displayName: function(e, t) {
                e.displayName = t;
              },
              mixins: function(e, t) {
                if (t) for (var n = 0; n < t.length; n++) a(e, t[n]);
              },
              childContextTypes: function(e, t) {
                r(e, t, E.childContext), (e.childContextTypes = b(e.childContextTypes, t));
              },
              contextTypes: function(e, t) {
                r(e, t, E.context), (e.contextTypes = b(e.contextTypes, t));
              },
              getDefaultProps: function(e, t) {
                e.getDefaultProps = e.getDefaultProps ? c(e.getDefaultProps, t) : t;
              },
              propTypes: function(e, t) {
                r(e, t, E.prop), (e.propTypes = b(e.propTypes, t));
              },
              statics: function(e, t) {
                s(e, t);
              }
            },
            S = x({
              MOUNTING: null,
              UNMOUNTING: null,
              RECEIVING_PROPS: null,
              RECEIVING_STATE: null
            }),
            A = {
              construct: function() {
                p.Mixin.construct.apply(this, arguments),
                  g.Mixin.construct.apply(this, arguments),
                  (this.state = null),
                  (this._pendingState = null),
                  (this.context = null),
                  (this._compositeLifeCycleState = null);
              },
              isMounted: function() {
                return p.Mixin.isMounted.call(this) && this._compositeLifeCycleState !== S.MOUNTING;
              },
              mountComponent: y.measure('ReactCompositeComponent', 'mountComponent', function(
                e,
                t,
                n
              ) {
                p.Mixin.mountComponent.call(this, e, t, n),
                  (this._compositeLifeCycleState = S.MOUNTING),
                  this.__reactAutoBindMap && this._bindAutoBindMethods(),
                  (this.context = this._processContext(this._descriptor._context)),
                  (this.props = this._processProps(this.props)),
                  (this.state = this.getInitialState ? this.getInitialState() : null),
                  D('object' == typeof this.state && !Array.isArray(this.state)),
                  (this._pendingState = null),
                  (this._pendingForceUpdate = !1),
                  this.componentWillMount &&
                    (this.componentWillMount(),
                    this._pendingState &&
                      ((this.state = this._pendingState), (this._pendingState = null))),
                  (this._renderedComponent = M(this._renderValidatedComponent())),
                  (this._compositeLifeCycleState = null);
                var r = this._renderedComponent.mountComponent(e, t, n + 1);
                return (
                  this.componentDidMount &&
                    t.getReactMountReady().enqueue(this.componentDidMount, this),
                  r
                );
              }),
              unmountComponent: function() {
                (this._compositeLifeCycleState = S.UNMOUNTING),
                  this.componentWillUnmount && this.componentWillUnmount(),
                  (this._compositeLifeCycleState = null),
                  this._renderedComponent.unmountComponent(),
                  (this._renderedComponent = null),
                  p.Mixin.unmountComponent.call(this);
              },
              setState: function(e, t) {
                D('object' == typeof e || null == e),
                  this.replaceState(b(this._pendingState || this.state, e), t);
              },
              replaceState: function(e, t) {
                i(this),
                  (this._pendingState = e),
                  this._compositeLifeCycleState !== S.MOUNTING && R.enqueueUpdate(this, t);
              },
              _processContext: function(e) {
                var t = null,
                  n = this.constructor.contextTypes;
                if (n) {
                  t = {};
                  for (var r in n) t[r] = e[r];
                }
                return t;
              },
              _processChildContext: function(e) {
                var t = this.getChildContext && this.getChildContext();
                if ((this.constructor.displayName || 'ReactCompositeComponent', t)) {
                  D('object' == typeof this.constructor.childContextTypes);
                  for (var n in t) D(n in this.constructor.childContextTypes);
                  return b(e, t);
                }
                return e;
              },
              _processProps: function(e) {
                var t,
                  n = this.constructor.defaultProps;
                if (n) {
                  t = b(e);
                  for (var r in n) 'undefined' == typeof t[r] && (t[r] = n[r]);
                } else t = e;
                return t;
              },
              _checkPropTypes: function(e, t, r) {
                var o = this.constructor.displayName;
                for (var i in e)
                  if (e.hasOwnProperty(i)) {
                    var a = e[i](t, i, o, r);
                    a instanceof Error && n(this);
                  }
              },
              performUpdateIfNecessary: function(e) {
                var t = this._compositeLifeCycleState;
                if (
                  t !== S.MOUNTING &&
                  t !== S.RECEIVING_PROPS &&
                  (null != this._pendingDescriptor ||
                    null != this._pendingState ||
                    this._pendingForceUpdate)
                ) {
                  var n = this.context,
                    r = this.props,
                    o = this._descriptor;
                  null != this._pendingDescriptor &&
                    ((o = this._pendingDescriptor),
                    (n = this._processContext(o._context)),
                    (r = this._processProps(o.props)),
                    (this._pendingDescriptor = null),
                    (this._compositeLifeCycleState = S.RECEIVING_PROPS),
                    this.componentWillReceiveProps && this.componentWillReceiveProps(r, n)),
                    (this._compositeLifeCycleState = S.RECEIVING_STATE);
                  var i = this._pendingState || this.state;
                  this._pendingState = null;
                  try {
                    var a =
                      this._pendingForceUpdate ||
                      !this.shouldComponentUpdate ||
                      this.shouldComponentUpdate(r, i, n);
                    a
                      ? ((this._pendingForceUpdate = !1),
                        this._performComponentUpdate(o, r, i, n, e))
                      : ((this._descriptor = o),
                        (this.props = r),
                        (this.state = i),
                        (this.context = n),
                        (this._owner = o._owner));
                  } finally {
                    this._compositeLifeCycleState = null;
                  }
                }
              },
              _performComponentUpdate: function(e, t, n, r, o) {
                var i = this._descriptor,
                  a = this.props,
                  s = this.state,
                  u = this.context;
                this.componentWillUpdate && this.componentWillUpdate(t, n, r),
                  (this._descriptor = e),
                  (this.props = t),
                  (this.state = n),
                  (this.context = r),
                  (this._owner = e._owner),
                  this.updateComponent(o, i),
                  this.componentDidUpdate &&
                    o
                      .getReactMountReady()
                      .enqueue(this.componentDidUpdate.bind(this, a, s, u), this);
              },
              receiveComponent: function(e, t) {
                (e !== this._descriptor || null == e._owner) &&
                  p.Mixin.receiveComponent.call(this, e, t);
              },
              updateComponent: y.measure('ReactCompositeComponent', 'updateComponent', function(
                e,
                t
              ) {
                p.Mixin.updateComponent.call(this, e, t);
                var n = this._renderedComponent,
                  r = n._descriptor,
                  o = this._renderValidatedComponent();
                if (I(r, o)) n.receiveComponent(o, e);
                else {
                  var i = this._rootNodeID,
                    a = n._rootNodeID;
                  n.unmountComponent(), (this._renderedComponent = M(o));
                  var s = this._renderedComponent.mountComponent(i, e, this._mountDepth + 1);
                  p.BackendIDOperations.dangerouslyReplaceNodeWithMarkupByID(a, s);
                }
              }),
              forceUpdate: function(e) {
                var t = this._compositeLifeCycleState;
                D(this.isMounted() || t === S.MOUNTING),
                  D(t !== S.RECEIVING_STATE && t !== S.UNMOUNTING),
                  (this._pendingForceUpdate = !0),
                  R.enqueueUpdate(this, e);
              },
              _renderValidatedComponent: y.measure(
                'ReactCompositeComponent',
                '_renderValidatedComponent',
                function() {
                  var e,
                    t = d.current;
                  (d.current = this._processChildContext(this._descriptor._context)),
                    (f.current = this);
                  try {
                    (e = this.render()),
                      null === e || e === !1
                        ? ((e = v.getEmptyComponent()), v.registerNullComponentID(this._rootNodeID))
                        : v.deregisterNullComponentID(this._rootNodeID);
                  } finally {
                    (d.current = t), (f.current = null);
                  }
                  return D(h.isValidDescriptor(e)), e;
                }
              ),
              _bindAutoBindMethods: function() {
                for (var e in this.__reactAutoBindMap)
                  if (this.__reactAutoBindMap.hasOwnProperty(e)) {
                    var t = this.__reactAutoBindMap[e];
                    this[e] = this._bindAutoBindMethod(
                      m.guard(t, this.constructor.displayName + '.' + e)
                    );
                  }
              },
              _bindAutoBindMethod: function(e) {
                var t = this,
                  n = function() {
                    return e.apply(t, arguments);
                  };
                return n;
              }
            },
            k = function() {};
          O(k, p.Mixin), O(k, g.Mixin), O(k, C.Mixin), O(k, A);
          var U = {
            LifeCycle: S,
            Base: k,
            createClass: function(e) {
              var t = function(e, t) {
                this.construct(e, t);
              };
              (t.prototype = new k()),
                (t.prototype.constructor = t),
                T.forEach(a.bind(null, t)),
                a(t, e),
                t.getDefaultProps && (t.defaultProps = t.getDefaultProps()),
                D(t.prototype.render);
              for (var n in N) t.prototype[n] || (t.prototype[n] = null);
              var r = h.createFactory(t);
              return r;
            },
            injection: {
              injectMixin: function(e) {
                T.push(e);
              }
            }
          };
          t.exports = U;
        },
        {
          './ReactComponent': 31,
          './ReactContext': 34,
          './ReactCurrentOwner': 35,
          './ReactDescriptor': 49,
          './ReactDescriptorValidator': 50,
          './ReactEmptyComponent': 51,
          './ReactErrorUtils': 52,
          './ReactOwner': 62,
          './ReactPerf': 63,
          './ReactPropTransferer': 64,
          './ReactPropTypeLocationNames': 65,
          './ReactPropTypeLocations': 66,
          './ReactUpdates': 74,
          './instantiateReactComponent': 117,
          './invariant': 118,
          './keyMirror': 124,
          './mapObject': 126,
          './merge': 128,
          './mixInto': 131,
          './monitorCodeUse': 132,
          './shouldUpdateReactComponent': 136,
          './warning': 139
        }
      ],
      34: [
        function(e, t) {
          'use strict';
          var n = e('./merge'),
            r = {
              current: {},
              withContext: function(e, t) {
                var o,
                  i = r.current;
                r.current = n(i, e);
                try {
                  o = t();
                } finally {
                  r.current = i;
                }
                return o;
              }
            };
          t.exports = r;
        },
        { './merge': 128 }
      ],
      35: [
        function(e, t) {
          'use strict';
          var n = { current: null };
          t.exports = n;
        },
        {}
      ],
      36: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            var n = function(e) {
              this.construct(e);
            };
            (n.prototype = new o(t, e)), (n.prototype.constructor = n), (n.displayName = t);
            var i = r.createFactory(n);
            return i;
          }
          var r = e('./ReactDescriptor'),
            o = (e('./ReactDescriptorValidator'), e('./ReactDOMComponent')),
            i = e('./mergeInto'),
            a = e('./mapObject'),
            s = a(
              {
                a: !1,
                abbr: !1,
                address: !1,
                area: !0,
                article: !1,
                aside: !1,
                audio: !1,
                b: !1,
                base: !0,
                bdi: !1,
                bdo: !1,
                big: !1,
                blockquote: !1,
                body: !1,
                br: !0,
                button: !1,
                canvas: !1,
                caption: !1,
                cite: !1,
                code: !1,
                col: !0,
                colgroup: !1,
                data: !1,
                datalist: !1,
                dd: !1,
                del: !1,
                details: !1,
                dfn: !1,
                div: !1,
                dl: !1,
                dt: !1,
                em: !1,
                embed: !0,
                fieldset: !1,
                figcaption: !1,
                figure: !1,
                footer: !1,
                form: !1,
                h1: !1,
                h2: !1,
                h3: !1,
                h4: !1,
                h5: !1,
                h6: !1,
                head: !1,
                header: !1,
                hr: !0,
                html: !1,
                i: !1,
                iframe: !1,
                img: !0,
                input: !0,
                ins: !1,
                kbd: !1,
                keygen: !0,
                label: !1,
                legend: !1,
                li: !1,
                link: !0,
                main: !1,
                map: !1,
                mark: !1,
                menu: !1,
                menuitem: !1,
                meta: !0,
                meter: !1,
                nav: !1,
                noscript: !1,
                object: !1,
                ol: !1,
                optgroup: !1,
                option: !1,
                output: !1,
                p: !1,
                param: !0,
                pre: !1,
                progress: !1,
                q: !1,
                rp: !1,
                rt: !1,
                ruby: !1,
                s: !1,
                samp: !1,
                script: !1,
                section: !1,
                select: !1,
                small: !1,
                source: !0,
                span: !1,
                strong: !1,
                style: !1,
                sub: !1,
                summary: !1,
                sup: !1,
                table: !1,
                tbody: !1,
                td: !1,
                textarea: !1,
                tfoot: !1,
                th: !1,
                thead: !1,
                time: !1,
                title: !1,
                tr: !1,
                track: !0,
                u: !1,
                ul: !1,
                var: !1,
                video: !1,
                wbr: !0,
                circle: !1,
                defs: !1,
                ellipse: !1,
                g: !1,
                line: !1,
                linearGradient: !1,
                mask: !1,
                path: !1,
                pattern: !1,
                polygon: !1,
                polyline: !1,
                radialGradient: !1,
                rect: !1,
                stop: !1,
                svg: !1,
                text: !1,
                tspan: !1
              },
              n
            ),
            u = {
              injectComponentClasses: function(e) {
                i(s, e);
              }
            };
          (s.injection = u), (t.exports = s);
        },
        {
          './ReactDOMComponent': 38,
          './ReactDescriptor': 49,
          './ReactDescriptorValidator': 50,
          './mapObject': 126,
          './mergeInto': 130
        }
      ],
      37: [
        function(e, t) {
          'use strict';
          var n = e('./AutoFocusMixin'),
            r = e('./ReactBrowserComponentMixin'),
            o = e('./ReactCompositeComponent'),
            i = e('./ReactDOM'),
            a = e('./keyMirror'),
            s = i.button,
            u = a({
              onClick: !0,
              onDoubleClick: !0,
              onMouseDown: !0,
              onMouseMove: !0,
              onMouseUp: !0,
              onClickCapture: !0,
              onDoubleClickCapture: !0,
              onMouseDownCapture: !0,
              onMouseMoveCapture: !0,
              onMouseUpCapture: !0
            }),
            c = o.createClass({
              displayName: 'ReactDOMButton',
              mixins: [n, r],
              render: function() {
                var e = {};
                for (var t in this.props)
                  !this.props.hasOwnProperty(t) ||
                    (this.props.disabled && u[t]) ||
                    (e[t] = this.props[t]);
                return s(e, this.props.children);
              }
            });
          t.exports = c;
        },
        {
          './AutoFocusMixin': 1,
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36,
          './keyMirror': 124
        }
      ],
      38: [
        function(e, t) {
          'use strict';
          function n(e) {
            e &&
              (v(null == e.children || null == e.dangerouslySetInnerHTML),
              v(null == e.style || 'object' == typeof e.style));
          }
          function r(e, t, n, r) {
            var o = p.findReactContainerForID(e);
            if (o) {
              var i = o.nodeType === x ? o.ownerDocument : o;
              E(t, i);
            }
            r.getPutListenerQueue().enqueuePutListener(e, t, n);
          }
          function o(e, t) {
            (this._tagOpen = '<' + e),
              (this._tagClose = t ? '' : '</' + e + '>'),
              (this.tagName = e.toUpperCase());
          }
          var i = e('./CSSPropertyOperations'),
            a = e('./DOMProperty'),
            s = e('./DOMPropertyOperations'),
            u = e('./ReactBrowserComponentMixin'),
            c = e('./ReactComponent'),
            l = e('./ReactBrowserEventEmitter'),
            p = e('./ReactMount'),
            d = e('./ReactMultiChild'),
            f = e('./ReactPerf'),
            h = e('./escapeTextForBrowser'),
            v = e('./invariant'),
            m = e('./keyOf'),
            g = e('./merge'),
            y = e('./mixInto'),
            C = l.deleteListener,
            E = l.listenTo,
            R = l.registrationNameModules,
            M = { string: !0, number: !0 },
            D = m({ style: null }),
            x = 1;
          (o.Mixin = {
            mountComponent: f.measure('ReactDOMComponent', 'mountComponent', function(e, t, r) {
              return (
                c.Mixin.mountComponent.call(this, e, t, r),
                n(this.props),
                this._createOpenTagMarkupAndPutListeners(t) +
                  this._createContentMarkup(t) +
                  this._tagClose
              );
            }),
            _createOpenTagMarkupAndPutListeners: function(e) {
              var t = this.props,
                n = this._tagOpen;
              for (var o in t)
                if (t.hasOwnProperty(o)) {
                  var a = t[o];
                  if (null != a)
                    if (R.hasOwnProperty(o)) r(this._rootNodeID, o, a, e);
                    else {
                      o === D &&
                        (a && (a = t.style = g(t.style)), (a = i.createMarkupForStyles(a)));
                      var u = s.createMarkupForProperty(o, a);
                      u && (n += ' ' + u);
                    }
                }
              if (e.renderToStaticMarkup) return n + '>';
              var c = s.createMarkupForID(this._rootNodeID);
              return n + ' ' + c + '>';
            },
            _createContentMarkup: function(e) {
              var t = this.props.dangerouslySetInnerHTML;
              if (null != t) {
                if (null != t.__html) return t.__html;
              } else {
                var n = M[typeof this.props.children] ? this.props.children : null,
                  r = null != n ? null : this.props.children;
                if (null != n) return h(n);
                if (null != r) {
                  var o = this.mountChildren(r, e);
                  return o.join('');
                }
              }
              return '';
            },
            receiveComponent: function(e, t) {
              (e !== this._descriptor || null == e._owner) &&
                c.Mixin.receiveComponent.call(this, e, t);
            },
            updateComponent: f.measure('ReactDOMComponent', 'updateComponent', function(e, t) {
              n(this._descriptor.props),
                c.Mixin.updateComponent.call(this, e, t),
                this._updateDOMProperties(t.props, e),
                this._updateDOMChildren(t.props, e);
            }),
            _updateDOMProperties: function(e, t) {
              var n,
                o,
                i,
                s = this.props;
              for (n in e)
                if (!s.hasOwnProperty(n) && e.hasOwnProperty(n))
                  if (n === D) {
                    var u = e[n];
                    for (o in u) u.hasOwnProperty(o) && ((i = i || {}), (i[o] = ''));
                  } else
                    R.hasOwnProperty(n)
                      ? C(this._rootNodeID, n)
                      : (a.isStandardName[n] || a.isCustomAttribute(n)) &&
                        c.BackendIDOperations.deletePropertyByID(this._rootNodeID, n);
              for (n in s) {
                var l = s[n],
                  p = e[n];
                if (s.hasOwnProperty(n) && l !== p)
                  if (n === D)
                    if ((l && (l = s.style = g(l)), p)) {
                      for (o in p)
                        !p.hasOwnProperty(o) ||
                          (l && l.hasOwnProperty(o)) ||
                          ((i = i || {}), (i[o] = ''));
                      for (o in l)
                        l.hasOwnProperty(o) && p[o] !== l[o] && ((i = i || {}), (i[o] = l[o]));
                    } else i = l;
                  else
                    R.hasOwnProperty(n)
                      ? r(this._rootNodeID, n, l, t)
                      : (a.isStandardName[n] || a.isCustomAttribute(n)) &&
                        c.BackendIDOperations.updatePropertyByID(this._rootNodeID, n, l);
              }
              i && c.BackendIDOperations.updateStylesByID(this._rootNodeID, i);
            },
            _updateDOMChildren: function(e, t) {
              var n = this.props,
                r = M[typeof e.children] ? e.children : null,
                o = M[typeof n.children] ? n.children : null,
                i = e.dangerouslySetInnerHTML && e.dangerouslySetInnerHTML.__html,
                a = n.dangerouslySetInnerHTML && n.dangerouslySetInnerHTML.__html,
                s = null != r ? null : e.children,
                u = null != o ? null : n.children,
                l = null != r || null != i,
                p = null != o || null != a;
              null != s && null == u
                ? this.updateChildren(null, t)
                : l && !p && this.updateTextContent(''),
                null != o
                  ? r !== o && this.updateTextContent('' + o)
                  : null != a
                    ? i !== a && c.BackendIDOperations.updateInnerHTMLByID(this._rootNodeID, a)
                    : null != u && this.updateChildren(u, t);
            },
            unmountComponent: function() {
              this.unmountChildren(),
                l.deleteAllListeners(this._rootNodeID),
                c.Mixin.unmountComponent.call(this);
            }
          }),
            y(o, c.Mixin),
            y(o, o.Mixin),
            y(o, d.Mixin),
            y(o, u),
            (t.exports = o);
        },
        {
          './CSSPropertyOperations': 4,
          './DOMProperty': 10,
          './DOMPropertyOperations': 11,
          './ReactBrowserComponentMixin': 28,
          './ReactBrowserEventEmitter': 29,
          './ReactComponent': 31,
          './ReactMount': 59,
          './ReactMultiChild': 60,
          './ReactPerf': 63,
          './escapeTextForBrowser': 102,
          './invariant': 118,
          './keyOf': 125,
          './merge': 128,
          './mixInto': 131
        }
      ],
      39: [
        function(e, t) {
          'use strict';
          var n = e('./EventConstants'),
            r = e('./LocalEventTrapMixin'),
            o = e('./ReactBrowserComponentMixin'),
            i = e('./ReactCompositeComponent'),
            a = e('./ReactDOM'),
            s = a.form,
            u = i.createClass({
              displayName: 'ReactDOMForm',
              mixins: [o, r],
              render: function() {
                return this.transferPropsTo(s(null, this.props.children));
              },
              componentDidMount: function() {
                this.trapBubbledEvent(n.topLevelTypes.topReset, 'reset'),
                  this.trapBubbledEvent(n.topLevelTypes.topSubmit, 'submit');
              }
            });
          t.exports = u;
        },
        {
          './EventConstants': 15,
          './LocalEventTrapMixin': 24,
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36
        }
      ],
      40: [
        function(e, t) {
          'use strict';
          var n = e('./CSSPropertyOperations'),
            r = e('./DOMChildrenOperations'),
            o = e('./DOMPropertyOperations'),
            i = e('./ReactMount'),
            a = e('./ReactPerf'),
            s = e('./invariant'),
            u = e('./setInnerHTML'),
            c = {
              dangerouslySetInnerHTML:
                '`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.',
              style: '`style` must be set using `updateStylesByID()`.'
            },
            l = {
              updatePropertyByID: a.measure('ReactDOMIDOperations', 'updatePropertyByID', function(
                e,
                t,
                n
              ) {
                var r = i.getNode(e);
                s(!c.hasOwnProperty(t)),
                  null != n ? o.setValueForProperty(r, t, n) : o.deleteValueForProperty(r, t);
              }),
              deletePropertyByID: a.measure('ReactDOMIDOperations', 'deletePropertyByID', function(
                e,
                t,
                n
              ) {
                var r = i.getNode(e);
                s(!c.hasOwnProperty(t)), o.deleteValueForProperty(r, t, n);
              }),
              updateStylesByID: a.measure('ReactDOMIDOperations', 'updateStylesByID', function(
                e,
                t
              ) {
                var r = i.getNode(e);
                n.setValueForStyles(r, t);
              }),
              updateInnerHTMLByID: a.measure(
                'ReactDOMIDOperations',
                'updateInnerHTMLByID',
                function(e, t) {
                  var n = i.getNode(e);
                  u(n, t);
                }
              ),
              updateTextContentByID: a.measure(
                'ReactDOMIDOperations',
                'updateTextContentByID',
                function(e, t) {
                  var n = i.getNode(e);
                  r.updateTextContent(n, t);
                }
              ),
              dangerouslyReplaceNodeWithMarkupByID: a.measure(
                'ReactDOMIDOperations',
                'dangerouslyReplaceNodeWithMarkupByID',
                function(e, t) {
                  var n = i.getNode(e);
                  r.dangerouslyReplaceNodeWithMarkup(n, t);
                }
              ),
              dangerouslyProcessChildrenUpdates: a.measure(
                'ReactDOMIDOperations',
                'dangerouslyProcessChildrenUpdates',
                function(e, t) {
                  for (var n = 0; n < e.length; n++) e[n].parentNode = i.getNode(e[n].parentID);
                  r.processUpdates(e, t);
                }
              )
            };
          t.exports = l;
        },
        {
          './CSSPropertyOperations': 4,
          './DOMChildrenOperations': 9,
          './DOMPropertyOperations': 11,
          './ReactMount': 59,
          './ReactPerf': 63,
          './invariant': 118,
          './setInnerHTML': 134
        }
      ],
      41: [
        function(e, t) {
          'use strict';
          var n = e('./EventConstants'),
            r = e('./LocalEventTrapMixin'),
            o = e('./ReactBrowserComponentMixin'),
            i = e('./ReactCompositeComponent'),
            a = e('./ReactDOM'),
            s = a.img,
            u = i.createClass({
              displayName: 'ReactDOMImg',
              tagName: 'IMG',
              mixins: [o, r],
              render: function() {
                return s(this.props);
              },
              componentDidMount: function() {
                this.trapBubbledEvent(n.topLevelTypes.topLoad, 'load'),
                  this.trapBubbledEvent(n.topLevelTypes.topError, 'error');
              }
            });
          t.exports = u;
        },
        {
          './EventConstants': 15,
          './LocalEventTrapMixin': 24,
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36
        }
      ],
      42: [
        function(e, t) {
          'use strict';
          var n = e('./AutoFocusMixin'),
            r = e('./DOMPropertyOperations'),
            o = e('./LinkedValueUtils'),
            i = e('./ReactBrowserComponentMixin'),
            a = e('./ReactCompositeComponent'),
            s = e('./ReactDOM'),
            u = e('./ReactMount'),
            c = e('./invariant'),
            l = e('./merge'),
            p = s.input,
            d = {},
            f = a.createClass({
              displayName: 'ReactDOMInput',
              mixins: [n, o.Mixin, i],
              getInitialState: function() {
                var e = this.props.defaultValue;
                return { checked: this.props.defaultChecked || !1, value: null != e ? e : null };
              },
              shouldComponentUpdate: function() {
                return !this._isChanging;
              },
              render: function() {
                var e = l(this.props);
                (e.defaultChecked = null), (e.defaultValue = null);
                var t = o.getValue(this);
                e.value = null != t ? t : this.state.value;
                var n = o.getChecked(this);
                return (
                  (e.checked = null != n ? n : this.state.checked),
                  (e.onChange = this._handleChange),
                  p(e, this.props.children)
                );
              },
              componentDidMount: function() {
                var e = u.getID(this.getDOMNode());
                d[e] = this;
              },
              componentWillUnmount: function() {
                var e = this.getDOMNode(),
                  t = u.getID(e);
                delete d[t];
              },
              componentDidUpdate: function() {
                var e = this.getDOMNode();
                null != this.props.checked &&
                  r.setValueForProperty(e, 'checked', this.props.checked || !1);
                var t = o.getValue(this);
                null != t && r.setValueForProperty(e, 'value', '' + t);
              },
              _handleChange: function(e) {
                var t,
                  n = o.getOnChange(this);
                n && ((this._isChanging = !0), (t = n.call(this, e)), (this._isChanging = !1)),
                  this.setState({ checked: e.target.checked, value: e.target.value });
                var r = this.props.name;
                if ('radio' === this.props.type && null != r) {
                  for (var i = this.getDOMNode(), a = i; a.parentNode; ) a = a.parentNode;
                  for (
                    var s = a.querySelectorAll(
                        'input[name=' + JSON.stringify('' + r) + '][type="radio"]'
                      ),
                      l = 0,
                      p = s.length;
                    p > l;
                    l++
                  ) {
                    var f = s[l];
                    if (f !== i && f.form === i.form) {
                      var h = u.getID(f);
                      c(h);
                      var v = d[h];
                      c(v), v.setState({ checked: !1 });
                    }
                  }
                }
                return t;
              }
            });
          t.exports = f;
        },
        {
          './AutoFocusMixin': 1,
          './DOMPropertyOperations': 11,
          './LinkedValueUtils': 23,
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36,
          './ReactMount': 59,
          './invariant': 118,
          './merge': 128
        }
      ],
      43: [
        function(e, t) {
          'use strict';
          var n = e('./ReactBrowserComponentMixin'),
            r = e('./ReactCompositeComponent'),
            o = e('./ReactDOM'),
            i = (e('./warning'), o.option),
            a = r.createClass({
              displayName: 'ReactDOMOption',
              mixins: [n],
              componentWillMount: function() {},
              render: function() {
                return i(this.props, this.props.children);
              }
            });
          t.exports = a;
        },
        {
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36,
          './warning': 139
        }
      ],
      44: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            if (null != e[t])
              if (e.multiple) {
                if (!Array.isArray(e[t]))
                  return new Error(
                    'The `' +
                      t +
                      '` prop supplied to <select> must be an array if `multiple` is true.'
                  );
              } else if (Array.isArray(e[t]))
                return new Error(
                  'The `' +
                    t +
                    '` prop supplied to <select> must be a scalar value if `multiple` is false.'
                );
          }
          function r(e, t) {
            var n,
              r,
              o,
              i = e.props.multiple,
              a = null != t ? t : e.state.value,
              s = e.getDOMNode().options;
            if (i) for (n = {}, r = 0, o = a.length; o > r; ++r) n['' + a[r]] = !0;
            else n = '' + a;
            for (r = 0, o = s.length; o > r; r++) {
              var u = i ? n.hasOwnProperty(s[r].value) : s[r].value === n;
              u !== s[r].selected && (s[r].selected = u);
            }
          }
          var o = e('./AutoFocusMixin'),
            i = e('./LinkedValueUtils'),
            a = e('./ReactBrowserComponentMixin'),
            s = e('./ReactCompositeComponent'),
            u = e('./ReactDOM'),
            c = e('./merge'),
            l = u.select,
            p = s.createClass({
              displayName: 'ReactDOMSelect',
              mixins: [o, i.Mixin, a],
              propTypes: { defaultValue: n, value: n },
              getInitialState: function() {
                return { value: this.props.defaultValue || (this.props.multiple ? [] : '') };
              },
              componentWillReceiveProps: function(e) {
                !this.props.multiple && e.multiple
                  ? this.setState({ value: [this.state.value] })
                  : this.props.multiple &&
                    !e.multiple &&
                    this.setState({ value: this.state.value[0] });
              },
              shouldComponentUpdate: function() {
                return !this._isChanging;
              },
              render: function() {
                var e = c(this.props);
                return (
                  (e.onChange = this._handleChange), (e.value = null), l(e, this.props.children)
                );
              },
              componentDidMount: function() {
                r(this, i.getValue(this));
              },
              componentDidUpdate: function(e) {
                var t = i.getValue(this),
                  n = !!e.multiple,
                  o = !!this.props.multiple;
                (null != t || n !== o) && r(this, t);
              },
              _handleChange: function(e) {
                var t,
                  n = i.getOnChange(this);
                n && ((this._isChanging = !0), (t = n.call(this, e)), (this._isChanging = !1));
                var r;
                if (this.props.multiple) {
                  r = [];
                  for (var o = e.target.options, a = 0, s = o.length; s > a; a++)
                    o[a].selected && r.push(o[a].value);
                } else r = e.target.value;
                return this.setState({ value: r }), t;
              }
            });
          t.exports = p;
        },
        {
          './AutoFocusMixin': 1,
          './LinkedValueUtils': 23,
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36,
          './merge': 128
        }
      ],
      45: [
        function(e, t) {
          'use strict';
          function n(e, t, n, r) {
            return e === n && t === r;
          }
          function r(e) {
            var t = document.selection,
              n = t.createRange(),
              r = n.text.length,
              o = n.duplicate();
            o.moveToElementText(e), o.setEndPoint('EndToStart', n);
            var i = o.text.length,
              a = i + r;
            return { start: i, end: a };
          }
          function o(e) {
            var t = window.getSelection();
            if (0 === t.rangeCount) return null;
            var r = t.anchorNode,
              o = t.anchorOffset,
              i = t.focusNode,
              a = t.focusOffset,
              s = t.getRangeAt(0),
              u = n(t.anchorNode, t.anchorOffset, t.focusNode, t.focusOffset),
              c = u ? 0 : s.toString().length,
              l = s.cloneRange();
            l.selectNodeContents(e), l.setEnd(s.startContainer, s.startOffset);
            var p = n(l.startContainer, l.startOffset, l.endContainer, l.endOffset),
              d = p ? 0 : l.toString().length,
              f = d + c,
              h = document.createRange();
            h.setStart(r, o), h.setEnd(i, a);
            var v = h.collapsed;
            return h.detach(), { start: v ? f : d, end: v ? d : f };
          }
          function i(e, t) {
            var n,
              r,
              o = document.selection.createRange().duplicate();
            'undefined' == typeof t.end
              ? ((n = t.start), (r = n))
              : t.start > t.end ? ((n = t.end), (r = t.start)) : ((n = t.start), (r = t.end)),
              o.moveToElementText(e),
              o.moveStart('character', n),
              o.setEndPoint('EndToStart', o),
              o.moveEnd('character', r - n),
              o.select();
          }
          function a(e, t) {
            var n = window.getSelection(),
              r = e[c()].length,
              o = Math.min(t.start, r),
              i = 'undefined' == typeof t.end ? o : Math.min(t.end, r);
            if (!n.extend && o > i) {
              var a = i;
              (i = o), (o = a);
            }
            var s = u(e, o),
              l = u(e, i);
            if (s && l) {
              var p = document.createRange();
              p.setStart(s.node, s.offset),
                n.removeAllRanges(),
                o > i
                  ? (n.addRange(p), n.extend(l.node, l.offset))
                  : (p.setEnd(l.node, l.offset), n.addRange(p)),
                p.detach();
            }
          }
          var s = e('./ExecutionEnvironment'),
            u = e('./getNodeForCharacterOffset'),
            c = e('./getTextContentAccessor'),
            l = s.canUseDOM && document.selection,
            p = { getOffsets: l ? r : o, setOffsets: l ? i : a };
          t.exports = p;
        },
        {
          './ExecutionEnvironment': 21,
          './getNodeForCharacterOffset': 111,
          './getTextContentAccessor': 113
        }
      ],
      46: [
        function(e, t) {
          'use strict';
          var n = e('./AutoFocusMixin'),
            r = e('./DOMPropertyOperations'),
            o = e('./LinkedValueUtils'),
            i = e('./ReactBrowserComponentMixin'),
            a = e('./ReactCompositeComponent'),
            s = e('./ReactDOM'),
            u = e('./invariant'),
            c = e('./merge'),
            l = (e('./warning'), s.textarea),
            p = a.createClass({
              displayName: 'ReactDOMTextarea',
              mixins: [n, o.Mixin, i],
              getInitialState: function() {
                var e = this.props.defaultValue,
                  t = this.props.children;
                null != t &&
                  (u(null == e), Array.isArray(t) && (u(t.length <= 1), (t = t[0])), (e = '' + t)),
                  null == e && (e = '');
                var n = o.getValue(this);
                return { initialValue: '' + (null != n ? n : e) };
              },
              shouldComponentUpdate: function() {
                return !this._isChanging;
              },
              render: function() {
                var e = c(this.props);
                return (
                  u(null == e.dangerouslySetInnerHTML),
                  (e.defaultValue = null),
                  (e.value = null),
                  (e.onChange = this._handleChange),
                  l(e, this.state.initialValue)
                );
              },
              componentDidUpdate: function() {
                var e = o.getValue(this);
                if (null != e) {
                  var t = this.getDOMNode();
                  r.setValueForProperty(t, 'value', '' + e);
                }
              },
              _handleChange: function(e) {
                var t,
                  n = o.getOnChange(this);
                return (
                  n && ((this._isChanging = !0), (t = n.call(this, e)), (this._isChanging = !1)),
                  this.setState({ value: e.target.value }),
                  t
                );
              }
            });
          t.exports = p;
        },
        {
          './AutoFocusMixin': 1,
          './DOMPropertyOperations': 11,
          './LinkedValueUtils': 23,
          './ReactBrowserComponentMixin': 28,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36,
          './invariant': 118,
          './merge': 128,
          './warning': 139
        }
      ],
      47: [
        function(e, t) {
          'use strict';
          function n() {
            this.reinitializeTransaction();
          }
          var r = e('./ReactUpdates'),
            o = e('./Transaction'),
            i = e('./emptyFunction'),
            a = e('./mixInto'),
            s = {
              initialize: i,
              close: function() {
                p.isBatchingUpdates = !1;
              }
            },
            u = { initialize: i, close: r.flushBatchedUpdates.bind(r) },
            c = [u, s];
          a(n, o.Mixin),
            a(n, {
              getTransactionWrappers: function() {
                return c;
              }
            });
          var l = new n(),
            p = {
              isBatchingUpdates: !1,
              batchedUpdates: function(e, t, n) {
                var r = p.isBatchingUpdates;
                (p.isBatchingUpdates = !0), r ? e(t, n) : l.perform(e, null, t, n);
              }
            };
          t.exports = p;
        },
        { './ReactUpdates': 74, './Transaction': 90, './emptyFunction': 100, './mixInto': 131 }
      ],
      48: [
        function(e, t) {
          'use strict';
          function n() {
            x.EventEmitter.injectReactEventListener(D),
              x.EventPluginHub.injectEventPluginOrder(s),
              x.EventPluginHub.injectInstanceHandle(b),
              x.EventPluginHub.injectMount(O),
              x.EventPluginHub.injectEventPluginsByName({
                SimpleEventPlugin: _,
                EnterLeaveEventPlugin: u,
                ChangeEventPlugin: o,
                CompositionEventPlugin: a,
                MobileSafariClickEventPlugin: p,
                SelectEventPlugin: P,
                BeforeInputEventPlugin: r
              }),
              x.DOM.injectComponentClasses({
                button: m,
                form: g,
                img: y,
                input: C,
                option: E,
                select: R,
                textarea: M,
                html: N(v.html),
                head: N(v.head),
                body: N(v.body)
              }),
              x.CompositeComponent.injectMixin(d),
              x.DOMProperty.injectDOMPropertyConfig(l),
              x.DOMProperty.injectDOMPropertyConfig(T),
              x.EmptyComponent.injectEmptyComponent(v.noscript),
              x.Updates.injectReconcileTransaction(f.ReactReconcileTransaction),
              x.Updates.injectBatchingStrategy(h),
              x.RootIndex.injectCreateReactRootIndex(
                c.canUseDOM ? i.createReactRootIndex : I.createReactRootIndex
              ),
              x.Component.injectEnvironment(f);
          }
          var r = e('./BeforeInputEventPlugin'),
            o = e('./ChangeEventPlugin'),
            i = e('./ClientReactRootIndex'),
            a = e('./CompositionEventPlugin'),
            s = e('./DefaultEventPluginOrder'),
            u = e('./EnterLeaveEventPlugin'),
            c = e('./ExecutionEnvironment'),
            l = e('./HTMLDOMPropertyConfig'),
            p = e('./MobileSafariClickEventPlugin'),
            d = e('./ReactBrowserComponentMixin'),
            f = e('./ReactComponentBrowserEnvironment'),
            h = e('./ReactDefaultBatchingStrategy'),
            v = e('./ReactDOM'),
            m = e('./ReactDOMButton'),
            g = e('./ReactDOMForm'),
            y = e('./ReactDOMImg'),
            C = e('./ReactDOMInput'),
            E = e('./ReactDOMOption'),
            R = e('./ReactDOMSelect'),
            M = e('./ReactDOMTextarea'),
            D = e('./ReactEventListener'),
            x = e('./ReactInjection'),
            b = e('./ReactInstanceHandles'),
            O = e('./ReactMount'),
            P = e('./SelectEventPlugin'),
            I = e('./ServerReactRootIndex'),
            _ = e('./SimpleEventPlugin'),
            T = e('./SVGDOMPropertyConfig'),
            N = e('./createFullPageComponent');
          t.exports = { inject: n };
        },
        {
          './BeforeInputEventPlugin': 2,
          './ChangeEventPlugin': 6,
          './ClientReactRootIndex': 7,
          './CompositionEventPlugin': 8,
          './DefaultEventPluginOrder': 13,
          './EnterLeaveEventPlugin': 14,
          './ExecutionEnvironment': 21,
          './HTMLDOMPropertyConfig': 22,
          './MobileSafariClickEventPlugin': 25,
          './ReactBrowserComponentMixin': 28,
          './ReactComponentBrowserEnvironment': 32,
          './ReactDOM': 36,
          './ReactDOMButton': 37,
          './ReactDOMForm': 39,
          './ReactDOMImg': 41,
          './ReactDOMInput': 42,
          './ReactDOMOption': 43,
          './ReactDOMSelect': 44,
          './ReactDOMTextarea': 46,
          './ReactDefaultBatchingStrategy': 47,
          './ReactEventListener': 54,
          './ReactInjection': 55,
          './ReactInstanceHandles': 57,
          './ReactMount': 59,
          './SVGDOMPropertyConfig': 75,
          './SelectEventPlugin': 76,
          './ServerReactRootIndex': 77,
          './SimpleEventPlugin': 78,
          './createFullPageComponent': 97
        }
      ],
      49: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            if ('function' == typeof t)
              for (var n in t)
                if (t.hasOwnProperty(n)) {
                  var r = t[n];
                  if ('function' == typeof r) {
                    var o = r.bind(t);
                    for (var i in r) r.hasOwnProperty(i) && (o[i] = r[i]);
                    e[n] = o;
                  } else e[n] = r;
                }
          }
          var r = e('./ReactContext'),
            o = e('./ReactCurrentOwner'),
            i = e('./merge'),
            a = (e('./warning'), function() {});
          (a.createFactory = function(e) {
            var t = Object.create(a.prototype),
              s = function(e, n) {
                null == e ? (e = {}) : 'object' == typeof e && (e = i(e));
                var a = arguments.length - 1;
                if (1 === a) e.children = n;
                else if (a > 1) {
                  for (var s = Array(a), u = 0; a > u; u++) s[u] = arguments[u + 1];
                  e.children = s;
                }
                var c = Object.create(t);
                return (c._owner = o.current), (c._context = r.current), (c.props = e), c;
              };
            return (s.prototype = t), (s.type = e), (t.type = e), n(s, e), (t.constructor = s), s;
          }),
            (a.cloneAndReplaceProps = function(e, t) {
              var n = Object.create(e.constructor.prototype);
              return (n._owner = e._owner), (n._context = e._context), (n.props = t), n;
            }),
            (a.isValidFactory = function(e) {
              return 'function' == typeof e && e.prototype instanceof a;
            }),
            (a.isValidDescriptor = function(e) {
              return e instanceof a;
            }),
            (t.exports = a);
        },
        { './ReactContext': 34, './ReactCurrentOwner': 35, './merge': 128, './warning': 139 }
      ],
      50: [
        function(e, t) {
          'use strict';
          function n() {
            var e = p.current;
            return (e && e.constructor.displayName) || void 0;
          }
          function r(e, t) {
            e._store.validated ||
              null != e.props.key ||
              ((e._store.validated = !0),
              i(
                'react_key_warning',
                'Each child in an array should have a unique "key" prop.',
                e,
                t
              ));
          }
          function o(e, t, n) {
            m.test(e) &&
              i(
                'react_numeric_key_warning',
                'Child objects should have non-numeric keys so ordering is preserved.',
                t,
                n
              );
          }
          function i(e, t, r, o) {
            var i = n(),
              a = o.displayName,
              s = i || a,
              u = f[e];
            if (!u.hasOwnProperty(s)) {
              (u[s] = !0),
                (t += i
                  ? ' Check the render method of ' + i + '.'
                  : ' Check the renderComponent call using <' + a + '>.');
              var c = null;
              r._owner &&
                r._owner !== p.current &&
                ((c = r._owner.constructor.displayName),
                (t += ' It was passed a child from ' + c + '.')),
                (t += ' See http://fb.me/react-warning-keys for more information.'),
                d(e, { component: s, componentOwner: c }),
                console.warn(t);
            }
          }
          function a() {
            var e = n() || '';
            h.hasOwnProperty(e) || ((h[e] = !0), d('react_object_map_children'));
          }
          function s(e, t) {
            if (Array.isArray(e))
              for (var n = 0; n < e.length; n++) {
                var i = e[n];
                c.isValidDescriptor(i) && r(i, t);
              }
            else if (c.isValidDescriptor(e)) e._store.validated = !0;
            else if (e && 'object' == typeof e) {
              a();
              for (var s in e) o(s, e[s], t);
            }
          }
          function u(e, t, n, r) {
            for (var o in t)
              if (t.hasOwnProperty(o)) {
                var i;
                try {
                  i = t[o](n, o, e, r);
                } catch (a) {
                  i = a;
                }
                i instanceof Error &&
                  !(i.message in v) &&
                  ((v[i.message] = !0),
                  d('react_failed_descriptor_type_check', { message: i.message }));
              }
          }
          var c = e('./ReactDescriptor'),
            l = e('./ReactPropTypeLocations'),
            p = e('./ReactCurrentOwner'),
            d = e('./monitorCodeUse'),
            f = { react_key_warning: {}, react_numeric_key_warning: {} },
            h = {},
            v = {},
            m = /^\d+$/,
            g = {
              createFactory: function(e, t, n) {
                var r = function() {
                  for (var r = e.apply(this, arguments), o = 1; o < arguments.length; o++)
                    s(arguments[o], r.type);
                  var i = r.type.displayName;
                  return t && u(i, t, r.props, l.prop), n && u(i, n, r._context, l.context), r;
                };
                (r.prototype = e.prototype), (r.type = e.type);
                for (var o in e) e.hasOwnProperty(o) && (r[o] = e[o]);
                return r;
              }
            };
          t.exports = g;
        },
        {
          './ReactCurrentOwner': 35,
          './ReactDescriptor': 49,
          './ReactPropTypeLocations': 66,
          './monitorCodeUse': 132
        }
      ],
      51: [
        function(e, t) {
          'use strict';
          function n() {
            return s(a), a();
          }
          function r(e) {
            u[e] = !0;
          }
          function o(e) {
            delete u[e];
          }
          function i(e) {
            return u[e];
          }
          var a,
            s = e('./invariant'),
            u = {},
            c = {
              injectEmptyComponent: function(e) {
                a = e;
              }
            },
            l = {
              deregisterNullComponentID: o,
              getEmptyComponent: n,
              injection: c,
              isNullComponentID: i,
              registerNullComponentID: r
            };
          t.exports = l;
        },
        { './invariant': 118 }
      ],
      52: [
        function(e, t) {
          'use strict';
          var n = {
            guard: function(e) {
              return e;
            }
          };
          t.exports = n;
        },
        {}
      ],
      53: [
        function(e, t) {
          'use strict';
          function n(e) {
            r.enqueueEvents(e), r.processEventQueue();
          }
          var r = e('./EventPluginHub'),
            o = {
              handleTopLevel: function(e, t, o, i) {
                var a = r.extractEvents(e, t, o, i);
                n(a);
              }
            };
          t.exports = o;
        },
        { './EventPluginHub': 17 }
      ],
      54: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = l.getID(e),
              n = c.getReactRootIDFromNodeID(t),
              r = l.findReactContainerForID(n),
              o = l.getFirstReactDOM(r);
            return o;
          }
          function r(e, t) {
            (this.topLevelType = e), (this.nativeEvent = t), (this.ancestors = []);
          }
          function o(e) {
            for (var t = l.getFirstReactDOM(d(e.nativeEvent)) || window, r = t; r; )
              e.ancestors.push(r), (r = n(r));
            for (var o = 0, i = e.ancestors.length; i > o; o++) {
              t = e.ancestors[o];
              var a = l.getID(t) || '';
              v._handleTopLevel(e.topLevelType, t, a, e.nativeEvent);
            }
          }
          function i(e) {
            var t = f(window);
            e(t);
          }
          var a = e('./EventListener'),
            s = e('./ExecutionEnvironment'),
            u = e('./PooledClass'),
            c = e('./ReactInstanceHandles'),
            l = e('./ReactMount'),
            p = e('./ReactUpdates'),
            d = e('./getEventTarget'),
            f = e('./getUnboundedScrollPosition'),
            h = e('./mixInto');
          h(r, {
            destructor: function() {
              (this.topLevelType = null), (this.nativeEvent = null), (this.ancestors.length = 0);
            }
          }),
            u.addPoolingTo(r, u.twoArgumentPooler);
          var v = {
            _enabled: !0,
            _handleTopLevel: null,
            WINDOW_HANDLE: s.canUseDOM ? window : null,
            setHandleTopLevel: function(e) {
              v._handleTopLevel = e;
            },
            setEnabled: function(e) {
              v._enabled = !!e;
            },
            isEnabled: function() {
              return v._enabled;
            },
            trapBubbledEvent: function(e, t, n) {
              var r = n;
              return r ? a.listen(r, t, v.dispatchEvent.bind(null, e)) : void 0;
            },
            trapCapturedEvent: function(e, t, n) {
              var r = n;
              return r ? a.capture(r, t, v.dispatchEvent.bind(null, e)) : void 0;
            },
            monitorScrollValue: function(e) {
              var t = i.bind(null, e);
              a.listen(window, 'scroll', t), a.listen(window, 'resize', t);
            },
            dispatchEvent: function(e, t) {
              if (v._enabled) {
                var n = r.getPooled(e, t);
                try {
                  p.batchedUpdates(o, n);
                } finally {
                  r.release(n);
                }
              }
            }
          };
          t.exports = v;
        },
        {
          './EventListener': 16,
          './ExecutionEnvironment': 21,
          './PooledClass': 26,
          './ReactInstanceHandles': 57,
          './ReactMount': 59,
          './ReactUpdates': 74,
          './getEventTarget': 109,
          './getUnboundedScrollPosition': 114,
          './mixInto': 131
        }
      ],
      55: [
        function(e, t) {
          'use strict';
          var n = e('./DOMProperty'),
            r = e('./EventPluginHub'),
            o = e('./ReactComponent'),
            i = e('./ReactCompositeComponent'),
            a = e('./ReactDOM'),
            s = e('./ReactEmptyComponent'),
            u = e('./ReactBrowserEventEmitter'),
            c = e('./ReactPerf'),
            l = e('./ReactRootIndex'),
            p = e('./ReactUpdates'),
            d = {
              Component: o.injection,
              CompositeComponent: i.injection,
              DOMProperty: n.injection,
              EmptyComponent: s.injection,
              EventPluginHub: r.injection,
              DOM: a.injection,
              EventEmitter: u.injection,
              Perf: c.injection,
              RootIndex: l.injection,
              Updates: p.injection
            };
          t.exports = d;
        },
        {
          './DOMProperty': 10,
          './EventPluginHub': 17,
          './ReactBrowserEventEmitter': 29,
          './ReactComponent': 31,
          './ReactCompositeComponent': 33,
          './ReactDOM': 36,
          './ReactEmptyComponent': 51,
          './ReactPerf': 63,
          './ReactRootIndex': 70,
          './ReactUpdates': 74
        }
      ],
      56: [
        function(e, t) {
          'use strict';
          function n(e) {
            return o(document.documentElement, e);
          }
          var r = e('./ReactDOMSelection'),
            o = e('./containsNode'),
            i = e('./focusNode'),
            a = e('./getActiveElement'),
            s = {
              hasSelectionCapabilities: function(e) {
                return (
                  e &&
                  (('INPUT' === e.nodeName && 'text' === e.type) ||
                    'TEXTAREA' === e.nodeName ||
                    'true' === e.contentEditable)
                );
              },
              getSelectionInformation: function() {
                var e = a();
                return {
                  focusedElem: e,
                  selectionRange: s.hasSelectionCapabilities(e) ? s.getSelection(e) : null
                };
              },
              restoreSelection: function(e) {
                var t = a(),
                  r = e.focusedElem,
                  o = e.selectionRange;
                t !== r && n(r) && (s.hasSelectionCapabilities(r) && s.setSelection(r, o), i(r));
              },
              getSelection: function(e) {
                var t;
                if ('selectionStart' in e) t = { start: e.selectionStart, end: e.selectionEnd };
                else if (document.selection && 'INPUT' === e.nodeName) {
                  var n = document.selection.createRange();
                  n.parentElement() === e &&
                    (t = {
                      start: -n.moveStart('character', -e.value.length),
                      end: -n.moveEnd('character', -e.value.length)
                    });
                } else t = r.getOffsets(e);
                return t || { start: 0, end: 0 };
              },
              setSelection: function(e, t) {
                var n = t.start,
                  o = t.end;
                if (('undefined' == typeof o && (o = n), 'selectionStart' in e))
                  (e.selectionStart = n), (e.selectionEnd = Math.min(o, e.value.length));
                else if (document.selection && 'INPUT' === e.nodeName) {
                  var i = e.createTextRange();
                  i.collapse(!0),
                    i.moveStart('character', n),
                    i.moveEnd('character', o - n),
                    i.select();
                } else r.setOffsets(e, t);
              }
            };
          t.exports = s;
        },
        {
          './ReactDOMSelection': 45,
          './containsNode': 94,
          './focusNode': 104,
          './getActiveElement': 106
        }
      ],
      57: [
        function(e, t) {
          'use strict';
          function n(e) {
            return d + e.toString(36);
          }
          function r(e, t) {
            return e.charAt(t) === d || t === e.length;
          }
          function o(e) {
            return '' === e || (e.charAt(0) === d && e.charAt(e.length - 1) !== d);
          }
          function i(e, t) {
            return 0 === t.indexOf(e) && r(t, e.length);
          }
          function a(e) {
            return e ? e.substr(0, e.lastIndexOf(d)) : '';
          }
          function s(e, t) {
            if ((p(o(e) && o(t)), p(i(e, t)), e === t)) return e;
            for (var n = e.length + f, a = n; a < t.length && !r(t, a); a++);
            return t.substr(0, a);
          }
          function u(e, t) {
            var n = Math.min(e.length, t.length);
            if (0 === n) return '';
            for (var i = 0, a = 0; n >= a; a++)
              if (r(e, a) && r(t, a)) i = a;
              else if (e.charAt(a) !== t.charAt(a)) break;
            var s = e.substr(0, i);
            return p(o(s)), s;
          }
          function c(e, t, n, r, o, u) {
            (e = e || ''), (t = t || ''), p(e !== t);
            var c = i(t, e);
            p(c || i(e, t));
            for (var l = 0, d = c ? a : s, f = e; ; f = d(f, t)) {
              var v;
              if (((o && f === e) || (u && f === t) || (v = n(f, c, r)), v === !1 || f === t))
                break;
              p(l++ < h);
            }
          }
          var l = e('./ReactRootIndex'),
            p = e('./invariant'),
            d = '.',
            f = d.length,
            h = 100,
            v = {
              createReactRootID: function() {
                return n(l.createReactRootIndex());
              },
              createReactID: function(e, t) {
                return e + t;
              },
              getReactRootIDFromNodeID: function(e) {
                if (e && e.charAt(0) === d && e.length > 1) {
                  var t = e.indexOf(d, 1);
                  return t > -1 ? e.substr(0, t) : e;
                }
                return null;
              },
              traverseEnterLeave: function(e, t, n, r, o) {
                var i = u(e, t);
                i !== e && c(e, i, n, r, !1, !0), i !== t && c(i, t, n, o, !0, !1);
              },
              traverseTwoPhase: function(e, t, n) {
                e && (c('', e, t, n, !0, !1), c(e, '', t, n, !1, !0));
              },
              traverseAncestors: function(e, t, n) {
                c('', e, t, n, !0, !1);
              },
              _getFirstCommonAncestorID: u,
              _getNextDescendantID: s,
              isAncestorIDOf: i,
              SEPARATOR: d
            };
          t.exports = v;
        },
        { './ReactRootIndex': 70, './invariant': 118 }
      ],
      58: [
        function(e, t) {
          'use strict';
          var n = e('./adler32'),
            r = {
              CHECKSUM_ATTR_NAME: 'data-react-checksum',
              addChecksumToMarkup: function(e) {
                var t = n(e);
                return e.replace('>', ' ' + r.CHECKSUM_ATTR_NAME + '="' + t + '">');
              },
              canReuseMarkup: function(e, t) {
                var o = t.getAttribute(r.CHECKSUM_ATTR_NAME);
                o = o && parseInt(o, 10);
                var i = n(e);
                return i === o;
              }
            };
          t.exports = r;
        },
        { './adler32': 93 }
      ],
      59: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = g(e);
            return t && T.getID(t);
          }
          function r(e) {
            var t = o(e);
            if (t)
              if (D.hasOwnProperty(t)) {
                var n = D[t];
                n !== e && (C(!s(n, t)), (D[t] = e));
              } else D[t] = e;
            return t;
          }
          function o(e) {
            return (e && e.getAttribute && e.getAttribute(M)) || '';
          }
          function i(e, t) {
            var n = o(e);
            n !== t && delete D[n], e.setAttribute(M, t), (D[t] = e);
          }
          function a(e) {
            return (D.hasOwnProperty(e) && s(D[e], e)) || (D[e] = T.findReactNodeByID(e)), D[e];
          }
          function s(e, t) {
            if (e) {
              C(o(e) === t);
              var n = T.findReactContainerForID(t);
              if (n && m(n, e)) return !0;
            }
            return !1;
          }
          function u(e) {
            delete D[e];
          }
          function c(e) {
            var t = D[e];
            return t && s(t, e) ? void (_ = t) : !1;
          }
          function l(e) {
            (_ = null), h.traverseAncestors(e, c);
            var t = _;
            return (_ = null), t;
          }
          var p = e('./DOMProperty'),
            d = e('./ReactBrowserEventEmitter'),
            f = (e('./ReactCurrentOwner'), e('./ReactDescriptor')),
            h = e('./ReactInstanceHandles'),
            v = e('./ReactPerf'),
            m = e('./containsNode'),
            g = e('./getReactRootElementInContainer'),
            y = e('./instantiateReactComponent'),
            C = e('./invariant'),
            E = e('./shouldUpdateReactComponent'),
            R = (e('./warning'), h.SEPARATOR),
            M = p.ID_ATTRIBUTE_NAME,
            D = {},
            x = 1,
            b = 9,
            O = {},
            P = {},
            I = [],
            _ = null,
            T = {
              _instancesByReactRootID: O,
              scrollMonitor: function(e, t) {
                t();
              },
              _updateRootComponent: function(e, t, n, r) {
                var o = t.props;
                return (
                  T.scrollMonitor(n, function() {
                    e.replaceProps(o, r);
                  }),
                  e
                );
              },
              _registerComponent: function(e, t) {
                C(t && (t.nodeType === x || t.nodeType === b)), d.ensureScrollValueMonitoring();
                var n = T.registerContainer(t);
                return (O[n] = e), n;
              },
              _renderNewRootComponent: v.measure('ReactMount', '_renderNewRootComponent', function(
                e,
                t,
                n
              ) {
                var r = y(e),
                  o = T._registerComponent(r, t);
                return r.mountComponentIntoNode(o, t, n), r;
              }),
              renderComponent: function(e, t, r) {
                C(f.isValidDescriptor(e));
                var o = O[n(t)];
                if (o) {
                  var i = o._descriptor;
                  if (E(i, e)) return T._updateRootComponent(o, e, t, r);
                  T.unmountComponentAtNode(t);
                }
                var a = g(t),
                  s = a && T.isRenderedByReact(a),
                  u = s && !o,
                  c = T._renderNewRootComponent(e, t, u);
                return r && r.call(c), c;
              },
              constructAndRenderComponent: function(e, t, n) {
                return T.renderComponent(e(t), n);
              },
              constructAndRenderComponentByID: function(e, t, n) {
                var r = document.getElementById(n);
                return C(r), T.constructAndRenderComponent(e, t, r);
              },
              registerContainer: function(e) {
                var t = n(e);
                return (
                  t && (t = h.getReactRootIDFromNodeID(t)),
                  t || (t = h.createReactRootID()),
                  (P[t] = e),
                  t
                );
              },
              unmountComponentAtNode: function(e) {
                var t = n(e),
                  r = O[t];
                return r ? (T.unmountComponentFromNode(r, e), delete O[t], delete P[t], !0) : !1;
              },
              unmountComponentFromNode: function(e, t) {
                for (
                  e.unmountComponent(), t.nodeType === b && (t = t.documentElement);
                  t.lastChild;

                )
                  t.removeChild(t.lastChild);
              },
              findReactContainerForID: function(e) {
                var t = h.getReactRootIDFromNodeID(e),
                  n = P[t];
                return n;
              },
              findReactNodeByID: function(e) {
                var t = T.findReactContainerForID(e);
                return T.findComponentRoot(t, e);
              },
              isRenderedByReact: function(e) {
                if (1 !== e.nodeType) return !1;
                var t = T.getID(e);
                return t ? t.charAt(0) === R : !1;
              },
              getFirstReactDOM: function(e) {
                for (var t = e; t && t.parentNode !== t; ) {
                  if (T.isRenderedByReact(t)) return t;
                  t = t.parentNode;
                }
                return null;
              },
              findComponentRoot: function(e, t) {
                var n = I,
                  r = 0,
                  o = l(t) || e;
                for (n[0] = o.firstChild, n.length = 1; r < n.length; ) {
                  for (var i, a = n[r++]; a; ) {
                    var s = T.getID(a);
                    s
                      ? t === s
                        ? (i = a)
                        : h.isAncestorIDOf(s, t) && ((n.length = r = 0), n.push(a.firstChild))
                      : n.push(a.firstChild),
                      (a = a.nextSibling);
                  }
                  if (i) return (n.length = 0), i;
                }
                (n.length = 0), C(!1);
              },
              getReactRootID: n,
              getID: r,
              setID: i,
              getNode: a,
              purgeID: u
            };
          t.exports = T;
        },
        {
          './DOMProperty': 10,
          './ReactBrowserEventEmitter': 29,
          './ReactCurrentOwner': 35,
          './ReactDescriptor': 49,
          './ReactInstanceHandles': 57,
          './ReactPerf': 63,
          './containsNode': 94,
          './getReactRootElementInContainer': 112,
          './instantiateReactComponent': 117,
          './invariant': 118,
          './shouldUpdateReactComponent': 136,
          './warning': 139
        }
      ],
      60: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            h.push({
              parentID: e,
              parentNode: null,
              type: c.INSERT_MARKUP,
              markupIndex: v.push(t) - 1,
              textContent: null,
              fromIndex: null,
              toIndex: n
            });
          }
          function r(e, t, n) {
            h.push({
              parentID: e,
              parentNode: null,
              type: c.MOVE_EXISTING,
              markupIndex: null,
              textContent: null,
              fromIndex: t,
              toIndex: n
            });
          }
          function o(e, t) {
            h.push({
              parentID: e,
              parentNode: null,
              type: c.REMOVE_NODE,
              markupIndex: null,
              textContent: null,
              fromIndex: t,
              toIndex: null
            });
          }
          function i(e, t) {
            h.push({
              parentID: e,
              parentNode: null,
              type: c.TEXT_CONTENT,
              markupIndex: null,
              textContent: t,
              fromIndex: null,
              toIndex: null
            });
          }
          function a() {
            h.length && (u.BackendIDOperations.dangerouslyProcessChildrenUpdates(h, v), s());
          }
          function s() {
            (h.length = 0), (v.length = 0);
          }
          var u = e('./ReactComponent'),
            c = e('./ReactMultiChildUpdateTypes'),
            l = e('./flattenChildren'),
            p = e('./instantiateReactComponent'),
            d = e('./shouldUpdateReactComponent'),
            f = 0,
            h = [],
            v = [],
            m = {
              Mixin: {
                mountChildren: function(e, t) {
                  var n = l(e),
                    r = [],
                    o = 0;
                  this._renderedChildren = n;
                  for (var i in n) {
                    var a = n[i];
                    if (n.hasOwnProperty(i)) {
                      var s = p(a);
                      n[i] = s;
                      var u = this._rootNodeID + i,
                        c = s.mountComponent(u, t, this._mountDepth + 1);
                      (s._mountIndex = o), r.push(c), o++;
                    }
                  }
                  return r;
                },
                updateTextContent: function(e) {
                  f++;
                  var t = !0;
                  try {
                    var n = this._renderedChildren;
                    for (var r in n) n.hasOwnProperty(r) && this._unmountChildByName(n[r], r);
                    this.setTextContent(e), (t = !1);
                  } finally {
                    f--, f || (t ? s() : a());
                  }
                },
                updateChildren: function(e, t) {
                  f++;
                  var n = !0;
                  try {
                    this._updateChildren(e, t), (n = !1);
                  } finally {
                    f--, f || (n ? s() : a());
                  }
                },
                _updateChildren: function(e, t) {
                  var n = l(e),
                    r = this._renderedChildren;
                  if (n || r) {
                    var o,
                      i = 0,
                      a = 0;
                    for (o in n)
                      if (n.hasOwnProperty(o)) {
                        var s = r && r[o],
                          u = s && s._descriptor,
                          c = n[o];
                        if (d(u, c))
                          this.moveChild(s, a, i),
                            (i = Math.max(s._mountIndex, i)),
                            s.receiveComponent(c, t),
                            (s._mountIndex = a);
                        else {
                          s && ((i = Math.max(s._mountIndex, i)), this._unmountChildByName(s, o));
                          var f = p(c);
                          this._mountChildByNameAtIndex(f, o, a, t);
                        }
                        a++;
                      }
                    for (o in r)
                      !r.hasOwnProperty(o) || (n && n[o]) || this._unmountChildByName(r[o], o);
                  }
                },
                unmountChildren: function() {
                  var e = this._renderedChildren;
                  for (var t in e) {
                    var n = e[t];
                    n.unmountComponent && n.unmountComponent();
                  }
                  this._renderedChildren = null;
                },
                moveChild: function(e, t, n) {
                  e._mountIndex < n && r(this._rootNodeID, e._mountIndex, t);
                },
                createChild: function(e, t) {
                  n(this._rootNodeID, t, e._mountIndex);
                },
                removeChild: function(e) {
                  o(this._rootNodeID, e._mountIndex);
                },
                setTextContent: function(e) {
                  i(this._rootNodeID, e);
                },
                _mountChildByNameAtIndex: function(e, t, n, r) {
                  var o = this._rootNodeID + t,
                    i = e.mountComponent(o, r, this._mountDepth + 1);
                  (e._mountIndex = n),
                    this.createChild(e, i),
                    (this._renderedChildren = this._renderedChildren || {}),
                    (this._renderedChildren[t] = e);
                },
                _unmountChildByName: function(e, t) {
                  this.removeChild(e),
                    (e._mountIndex = null),
                    e.unmountComponent(),
                    delete this._renderedChildren[t];
                }
              }
            };
          t.exports = m;
        },
        {
          './ReactComponent': 31,
          './ReactMultiChildUpdateTypes': 61,
          './flattenChildren': 103,
          './instantiateReactComponent': 117,
          './shouldUpdateReactComponent': 136
        }
      ],
      61: [
        function(e, t) {
          'use strict';
          var n = e('./keyMirror'),
            r = n({
              INSERT_MARKUP: null,
              MOVE_EXISTING: null,
              REMOVE_NODE: null,
              TEXT_CONTENT: null
            });
          t.exports = r;
        },
        { './keyMirror': 124 }
      ],
      62: [
        function(e, t) {
          'use strict';
          var n = e('./emptyObject'),
            r = e('./invariant'),
            o = {
              isValidOwner: function(e) {
                return !(
                  !e ||
                  'function' != typeof e.attachRef ||
                  'function' != typeof e.detachRef
                );
              },
              addComponentAsRefTo: function(e, t, n) {
                r(o.isValidOwner(n)), n.attachRef(t, e);
              },
              removeComponentAsRefFrom: function(e, t, n) {
                r(o.isValidOwner(n)), n.refs[t] === e && n.detachRef(t);
              },
              Mixin: {
                construct: function() {
                  this.refs = n;
                },
                attachRef: function(e, t) {
                  r(t.isOwnedBy(this));
                  var o = this.refs === n ? (this.refs = {}) : this.refs;
                  o[e] = t;
                },
                detachRef: function(e) {
                  delete this.refs[e];
                }
              }
            };
          t.exports = o;
        },
        { './emptyObject': 101, './invariant': 118 }
      ],
      63: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            return n;
          }
          var r = {
            enableMeasure: !1,
            storedMeasure: n,
            measure: function(e, t, n) {
              return n;
            },
            injection: {
              injectMeasure: function(e) {
                r.storedMeasure = e;
              }
            }
          };
          t.exports = r;
        },
        {}
      ],
      64: [
        function(e, t) {
          'use strict';
          function n(e) {
            return function(t, n, r) {
              t[n] = t.hasOwnProperty(n) ? e(t[n], r) : r;
            };
          }
          function r(e, t) {
            for (var n in t)
              if (t.hasOwnProperty(n)) {
                var r = c[n];
                r && c.hasOwnProperty(n) ? r(e, n, t[n]) : e.hasOwnProperty(n) || (e[n] = t[n]);
              }
            return e;
          }
          var o = e('./emptyFunction'),
            i = e('./invariant'),
            a = e('./joinClasses'),
            s = e('./merge'),
            u = n(function(e, t) {
              return s(t, e);
            }),
            c = { children: o, className: n(a), key: o, ref: o, style: u },
            l = {
              TransferStrategies: c,
              mergeProps: function(e, t) {
                return r(s(e), t);
              },
              Mixin: {
                transferPropsTo: function(e) {
                  return i(e._owner === this), r(e.props, this.props), e;
                }
              }
            };
          t.exports = l;
        },
        { './emptyFunction': 100, './invariant': 118, './joinClasses': 123, './merge': 128 }
      ],
      65: [
        function(e, t) {
          'use strict';
          var n = {};
          t.exports = n;
        },
        {}
      ],
      66: [
        function(e, t) {
          'use strict';
          var n = e('./keyMirror'),
            r = n({ prop: null, context: null, childContext: null });
          t.exports = r;
        },
        { './keyMirror': 124 }
      ],
      67: [
        function(e, t) {
          'use strict';
          function n(e) {
            function t(t, n, r, o, i) {
              if (((o = o || C), null != n[r])) return e(n, r, o, i);
              var a = g[i];
              return t
                ? new Error(
                    'Required ' + a + ' `' + r + '` was not specified in ' + ('`' + o + '`.')
                  )
                : void 0;
            }
            var n = t.bind(null, !1);
            return (n.isRequired = t.bind(null, !0)), n;
          }
          function r(e) {
            function t(t, n, r, o) {
              var i = t[n],
                a = h(i);
              if (a !== e) {
                var s = g[o],
                  u = v(i);
                return new Error(
                  'Invalid ' +
                    s +
                    ' `' +
                    n +
                    '` of type `' +
                    u +
                    '` ' +
                    ('supplied to `' + r + '`, expected `' + e + '`.')
                );
              }
            }
            return n(t);
          }
          function o() {
            return n(y.thatReturns());
          }
          function i(e) {
            function t(t, n, r, o) {
              var i = t[n];
              if (!Array.isArray(i)) {
                var a = g[o],
                  s = h(i);
                return new Error(
                  'Invalid ' +
                    a +
                    ' `' +
                    n +
                    '` of type ' +
                    ('`' + s + '` supplied to `' + r + '`, expected an array.')
                );
              }
              for (var u = 0; u < i.length; u++) {
                var c = e(i, u, r, o);
                if (c instanceof Error) return c;
              }
            }
            return n(t);
          }
          function a() {
            function e(e, t, n, r) {
              if (!m.isValidDescriptor(e[t])) {
                var o = g[r];
                return new Error(
                  'Invalid ' +
                    o +
                    ' `' +
                    t +
                    '` supplied to ' +
                    ('`' + n + '`, expected a React component.')
                );
              }
            }
            return n(e);
          }
          function s(e) {
            function t(t, n, r, o) {
              if (!(t[n] instanceof e)) {
                var i = g[o],
                  a = e.name || C;
                return new Error(
                  'Invalid ' +
                    i +
                    ' `' +
                    n +
                    '` supplied to ' +
                    ('`' + r + '`, expected instance of `' + a + '`.')
                );
              }
            }
            return n(t);
          }
          function u(e) {
            function t(t, n, r, o) {
              for (var i = t[n], a = 0; a < e.length; a++) if (i === e[a]) return;
              var s = g[o],
                u = JSON.stringify(e);
              return new Error(
                'Invalid ' +
                  s +
                  ' `' +
                  n +
                  '` of value `' +
                  i +
                  '` ' +
                  ('supplied to `' + r + '`, expected one of ' + u + '.')
              );
            }
            return n(t);
          }
          function c(e) {
            function t(t, n, r, o) {
              var i = t[n],
                a = h(i);
              if ('object' !== a) {
                var s = g[o];
                return new Error(
                  'Invalid ' +
                    s +
                    ' `' +
                    n +
                    '` of type ' +
                    ('`' + a + '` supplied to `' + r + '`, expected an object.')
                );
              }
              for (var u in i)
                if (i.hasOwnProperty(u)) {
                  var c = e(i, u, r, o);
                  if (c instanceof Error) return c;
                }
            }
            return n(t);
          }
          function l(e) {
            function t(t, n, r, o) {
              for (var i = 0; i < e.length; i++) {
                var a = e[i];
                if (null == a(t, n, r, o)) return;
              }
              var s = g[o];
              return new Error('Invalid ' + s + ' `' + n + '` supplied to ' + ('`' + r + '`.'));
            }
            return n(t);
          }
          function p() {
            function e(e, t, n, r) {
              if (!f(e[t])) {
                var o = g[r];
                return new Error(
                  'Invalid ' +
                    o +
                    ' `' +
                    t +
                    '` supplied to ' +
                    ('`' + n + '`, expected a renderable prop.')
                );
              }
            }
            return n(e);
          }
          function d(e) {
            function t(t, n, r, o) {
              var i = t[n],
                a = h(i);
              if ('object' !== a) {
                var s = g[o];
                return new Error(
                  'Invalid ' +
                    s +
                    ' `' +
                    n +
                    '` of type `' +
                    a +
                    '` ' +
                    ('supplied to `' + r + '`, expected `object`.')
                );
              }
              for (var u in e) {
                var c = e[u];
                if (c) {
                  var l = c(i, u, r, o);
                  if (l) return l;
                }
              }
            }
            return n(t, 'expected `object`');
          }
          function f(e) {
            switch (typeof e) {
              case 'number':
              case 'string':
                return !0;
              case 'boolean':
                return !e;
              case 'object':
                if (Array.isArray(e)) return e.every(f);
                if (m.isValidDescriptor(e)) return !0;
                for (var t in e) if (!f(e[t])) return !1;
                return !0;
              default:
                return !1;
            }
          }
          function h(e) {
            var t = typeof e;
            return Array.isArray(e) ? 'array' : e instanceof RegExp ? 'object' : t;
          }
          function v(e) {
            var t = h(e);
            if ('object' === t) {
              if (e instanceof Date) return 'date';
              if (e instanceof RegExp) return 'regexp';
            }
            return t;
          }
          var m = e('./ReactDescriptor'),
            g = e('./ReactPropTypeLocationNames'),
            y = e('./emptyFunction'),
            C = '<<anonymous>>',
            E = {
              array: r('array'),
              bool: r('boolean'),
              func: r('function'),
              number: r('number'),
              object: r('object'),
              string: r('string'),
              any: o(),
              arrayOf: i,
              component: a(),
              instanceOf: s,
              objectOf: c,
              oneOf: u,
              oneOfType: l,
              renderable: p(),
              shape: d
            };
          t.exports = E;
        },
        { './ReactDescriptor': 49, './ReactPropTypeLocationNames': 65, './emptyFunction': 100 }
      ],
      68: [
        function(e, t) {
          'use strict';
          function n() {
            this.listenersToPut = [];
          }
          var r = e('./PooledClass'),
            o = e('./ReactBrowserEventEmitter'),
            i = e('./mixInto');
          i(n, {
            enqueuePutListener: function(e, t, n) {
              this.listenersToPut.push({ rootNodeID: e, propKey: t, propValue: n });
            },
            putListeners: function() {
              for (var e = 0; e < this.listenersToPut.length; e++) {
                var t = this.listenersToPut[e];
                o.putListener(t.rootNodeID, t.propKey, t.propValue);
              }
            },
            reset: function() {
              this.listenersToPut.length = 0;
            },
            destructor: function() {
              this.reset();
            }
          }),
            r.addPoolingTo(n),
            (t.exports = n);
        },
        { './PooledClass': 26, './ReactBrowserEventEmitter': 29, './mixInto': 131 }
      ],
      69: [
        function(e, t) {
          'use strict';
          function n() {
            this.reinitializeTransaction(),
              (this.renderToStaticMarkup = !1),
              (this.reactMountReady = r.getPooled(null)),
              (this.putListenerQueue = s.getPooled());
          }
          var r = e('./CallbackQueue'),
            o = e('./PooledClass'),
            i = e('./ReactBrowserEventEmitter'),
            a = e('./ReactInputSelection'),
            s = e('./ReactPutListenerQueue'),
            u = e('./Transaction'),
            c = e('./mixInto'),
            l = { initialize: a.getSelectionInformation, close: a.restoreSelection },
            p = {
              initialize: function() {
                var e = i.isEnabled();
                return i.setEnabled(!1), e;
              },
              close: function(e) {
                i.setEnabled(e);
              }
            },
            d = {
              initialize: function() {
                this.reactMountReady.reset();
              },
              close: function() {
                this.reactMountReady.notifyAll();
              }
            },
            f = {
              initialize: function() {
                this.putListenerQueue.reset();
              },
              close: function() {
                this.putListenerQueue.putListeners();
              }
            },
            h = [f, l, p, d],
            v = {
              getTransactionWrappers: function() {
                return h;
              },
              getReactMountReady: function() {
                return this.reactMountReady;
              },
              getPutListenerQueue: function() {
                return this.putListenerQueue;
              },
              destructor: function() {
                r.release(this.reactMountReady),
                  (this.reactMountReady = null),
                  s.release(this.putListenerQueue),
                  (this.putListenerQueue = null);
              }
            };
          c(n, u.Mixin), c(n, v), o.addPoolingTo(n), (t.exports = n);
        },
        {
          './CallbackQueue': 5,
          './PooledClass': 26,
          './ReactBrowserEventEmitter': 29,
          './ReactInputSelection': 56,
          './ReactPutListenerQueue': 68,
          './Transaction': 90,
          './mixInto': 131
        }
      ],
      70: [
        function(e, t) {
          'use strict';
          var n = {
              injectCreateReactRootIndex: function(e) {
                r.createReactRootIndex = e;
              }
            },
            r = { createReactRootIndex: null, injection: n };
          t.exports = r;
        },
        {}
      ],
      71: [
        function(e, t) {
          'use strict';
          function n(e) {
            c(o.isValidDescriptor(e)),
              c(!(2 === arguments.length && 'function' == typeof arguments[1]));
            var t;
            try {
              var n = i.createReactRootID();
              return (
                (t = s.getPooled(!1)),
                t.perform(function() {
                  var r = u(e),
                    o = r.mountComponent(n, t, 0);
                  return a.addChecksumToMarkup(o);
                }, null)
              );
            } finally {
              s.release(t);
            }
          }
          function r(e) {
            c(o.isValidDescriptor(e));
            var t;
            try {
              var n = i.createReactRootID();
              return (
                (t = s.getPooled(!0)),
                t.perform(function() {
                  var r = u(e);
                  return r.mountComponent(n, t, 0);
                }, null)
              );
            } finally {
              s.release(t);
            }
          }
          var o = e('./ReactDescriptor'),
            i = e('./ReactInstanceHandles'),
            a = e('./ReactMarkupChecksum'),
            s = e('./ReactServerRenderingTransaction'),
            u = e('./instantiateReactComponent'),
            c = e('./invariant');
          t.exports = { renderComponentToString: n, renderComponentToStaticMarkup: r };
        },
        {
          './ReactDescriptor': 49,
          './ReactInstanceHandles': 57,
          './ReactMarkupChecksum': 58,
          './ReactServerRenderingTransaction': 72,
          './instantiateReactComponent': 117,
          './invariant': 118
        }
      ],
      72: [
        function(e, t) {
          'use strict';
          function n(e) {
            this.reinitializeTransaction(),
              (this.renderToStaticMarkup = e),
              (this.reactMountReady = o.getPooled(null)),
              (this.putListenerQueue = i.getPooled());
          }
          var r = e('./PooledClass'),
            o = e('./CallbackQueue'),
            i = e('./ReactPutListenerQueue'),
            a = e('./Transaction'),
            s = e('./emptyFunction'),
            u = e('./mixInto'),
            c = {
              initialize: function() {
                this.reactMountReady.reset();
              },
              close: s
            },
            l = {
              initialize: function() {
                this.putListenerQueue.reset();
              },
              close: s
            },
            p = [l, c],
            d = {
              getTransactionWrappers: function() {
                return p;
              },
              getReactMountReady: function() {
                return this.reactMountReady;
              },
              getPutListenerQueue: function() {
                return this.putListenerQueue;
              },
              destructor: function() {
                o.release(this.reactMountReady),
                  (this.reactMountReady = null),
                  i.release(this.putListenerQueue),
                  (this.putListenerQueue = null);
              }
            };
          u(n, a.Mixin), u(n, d), r.addPoolingTo(n), (t.exports = n);
        },
        {
          './CallbackQueue': 5,
          './PooledClass': 26,
          './ReactPutListenerQueue': 68,
          './Transaction': 90,
          './emptyFunction': 100,
          './mixInto': 131
        }
      ],
      73: [
        function(e, t) {
          'use strict';
          var n = e('./DOMPropertyOperations'),
            r = e('./ReactBrowserComponentMixin'),
            o = e('./ReactComponent'),
            i = e('./ReactDescriptor'),
            a = e('./escapeTextForBrowser'),
            s = e('./mixInto'),
            u = function(e) {
              this.construct(e);
            };
          s(u, o.Mixin),
            s(u, r),
            s(u, {
              mountComponent: function(e, t, r) {
                o.Mixin.mountComponent.call(this, e, t, r);
                var i = a(this.props);
                return t.renderToStaticMarkup
                  ? i
                  : '<span ' + n.createMarkupForID(e) + '>' + i + '</span>';
              },
              receiveComponent: function(e) {
                var t = e.props;
                t !== this.props &&
                  ((this.props = t),
                  o.BackendIDOperations.updateTextContentByID(this._rootNodeID, t));
              }
            }),
            (t.exports = i.createFactory(u));
        },
        {
          './DOMPropertyOperations': 11,
          './ReactBrowserComponentMixin': 28,
          './ReactComponent': 31,
          './ReactDescriptor': 49,
          './escapeTextForBrowser': 102,
          './mixInto': 131
        }
      ],
      74: [
        function(e, t) {
          'use strict';
          function n() {
            d(R.ReactReconcileTransaction && v);
          }
          function r() {
            this.reinitializeTransaction(),
              (this.dirtyComponentsLength = null),
              (this.callbackQueue = u.getPooled(null)),
              (this.reconcileTransaction = R.ReactReconcileTransaction.getPooled());
          }
          function o(e, t, r) {
            n(), v.batchedUpdates(e, t, r);
          }
          function i(e, t) {
            return e._mountDepth - t._mountDepth;
          }
          function a(e) {
            var t = e.dirtyComponentsLength;
            d(t === h.length), h.sort(i);
            for (var n = 0; t > n; n++) {
              var r = h[n];
              if (r.isMounted()) {
                var o = r._pendingCallbacks;
                if (
                  ((r._pendingCallbacks = null),
                  r.performUpdateIfNecessary(e.reconcileTransaction),
                  o)
                )
                  for (var a = 0; a < o.length; a++) e.callbackQueue.enqueue(o[a], r);
              }
            }
          }
          function s(e, t) {
            return (
              d(!t || 'function' == typeof t),
              n(),
              v.isBatchingUpdates
                ? (h.push(e),
                  void (
                    t &&
                    (e._pendingCallbacks
                      ? e._pendingCallbacks.push(t)
                      : (e._pendingCallbacks = [t]))
                  ))
                : void v.batchedUpdates(s, e, t)
            );
          }
          var u = e('./CallbackQueue'),
            c = e('./PooledClass'),
            l = (e('./ReactCurrentOwner'), e('./ReactPerf')),
            p = e('./Transaction'),
            d = e('./invariant'),
            f = e('./mixInto'),
            h = (e('./warning'), []),
            v = null,
            m = {
              initialize: function() {
                this.dirtyComponentsLength = h.length;
              },
              close: function() {
                this.dirtyComponentsLength !== h.length
                  ? (h.splice(0, this.dirtyComponentsLength), C())
                  : (h.length = 0);
              }
            },
            g = {
              initialize: function() {
                this.callbackQueue.reset();
              },
              close: function() {
                this.callbackQueue.notifyAll();
              }
            },
            y = [m, g];
          f(r, p.Mixin),
            f(r, {
              getTransactionWrappers: function() {
                return y;
              },
              destructor: function() {
                (this.dirtyComponentsLength = null),
                  u.release(this.callbackQueue),
                  (this.callbackQueue = null),
                  R.ReactReconcileTransaction.release(this.reconcileTransaction),
                  (this.reconcileTransaction = null);
              },
              perform: function(e, t, n) {
                return p.Mixin.perform.call(
                  this,
                  this.reconcileTransaction.perform,
                  this.reconcileTransaction,
                  e,
                  t,
                  n
                );
              }
            }),
            c.addPoolingTo(r);
          var C = l.measure('ReactUpdates', 'flushBatchedUpdates', function() {
              for (; h.length; ) {
                var e = r.getPooled();
                e.perform(a, null, e), r.release(e);
              }
            }),
            E = {
              injectReconcileTransaction: function(e) {
                d(e), (R.ReactReconcileTransaction = e);
              },
              injectBatchingStrategy: function(e) {
                d(e),
                  d('function' == typeof e.batchedUpdates),
                  d('boolean' == typeof e.isBatchingUpdates),
                  (v = e);
              }
            },
            R = {
              ReactReconcileTransaction: null,
              batchedUpdates: o,
              enqueueUpdate: s,
              flushBatchedUpdates: C,
              injection: E
            };
          t.exports = R;
        },
        {
          './CallbackQueue': 5,
          './PooledClass': 26,
          './ReactCurrentOwner': 35,
          './ReactPerf': 63,
          './Transaction': 90,
          './invariant': 118,
          './mixInto': 131,
          './warning': 139
        }
      ],
      75: [
        function(e, t) {
          'use strict';
          var n = e('./DOMProperty'),
            r = n.injection.MUST_USE_ATTRIBUTE,
            o = {
              Properties: {
                cx: r,
                cy: r,
                d: r,
                dx: r,
                dy: r,
                fill: r,
                fillOpacity: r,
                fontFamily: r,
                fontSize: r,
                fx: r,
                fy: r,
                gradientTransform: r,
                gradientUnits: r,
                markerEnd: r,
                markerMid: r,
                markerStart: r,
                offset: r,
                opacity: r,
                patternContentUnits: r,
                patternUnits: r,
                points: r,
                preserveAspectRatio: r,
                r: r,
                rx: r,
                ry: r,
                spreadMethod: r,
                stopColor: r,
                stopOpacity: r,
                stroke: r,
                strokeDasharray: r,
                strokeLinecap: r,
                strokeOpacity: r,
                strokeWidth: r,
                textAnchor: r,
                transform: r,
                version: r,
                viewBox: r,
                x1: r,
                x2: r,
                x: r,
                y1: r,
                y2: r,
                y: r
              },
              DOMAttributeNames: {
                fillOpacity: 'fill-opacity',
                fontFamily: 'font-family',
                fontSize: 'font-size',
                gradientTransform: 'gradientTransform',
                gradientUnits: 'gradientUnits',
                markerEnd: 'marker-end',
                markerMid: 'marker-mid',
                markerStart: 'marker-start',
                patternContentUnits: 'patternContentUnits',
                patternUnits: 'patternUnits',
                preserveAspectRatio: 'preserveAspectRatio',
                spreadMethod: 'spreadMethod',
                stopColor: 'stop-color',
                stopOpacity: 'stop-opacity',
                strokeDasharray: 'stroke-dasharray',
                strokeLinecap: 'stroke-linecap',
                strokeOpacity: 'stroke-opacity',
                strokeWidth: 'stroke-width',
                textAnchor: 'text-anchor',
                viewBox: 'viewBox'
              }
            };
          t.exports = o;
        },
        { './DOMProperty': 10 }
      ],
      76: [
        function(e, t) {
          'use strict';
          function n(e) {
            if ('selectionStart' in e && a.hasSelectionCapabilities(e))
              return { start: e.selectionStart, end: e.selectionEnd };
            if (document.selection) {
              var t = document.selection.createRange();
              return {
                parentElement: t.parentElement(),
                text: t.text,
                top: t.boundingTop,
                left: t.boundingLeft
              };
            }
            var n = window.getSelection();
            return {
              anchorNode: n.anchorNode,
              anchorOffset: n.anchorOffset,
              focusNode: n.focusNode,
              focusOffset: n.focusOffset
            };
          }
          function r(e) {
            if (!g && null != h && h == u()) {
              var t = n(h);
              if (!m || !p(m, t)) {
                m = t;
                var r = s.getPooled(f.select, v, e);
                return (r.type = 'select'), (r.target = h), i.accumulateTwoPhaseDispatches(r), r;
              }
            }
          }
          var o = e('./EventConstants'),
            i = e('./EventPropagators'),
            a = e('./ReactInputSelection'),
            s = e('./SyntheticEvent'),
            u = e('./getActiveElement'),
            c = e('./isTextInputElement'),
            l = e('./keyOf'),
            p = e('./shallowEqual'),
            d = o.topLevelTypes,
            f = {
              select: {
                phasedRegistrationNames: {
                  bubbled: l({ onSelect: null }),
                  captured: l({ onSelectCapture: null })
                },
                dependencies: [
                  d.topBlur,
                  d.topContextMenu,
                  d.topFocus,
                  d.topKeyDown,
                  d.topMouseDown,
                  d.topMouseUp,
                  d.topSelectionChange
                ]
              }
            },
            h = null,
            v = null,
            m = null,
            g = !1,
            y = {
              eventTypes: f,
              extractEvents: function(e, t, n, o) {
                switch (e) {
                  case d.topFocus:
                    (c(t) || 'true' === t.contentEditable) && ((h = t), (v = n), (m = null));
                    break;
                  case d.topBlur:
                    (h = null), (v = null), (m = null);
                    break;
                  case d.topMouseDown:
                    g = !0;
                    break;
                  case d.topContextMenu:
                  case d.topMouseUp:
                    return (g = !1), r(o);
                  case d.topSelectionChange:
                  case d.topKeyDown:
                  case d.topKeyUp:
                    return r(o);
                }
              }
            };
          t.exports = y;
        },
        {
          './EventConstants': 15,
          './EventPropagators': 20,
          './ReactInputSelection': 56,
          './SyntheticEvent': 82,
          './getActiveElement': 106,
          './isTextInputElement': 121,
          './keyOf': 125,
          './shallowEqual': 135
        }
      ],
      77: [
        function(e, t) {
          'use strict';
          var n = Math.pow(2, 53),
            r = {
              createReactRootIndex: function() {
                return Math.ceil(Math.random() * n);
              }
            };
          t.exports = r;
        },
        {}
      ],
      78: [
        function(e, t) {
          'use strict';
          var n = e('./EventConstants'),
            r = e('./EventPluginUtils'),
            o = e('./EventPropagators'),
            i = e('./SyntheticClipboardEvent'),
            a = e('./SyntheticEvent'),
            s = e('./SyntheticFocusEvent'),
            u = e('./SyntheticKeyboardEvent'),
            c = e('./SyntheticMouseEvent'),
            l = e('./SyntheticDragEvent'),
            p = e('./SyntheticTouchEvent'),
            d = e('./SyntheticUIEvent'),
            f = e('./SyntheticWheelEvent'),
            h = e('./invariant'),
            v = e('./keyOf'),
            m = n.topLevelTypes,
            g = {
              blur: {
                phasedRegistrationNames: {
                  bubbled: v({ onBlur: !0 }),
                  captured: v({ onBlurCapture: !0 })
                }
              },
              click: {
                phasedRegistrationNames: {
                  bubbled: v({ onClick: !0 }),
                  captured: v({ onClickCapture: !0 })
                }
              },
              contextMenu: {
                phasedRegistrationNames: {
                  bubbled: v({ onContextMenu: !0 }),
                  captured: v({ onContextMenuCapture: !0 })
                }
              },
              copy: {
                phasedRegistrationNames: {
                  bubbled: v({ onCopy: !0 }),
                  captured: v({ onCopyCapture: !0 })
                }
              },
              cut: {
                phasedRegistrationNames: {
                  bubbled: v({ onCut: !0 }),
                  captured: v({ onCutCapture: !0 })
                }
              },
              doubleClick: {
                phasedRegistrationNames: {
                  bubbled: v({ onDoubleClick: !0 }),
                  captured: v({ onDoubleClickCapture: !0 })
                }
              },
              drag: {
                phasedRegistrationNames: {
                  bubbled: v({ onDrag: !0 }),
                  captured: v({ onDragCapture: !0 })
                }
              },
              dragEnd: {
                phasedRegistrationNames: {
                  bubbled: v({ onDragEnd: !0 }),
                  captured: v({ onDragEndCapture: !0 })
                }
              },
              dragEnter: {
                phasedRegistrationNames: {
                  bubbled: v({ onDragEnter: !0 }),
                  captured: v({ onDragEnterCapture: !0 })
                }
              },
              dragExit: {
                phasedRegistrationNames: {
                  bubbled: v({ onDragExit: !0 }),
                  captured: v({ onDragExitCapture: !0 })
                }
              },
              dragLeave: {
                phasedRegistrationNames: {
                  bubbled: v({ onDragLeave: !0 }),
                  captured: v({ onDragLeaveCapture: !0 })
                }
              },
              dragOver: {
                phasedRegistrationNames: {
                  bubbled: v({ onDragOver: !0 }),
                  captured: v({ onDragOverCapture: !0 })
                }
              },
              dragStart: {
                phasedRegistrationNames: {
                  bubbled: v({ onDragStart: !0 }),
                  captured: v({ onDragStartCapture: !0 })
                }
              },
              drop: {
                phasedRegistrationNames: {
                  bubbled: v({ onDrop: !0 }),
                  captured: v({ onDropCapture: !0 })
                }
              },
              focus: {
                phasedRegistrationNames: {
                  bubbled: v({ onFocus: !0 }),
                  captured: v({ onFocusCapture: !0 })
                }
              },
              input: {
                phasedRegistrationNames: {
                  bubbled: v({ onInput: !0 }),
                  captured: v({ onInputCapture: !0 })
                }
              },
              keyDown: {
                phasedRegistrationNames: {
                  bubbled: v({ onKeyDown: !0 }),
                  captured: v({ onKeyDownCapture: !0 })
                }
              },
              keyPress: {
                phasedRegistrationNames: {
                  bubbled: v({ onKeyPress: !0 }),
                  captured: v({ onKeyPressCapture: !0 })
                }
              },
              keyUp: {
                phasedRegistrationNames: {
                  bubbled: v({ onKeyUp: !0 }),
                  captured: v({ onKeyUpCapture: !0 })
                }
              },
              load: {
                phasedRegistrationNames: {
                  bubbled: v({ onLoad: !0 }),
                  captured: v({ onLoadCapture: !0 })
                }
              },
              error: {
                phasedRegistrationNames: {
                  bubbled: v({ onError: !0 }),
                  captured: v({ onErrorCapture: !0 })
                }
              },
              mouseDown: {
                phasedRegistrationNames: {
                  bubbled: v({ onMouseDown: !0 }),
                  captured: v({ onMouseDownCapture: !0 })
                }
              },
              mouseMove: {
                phasedRegistrationNames: {
                  bubbled: v({ onMouseMove: !0 }),
                  captured: v({ onMouseMoveCapture: !0 })
                }
              },
              mouseOut: {
                phasedRegistrationNames: {
                  bubbled: v({ onMouseOut: !0 }),
                  captured: v({ onMouseOutCapture: !0 })
                }
              },
              mouseOver: {
                phasedRegistrationNames: {
                  bubbled: v({ onMouseOver: !0 }),
                  captured: v({ onMouseOverCapture: !0 })
                }
              },
              mouseUp: {
                phasedRegistrationNames: {
                  bubbled: v({ onMouseUp: !0 }),
                  captured: v({ onMouseUpCapture: !0 })
                }
              },
              paste: {
                phasedRegistrationNames: {
                  bubbled: v({ onPaste: !0 }),
                  captured: v({ onPasteCapture: !0 })
                }
              },
              reset: {
                phasedRegistrationNames: {
                  bubbled: v({ onReset: !0 }),
                  captured: v({ onResetCapture: !0 })
                }
              },
              scroll: {
                phasedRegistrationNames: {
                  bubbled: v({ onScroll: !0 }),
                  captured: v({ onScrollCapture: !0 })
                }
              },
              submit: {
                phasedRegistrationNames: {
                  bubbled: v({ onSubmit: !0 }),
                  captured: v({ onSubmitCapture: !0 })
                }
              },
              touchCancel: {
                phasedRegistrationNames: {
                  bubbled: v({ onTouchCancel: !0 }),
                  captured: v({ onTouchCancelCapture: !0 })
                }
              },
              touchEnd: {
                phasedRegistrationNames: {
                  bubbled: v({ onTouchEnd: !0 }),
                  captured: v({ onTouchEndCapture: !0 })
                }
              },
              touchMove: {
                phasedRegistrationNames: {
                  bubbled: v({ onTouchMove: !0 }),
                  captured: v({ onTouchMoveCapture: !0 })
                }
              },
              touchStart: {
                phasedRegistrationNames: {
                  bubbled: v({ onTouchStart: !0 }),
                  captured: v({ onTouchStartCapture: !0 })
                }
              },
              wheel: {
                phasedRegistrationNames: {
                  bubbled: v({ onWheel: !0 }),
                  captured: v({ onWheelCapture: !0 })
                }
              }
            },
            y = {
              topBlur: g.blur,
              topClick: g.click,
              topContextMenu: g.contextMenu,
              topCopy: g.copy,
              topCut: g.cut,
              topDoubleClick: g.doubleClick,
              topDrag: g.drag,
              topDragEnd: g.dragEnd,
              topDragEnter: g.dragEnter,
              topDragExit: g.dragExit,
              topDragLeave: g.dragLeave,
              topDragOver: g.dragOver,
              topDragStart: g.dragStart,
              topDrop: g.drop,
              topError: g.error,
              topFocus: g.focus,
              topInput: g.input,
              topKeyDown: g.keyDown,
              topKeyPress: g.keyPress,
              topKeyUp: g.keyUp,
              topLoad: g.load,
              topMouseDown: g.mouseDown,
              topMouseMove: g.mouseMove,
              topMouseOut: g.mouseOut,
              topMouseOver: g.mouseOver,
              topMouseUp: g.mouseUp,
              topPaste: g.paste,
              topReset: g.reset,
              topScroll: g.scroll,
              topSubmit: g.submit,
              topTouchCancel: g.touchCancel,
              topTouchEnd: g.touchEnd,
              topTouchMove: g.touchMove,
              topTouchStart: g.touchStart,
              topWheel: g.wheel
            };
          for (var C in y) y[C].dependencies = [C];
          var E = {
            eventTypes: g,
            executeDispatch: function(e, t, n) {
              var o = r.executeDispatch(e, t, n);
              o === !1 && (e.stopPropagation(), e.preventDefault());
            },
            extractEvents: function(e, t, n, r) {
              var v = y[e];
              if (!v) return null;
              var g;
              switch (e) {
                case m.topInput:
                case m.topLoad:
                case m.topError:
                case m.topReset:
                case m.topSubmit:
                  g = a;
                  break;
                case m.topKeyPress:
                  if (0 === r.charCode) return null;
                case m.topKeyDown:
                case m.topKeyUp:
                  g = u;
                  break;
                case m.topBlur:
                case m.topFocus:
                  g = s;
                  break;
                case m.topClick:
                  if (2 === r.button) return null;
                case m.topContextMenu:
                case m.topDoubleClick:
                case m.topMouseDown:
                case m.topMouseMove:
                case m.topMouseOut:
                case m.topMouseOver:
                case m.topMouseUp:
                  g = c;
                  break;
                case m.topDrag:
                case m.topDragEnd:
                case m.topDragEnter:
                case m.topDragExit:
                case m.topDragLeave:
                case m.topDragOver:
                case m.topDragStart:
                case m.topDrop:
                  g = l;
                  break;
                case m.topTouchCancel:
                case m.topTouchEnd:
                case m.topTouchMove:
                case m.topTouchStart:
                  g = p;
                  break;
                case m.topScroll:
                  g = d;
                  break;
                case m.topWheel:
                  g = f;
                  break;
                case m.topCopy:
                case m.topCut:
                case m.topPaste:
                  g = i;
              }
              h(g);
              var C = g.getPooled(v, n, r);
              return o.accumulateTwoPhaseDispatches(C), C;
            }
          };
          t.exports = E;
        },
        {
          './EventConstants': 15,
          './EventPluginUtils': 19,
          './EventPropagators': 20,
          './SyntheticClipboardEvent': 79,
          './SyntheticDragEvent': 81,
          './SyntheticEvent': 82,
          './SyntheticFocusEvent': 83,
          './SyntheticKeyboardEvent': 85,
          './SyntheticMouseEvent': 86,
          './SyntheticTouchEvent': 87,
          './SyntheticUIEvent': 88,
          './SyntheticWheelEvent': 89,
          './invariant': 118,
          './keyOf': 125
        }
      ],
      79: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticEvent'),
            o = {
              clipboardData: function(e) {
                return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
              }
            };
          r.augmentClass(n, o), (t.exports = n);
        },
        { './SyntheticEvent': 82 }
      ],
      80: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticEvent'),
            o = { data: null };
          r.augmentClass(n, o), (t.exports = n);
        },
        { './SyntheticEvent': 82 }
      ],
      81: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticMouseEvent'),
            o = { dataTransfer: null };
          r.augmentClass(n, o), (t.exports = n);
        },
        { './SyntheticMouseEvent': 86 }
      ],
      82: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            (this.dispatchConfig = e), (this.dispatchMarker = t), (this.nativeEvent = n);
            var r = this.constructor.Interface;
            for (var i in r)
              if (r.hasOwnProperty(i)) {
                var a = r[i];
                this[i] = a ? a(n) : n[i];
              }
            var s = null != n.defaultPrevented ? n.defaultPrevented : n.returnValue === !1;
            (this.isDefaultPrevented = s ? o.thatReturnsTrue : o.thatReturnsFalse),
              (this.isPropagationStopped = o.thatReturnsFalse);
          }
          var r = e('./PooledClass'),
            o = e('./emptyFunction'),
            i = e('./getEventTarget'),
            a = e('./merge'),
            s = e('./mergeInto'),
            u = {
              type: null,
              target: i,
              currentTarget: o.thatReturnsNull,
              eventPhase: null,
              bubbles: null,
              cancelable: null,
              timeStamp: function(e) {
                return e.timeStamp || Date.now();
              },
              defaultPrevented: null,
              isTrusted: null
            };
          s(n.prototype, {
            preventDefault: function() {
              this.defaultPrevented = !0;
              var e = this.nativeEvent;
              e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
                (this.isDefaultPrevented = o.thatReturnsTrue);
            },
            stopPropagation: function() {
              var e = this.nativeEvent;
              e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = !0),
                (this.isPropagationStopped = o.thatReturnsTrue);
            },
            persist: function() {
              this.isPersistent = o.thatReturnsTrue;
            },
            isPersistent: o.thatReturnsFalse,
            destructor: function() {
              var e = this.constructor.Interface;
              for (var t in e) this[t] = null;
              (this.dispatchConfig = null), (this.dispatchMarker = null), (this.nativeEvent = null);
            }
          }),
            (n.Interface = u),
            (n.augmentClass = function(e, t) {
              var n = this,
                o = Object.create(n.prototype);
              s(o, e.prototype),
                (e.prototype = o),
                (e.prototype.constructor = e),
                (e.Interface = a(n.Interface, t)),
                (e.augmentClass = n.augmentClass),
                r.addPoolingTo(e, r.threeArgumentPooler);
            }),
            r.addPoolingTo(n, r.threeArgumentPooler),
            (t.exports = n);
        },
        {
          './PooledClass': 26,
          './emptyFunction': 100,
          './getEventTarget': 109,
          './merge': 128,
          './mergeInto': 130
        }
      ],
      83: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticUIEvent'),
            o = { relatedTarget: null };
          r.augmentClass(n, o), (t.exports = n);
        },
        { './SyntheticUIEvent': 88 }
      ],
      84: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticEvent'),
            o = { data: null };
          r.augmentClass(n, o), (t.exports = n);
        },
        { './SyntheticEvent': 82 }
      ],
      85: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticUIEvent'),
            o = e('./getEventKey'),
            i = e('./getEventModifierState'),
            a = {
              key: o,
              location: null,
              ctrlKey: null,
              shiftKey: null,
              altKey: null,
              metaKey: null,
              repeat: null,
              locale: null,
              getModifierState: i,
              charCode: function(e) {
                return 'keypress' === e.type ? ('charCode' in e ? e.charCode : e.keyCode) : 0;
              },
              keyCode: function(e) {
                return 'keydown' === e.type || 'keyup' === e.type ? e.keyCode : 0;
              },
              which: function(e) {
                return e.keyCode || e.charCode;
              }
            };
          r.augmentClass(n, a), (t.exports = n);
        },
        { './SyntheticUIEvent': 88, './getEventKey': 107, './getEventModifierState': 108 }
      ],
      86: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticUIEvent'),
            o = e('./ViewportMetrics'),
            i = e('./getEventModifierState'),
            a = {
              screenX: null,
              screenY: null,
              clientX: null,
              clientY: null,
              ctrlKey: null,
              shiftKey: null,
              altKey: null,
              metaKey: null,
              getModifierState: i,
              button: function(e) {
                var t = e.button;
                return 'which' in e ? t : 2 === t ? 2 : 4 === t ? 1 : 0;
              },
              buttons: null,
              relatedTarget: function(e) {
                return (
                  e.relatedTarget || (e.fromElement === e.srcElement ? e.toElement : e.fromElement)
                );
              },
              pageX: function(e) {
                return 'pageX' in e ? e.pageX : e.clientX + o.currentScrollLeft;
              },
              pageY: function(e) {
                return 'pageY' in e ? e.pageY : e.clientY + o.currentScrollTop;
              }
            };
          r.augmentClass(n, a), (t.exports = n);
        },
        { './SyntheticUIEvent': 88, './ViewportMetrics': 91, './getEventModifierState': 108 }
      ],
      87: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticUIEvent'),
            o = e('./getEventModifierState'),
            i = {
              touches: null,
              targetTouches: null,
              changedTouches: null,
              altKey: null,
              metaKey: null,
              ctrlKey: null,
              shiftKey: null,
              getModifierState: o
            };
          r.augmentClass(n, i), (t.exports = n);
        },
        { './SyntheticUIEvent': 88, './getEventModifierState': 108 }
      ],
      88: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticEvent'),
            o = e('./getEventTarget'),
            i = {
              view: function(e) {
                if (e.view) return e.view;
                var t = o(e);
                if (null != t && t.window === t) return t;
                var n = t.ownerDocument;
                return n ? n.defaultView || n.parentWindow : window;
              },
              detail: function(e) {
                return e.detail || 0;
              }
            };
          r.augmentClass(n, i), (t.exports = n);
        },
        { './SyntheticEvent': 82, './getEventTarget': 109 }
      ],
      89: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            r.call(this, e, t, n);
          }
          var r = e('./SyntheticMouseEvent'),
            o = {
              deltaX: function(e) {
                return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
              },
              deltaY: function(e) {
                return 'deltaY' in e
                  ? e.deltaY
                  : 'wheelDeltaY' in e ? -e.wheelDeltaY : 'wheelDelta' in e ? -e.wheelDelta : 0;
              },
              deltaZ: null,
              deltaMode: null
            };
          r.augmentClass(n, o), (t.exports = n);
        },
        { './SyntheticMouseEvent': 86 }
      ],
      90: [
        function(e, t) {
          'use strict';
          var n = e('./invariant'),
            r = {
              reinitializeTransaction: function() {
                (this.transactionWrappers = this.getTransactionWrappers()),
                  this.wrapperInitData
                    ? (this.wrapperInitData.length = 0)
                    : (this.wrapperInitData = []),
                  (this._isInTransaction = !1);
              },
              _isInTransaction: !1,
              getTransactionWrappers: null,
              isInTransaction: function() {
                return !!this._isInTransaction;
              },
              perform: function(e, t, r, o, i, a, s, u) {
                n(!this.isInTransaction());
                var c, l;
                try {
                  (this._isInTransaction = !0),
                    (c = !0),
                    this.initializeAll(0),
                    (l = e.call(t, r, o, i, a, s, u)),
                    (c = !1);
                } finally {
                  try {
                    if (c)
                      try {
                        this.closeAll(0);
                      } catch (p) {}
                    else this.closeAll(0);
                  } finally {
                    this._isInTransaction = !1;
                  }
                }
                return l;
              },
              initializeAll: function(e) {
                for (var t = this.transactionWrappers, n = e; n < t.length; n++) {
                  var r = t[n];
                  try {
                    (this.wrapperInitData[n] = o.OBSERVED_ERROR),
                      (this.wrapperInitData[n] = r.initialize ? r.initialize.call(this) : null);
                  } finally {
                    if (this.wrapperInitData[n] === o.OBSERVED_ERROR)
                      try {
                        this.initializeAll(n + 1);
                      } catch (i) {}
                  }
                }
              },
              closeAll: function(e) {
                n(this.isInTransaction());
                for (var t = this.transactionWrappers, r = e; r < t.length; r++) {
                  var i,
                    a = t[r],
                    s = this.wrapperInitData[r];
                  try {
                    (i = !0), s !== o.OBSERVED_ERROR && a.close && a.close.call(this, s), (i = !1);
                  } finally {
                    if (i)
                      try {
                        this.closeAll(r + 1);
                      } catch (u) {}
                  }
                }
                this.wrapperInitData.length = 0;
              }
            },
            o = { Mixin: r, OBSERVED_ERROR: {} };
          t.exports = o;
        },
        { './invariant': 118 }
      ],
      91: [
        function(e, t) {
          'use strict';
          var n = e('./getUnboundedScrollPosition'),
            r = {
              currentScrollLeft: 0,
              currentScrollTop: 0,
              refreshScrollValues: function() {
                var e = n(window);
                (r.currentScrollLeft = e.x), (r.currentScrollTop = e.y);
              }
            };
          t.exports = r;
        },
        { './getUnboundedScrollPosition': 114 }
      ],
      92: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            if ((r(null != t), null == e)) return t;
            var n = Array.isArray(e),
              o = Array.isArray(t);
            return n ? e.concat(t) : o ? [e].concat(t) : [e, t];
          }
          var r = e('./invariant');
          t.exports = n;
        },
        { './invariant': 118 }
      ],
      93: [
        function(e, t) {
          'use strict';
          function n(e) {
            for (var t = 1, n = 0, o = 0; o < e.length; o++)
              (t = (t + e.charCodeAt(o)) % r), (n = (n + t) % r);
            return t | (n << 16);
          }
          var r = 65521;
          t.exports = n;
        },
        {}
      ],
      94: [
        function(e, t) {
          function n(e, t) {
            return e && t
              ? e === t
                ? !0
                : r(e)
                  ? !1
                  : r(t)
                    ? n(e, t.parentNode)
                    : e.contains
                      ? e.contains(t)
                      : e.compareDocumentPosition ? !!(16 & e.compareDocumentPosition(t)) : !1
              : !1;
          }
          var r = e('./isTextNode');
          t.exports = n;
        },
        { './isTextNode': 122 }
      ],
      95: [
        function(e, t) {
          function n(e, t, n, r, o, i) {
            e = e || {};
            for (var a, s = [t, n, r, o, i], u = 0; s[u]; ) {
              a = s[u++];
              for (var c in a) e[c] = a[c];
              a.hasOwnProperty &&
                a.hasOwnProperty('toString') &&
                'undefined' != typeof a.toString &&
                e.toString !== a.toString &&
                (e.toString = a.toString);
            }
            return e;
          }
          t.exports = n;
        },
        {}
      ],
      96: [
        function(e, t) {
          function n(e) {
            return (
              !!e &&
              ('object' == typeof e || 'function' == typeof e) &&
              'length' in e &&
              !('setInterval' in e) &&
              'number' != typeof e.nodeType &&
              (Array.isArray(e) || 'callee' in e || 'item' in e)
            );
          }
          function r(e) {
            return n(e) ? (Array.isArray(e) ? e.slice() : o(e)) : [e];
          }
          var o = e('./toArray');
          t.exports = r;
        },
        { './toArray': 137 }
      ],
      97: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = r.createClass({
              displayName: 'ReactFullPageComponent' + (e.type.displayName || ''),
              componentWillUnmount: function() {
                o(!1);
              },
              render: function() {
                return this.transferPropsTo(e(null, this.props.children));
              }
            });
            return t;
          }
          var r = e('./ReactCompositeComponent'),
            o = e('./invariant');
          t.exports = n;
        },
        { './ReactCompositeComponent': 33, './invariant': 118 }
      ],
      98: [
        function(e, t) {
          function n(e) {
            var t = e.match(c);
            return t && t[1].toLowerCase();
          }
          function r(e, t) {
            var r = u;
            s(!!u);
            var o = n(e),
              c = o && a(o);
            if (c) {
              r.innerHTML = c[1] + e + c[2];
              for (var l = c[0]; l--; ) r = r.lastChild;
            } else r.innerHTML = e;
            var p = r.getElementsByTagName('script');
            p.length && (s(t), i(p).forEach(t));
            for (var d = i(r.childNodes); r.lastChild; ) r.removeChild(r.lastChild);
            return d;
          }
          var o = e('./ExecutionEnvironment'),
            i = e('./createArrayFrom'),
            a = e('./getMarkupWrap'),
            s = e('./invariant'),
            u = o.canUseDOM ? document.createElement('div') : null,
            c = /^\s*<(\w+)/;
          t.exports = r;
        },
        {
          './ExecutionEnvironment': 21,
          './createArrayFrom': 96,
          './getMarkupWrap': 110,
          './invariant': 118
        }
      ],
      99: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            var n = null == t || 'boolean' == typeof t || '' === t;
            if (n) return '';
            var r = isNaN(t);
            return r || 0 === t || (o.hasOwnProperty(e) && o[e])
              ? '' + t
              : ('string' == typeof t && (t = t.trim()), t + 'px');
          }
          var r = e('./CSSProperty'),
            o = r.isUnitlessNumber;
          t.exports = n;
        },
        { './CSSProperty': 3 }
      ],
      100: [
        function(e, t) {
          function n(e) {
            return function() {
              return e;
            };
          }
          function r() {}
          var o = e('./copyProperties');
          o(r, {
            thatReturns: n,
            thatReturnsFalse: n(!1),
            thatReturnsTrue: n(!0),
            thatReturnsNull: n(null),
            thatReturnsThis: function() {
              return this;
            },
            thatReturnsArgument: function(e) {
              return e;
            }
          }),
            (t.exports = r);
        },
        { './copyProperties': 95 }
      ],
      101: [
        function(e, t) {
          'use strict';
          var n = {};
          t.exports = n;
        },
        {}
      ],
      102: [
        function(e, t) {
          'use strict';
          function n(e) {
            return o[e];
          }
          function r(e) {
            return ('' + e).replace(i, n);
          }
          var o = { '&': '&amp;', '>': '&gt;', '<': '&lt;', '"': '&quot;', "'": '&#x27;' },
            i = /[&><"']/g;
          t.exports = r;
        },
        {}
      ],
      103: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            var r = e,
              o = !r.hasOwnProperty(n);
            o && null != t && (r[n] = t);
          }
          function r(e) {
            if (null == e) return e;
            var t = {};
            return o(e, n, t), t;
          }
          {
            var o = e('./traverseAllChildren');
            e('./warning');
          }
          t.exports = r;
        },
        { './traverseAllChildren': 138, './warning': 139 }
      ],
      104: [
        function(e, t) {
          'use strict';
          function n(e) {
            e.disabled || e.focus();
          }
          t.exports = n;
        },
        {}
      ],
      105: [
        function(e, t) {
          'use strict';
          var n = function(e, t, n) {
            Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e);
          };
          t.exports = n;
        },
        {}
      ],
      106: [
        function(e, t) {
          function n() {
            try {
              return document.activeElement || document.body;
            } catch (e) {
              return document.body;
            }
          }
          t.exports = n;
        },
        {}
      ],
      107: [
        function(e, t) {
          'use strict';
          function n(e) {
            if (e.key) {
              var t = o[e.key] || e.key;
              if ('Unidentified' !== t) return t;
            }
            if ('keypress' === e.type) {
              var n = 'charCode' in e ? e.charCode : e.keyCode;
              return 13 === n ? 'Enter' : String.fromCharCode(n);
            }
            return 'keydown' === e.type || 'keyup' === e.type
              ? i[e.keyCode] || 'Unidentified'
              : void r(!1);
          }
          var r = e('./invariant'),
            o = {
              Esc: 'Escape',
              Spacebar: ' ',
              Left: 'ArrowLeft',
              Up: 'ArrowUp',
              Right: 'ArrowRight',
              Down: 'ArrowDown',
              Del: 'Delete',
              Win: 'OS',
              Menu: 'ContextMenu',
              Apps: 'ContextMenu',
              Scroll: 'ScrollLock',
              MozPrintableKey: 'Unidentified'
            },
            i = {
              8: 'Backspace',
              9: 'Tab',
              12: 'Clear',
              13: 'Enter',
              16: 'Shift',
              17: 'Control',
              18: 'Alt',
              19: 'Pause',
              20: 'CapsLock',
              27: 'Escape',
              32: ' ',
              33: 'PageUp',
              34: 'PageDown',
              35: 'End',
              36: 'Home',
              37: 'ArrowLeft',
              38: 'ArrowUp',
              39: 'ArrowRight',
              40: 'ArrowDown',
              45: 'Insert',
              46: 'Delete',
              112: 'F1',
              113: 'F2',
              114: 'F3',
              115: 'F4',
              116: 'F5',
              117: 'F6',
              118: 'F7',
              119: 'F8',
              120: 'F9',
              121: 'F10',
              122: 'F11',
              123: 'F12',
              144: 'NumLock',
              145: 'ScrollLock',
              224: 'Meta'
            };
          t.exports = n;
        },
        { './invariant': 118 }
      ],
      108: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = this,
              n = t.nativeEvent;
            if (n.getModifierState) return n.getModifierState(e);
            var r = o[e];
            return r ? !!n[r] : !1;
          }
          function r() {
            return n;
          }
          var o = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
          t.exports = r;
        },
        {}
      ],
      109: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = e.target || e.srcElement || window;
            return 3 === t.nodeType ? t.parentNode : t;
          }
          t.exports = n;
        },
        {}
      ],
      110: [
        function(e, t) {
          function n(e) {
            return (
              o(!!i),
              p.hasOwnProperty(e) || (e = '*'),
              a.hasOwnProperty(e) ||
                ((i.innerHTML = '*' === e ? '<link />' : '<' + e + '></' + e + '>'),
                (a[e] = !i.firstChild)),
              a[e] ? p[e] : null
            );
          }
          var r = e('./ExecutionEnvironment'),
            o = e('./invariant'),
            i = r.canUseDOM ? document.createElement('div') : null,
            a = {
              circle: !0,
              defs: !0,
              ellipse: !0,
              g: !0,
              line: !0,
              linearGradient: !0,
              path: !0,
              polygon: !0,
              polyline: !0,
              radialGradient: !0,
              rect: !0,
              stop: !0,
              text: !0
            },
            s = [1, '<select multiple="true">', '</select>'],
            u = [1, '<table>', '</table>'],
            c = [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            l = [1, '<svg>', '</svg>'],
            p = {
              '*': [1, '?<div>', '</div>'],
              area: [1, '<map>', '</map>'],
              col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
              legend: [1, '<fieldset>', '</fieldset>'],
              param: [1, '<object>', '</object>'],
              tr: [2, '<table><tbody>', '</tbody></table>'],
              optgroup: s,
              option: s,
              caption: u,
              colgroup: u,
              tbody: u,
              tfoot: u,
              thead: u,
              td: c,
              th: c,
              circle: l,
              defs: l,
              ellipse: l,
              g: l,
              line: l,
              linearGradient: l,
              path: l,
              polygon: l,
              polyline: l,
              radialGradient: l,
              rect: l,
              stop: l,
              text: l
            };
          t.exports = n;
        },
        { './ExecutionEnvironment': 21, './invariant': 118 }
      ],
      111: [
        function(e, t) {
          'use strict';
          function n(e) {
            for (; e && e.firstChild; ) e = e.firstChild;
            return e;
          }
          function r(e) {
            for (; e; ) {
              if (e.nextSibling) return e.nextSibling;
              e = e.parentNode;
            }
          }
          function o(e, t) {
            for (var o = n(e), i = 0, a = 0; o; ) {
              if (3 == o.nodeType) {
                if (((a = i + o.textContent.length), t >= i && a >= t))
                  return { node: o, offset: t - i };
                i = a;
              }
              o = n(r(o));
            }
          }
          t.exports = o;
        },
        {}
      ],
      112: [
        function(e, t) {
          'use strict';
          function n(e) {
            return e ? (e.nodeType === r ? e.documentElement : e.firstChild) : null;
          }
          var r = 9;
          t.exports = n;
        },
        {}
      ],
      113: [
        function(e, t) {
          'use strict';
          function n() {
            return (
              !o &&
                r.canUseDOM &&
                (o = 'textContent' in document.documentElement ? 'textContent' : 'innerText'),
              o
            );
          }
          var r = e('./ExecutionEnvironment'),
            o = null;
          t.exports = n;
        },
        { './ExecutionEnvironment': 21 }
      ],
      114: [
        function(e, t) {
          'use strict';
          function n(e) {
            return e === window
              ? {
                  x: window.pageXOffset || document.documentElement.scrollLeft,
                  y: window.pageYOffset || document.documentElement.scrollTop
                }
              : { x: e.scrollLeft, y: e.scrollTop };
          }
          t.exports = n;
        },
        {}
      ],
      115: [
        function(e, t) {
          function n(e) {
            return e.replace(r, '-$1').toLowerCase();
          }
          var r = /([A-Z])/g;
          t.exports = n;
        },
        {}
      ],
      116: [
        function(e, t) {
          'use strict';
          function n(e) {
            return r(e).replace(o, '-ms-');
          }
          var r = e('./hyphenate'),
            o = /^ms-/;
          t.exports = n;
        },
        { './hyphenate': 115 }
      ],
      117: [
        function(e, t) {
          'use strict';
          function n(e) {
            return (
              e &&
              'function' == typeof e.type &&
              'function' == typeof e.type.prototype.mountComponent &&
              'function' == typeof e.type.prototype.receiveComponent
            );
          }
          function r(e) {
            return o(n(e)), new e.type(e);
          }
          var o = e('./invariant');
          t.exports = r;
        },
        { './invariant': 118 }
      ],
      118: [
        function(e, t) {
          'use strict';
          var n = function(e, t, n, r, o, i, a, s) {
            if (!e) {
              var u;
              if (void 0 === t)
                u = new Error(
                  'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
                );
              else {
                var c = [n, r, o, i, a, s],
                  l = 0;
                u = new Error(
                  'Invariant Violation: ' +
                    t.replace(/%s/g, function() {
                      return c[l++];
                    })
                );
              }
              throw ((u.framesToPop = 1), u);
            }
          };
          t.exports = n;
        },
        {}
      ],
      119: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            if (!o.canUseDOM || (t && !('addEventListener' in document))) return !1;
            var n = 'on' + e,
              i = n in document;
            if (!i) {
              var a = document.createElement('div');
              a.setAttribute(n, 'return;'), (i = 'function' == typeof a[n]);
            }
            return (
              !i &&
                r &&
                'wheel' === e &&
                (i = document.implementation.hasFeature('Events.wheel', '3.0')),
              i
            );
          }
          var r,
            o = e('./ExecutionEnvironment');
          o.canUseDOM &&
            (r =
              document.implementation &&
              document.implementation.hasFeature &&
              document.implementation.hasFeature('', '') !== !0),
            (t.exports = n);
        },
        { './ExecutionEnvironment': 21 }
      ],
      120: [
        function(e, t) {
          function n(e) {
            return !(
              !e ||
              !('function' == typeof Node
                ? e instanceof Node
                : 'object' == typeof e &&
                  'number' == typeof e.nodeType &&
                  'string' == typeof e.nodeName)
            );
          }
          t.exports = n;
        },
        {}
      ],
      121: [
        function(e, t) {
          'use strict';
          function n(e) {
            return e && (('INPUT' === e.nodeName && r[e.type]) || 'TEXTAREA' === e.nodeName);
          }
          var r = {
            color: !0,
            date: !0,
            datetime: !0,
            'datetime-local': !0,
            email: !0,
            month: !0,
            number: !0,
            password: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0
          };
          t.exports = n;
        },
        {}
      ],
      122: [
        function(e, t) {
          function n(e) {
            return r(e) && 3 == e.nodeType;
          }
          var r = e('./isNode');
          t.exports = n;
        },
        { './isNode': 120 }
      ],
      123: [
        function(e, t) {
          'use strict';
          function n(e) {
            e || (e = '');
            var t,
              n = arguments.length;
            if (n > 1) for (var r = 1; n > r; r++) (t = arguments[r]), t && (e += ' ' + t);
            return e;
          }
          t.exports = n;
        },
        {}
      ],
      124: [
        function(e, t) {
          'use strict';
          var n = e('./invariant'),
            r = function(e) {
              var t,
                r = {};
              n(e instanceof Object && !Array.isArray(e));
              for (t in e) e.hasOwnProperty(t) && (r[t] = t);
              return r;
            };
          t.exports = r;
        },
        { './invariant': 118 }
      ],
      125: [
        function(e, t) {
          var n = function(e) {
            var t;
            for (t in e) if (e.hasOwnProperty(t)) return t;
            return null;
          };
          t.exports = n;
        },
        {}
      ],
      126: [
        function(e, t) {
          'use strict';
          function n(e, t, n) {
            if (!e) return null;
            var r = 0,
              o = {};
            for (var i in e) e.hasOwnProperty(i) && (o[i] = t.call(n, e[i], i, r++));
            return o;
          }
          t.exports = n;
        },
        {}
      ],
      127: [
        function(e, t) {
          'use strict';
          function n(e) {
            var t = {};
            return function(n) {
              return t.hasOwnProperty(n) ? t[n] : (t[n] = e.call(this, n));
            };
          }
          t.exports = n;
        },
        {}
      ],
      128: [
        function(e, t) {
          'use strict';
          var n = e('./mergeInto'),
            r = function(e, t) {
              var r = {};
              return n(r, e), n(r, t), r;
            };
          t.exports = r;
        },
        { './mergeInto': 130 }
      ],
      129: [
        function(e, t) {
          'use strict';
          var n = e('./invariant'),
            r = e('./keyMirror'),
            o = 36,
            i = function(e) {
              return 'object' != typeof e || null === e;
            },
            a = {
              MAX_MERGE_DEPTH: o,
              isTerminal: i,
              normalizeMergeArg: function(e) {
                return void 0 === e || null === e ? {} : e;
              },
              checkMergeArrayArgs: function(e, t) {
                n(Array.isArray(e) && Array.isArray(t));
              },
              checkMergeObjectArgs: function(e, t) {
                a.checkMergeObjectArg(e), a.checkMergeObjectArg(t);
              },
              checkMergeObjectArg: function(e) {
                n(!i(e) && !Array.isArray(e));
              },
              checkMergeIntoObjectArg: function(e) {
                n(!((i(e) && 'function' != typeof e) || Array.isArray(e)));
              },
              checkMergeLevel: function(e) {
                n(o > e);
              },
              checkArrayStrategy: function(e) {
                n(void 0 === e || e in a.ArrayStrategies);
              },
              ArrayStrategies: r({ Clobber: !0, IndexByIndex: !0 })
            };
          t.exports = a;
        },
        { './invariant': 118, './keyMirror': 124 }
      ],
      130: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            if ((i(e), null != t)) {
              o(t);
              for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            }
          }
          var r = e('./mergeHelpers'),
            o = r.checkMergeObjectArg,
            i = r.checkMergeIntoObjectArg;
          t.exports = n;
        },
        { './mergeHelpers': 129 }
      ],
      131: [
        function(e, t) {
          'use strict';
          var n = function(e, t) {
            var n;
            for (n in t) t.hasOwnProperty(n) && (e.prototype[n] = t[n]);
          };
          t.exports = n;
        },
        {}
      ],
      132: [
        function(e, t) {
          'use strict';
          function n(e) {
            r(e && !/[^a-z0-9_]/.test(e));
          }
          var r = e('./invariant');
          t.exports = n;
        },
        { './invariant': 118 }
      ],
      133: [
        function(e, t) {
          'use strict';
          function n(e) {
            return o(r.isValidDescriptor(e)), e;
          }
          var r = e('./ReactDescriptor'),
            o = e('./invariant');
          t.exports = n;
        },
        { './ReactDescriptor': 49, './invariant': 118 }
      ],
      134: [
        function(e, t) {
          'use strict';
          var n = e('./ExecutionEnvironment'),
            r = function(e, t) {
              e.innerHTML = t;
            };
          if (n.canUseDOM) {
            var o = document.createElement('div');
            (o.innerHTML = ' '),
              '' === o.innerHTML &&
                (r = function(e, t) {
                  if (
                    (e.parentNode && e.parentNode.replaceChild(e, e),
                    t.match(/^[ \r\n\t\f]/) ||
                      ('<' === t[0] &&
                        (-1 !== t.indexOf('<noscript') ||
                          -1 !== t.indexOf('<script') ||
                          -1 !== t.indexOf('<style') ||
                          -1 !== t.indexOf('<meta') ||
                          -1 !== t.indexOf('<link'))))
                  ) {
                    e.innerHTML = '' + t;
                    var n = e.firstChild;
                    1 === n.data.length ? e.removeChild(n) : n.deleteData(0, 1);
                  } else e.innerHTML = t;
                });
          }
          t.exports = r;
        },
        { './ExecutionEnvironment': 21 }
      ],
      135: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            if (e === t) return !0;
            var n;
            for (n in e)
              if (e.hasOwnProperty(n) && (!t.hasOwnProperty(n) || e[n] !== t[n])) return !1;
            for (n in t) if (t.hasOwnProperty(n) && !e.hasOwnProperty(n)) return !1;
            return !0;
          }
          t.exports = n;
        },
        {}
      ],
      136: [
        function(e, t) {
          'use strict';
          function n(e, t) {
            return e &&
              t &&
              e.type === t.type &&
              (e.props && e.props.key) === (t.props && t.props.key) &&
              e._owner === t._owner
              ? !0
              : !1;
          }
          t.exports = n;
        },
        {}
      ],
      137: [
        function(e, t) {
          function n(e) {
            var t = e.length;
            if (
              (r(!Array.isArray(e) && ('object' == typeof e || 'function' == typeof e)),
              r('number' == typeof t),
              r(0 === t || t - 1 in e),
              e.hasOwnProperty)
            )
              try {
                return Array.prototype.slice.call(e);
              } catch (n) {}
            for (var o = Array(t), i = 0; t > i; i++) o[i] = e[i];
            return o;
          }
          var r = e('./invariant');
          t.exports = n;
        },
        { './invariant': 118 }
      ],
      138: [
        function(e, t) {
          'use strict';
          function n(e) {
            return d[e];
          }
          function r(e, t) {
            return e && e.props && null != e.props.key ? i(e.props.key) : t.toString(36);
          }
          function o(e) {
            return ('' + e).replace(f, n);
          }
          function i(e) {
            return '$' + o(e);
          }
          function a(e, t, n) {
            return null == e ? 0 : h(e, '', 0, t, n);
          }
          var s = e('./ReactInstanceHandles'),
            u = e('./ReactTextComponent'),
            c = e('./invariant'),
            l = s.SEPARATOR,
            p = ':',
            d = { '=': '=0', '.': '=1', ':': '=2' },
            f = /[=.:]/g,
            h = function(e, t, n, o, a) {
              var s = 0;
              if (Array.isArray(e))
                for (var d = 0; d < e.length; d++) {
                  var f = e[d],
                    v = t + (t ? p : l) + r(f, d),
                    m = n + s;
                  s += h(f, v, m, o, a);
                }
              else {
                var g = typeof e,
                  y = '' === t,
                  C = y ? l + r(e, 0) : t;
                if (null == e || 'boolean' === g) o(a, null, C, n), (s = 1);
                else if (e.type && e.type.prototype && e.type.prototype.mountComponentIntoNode)
                  o(a, e, C, n), (s = 1);
                else if ('object' === g) {
                  c(!e || 1 !== e.nodeType);
                  for (var E in e)
                    e.hasOwnProperty(E) &&
                      (s += h(e[E], t + (t ? p : l) + i(E) + p + r(e[E], 0), n + s, o, a));
                } else if ('string' === g) {
                  var R = u(e);
                  o(a, R, C, n), (s += 1);
                } else if ('number' === g) {
                  var M = u('' + e);
                  o(a, M, C, n), (s += 1);
                }
              }
              return s;
            };
          t.exports = a;
        },
        { './ReactInstanceHandles': 57, './ReactTextComponent': 73, './invariant': 118 }
      ],
      139: [
        function(e, t) {
          'use strict';
          var n = e('./emptyFunction'),
            r = n;
          t.exports = r;
        },
        { './emptyFunction': 100 }
      ]
    },
    {},
    [27]
  )(27);
});
/* Chartist.js 0.11.0
 * Copyright © 2017 Gion Kunz
 * Free to use under either the WTFPL license or the MIT license.
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-WTFPL
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-MIT
 */

!(function(a, b) {
  'function' == typeof define && define.amd
    ? define('Chartist', [], function() {
        return (a.Chartist = b());
      })
    : 'object' == typeof module && module.exports ? (module.exports = b()) : (a.Chartist = b());
})(this, function() {
  var a = { version: '0.11.0' };
  return (
    (function(a, b, c) {
      'use strict';
      (c.namespaces = {
        svg: 'http://www.w3.org/2000/svg',
        xmlns: 'http://www.w3.org/2000/xmlns/',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        ct: 'http://gionkunz.github.com/chartist-js/ct'
      }),
        (c.noop = function(a) {
          return a;
        }),
        (c.alphaNumerate = function(a) {
          return String.fromCharCode(97 + a % 26);
        }),
        (c.extend = function(a) {
          var b, d, e;
          for (a = a || {}, b = 1; b < arguments.length; b++) {
            d = arguments[b];
            for (var f in d)
              (e = d[f]),
                'object' != typeof e || null === e || e instanceof Array
                  ? (a[f] = e)
                  : (a[f] = c.extend(a[f], e));
          }
          return a;
        }),
        (c.replaceAll = function(a, b, c) {
          return a.replace(new RegExp(b, 'g'), c);
        }),
        (c.ensureUnit = function(a, b) {
          return 'number' == typeof a && (a += b), a;
        }),
        (c.quantity = function(a) {
          if ('string' == typeof a) {
            var b = /^(\d+)\s*(.*)$/g.exec(a);
            return { value: +b[1], unit: b[2] || void 0 };
          }
          return { value: a };
        }),
        (c.querySelector = function(a) {
          return a instanceof Node ? a : b.querySelector(a);
        }),
        (c.times = function(a) {
          return Array.apply(null, new Array(a));
        }),
        (c.sum = function(a, b) {
          return a + (b ? b : 0);
        }),
        (c.mapMultiply = function(a) {
          return function(b) {
            return b * a;
          };
        }),
        (c.mapAdd = function(a) {
          return function(b) {
            return b + a;
          };
        }),
        (c.serialMap = function(a, b) {
          var d = [],
            e = Math.max.apply(
              null,
              a.map(function(a) {
                return a.length;
              })
            );
          return (
            c.times(e).forEach(function(c, e) {
              var f = a.map(function(a) {
                return a[e];
              });
              d[e] = b.apply(null, f);
            }),
            d
          );
        }),
        (c.roundWithPrecision = function(a, b) {
          var d = Math.pow(10, b || c.precision);
          return Math.round(a * d) / d;
        }),
        (c.precision = 8),
        (c.escapingMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }),
        (c.serialize = function(a) {
          return null === a || void 0 === a
            ? a
            : ('number' == typeof a
                ? (a = '' + a)
                : 'object' == typeof a && (a = JSON.stringify({ data: a })),
              Object.keys(c.escapingMap).reduce(function(a, b) {
                return c.replaceAll(a, b, c.escapingMap[b]);
              }, a));
        }),
        (c.deserialize = function(a) {
          if ('string' != typeof a) return a;
          a = Object.keys(c.escapingMap).reduce(function(a, b) {
            return c.replaceAll(a, c.escapingMap[b], b);
          }, a);
          try {
            (a = JSON.parse(a)), (a = void 0 !== a.data ? a.data : a);
          } catch (b) {}
          return a;
        }),
        (c.createSvg = function(a, b, d, e) {
          var f;
          return (
            (b = b || '100%'),
            (d = d || '100%'),
            Array.prototype.slice
              .call(a.querySelectorAll('svg'))
              .filter(function(a) {
                return a.getAttributeNS(c.namespaces.xmlns, 'ct');
              })
              .forEach(function(b) {
                a.removeChild(b);
              }),
            (f = new c.Svg('svg').attr({ width: b, height: d }).addClass(e)),
            (f._node.style.width = b),
            (f._node.style.height = d),
            a.appendChild(f._node),
            f
          );
        }),
        (c.normalizeData = function(a, b, d) {
          var e,
            f = { raw: a, normalized: {} };
          return (
            (f.normalized.series = c.getDataArray({ series: a.series || [] }, b, d)),
            (e = f.normalized.series.every(function(a) {
              return a instanceof Array;
            })
              ? Math.max.apply(
                  null,
                  f.normalized.series.map(function(a) {
                    return a.length;
                  })
                )
              : f.normalized.series.length),
            (f.normalized.labels = (a.labels || []).slice()),
            Array.prototype.push.apply(
              f.normalized.labels,
              c.times(Math.max(0, e - f.normalized.labels.length)).map(function() {
                return '';
              })
            ),
            b && c.reverseData(f.normalized),
            f
          );
        }),
        (c.safeHasProperty = function(a, b) {
          return null !== a && 'object' == typeof a && a.hasOwnProperty(b);
        }),
        (c.isDataHoleValue = function(a) {
          return null === a || void 0 === a || ('number' == typeof a && isNaN(a));
        }),
        (c.reverseData = function(a) {
          a.labels.reverse(), a.series.reverse();
          for (var b = 0; b < a.series.length; b++)
            'object' == typeof a.series[b] && void 0 !== a.series[b].data
              ? a.series[b].data.reverse()
              : a.series[b] instanceof Array && a.series[b].reverse();
        }),
        (c.getDataArray = function(a, b, d) {
          function e(a) {
            if (c.safeHasProperty(a, 'value')) return e(a.value);
            if (c.safeHasProperty(a, 'data')) return e(a.data);
            if (a instanceof Array) return a.map(e);
            if (!c.isDataHoleValue(a)) {
              if (d) {
                var b = {};
                return (
                  'string' == typeof d
                    ? (b[d] = c.getNumberOrUndefined(a))
                    : (b.y = c.getNumberOrUndefined(a)),
                  (b.x = a.hasOwnProperty('x') ? c.getNumberOrUndefined(a.x) : b.x),
                  (b.y = a.hasOwnProperty('y') ? c.getNumberOrUndefined(a.y) : b.y),
                  b
                );
              }
              return c.getNumberOrUndefined(a);
            }
          }
          return a.series.map(e);
        }),
        (c.normalizePadding = function(a, b) {
          return (
            (b = b || 0),
            'number' == typeof a
              ? { top: a, right: a, bottom: a, left: a }
              : {
                  top: 'number' == typeof a.top ? a.top : b,
                  right: 'number' == typeof a.right ? a.right : b,
                  bottom: 'number' == typeof a.bottom ? a.bottom : b,
                  left: 'number' == typeof a.left ? a.left : b
                }
          );
        }),
        (c.getMetaData = function(a, b) {
          var c = a.data ? a.data[b] : a[b];
          return c ? c.meta : void 0;
        }),
        (c.orderOfMagnitude = function(a) {
          return Math.floor(Math.log(Math.abs(a)) / Math.LN10);
        }),
        (c.projectLength = function(a, b, c) {
          return b / c.range * a;
        }),
        (c.getAvailableHeight = function(a, b) {
          return Math.max(
            (c.quantity(b.height).value || a.height()) -
              (b.chartPadding.top + b.chartPadding.bottom) -
              b.axisX.offset,
            0
          );
        }),
        (c.getHighLow = function(a, b, d) {
          function e(a) {
            if (void 0 !== a)
              if (a instanceof Array) for (var b = 0; b < a.length; b++) e(a[b]);
              else {
                var c = d ? +a[d] : +a;
                g && c > f.high && (f.high = c), h && c < f.low && (f.low = c);
              }
          }
          b = c.extend({}, b, d ? b['axis' + d.toUpperCase()] : {});
          var f = {
              high: void 0 === b.high ? -Number.MAX_VALUE : +b.high,
              low: void 0 === b.low ? Number.MAX_VALUE : +b.low
            },
            g = void 0 === b.high,
            h = void 0 === b.low;
          return (
            (g || h) && e(a),
            (b.referenceValue || 0 === b.referenceValue) &&
              ((f.high = Math.max(b.referenceValue, f.high)),
              (f.low = Math.min(b.referenceValue, f.low))),
            f.high <= f.low &&
              (0 === f.low
                ? (f.high = 1)
                : f.low < 0
                  ? (f.high = 0)
                  : f.high > 0 ? (f.low = 0) : ((f.high = 1), (f.low = 0))),
            f
          );
        }),
        (c.isNumeric = function(a) {
          return null !== a && isFinite(a);
        }),
        (c.isFalseyButZero = function(a) {
          return !a && 0 !== a;
        }),
        (c.getNumberOrUndefined = function(a) {
          return c.isNumeric(a) ? +a : void 0;
        }),
        (c.isMultiValue = function(a) {
          return 'object' == typeof a && ('x' in a || 'y' in a);
        }),
        (c.getMultiValue = function(a, b) {
          return c.isMultiValue(a)
            ? c.getNumberOrUndefined(a[b || 'y'])
            : c.getNumberOrUndefined(a);
        }),
        (c.rho = function(a) {
          function b(a, c) {
            return a % c === 0 ? c : b(c, a % c);
          }
          function c(a) {
            return a * a + 1;
          }
          if (1 === a) return a;
          var d,
            e = 2,
            f = 2;
          if (a % 2 === 0) return 2;
          do (e = c(e) % a), (f = c(c(f)) % a), (d = b(Math.abs(e - f), a));
          while (1 === d);
          return d;
        }),
        (c.getBounds = function(a, b, d, e) {
          function f(a, b) {
            return a === (a += b) && (a *= 1 + (b > 0 ? o : -o)), a;
          }
          var g,
            h,
            i,
            j = 0,
            k = { high: b.high, low: b.low };
          (k.valueRange = k.high - k.low),
            (k.oom = c.orderOfMagnitude(k.valueRange)),
            (k.step = Math.pow(10, k.oom)),
            (k.min = Math.floor(k.low / k.step) * k.step),
            (k.max = Math.ceil(k.high / k.step) * k.step),
            (k.range = k.max - k.min),
            (k.numberOfSteps = Math.round(k.range / k.step));
          var l = c.projectLength(a, k.step, k),
            m = l < d,
            n = e ? c.rho(k.range) : 0;
          if (e && c.projectLength(a, 1, k) >= d) k.step = 1;
          else if (e && n < k.step && c.projectLength(a, n, k) >= d) k.step = n;
          else
            for (;;) {
              if (m && c.projectLength(a, k.step, k) <= d) k.step *= 2;
              else {
                if (m || !(c.projectLength(a, k.step / 2, k) >= d)) break;
                if (((k.step /= 2), e && k.step % 1 !== 0)) {
                  k.step *= 2;
                  break;
                }
              }
              if (j++ > 1e3)
                throw new Error(
                  'Exceeded maximum number of iterations while optimizing scale step!'
                );
            }
          var o = 2.221e-16;
          for (k.step = Math.max(k.step, o), h = k.min, i = k.max; h + k.step <= k.low; )
            h = f(h, k.step);
          for (; i - k.step >= k.high; ) i = f(i, -k.step);
          (k.min = h), (k.max = i), (k.range = k.max - k.min);
          var p = [];
          for (g = k.min; g <= k.max; g = f(g, k.step)) {
            var q = c.roundWithPrecision(g);
            q !== p[p.length - 1] && p.push(q);
          }
          return (k.values = p), k;
        }),
        (c.polarToCartesian = function(a, b, c, d) {
          var e = (d - 90) * Math.PI / 180;
          return { x: a + c * Math.cos(e), y: b + c * Math.sin(e) };
        }),
        (c.createChartRect = function(a, b, d) {
          var e = !(!b.axisX && !b.axisY),
            f = e ? b.axisY.offset : 0,
            g = e ? b.axisX.offset : 0,
            h = a.width() || c.quantity(b.width).value || 0,
            i = a.height() || c.quantity(b.height).value || 0,
            j = c.normalizePadding(b.chartPadding, d);
          (h = Math.max(h, f + j.left + j.right)), (i = Math.max(i, g + j.top + j.bottom));
          var k = {
            padding: j,
            width: function() {
              return this.x2 - this.x1;
            },
            height: function() {
              return this.y1 - this.y2;
            }
          };
          return (
            e
              ? ('start' === b.axisX.position
                  ? ((k.y2 = j.top + g), (k.y1 = Math.max(i - j.bottom, k.y2 + 1)))
                  : ((k.y2 = j.top), (k.y1 = Math.max(i - j.bottom - g, k.y2 + 1))),
                'start' === b.axisY.position
                  ? ((k.x1 = j.left + f), (k.x2 = Math.max(h - j.right, k.x1 + 1)))
                  : ((k.x1 = j.left), (k.x2 = Math.max(h - j.right - f, k.x1 + 1))))
              : ((k.x1 = j.left),
                (k.x2 = Math.max(h - j.right, k.x1 + 1)),
                (k.y2 = j.top),
                (k.y1 = Math.max(i - j.bottom, k.y2 + 1))),
            k
          );
        }),
        (c.createGrid = function(a, b, d, e, f, g, h, i) {
          var j = {};
          (j[d.units.pos + '1'] = a),
            (j[d.units.pos + '2'] = a),
            (j[d.counterUnits.pos + '1'] = e),
            (j[d.counterUnits.pos + '2'] = e + f);
          var k = g.elem('line', j, h.join(' '));
          i.emit('draw', c.extend({ type: 'grid', axis: d, index: b, group: g, element: k }, j));
        }),
        (c.createGridBackground = function(a, b, c, d) {
          var e = a.elem('rect', { x: b.x1, y: b.y2, width: b.width(), height: b.height() }, c, !0);
          d.emit('draw', { type: 'gridBackground', group: a, element: e });
        }),
        (c.createLabel = function(a, d, e, f, g, h, i, j, k, l, m) {
          var n,
            o = {};
          if (
            ((o[g.units.pos] = a + i[g.units.pos]),
            (o[g.counterUnits.pos] = i[g.counterUnits.pos]),
            (o[g.units.len] = d),
            (o[g.counterUnits.len] = Math.max(0, h - 10)),
            l)
          ) {
            var p = b.createElement('span');
            (p.className = k.join(' ')),
              p.setAttribute('xmlns', c.namespaces.xhtml),
              (p.innerText = f[e]),
              (p.style[g.units.len] = Math.round(o[g.units.len]) + 'px'),
              (p.style[g.counterUnits.len] = Math.round(o[g.counterUnits.len]) + 'px'),
              (n = j.foreignObject(p, c.extend({ style: 'overflow: visible;' }, o)));
          } else n = j.elem('text', o, k.join(' ')).text(f[e]);
          m.emit(
            'draw',
            c.extend({ type: 'label', axis: g, index: e, group: j, element: n, text: f[e] }, o)
          );
        }),
        (c.getSeriesOption = function(a, b, c) {
          if (a.name && b.series && b.series[a.name]) {
            var d = b.series[a.name];
            return d.hasOwnProperty(c) ? d[c] : b[c];
          }
          return b[c];
        }),
        (c.optionsProvider = function(b, d, e) {
          function f(b) {
            var f = h;
            if (((h = c.extend({}, j)), d))
              for (i = 0; i < d.length; i++) {
                var g = a.matchMedia(d[i][0]);
                g.matches && (h = c.extend(h, d[i][1]));
              }
            e && b && e.emit('optionsChanged', { previousOptions: f, currentOptions: h });
          }
          function g() {
            k.forEach(function(a) {
              a.removeListener(f);
            });
          }
          var h,
            i,
            j = c.extend({}, b),
            k = [];
          if (!a.matchMedia)
            throw "window.matchMedia not found! Make sure you're using a polyfill.";
          if (d)
            for (i = 0; i < d.length; i++) {
              var l = a.matchMedia(d[i][0]);
              l.addListener(f), k.push(l);
            }
          return (
            f(),
            {
              removeMediaQueryListeners: g,
              getCurrentOptions: function() {
                return c.extend({}, h);
              }
            }
          );
        }),
        (c.splitIntoSegments = function(a, b, d) {
          var e = { increasingX: !1, fillHoles: !1 };
          d = c.extend({}, e, d);
          for (var f = [], g = !0, h = 0; h < a.length; h += 2)
            void 0 === c.getMultiValue(b[h / 2].value)
              ? d.fillHoles || (g = !0)
              : (d.increasingX && h >= 2 && a[h] <= a[h - 2] && (g = !0),
                g && (f.push({ pathCoordinates: [], valueData: [] }), (g = !1)),
                f[f.length - 1].pathCoordinates.push(a[h], a[h + 1]),
                f[f.length - 1].valueData.push(b[h / 2]));
          return f;
        });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      (c.Interpolation = {}),
        (c.Interpolation.none = function(a) {
          var b = { fillHoles: !1 };
          return (
            (a = c.extend({}, b, a)),
            function(b, d) {
              for (var e = new c.Svg.Path(), f = !0, g = 0; g < b.length; g += 2) {
                var h = b[g],
                  i = b[g + 1],
                  j = d[g / 2];
                void 0 !== c.getMultiValue(j.value)
                  ? (f ? e.move(h, i, !1, j) : e.line(h, i, !1, j), (f = !1))
                  : a.fillHoles || (f = !0);
              }
              return e;
            }
          );
        }),
        (c.Interpolation.simple = function(a) {
          var b = { divisor: 2, fillHoles: !1 };
          a = c.extend({}, b, a);
          var d = 1 / Math.max(1, a.divisor);
          return function(b, e) {
            for (var f, g, h, i = new c.Svg.Path(), j = 0; j < b.length; j += 2) {
              var k = b[j],
                l = b[j + 1],
                m = (k - f) * d,
                n = e[j / 2];
              void 0 !== n.value
                ? (void 0 === h ? i.move(k, l, !1, n) : i.curve(f + m, g, k - m, l, k, l, !1, n),
                  (f = k),
                  (g = l),
                  (h = n))
                : a.fillHoles || (f = k = h = void 0);
            }
            return i;
          };
        }),
        (c.Interpolation.cardinal = function(a) {
          var b = { tension: 1, fillHoles: !1 };
          a = c.extend({}, b, a);
          var d = Math.min(1, Math.max(0, a.tension)),
            e = 1 - d;
          return function f(b, g) {
            var h = c.splitIntoSegments(b, g, { fillHoles: a.fillHoles });
            if (h.length) {
              if (h.length > 1) {
                var i = [];
                return (
                  h.forEach(function(a) {
                    i.push(f(a.pathCoordinates, a.valueData));
                  }),
                  c.Svg.Path.join(i)
                );
              }
              if (((b = h[0].pathCoordinates), (g = h[0].valueData), b.length <= 4))
                return c.Interpolation.none()(b, g);
              for (
                var j, k = new c.Svg.Path().move(b[0], b[1], !1, g[0]), l = 0, m = b.length;
                m - 2 * !j > l;
                l += 2
              ) {
                var n = [
                  { x: +b[l - 2], y: +b[l - 1] },
                  { x: +b[l], y: +b[l + 1] },
                  { x: +b[l + 2], y: +b[l + 3] },
                  { x: +b[l + 4], y: +b[l + 5] }
                ];
                j
                  ? l
                    ? m - 4 === l
                      ? (n[3] = { x: +b[0], y: +b[1] })
                      : m - 2 === l &&
                        ((n[2] = { x: +b[0], y: +b[1] }), (n[3] = { x: +b[2], y: +b[3] }))
                    : (n[0] = { x: +b[m - 2], y: +b[m - 1] })
                  : m - 4 === l ? (n[3] = n[2]) : l || (n[0] = { x: +b[l], y: +b[l + 1] }),
                  k.curve(
                    d * (-n[0].x + 6 * n[1].x + n[2].x) / 6 + e * n[2].x,
                    d * (-n[0].y + 6 * n[1].y + n[2].y) / 6 + e * n[2].y,
                    d * (n[1].x + 6 * n[2].x - n[3].x) / 6 + e * n[2].x,
                    d * (n[1].y + 6 * n[2].y - n[3].y) / 6 + e * n[2].y,
                    n[2].x,
                    n[2].y,
                    !1,
                    g[(l + 2) / 2]
                  );
              }
              return k;
            }
            return c.Interpolation.none()([]);
          };
        }),
        (c.Interpolation.monotoneCubic = function(a) {
          var b = { fillHoles: !1 };
          return (
            (a = c.extend({}, b, a)),
            function d(b, e) {
              var f = c.splitIntoSegments(b, e, { fillHoles: a.fillHoles, increasingX: !0 });
              if (f.length) {
                if (f.length > 1) {
                  var g = [];
                  return (
                    f.forEach(function(a) {
                      g.push(d(a.pathCoordinates, a.valueData));
                    }),
                    c.Svg.Path.join(g)
                  );
                }
                if (((b = f[0].pathCoordinates), (e = f[0].valueData), b.length <= 4))
                  return c.Interpolation.none()(b, e);
                var h,
                  i,
                  j = [],
                  k = [],
                  l = b.length / 2,
                  m = [],
                  n = [],
                  o = [],
                  p = [];
                for (h = 0; h < l; h++) (j[h] = b[2 * h]), (k[h] = b[2 * h + 1]);
                for (h = 0; h < l - 1; h++)
                  (o[h] = k[h + 1] - k[h]), (p[h] = j[h + 1] - j[h]), (n[h] = o[h] / p[h]);
                for (m[0] = n[0], m[l - 1] = n[l - 2], h = 1; h < l - 1; h++)
                  0 === n[h] || 0 === n[h - 1] || n[h - 1] > 0 != n[h] > 0
                    ? (m[h] = 0)
                    : ((m[h] =
                        3 *
                        (p[h - 1] + p[h]) /
                        ((2 * p[h] + p[h - 1]) / n[h - 1] + (p[h] + 2 * p[h - 1]) / n[h])),
                      isFinite(m[h]) || (m[h] = 0));
                for (i = new c.Svg.Path().move(j[0], k[0], !1, e[0]), h = 0; h < l - 1; h++)
                  i.curve(
                    j[h] + p[h] / 3,
                    k[h] + m[h] * p[h] / 3,
                    j[h + 1] - p[h] / 3,
                    k[h + 1] - m[h + 1] * p[h] / 3,
                    j[h + 1],
                    k[h + 1],
                    !1,
                    e[h + 1]
                  );
                return i;
              }
              return c.Interpolation.none()([]);
            }
          );
        }),
        (c.Interpolation.step = function(a) {
          var b = { postpone: !0, fillHoles: !1 };
          return (
            (a = c.extend({}, b, a)),
            function(b, d) {
              for (var e, f, g, h = new c.Svg.Path(), i = 0; i < b.length; i += 2) {
                var j = b[i],
                  k = b[i + 1],
                  l = d[i / 2];
                void 0 !== l.value
                  ? (void 0 === g
                      ? h.move(j, k, !1, l)
                      : (a.postpone ? h.line(j, f, !1, g) : h.line(e, k, !1, l),
                        h.line(j, k, !1, l)),
                    (e = j),
                    (f = k),
                    (g = l))
                  : a.fillHoles || (e = f = g = void 0);
              }
              return h;
            }
          );
        });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      c.EventEmitter = function() {
        function a(a, b) {
          (d[a] = d[a] || []), d[a].push(b);
        }
        function b(a, b) {
          d[a] &&
            (b ? (d[a].splice(d[a].indexOf(b), 1), 0 === d[a].length && delete d[a]) : delete d[a]);
        }
        function c(a, b) {
          d[a] &&
            d[a].forEach(function(a) {
              a(b);
            }),
            d['*'] &&
              d['*'].forEach(function(c) {
                c(a, b);
              });
        }
        var d = [];
        return { addEventHandler: a, removeEventHandler: b, emit: c };
      };
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a) {
        var b = [];
        if (a.length) for (var c = 0; c < a.length; c++) b.push(a[c]);
        return b;
      }
      function e(a, b) {
        var d = b || this.prototype || c.Class,
          e = Object.create(d);
        c.Class.cloneDefinitions(e, a);
        var f = function() {
          var a,
            b = e.constructor || function() {};
          return (
            (a = this === c ? Object.create(e) : this),
            b.apply(a, Array.prototype.slice.call(arguments, 0)),
            a
          );
        };
        return (f.prototype = e), (f['super'] = d), (f.extend = this.extend), f;
      }
      function f() {
        var a = d(arguments),
          b = a[0];
        return (
          a.splice(1, a.length - 1).forEach(function(a) {
            Object.getOwnPropertyNames(a).forEach(function(c) {
              delete b[c], Object.defineProperty(b, c, Object.getOwnPropertyDescriptor(a, c));
            });
          }),
          b
        );
      }
      c.Class = { extend: e, cloneDefinitions: f };
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, d) {
        return (
          a &&
            ((this.data = a || {}),
            (this.data.labels = this.data.labels || []),
            (this.data.series = this.data.series || []),
            this.eventEmitter.emit('data', { type: 'update', data: this.data })),
          b &&
            ((this.options = c.extend({}, d ? this.options : this.defaultOptions, b)),
            this.initializeTimeoutId ||
              (this.optionsProvider.removeMediaQueryListeners(),
              (this.optionsProvider = c.optionsProvider(
                this.options,
                this.responsiveOptions,
                this.eventEmitter
              )))),
          this.initializeTimeoutId || this.createChart(this.optionsProvider.getCurrentOptions()),
          this
        );
      }
      function e() {
        return (
          this.initializeTimeoutId
            ? a.clearTimeout(this.initializeTimeoutId)
            : (a.removeEventListener('resize', this.resizeListener),
              this.optionsProvider.removeMediaQueryListeners()),
          this
        );
      }
      function f(a, b) {
        return this.eventEmitter.addEventHandler(a, b), this;
      }
      function g(a, b) {
        return this.eventEmitter.removeEventHandler(a, b), this;
      }
      function h() {
        a.addEventListener('resize', this.resizeListener),
          (this.optionsProvider = c.optionsProvider(
            this.options,
            this.responsiveOptions,
            this.eventEmitter
          )),
          this.eventEmitter.addEventHandler(
            'optionsChanged',
            function() {
              this.update();
            }.bind(this)
          ),
          this.options.plugins &&
            this.options.plugins.forEach(
              function(a) {
                a instanceof Array ? a[0](this, a[1]) : a(this);
              }.bind(this)
            ),
          this.eventEmitter.emit('data', { type: 'initial', data: this.data }),
          this.createChart(this.optionsProvider.getCurrentOptions()),
          (this.initializeTimeoutId = void 0);
      }
      function i(a, b, d, e, f) {
        (this.container = c.querySelector(a)),
          (this.data = b || {}),
          (this.data.labels = this.data.labels || []),
          (this.data.series = this.data.series || []),
          (this.defaultOptions = d),
          (this.options = e),
          (this.responsiveOptions = f),
          (this.eventEmitter = c.EventEmitter()),
          (this.supportsForeignObject = c.Svg.isSupported('Extensibility')),
          (this.supportsAnimations = c.Svg.isSupported('AnimationEventsAttribute')),
          (this.resizeListener = function() {
            this.update();
          }.bind(this)),
          this.container &&
            (this.container.__chartist__ && this.container.__chartist__.detach(),
            (this.container.__chartist__ = this)),
          (this.initializeTimeoutId = setTimeout(h.bind(this), 0));
      }
      c.Base = c.Class.extend({
        constructor: i,
        optionsProvider: void 0,
        container: void 0,
        svg: void 0,
        eventEmitter: void 0,
        createChart: function() {
          throw new Error("Base chart type can't be instantiated!");
        },
        update: d,
        detach: e,
        on: f,
        off: g,
        version: c.version,
        supportsForeignObject: !1
      });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, d, e, f, g) {
        a instanceof Element
          ? (this._node = a)
          : ((this._node = b.createElementNS(c.namespaces.svg, a)),
            'svg' === a && this.attr({ 'xmlns:ct': c.namespaces.ct })),
          d && this.attr(d),
          e && this.addClass(e),
          f &&
            (g && f._node.firstChild
              ? f._node.insertBefore(this._node, f._node.firstChild)
              : f._node.appendChild(this._node));
      }
      function e(a, b) {
        return 'string' == typeof a
          ? b ? this._node.getAttributeNS(b, a) : this._node.getAttribute(a)
          : (Object.keys(a).forEach(
              function(b) {
                if (void 0 !== a[b])
                  if (b.indexOf(':') !== -1) {
                    var d = b.split(':');
                    this._node.setAttributeNS(c.namespaces[d[0]], b, a[b]);
                  } else this._node.setAttribute(b, a[b]);
              }.bind(this)
            ),
            this);
      }
      function f(a, b, d, e) {
        return new c.Svg(a, b, d, this, e);
      }
      function g() {
        return this._node.parentNode instanceof SVGElement
          ? new c.Svg(this._node.parentNode)
          : null;
      }
      function h() {
        for (var a = this._node; 'svg' !== a.nodeName; ) a = a.parentNode;
        return new c.Svg(a);
      }
      function i(a) {
        var b = this._node.querySelector(a);
        return b ? new c.Svg(b) : null;
      }
      function j(a) {
        var b = this._node.querySelectorAll(a);
        return b.length ? new c.Svg.List(b) : null;
      }
      function k() {
        return this._node;
      }
      function l(a, d, e, f) {
        if ('string' == typeof a) {
          var g = b.createElement('div');
          (g.innerHTML = a), (a = g.firstChild);
        }
        a.setAttribute('xmlns', c.namespaces.xmlns);
        var h = this.elem('foreignObject', d, e, f);
        return h._node.appendChild(a), h;
      }
      function m(a) {
        return this._node.appendChild(b.createTextNode(a)), this;
      }
      function n() {
        for (; this._node.firstChild; ) this._node.removeChild(this._node.firstChild);
        return this;
      }
      function o() {
        return this._node.parentNode.removeChild(this._node), this.parent();
      }
      function p(a) {
        return this._node.parentNode.replaceChild(a._node, this._node), a;
      }
      function q(a, b) {
        return (
          b && this._node.firstChild
            ? this._node.insertBefore(a._node, this._node.firstChild)
            : this._node.appendChild(a._node),
          this
        );
      }
      function r() {
        return this._node.getAttribute('class')
          ? this._node
              .getAttribute('class')
              .trim()
              .split(/\s+/)
          : [];
      }
      function s(a) {
        return (
          this._node.setAttribute(
            'class',
            this.classes(this._node)
              .concat(a.trim().split(/\s+/))
              .filter(function(a, b, c) {
                return c.indexOf(a) === b;
              })
              .join(' ')
          ),
          this
        );
      }
      function t(a) {
        var b = a.trim().split(/\s+/);
        return (
          this._node.setAttribute(
            'class',
            this.classes(this._node)
              .filter(function(a) {
                return b.indexOf(a) === -1;
              })
              .join(' ')
          ),
          this
        );
      }
      function u() {
        return this._node.setAttribute('class', ''), this;
      }
      function v() {
        return this._node.getBoundingClientRect().height;
      }
      function w() {
        return this._node.getBoundingClientRect().width;
      }
      function x(a, b, d) {
        return (
          void 0 === b && (b = !0),
          Object.keys(a).forEach(
            function(e) {
              function f(a, b) {
                var f,
                  g,
                  h,
                  i = {};
                a.easing &&
                  ((h = a.easing instanceof Array ? a.easing : c.Svg.Easing[a.easing]),
                  delete a.easing),
                  (a.begin = c.ensureUnit(a.begin, 'ms')),
                  (a.dur = c.ensureUnit(a.dur, 'ms')),
                  h &&
                    ((a.calcMode = 'spline'), (a.keySplines = h.join(' ')), (a.keyTimes = '0;1')),
                  b &&
                    ((a.fill = 'freeze'),
                    (i[e] = a.from),
                    this.attr(i),
                    (g = c.quantity(a.begin || 0).value),
                    (a.begin = 'indefinite')),
                  (f = this.elem('animate', c.extend({ attributeName: e }, a))),
                  b &&
                    setTimeout(
                      function() {
                        try {
                          f._node.beginElement();
                        } catch (b) {
                          (i[e] = a.to), this.attr(i), f.remove();
                        }
                      }.bind(this),
                      g
                    ),
                  d &&
                    f._node.addEventListener(
                      'beginEvent',
                      function() {
                        d.emit('animationBegin', { element: this, animate: f._node, params: a });
                      }.bind(this)
                    ),
                  f._node.addEventListener(
                    'endEvent',
                    function() {
                      d && d.emit('animationEnd', { element: this, animate: f._node, params: a }),
                        b && ((i[e] = a.to), this.attr(i), f.remove());
                    }.bind(this)
                  );
              }
              a[e] instanceof Array
                ? a[e].forEach(
                    function(a) {
                      f.bind(this)(a, !1);
                    }.bind(this)
                  )
                : f.bind(this)(a[e], b);
            }.bind(this)
          ),
          this
        );
      }
      function y(a) {
        var b = this;
        this.svgElements = [];
        for (var d = 0; d < a.length; d++) this.svgElements.push(new c.Svg(a[d]));
        Object.keys(c.Svg.prototype)
          .filter(function(a) {
            return (
              [
                'constructor',
                'parent',
                'querySelector',
                'querySelectorAll',
                'replace',
                'append',
                'classes',
                'height',
                'width'
              ].indexOf(a) === -1
            );
          })
          .forEach(function(a) {
            b[a] = function() {
              var d = Array.prototype.slice.call(arguments, 0);
              return (
                b.svgElements.forEach(function(b) {
                  c.Svg.prototype[a].apply(b, d);
                }),
                b
              );
            };
          });
      }
      (c.Svg = c.Class.extend({
        constructor: d,
        attr: e,
        elem: f,
        parent: g,
        root: h,
        querySelector: i,
        querySelectorAll: j,
        getNode: k,
        foreignObject: l,
        text: m,
        empty: n,
        remove: o,
        replace: p,
        append: q,
        classes: r,
        addClass: s,
        removeClass: t,
        removeAllClasses: u,
        height: v,
        width: w,
        animate: x
      })),
        (c.Svg.isSupported = function(a) {
          return b.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#' + a, '1.1');
        });
      var z = {
        easeInSine: [0.47, 0, 0.745, 0.715],
        easeOutSine: [0.39, 0.575, 0.565, 1],
        easeInOutSine: [0.445, 0.05, 0.55, 0.95],
        easeInQuad: [0.55, 0.085, 0.68, 0.53],
        easeOutQuad: [0.25, 0.46, 0.45, 0.94],
        easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
        easeInCubic: [0.55, 0.055, 0.675, 0.19],
        easeOutCubic: [0.215, 0.61, 0.355, 1],
        easeInOutCubic: [0.645, 0.045, 0.355, 1],
        easeInQuart: [0.895, 0.03, 0.685, 0.22],
        easeOutQuart: [0.165, 0.84, 0.44, 1],
        easeInOutQuart: [0.77, 0, 0.175, 1],
        easeInQuint: [0.755, 0.05, 0.855, 0.06],
        easeOutQuint: [0.23, 1, 0.32, 1],
        easeInOutQuint: [0.86, 0, 0.07, 1],
        easeInExpo: [0.95, 0.05, 0.795, 0.035],
        easeOutExpo: [0.19, 1, 0.22, 1],
        easeInOutExpo: [1, 0, 0, 1],
        easeInCirc: [0.6, 0.04, 0.98, 0.335],
        easeOutCirc: [0.075, 0.82, 0.165, 1],
        easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
        easeInBack: [0.6, -0.28, 0.735, 0.045],
        easeOutBack: [0.175, 0.885, 0.32, 1.275],
        easeInOutBack: [0.68, -0.55, 0.265, 1.55]
      };
      (c.Svg.Easing = z), (c.Svg.List = c.Class.extend({ constructor: y }));
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, d, e, f, g) {
        var h = c.extend(
          { command: f ? a.toLowerCase() : a.toUpperCase() },
          b,
          g ? { data: g } : {}
        );
        d.splice(e, 0, h);
      }
      function e(a, b) {
        a.forEach(function(c, d) {
          u[c.command.toLowerCase()].forEach(function(e, f) {
            b(c, e, d, f, a);
          });
        });
      }
      function f(a, b) {
        (this.pathElements = []),
          (this.pos = 0),
          (this.close = a),
          (this.options = c.extend({}, v, b));
      }
      function g(a) {
        return void 0 !== a
          ? ((this.pos = Math.max(0, Math.min(this.pathElements.length, a))), this)
          : this.pos;
      }
      function h(a) {
        return this.pathElements.splice(this.pos, a), this;
      }
      function i(a, b, c, e) {
        return d('M', { x: +a, y: +b }, this.pathElements, this.pos++, c, e), this;
      }
      function j(a, b, c, e) {
        return d('L', { x: +a, y: +b }, this.pathElements, this.pos++, c, e), this;
      }
      function k(a, b, c, e, f, g, h, i) {
        return (
          d(
            'C',
            { x1: +a, y1: +b, x2: +c, y2: +e, x: +f, y: +g },
            this.pathElements,
            this.pos++,
            h,
            i
          ),
          this
        );
      }
      function l(a, b, c, e, f, g, h, i, j) {
        return (
          d(
            'A',
            { rx: +a, ry: +b, xAr: +c, lAf: +e, sf: +f, x: +g, y: +h },
            this.pathElements,
            this.pos++,
            i,
            j
          ),
          this
        );
      }
      function m(a) {
        var b = a
          .replace(/([A-Za-z])([0-9])/g, '$1 $2')
          .replace(/([0-9])([A-Za-z])/g, '$1 $2')
          .split(/[\s,]+/)
          .reduce(function(a, b) {
            return b.match(/[A-Za-z]/) && a.push([]), a[a.length - 1].push(b), a;
          }, []);
        'Z' === b[b.length - 1][0].toUpperCase() && b.pop();
        var d = b.map(function(a) {
            var b = a.shift(),
              d = u[b.toLowerCase()];
            return c.extend(
              { command: b },
              d.reduce(function(b, c, d) {
                return (b[c] = +a[d]), b;
              }, {})
            );
          }),
          e = [this.pos, 0];
        return (
          Array.prototype.push.apply(e, d),
          Array.prototype.splice.apply(this.pathElements, e),
          (this.pos += d.length),
          this
        );
      }
      function n() {
        var a = Math.pow(10, this.options.accuracy);
        return (
          this.pathElements.reduce(
            function(b, c) {
              var d = u[c.command.toLowerCase()].map(
                function(b) {
                  return this.options.accuracy ? Math.round(c[b] * a) / a : c[b];
                }.bind(this)
              );
              return b + c.command + d.join(',');
            }.bind(this),
            ''
          ) + (this.close ? 'Z' : '')
        );
      }
      function o(a, b) {
        return (
          e(this.pathElements, function(c, d) {
            c[d] *= 'x' === d[0] ? a : b;
          }),
          this
        );
      }
      function p(a, b) {
        return (
          e(this.pathElements, function(c, d) {
            c[d] += 'x' === d[0] ? a : b;
          }),
          this
        );
      }
      function q(a) {
        return (
          e(this.pathElements, function(b, c, d, e, f) {
            var g = a(b, c, d, e, f);
            (g || 0 === g) && (b[c] = g);
          }),
          this
        );
      }
      function r(a) {
        var b = new c.Svg.Path(a || this.close);
        return (
          (b.pos = this.pos),
          (b.pathElements = this.pathElements.slice().map(function(a) {
            return c.extend({}, a);
          })),
          (b.options = c.extend({}, this.options)),
          b
        );
      }
      function s(a) {
        var b = [new c.Svg.Path()];
        return (
          this.pathElements.forEach(function(d) {
            d.command === a.toUpperCase() &&
              0 !== b[b.length - 1].pathElements.length &&
              b.push(new c.Svg.Path()),
              b[b.length - 1].pathElements.push(d);
          }),
          b
        );
      }
      function t(a, b, d) {
        for (var e = new c.Svg.Path(b, d), f = 0; f < a.length; f++)
          for (var g = a[f], h = 0; h < g.pathElements.length; h++)
            e.pathElements.push(g.pathElements[h]);
        return e;
      }
      var u = {
          m: ['x', 'y'],
          l: ['x', 'y'],
          c: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
          a: ['rx', 'ry', 'xAr', 'lAf', 'sf', 'x', 'y']
        },
        v = { accuracy: 3 };
      (c.Svg.Path = c.Class.extend({
        constructor: f,
        position: g,
        remove: h,
        move: i,
        line: j,
        curve: k,
        arc: l,
        scale: o,
        translate: p,
        transform: q,
        parse: m,
        stringify: n,
        clone: r,
        splitByCommand: s
      })),
        (c.Svg.Path.elementDescriptions = u),
        (c.Svg.Path.join = t);
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, c, d) {
        (this.units = a),
          (this.counterUnits = a === f.x ? f.y : f.x),
          (this.chartRect = b),
          (this.axisLength = b[a.rectEnd] - b[a.rectStart]),
          (this.gridOffset = b[a.rectOffset]),
          (this.ticks = c),
          (this.options = d);
      }
      function e(a, b, d, e, f) {
        var g = e['axis' + this.units.pos.toUpperCase()],
          h = this.ticks.map(this.projectValue.bind(this)),
          i = this.ticks.map(g.labelInterpolationFnc);
        h.forEach(
          function(j, k) {
            var l,
              m = { x: 0, y: 0 };
            (l = h[k + 1] ? h[k + 1] - j : Math.max(this.axisLength - j, 30)),
              (c.isFalseyButZero(i[k]) && '' !== i[k]) ||
                ('x' === this.units.pos
                  ? ((j = this.chartRect.x1 + j),
                    (m.x = e.axisX.labelOffset.x),
                    'start' === e.axisX.position
                      ? (m.y = this.chartRect.padding.top + e.axisX.labelOffset.y + (d ? 5 : 20))
                      : (m.y = this.chartRect.y1 + e.axisX.labelOffset.y + (d ? 5 : 20)))
                  : ((j = this.chartRect.y1 - j),
                    (m.y = e.axisY.labelOffset.y - (d ? l : 0)),
                    'start' === e.axisY.position
                      ? (m.x = d
                          ? this.chartRect.padding.left + e.axisY.labelOffset.x
                          : this.chartRect.x1 - 10)
                      : (m.x = this.chartRect.x2 + e.axisY.labelOffset.x + 10)),
                g.showGrid &&
                  c.createGrid(
                    j,
                    k,
                    this,
                    this.gridOffset,
                    this.chartRect[this.counterUnits.len](),
                    a,
                    [e.classNames.grid, e.classNames[this.units.dir]],
                    f
                  ),
                g.showLabel &&
                  c.createLabel(
                    j,
                    l,
                    k,
                    i,
                    this,
                    g.offset,
                    m,
                    b,
                    [
                      e.classNames.label,
                      e.classNames[this.units.dir],
                      'start' === g.position ? e.classNames[g.position] : e.classNames.end
                    ],
                    d,
                    f
                  ));
          }.bind(this)
        );
      }
      var f = {
        x: {
          pos: 'x',
          len: 'width',
          dir: 'horizontal',
          rectStart: 'x1',
          rectEnd: 'x2',
          rectOffset: 'y2'
        },
        y: {
          pos: 'y',
          len: 'height',
          dir: 'vertical',
          rectStart: 'y2',
          rectEnd: 'y1',
          rectOffset: 'x1'
        }
      };
      (c.Axis = c.Class.extend({
        constructor: d,
        createGridAndLabels: e,
        projectValue: function(a, b, c) {
          throw new Error("Base axis can't be instantiated!");
        }
      })),
        (c.Axis.units = f);
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, d, e) {
        var f = e.highLow || c.getHighLow(b, e, a.pos);
        (this.bounds = c.getBounds(
          d[a.rectEnd] - d[a.rectStart],
          f,
          e.scaleMinSpace || 20,
          e.onlyInteger
        )),
          (this.range = { min: this.bounds.min, max: this.bounds.max }),
          c.AutoScaleAxis['super'].constructor.call(this, a, d, this.bounds.values, e);
      }
      function e(a) {
        return (
          this.axisLength *
          (+c.getMultiValue(a, this.units.pos) - this.bounds.min) /
          this.bounds.range
        );
      }
      c.AutoScaleAxis = c.Axis.extend({ constructor: d, projectValue: e });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, d, e) {
        var f = e.highLow || c.getHighLow(b, e, a.pos);
        (this.divisor = e.divisor || 1),
          (this.ticks =
            e.ticks ||
            c.times(this.divisor).map(
              function(a, b) {
                return f.low + (f.high - f.low) / this.divisor * b;
              }.bind(this)
            )),
          this.ticks.sort(function(a, b) {
            return a - b;
          }),
          (this.range = { min: f.low, max: f.high }),
          c.FixedScaleAxis['super'].constructor.call(this, a, d, this.ticks, e),
          (this.stepLength = this.axisLength / this.divisor);
      }
      function e(a) {
        return (
          this.axisLength *
          (+c.getMultiValue(a, this.units.pos) - this.range.min) /
          (this.range.max - this.range.min)
        );
      }
      c.FixedScaleAxis = c.Axis.extend({ constructor: d, projectValue: e });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, d, e) {
        c.StepAxis['super'].constructor.call(this, a, d, e.ticks, e);
        var f = Math.max(1, e.ticks.length - (e.stretch ? 1 : 0));
        this.stepLength = this.axisLength / f;
      }
      function e(a, b) {
        return this.stepLength * b;
      }
      c.StepAxis = c.Axis.extend({ constructor: d, projectValue: e });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a) {
        var b = c.normalizeData(this.data, a.reverseData, !0);
        this.svg = c.createSvg(this.container, a.width, a.height, a.classNames.chart);
        var d,
          e,
          g = this.svg.elem('g').addClass(a.classNames.gridGroup),
          h = this.svg.elem('g'),
          i = this.svg.elem('g').addClass(a.classNames.labelGroup),
          j = c.createChartRect(this.svg, a, f.padding);
        (d =
          void 0 === a.axisX.type
            ? new c.StepAxis(
                c.Axis.units.x,
                b.normalized.series,
                j,
                c.extend({}, a.axisX, { ticks: b.normalized.labels, stretch: a.fullWidth })
              )
            : a.axisX.type.call(c, c.Axis.units.x, b.normalized.series, j, a.axisX)),
          (e =
            void 0 === a.axisY.type
              ? new c.AutoScaleAxis(
                  c.Axis.units.y,
                  b.normalized.series,
                  j,
                  c.extend({}, a.axisY, {
                    high: c.isNumeric(a.high) ? a.high : a.axisY.high,
                    low: c.isNumeric(a.low) ? a.low : a.axisY.low
                  })
                )
              : a.axisY.type.call(c, c.Axis.units.y, b.normalized.series, j, a.axisY)),
          d.createGridAndLabels(g, i, this.supportsForeignObject, a, this.eventEmitter),
          e.createGridAndLabels(g, i, this.supportsForeignObject, a, this.eventEmitter),
          a.showGridBackground &&
            c.createGridBackground(g, j, a.classNames.gridBackground, this.eventEmitter),
          b.raw.series.forEach(
            function(f, g) {
              var i = h.elem('g');
              i.attr({ 'ct:series-name': f.name, 'ct:meta': c.serialize(f.meta) }),
                i.addClass(
                  [
                    a.classNames.series,
                    f.className || a.classNames.series + '-' + c.alphaNumerate(g)
                  ].join(' ')
                );
              var k = [],
                l = [];
              b.normalized.series[g].forEach(
                function(a, h) {
                  var i = {
                    x: j.x1 + d.projectValue(a, h, b.normalized.series[g]),
                    y: j.y1 - e.projectValue(a, h, b.normalized.series[g])
                  };
                  k.push(i.x, i.y), l.push({ value: a, valueIndex: h, meta: c.getMetaData(f, h) });
                }.bind(this)
              );
              var m = {
                  lineSmooth: c.getSeriesOption(f, a, 'lineSmooth'),
                  showPoint: c.getSeriesOption(f, a, 'showPoint'),
                  showLine: c.getSeriesOption(f, a, 'showLine'),
                  showArea: c.getSeriesOption(f, a, 'showArea'),
                  areaBase: c.getSeriesOption(f, a, 'areaBase')
                },
                n =
                  'function' == typeof m.lineSmooth
                    ? m.lineSmooth
                    : m.lineSmooth ? c.Interpolation.monotoneCubic() : c.Interpolation.none(),
                o = n(k, l);
              if (
                (m.showPoint &&
                  o.pathElements.forEach(
                    function(b) {
                      var h = i
                        .elem(
                          'line',
                          { x1: b.x, y1: b.y, x2: b.x + 0.01, y2: b.y },
                          a.classNames.point
                        )
                        .attr({
                          'ct:value': [b.data.value.x, b.data.value.y]
                            .filter(c.isNumeric)
                            .join(','),
                          'ct:meta': c.serialize(b.data.meta)
                        });
                      this.eventEmitter.emit('draw', {
                        type: 'point',
                        value: b.data.value,
                        index: b.data.valueIndex,
                        meta: b.data.meta,
                        series: f,
                        seriesIndex: g,
                        axisX: d,
                        axisY: e,
                        group: i,
                        element: h,
                        x: b.x,
                        y: b.y
                      });
                    }.bind(this)
                  ),
                m.showLine)
              ) {
                var p = i.elem('path', { d: o.stringify() }, a.classNames.line, !0);
                this.eventEmitter.emit('draw', {
                  type: 'line',
                  values: b.normalized.series[g],
                  path: o.clone(),
                  chartRect: j,
                  index: g,
                  series: f,
                  seriesIndex: g,
                  seriesMeta: f.meta,
                  axisX: d,
                  axisY: e,
                  group: i,
                  element: p
                });
              }
              if (m.showArea && e.range) {
                var q = Math.max(Math.min(m.areaBase, e.range.max), e.range.min),
                  r = j.y1 - e.projectValue(q);
                o
                  .splitByCommand('M')
                  .filter(function(a) {
                    return a.pathElements.length > 1;
                  })
                  .map(function(a) {
                    var b = a.pathElements[0],
                      c = a.pathElements[a.pathElements.length - 1];
                    return a
                      .clone(!0)
                      .position(0)
                      .remove(1)
                      .move(b.x, r)
                      .line(b.x, b.y)
                      .position(a.pathElements.length + 1)
                      .line(c.x, r);
                  })
                  .forEach(
                    function(c) {
                      var h = i.elem('path', { d: c.stringify() }, a.classNames.area, !0);
                      this.eventEmitter.emit('draw', {
                        type: 'area',
                        values: b.normalized.series[g],
                        path: c.clone(),
                        series: f,
                        seriesIndex: g,
                        axisX: d,
                        axisY: e,
                        chartRect: j,
                        index: g,
                        group: i,
                        element: h
                      });
                    }.bind(this)
                  );
              }
            }.bind(this)
          ),
          this.eventEmitter.emit('created', {
            bounds: e.bounds,
            chartRect: j,
            axisX: d,
            axisY: e,
            svg: this.svg,
            options: a
          });
      }
      function e(a, b, d, e) {
        c.Line['super'].constructor.call(this, a, b, f, c.extend({}, f, d), e);
      }
      var f = {
        axisX: {
          offset: 30,
          position: 'end',
          labelOffset: { x: 0, y: 0 },
          showLabel: !0,
          showGrid: !0,
          labelInterpolationFnc: c.noop,
          type: void 0
        },
        axisY: {
          offset: 40,
          position: 'start',
          labelOffset: { x: 0, y: 0 },
          showLabel: !0,
          showGrid: !0,
          labelInterpolationFnc: c.noop,
          type: void 0,
          scaleMinSpace: 20,
          onlyInteger: !1
        },
        width: void 0,
        height: void 0,
        showLine: !0,
        showPoint: !0,
        showArea: !1,
        areaBase: 0,
        lineSmooth: !0,
        showGridBackground: !1,
        low: void 0,
        high: void 0,
        chartPadding: { top: 15, right: 15, bottom: 5, left: 10 },
        fullWidth: !1,
        reverseData: !1,
        classNames: {
          chart: 'ct-chart-line',
          label: 'ct-label',
          labelGroup: 'ct-labels',
          series: 'ct-series',
          line: 'ct-line',
          point: 'ct-point',
          area: 'ct-area',
          grid: 'ct-grid',
          gridGroup: 'ct-grids',
          gridBackground: 'ct-grid-background',
          vertical: 'ct-vertical',
          horizontal: 'ct-horizontal',
          start: 'ct-start',
          end: 'ct-end'
        }
      };
      c.Line = c.Base.extend({ constructor: e, createChart: d });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a) {
        var b, d;
        a.distributeSeries
          ? ((b = c.normalizeData(this.data, a.reverseData, a.horizontalBars ? 'x' : 'y')),
            (b.normalized.series = b.normalized.series.map(function(a) {
              return [a];
            })))
          : (b = c.normalizeData(this.data, a.reverseData, a.horizontalBars ? 'x' : 'y')),
          (this.svg = c.createSvg(
            this.container,
            a.width,
            a.height,
            a.classNames.chart + (a.horizontalBars ? ' ' + a.classNames.horizontalBars : '')
          ));
        var e = this.svg.elem('g').addClass(a.classNames.gridGroup),
          g = this.svg.elem('g'),
          h = this.svg.elem('g').addClass(a.classNames.labelGroup);
        if (a.stackBars && 0 !== b.normalized.series.length) {
          var i = c.serialMap(b.normalized.series, function() {
            return Array.prototype.slice
              .call(arguments)
              .map(function(a) {
                return a;
              })
              .reduce(
                function(a, b) {
                  return { x: a.x + (b && b.x) || 0, y: a.y + (b && b.y) || 0 };
                },
                { x: 0, y: 0 }
              );
          });
          d = c.getHighLow([i], a, a.horizontalBars ? 'x' : 'y');
        } else d = c.getHighLow(b.normalized.series, a, a.horizontalBars ? 'x' : 'y');
        (d.high = +a.high || (0 === a.high ? 0 : d.high)),
          (d.low = +a.low || (0 === a.low ? 0 : d.low));
        var j,
          k,
          l,
          m,
          n,
          o = c.createChartRect(this.svg, a, f.padding);
        (k =
          a.distributeSeries && a.stackBars
            ? b.normalized.labels.slice(0, 1)
            : b.normalized.labels),
          a.horizontalBars
            ? ((j = m =
                void 0 === a.axisX.type
                  ? new c.AutoScaleAxis(
                      c.Axis.units.x,
                      b.normalized.series,
                      o,
                      c.extend({}, a.axisX, { highLow: d, referenceValue: 0 })
                    )
                  : a.axisX.type.call(
                      c,
                      c.Axis.units.x,
                      b.normalized.series,
                      o,
                      c.extend({}, a.axisX, { highLow: d, referenceValue: 0 })
                    )),
              (l = n =
                void 0 === a.axisY.type
                  ? new c.StepAxis(c.Axis.units.y, b.normalized.series, o, { ticks: k })
                  : a.axisY.type.call(c, c.Axis.units.y, b.normalized.series, o, a.axisY)))
            : ((l = m =
                void 0 === a.axisX.type
                  ? new c.StepAxis(c.Axis.units.x, b.normalized.series, o, { ticks: k })
                  : a.axisX.type.call(c, c.Axis.units.x, b.normalized.series, o, a.axisX)),
              (j = n =
                void 0 === a.axisY.type
                  ? new c.AutoScaleAxis(
                      c.Axis.units.y,
                      b.normalized.series,
                      o,
                      c.extend({}, a.axisY, { highLow: d, referenceValue: 0 })
                    )
                  : a.axisY.type.call(
                      c,
                      c.Axis.units.y,
                      b.normalized.series,
                      o,
                      c.extend({}, a.axisY, { highLow: d, referenceValue: 0 })
                    )));
        var p = a.horizontalBars ? o.x1 + j.projectValue(0) : o.y1 - j.projectValue(0),
          q = [];
        l.createGridAndLabels(e, h, this.supportsForeignObject, a, this.eventEmitter),
          j.createGridAndLabels(e, h, this.supportsForeignObject, a, this.eventEmitter),
          a.showGridBackground &&
            c.createGridBackground(e, o, a.classNames.gridBackground, this.eventEmitter),
          b.raw.series.forEach(
            function(d, e) {
              var f,
                h,
                i = e - (b.raw.series.length - 1) / 2;
              (f =
                a.distributeSeries && !a.stackBars
                  ? l.axisLength / b.normalized.series.length / 2
                  : a.distributeSeries && a.stackBars
                    ? l.axisLength / 2
                    : l.axisLength / b.normalized.series[e].length / 2),
                (h = g.elem('g')),
                h.attr({ 'ct:series-name': d.name, 'ct:meta': c.serialize(d.meta) }),
                h.addClass(
                  [
                    a.classNames.series,
                    d.className || a.classNames.series + '-' + c.alphaNumerate(e)
                  ].join(' ')
                ),
                b.normalized.series[e].forEach(
                  function(g, k) {
                    var r, s, t, u;
                    if (
                      ((u =
                        a.distributeSeries && !a.stackBars
                          ? e
                          : a.distributeSeries && a.stackBars ? 0 : k),
                      (r = a.horizontalBars
                        ? {
                            x: o.x1 + j.projectValue(g && g.x ? g.x : 0, k, b.normalized.series[e]),
                            y: o.y1 - l.projectValue(g && g.y ? g.y : 0, u, b.normalized.series[e])
                          }
                        : {
                            x: o.x1 + l.projectValue(g && g.x ? g.x : 0, u, b.normalized.series[e]),
                            y: o.y1 - j.projectValue(g && g.y ? g.y : 0, k, b.normalized.series[e])
                          }),
                      l instanceof c.StepAxis &&
                        (l.options.stretch || (r[l.units.pos] += f * (a.horizontalBars ? -1 : 1)),
                        (r[l.units.pos] +=
                          a.stackBars || a.distributeSeries
                            ? 0
                            : i * a.seriesBarDistance * (a.horizontalBars ? -1 : 1))),
                      (t = q[k] || p),
                      (q[k] = t - (p - r[l.counterUnits.pos])),
                      void 0 !== g)
                    ) {
                      var v = {};
                      (v[l.units.pos + '1'] = r[l.units.pos]),
                        (v[l.units.pos + '2'] = r[l.units.pos]),
                        !a.stackBars || ('accumulate' !== a.stackMode && a.stackMode)
                          ? ((v[l.counterUnits.pos + '1'] = p),
                            (v[l.counterUnits.pos + '2'] = r[l.counterUnits.pos]))
                          : ((v[l.counterUnits.pos + '1'] = t),
                            (v[l.counterUnits.pos + '2'] = q[k])),
                        (v.x1 = Math.min(Math.max(v.x1, o.x1), o.x2)),
                        (v.x2 = Math.min(Math.max(v.x2, o.x1), o.x2)),
                        (v.y1 = Math.min(Math.max(v.y1, o.y2), o.y1)),
                        (v.y2 = Math.min(Math.max(v.y2, o.y2), o.y1));
                      var w = c.getMetaData(d, k);
                      (s = h
                        .elem('line', v, a.classNames.bar)
                        .attr({
                          'ct:value': [g.x, g.y].filter(c.isNumeric).join(','),
                          'ct:meta': c.serialize(w)
                        })),
                        this.eventEmitter.emit(
                          'draw',
                          c.extend(
                            {
                              type: 'bar',
                              value: g,
                              index: k,
                              meta: w,
                              series: d,
                              seriesIndex: e,
                              axisX: m,
                              axisY: n,
                              chartRect: o,
                              group: h,
                              element: s
                            },
                            v
                          )
                        );
                    }
                  }.bind(this)
                );
            }.bind(this)
          ),
          this.eventEmitter.emit('created', {
            bounds: j.bounds,
            chartRect: o,
            axisX: m,
            axisY: n,
            svg: this.svg,
            options: a
          });
      }
      function e(a, b, d, e) {
        c.Bar['super'].constructor.call(this, a, b, f, c.extend({}, f, d), e);
      }
      var f = {
        axisX: {
          offset: 30,
          position: 'end',
          labelOffset: { x: 0, y: 0 },
          showLabel: !0,
          showGrid: !0,
          labelInterpolationFnc: c.noop,
          scaleMinSpace: 30,
          onlyInteger: !1
        },
        axisY: {
          offset: 40,
          position: 'start',
          labelOffset: { x: 0, y: 0 },
          showLabel: !0,
          showGrid: !0,
          labelInterpolationFnc: c.noop,
          scaleMinSpace: 20,
          onlyInteger: !1
        },
        width: void 0,
        height: void 0,
        high: void 0,
        low: void 0,
        referenceValue: 0,
        chartPadding: { top: 15, right: 15, bottom: 5, left: 10 },
        seriesBarDistance: 15,
        stackBars: !1,
        stackMode: 'accumulate',
        horizontalBars: !1,
        distributeSeries: !1,
        reverseData: !1,
        showGridBackground: !1,
        classNames: {
          chart: 'ct-chart-bar',
          horizontalBars: 'ct-horizontal-bars',
          label: 'ct-label',
          labelGroup: 'ct-labels',
          series: 'ct-series',
          bar: 'ct-bar',
          grid: 'ct-grid',
          gridGroup: 'ct-grids',
          gridBackground: 'ct-grid-background',
          vertical: 'ct-vertical',
          horizontal: 'ct-horizontal',
          start: 'ct-start',
          end: 'ct-end'
        }
      };
      c.Bar = c.Base.extend({ constructor: e, createChart: d });
    })(window, document, a),
    (function(a, b, c) {
      'use strict';
      function d(a, b, c) {
        var d = b.x > a.x;
        return (d && 'explode' === c) || (!d && 'implode' === c)
          ? 'start'
          : (d && 'implode' === c) || (!d && 'explode' === c) ? 'end' : 'middle';
      }
      function e(a) {
        var b,
          e,
          f,
          h,
          i,
          j = c.normalizeData(this.data),
          k = [],
          l = a.startAngle;
        (this.svg = c.createSvg(
          this.container,
          a.width,
          a.height,
          a.donut ? a.classNames.chartDonut : a.classNames.chartPie
        )),
          (e = c.createChartRect(this.svg, a, g.padding)),
          (f = Math.min(e.width() / 2, e.height() / 2)),
          (i =
            a.total ||
            j.normalized.series.reduce(function(a, b) {
              return a + b;
            }, 0));
        var m = c.quantity(a.donutWidth);
        '%' === m.unit && (m.value *= f / 100),
          (f -= a.donut && !a.donutSolid ? m.value / 2 : 0),
          (h =
            'outside' === a.labelPosition || (a.donut && !a.donutSolid)
              ? f
              : 'center' === a.labelPosition ? 0 : a.donutSolid ? f - m.value / 2 : f / 2),
          (h += a.labelOffset);
        var n = { x: e.x1 + e.width() / 2, y: e.y2 + e.height() / 2 },
          o =
            1 ===
            j.raw.series.filter(function(a) {
              return a.hasOwnProperty('value') ? 0 !== a.value : 0 !== a;
            }).length;
        j.raw.series.forEach(
          function(a, b) {
            k[b] = this.svg.elem('g', null, null);
          }.bind(this)
        ),
          a.showLabel && (b = this.svg.elem('g', null, null)),
          j.raw.series.forEach(
            function(e, g) {
              if (0 !== j.normalized.series[g] || !a.ignoreEmptyValues) {
                k[g].attr({ 'ct:series-name': e.name }),
                  k[g].addClass(
                    [
                      a.classNames.series,
                      e.className || a.classNames.series + '-' + c.alphaNumerate(g)
                    ].join(' ')
                  );
                var p = i > 0 ? l + j.normalized.series[g] / i * 360 : 0,
                  q = Math.max(0, l - (0 === g || o ? 0 : 0.2));
                p - q >= 359.99 && (p = q + 359.99);
                var r,
                  s,
                  t,
                  u = c.polarToCartesian(n.x, n.y, f, q),
                  v = c.polarToCartesian(n.x, n.y, f, p),
                  w = new c.Svg.Path(!a.donut || a.donutSolid)
                    .move(v.x, v.y)
                    .arc(f, f, 0, p - l > 180, 0, u.x, u.y);
                a.donut
                  ? a.donutSolid &&
                    ((t = f - m.value),
                    (r = c.polarToCartesian(n.x, n.y, t, l - (0 === g || o ? 0 : 0.2))),
                    (s = c.polarToCartesian(n.x, n.y, t, p)),
                    w.line(r.x, r.y),
                    w.arc(t, t, 0, p - l > 180, 1, s.x, s.y))
                  : w.line(n.x, n.y);
                var x = a.classNames.slicePie;
                a.donut &&
                  ((x = a.classNames.sliceDonut),
                  a.donutSolid && (x = a.classNames.sliceDonutSolid));
                var y = k[g].elem('path', { d: w.stringify() }, x);
                if (
                  (y.attr({ 'ct:value': j.normalized.series[g], 'ct:meta': c.serialize(e.meta) }),
                  a.donut && !a.donutSolid && (y._node.style.strokeWidth = m.value + 'px'),
                  this.eventEmitter.emit('draw', {
                    type: 'slice',
                    value: j.normalized.series[g],
                    totalDataSum: i,
                    index: g,
                    meta: e.meta,
                    series: e,
                    group: k[g],
                    element: y,
                    path: w.clone(),
                    center: n,
                    radius: f,
                    startAngle: l,
                    endAngle: p
                  }),
                  a.showLabel)
                ) {
                  var z;
                  z =
                    1 === j.raw.series.length
                      ? { x: n.x, y: n.y }
                      : c.polarToCartesian(n.x, n.y, h, l + (p - l) / 2);
                  var A;
                  A =
                    j.normalized.labels && !c.isFalseyButZero(j.normalized.labels[g])
                      ? j.normalized.labels[g]
                      : j.normalized.series[g];
                  var B = a.labelInterpolationFnc(A, g);
                  if (B || 0 === B) {
                    var C = b
                      .elem(
                        'text',
                        { dx: z.x, dy: z.y, 'text-anchor': d(n, z, a.labelDirection) },
                        a.classNames.label
                      )
                      .text('' + B);
                    this.eventEmitter.emit('draw', {
                      type: 'label',
                      index: g,
                      group: b,
                      element: C,
                      text: '' + B,
                      x: z.x,
                      y: z.y
                    });
                  }
                }
                l = p;
              }
            }.bind(this)
          ),
          this.eventEmitter.emit('created', { chartRect: e, svg: this.svg, options: a });
      }
      function f(a, b, d, e) {
        c.Pie['super'].constructor.call(this, a, b, g, c.extend({}, g, d), e);
      }
      var g = {
        width: void 0,
        height: void 0,
        chartPadding: 5,
        classNames: {
          chartPie: 'ct-chart-pie',
          chartDonut: 'ct-chart-donut',
          series: 'ct-series',
          slicePie: 'ct-slice-pie',
          sliceDonut: 'ct-slice-donut',
          sliceDonutSolid: 'ct-slice-donut-solid',
          label: 'ct-label'
        },
        startAngle: 0,
        total: void 0,
        donut: !1,
        donutSolid: !1,
        donutWidth: 60,
        showLabel: !0,
        labelOffset: 0,
        labelPosition: 'inside',
        labelInterpolationFnc: c.noop,
        labelDirection: 'neutral',
        reverseData: !1,
        ignoreEmptyValues: !1
      };
      c.Pie = c.Base.extend({ constructor: f, createChart: e, determineAnchorPosition: d });
    })(window, document, a),
    a
  );
});
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia ||
  (window.matchMedia = (function() {
    'use strict';

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = window.styleMedia || window.media;

    // For those that don't support matchMedium
    if (!styleMedia) {
      var style = document.createElement('style'),
        script = document.getElementsByTagName('script')[0],
        info = null;

      style.type = 'text/css';
      style.id = 'matchmediajs-test';

      script.parentNode.insertBefore(style, script);

      // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
      info =
        ('getComputedStyle' in window && window.getComputedStyle(style, null)) ||
        style.currentStyle;

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
  })());

var assemblies = [
  {
    name: 'Player',
    classes: [
      {
        name: 'Player.ActionExecutor',
        reportPath: 'Player_ActionExecutor.htm',
        coveredLines: 183,
        uncoveredLines: 81,
        coverableLines: 264,
        totalLines: 365,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 60,
        totalBranches: 82,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Common.Dijkstra',
        reportPath: 'Player_Dijkstra.htm',
        coveredLines: 70,
        uncoveredLines: 7,
        coverableLines: 77,
        totalLines: 152,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 35,
        totalBranches: 40,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Communicator',
        reportPath: 'Player_Communicator.htm',
        coveredLines: 31,
        uncoveredLines: 22,
        coverableLines: 53,
        totalLines: 110,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 5,
        totalBranches: 10,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.ConfigFileReader',
        reportPath: 'Player_ConfigFileReader.htm',
        coveredLines: 18,
        uncoveredLines: 0,
        coverableLines: 18,
        totalLines: 37,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 6,
        totalBranches: 6,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.GameObjects.Board',
        reportPath: 'Player_Board.htm',
        coveredLines: 32,
        uncoveredLines: 26,
        coverableLines: 58,
        totalLines: 149,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 16,
        totalBranches: 32,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.GameObjects.BoardSize',
        reportPath: 'Player_BoardSize.htm',
        coveredLines: 2,
        uncoveredLines: 0,
        coverableLines: 2,
        totalLines: 15,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.GameObjects.GameInfo',
        reportPath: 'Player_GameInfo.htm',
        coveredLines: 0,
        uncoveredLines: 12,
        coverableLines: 12,
        totalLines: 33,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 4,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.GameObjects.Tile',
        reportPath: 'Player_Tile.htm',
        coveredLines: 0,
        uncoveredLines: 1,
        coverableLines: 1,
        totalLines: 27,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.GameService',
        reportPath: 'Player_GameService.htm',
        coveredLines: 22,
        uncoveredLines: 4,
        coverableLines: 26,
        totalLines: 58,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 3,
        totalBranches: 4,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.LoggerInitializer',
        reportPath: 'Player_LoggerInitializer.htm',
        coveredLines: 0,
        uncoveredLines: 12,
        coverableLines: 12,
        totalLines: 27,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.MapperInitializer',
        reportPath: 'Player_MapperInitializer.htm',
        coveredLines: 20,
        uncoveredLines: 0,
        coverableLines: 20,
        totalLines: 34,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 2,
        totalBranches: 2,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.MessageProvider',
        reportPath: 'Player_MessageProvider.htm',
        coveredLines: 48,
        uncoveredLines: 37,
        coverableLines: 85,
        totalLines: 151,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 18,
        totalBranches: 26,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.CommunicationPayload',
        reportPath: 'Player_CommunicationPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 19,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.DeletePiecePayload',
        reportPath: 'Player_DeletePiecePayload.htm',
        coveredLines: 0,
        uncoveredLines: 2,
        coverableLines: 2,
        totalLines: 14,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.DiscoveryPayload',
        reportPath: 'Player_DiscoveryPayload.htm',
        coveredLines: 3,
        uncoveredLines: 0,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.ListGamesPayload',
        reportPath: 'Player_ListGamesPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 14,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.MovePayload',
        reportPath: 'Player_MovePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 18,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.PickUpPiecePayload',
        reportPath: 'Player_PickUpPiecePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.PlaceDownPiecePayload',
        reportPath: 'Player_PlaceDownPiecePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.PlayerHelloPayload',
        reportPath: 'Player_PlayerHelloPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 21,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.RefreshStatePayload',
        reportPath: 'Player_RefreshStatePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Requests.TestPiecePayload',
        reportPath: 'Player_TestPiecePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.ActionInvalidPayload',
        reportPath: 'Player_ActionInvalidPayload.htm',
        coveredLines: 3,
        uncoveredLines: 0,
        coverableLines: 3,
        totalLines: 16,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.ActionValidPayload',
        reportPath: 'Player_ActionValidPayload.htm',
        coveredLines: 3,
        uncoveredLines: 0,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.CommunicationResponsePayload',
        reportPath: 'Player_CommunicationResponsePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 28,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.DeletePieceResponsePayload',
        reportPath: 'Player_DeletePieceResponsePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 14,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.DiscoveryResponsePayload',
        reportPath: 'Player_DiscoveryResponsePayload.htm',
        coveredLines: 3,
        uncoveredLines: 0,
        coverableLines: 3,
        totalLines: 17,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.GameFinishedPayload',
        reportPath: 'Player_GameFinishedPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 15,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.GameStartedPayload',
        reportPath: 'Player_GameStartedPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 17,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.ListGamesResponsePayload',
        reportPath: 'Player_ListGamesResponsePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 16,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.MoveResponsePayload',
        reportPath: 'Player_MoveResponsePayload.htm',
        coveredLines: 3,
        uncoveredLines: 0,
        coverableLines: 3,
        totalLines: 16,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.PickUpPieceResponsePayload',
        reportPath: 'Player_PickUpPieceResponsePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.PlaceDownPieceResponsePayload',
        reportPath: 'Player_PlaceDownPieceResponsePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 14,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.PlayerAcceptedPayload',
        reportPath: 'Player_PlayerAcceptedPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.PlayerRejectedPayload',
        reportPath: 'Player_PlayerRejectedPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 14,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.RefreshStateResponsePayload',
        reportPath: 'Player_RefreshStateResponsePayload.htm',
        coveredLines: 3,
        uncoveredLines: 0,
        coverableLines: 3,
        totalLines: 20,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.RequestSentPayload',
        reportPath: 'Player_RequestSentPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.ResponseSentPayload',
        reportPath: 'Player_ResponseSentPayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 13,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Messages.Responses.TestPieceResponsePayload',
        reportPath: 'Player_TestPieceResponsePayload.htm',
        coveredLines: 0,
        uncoveredLines: 3,
        coverableLines: 3,
        totalLines: 15,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 0,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Player',
        reportPath: 'Player_Player.htm',
        coveredLines: 37,
        uncoveredLines: 43,
        coverableLines: 80,
        totalLines: 147,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 2,
        totalBranches: 6,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.PlayerConfig',
        reportPath: 'Player_PlayerConfig.htm',
        coveredLines: 20,
        uncoveredLines: 0,
        coverableLines: 20,
        totalLines: 30,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 8,
        totalBranches: 16,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.PlayerState',
        reportPath: 'Player_PlayerState.htm',
        coveredLines: 7,
        uncoveredLines: 30,
        coverableLines: 37,
        totalLines: 90,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 10,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Program',
        reportPath: 'Player_Program.htm',
        coveredLines: 0,
        uncoveredLines: 132,
        coverableLines: 132,
        totalLines: 198,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 18,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Strategy.AbstractStrategy',
        reportPath: 'Player_AbstractStrategy.htm',
        coveredLines: 0,
        uncoveredLines: 207,
        coverableLines: 207,
        totalLines: 303,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 86,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Strategy.BlockerStrategy',
        reportPath: 'Player_BlockerStrategy.htm',
        coveredLines: 0,
        uncoveredLines: 159,
        coverableLines: 159,
        totalLines: 229,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 88,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Strategy.SectorStrategy',
        reportPath: 'Player_SectorStrategy.htm',
        coveredLines: 0,
        uncoveredLines: 146,
        coverableLines: 146,
        totalLines: 227,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 72,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      },
      {
        name: 'Player.Strategy.TrivialStrategy',
        reportPath: 'Player_TrivialStrategy.htm',
        coveredLines: 0,
        uncoveredLines: 56,
        coverableLines: 56,
        totalLines: 91,
        coverageType: 'LineCoverage',
        methodCoverage: '-',
        coveredBranches: 0,
        totalBranches: 28,
        lineCoverageHistory: [],
        branchCoverageHistory: []
      }
    ]
  }
];

var riskHotspotMetrics = [];

var riskHotspots = [];

var branchCoverageAvailable = true;

var translations = {
  top: 'Top:',
  all: 'All',
  assembly: 'Assembly',
  class: 'Class',
  method: 'Method',
  lineCoverage: 'LineCoverage',
  noGrouping: 'No grouping',
  byAssembly: 'By assembly',
  byNamespace: 'By namespace, Level:',
  all: 'All',
  collapseAll: 'Collapse all',
  expandAll: 'Expand all',
  grouping: 'Grouping:',
  filter: 'Filter:',
  name: 'Name',
  covered: 'Covered',
  uncovered: 'Uncovered',
  coverable: 'Coverable',
  total: 'Total',
  coverage: 'Line coverage',
  branchCoverage: 'Branch coverage',
  history: 'Coverage History'
};

/* React components */
var RiskHotspotsComponent = React.createClass({
  getRiskHotspots: function(riskHotspots, assembly, numberOfHotspots, filter, sortby, sortorder) {
    var result,
      i,
      l,
      smaller = sortorder === 'asc' ? -1 : 1,
      bigger = sortorder === 'asc' ? 1 : -1;

    result = [];

    for (i = 0, l = riskHotspots.length; i < l; i++) {
      if (filter !== '' && riskHotspots[i].class.toLowerCase().indexOf(filter) === -1) {
        continue;
      }

      if (assembly !== '' && riskHotspots[i].assembly !== assembly) {
        continue;
      }

      result.push(riskHotspots[i]);
    }

    if (sortby === 'assembly') {
      result.sort(function(left, right) {
        return left.assembly === right.assembly
          ? 0
          : left.assembly < right.assembly ? smaller : bigger;
      });
    } else if (sortby === 'class') {
      result.sort(function(left, right) {
        return left.class === right.class ? 0 : left.class < right.class ? smaller : bigger;
      });
    } else if (sortby === 'method') {
      result.sort(function(left, right) {
        return left.method === right.method ? 0 : left.method < right.method ? smaller : bigger;
      });
    } else if (sortby !== '') {
      sortby = parseInt(sortby);
      result.sort(function(left, right) {
        return left.metrics[sortby].value === right.metrics[sortby].value
          ? 0
          : left.metrics[sortby].value < right.metrics[sortby].value ? smaller : bigger;
      });
    }

    result.splice(numberOfHotspots);

    return result;
  },
  updateSorting: function(sortby) {
    var sortorder = 'asc',
      assemblies;

    if (sortby === this.state.sortby) {
      sortorder = this.state.sortorder === 'asc' ? 'desc' : 'asc';
    }

    riskHotspots = this.getRiskHotspots(
      this.props.riskHotspots,
      this.state.assembly,
      this.state.numberOfHotspots,
      this.state.filter,
      sortby,
      sortorder
    );
    this.setState({ sortby: sortby, sortorder: sortorder, riskHotspots: riskHotspots });
  },
  updateAssembly: function(assembly) {
    riskHotspots = this.getRiskHotspots(
      this.props.riskHotspots,
      assembly,
      this.state.numberOfHotspots,
      this.state.filter,
      this.state.sortby,
      this.state.sortorder
    );
    this.setState({ assembly: assembly, riskHotspots: riskHotspots });
  },
  updateNumberOfHotspots: function(numberOfHotspots) {
    riskHotspots = this.getRiskHotspots(
      this.props.riskHotspots,
      this.state.assembly,
      numberOfHotspots,
      this.state.filter,
      this.state.sortby,
      this.state.sortorder
    );
    this.setState({ numberOfHotspots: numberOfHotspots, riskHotspots: riskHotspots });
  },
  updateFilter: function(filter) {
    filter = filter.toLowerCase();

    if (filter === this.state.filter) {
      return;
    }

    riskHotspots = this.getRiskHotspots(
      this.props.riskHotspots,
      this.state.assembly,
      this.state.numberOfHotspots,
      filter,
      this.state.sortby,
      this.state.sortorder
    );
    this.setState({ filter: filter, riskHotspots: riskHotspots });
  },
  getInitialState: function() {
    var state, i;

    if (
      window.history !== undefined &&
      window.history.replaceState !== undefined &&
      window.history.state !== null &&
      window.history.state.riskHotspotsHistoryState !== undefined
    ) {
      state = angular.copy(window.history.state.riskHotspotsHistoryState);

      // Delete from state
      state.riskHotspots = null;
      state.riskHotspotMetrics = this.props.riskHotspotMetrics;
      state.assemblies = [];
    } else {
      state = {
        riskHotspots: null,
        riskHotspotMetrics: this.props.riskHotspotMetrics,
        assemblies: [],
        assembly: '',
        sortby: '',
        sortorder: 'asc',
        numberOfHotspots: 10,
        filter: ''
      };
    }

    for (i = 0; i < this.props.riskHotspots.length; i++) {
      if (state.assemblies.indexOf(this.props.riskHotspots[i].assembly) === -1) {
        state.assemblies.push(this.props.riskHotspots[i].assembly);
      }
    }

    state.riskHotspots = this.getRiskHotspots(
      this.props.riskHotspots,
      state.assembly,
      state.numberOfHotspots,
      state.filter,
      state.sortby,
      state.sortorder
    );

    return state;
  },
  render: function() {
    if (window.history !== undefined && window.history.replaceState !== undefined) {
      var riskHotspotsHistoryState, globalState, i;
      riskHotspotsHistoryState = angular.copy(this.state);

      riskHotspotsHistoryState.riskHotspots = null;
      riskHotspotsHistoryState.riskHotspotMetrics = null;
      riskHotspotsHistoryState.assemblies = null;

      if (window.history.state !== null) {
        globalState = angular.copy(window.history.state);
      } else {
        globalState = {};
      }

      globalState.riskHotspotsHistoryState = riskHotspotsHistoryState;
      window.history.replaceState(globalState, null);
    }

    return React.DOM.div(
      null,
      RiskHotspotsSearchBar({
        totalNumberOfRiskHotspots: this.props.riskHotspots.length,
        assemblies: this.state.assemblies,
        assembly: this.state.assembly,
        numberOfHotspots: this.state.numberOfHotspots,
        filter: this.state.filter,
        updateAssembly: this.updateAssembly,
        updateNumberOfHotspots: this.updateNumberOfHotspots,
        updateFilter: this.updateFilter
      }),
      RiskHotspotsTable({
        riskHotspots: this.state.riskHotspots,
        riskHotspotMetrics: this.props.riskHotspotMetrics,
        sortby: this.state.sortby,
        sortorder: this.state.sortorder,
        updateSorting: this.updateSorting
      })
    );
  }
});

var RiskHotspotsSearchBar = React.createClass({
  assemblyChangedHandler: function() {
    this.props.updateAssembly(this.refs.assemblyInput.getDOMNode().value);
  },
  numberOfHotspotsChangedHandler: function() {
    this.props.updateNumberOfHotspots(this.refs.numberOfHotspotsInput.getDOMNode().value);
  },
  filterChangedHandler: function() {
    this.props.updateFilter(this.refs.filterInput.getDOMNode().value);
  },
  render: function() {
    var assemblyOptions = [React.DOM.option({ value: '' }, translations.assembly)],
      filterElements = [],
      numberOptions = [],
      i,
      l;

    if (this.props.assemblies.length > 1) {
      for (i = 0, l = this.props.assemblies.length; i < l; i++) {
        assemblyOptions.push(
          React.DOM.option({ value: this.props.assemblies[i] }, this.props.assemblies[i])
        );
      }

      filterElements.push(
        React.DOM.div(
          null,
          React.DOM.select(
            {
              ref: 'assemblyInput',
              value: this.props.assembly,
              onChange: this.assemblyChangedHandler
            },
            assemblyOptions
          )
        )
      );
    } else {
      filterElements.push(React.DOM.div(null));
    }

    if (this.props.totalNumberOfRiskHotspots > 10) {
      numberOptions.push(React.DOM.option({ value: 10 }, 10));
      numberOptions.push(React.DOM.option({ value: 20 }, 20));
    }

    if (this.props.totalNumberOfRiskHotspots > 20) {
      numberOptions.push(React.DOM.option({ value: 50 }, 50));
    }

    if (this.props.totalNumberOfRiskHotspots > 50) {
      numberOptions.push(React.DOM.option({ value: 100 }, 100));
    }

    if (this.props.totalNumberOfRiskHotspots > 100) {
      numberOptions.push(
        React.DOM.option({ value: this.props.totalNumberOfRiskHotspots }, translations.all)
      );
    }

    if (numberOptions.length > 0) {
      filterElements.push(
        React.DOM.div(
          { className: 'center' },
          React.DOM.span(null, translations.top + ' '),
          React.DOM.select(
            {
              ref: 'numberOfHotspotsInput',
              value: this.props.numberOfHotspots,
              onChange: this.numberOfHotspotsChangedHandler
            },
            numberOptions
          )
        )
      );
    }

    filterElements.push(
      React.DOM.div(
        { className: 'right' },
        React.DOM.span(null, translations.filter + ' '),
        React.DOM.input({
          ref: 'filterInput',
          type: 'text',
          value: this.props.filter,
          onChange: this.filterChangedHandler,
          onInput: this.filterChangedHandler /* Handle text input immediately */
        })
      )
    );

    return React.DOM.div({ className: 'customizebox' }, filterElements);
  }
});

var RiskHotspotsTable = React.createClass({
  render: function() {
    var cols = [React.DOM.col(null), React.DOM.col(null), React.DOM.col(null)],
      rows = [],
      i,
      l;

    for (i = 0, l = this.props.riskHotspotMetrics.length; i < l; i++) {
      cols.push(React.DOM.col({ className: 'column105' }));
    }

    for (i = 0, l = this.props.riskHotspots.length; i < l; i++) {
      rows.push(
        RiskHotspotRow({
          riskHotspot: this.props.riskHotspots[i]
        })
      );
    }

    return React.DOM.table(
      { className: 'overview table-fixed stripped' },
      React.DOM.colgroup(null, cols),
      RiskHotspotsTableHeader({
        sortby: this.props.sortby,
        sortorder: this.props.sortorder,
        updateSorting: this.props.updateSorting,
        riskHotspotMetrics: this.props.riskHotspotMetrics
      }),
      React.DOM.tbody(null, rows)
    );
  }
});
var RiskHotspotsTableHeader = React.createClass({
  sortingChangedHandler: function(event, sortby) {
    // Click on explanation url should not trigger resorting
    if (sortby !== null) {
      event.nativeEvent.preventDefault();
      this.props.updateSorting(sortby);
    }
  },
  render: function() {
    var ths, i, l, metricClass;

    var assemblyClass =
      this.props.sortby === 'assembly'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var classClass =
      this.props.sortby === 'class'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var methodClass =
      this.props.sortby === 'method'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';

    ths = [
      React.DOM.th(
        null,
        React.DOM.a(
          {
            href: '',
            onClick: function(event) {
              this.sortingChangedHandler(event, 'assembly');
            }.bind(this)
          },
          React.DOM.i({ className: assemblyClass }),
          translations.assembly
        )
      ),
      React.DOM.th(
        null,
        React.DOM.a(
          {
            href: '',
            onClick: function(event) {
              this.sortingChangedHandler(event, 'class');
            }.bind(this)
          },
          React.DOM.i({ className: classClass }),
          translations.class
        )
      ),
      React.DOM.th(
        null,
        React.DOM.a(
          {
            href: '',
            onClick: function(event) {
              this.sortingChangedHandler(event, 'method');
            }.bind(this)
          },
          React.DOM.i({ className: methodClass }),
          translations.method
        )
      )
    ];

    for (i = 0, l = this.props.riskHotspotMetrics.length; i < l; i++) {
      metricClass =
        this.props.sortby !== '' && this.props.sortby == i
          ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
          : 'icon-down-dir';
      ths.push(
        React.DOM.th(
          null,
          React.DOM.a(
            {
              href: '',
              'data-metric': i,
              onClick: function(event) {
                this.sortingChangedHandler(
                  event,
                  $(event.nativeEvent.target)
                    .closest('a')[0]
                    .getAttribute('data-metric')
                );
              }.bind(this)
            },
            React.DOM.i({ className: metricClass }),
            this.props.riskHotspotMetrics[i].name + ' ',
            React.DOM.a(
              { href: this.props.riskHotspotMetrics[i].explanationUrl },
              React.DOM.i({ className: 'icon-info-circled' })
            )
          )
        )
      );
    }

    return React.DOM.thead(null, React.DOM.tr(null, ths));
  }
});

var RiskHotspotRow = React.createClass({
  render: function() {
    var tds, nameElement, methodElement;

    if (this.props.riskHotspot.reportPath === '') {
      nameElement = React.DOM.span(null, this.props.riskHotspot.class);
      methodElement = this.props.riskHotspot.methodShortName;
    } else {
      nameElement = React.DOM.a(
        { href: this.props.riskHotspot.reportPath },
        this.props.riskHotspot.class
      );

      if (this.props.riskHotspot.line !== null) {
        methodElement = React.DOM.a(
          {
            href:
              this.props.riskHotspot.reportPath +
              '#file' +
              this.props.riskHotspot.fileIndex +
              '_line' +
              this.props.riskHotspot.line
          },
          this.props.riskHotspot.methodShortName
        );
      } else {
        methodElement = this.props.riskHotspot.methodShortName;
      }
    }

    tds = [
      React.DOM.td(null, this.props.riskHotspot.assembly),
      React.DOM.td(null, nameElement),
      React.DOM.td({ title: this.props.riskHotspot.methodName }, methodElement)
    ];

    for (i = 0, l = this.props.riskHotspot.metrics.length; i < l; i++) {
      tds.push(
        React.DOM.td(
          {
            className: this.props.riskHotspot.metrics[i].exceeded
              ? 'lightred right'
              : 'lightgreen right'
          },
          this.props.riskHotspot.metrics[i].value === null
            ? '-'
            : this.props.riskHotspot.metrics[i].value
        )
      );
    }

    return React.DOM.tr(null, tds);
  }
});

/* Helper methods */
function createRandomId(length) {
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    id = '',
    i;

  for (i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return id;
}

function roundNumber(number, precision) {
  return Math.floor(number * Math.pow(10, precision)) / Math.pow(10, precision);
}

function getNthOrLastIndexOf(text, substring, n) {
  var times = 0,
    index = -1,
    currentIndex = -1;

  while (times < n) {
    currentIndex = text.indexOf(substring, index + 1);
    if (currentIndex === -1) {
      break;
    } else {
      index = currentIndex;
    }

    times++;
  }

  return index;
}

/* Data models */
function ClassViewModel(serializedClass) {
  var self = this;
  self.isNamespace = false;
  self.name = serializedClass.name;
  self.parent = null;
  self.reportPath = serializedClass.reportPath;
  self.coveredLines = serializedClass.coveredLines;
  self.uncoveredLines = serializedClass.uncoveredLines;
  self.coverableLines = serializedClass.coverableLines;
  self.totalLines = serializedClass.totalLines;
  self.coverageType = serializedClass.coverageType;
  (self.coveredBranches = serializedClass.coveredBranches),
    (self.totalBranches = serializedClass.totalBranches);
  self.lineCoverageHistory = serializedClass.lineCoverageHistory;
  self.branchCoverageHistory = serializedClass.branchCoverageHistory;

  if (serializedClass.coverableLines === 0) {
    if (isNaN(serializedClass.methodCoverage)) {
      self.coverage = NaN;
      self.coveragePercent = '';
      self.coverageTitle = '';
    } else {
      self.coverage = serializedClass.methodCoverage;
      self.coveragePercent = self.coverage + '%';
      self.coverageTitle = serializedClass.coverageType;
    }
  } else {
    self.coverage = roundNumber(
      100 * serializedClass.coveredLines / serializedClass.coverableLines,
      1
    );
    self.coveragePercent = self.coverage + '%';
    self.coverageTitle = serializedClass.coverageType;
  }

  if (serializedClass.totalBranches === 0) {
    self.branchCoverage = NaN;
    self.branchCoveragePercent = '';
  } else {
    self.branchCoverage = roundNumber(
      100 * serializedClass.coveredBranches / serializedClass.totalBranches,
      1
    );
    self.branchCoveragePercent = self.branchCoverage + '%';
  }

  self.visible = function(filter) {
    return filter === '' || self.name.toLowerCase().indexOf(filter) > -1;
  };
}

function CodeElementViewModel(name, parent) {
  var self = this;
  self.isNamespace = true;
  self.name = name;
  self.parent = parent;
  self.subelements = [];
  self.coverageType = translations.lineCoverage;
  self.collapsed = name.indexOf('Test') > -1 && parent === null;

  self.coveredLines = 0;
  self.uncoveredLines = 0;
  self.coverableLines = 0;
  self.totalLines = 0;

  self.coveredBranches = 0;
  self.totalBranches = 0;

  self.coverage = function() {
    if (self.coverableLines === 0) {
      return NaN;
    }

    return roundNumber(100 * self.coveredLines / self.coverableLines, 1);
  };

  self.branchCoverage = function() {
    if (self.totalBranches === 0) {
      return NaN;
    }

    return roundNumber(100 * self.coveredBranches / self.totalBranches, 1);
  };

  self.visible = function(filter) {
    var i, l;
    for (i = 0, l = self.subelements.length; i < l; i++) {
      if (self.subelements[i].visible(filter)) {
        return true;
      }
    }

    return filter === '' || self.name.toLowerCase().indexOf(self.filter) > -1;
  };

  self.insertClass = function(clazz, grouping) {
    var groupingDotIndex, groupedNamespace, i, l, subNamespace;

    self.coveredLines += clazz.coveredLines;
    self.uncoveredLines += clazz.uncoveredLines;
    self.coverableLines += clazz.coverableLines;
    self.totalLines += clazz.totalLines;

    self.coveredBranches += clazz.coveredBranches;
    self.totalBranches += clazz.totalBranches;

    if (grouping === undefined) {
      clazz.parent = self;
      self.subelements.push(clazz);
      return;
    }

    groupingDotIndex = getNthOrLastIndexOf(clazz.name, '.', grouping);
    groupedNamespace = groupingDotIndex === -1 ? '-' : clazz.name.substr(0, groupingDotIndex);

    for (i = 0, l = self.subelements.length; i < l; i++) {
      if (self.subelements[i].name === groupedNamespace) {
        self.subelements[i].insertClass(clazz);
        return;
      }
    }

    subNamespace = new CodeElementViewModel(groupedNamespace, self);
    self.subelements.push(subNamespace);
    subNamespace.insertClass(clazz);
  };

  self.collapse = function() {
    var i, l, element;

    self.collapsed = true;

    for (i = 0, l = self.subelements.length; i < l; i++) {
      element = self.subelements[i];

      if (element.isNamespace) {
        element.collapse();
      }
    }
  };

  self.expand = function() {
    var i, l, element;

    self.collapsed = false;

    for (i = 0, l = self.subelements.length; i < l; i++) {
      element = self.subelements[i];

      if (element.isNamespace) {
        element.expand();
      }
    }
  };

  self.toggleCollapse = function() {
    self.collapsed = !self.collapsed;
  };

  self.changeSorting = function(sortby, ascending) {
    var smaller = ascending ? -1 : 1,
      bigger = ascending ? 1 : -1,
      i,
      l,
      element;

    if (sortby === 'name') {
      self.subelements.sort(function(left, right) {
        return left.name === right.name ? 0 : left.name < right.name ? smaller : bigger;
      });
    } else {
      if (self.subelements.length > 0 && self.subelements[0].isNamespace) {
        // Top level elements are resorted ASC by name if other sort columns than 'name' is selected
        self.subelements.sort(function(left, right) {
          return left.name === right.name ? 0 : left.name < right.name ? -1 : 1;
        });
      } else {
        if (sortby === 'covered') {
          self.subelements.sort(function(left, right) {
            return left.coveredLines === right.coveredLines
              ? 0
              : left.coveredLines < right.coveredLines ? smaller : bigger;
          });
        } else if (sortby === 'uncovered') {
          self.subelements.sort(function(left, right) {
            return left.uncoveredLines === right.uncoveredLines
              ? 0
              : left.uncoveredLines < right.uncoveredLines ? smaller : bigger;
          });
        } else if (sortby === 'coverable') {
          self.subelements.sort(function(left, right) {
            return left.coverableLines === right.coverableLines
              ? 0
              : left.coverableLines < right.coverableLines ? smaller : bigger;
          });
        } else if (sortby === 'total') {
          self.subelements.sort(function(left, right) {
            return left.totalLines === right.totalLines
              ? 0
              : left.totalLines < right.totalLines ? smaller : bigger;
          });
        } else if (sortby === 'coverage') {
          self.subelements.sort(function(left, right) {
            if (left.coverage === right.coverage) {
              return 0;
            } else if (isNaN(left.coverage)) {
              return smaller;
            } else if (isNaN(right.coverage)) {
              return bigger;
            } else {
              return left.coverage < right.coverage ? smaller : bigger;
            }
          });
        } else if (sortby === 'branchcoverage') {
          self.subelements.sort(function(left, right) {
            if (left.branchCoverage === right.branchCoverage) {
              return 0;
            } else if (isNaN(left.branchCoverage)) {
              return smaller;
            } else if (isNaN(right.branchCoverage)) {
              return bigger;
            } else {
              return left.branchCoverage < right.branchCoverage ? smaller : bigger;
            }
          });
        }
      }
    }

    for (i = 0, l = self.subelements.length; i < l; i++) {
      element = self.subelements[i];

      if (element.isNamespace) {
        element.changeSorting(sortby, ascending);
      }
    }
  };
}

/* React components */
var AssemblyComponent = React.createClass({
  getAssemblies: function(assemblies, grouping, sortby, sortorder) {
    var i, l, j, l2, assemblyElement, parentElement, cls, smaller, bigger, result;

    result = [];

    if (grouping === '0') {
      // Group by assembly
      for (i = 0, l = assemblies.length; i < l; i++) {
        assemblyElement = new CodeElementViewModel(assemblies[i].name, null);
        result.push(assemblyElement);

        for (j = 0, l2 = assemblies[i].classes.length; j < l2; j++) {
          cls = assemblies[i].classes[j];
          assemblyElement.insertClass(new ClassViewModel(cls));
        }
      }
    } else if (grouping === '-1') {
      // No grouping
      parentElement = new CodeElementViewModel(translations.all, null);
      result.push(parentElement);

      for (i = 0, l = assemblies.length; i < l; i++) {
        for (j = 0, l2 = assemblies[i].classes.length; j < l2; j++) {
          cls = assemblies[i].classes[j];
          parentElement.insertClass(new ClassViewModel(cls));
        }
      }
    } else {
      // Group by assembly and namespace
      for (i = 0, l = assemblies.length; i < l; i++) {
        assemblyElement = new CodeElementViewModel(assemblies[i].name, null);
        result.push(assemblyElement);

        for (j = 0, l2 = assemblies[i].classes.length; j < l2; j++) {
          cls = assemblies[i].classes[j];
          assemblyElement.insertClass(new ClassViewModel(cls), grouping);
        }
      }
    }

    if (sortby === 'name') {
      smaller = sortorder === 'asc' ? -1 : 1;
      bigger = sortorder === 'asc' ? 1 : -1;
    } else {
      smaller = -1;
      bigger = 1;
    }

    result.sort(function(left, right) {
      return left.name === right.name ? 0 : left.name < right.name ? smaller : bigger;
    });

    for (i = 0, l = result.length; i < l; i++) {
      result[i].changeSorting(sortby, sortorder === 'asc');
    }

    return result;
  },
  getGroupingMaximum: function(assemblies) {
    var i, l, j, l2, result;

    result = 1;

    for (i = 0, l = assemblies.length; i < l; i++) {
      for (j = 0, l2 = assemblies[i].classes.length; j < l2; j++) {
        result = Math.max(result, (assemblies[i].classes[j].name.match(/\./g) || []).length);
      }
    }

    console.log('Grouping maximum: ' + result);

    return result;
  },
  getInitialState: function() {
    var state, collapseState;

    if (
      window.history !== undefined &&
      window.history.replaceState !== undefined &&
      window.history.state !== null &&
      window.history.state.coverageTableHistoryState !== undefined
    ) {
      state = angular.copy(window.history.state.coverageTableHistoryState);
      collapseState = state.assemblies;
    } else {
      state = {
        grouping: '0',
        groupingMaximum: this.getGroupingMaximum(this.props.assemblies),
        filter: '',
        sortby: 'name',
        sortorder: 'asc',
        assemblies: null,
        branchCoverageAvailable: this.props.branchCoverageAvailable
      };
    }

    state.assemblies = this.getAssemblies(
      this.props.assemblies,
      state.grouping,
      state.sortby,
      state.sortorder
    );

    if (collapseState !== undefined) {
      this.restoreCollapseState(collapseState, state.assemblies);
    }

    return state;
  },
  collapseAll: function() {
    console.log('Collapsing all');
    var i, l;
    for (i = 0, l = this.state.assemblies.length; i < l; i++) {
      this.state.assemblies[i].collapse();
    }

    this.setState({ assemblies: this.state.assemblies });
  },
  expandAll: function() {
    console.log('Expanding all');

    var i, l;
    for (i = 0, l = this.state.assemblies.length; i < l; i++) {
      this.state.assemblies[i].expand();
    }

    this.setState({ assemblies: this.state.assemblies });
  },
  toggleCollapse: function(assembly) {
    assembly.toggleCollapse();
    this.setState({ assemblies: this.state.assemblies });
  },
  updateGrouping: function(grouping) {
    console.log('Updating grouping: ' + grouping);

    var assemblies = this.getAssemblies(
      this.props.assemblies,
      grouping,
      this.state.sortby,
      this.state.sortorder
    );
    this.setState({ grouping: grouping, assemblies: assemblies });
  },
  updateFilter: function(filter) {
    filter = filter.toLowerCase();

    if (filter === this.state.filter) {
      return;
    }

    console.log('Updating filter: ' + filter);
    this.setState({ filter: filter });
  },
  updateSorting: function(sortby) {
    var sortorder = 'asc',
      assemblies;

    if (sortby === this.state.sortby) {
      sortorder = this.state.sortorder === 'asc' ? 'desc' : 'asc';
    }

    console.log('Updating sorting: ' + sortby + ', ' + sortorder);
    assemblies = this.getAssemblies(this.props.assemblies, this.state.grouping, sortby, sortorder);
    this.setState({ sortby: sortby, sortorder: sortorder, assemblies: assemblies });
  },
  restoreCollapseState: function(source, target) {
    var i;

    try {
      for (i = 0; i < target.length; i++) {
        if (target[i].isNamespace) {
          target[i].collapsed = source[i].collapsed;
          this.restoreCollapseState(source[i].subelements, target[i].subelements);
        }
      }
    } catch (e) {
      // This can only happen if assembly structure was changed.
      // That means the complete report was updated in the background and the reloaded in the same tab/window.
      console.log('Restoring of collapse state failed.');
    }
  },
  extractCollapseState: function(target) {
    var i,
      currentResult,
      result = [];

    for (i = 0; i < target.length; i++) {
      if (target[i].isNamespace) {
        currentResult = {
          collapsed: target[i].collapsed,
          subelements: this.extractCollapseState(target[i].subelements)
        };
        result.push(currentResult);
      }
    }

    return result;
  },
  render: function() {
    if (window.history !== undefined && window.history.replaceState !== undefined) {
      var coverageTableHistoryState, globalState, i;
      coverageTableHistoryState = angular.copy(this.state);

      coverageTableHistoryState.assemblies = this.extractCollapseState(
        coverageTableHistoryState.assemblies
      );

      if (window.history.state !== null) {
        globalState = angular.copy(window.history.state);
      } else {
        globalState = {};
      }

      globalState.coverageTableHistoryState = coverageTableHistoryState;
      window.history.replaceState(globalState, null);
    }

    return React.DOM.div(
      null,
      SearchBar({
        groupingMaximum: this.state.groupingMaximum,
        grouping: this.state.grouping,
        filter: this.state.filter,
        collapseAll: this.collapseAll,
        expandAll: this.expandAll,
        updateGrouping: this.updateGrouping,
        updateFilter: this.updateFilter
      }),
      AssemblyTable({
        filter: this.state.filter,
        assemblies: this.state.assemblies,
        sortby: this.state.sortby,
        sortorder: this.state.sortorder,
        branchCoverageAvailable: this.state.branchCoverageAvailable,
        updateSorting: this.updateSorting,
        toggleCollapse: this.toggleCollapse
      })
    );
  }
});

var SearchBar = React.createClass({
  collapseAllClickHandler: function(event) {
    event.nativeEvent.preventDefault();
    this.props.collapseAll();
  },
  expandAllClickHandler: function(event) {
    event.nativeEvent.preventDefault();
    this.props.expandAll();
  },
  groupingChangedHandler: function() {
    this.props.updateGrouping(this.refs.groupingInput.getDOMNode().value);
  },
  filterChangedHandler: function() {
    this.props.updateFilter(this.refs.filterInput.getDOMNode().value);
  },
  render: function() {
    var groupingDescription = translations.byNamespace + ' ' + this.props.grouping;

    if (this.props.grouping === '-1') {
      groupingDescription = translations.noGrouping;
    } else if (this.props.grouping === '0') {
      groupingDescription = translations.byAssembly;
    }

    return React.DOM.div(
      { className: 'customizebox' },
      React.DOM.div(
        null,
        React.DOM.a({ href: '', onClick: this.collapseAllClickHandler }, translations.collapseAll),
        React.DOM.span(null, ' | '),
        React.DOM.a({ href: '', onClick: this.expandAllClickHandler }, translations.expandAll)
      ),
      React.DOM.div(
        { className: 'center' },
        React.DOM.span(null, groupingDescription),
        React.DOM.br(),
        React.DOM.span(null, translations.grouping + ' '),
        React.DOM.input({
          ref: 'groupingInput',
          type: 'range',
          step: 1,
          min: -1,
          max: this.props.groupingMaximum,
          value: this.props.grouping,
          onChange: this.groupingChangedHandler
        })
      ),
      React.DOM.div(
        { className: 'right' },
        React.DOM.span(null, translations.filter + ' '),
        React.DOM.input({
          ref: 'filterInput',
          type: 'text',
          value: this.props.filter,
          onChange: this.filterChangedHandler,
          onInput: this.filterChangedHandler /* Handle text input immediately */
        })
      )
    );
  }
});

var AssemblyTable = React.createClass({
  renderAllChilds: function(result, currentElement) {
    var i, l;

    if (currentElement.visible(this.props.filter)) {
      if (currentElement.isNamespace) {
        result.push(
          AssemblyRow({
            assembly: currentElement,
            branchCoverageAvailable: this.props.branchCoverageAvailable,
            toggleCollapse: this.props.toggleCollapse
          })
        );

        if (!currentElement.collapsed) {
          for (i = 0, l = currentElement.subelements.length; i < l; i++) {
            this.renderAllChilds(result, currentElement.subelements[i]);
          }
        }
      } else {
        result.push(
          ClassRow({
            clazz: currentElement,
            branchCoverageAvailable: this.props.branchCoverageAvailable
          })
        );
      }
    }
  },
  render: function() {
    var rows = [],
      i,
      l;

    for (i = 0, l = this.props.assemblies.length; i < l; i++) {
      this.renderAllChilds(rows, this.props.assemblies[i]);
    }

    return React.DOM.table(
      { className: 'overview table-fixed stripped' },
      React.DOM.colgroup(
        null,
        React.DOM.col(null),
        React.DOM.col({ className: 'column90' }),
        React.DOM.col({ className: 'column105' }),
        React.DOM.col({ className: 'column100' }),
        React.DOM.col({ className: 'column70' }),
        React.DOM.col({ className: 'column98' }),
        React.DOM.col({ className: 'column112' }),
        this.props.branchCoverageAvailable ? React.DOM.col({ className: 'column98' }) : null,
        this.props.branchCoverageAvailable ? React.DOM.col({ className: 'column112' }) : null
      ),
      TableHeader({
        sortby: this.props.sortby,
        sortorder: this.props.sortorder,
        updateSorting: this.props.updateSorting,
        branchCoverageAvailable: this.props.branchCoverageAvailable
      }),
      React.DOM.tbody(null, rows)
    );
  }
});

var TableHeader = React.createClass({
  sortingChangedHandler: function(event, sortby) {
    event.nativeEvent.preventDefault();
    this.props.updateSorting(sortby);
  },
  render: function() {
    var nameClass =
      this.props.sortby === 'name'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var coveredClass =
      this.props.sortby === 'covered'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var uncoveredClass =
      this.props.sortby === 'uncovered'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var coverableClass =
      this.props.sortby === 'coverable'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var totalClass =
      this.props.sortby === 'total'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var coverageClass =
      this.props.sortby === 'coverage'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';
    var branchCoverageClass =
      this.props.sortby === 'branchcoverage'
        ? this.props.sortorder === 'desc' ? 'icon-up-dir_active' : 'icon-down-dir_active'
        : 'icon-down-dir';

    return React.DOM.thead(
      null,
      React.DOM.tr(
        null,
        React.DOM.th(
          null,
          React.DOM.a(
            {
              href: '',
              onClick: function(event) {
                this.sortingChangedHandler(event, 'name');
              }.bind(this)
            },
            React.DOM.i({ className: nameClass }),
            translations.name
          )
        ),
        React.DOM.th(
          { className: 'right' },
          React.DOM.a(
            {
              href: '',
              onClick: function(event) {
                this.sortingChangedHandler(event, 'covered');
              }.bind(this)
            },
            React.DOM.i({ className: coveredClass }),
            translations.covered
          )
        ),
        React.DOM.th(
          { className: 'right' },
          React.DOM.a(
            {
              href: '',
              onClick: function(event) {
                this.sortingChangedHandler(event, 'uncovered');
              }.bind(this)
            },
            React.DOM.i({ className: uncoveredClass }),
            translations.uncovered
          )
        ),
        React.DOM.th(
          { className: 'right' },
          React.DOM.a(
            {
              href: '',
              onClick: function(event) {
                this.sortingChangedHandler(event, 'coverable');
              }.bind(this)
            },
            React.DOM.i({ className: coverableClass }),
            translations.coverable
          )
        ),
        React.DOM.th(
          { className: 'right' },
          React.DOM.a(
            {
              href: '',
              onClick: function(event) {
                this.sortingChangedHandler(event, 'total');
              }.bind(this)
            },
            React.DOM.i({ className: totalClass }),
            translations.total
          )
        ),
        React.DOM.th(
          { className: 'center', colSpan: '2' },
          React.DOM.a(
            {
              href: '',
              onClick: function(event) {
                this.sortingChangedHandler(event, 'coverage');
              }.bind(this)
            },
            React.DOM.i({ className: coverageClass }),
            translations.coverage
          )
        ),
        this.props.branchCoverageAvailable
          ? React.DOM.th(
              { className: 'center', colSpan: '2' },
              React.DOM.a(
                {
                  href: '',
                  onClick: function(event) {
                    this.sortingChangedHandler(event, 'branchcoverage');
                  }.bind(this)
                },
                React.DOM.i({ className: branchCoverageClass }),
                translations.branchCoverage
              )
            )
          : null
      )
    );
  }
});

var AssemblyRow = React.createClass({
  toggleCollapseClickHandler: function(event) {
    event.nativeEvent.preventDefault();
    this.props.toggleCollapse(this.props.assembly);
  },
  render: function() {
    var greenHidden,
      redHidden,
      grayHidden,
      coverageTable,
      branchGreenHidden,
      branchRedHidden,
      branchGrayHidden,
      branchCoverageTable,
      id;

    greenHidden =
      !isNaN(this.props.assembly.coverage()) && Math.round(this.props.assembly.coverage()) > 0
        ? ''
        : ' hidden';
    redHidden =
      !isNaN(this.props.assembly.coverage()) && 100 - Math.round(this.props.assembly.coverage()) > 0
        ? ''
        : ' hidden';
    grayHidden = isNaN(this.props.assembly.coverage()) ? '' : ' hidden';

    coverageTable = React.DOM.table(
      { className: 'coverage' },
      React.DOM.tbody(
        null,
        React.DOM.tr(
          null,
          React.DOM.td(
            {
              className: 'green covered' + Math.round(this.props.assembly.coverage()) + greenHidden
            },
            ' '
          ),
          React.DOM.td(
            {
              className:
                'red covered' + (100 - Math.round(this.props.assembly.coverage())) + redHidden
            },
            ' '
          ),
          React.DOM.td({ className: 'gray covered100' + grayHidden }, ' ')
        )
      )
    );

    branchGreenHidden =
      !isNaN(this.props.assembly.coverage()) && Math.round(this.props.assembly.branchCoverage()) > 0
        ? ''
        : ' hidden';
    branchRedHidden =
      !isNaN(this.props.assembly.coverage()) &&
      100 - Math.round(this.props.assembly.branchCoverage()) > 0
        ? ''
        : ' hidden';
    branchGrayHidden = isNaN(this.props.assembly.branchCoverage()) ? '' : ' hidden';

    branchCoverageTable = React.DOM.table(
      { className: 'coverage' },
      React.DOM.tbody(
        null,
        React.DOM.tr(
          null,
          React.DOM.td(
            {
              className:
                'green covered' +
                Math.round(this.props.assembly.branchCoverage()) +
                branchGreenHidden
            },
            ' '
          ),
          React.DOM.td(
            {
              className:
                'red covered' +
                (100 - Math.round(this.props.assembly.branchCoverage())) +
                branchRedHidden
            },
            ' '
          ),
          React.DOM.td({ className: 'gray covered100' + branchGrayHidden }, ' ')
        )
      )
    );

    id = '_' + createRandomId(8);

    return React.DOM.tr(
      { className: this.props.assembly.parent !== null ? 'namespace' : null },
      React.DOM.th(
        null,
        React.DOM.a(
          {
            id: this.props.assembly.name + id,
            href: '',
            onClick: this.toggleCollapseClickHandler
          },
          React.DOM.i({ className: this.props.assembly.collapsed ? 'icon-plus' : 'icon-minus' }),
          this.props.assembly.name
        )
      ),
      React.DOM.th({ className: 'right' }, this.props.assembly.coveredLines),
      React.DOM.th({ className: 'right' }, this.props.assembly.uncoveredLines),
      React.DOM.th({ className: 'right' }, this.props.assembly.coverableLines),
      React.DOM.th({ className: 'right' }, this.props.assembly.totalLines),
      React.DOM.th(
        {
          className: 'right',
          title: isNaN(this.props.assembly.coverage()) ? '' : this.props.assembly.coverageType
        },
        isNaN(this.props.assembly.coverage()) ? '' : this.props.assembly.coverage() + '%'
      ),
      React.DOM.th(null, coverageTable),
      this.props.branchCoverageAvailable
        ? React.DOM.th(
            {
              className: 'right'
            },
            isNaN(this.props.assembly.branchCoverage())
              ? ''
              : this.props.assembly.branchCoverage() + '%'
          )
        : null,
      this.props.branchCoverageAvailable ? React.DOM.th(null, branchCoverageTable) : null
    );
  }
});

var ClassRow = React.createClass({
  render: function() {
    var nameElement,
      greenHidden,
      redHidden,
      grayHidden,
      coverageTable,
      branchGreenHidden,
      branchRedHidden,
      branchGrayHidden,
      branchCoverageTable;

    if (this.props.clazz.reportPath === '') {
      nameElement = React.DOM.span(null, this.props.clazz.name);
    } else {
      nameElement = React.DOM.a({ href: this.props.clazz.reportPath }, this.props.clazz.name);
    }

    greenHidden =
      !isNaN(this.props.clazz.coverage) && Math.round(this.props.clazz.coverage) > 0
        ? ''
        : ' hidden';
    redHidden =
      !isNaN(this.props.clazz.coverage) && 100 - Math.round(this.props.clazz.coverage) > 0
        ? ''
        : ' hidden';
    grayHidden = isNaN(this.props.clazz.coverage) ? '' : ' hidden';

    coverageTable = React.DOM.table(
      { className: 'coverage' },
      React.DOM.tbody(
        null,
        React.DOM.tr(
          null,
          React.DOM.td(
            { className: 'green covered' + Math.round(this.props.clazz.coverage) + greenHidden },
            ' '
          ),
          React.DOM.td(
            {
              className: 'red covered' + (100 - Math.round(this.props.clazz.coverage)) + redHidden
            },
            ' '
          ),
          React.DOM.td({ className: 'gray covered100' + grayHidden }, ' ')
        )
      )
    );

    branchGreenHidden =
      !isNaN(this.props.clazz.branchCoverage) && Math.round(this.props.clazz.branchCoverage) > 0
        ? ''
        : ' hidden';
    branchRedHidden =
      !isNaN(this.props.clazz.branchCoverage) &&
      100 - Math.round(this.props.clazz.branchCoverage) > 0
        ? ''
        : ' hidden';
    branchGrayHidden = isNaN(this.props.clazz.branchCoverage) ? '' : ' hidden';

    branchCoverageTable = React.DOM.table(
      { className: 'coverage' },
      React.DOM.tbody(
        null,
        React.DOM.tr(
          null,
          React.DOM.td(
            {
              className:
                'green covered' + Math.round(this.props.clazz.branchCoverage) + branchGreenHidden
            },
            ' '
          ),
          React.DOM.td(
            {
              className:
                'red covered' +
                (100 - Math.round(this.props.clazz.branchCoverage)) +
                branchRedHidden
            },
            ' '
          ),
          React.DOM.td({ className: 'gray covered100' + branchGrayHidden }, ' ')
        )
      )
    );

    return React.DOM.tr(
      { className: this.props.clazz.parent.parent !== null ? 'namespace' : null },
      React.DOM.td(null, nameElement),
      React.DOM.td({ className: 'right' }, this.props.clazz.coveredLines),
      React.DOM.td({ className: 'right' }, this.props.clazz.uncoveredLines),
      React.DOM.td({ className: 'right' }, this.props.clazz.coverableLines),
      React.DOM.td({ className: 'right' }, this.props.clazz.totalLines),
      React.DOM.td(
        { className: 'right', title: this.props.clazz.coverageTitle },
        CoverageHistoryChart({
          historicCoverage: this.props.clazz.lineCoverageHistory,
          cssClass: 'tinylinecoveragechart',
          title: translations.history + ': ' + translations.coverage,
          id: 'chart' + createRandomId(8)
        }),
        this.props.clazz.coveragePercent
      ),
      React.DOM.td(null, coverageTable),
      this.props.branchCoverageAvailable
        ? React.DOM.td(
            { className: 'right' },
            CoverageHistoryChart({
              historicCoverage: this.props.clazz.branchCoverageHistory,
              cssClass: 'tinybranchcoveragechart',
              title: translations.history + ': ' + translations.branchCoverage,
              id: 'chart' + createRandomId(8)
            }),
            this.props.clazz.branchCoveragePercent
          )
        : null,
      this.props.branchCoverageAvailable ? React.DOM.td(null, branchCoverageTable) : null
    );
  }
});

var CoverageHistoryChart = React.createClass({
  updateChart: function() {
    if (this.props.historicCoverage.length <= 1) {
      return;
    }

    new Chartist.Line(
      '#' + this.props.id,
      {
        labels: [],
        series: [this.props.historicCoverage]
      },
      {
        axisX: {
          offset: 0,
          showLabel: false,
          showGrid: false
        },
        axisY: {
          offset: 0,
          showLabel: false,
          showGrid: false,
          scaleMinSpace: 0.1
        },
        showPoint: false,
        chartPadding: 0,
        lineSmooth: false,
        low: 0,
        high: 100,
        fullWidth: true
      }
    );
  },
  componentDidMount: function() {
    this.updateChart();
  },
  componentDidUpdate: function() {
    this.updateChart();
  },
  render: function() {
    if (this.props.historicCoverage.length <= 1) {
      return React.DOM.div({
        id: this.props.id,
        className: 'hidden'
      });
    } else {
      return React.DOM.div({
        id: this.props.id,
        className: this.props.cssClass + ' ct-chart',
        title: this.props.title
      });
    }
  }
});

/* Angular controller for summary report */
function SummaryViewCtrl($scope, $window) {
  var self = this;

  $scope.coverageTableFilteringEnabled = false;
  $scope.assemblies = [];
  $scope.branchCoverageAvailable = branchCoverageAvailable;

  $scope.riskHotspots = riskHotspots;
  $scope.riskHotspotMetrics = riskHotspotMetrics;

  $scope.enableCoverageTableFiltering = function() {
    console.log('Enabling filtering');

    $scope.assemblies = assemblies;
    $scope.coverageTableFilteringEnabled = true;
  };

  self.initialize = function() {
    var i, l, numberOfClasses;

    // State is persisted in history. If API or history not available in browser reenable
    if (
      $window.history === undefined ||
      $window.history.replaceState === undefined ||
      $window.history.state === null
    ) {
      numberOfClasses = 0;

      for (i = 0, l = assemblies.length; i < l; i++) {
        numberOfClasses += assemblies[i].classes.length;
        if (numberOfClasses > 1500) {
          console.log('Number of classes (filtering disabled): ' + numberOfClasses);
          return;
        }
      }

      console.log('Number of classes (filtering enabled): ' + numberOfClasses);
    }

    $scope.enableCoverageTableFiltering();
  };

  self.initialize();
}

/* Angular controller for class reports */
function DetailViewCtrl($scope, $window) {
  var self = this;

  $scope.selectedTestMethod = 'AllTestMethods';

  $scope.switchTestMethod = function(method) {
    console.log('Selected test method: ' + method);
    var lines, i, l, coverageData, lineAnalysis, cells;

    lines = document.querySelectorAll('.lineAnalysis tr');

    for (i = 1, l = lines.length; i < l; i++) {
      coverageData = JSON.parse(lines[i].getAttribute('data-coverage').replace(/'/g, '"'));
      lineAnalysis = coverageData[method];
      cells = lines[i].querySelectorAll('td');
      if (lineAnalysis === null) {
        lineAnalysis = coverageData.AllTestMethods;
        if (lineAnalysis.LVS !== 'gray') {
          cells[0].setAttribute('class', 'red');
          cells[1].innerText = cells[1].textContent = '0';
          cells[4].setAttribute('class', 'lightred');
        }
      } else {
        cells[0].setAttribute('class', lineAnalysis.LVS);
        cells[1].innerText = cells[1].textContent = lineAnalysis.VC;
        cells[4].setAttribute('class', 'light' + lineAnalysis.LVS);
      }
    }
  };

  $scope.navigateToHash = function(hash) {
    // Prevent history entries when selecting methods/properties
    if ($window.history !== undefined && $window.history.replaceState !== undefined) {
      $window.history.replaceState(undefined, undefined, hash);
    }
  };
}

/* Angular application */
var coverageApp = angular.module('coverageApp', []);
coverageApp.controller('SummaryViewCtrl', SummaryViewCtrl);
coverageApp.controller('DetailViewCtrl', DetailViewCtrl);

coverageApp.directive('reactiveRiskHotspotTable', function() {
  return {
    restrict: 'A',
    scope: {
      riskHotspots: '=',
      riskHotspotMetrics: '='
    },
    link: function(scope, el, attrs) {
      scope.$watchCollection('riskHotspots', function(newValue, oldValue) {
        React.renderComponent(
          RiskHotspotsComponent({
            riskHotspots: newValue,
            riskHotspotMetrics: scope.riskHotspotMetrics
          }),
          el[0]
        );
      });
    }
  };
});

coverageApp.directive('reactiveCoverageTable', function() {
  return {
    restrict: 'A',
    scope: {
      assemblies: '=',
      branchCoverageAvailable: '='
    },
    link: function(scope, el, attrs) {
      scope.$watchCollection('assemblies', function(newValue, oldValue) {
        React.renderComponent(
          AssemblyComponent({
            assemblies: newValue,
            branchCoverageAvailable: scope.branchCoverageAvailable
          }),
          el[0]
        );
      });
    }
  };
});

coverageApp.directive('historyChart', function($window) {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      var chartData = $window[attrs.data];
      var options = {
        axisY: {
          type: undefined,
          onlyInteger: true
        },
        lineSmooth: false,
        low: 0,
        high: 100,
        scaleMinSpace: 20,
        onlyInteger: true
      };
      var lineChart = new Chartist.Line(
        '#' + el[0].id,
        {
          labels: [],
          series: chartData.series
        },
        options
      );

      var chart = $(el[0]);

      var toggleZoomButton = chart
        .append('<div class="toggleZoom"><a href=""><i class="icon-search-plus" /></a></div>')
        .find('.toggleZoom');

      toggleZoomButton.find('a').on('click', function(event) {
        event.preventDefault();

        if (options.axisY.type === undefined) {
          options.axisY.type = Chartist.AutoScaleAxis;
        } else {
          options.axisY.type = undefined;
        }

        toggleZoomButton.find('i').toggleClass('icon-search-plus icon-search-minus');

        lineChart.update(null, options);
      });

      var tooltip = chart.append('<div class="tooltip"></div>').find('.tooltip');

      chart.on('mouseenter', '.ct-point', function() {
        var point = $(this);
        var index = point
          .parent()
          .children('.ct-point')
          .index(point);

        tooltip.html(chartData.tooltips[index % chartData.tooltips.length]).show();
      });

      chart.on('mouseleave', '.ct-point', function() {
        tooltip.hide();
      });

      chart.on('mousemove', function(event) {
        var box = el[0].getBoundingClientRect();
        var left = event.pageX - box.left - window.pageXOffset;
        var top = event.pageY - box.top - window.pageYOffset;

        tooltip.css({
          left: left - tooltip.width() / 2 - 5,
          top: top - tooltip.height() - 40
        });
      });
    }
  };
});
