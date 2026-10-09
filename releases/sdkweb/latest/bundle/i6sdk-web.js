(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/sql.js/dist/sql-wasm-browser.js
  var require_sql_wasm_browser = __commonJS({
    "node_modules/sql.js/dist/sql-wasm-browser.js"(exports, module) {
      var initSqlJsPromise = void 0;
      var initSqlJs = function(moduleConfig) {
        if (initSqlJsPromise) {
          return initSqlJsPromise;
        }
        initSqlJsPromise = new Promise(function(resolveModule, reject) {
          var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
          var originalOnAbortFunction = Module["onAbort"];
          Module["onAbort"] = function(errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction) {
              originalOnAbortFunction(errorThatCausedAbort);
            }
          };
          Module["postRun"] = Module["postRun"] || [];
          Module["postRun"].push(function() {
            resolveModule(Module);
          });
          module = void 0;
          var k;
          k ||= typeof Module != "undefined" ? Module : {};
          var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope;
          k.onRuntimeInitialized = function() {
            function a(f, l) {
              switch (typeof l) {
                case "boolean":
                  bc(f, l ? 1 : 0);
                  break;
                case "number":
                  cc(f, l);
                  break;
                case "string":
                  dc(f, l, -1, -1);
                  break;
                case "object":
                  if (null === l) eb(f);
                  else if (null != l.length) {
                    var n = ca(l.length);
                    m.set(l, n);
                    ec(f, n, l.length, -1);
                    da(n);
                  } else ua(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                  break;
                default:
                  eb(f);
              }
            }
            function b(f, l) {
              for (var n = [], p = 0; p < f; p += 1) {
                var r = t(l + 4 * p, "i32"), v = fc(r);
                if (1 === v || 2 === v) r = gc(r);
                else if (3 === v) r = hc(r);
                else if (4 === v) {
                  v = r;
                  r = ic(v);
                  v = jc(v);
                  for (var J = new Uint8Array(r), I = 0; I < r; I += 1) J[I] = m[v + I];
                  r = J;
                } else r = null;
                n.push(r);
              }
              return n;
            }
            function c(f, l) {
              this.Qa = f;
              this.db = l;
              this.Oa = 1;
              this.yb = [];
            }
            function d(f, l) {
              this.db = l;
              this.ob = ea(f);
              if (null === this.ob) throw Error("Unable to allocate memory for the SQL string");
              this.ub = this.ob;
              this.gb = this.Fb = null;
            }
            function e(f) {
              this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
              if (null != f) {
                var l = this.filename, n = "/", p = l;
                n && (n = "string" == typeof n ? n : fa(n), p = l ? ha(n + "/" + l) : n);
                l = ia(true, true);
                p = ja(
                  p,
                  l
                );
                if (f) {
                  if ("string" == typeof f) {
                    n = Array(f.length);
                    for (var r = 0, v = f.length; r < v; ++r) n[r] = f.charCodeAt(r);
                    f = n;
                  }
                  ka(p, l | 146);
                  n = ma(p, 577);
                  na(n, f, 0, f.length, 0);
                  oa(n);
                  ka(p, l);
                }
              }
              this.handleError(q(this.filename, g));
              this.db = t(g, "i32");
              hb(this.db);
              this.pb = {};
              this.Sa = {};
            }
            var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), w = h("sqlite3_close_v2", "number", ["number"]), u = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h(
              "sqlite3_prepare_v2",
              "number",
              ["number", "string", "number", "number", "number"]
            ), ib = h("sqlite3_sql", "string", ["number"]), lc = h("sqlite3_normalized_sql", "string", ["number"]), jb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), mc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), kb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), nc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), oc = h("sqlite3_bind_int", "number", [
              "number",
              "number",
              "number"
            ]), pc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), qc = h("sqlite3_step", "number", ["number"]), rc = h("sqlite3_errmsg", "string", ["number"]), sc = h("sqlite3_column_count", "number", ["number"]), tc = h("sqlite3_data_count", "number", ["number"]), uc = h("sqlite3_column_double", "number", ["number", "number"]), lb = h("sqlite3_column_text", "string", ["number", "number"]), vc = h("sqlite3_column_blob", "number", ["number", "number"]), wc = h("sqlite3_column_bytes", "number", ["number", "number"]), xc = h(
              "sqlite3_column_type",
              "number",
              ["number", "number"]
            ), yc = h("sqlite3_column_name", "string", ["number", "number"]), zc = h("sqlite3_reset", "number", ["number"]), Ac = h("sqlite3_clear_bindings", "number", ["number"]), Bc = h("sqlite3_finalize", "number", ["number"]), mb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), fc = h("sqlite3_value_type", "number", ["number"]), ic = h("sqlite3_value_bytes", "number", ["number"]), hc = h("sqlite3_value_text", "string", ["number"]), jc = h(
              "sqlite3_value_blob",
              "number",
              ["number"]
            ), gc = h("sqlite3_value_double", "number", ["number"]), cc = h("sqlite3_result_double", "", ["number", "number"]), eb = h("sqlite3_result_null", "", ["number"]), dc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), ec = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), bc = h("sqlite3_result_int", "", ["number", "number"]), ua = h("sqlite3_result_error", "", ["number", "string", "number"]), nb = h("sqlite3_aggregate_context", "number", ["number", "number"]), hb = h(
              "RegisterExtensionFunctions",
              "number",
              ["number"]
            ), ob = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
            c.prototype.bind = function(f) {
              if (!this.Qa) throw "Statement closed";
              this.reset();
              return Array.isArray(f) ? this.Wb(f) : null != f && "object" === typeof f ? this.Xb(f) : true;
            };
            c.prototype.step = function() {
              if (!this.Qa) throw "Statement closed";
              this.Oa = 1;
              var f = qc(this.Qa);
              switch (f) {
                case 100:
                  return true;
                case 101:
                  return false;
                default:
                  throw this.db.handleError(f);
              }
            };
            c.prototype.Pb = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              return uc(this.Qa, f);
            };
            c.prototype.hc = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              f = lb(this.Qa, f);
              if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
              return BigInt(f);
            };
            c.prototype.mc = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              return lb(this.Qa, f);
            };
            c.prototype.getBlob = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              var l = wc(this.Qa, f);
              f = vc(this.Qa, f);
              for (var n = new Uint8Array(l), p = 0; p < l; p += 1) n[p] = m[f + p];
              return n;
            };
            c.prototype.get = function(f, l) {
              l = l || {};
              null != f && this.bind(f) && this.step();
              f = [];
              for (var n = tc(this.Qa), p = 0; p < n; p += 1) switch (xc(this.Qa, p)) {
                case 1:
                  var r = l.useBigInt ? this.hc(p) : this.Pb(p);
                  f.push(r);
                  break;
                case 2:
                  f.push(this.Pb(p));
                  break;
                case 3:
                  f.push(this.mc(p));
                  break;
                case 4:
                  f.push(this.getBlob(p));
                  break;
                default:
                  f.push(null);
              }
              return f;
            };
            c.prototype.Db = function() {
              for (var f = [], l = sc(this.Qa), n = 0; n < l; n += 1) f.push(yc(this.Qa, n));
              return f;
            };
            c.prototype.Ob = function(f, l) {
              f = this.get(f, l);
              l = this.Db();
              for (var n = {}, p = 0; p < l.length; p += 1) n[l[p]] = f[p];
              return n;
            };
            c.prototype.lc = function() {
              return ib(this.Qa);
            };
            c.prototype.ic = function() {
              return lc(this.Qa);
            };
            c.prototype.Jb = function(f) {
              null != f && this.bind(f);
              this.step();
              return this.reset();
            };
            c.prototype.Lb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              f = ea(f);
              this.yb.push(f);
              this.db.handleError(mc(this.Qa, l, f, -1, 0));
            };
            c.prototype.Vb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              var n = ca(f.length);
              m.set(f, n);
              this.yb.push(n);
              this.db.handleError(kb(this.Qa, l, n, f.length, 0));
            };
            c.prototype.Kb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              this.db.handleError((f === (f | 0) ? oc : nc)(
                this.Qa,
                l,
                f
              ));
            };
            c.prototype.Yb = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              kb(this.Qa, f, 0, 0, 0);
            };
            c.prototype.Mb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              switch (typeof f) {
                case "string":
                  this.Lb(f, l);
                  return;
                case "number":
                  this.Kb(f, l);
                  return;
                case "bigint":
                  this.Lb(f.toString(), l);
                  return;
                case "boolean":
                  this.Kb(f + 0, l);
                  return;
                case "object":
                  if (null === f) {
                    this.Yb(l);
                    return;
                  }
                  if (null != f.length) {
                    this.Vb(f, l);
                    return;
                  }
              }
              throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
            };
            c.prototype.Xb = function(f) {
              var l = this;
              Object.keys(f).forEach(function(n) {
                var p = pc(l.Qa, n);
                0 !== p && l.Mb(f[n], p);
              });
              return true;
            };
            c.prototype.Wb = function(f) {
              for (var l = 0; l < f.length; l += 1) this.Mb(f[l], l + 1);
              return true;
            };
            c.prototype.reset = function() {
              this.Cb();
              return 0 === Ac(this.Qa) && 0 === zc(this.Qa);
            };
            c.prototype.Cb = function() {
              for (var f; void 0 !== (f = this.yb.pop()); ) da(f);
            };
            c.prototype.cb = function() {
              this.Cb();
              var f = 0 === Bc(this.Qa);
              delete this.db.pb[this.Qa];
              this.Qa = 0;
              return f;
            };
            d.prototype.next = function() {
              if (null === this.ob) return { done: true };
              null !== this.gb && (this.gb.cb(), this.gb = null);
              if (!this.db.db) throw this.Ab(), Error("Database closed");
              var f = pa(), l = y(4);
              qa(g);
              qa(l);
              try {
                this.db.handleError(jb(this.db.db, this.ub, -1, g, l));
                this.ub = t(l, "i32");
                var n = t(g, "i32");
                if (0 === n) return this.Ab(), { done: true };
                this.gb = new c(n, this.db);
                this.db.pb[n] = this.gb;
                return { value: this.gb, done: false };
              } catch (p) {
                throw this.Fb = z(this.ub), this.Ab(), p;
              } finally {
                ra(f);
              }
            };
            d.prototype.Ab = function() {
              da(this.ob);
              this.ob = null;
            };
            d.prototype.jc = function() {
              return null !== this.Fb ? this.Fb : z(this.ub);
            };
            "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
              return this;
            });
            e.prototype.Jb = function(f, l) {
              if (!this.db) throw "Database closed";
              if (l) {
                f = this.Gb(f, l);
                try {
                  f.step();
                } finally {
                  f.cb();
                }
              } else this.handleError(u(this.db, f, 0, 0, g));
              return this;
            };
            e.prototype.exec = function(f, l, n) {
              if (!this.db) throw "Database closed";
              var p = pa(), r = null, v = null, J = null;
              try {
                J = v = ea(f);
                var I = y(4);
                for (f = []; 0 !== t(J, "i8"); ) {
                  qa(g);
                  qa(I);
                  this.handleError(jb(this.db, J, -1, g, I));
                  var L = t(g, "i32");
                  J = t(I, "i32");
                  if (0 !== L) {
                    var G = null;
                    r = new c(L, this);
                    for (null != l && r.bind(l); r.step(); ) null === G && (G = { columns: r.Db(), values: [] }, f.push(G)), G.values.push(r.get(null, n));
                    r.cb();
                  }
                }
                return f;
              } catch (la) {
                throw r && r.cb(), la;
              } finally {
                v && da(v), ra(p);
              }
            };
            e.prototype.ec = function(f, l, n, p, r) {
              "function" === typeof l && (p = n, n = l, l = void 0);
              f = this.Gb(f, l);
              try {
                for (; f.step(); ) n(f.Ob(null, r));
              } finally {
                f.cb();
              }
              if ("function" === typeof p) return p();
            };
            e.prototype.Gb = function(f, l) {
              qa(g);
              this.handleError(D(this.db, f, -1, g, 0));
              f = t(g, "i32");
              if (0 === f) throw "Nothing to prepare";
              var n = new c(f, this);
              null != l && n.bind(l);
              return this.pb[f] = n;
            };
            e.prototype.pc = function(f) {
              return new d(f, this);
            };
            e.prototype.fc = function() {
              Object.values(this.pb).forEach(function(l) {
                l.cb();
              });
              Object.values(this.Sa).forEach(A);
              this.Sa = {};
              this.handleError(w(this.db));
              var f = sa(this.filename);
              this.handleError(q(this.filename, g));
              this.db = t(g, "i32");
              hb(this.db);
              return f;
            };
            e.prototype.close = function() {
              null !== this.db && (Object.values(this.pb).forEach(function(f) {
                f.cb();
              }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.fb && (A(this.fb), this.fb = void 0), this.handleError(w(this.db)), ta("/" + this.filename), this.db = null);
            };
            e.prototype.handleError = function(f) {
              if (0 === f) return null;
              f = rc(this.db);
              throw Error(f);
            };
            e.prototype.kc = function() {
              return x(this.db);
            };
            e.prototype.bc = function(f, l) {
              Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
              var n = va(function(p, r, v) {
                r = b(r, v);
                try {
                  var J = l.apply(null, r);
                } catch (I) {
                  ua(p, I, -1);
                  return;
                }
                a(p, J);
              }, "viii");
              this.Sa[f] = n;
              this.handleError(mb(
                this.db,
                f,
                l.length,
                1,
                0,
                n,
                0,
                0,
                0
              ));
              return this;
            };
            e.prototype.ac = function(f, l) {
              var n = l.init || function() {
                return null;
              }, p = l.finalize || function(L) {
                return L;
              }, r = l.step;
              if (!r) throw "An aggregate function must have a step function in " + f;
              var v = {};
              Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
              l = f + "__finalize";
              Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
              var J = va(function(L, G, la) {
                var V = nb(L, 1);
                Object.hasOwnProperty.call(v, V) || (v[V] = n());
                G = b(G, la);
                G = [v[V]].concat(G);
                try {
                  v[V] = r.apply(null, G);
                } catch (Dc) {
                  delete v[V], ua(L, Dc, -1);
                }
              }, "viii"), I = va(function(L) {
                var G = nb(L, 1);
                try {
                  var la = p(v[G]);
                } catch (V) {
                  delete v[G];
                  ua(L, V, -1);
                  return;
                }
                a(L, la);
                delete v[G];
              }, "vi");
              this.Sa[f] = J;
              this.Sa[l] = I;
              this.handleError(mb(this.db, f, r.length - 1, 1, 0, 0, J, I, 0));
              return this;
            };
            e.prototype.vc = function(f) {
              this.fb && (ob(this.db, 0, 0), A(this.fb), this.fb = void 0);
              if (!f) return this;
              this.fb = va(function(l, n, p, r, v) {
                switch (n) {
                  case 18:
                    l = "insert";
                    break;
                  case 23:
                    l = "update";
                    break;
                  case 9:
                    l = "delete";
                    break;
                  default:
                    throw "unknown operationCode in updateHook callback: " + n;
                }
                p = z(p);
                r = z(r);
                if (v > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
                f(l, p, r, Number(v));
              }, "viiiij");
              ob(this.db, this.fb, 0);
              return this;
            };
            c.prototype.bind = c.prototype.bind;
            c.prototype.step = c.prototype.step;
            c.prototype.get = c.prototype.get;
            c.prototype.getColumnNames = c.prototype.Db;
            c.prototype.getAsObject = c.prototype.Ob;
            c.prototype.getSQL = c.prototype.lc;
            c.prototype.getNormalizedSQL = c.prototype.ic;
            c.prototype.run = c.prototype.Jb;
            c.prototype.reset = c.prototype.reset;
            c.prototype.freemem = c.prototype.Cb;
            c.prototype.free = c.prototype.cb;
            d.prototype.next = d.prototype.next;
            d.prototype.getRemainingSQL = d.prototype.jc;
            e.prototype.run = e.prototype.Jb;
            e.prototype.exec = e.prototype.exec;
            e.prototype.each = e.prototype.ec;
            e.prototype.prepare = e.prototype.Gb;
            e.prototype.iterateStatements = e.prototype.pc;
            e.prototype["export"] = e.prototype.fc;
            e.prototype.close = e.prototype.close;
            e.prototype.handleError = e.prototype.handleError;
            e.prototype.getRowsModified = e.prototype.kc;
            e.prototype.create_function = e.prototype.bc;
            e.prototype.create_aggregate = e.prototype.ac;
            e.prototype.updateHook = e.prototype.vc;
            k.Database = e;
          };
          var wa = "./this.program", xa = globalThis.document?.currentScript?.src;
          ba && (xa = self.location.href);
          var ya = "", za, Aa;
          if (aa || ba) {
            try {
              ya = new URL(".", xa).href;
            } catch {
            }
            ba && (Aa = (a) => {
              var b = new XMLHttpRequest();
              b.open("GET", a, false);
              b.responseType = "arraybuffer";
              b.send(null);
              return new Uint8Array(b.response);
            });
            za = async (a) => {
              a = await fetch(a, { credentials: "same-origin" });
              if (a.ok) return a.arrayBuffer();
              throw Error(a.status + " : " + a.url);
            };
          }
          var Ba = console.log.bind(console), B = console.error.bind(console), Ca, Da = false, Ea, m, C, Fa, E, F, Ga, Ha, H;
          function Ia() {
            var a = Ja.buffer;
            m = new Int8Array(a);
            Fa = new Int16Array(a);
            C = new Uint8Array(a);
            new Uint16Array(a);
            E = new Int32Array(a);
            F = new Uint32Array(a);
            Ga = new Float32Array(a);
            Ha = new Float64Array(a);
            H = new BigInt64Array(a);
            new BigUint64Array(a);
          }
          function Ka(a) {
            k.onAbort?.(a);
            a = "Aborted(" + a + ")";
            B(a);
            Da = true;
            throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
          }
          var La;
          async function Ma(a) {
            if (!Ca) try {
              var b = await za(a);
              return new Uint8Array(b);
            } catch {
            }
            if (a == La && Ca) a = new Uint8Array(Ca);
            else if (Aa) a = Aa(a);
            else throw "both async and sync fetching of the wasm failed";
            return a;
          }
          async function Na(a, b) {
            try {
              var c = await Ma(a);
              return await WebAssembly.instantiate(c, b);
            } catch (d) {
              B(`failed to asynchronously prepare wasm: ${d}`), Ka(d);
            }
          }
          async function Oa(a) {
            var b = La;
            if (!Ca) try {
              var c = fetch(b, { credentials: "same-origin" });
              return await WebAssembly.instantiateStreaming(c, a);
            } catch (d) {
              B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
            }
            return Na(b, a);
          }
          class Pa {
            name = "ExitStatus";
            constructor(a) {
              this.message = `Program terminated with exit(${a})`;
              this.status = a;
            }
          }
          var Qa = (a) => {
            for (; 0 < a.length; ) a.shift()(k);
          }, Ra = [], Sa = [], Ta = () => {
            var a = k.preRun.shift();
            Sa.push(a);
          }, K = 0, Ua = null;
          function t(a, b = "i8") {
            b.endsWith("*") && (b = "*");
            switch (b) {
              case "i1":
                return m[a];
              case "i8":
                return m[a];
              case "i16":
                return Fa[a >> 1];
              case "i32":
                return E[a >> 2];
              case "i64":
                return H[a >> 3];
              case "float":
                return Ga[a >> 2];
              case "double":
                return Ha[a >> 3];
              case "*":
                return F[a >> 2];
              default:
                Ka(`invalid type for getValue: ${b}`);
            }
          }
          var Va = true;
          function qa(a) {
            var b = "i32";
            b.endsWith("*") && (b = "*");
            switch (b) {
              case "i1":
                m[a] = 0;
                break;
              case "i8":
                m[a] = 0;
                break;
              case "i16":
                Fa[a >> 1] = 0;
                break;
              case "i32":
                E[a >> 2] = 0;
                break;
              case "i64":
                H[a >> 3] = BigInt(0);
                break;
              case "float":
                Ga[a >> 2] = 0;
                break;
              case "double":
                Ha[a >> 3] = 0;
                break;
              case "*":
                F[a >> 2] = 0;
                break;
              default:
                Ka(`invalid type for setValue: ${b}`);
            }
          }
          var Wa = new TextDecoder(), Xa = (a, b, c, d) => {
            c = b + c;
            if (d) return c;
            for (; a[b] && !(b >= c); ) ++b;
            return b;
          }, z = (a, b, c) => a ? Wa.decode(C.subarray(a, Xa(C, a, b, c))) : "", Ya = (a, b) => {
            for (var c = 0, d = a.length - 1; 0 <= d; d--) {
              var e = a[d];
              "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
            }
            if (b) for (; c; c--) a.unshift("..");
            return a;
          }, ha = (a) => {
            var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
            (a = Ya(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
            a && c && (a += "/");
            return (b ? "/" : "") + a;
          }, Za = (a) => {
            var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
            a = b[0];
            b = b[1];
            if (!a && !b) return ".";
            b &&= b.slice(0, -1);
            return a + b;
          }, $a = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], ab = () => (a) => crypto.getRandomValues(a), bb = (a) => {
            (bb = ab())(a);
          }, cb = (...a) => {
            for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
              c = 0 <= d ? a[d] : "/";
              if ("string" != typeof c) throw new TypeError("Arguments to path.resolve must be strings");
              if (!c) return "";
              b = c + "/" + b;
              c = "/" === c.charAt(0);
            }
            b = Ya(b.split("/").filter((e) => !!e), !c).join("/");
            return (c ? "/" : "") + b || ".";
          }, db = (a) => {
            var b = Xa(a, 0);
            return Wa.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
          }, fb = [], gb = (a) => {
            for (var b = 0, c = 0; c < a.length; ++c) {
              var d = a.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            return b;
          }, M = (a, b, c, d) => {
            if (!(0 < d)) return 0;
            var e = c;
            d = c + d - 1;
            for (var g = 0; g < a.length; ++g) {
              var h = a.codePointAt(g);
              if (127 >= h) {
                if (c >= d) break;
                b[c++] = h;
              } else if (2047 >= h) {
                if (c + 1 >= d) break;
                b[c++] = 192 | h >> 6;
                b[c++] = 128 | h & 63;
              } else if (65535 >= h) {
                if (c + 2 >= d) break;
                b[c++] = 224 | h >> 12;
                b[c++] = 128 | h >> 6 & 63;
                b[c++] = 128 | h & 63;
              } else {
                if (c + 3 >= d) break;
                b[c++] = 240 | h >> 18;
                b[c++] = 128 | h >> 12 & 63;
                b[c++] = 128 | h >> 6 & 63;
                b[c++] = 128 | h & 63;
                g++;
              }
            }
            b[c] = 0;
            return c - e;
          }, pb = [];
          function qb(a, b) {
            pb[a] = { input: [], output: [], kb: b };
            rb(a, sb);
          }
          var sb = { open(a) {
            var b = pb[a.node.nb];
            if (!b) throw new N(43);
            a.Va = b;
            a.seekable = false;
          }, close(a) {
            a.Va.kb.lb(a.Va);
          }, lb(a) {
            a.Va.kb.lb(a.Va);
          }, read(a, b, c, d) {
            if (!a.Va || !a.Va.kb.Qb) throw new N(60);
            for (var e = 0, g = 0; g < d; g++) {
              try {
                var h = a.Va.kb.Qb(a.Va);
              } catch (q) {
                throw new N(29);
              }
              if (void 0 === h && 0 === e) throw new N(6);
              if (null === h || void 0 === h) break;
              e++;
              b[c + g] = h;
            }
            e && (a.node.$a = Date.now());
            return e;
          }, write(a, b, c, d) {
            if (!a.Va || !a.Va.kb.Hb) throw new N(60);
            try {
              for (var e = 0; e < d; e++) a.Va.kb.Hb(a.Va, b[c + e]);
            } catch (g) {
              throw new N(29);
            }
            d && (a.node.Ua = a.node.Ta = Date.now());
            return e;
          } }, tb = { Qb() {
            a: {
              if (!fb.length) {
                var a = null;
                globalThis.window?.prompt && (a = window.prompt("Input: "), null !== a && (a += "\n"));
                if (!a) {
                  var b = null;
                  break a;
                }
                b = Array(gb(a) + 1);
                a = M(a, b, 0, b.length);
                b.length = a;
                fb = b;
              }
              b = fb.shift();
            }
            return b;
          }, Hb(a, b) {
            null === b || 10 === b ? (Ba(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
          }, lb(a) {
            0 < a.output?.length && (Ba(db(a.output)), a.output = []);
          }, Dc() {
            return { yc: 25856, Ac: 5, xc: 191, zc: 35387, wc: [
              3,
              28,
              127,
              21,
              4,
              0,
              1,
              0,
              17,
              19,
              26,
              0,
              18,
              15,
              23,
              22,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ] };
          }, Ec() {
            return 0;
          }, Fc() {
            return [24, 80];
          } }, ub = { Hb(a, b) {
            null === b || 10 === b ? (B(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
          }, lb(a) {
            0 < a.output?.length && (B(db(a.output)), a.output = []);
          } }, O = { Za: null, ab() {
            return O.createNode(null, "/", 16895, 0);
          }, createNode(a, b, c, d) {
            if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new N(63);
            O.Za || (O.Za = { dir: { node: { Wa: O.La.Wa, Xa: O.La.Xa, mb: O.La.mb, rb: O.La.rb, Tb: O.La.Tb, xb: O.La.xb, vb: O.La.vb, Ib: O.La.Ib, wb: O.La.wb }, stream: { Ya: O.Ma.Ya } }, file: {
              node: { Wa: O.La.Wa, Xa: O.La.Xa },
              stream: { Ya: O.Ma.Ya, read: O.Ma.read, write: O.Ma.write, sb: O.Ma.sb, tb: O.Ma.tb }
            }, link: { node: { Wa: O.La.Wa, Xa: O.La.Xa, eb: O.La.eb }, stream: {} }, Nb: { node: { Wa: O.La.Wa, Xa: O.La.Xa }, stream: vb } });
            c = wb(a, b, c, d);
            P(c.mode) ? (c.La = O.Za.dir.node, c.Ma = O.Za.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = O.Za.file.node, c.Ma = O.Za.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = O.Za.link.node, c.Ma = O.Za.link.stream) : 8192 === (c.mode & 61440) && (c.La = O.Za.Nb.node, c.Ma = O.Za.Nb.stream);
            c.$a = c.Ua = c.Ta = Date.now();
            a && (a.Na[b] = c, a.$a = a.Ua = a.Ta = c.$a);
            return c;
          }, Cc(a) {
            return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
          }, La: { Wa(a) {
            var b = {};
            b.cc = 8192 === (a.mode & 61440) ? a.id : 1;
            b.oc = a.id;
            b.mode = a.mode;
            b.rc = 1;
            b.uid = 0;
            b.nc = 0;
            b.nb = a.nb;
            P(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
            b.$a = new Date(a.$a);
            b.Ua = new Date(a.Ua);
            b.Ta = new Date(a.Ta);
            b.Zb = 4096;
            b.$b = Math.ceil(b.size / b.Zb);
            return b;
          }, Xa(a, b) {
            for (var c of ["mode", "atime", "mtime", "ctime"]) null != b[c] && (a[c] = b[c]);
            void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
          }, mb() {
            O.zb || (O.zb = new N(44), O.zb.stack = "<generic error, no stack>");
            throw O.zb;
          }, rb(a, b, c, d) {
            return O.createNode(a, b, c, d);
          }, Tb(a, b, c) {
            try {
              var d = Q(b, c);
            } catch (g) {
            }
            if (d) {
              if (P(a.mode)) for (var e in d.Na) throw new N(55);
              xb(d);
            }
            delete a.parent.Na[a.name];
            b.Na[c] = a;
            a.name = c;
            b.Ta = b.Ua = a.parent.Ta = a.parent.Ua = Date.now();
          }, xb(a, b) {
            delete a.Na[b];
            a.Ta = a.Ua = Date.now();
          }, vb(a, b) {
            var c = Q(a, b), d;
            for (d in c.Na) throw new N(55);
            delete a.Na[b];
            a.Ta = a.Ua = Date.now();
          }, Ib(a) {
            return [".", "..", ...Object.keys(a.Na)];
          }, wb(a, b, c) {
            a = O.createNode(a, b, 41471, 0);
            a.link = c;
            return a;
          }, eb(a) {
            if (40960 !== (a.mode & 61440)) throw new N(28);
            return a.link;
          } }, Ma: { read(a, b, c, d, e) {
            var g = a.node.Na;
            if (e >= a.node.Ra) return 0;
            a = Math.min(a.node.Ra - e, d);
            if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
            else for (d = 0; d < a; d++) b[c + d] = g[e + d];
            return a;
          }, write(a, b, c, d, e, g) {
            b.buffer === m.buffer && (g = false);
            if (!d) return 0;
            a = a.node;
            a.Ua = a.Ta = Date.now();
            if (b.subarray && (!a.Na || a.Na.subarray)) {
              if (g) return a.Na = b.subarray(c, c + d), a.Ra = d;
              if (0 === a.Ra && 0 === e) return a.Na = b.slice(c, c + d), a.Ra = d;
              if (e + d <= a.Ra) return a.Na.set(b.subarray(c, c + d), e), d;
            }
            g = e + d;
            var h = a.Na ? a.Na.length : 0;
            h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
            if (a.Na.subarray && b.subarray) a.Na.set(b.subarray(c, c + d), e);
            else for (g = 0; g < d; g++) a.Na[e + g] = b[c + g];
            a.Ra = Math.max(
              a.Ra,
              e + d
            );
            return d;
          }, Ya(a, b, c) {
            1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
            if (0 > b) throw new N(28);
            return b;
          }, sb(a, b, c, d, e) {
            if (32768 !== (a.node.mode & 61440)) throw new N(43);
            a = a.node.Na;
            if (e & 2 || !a || a.buffer !== m.buffer) {
              e = true;
              d = 65536 * Math.ceil(b / 65536);
              var g = yb(65536, d);
              g && C.fill(0, g, g + d);
              d = g;
              if (!d) throw new N(48);
              if (a) {
                if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
                m.set(a, d);
              }
            } else e = false, d = a.byteOffset;
            return { tc: d, Ub: e };
          }, tb(a, b, c, d) {
            O.Ma.write(
              a,
              b,
              0,
              d,
              c,
              false
            );
            return 0;
          } } }, ia = (a, b) => {
            var c = 0;
            a && (c |= 365);
            b && (c |= 146);
            return c;
          }, zb = null, Ab = {}, Bb = [], Cb = 1, R = null, Db = false, Eb = true, Fb = {}, N = class {
            name = "ErrnoError";
            constructor(a) {
              this.Pa = a;
            }
          }, Gb = class {
            qb = {};
            node = null;
            get flags() {
              return this.qb.flags;
            }
            set flags(a) {
              this.qb.flags = a;
            }
            get position() {
              return this.qb.position;
            }
            set position(a) {
              this.qb.position = a;
            }
          }, Hb = class {
            La = {};
            Ma = {};
            ib = null;
            constructor(a, b, c, d) {
              a ||= this;
              this.parent = a;
              this.ab = a.ab;
              this.id = Cb++;
              this.name = b;
              this.mode = c;
              this.nb = d;
              this.$a = this.Ua = this.Ta = Date.now();
            }
            get read() {
              return 365 === (this.mode & 365);
            }
            set read(a) {
              a ? this.mode |= 365 : this.mode &= -366;
            }
            get write() {
              return 146 === (this.mode & 146);
            }
            set write(a) {
              a ? this.mode |= 146 : this.mode &= -147;
            }
          };
          function S(a, b = {}) {
            if (!a) throw new N(44);
            b.Bb ?? (b.Bb = true);
            "/" === a.charAt(0) || (a = "//" + a);
            var c = 0;
            a: for (; 40 > c; c++) {
              a = a.split("/").filter((q) => !!q);
              for (var d = zb, e = "/", g = 0; g < a.length; g++) {
                var h = g === a.length - 1;
                if (h && b.parent) break;
                if ("." !== a[g]) if (".." === a[g]) if (e = Za(e), d === d.parent) {
                  a = e + "/" + a.slice(g + 1).join("/");
                  c--;
                  continue a;
                } else d = d.parent;
                else {
                  e = ha(e + "/" + a[g]);
                  try {
                    d = Q(d, a[g]);
                  } catch (q) {
                    if (44 === q?.Pa && h && b.sc) return { path: e };
                    throw q;
                  }
                  !d.ib || h && !b.Bb || (d = d.ib.root);
                  if (40960 === (d.mode & 61440) && (!h || b.hb)) {
                    if (!d.La.eb) throw new N(52);
                    d = d.La.eb(d);
                    "/" === d.charAt(0) || (d = Za(e) + "/" + d);
                    a = d + "/" + a.slice(g + 1).join("/");
                    continue a;
                  }
                }
              }
              return { path: e, node: d };
            }
            throw new N(32);
          }
          function fa(a) {
            for (var b; ; ) {
              if (a === a.parent) return a = a.ab.Sb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
              b = b ? `${a.name}/${b}` : a.name;
              a = a.parent;
            }
          }
          function Ib(a, b) {
            for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
            return (a + c >>> 0) % R.length;
          }
          function xb(a) {
            var b = Ib(a.parent.id, a.name);
            if (R[b] === a) R[b] = a.jb;
            else for (b = R[b]; b; ) {
              if (b.jb === a) {
                b.jb = a.jb;
                break;
              }
              b = b.jb;
            }
          }
          function Q(a, b) {
            var c = P(a.mode) ? (c = Jb(a, "x")) ? c : a.La.mb ? 0 : 2 : 54;
            if (c) throw new N(c);
            for (c = R[Ib(a.id, b)]; c; c = c.jb) {
              var d = c.name;
              if (c.parent.id === a.id && d === b) return c;
            }
            return a.La.mb(a, b);
          }
          function wb(a, b, c, d) {
            a = new Hb(a, b, c, d);
            b = Ib(a.parent.id, a.name);
            a.jb = R[b];
            return R[b] = a;
          }
          function P(a) {
            return 16384 === (a & 61440);
          }
          function Kb(a) {
            var b = ["r", "w", "rw"][a & 3];
            a & 512 && (b += "w");
            return b;
          }
          function Jb(a, b) {
            if (Eb) return 0;
            if (!b.includes("r") || a.mode & 292) {
              if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2;
            } else return 2;
            return 0;
          }
          function Lb(a, b) {
            if (!P(a.mode)) return 54;
            try {
              return Q(a, b), 20;
            } catch (c) {
            }
            return Jb(a, "wx");
          }
          function Mb(a, b, c) {
            try {
              var d = Q(a, b);
            } catch (e) {
              return e.Pa;
            }
            if (a = Jb(a, "wx")) return a;
            if (c) {
              if (!P(d.mode)) return 54;
              if (d === d.parent || "/" === fa(d)) return 10;
            } else if (P(d.mode)) return 31;
            return 0;
          }
          function Nb(a) {
            if (!a) throw new N(63);
            return a;
          }
          function T(a) {
            a = Bb[a];
            if (!a) throw new N(8);
            return a;
          }
          function Ob(a, b = -1) {
            a = Object.assign(new Gb(), a);
            if (-1 == b) a: {
              for (b = 0; 4096 >= b; b++) if (!Bb[b]) break a;
              throw new N(33);
            }
            a.bb = b;
            return Bb[b] = a;
          }
          function Pb(a, b = -1) {
            a = Ob(a, b);
            a.Ma?.Bc?.(a);
            return a;
          }
          function Qb(a, b, c) {
            var d = a?.Ma.Xa;
            a = d ? a : b;
            d ??= b.La.Xa;
            Nb(d);
            d(a, c);
          }
          var vb = { open(a) {
            a.Ma = Ab[a.node.nb].Ma;
            a.Ma.open?.(a);
          }, Ya() {
            throw new N(70);
          } };
          function rb(a, b) {
            Ab[a] = { Ma: b };
          }
          function Rb(a, b) {
            var c = "/" === b;
            if (c && zb) throw new N(10);
            if (!c && b) {
              var d = S(b, { Bb: false });
              b = d.path;
              d = d.node;
              if (d.ib) throw new N(10);
              if (!P(d.mode)) throw new N(54);
            }
            b = { type: a, Gc: {}, Sb: b, qc: [] };
            a = a.ab(b);
            a.ab = b;
            b.root = a;
            c ? zb = a : d && (d.ib = b, d.ab && d.ab.qc.push(b));
          }
          function Sb(a, b, c) {
            var d = S(a, { parent: true }).node;
            a = $a(a);
            if (!a) throw new N(28);
            if ("." === a || ".." === a) throw new N(20);
            var e = Lb(d, a);
            if (e) throw new N(e);
            if (!d.La.rb) throw new N(63);
            return d.La.rb(d, a, b, c);
          }
          function ja(a, b = 438) {
            return Sb(a, b & 4095 | 32768, 0);
          }
          function U(a, b = 511) {
            return Sb(a, b & 1023 | 16384, 0);
          }
          function Tb(a, b, c) {
            "undefined" == typeof c && (c = b, b = 438);
            Sb(a, b | 8192, c);
          }
          function Ub(a, b) {
            if (!cb(a)) throw new N(44);
            var c = S(b, { parent: true }).node;
            if (!c) throw new N(44);
            b = $a(b);
            var d = Lb(c, b);
            if (d) throw new N(d);
            if (!c.La.wb) throw new N(63);
            c.La.wb(c, b, a);
          }
          function Vb(a) {
            var b = S(a, { parent: true }).node;
            a = $a(a);
            var c = Q(b, a), d = Mb(b, a, true);
            if (d) throw new N(d);
            if (!b.La.vb) throw new N(63);
            if (c.ib) throw new N(10);
            b.La.vb(b, a);
            xb(c);
          }
          function ta(a) {
            var b = S(a, { parent: true }).node;
            if (!b) throw new N(44);
            a = $a(a);
            var c = Q(b, a), d = Mb(b, a, false);
            if (d) throw new N(d);
            if (!b.La.xb) throw new N(63);
            if (c.ib) throw new N(10);
            b.La.xb(b, a);
            xb(c);
          }
          function Wb(a, b) {
            a = S(a, { hb: !b }).node;
            return Nb(a.La.Wa)(a);
          }
          function Xb(a, b, c, d) {
            Qb(a, b, { mode: c & 4095 | b.mode & -4096, Ta: Date.now(), dc: d });
          }
          function ka(a, b) {
            a = "string" == typeof a ? S(a, { hb: true }).node : a;
            Xb(null, a, b);
          }
          function Yb(a, b, c) {
            if (P(b.mode)) throw new N(31);
            if (32768 !== (b.mode & 61440)) throw new N(28);
            var d = Jb(b, "w");
            if (d) throw new N(d);
            Qb(a, b, { size: c, timestamp: Date.now() });
          }
          function ma(a, b, c = 438) {
            if ("" === a) throw new N(44);
            if ("string" == typeof b) {
              var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
              if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
              b = d;
            }
            c = b & 64 ? c & 4095 | 32768 : 0;
            if ("object" == typeof a) d = a;
            else {
              var e = a.endsWith("/");
              a = S(a, { hb: !(b & 131072), sc: true });
              d = a.node;
              a = a.path;
            }
            var g = false;
            if (b & 64) if (d) {
              if (b & 128) throw new N(20);
            } else {
              if (e) throw new N(31);
              d = Sb(a, c | 511, 0);
              g = true;
            }
            if (!d) throw new N(44);
            8192 === (d.mode & 61440) && (b &= -513);
            if (b & 65536 && !P(d.mode)) throw new N(54);
            if (!g && (e = d ? 40960 === (d.mode & 61440) ? 32 : P(d.mode) && ("r" !== Kb(b) || b & 576) ? 31 : Jb(d, Kb(b)) : 44)) throw new N(e);
            b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { hb: true }).node : e, Yb(null, e, 0));
            b &= -131713;
            e = Ob({ node: d, path: fa(d), flags: b, seekable: true, position: 0, Ma: d.Ma, uc: [], error: false });
            e.Ma.open && e.Ma.open(e);
            g && ka(d, c & 511);
            !k.logReadFiles || b & 1 || a in Fb || (Fb[a] = 1);
            return e;
          }
          function oa(a) {
            if (null === a.bb) throw new N(8);
            a.Eb && (a.Eb = null);
            try {
              a.Ma.close && a.Ma.close(a);
            } catch (b) {
              throw b;
            } finally {
              Bb[a.bb] = null;
            }
            a.bb = null;
          }
          function Zb(a, b, c) {
            if (null === a.bb) throw new N(8);
            if (!a.seekable || !a.Ma.Ya) throw new N(70);
            if (0 != c && 1 != c && 2 != c) throw new N(28);
            a.position = a.Ma.Ya(a, b, c);
            a.uc = [];
          }
          function $b(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new N(28);
            if (null === a.bb) throw new N(8);
            if (1 === (a.flags & 2097155)) throw new N(8);
            if (P(a.node.mode)) throw new N(31);
            if (!a.Ma.read) throw new N(28);
            var g = "undefined" != typeof e;
            if (!g) e = a.position;
            else if (!a.seekable) throw new N(70);
            b = a.Ma.read(a, b, c, d, e);
            g || (a.position += b);
            return b;
          }
          function na(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new N(28);
            if (null === a.bb) throw new N(8);
            if (0 === (a.flags & 2097155)) throw new N(8);
            if (P(a.node.mode)) throw new N(31);
            if (!a.Ma.write) throw new N(28);
            a.seekable && a.flags & 1024 && Zb(a, 0, 2);
            var g = "undefined" != typeof e;
            if (!g) e = a.position;
            else if (!a.seekable) throw new N(70);
            b = a.Ma.write(a, b, c, d, e, void 0);
            g || (a.position += b);
            return b;
          }
          function sa(a) {
            var b = b || 0;
            var c = "binary";
            "utf8" !== c && "binary" !== c && Ka(`Invalid encoding type "${c}"`);
            b = ma(a, b);
            a = Wb(a).size;
            var d = new Uint8Array(a);
            $b(b, d, 0, a, 0);
            "utf8" === c && (d = db(d));
            oa(b);
            return d;
          }
          function W(a, b, c) {
            a = ha("/dev/" + a);
            var d = ia(!!b, !!c);
            W.Rb ?? (W.Rb = 64);
            var e = W.Rb++ << 8 | 0;
            rb(e, { open(g) {
              g.seekable = false;
            }, close() {
              c?.buffer?.length && c(10);
            }, read(g, h, q, w) {
              for (var u = 0, x = 0; x < w; x++) {
                try {
                  var D = b();
                } catch (ib) {
                  throw new N(29);
                }
                if (void 0 === D && 0 === u) throw new N(6);
                if (null === D || void 0 === D) break;
                u++;
                h[q + x] = D;
              }
              u && (g.node.$a = Date.now());
              return u;
            }, write(g, h, q, w) {
              for (var u = 0; u < w; u++) try {
                c(h[q + u]);
              } catch (x) {
                throw new N(29);
              }
              w && (g.node.Ua = g.node.Ta = Date.now());
              return u;
            } });
            Tb(a, d, e);
          }
          var X = {};
          function Y(a, b, c) {
            if ("/" === b.charAt(0)) return b;
            a = -100 === a ? "/" : T(a).path;
            if (0 == b.length) {
              if (!c) throw new N(44);
              return a;
            }
            return a + "/" + b;
          }
          function ac(a, b) {
            F[a >> 2] = b.cc;
            F[a + 4 >> 2] = b.mode;
            F[a + 8 >> 2] = b.rc;
            F[a + 12 >> 2] = b.uid;
            F[a + 16 >> 2] = b.nc;
            F[a + 20 >> 2] = b.nb;
            H[a + 24 >> 3] = BigInt(b.size);
            E[a + 32 >> 2] = 4096;
            E[a + 36 >> 2] = b.$b;
            var c = b.$a.getTime(), d = b.Ua.getTime(), e = b.Ta.getTime();
            H[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
            F[a + 48 >> 2] = c % 1e3 * 1e6;
            H[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
            F[a + 64 >> 2] = d % 1e3 * 1e6;
            H[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
            F[a + 80 >> 2] = e % 1e3 * 1e6;
            H[a + 88 >> 3] = BigInt(b.oc);
            return 0;
          }
          var kc = void 0, Cc = () => {
            var a = E[+kc >> 2];
            kc += 4;
            return a;
          }, Ec = 0, Fc = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Gc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Hc = {}, Ic = (a) => {
            if (!(a instanceof Pa || "unwind" == a)) throw a;
          }, Jc = (a) => {
            Ea = a;
            Va || 0 < Ec || (k.onExit?.(a), Da = true);
            throw new Pa(a);
          }, Kc = (a) => {
            if (!Da) try {
              a();
            } catch (b) {
              Ic(b);
            } finally {
              if (!(Va || 0 < Ec)) try {
                Ea = a = Ea, Jc(a);
              } catch (b) {
                Ic(b);
              }
            }
          }, Lc = {}, Nc = () => {
            if (!Mc) {
              var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: wa || "./this.program" }, b;
              for (b in Lc) void 0 === Lc[b] ? delete a[b] : a[b] = Lc[b];
              var c = [];
              for (b in a) c.push(`${b}=${a[b]}`);
              Mc = c;
            }
            return Mc;
          }, Mc, Oc = (a, b, c, d) => {
            var e = { string: (u) => {
              var x = 0;
              if (null !== u && void 0 !== u && 0 !== u) {
                x = gb(u) + 1;
                var D = y(x);
                M(u, C, D, x);
                x = D;
              }
              return x;
            }, array: (u) => {
              var x = y(u.length);
              m.set(u, x);
              return x;
            } };
            a = k["_" + a];
            var g = [], h = 0;
            if (d) for (var q = 0; q < d.length; q++) {
              var w = e[c[q]];
              w ? (0 === h && (h = pa()), g[q] = w(d[q])) : g[q] = d[q];
            }
            c = a(...g);
            return c = (function(u) {
              0 !== h && ra(h);
              return "string" === b ? z(u) : "boolean" === b ? !!u : u;
            })(c);
          }, ea = (a) => {
            var b = gb(a) + 1, c = ca(b);
            c && M(a, C, c, b);
            return c;
          }, Pc, Qc = [], A = (a) => {
            Pc.delete(Z.get(a));
            Z.set(a, null);
            Qc.push(a);
          }, Rc = (a) => {
            const b = a.length;
            return [b % 128 | 128, b >> 7, ...a];
          }, Sc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Tc = (a) => Rc(Array.from(a, (b) => Sc[b])), va = (a, b) => {
            if (!Pc) {
              Pc = /* @__PURE__ */ new WeakMap();
              var c = Z.length;
              if (Pc) for (var d = 0; d < 0 + c; d++) {
                var e = Z.get(d);
                e && Pc.set(e, d);
              }
            }
            if (c = Pc.get(a) || 0) return c;
            c = Qc.length ? Qc.pop() : Z.grow(1);
            try {
              Z.set(c, a);
            } catch (g) {
              if (!(g instanceof TypeError)) throw g;
              b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Rc([1, 96, ...Tc(b.slice(1)), ...Tc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
              b = new WebAssembly.Module(b);
              b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
              Z.set(c, b);
            }
            Pc.set(a, c);
            return c;
          };
          R = Array(4096);
          Rb(O, "/");
          U("/tmp");
          U("/home");
          U("/home/web_user");
          (function() {
            U("/dev");
            rb(259, { read: () => 0, write: (d, e, g, h) => h, Ya: () => 0 });
            Tb("/dev/null", 259);
            qb(1280, tb);
            qb(1536, ub);
            Tb("/dev/tty", 1280);
            Tb("/dev/tty1", 1536);
            var a = new Uint8Array(1024), b = 0, c = () => {
              0 === b && (bb(a), b = a.byteLength);
              return a[--b];
            };
            W("random", c);
            W("urandom", c);
            U("/dev/shm");
            U("/dev/shm/tmp");
          })();
          (function() {
            U("/proc");
            var a = U("/proc/self");
            U("/proc/self/fd");
            Rb({ ab() {
              var b = wb(a, "fd", 16895, 73);
              b.Ma = { Ya: O.Ma.Ya };
              b.La = { mb(c, d) {
                c = +d;
                var e = T(c);
                c = { parent: null, ab: { Sb: "fake" }, La: { eb: () => e.path }, id: c + 1 };
                return c.parent = c;
              }, Ib() {
                return Array.from(Bb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
              } };
              return b;
            } }, "/proc/self/fd");
          })();
          k.noExitRuntime && (Va = k.noExitRuntime);
          k.print && (Ba = k.print);
          k.printErr && (B = k.printErr);
          k.wasmBinary && (Ca = k.wasmBinary);
          k.thisProgram && (wa = k.thisProgram);
          if (k.preInit) for ("function" == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.shift()();
          k.stackSave = () => pa();
          k.stackRestore = (a) => ra(a);
          k.stackAlloc = (a) => y(a);
          k.cwrap = (a, b, c, d) => {
            var e = !c || c.every((g) => "number" === g || "boolean" === g);
            return "string" !== b && e && !d ? k["_" + a] : (...g) => Oc(a, b, c, g);
          };
          k.addFunction = va;
          k.removeFunction = A;
          k.UTF8ToString = z;
          k.stringToNewUTF8 = ea;
          k.writeArrayToMemory = (a, b) => {
            m.set(a, b);
          };
          var ca, da, yb, Uc, ra, y, pa, Ja, Z, Vc = {
            a: (a, b, c, d) => Ka(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
            i: function(a, b) {
              try {
                return a = z(a), ka(a, b), 0;
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            L: function(a, b, c) {
              try {
                b = z(b);
                b = Y(a, b);
                if (c & -8) return -28;
                var d = S(b, { hb: true }).node;
                if (!d) return -44;
                a = "";
                c & 4 && (a += "r");
                c & 2 && (a += "w");
                c & 1 && (a += "x");
                return a && Jb(d, a) ? -2 : 0;
              } catch (e) {
                if ("undefined" == typeof X || "ErrnoError" !== e.name) throw e;
                return -e.Pa;
              }
            },
            j: function(a, b) {
              try {
                var c = T(a);
                Xb(c, c.node, b, false);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            h: function(a) {
              try {
                var b = T(a);
                Qb(b, b.node, { timestamp: Date.now(), dc: false });
                return 0;
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            b: function(a, b, c) {
              kc = c;
              try {
                var d = T(a);
                switch (b) {
                  case 0:
                    var e = Cc();
                    if (0 > e) break;
                    for (; Bb[e]; ) e++;
                    return Pb(d, e).bb;
                  case 1:
                  case 2:
                    return 0;
                  case 3:
                    return d.flags;
                  case 4:
                    return e = Cc(), d.flags |= e, 0;
                  case 12:
                    return e = Cc(), Fa[e + 0 >> 1] = 2, 0;
                  case 13:
                  case 14:
                    return 0;
                }
                return -28;
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return -g.Pa;
              }
            },
            g: function(a, b) {
              try {
                var c = T(a), d = c.node, e = c.Ma.Wa;
                a = e ? c : d;
                e ??= d.La.Wa;
                Nb(e);
                var g = e(a);
                return ac(b, g);
              } catch (h) {
                if ("undefined" == typeof X || "ErrnoError" !== h.name) throw h;
                return -h.Pa;
              }
            },
            H: function(a, b) {
              b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
              try {
                if (isNaN(b)) return -61;
                var c = T(a);
                if (0 > b || 0 === (c.flags & 2097155)) throw new N(28);
                Yb(c, c.node, b);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            G: function(a, b) {
              try {
                if (0 === b) return -28;
                var c = gb("/") + 1;
                if (b < c) return -68;
                M("/", C, a, b);
                return c;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            K: function(a, b) {
              try {
                return a = z(a), ac(b, Wb(a, true));
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            C: function(a, b, c) {
              try {
                return b = z(b), b = Y(a, b), U(b, c), 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            J: function(a, b, c, d) {
              try {
                b = z(b);
                var e = d & 256;
                b = Y(a, b, d & 4096);
                return ac(c, e ? Wb(b, true) : Wb(b));
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return -g.Pa;
              }
            },
            x: function(a, b, c, d) {
              kc = d;
              try {
                b = z(b);
                b = Y(a, b);
                var e = d ? Cc() : 0;
                return ma(b, c, e).bb;
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return -g.Pa;
              }
            },
            v: function(a, b, c, d) {
              try {
                b = z(b);
                b = Y(a, b);
                if (0 >= d) return -28;
                var e = S(b).node;
                if (!e) throw new N(44);
                if (!e.La.eb) throw new N(28);
                var g = e.La.eb(e);
                var h = Math.min(d, gb(g)), q = m[c + h];
                M(g, C, c, d + 1);
                m[c + h] = q;
                return h;
              } catch (w) {
                if ("undefined" == typeof X || "ErrnoError" !== w.name) throw w;
                return -w.Pa;
              }
            },
            u: function(a) {
              try {
                return a = z(a), Vb(a), 0;
              } catch (b) {
                if ("undefined" == typeof X || "ErrnoError" !== b.name) throw b;
                return -b.Pa;
              }
            },
            f: function(a, b) {
              try {
                return a = z(a), ac(b, Wb(a));
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            r: function(a, b, c) {
              try {
                b = z(b);
                b = Y(a, b);
                if (c) if (512 === c) Vb(b);
                else return -28;
                else ta(b);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            q: function(a, b, c) {
              try {
                b = z(b);
                b = Y(a, b, true);
                var d = Date.now(), e, g;
                if (c) {
                  var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                  1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                  c += 16;
                  h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                  q = E[c + 8 >> 2];
                  1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
                } else g = e = d;
                if (null !== (g ?? e)) {
                  a = e;
                  var w = S(b, { hb: true }).node;
                  Nb(w.La.Xa)(w, { $a: a, Ua: g });
                }
                return 0;
              } catch (u) {
                if ("undefined" == typeof X || "ErrnoError" !== u.name) throw u;
                return -u.Pa;
              }
            },
            m: () => Ka(""),
            l: () => {
              Va = false;
              Ec = 0;
            },
            A: function(a, b) {
              a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
              a = new Date(1e3 * a);
              E[b >> 2] = a.getSeconds();
              E[b + 4 >> 2] = a.getMinutes();
              E[b + 8 >> 2] = a.getHours();
              E[b + 12 >> 2] = a.getDate();
              E[b + 16 >> 2] = a.getMonth();
              E[b + 20 >> 2] = a.getFullYear() - 1900;
              E[b + 24 >> 2] = a.getDay();
              var c = a.getFullYear();
              E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Gc : Fc)[a.getMonth()] + a.getDate() - 1 | 0;
              E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
              c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
              var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
              E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
            },
            y: function(a, b, c, d, e, g, h) {
              e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
              try {
                var q = T(d);
                if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155)) throw new N(2);
                if (1 === (q.flags & 2097155)) throw new N(2);
                if (!q.Ma.sb) throw new N(43);
                if (!a) throw new N(28);
                var w = q.Ma.sb(q, a, e, b, c);
                var u = w.tc;
                E[g >> 2] = w.Ub;
                F[h >> 2] = u;
                return 0;
              } catch (x) {
                if ("undefined" == typeof X || "ErrnoError" !== x.name) throw x;
                return -x.Pa;
              }
            },
            z: function(a, b, c, d, e, g) {
              g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
              try {
                var h = T(e);
                if (c & 2) {
                  if (32768 !== (h.node.mode & 61440)) throw new N(43);
                  d & 2 || h.Ma.tb && h.Ma.tb(h, C.slice(a, a + b), g, b, d);
                }
              } catch (q) {
                if ("undefined" == typeof X || "ErrnoError" !== q.name) throw q;
                return -q.Pa;
              }
            },
            n: (a, b) => {
              Hc[a] && (clearTimeout(Hc[a].id), delete Hc[a]);
              if (!b) return 0;
              var c = setTimeout(() => {
                delete Hc[a];
                Kc(() => Uc(a, performance.now()));
              }, b);
              Hc[a] = { id: c, Hc: b };
              return 0;
            },
            B: (a, b, c, d) => {
              var e = (/* @__PURE__ */ new Date()).getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
              e = new Date(e, 6, 1).getTimezoneOffset();
              F[a >> 2] = 60 * Math.max(g, e);
              E[b >> 2] = Number(g != e);
              b = (h) => {
                var q = Math.abs(h);
                return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
              };
              a = b(g);
              b = b(e);
              e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
            },
            d: () => Date.now(),
            s: () => 2147483648,
            c: () => performance.now(),
            o: (a) => {
              var b = C.length;
              a >>>= 0;
              if (2147483648 < a) return false;
              for (var c = 1; 4 >= c; c *= 2) {
                var d = b * (1 + 0.2 / c);
                d = Math.min(d, a + 100663296);
                a: {
                  d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - Ja.buffer.byteLength + 65535) / 65536 | 0;
                  try {
                    Ja.grow(d);
                    Ia();
                    var e = 1;
                    break a;
                  } catch (g) {
                  }
                  e = void 0;
                }
                if (e) return true;
              }
              return false;
            },
            E: (a, b) => {
              var c = 0, d = 0, e;
              for (e of Nc()) {
                var g = b + c;
                F[a + d >> 2] = g;
                c += M(e, C, g, Infinity) + 1;
                d += 4;
              }
              return 0;
            },
            F: (a, b) => {
              var c = Nc();
              F[a >> 2] = c.length;
              a = 0;
              for (var d of c) a += gb(d) + 1;
              F[b >> 2] = a;
              return 0;
            },
            e: function(a) {
              try {
                var b = T(a);
                oa(b);
                return 0;
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return c.Pa;
              }
            },
            p: function(a, b) {
              try {
                var c = T(a);
                m[b] = c.Va ? 2 : P(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
                Fa[b + 2 >> 1] = 0;
                H[b + 8 >> 3] = BigInt(0);
                H[b + 16 >> 3] = BigInt(0);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return d.Pa;
              }
            },
            w: function(a, b, c, d) {
              try {
                a: {
                  var e = T(a);
                  a = b;
                  for (var g, h = b = 0; h < c; h++) {
                    var q = F[a >> 2], w = F[a + 4 >> 2];
                    a += 8;
                    var u = $b(e, m, q, w, g);
                    if (0 > u) {
                      var x = -1;
                      break a;
                    }
                    b += u;
                    if (u < w) break;
                    "undefined" != typeof g && (g += u);
                  }
                  x = b;
                }
                F[d >> 2] = x;
                return 0;
              } catch (D) {
                if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
                return D.Pa;
              }
            },
            D: function(a, b, c, d) {
              b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
              try {
                if (isNaN(b)) return 61;
                var e = T(a);
                Zb(e, b, c);
                H[d >> 3] = BigInt(e.position);
                e.Eb && 0 === b && 0 === c && (e.Eb = null);
                return 0;
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return g.Pa;
              }
            },
            I: function(a) {
              try {
                var b = T(a);
                return b.Ma?.lb?.(b);
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return c.Pa;
              }
            },
            t: function(a, b, c, d) {
              try {
                a: {
                  var e = T(a);
                  a = b;
                  for (var g, h = b = 0; h < c; h++) {
                    var q = F[a >> 2], w = F[a + 4 >> 2];
                    a += 8;
                    var u = na(e, m, q, w, g);
                    if (0 > u) {
                      var x = -1;
                      break a;
                    }
                    b += u;
                    if (u < w) break;
                    "undefined" != typeof g && (g += u);
                  }
                  x = b;
                }
                F[d >> 2] = x;
                return 0;
              } catch (D) {
                if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
                return D.Pa;
              }
            },
            k: Jc
          };
          function Wc() {
            function a() {
              k.calledRun = true;
              if (!Da) {
                if (!k.noFSInit && !Db) {
                  var b, c;
                  Db = true;
                  b ??= k.stdin;
                  c ??= k.stdout;
                  d ??= k.stderr;
                  b ? W("stdin", b) : Ub("/dev/tty", "/dev/stdin");
                  c ? W("stdout", null, c) : Ub("/dev/tty", "/dev/stdout");
                  d ? W("stderr", null, d) : Ub("/dev/tty1", "/dev/stderr");
                  ma("/dev/stdin", 0);
                  ma("/dev/stdout", 1);
                  ma("/dev/stderr", 1);
                }
                Xc.N();
                Eb = false;
                k.onRuntimeInitialized?.();
                if (k.postRun) for ("function" == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
                  var d = k.postRun.shift();
                  Ra.push(d);
                }
                Qa(Ra);
              }
            }
            if (0 < K) Ua = Wc;
            else {
              if (k.preRun) for ("function" == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) Ta();
              Qa(Sa);
              0 < K ? Ua = Wc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
                setTimeout(() => k.setStatus(""), 1);
                a();
              }, 1)) : a();
            }
          }
          var Xc;
          (async function() {
            function a(c) {
              c = Xc = c.exports;
              k._sqlite3_free = c.P;
              k._sqlite3_value_text = c.Q;
              k._sqlite3_prepare_v2 = c.R;
              k._sqlite3_step = c.S;
              k._sqlite3_reset = c.T;
              k._sqlite3_exec = c.U;
              k._sqlite3_finalize = c.V;
              k._sqlite3_column_name = c.W;
              k._sqlite3_column_text = c.X;
              k._sqlite3_column_type = c.Y;
              k._sqlite3_errmsg = c.Z;
              k._sqlite3_clear_bindings = c._;
              k._sqlite3_value_blob = c.$;
              k._sqlite3_value_bytes = c.aa;
              k._sqlite3_value_double = c.ba;
              k._sqlite3_value_int = c.ca;
              k._sqlite3_value_type = c.da;
              k._sqlite3_result_blob = c.ea;
              k._sqlite3_result_double = c.fa;
              k._sqlite3_result_error = c.ga;
              k._sqlite3_result_int = c.ha;
              k._sqlite3_result_int64 = c.ia;
              k._sqlite3_result_null = c.ja;
              k._sqlite3_result_text = c.ka;
              k._sqlite3_aggregate_context = c.la;
              k._sqlite3_column_count = c.ma;
              k._sqlite3_data_count = c.na;
              k._sqlite3_column_blob = c.oa;
              k._sqlite3_column_bytes = c.pa;
              k._sqlite3_column_double = c.qa;
              k._sqlite3_bind_blob = c.ra;
              k._sqlite3_bind_double = c.sa;
              k._sqlite3_bind_int = c.ta;
              k._sqlite3_bind_text = c.ua;
              k._sqlite3_bind_parameter_index = c.va;
              k._sqlite3_sql = c.wa;
              k._sqlite3_normalized_sql = c.xa;
              k._sqlite3_changes = c.ya;
              k._sqlite3_close_v2 = c.za;
              k._sqlite3_create_function_v2 = c.Aa;
              k._sqlite3_update_hook = c.Ba;
              k._sqlite3_open = c.Ca;
              ca = k._malloc = c.Da;
              da = k._free = c.Ea;
              k._RegisterExtensionFunctions = c.Fa;
              yb = c.Ga;
              Uc = c.Ha;
              ra = c.Ia;
              y = c.Ja;
              pa = c.Ka;
              Ja = c.M;
              Z = c.O;
              Ia();
              K--;
              k.monitorRunDependencies?.(K);
              0 == K && Ua && (c = Ua, Ua = null, c());
              return Xc;
            }
            K++;
            k.monitorRunDependencies?.(K);
            var b = { a: Vc };
            if (k.instantiateWasm) return new Promise((c) => {
              k.instantiateWasm(b, (d, e) => {
                c(a(d, e));
              });
            });
            La ??= k.locateFile ? k.locateFile("sql-wasm-browser.wasm", ya) : ya + "sql-wasm-browser.wasm";
            return a((await Oa(b)).instance);
          })();
          Wc();
          return Module;
        });
        return initSqlJsPromise;
      };
      if (typeof exports === "object" && typeof module === "object") {
        module.exports = initSqlJs;
        module.exports.default = initSqlJs;
      } else if (typeof define === "function" && define["amd"]) {
        define([], function() {
          return initSqlJs;
        });
      } else if (typeof exports === "object") {
        exports["Module"] = initSqlJs;
      }
    }
  });

  // node_modules/@litertjs/wasm-utils/dist/index.js
  async function runScript(scriptUrl) {
    if (typeof importScripts === "function") {
      importScripts(scriptUrl.toString());
    } else {
      const script = document.createElement("script");
      script.src = scriptUrl.toString();
      script.crossOrigin = "anonymous";
      return new Promise((resolve, revoke) => {
        script.addEventListener("load", () => {
          resolve();
        }, false);
        script.addEventListener("error", (e) => {
          revoke(e);
        }, false);
        document.body.appendChild(script);
      });
    }
  }
  var createWasmLib;
  var init_dist = __esm({
    "node_modules/@litertjs/wasm-utils/dist/index.js"() {
      createWasmLib = async (constructorFcn, wasmLoaderScript, assetLoaderScript, glCanvas, fileLocator) => {
        if (wasmLoaderScript) {
          await runScript(wasmLoaderScript);
        }
        if (!self.ModuleFactory) {
          throw new Error("ModuleFactory not set.");
        }
        if (assetLoaderScript) {
          await runScript(assetLoaderScript);
          if (!self.ModuleFactory) {
            throw new Error("ModuleFactory not set.");
          }
        }
        if (self.Module && fileLocator) {
          const moduleFileLocator = self.Module;
          moduleFileLocator.locateFile = fileLocator.locateFile;
          if (fileLocator.mainScriptUrlOrBlob) {
            moduleFileLocator.mainScriptUrlOrBlob = fileLocator.mainScriptUrlOrBlob;
          }
        }
        const module = await self.ModuleFactory(self.Module || fileLocator);
        self.ModuleFactory = self.Module = void 0;
        return new constructorFcn(module, glCanvas);
      };
    }
  });

  // node_modules/@litertjs/core/dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    CompiledModel: () => CompiledModel,
    Environment: () => Environment,
    LiteRt: () => LiteRt,
    LiteRtNotLoadedError: () => LiteRtNotLoadedError,
    Tensor: () => Tensor,
    TensorBufferType: () => TensorBufferType,
    getDefaultEnvironment: () => getDefaultEnvironment,
    getGlobalLiteRt: () => getGlobalLiteRt,
    getGlobalLiteRtPromise: () => getGlobalLiteRtPromise,
    getWebGpuDevice: () => getWebGpuDevice,
    isWebGPUSupported: () => isWebGPUSupported,
    loadAndCompile: () => loadAndCompile,
    loadLiteRt: () => loadLiteRt,
    loadModelAndWeights: () => loadModelAndWeights,
    setWebGpuDevice: () => setWebGpuDevice,
    supportsFeature: () => supportsFeature,
    unloadLiteRt: () => unloadLiteRt
  });
  function getDataType(val) {
    for (const dataTypeMapping of DATATYPES) {
      if (dataTypeMapping.dtype === val || dataTypeMapping.typedArrayConstructor === val || val instanceof dataTypeMapping.typedArrayConstructor || dataTypeMapping.elementType === val) {
        return dataTypeMapping;
      }
    }
    if (typeof val === "string") {
      throw new Error(`DType ${val} is not supported.`);
    } else if (val instanceof Object) {
      throw new Error(`Typed array ${"name" in val ? val.name : val.constructor.name} is not supported.`);
    } else {
      throw new Error(
        `Element type ${ElementTypeName[val] ?? val} is not supported.`
      );
    }
  }
  function getGlobalLiteRt() {
    if (!globalLiteRt) {
      throw new LiteRtNotLoadedError();
    }
    return globalLiteRt;
  }
  function hasGlobalLiteRt() {
    return Boolean(globalLiteRt);
  }
  function setGlobalLiteRt(liteRt) {
    globalLiteRt = liteRt;
  }
  function getGlobalLiteRtPromise() {
    return globalLiteRtPromise;
  }
  function hasGlobalLiteRtPromise() {
    return Boolean(globalLiteRtPromise);
  }
  function setGlobalLiteRtPromise(promise) {
    globalLiteRtPromise = promise;
  }
  async function createDefaultWebGpuDevice() {
    const adapterDescriptor = {
      powerPreference: "high-performance"
    };
    const adapter = await navigator.gpu.requestAdapter(adapterDescriptor);
    if (!adapter) {
      throw new Error("No GPU adapter found.");
    }
    const requiredLimits = {
      maxBufferSize: adapter.limits.maxBufferSize,
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxStorageBuffersPerShaderStage: adapter.limits.maxStorageBuffersPerShaderStage,
      maxTextureDimension2D: adapter.limits.maxTextureDimension2D
    };
    const requiredFeatures = [];
    for (const feature of DESIRED_WEBGPU_FEATURES) {
      if (adapter.features.has(feature)) {
        requiredFeatures.push(feature);
      }
    }
    return await adapter.requestDevice({
      requiredFeatures,
      requiredLimits
    });
  }
  function emscriptenVectorToArray(vector) {
    const array = new Array(vector.size());
    for (let i = 0; i < vector.size(); ++i) {
      array[i] = vector.get(i);
    }
    vector.delete();
    return array;
  }
  function fillEmscriptenVector(data, vector) {
    for (const item of data) {
      vector.push_back(item);
    }
  }
  function parseData(remainingArgs) {
    const data = remainingArgs.shift();
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    if (data instanceof liteRtWasm.LiteRtTensorBuffer) {
      return { liteRtTensorBuffer: data };
    } else if (ArrayBuffer.isView(data)) {
      return { typedArray: data };
    } else if (data instanceof GPUBuffer) {
      return { gpuBuffer: data };
    } else {
      throw new Error(
        `Unknown type (${data?.constructor.name ?? data}) provided to create a Tensor`
      );
    }
  }
  function parseShape(remainingArgs) {
    if (Array.isArray(remainingArgs[0]) || remainingArgs[0] instanceof Int32Array) {
      return { shape: remainingArgs.shift() };
    } else {
      return {};
    }
  }
  function shiftUntilDefined(remainingArgs) {
    while (remainingArgs.length > 0 && remainingArgs[0] === void 0) {
      remainingArgs.shift();
    }
  }
  function parseDataType(remainingArgs) {
    shiftUntilDefined(remainingArgs);
    if (typeof remainingArgs[0] === "string") {
      const dtype = remainingArgs.shift();
      return { dataType: getDataType(dtype).dtype };
    } else {
      return {};
    }
  }
  function parseEnvironment(remainingArgs) {
    shiftUntilDefined(remainingArgs);
    if (remainingArgs[0] instanceof Environment) {
      return { environment: remainingArgs.shift() };
    } else {
      return {};
    }
  }
  function parseOnDelete(remainingArgs) {
    shiftUntilDefined(remainingArgs);
    if (remainingArgs[0] instanceof Function) {
      return { onDelete: remainingArgs.shift() };
    } else {
      return {};
    }
  }
  function parseArgs(args) {
    return {
      ...parseData(args),
      ...parseShape(args),
      ...parseDataType(args),
      ...parseEnvironment(args),
      ...parseOnDelete(args)
    };
  }
  function liteRtTensorBufferToTensorType(liteRtTensorBuffer) {
    const liteRtRankedTensorType = liteRtTensorBuffer.tensorType();
    const elementType = liteRtRankedTensorType.elementType();
    const liteRtLayout = liteRtRankedTensorType.layout();
    const dimensions = liteRtLayout.dimensions();
    liteRtLayout.delete();
    liteRtRankedTensorType.delete();
    return {
      dtype: getDataType(elementType.value).dtype,
      layout: { dimensions: emscriptenVectorToArray(dimensions) }
    };
  }
  function webGpuBufferToLiteRtTensorBuffer(gpuBuffer, shape, dtype, environment) {
    const globalLiteRt2 = getGlobalLiteRt();
    const liteRtWasm = globalLiteRt2.liteRtWasm;
    const dimensionsVector = new liteRtWasm.VectorInt32();
    fillEmscriptenVector(shape, dimensionsVector);
    const layout = liteRtWasm.LiteRtLayout.create(dimensionsVector);
    dimensionsVector.delete();
    const rankedTensorType = liteRtWasm.LiteRtRankedTensorType.create(
      { value: getDataType(dtype).elementType },
      layout
    );
    layout.delete();
    const importedGpuBufferPtr = liteRtWasm.WebGPU.importJsBuffer(gpuBuffer);
    const liteRtTensorBuffer = liteRtWasm.LiteRtTensorBuffer.createFromWebGpuBuffer(
      environment.liteRtEnvironment,
      rankedTensorType,
      liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_PACKED,
      importedGpuBufferPtr,
      gpuBuffer.size
    );
    rankedTensorType.delete();
    return [liteRtTensorBuffer, importedGpuBufferPtr];
  }
  function typedArrayToLiteRtTensorBuffer(data, shape, environment) {
    const globalLiteRt2 = getGlobalLiteRt();
    const liteRtWasm = globalLiteRt2.liteRtWasm;
    environment = environment ?? globalLiteRt2.getDefaultEnvironment();
    const elementType = getDataType(data).elementType;
    const dimensionsVector = new liteRtWasm.VectorInt32();
    fillEmscriptenVector(shape ?? [data.length], dimensionsVector);
    const layout = liteRtWasm.LiteRtLayout.create(dimensionsVector);
    dimensionsVector.delete();
    const expectedNumElements = layout.numElements();
    if (data.length !== expectedNumElements) {
      layout.delete();
      throw new Error(
        `Number of elements ${data.length} of the provided TypedArray does not match the expected number of elements ${expectedNumElements}.`
      );
    }
    const rankedTensorType = liteRtWasm.LiteRtRankedTensorType.create(
      { value: elementType },
      layout
    );
    layout.delete();
    const arrayType = data.constructor;
    const bufferSize = arrayType.BYTES_PER_ELEMENT * data.length;
    const expectedBufferSize = rankedTensorType.bytes();
    if (bufferSize !== expectedBufferSize) {
      rankedTensorType.delete();
      throw new Error(
        `Byte length ${bufferSize} of the provided TypedArray does not match the expected buffer size ${expectedBufferSize}.`
      );
    }
    const liteRtTensorBuffer = liteRtWasm.LiteRtTensorBuffer.createManaged(
      environment.liteRtEnvironment,
      liteRtWasm.LiteRtTensorBufferType.HOST_MEMORY,
      rankedTensorType,
      bufferSize
    );
    rankedTensorType.delete();
    const dataPtr = liteRtTensorBuffer.lock(
      liteRtWasm.LiteRtTensorBufferLockMode.WRITE
    );
    try {
      const uint8Data = new Uint8Array(
        data.buffer,
        data.byteOffset,
        data.byteLength
      );
      liteRtWasm.HEAPU8.set(uint8Data, dataPtr);
    } finally {
      liteRtTensorBuffer.unlock();
    }
    return liteRtTensorBuffer;
  }
  function makeTensorDetails(name, index, tensorType, requirements) {
    const layout = tensorType.layout();
    const dimensions = emscriptenVectorToArray(layout.dimensions());
    layout.delete();
    const supportedBufferTypes = new Set(emscriptenVectorToArray(requirements.supportedTypes()).map(({ value }) => value));
    const details = {
      name,
      index,
      dtype: getDataType(tensorType.elementType().value).dtype,
      shape: new Int32Array(dimensions),
      supportedBufferTypes
    };
    tensorType.delete();
    requirements.delete();
    return details;
  }
  async function urlToUint8Array(url) {
    const response = await fetch(url);
    return new Uint8Array(await response.arrayBuffer());
  }
  async function readableStreamDefaultReaderToUint8Array(reader) {
    let byteOffset = 0;
    let array = new Uint8Array(
      1024
      /* arbitrary starting size */
    );
    const MAX_ARRAY_SIZE = 2e9;
    while (true) {
      const { done, value } = await reader.read();
      if (value) {
        if (array.byteLength < byteOffset + value.byteLength) {
          if (byteOffset + value.byteLength > MAX_ARRAY_SIZE) {
            throw new Error(`Model is too large (> ${MAX_ARRAY_SIZE} bytes).`);
          }
          const newArray = new Uint8Array(Math.min(
            MAX_ARRAY_SIZE,
            Math.max(array.byteLength, value.byteLength) * 2
          ));
          newArray.set(array);
          array = newArray;
        }
        array.set(value, byteOffset);
        byteOffset += value.byteLength;
      }
      if (done) {
        break;
      }
    }
    return array.slice(0, byteOffset);
  }
  function fillCompileOptions(compileOptions = {}, environment, defaultThreadCount) {
    return {
      environment,
      accelerator: compileOptions.accelerator ?? (environment.webGpuDevice ? "webgpu" : "wasm"),
      cpuOptions: compileOptions.cpuOptions ?? { numThreads: defaultThreadCount },
      gpuOptions: compileOptions.gpuOptions ?? {},
      webNNOptions: compileOptions.webNNOptions ?? {}
    };
  }
  function isJspiSupported() {
    return "Suspending" in WebAssembly;
  }
  function isWebNnSupported() {
    return typeof navigator !== "undefined" && !!navigator.ml;
  }
  async function tryWasm(wasm) {
    try {
      await WebAssembly.instantiate(wasm);
      return { supported: true };
    } catch (e) {
      return { supported: false, error: e };
    }
  }
  async function supportsFeature(feature) {
    const check = WASM_FEATURE_CHECKS[feature]?.();
    if (!check) {
      throw new Error(`Unknown feature: ${feature}`);
    }
    return (await check).supported;
  }
  async function throwIfFeatureNotSupported(feature) {
    const check = WASM_FEATURE_CHECKS[feature]?.();
    if (!check) {
      throw new Error(`Unknown feature: ${feature}`);
    }
    const result = await check;
    if (!result.supported) {
      throw result.error;
    }
  }
  function isWebGPUSupported() {
    return !!(typeof globalThis !== "undefined" && globalThis.navigator && globalThis.navigator.gpu);
  }
  function getDefaultEnvironment() {
    return getGlobalLiteRt().getDefaultEnvironment();
  }
  function loadAndCompile(model, compileOptions) {
    return getGlobalLiteRt().loadAndCompile(model, compileOptions);
  }
  function getWebGpuDevice() {
    return getGlobalLiteRt().getWebGpuDevice();
  }
  function setWebGpuDevice(device) {
    getGlobalLiteRt().setWebGpuDevice(device);
  }
  function pathToString(path) {
    return path;
  }
  function appendPathSegment(path, segment) {
    if (!path) return segment;
    if (!segment) return path;
    const pathWithSlash = path.endsWith("/") ? path : path + "/";
    const segmentWithoutSlash = segment.startsWith("/") ? segment.substring(1) : segment;
    return pathWithSlash + segmentWithoutSlash;
  }
  async function load(path, options) {
    const pathString = pathToString(path);
    const isFullFilePath = pathString.endsWith(".wasm") || pathString.endsWith(".js");
    const relaxedSimd = await supportsFeature("relaxedSimd");
    if (options?.threads) {
      if (options?.jspi) {
        throw new Error(
          "The `threads` and `jspi` options are mutually exclusive."
        );
      }
      if (isFullFilePath) {
        console.warn(
          `The \`threads\` option was specified, but the wasm path ${pathString} is a full file path. Whether threads are available or not will depend on the loaded file. To allow LiteRT.js to load the threaded wasm file, use a directory path instead of a full file path.`
        );
      }
      if (!relaxedSimd) {
        throw new Error(
          "Threads are only supported with relaxed SIMD, and the current browser does not support relaxed SIMD."
        );
      }
      await throwIfFeatureNotSupported("threads");
    }
    if (options?.jspi) {
      if (isFullFilePath) {
        console.warn(
          `The \`jspi\` option was specified, but the wasm path ${pathString} is a full file path. Whether JSPI is available or not will depend on the loaded file. To allow LiteRT.js to load the JSPI wasm file, use a directory path instead of a full file path.`
        );
      }
      await throwIfFeatureNotSupported("jspi");
    }
    let fileName = WASM_JS_COMPAT_FILE_NAME;
    if (relaxedSimd) {
      if (options?.threads) {
        fileName = WASM_JS_THREADED_FILE_NAME;
      } else if (options?.jspi) {
        fileName = WASM_JS_JSPI_FILE_NAME;
      } else {
        fileName = WASM_JS_FILE_NAME;
      }
    }
    let jsFilePath = path;
    if (pathString.endsWith(".wasm")) {
      throw new Error(
        "Please load the `.js` file corresponding to the `.wasm` file, or load the directory containing it."
      );
    } else if (!pathString.endsWith(".js")) {
      jsFilePath = appendPathSegment(path, fileName);
    }
    return createWasmLib(LiteRt, jsFilePath);
  }
  function loadLiteRt(path, options) {
    if (hasGlobalLiteRtPromise()) {
      throw new Error("LiteRT is already loading / loaded.");
    }
    setGlobalLiteRtPromise(load(path, options).then(async (liteRt) => {
      setGlobalLiteRt(liteRt);
      liteRt.setDefaultEnvironment(
        await Environment.create()
      );
      return liteRt;
    }).catch((error) => {
      setGlobalLiteRtPromise(void 0);
      throw error;
    }));
    return getGlobalLiteRtPromise();
  }
  function unloadLiteRt() {
    if (hasGlobalLiteRtPromise() && !hasGlobalLiteRt()) {
      throw new Error(
        "LiteRT is loading and can not be unloaded or canceled until it is finished loading."
      );
    }
    if (hasGlobalLiteRt()) {
      getGlobalLiteRt().delete();
      setGlobalLiteRt(void 0);
    }
    setGlobalLiteRtPromise(void 0);
  }
  async function loadModelAndWeights(modelData, weightsStream, compileOptions = {}) {
    const liteRt = getGlobalLiteRt();
    const wasm = liteRt.liteRtWasm;
    const env = compileOptions.environment ?? liteRt.getDefaultEnvironment();
    if (!env.webGpuDevice) {
      throw new Error(
        "WebGPU device is required for streamed loading in this implementation."
      );
    }
    const myTurn = compilationLock;
    let resolveLock;
    compilationLock = new Promise((resolve) => {
      resolveLock = resolve;
    });
    await myTurn;
    try {
      wasm.registerStreamWeightsCallback(async (tflIds, wgpuBufferIds, offsets, lengths) => {
        const requests = [];
        if (tflIds.length !== wgpuBufferIds.length) {
          throw new Error(
            `Stream weights callback received arrays of different lengths: tflIds=${tflIds.length}, wgpuBufferIds=${wgpuBufferIds.length}, `
          );
        }
        for (let i = 0; i < tflIds.length; i++) {
          requests.push({
            id: tflIds[i],
            wgpuBufferId: wgpuBufferIds[i],
            offset: offsets[i],
            length: lengths[i]
          });
        }
        requests.sort((a, b) => a.offset - b.offset);
        console.log(`[StreamWeights] Starting loading session for ${requests.length} tensors:`, JSON.stringify(requests));
        const reader = weightsStream.getReader();
        let streamOffset = 0;
        let buffer = new Uint8Array(0);
        let reqIndex = 0;
        try {
          while (reqIndex < requests.length) {
            const req = requests[reqIndex];
            const relStart = req.offset - streamOffset;
            const relEnd = relStart + req.length;
            if (relEnd <= buffer.length) {
              if (relStart < 0) {
                throw new Error(
                  `Stream logic error: weight starts before current buffer (req.offset=${req.offset}, streamOffset=${streamOffset}).`
                );
              }
              let weightData = buffer.subarray(relStart, relEnd);
              if (weightData.byteLength % 4 !== 0) {
                const paddedSize = weightData.byteLength + 3 & ~3;
                const paddedData = new Uint8Array(paddedSize);
                paddedData.set(weightData);
                weightData = paddedData;
              }
              const gpuBuffer = wasm.WebGPU.getJsObject(req.wgpuBufferId);
              if (!gpuBuffer) {
                throw new Error(
                  `Failed to find GPUBuffer for ID: ${req.wgpuBufferId}`
                );
              }
              console.log(`[StreamWeights] Writing ${weightData.byteLength} bytes to GPUBuffer ${req.wgpuBufferId} (tflId=${req.id}, first 5 bytes=${Array.from(weightData.slice(0, 5))})`);
              env.webGpuDevice.queue.writeBuffer(gpuBuffer, 0, weightData);
              reqIndex++;
            } else {
              const { done, value } = await reader.read();
              if (done) {
                throw new Error(
                  `Stream ended before all weights were loaded.`
                );
              }
              const newBuffer = new Uint8Array(buffer.length + value.length);
              newBuffer.set(buffer);
              newBuffer.set(value, buffer.length);
              buffer = newBuffer;
            }
            if (reqIndex < requests.length) {
              const nextStartRel = requests[reqIndex].offset - streamOffset;
              const bytesToDiscard = Math.min(nextStartRel, buffer.length);
              if (bytesToDiscard > 1024 * 1024 || bytesToDiscard === buffer.length) {
                buffer = buffer.slice(bytesToDiscard);
                streamOffset += bytesToDiscard;
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      });
      try {
        const ptr = wasm._malloc(modelData.byteLength);
        wasm.HEAPU8.set(modelData, ptr);
        const wasmModel = wasm.loadModel(env.liteRtEnvironment, ptr, modelData.byteLength);
        const loadedModel2 = new Model(wasmModel, () => {
          wasm._free(ptr);
        });
        const fullOptions = fillCompileOptions(
          compileOptions,
          env,
          wasm.getThreadCount()
        );
        const wasmCompiledModel = await wasm.compileModel(
          env.liteRtEnvironment,
          wasmModel,
          fullOptions
        );
        const compiledModel = new CompiledModel(
          loadedModel2,
          wasmCompiledModel,
          fullOptions,
          () => {
            liteRt._unregisterObjectForDeletion(compiledModel);
          }
        );
        liteRt._registerObjectForDeletion(compiledModel);
        return compiledModel;
      } finally {
        wasm.registerStreamWeightsCallback(void 0);
      }
    } finally {
      resolveLock();
    }
  }
  async function copyHostMemoryToHostMemory(cpuTensor, options = {}) {
    const environment = options.environment ?? cpuTensor.environment;
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    const srcTensorBuffer = cpuTensor.liteRtTensorBuffer;
    const bufferType = srcTensorBuffer.bufferType();
    if (bufferType.value !== TensorBufferType.HOST_MEMORY) {
      throw new Error(
        "Source tensor is not in host memory. Cannot copy to host memory."
      );
    }
    const srcTensorMemoryPtr = srcTensorBuffer.lock(
      liteRtWasm.LiteRtTensorBufferLockMode.READ
    );
    let destTensorBuffer;
    try {
      destTensorBuffer = liteRtWasm.LiteRtTensorBuffer.createManaged(
        environment.liteRtEnvironment,
        liteRtWasm.LiteRtTensorBufferType.HOST_MEMORY,
        srcTensorBuffer.tensorType(),
        srcTensorBuffer.size()
      );
      const destMemoryPointer = destTensorBuffer.lock(
        liteRtWasm.LiteRtTensorBufferLockMode.WRITE
      );
      try {
        const srcTensorMemoryView = new Uint8Array(
          liteRtWasm.HEAPU8.buffer,
          srcTensorMemoryPtr,
          srcTensorBuffer.size()
        );
        liteRtWasm.HEAPU8.set(srcTensorMemoryView, destMemoryPointer);
      } finally {
        destTensorBuffer.unlock();
      }
    } finally {
      srcTensorBuffer.unlock();
    }
    if (!destTensorBuffer) {
      throw new Error("Failed to create destination tensor buffer.");
    }
    return new Tensor(destTensorBuffer, environment);
  }
  async function cpuTensorToGpuTensor(cpuTensor, options = {}) {
    const environment = options.environment ?? cpuTensor.environment;
    const device = environment.webGpuDevice;
    if (!device) {
      throw new Error(
        "No WebGPU device is available. Did you forget to pass a destination environment that has a WebGPU device?"
      );
    }
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    const byteLength = cpuTensor.liteRtTensorBuffer.size();
    const paddedByteLength = byteLength + 3 & ~3;
    const stagingBuffer = device.createBuffer({
      size: paddedByteLength,
      usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true
    });
    const mappedBuffer = await stagingBuffer.getMappedRange();
    const mappedArray = new Uint8Array(mappedBuffer);
    const cpuMemoryPtr = cpuTensor.liteRtTensorBuffer.lock(
      liteRtWasm.LiteRtTensorBufferLockMode.READ
    );
    try {
      const cpuMemoryView = new Uint8Array(
        liteRtWasm.HEAPU8.buffer,
        cpuMemoryPtr,
        cpuTensor.liteRtTensorBuffer.size()
      );
      mappedArray.set(cpuMemoryView);
    } finally {
      cpuTensor.liteRtTensorBuffer.unlock();
    }
    stagingBuffer.unmap();
    const buffer = device.createBuffer({
      size: paddedByteLength,
      usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
    });
    const commandEncoder = device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(
      stagingBuffer,
      0,
      buffer,
      0,
      paddedByteLength
    );
    device.queue.submit([commandEncoder.finish()]);
    stagingBuffer.destroy();
    return new Tensor(
      buffer,
      cpuTensor.type.layout.dimensions,
      cpuTensor.type.dtype,
      environment,
      () => {
        buffer.destroy();
      }
    );
  }
  async function gpuTensorToCpuTensor(gpuTensor, options = {}) {
    const environment = options.environment ?? gpuTensor.environment;
    const device = gpuTensor.environment.webGpuDevice;
    if (!device) {
      throw new Error(
        "No WebGPU device is available. Does the source tensor have a WebGPU device?"
      );
    }
    const liteRtWasm = getGlobalLiteRt().liteRtWasm;
    const tensorBuffer = gpuTensor.liteRtTensorBuffer;
    const bufferType = tensorBuffer.bufferType();
    if (bufferType !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_PACKED) {
      throw new Error(`Cannot convert a tensor with a non-WebGPU buffer type ${bufferType} to a CPU tensor.`);
    }
    const gpuBuffer = liteRtWasm.WebGPU.getJsObject(
      tensorBuffer.getWebGpuBuffer()
    );
    const byteOffset = tensorBuffer.offset();
    const tensorType = tensorBuffer.tensorType();
    const layout = tensorType.layout();
    const numElements = layout.numElements();
    const arrayConstructor = getDataType(tensorType.elementType().value).typedArrayConstructor;
    layout.delete();
    tensorType.delete();
    let mappableBuffer = gpuBuffer;
    let cleanupBuffer = () => {
    };
    if (!(gpuBuffer.usage & GPUBufferUsage.MAP_READ)) {
      mappableBuffer = device.createBuffer({
        size: gpuBuffer.size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
      });
      cleanupBuffer = () => {
        mappableBuffer.destroy();
      };
      const commandEncoder = device.createCommandEncoder();
      commandEncoder.copyBufferToBuffer(
        gpuBuffer,
        0,
        mappableBuffer,
        0,
        gpuBuffer.size
      );
      device.queue.submit([commandEncoder.finish()]);
    }
    await mappableBuffer.mapAsync(GPUMapMode.READ);
    const mappedBuffer = mappableBuffer.getMappedRange();
    const mappedArray = new arrayConstructor(mappedBuffer, byteOffset, numElements);
    const cpuTensor = new Tensor(mappedArray, gpuTensor.type.layout.dimensions, environment);
    mappableBuffer.unmap();
    cleanupBuffer();
    return cpuTensor;
  }
  function makeMoveTo(copyTo) {
    return async (tensor, options) => {
      const result = await copyTo(tensor, options);
      tensor.delete();
      return result;
    };
  }
  function registerCopyFunctions() {
    Tensor.copyFunctions.set(TensorBufferType.HOST_MEMORY, /* @__PURE__ */ new Map([
      [
        TensorBufferType.HOST_MEMORY,
        {
          copyTo: copyHostMemoryToHostMemory,
          // There might be a more efficient way to move
          // from CPU to CPU.
          moveTo: makeMoveTo(copyHostMemoryToHostMemory)
        }
      ],
      [
        TensorBufferType.WEB_GPU_BUFFER_PACKED,
        {
          copyTo: cpuTensorToGpuTensor,
          moveTo: makeMoveTo(cpuTensorToGpuTensor)
        }
      ]
    ]));
    Tensor.copyFunctions.set(TensorBufferType.WEB_GPU_BUFFER_PACKED, /* @__PURE__ */ new Map([
      [
        TensorBufferType.HOST_MEMORY,
        {
          copyTo: gpuTensorToCpuTensor,
          moveTo: makeMoveTo(gpuTensorToCpuTensor)
        }
      ]
    ]));
  }
  var ElementType, ElementTypeName, TensorBufferType, TensorBufferTypeName, DATATYPES, LiteRtNotLoadedError, globalLiteRt, globalLiteRtPromise, AcceleratorDefaultTensorBufferType, TensorBufferTypeToAccelerator, DESIRED_WEBGPU_FEATURES, Environment, Tensor, CompiledModelSignatureRunner, CompiledModel, Model, WASM_RELAXED_SIMD_CHECK, WASM_THREADS_CHECK, WASM_FEATURE_VALUES, WASM_FEATURE_CHECKS, LiteRt, WASM_JS_FILE_NAME, WASM_JS_COMPAT_FILE_NAME, WASM_JS_THREADED_FILE_NAME, WASM_JS_JSPI_FILE_NAME, compilationLock;
  var init_dist2 = __esm({
    "node_modules/@litertjs/core/dist/index.js"() {
      init_dist();
      ElementType = {
        NONE: 0,
        FLOAT32: 1,
        INT32: 2,
        UINT8: 3,
        INT64: 4,
        STRING: 5,
        BOOL: 6,
        INT16: 7,
        COMPLEX64: 8,
        INT8: 9,
        FLOAT16: 10,
        FLOAT64: 11,
        COMPLEX128: 12,
        UINT64: 13,
        RESOURCE: 14,
        VARIANT: 15,
        UINT32: 16,
        UINT16: 17,
        INT4: 18,
        BFLOAT16: 19
      };
      ElementTypeName = {
        [ElementType.NONE]: "NONE",
        [ElementType.FLOAT32]: "FLOAT32",
        [ElementType.INT32]: "INT32",
        [ElementType.UINT8]: "UINT8",
        [ElementType.INT64]: "INT64",
        [ElementType.STRING]: "STRING",
        [ElementType.BOOL]: "BOOL",
        [ElementType.INT16]: "INT16",
        [ElementType.COMPLEX64]: "COMPLEX64",
        [ElementType.INT8]: "INT8",
        [ElementType.FLOAT16]: "FLOAT16",
        [ElementType.FLOAT64]: "FLOAT64",
        [ElementType.COMPLEX128]: "COMPLEX128",
        [ElementType.UINT64]: "UINT64",
        [ElementType.RESOURCE]: "RESOURCE",
        [ElementType.VARIANT]: "VARIANT",
        [ElementType.UINT32]: "UINT32",
        [ElementType.UINT16]: "UINT16",
        [ElementType.INT4]: "INT4",
        [ElementType.BFLOAT16]: "BFLOAT16"
      };
      TensorBufferType = {
        HOST_MEMORY: 1,
        WEB_GPU_BUFFER: 20,
        WEB_GPU_BUFFER_FP16: 21,
        WEB_GPU_BUFFER_PACKED: 26
      };
      TensorBufferTypeName = {
        [TensorBufferType.HOST_MEMORY]: "HOST_MEMORY",
        [TensorBufferType.WEB_GPU_BUFFER]: "WEB_GPU_BUFFER",
        [TensorBufferType.WEB_GPU_BUFFER_FP16]: "WEB_GPU_BUFFER_FP16",
        [TensorBufferType.WEB_GPU_BUFFER_PACKED]: "WEB_GPU_BUFFER_PACKED"
      };
      DATATYPES = Object.freeze([
        {
          dtype: "float32",
          typedArrayConstructor: Float32Array,
          elementType: ElementType.FLOAT32
        },
        {
          dtype: "int32",
          typedArrayConstructor: Int32Array,
          elementType: ElementType.INT32
        },
        {
          dtype: "uint8",
          typedArrayConstructor: Uint8Array,
          elementType: ElementType.UINT8
        }
      ]);
      LiteRtNotLoadedError = class extends Error {
        constructor() {
          super(
            "LiteRT is not initialized yet. Please call loadLiteRt() and wait for its promise to resolve to load the LiteRT WASM module."
          );
        }
      };
      globalLiteRt = void 0;
      globalLiteRtPromise = void 0;
      AcceleratorDefaultTensorBufferType = {
        "webgpu": TensorBufferType.WEB_GPU_BUFFER_PACKED,
        "wasm": TensorBufferType.HOST_MEMORY
      };
      TensorBufferTypeToAccelerator = {
        [TensorBufferType.HOST_MEMORY]: "wasm",
        [TensorBufferType.WEB_GPU_BUFFER]: "webgpu",
        [TensorBufferType.WEB_GPU_BUFFER_FP16]: "webgpu",
        [TensorBufferType.WEB_GPU_BUFFER_PACKED]: "webgpu"
      };
      DESIRED_WEBGPU_FEATURES = [
        "shader-f16",
        "subgroups"
      ];
      Environment = class _Environment {
        constructor(options) {
          this.options = options;
          this.liteRtEnvironment = getGlobalLiteRt().liteRtWasm.LiteRtEnvironment.create(
            options.webGpuDevice
          );
        }
        liteRtEnvironment;
        static async create(options = {}) {
          let webGpuDevice = null;
          if ("webGpuDevice" in options) {
            if (options.webGpuDevice) {
              webGpuDevice = options.webGpuDevice;
            }
          } else {
            try {
              webGpuDevice = await createDefaultWebGpuDevice();
            } catch (e) {
              console.warn("Failed to create default WebGPU device:", e);
            }
          }
          return new _Environment({
            ...options,
            webGpuDevice
          });
        }
        get webGpuDevice() {
          return this.options.webGpuDevice;
        }
        delete() {
          this.liteRtEnvironment.delete();
        }
      };
      Tensor = class _Tensor {
        liteRtTensorBuffer;
        type;
        environment;
        deletedInternal = false;
        onDelete;
        static copyFunctions = /* @__PURE__ */ new Map();
        constructor(a, b, c, d, e) {
          const {
            typedArray,
            gpuBuffer,
            liteRtTensorBuffer,
            shape,
            dataType,
            environment,
            onDelete
          } = parseArgs([a, b, c, d, e]);
          this.onDelete = onDelete;
          this.environment = environment ?? getGlobalLiteRt().getDefaultEnvironment();
          if (liteRtTensorBuffer) {
            if (shape) {
              throw new Error(
                "A LiteRtTensorBuffer cannot be provided with a shape."
              );
            }
            if (dataType) {
              throw new Error(
                "A LiteRtTensorBuffer cannot be provided with a data type."
              );
            }
            this.liteRtTensorBuffer = liteRtTensorBuffer;
          } else if (gpuBuffer) {
            if (!shape) {
              throw new Error("A GPUBuffer must be provided with a shape.");
            }
            if (!dataType) {
              throw new Error("A GPUBuffer must be provided with a data type.");
            }
            const [liteRtTensorBuffer2, webGpuBufferPtr] = webGpuBufferToLiteRtTensorBuffer(
              gpuBuffer,
              shape,
              dataType,
              this.environment
            );
            this.liteRtTensorBuffer = liteRtTensorBuffer2;
            const onDelete2 = this.onDelete;
            this.onDelete = () => {
              const liteRtWasm = getGlobalLiteRt().liteRtWasm;
              liteRtWasm.wgpuBufferRelease(webGpuBufferPtr);
              onDelete2?.();
            };
          } else if (typedArray) {
            this.liteRtTensorBuffer = typedArrayToLiteRtTensorBuffer(
              typedArray,
              shape,
              environment
            );
          } else {
            throw new Error("No data provided to create a Tensor.");
          }
          this.type = liteRtTensorBufferToTensorType(this.liteRtTensorBuffer);
        }
        static fromTypedArray(data, shape, environment) {
          return new _Tensor(data, shape, environment);
        }
        ensureNotDeleted() {
          if (this.deleted) {
            throw new Error("Tensor is deleted and cannot be used.");
          }
        }
        async data() {
          this.ensureNotDeleted();
          if (this.liteRtTensorBuffer.bufferType().value === TensorBufferType.HOST_MEMORY) {
            return this.toTypedArray();
          }
          const copy = await this.copyTo("wasm");
          const data = await copy.data();
          copy.delete();
          return data;
        }
        toTypedArray() {
          this.ensureNotDeleted();
          const liteRtWasm = getGlobalLiteRt().liteRtWasm;
          if (this.liteRtTensorBuffer.isWebGpuMemory()) {
            throw new Error(
              "Cannot convert a Tensor with WebGPU memory to a TypedArray."
            );
          }
          if (this.liteRtTensorBuffer.bufferType().value !== liteRtWasm.LiteRtTensorBufferType.HOST_MEMORY.value) {
            throw new Error(
              "Cannot convert a Tensor with non-host memory to a TypedArray."
            );
          }
          if (this.liteRtTensorBuffer.size() !== this.liteRtTensorBuffer.packedSize() || this.liteRtTensorBuffer.offset() !== 0) {
            throw new Error("Tensors with strides or padding are not yet supported.");
          }
          const rankedTensorType = this.liteRtTensorBuffer.tensorType();
          const elementType = rankedTensorType.elementType();
          const byteWidth = liteRtWasm.liteRtGetByteWidth(elementType);
          rankedTensorType.delete();
          const typedArrayConstructor = getDataType(
            elementType.value
          ).typedArrayConstructor;
          if (typedArrayConstructor.BYTES_PER_ELEMENT !== byteWidth) {
            throw new Error(
              `Byte width ${byteWidth} of the tensor's element type ${ElementTypeName[elementType.value]} does not match the expected byte width ${typedArrayConstructor.BYTES_PER_ELEMENT} of the ${typedArrayConstructor.name}.`
            );
          }
          const dataPtr = this.liteRtTensorBuffer.lock(
            getGlobalLiteRt().liteRtWasm.LiteRtTensorBufferLockMode.READ
          );
          try {
            const uint8Array = liteRtWasm.HEAPU8.slice(
              dataPtr,
              dataPtr + this.liteRtTensorBuffer.packedSize()
            );
            const typedArray = new typedArrayConstructor(
              uint8Array.buffer,
              uint8Array.byteOffset,
              uint8Array.byteLength / byteWidth
            );
            return typedArray;
          } finally {
            this.liteRtTensorBuffer.unlock();
          }
        }
        getBufferType() {
          this.ensureNotDeleted();
          return this.liteRtTensorBuffer.bufferType().value;
        }
        /**
         * Returns the underlying GPUBuffer of the Tensor.
         *
         * Note that the lifetime of the returned GPUBuffer is dependant upon how the
         * Tensor was created. If the Tensor was constructed from a GPUBuffer, then
         * the GPUBuffer will NOT be released when the Tensor is deleted. If the
         * Tensor was copied/moved to GPU from host memory, then the GPU buffer will
         * be released when the Tensor is deleted.
         *
         * The GPU buffer may be larger than the actual data in the tensor.
         *
         * @return The GPUBuffer containing the Tensor's data.
         */
        toGpuBuffer() {
          this.ensureNotDeleted();
          const liteRtWasm = getGlobalLiteRt().liteRtWasm;
          if (!this.liteRtTensorBuffer.isWebGpuMemory()) {
            throw new Error(
              "Cannot convert a Tensor with non-WebGPU memory to a GPUBuffer."
            );
          }
          const bufferTypeValue = this.liteRtTensorBuffer.bufferType().value;
          if (bufferTypeValue !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER.value && bufferTypeValue !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_FP16.value && bufferTypeValue !== liteRtWasm.LiteRtTensorBufferType.WEB_GPU_BUFFER_PACKED.value) {
            throw new Error(
              "Cannot convert a Tensor with host memory to a GPUBuffer."
            );
          }
          if (this.liteRtTensorBuffer.size() !== this.liteRtTensorBuffer.packedSize() || this.liteRtTensorBuffer.offset() !== 0) {
            throw new Error("Tensors with strides or padding are not yet supported.");
          }
          const gpuBufferId = this.liteRtTensorBuffer.getWebGpuBuffer();
          return liteRtWasm.WebGPU.getJsObject(gpuBufferId);
        }
        getCopyFunctionSet(destination) {
          this.ensureNotDeleted();
          const sourceBufferType = this.getBufferType();
          const copyFunctions = _Tensor.copyFunctions.get(sourceBufferType);
          if (!copyFunctions) {
            throw new Error(
              `TensorBufferType ${TensorBufferTypeName[sourceBufferType] ?? sourceBufferType} does not support copying or moving`
            );
          }
          const destinationBufferType = typeof destination === "string" ? AcceleratorDefaultTensorBufferType[destination] : destination;
          if (destinationBufferType == null) {
            throw new Error(
              `Unknown destination '${destination}' for copying or moving.`
            );
          }
          const copyFunctionSet = copyFunctions.get(destinationBufferType);
          if (!copyFunctionSet) {
            const supportedDestinations = [...copyFunctions].map(
              ([key]) => TensorBufferTypeName[key] ?? key
            );
            throw new Error(
              `TensorBufferType ${TensorBufferTypeName[sourceBufferType]} does not support copying or moving to ${TensorBufferTypeName[destinationBufferType]}. It supports the following TensorBufferTypes: [${supportedDestinations.join(
                ", "
              )}].`
            );
          }
          return [copyFunctionSet, destinationBufferType];
        }
        /**
         * Copies the tensor to the given accelerator.
         *
         * @param destination The accelerator or buffer type to copy to.
         * @return A promise that resolves to the copied tensor.
         */
        async copyTo(destination, options) {
          const [copyFunctionSet, destinationBufferType] = this.getCopyFunctionSet(destination);
          if (!copyFunctionSet.copyTo) {
            throw new Error(
              `Copying to ${TensorBufferTypeName[destinationBufferType]} is not supported by this tensor.`
            );
          }
          return copyFunctionSet.copyTo(this, options);
        }
        /**
         * Moves the tensor to the given accelerator.
         *
         * @param destination The accelerator or buffer type to move to.
         * @return A promise that resolves to the moved tensor.
         */
        async moveTo(destination, options) {
          const [copyFunctionSet, destinationBufferType] = this.getCopyFunctionSet(destination);
          if (!copyFunctionSet.moveTo) {
            throw new Error(
              `Moving to ${TensorBufferTypeName[destinationBufferType]} is not supported by this tensor.`
            );
          }
          return copyFunctionSet.moveTo(this, options);
        }
        get bufferType() {
          return this.liteRtTensorBuffer.bufferType().value;
        }
        get accelerator() {
          const accelerator = TensorBufferTypeToAccelerator[this.bufferType];
          if (accelerator === void 0) {
            throw new Error(
              `TensorBufferType ${TensorBufferTypeName[this.bufferType]} has an unknown accelerator type.`
            );
          }
          return accelerator;
        }
        get deleted() {
          return this.deletedInternal;
        }
        delete() {
          if (this.deletedInternal) {
            return;
          }
          this.deletedInternal = true;
          this.liteRtTensorBuffer.delete();
          this.onDelete?.();
        }
      };
      CompiledModelSignatureRunner = class {
        constructor(signatureIndex, liteRtModel, liteRtCompiledModel, options) {
          this.signatureIndex = signatureIndex;
          this.liteRtModel = liteRtModel;
          this.liteRtCompiledModel = liteRtCompiledModel;
          this.options = options;
          this.liteRtSimpleSignature = liteRtModel.getSignature(signatureIndex);
          const inputNames = emscriptenVectorToArray(this.liteRtSimpleSignature.inputNames());
          const inputDetails = [];
          for (let i = 0; i < inputNames.length; i++) {
            const name = inputNames[i];
            const tensorType = liteRtModel.getInputTensorType(signatureIndex, i);
            const requirements = liteRtCompiledModel.getInputBufferRequirements(signatureIndex, i);
            inputDetails.push(makeTensorDetails(name, i, tensorType, requirements));
          }
          this.inputDetails = Object.freeze(inputDetails);
          const outputNames = emscriptenVectorToArray(this.liteRtSimpleSignature.outputNames());
          const outputDetails = [];
          for (let i = 0; i < outputNames.length; i++) {
            const name = outputNames[i];
            const tensorType = liteRtModel.getOutputTensorType(signatureIndex, i);
            const requirements = liteRtCompiledModel.getOutputBufferRequirements(signatureIndex, i);
            outputDetails.push(makeTensorDetails(name, i, tensorType, requirements));
          }
          this.outputDetails = Object.freeze(outputDetails);
        }
        inputDetails;
        outputDetails;
        liteRtSimpleSignature;
        deletedInternal = false;
        /**
         * The string key corresponding to this signature in the model.
         */
        get key() {
          this.ensureNotDeleted();
          return this.liteRtSimpleSignature.key();
        }
        /**
         * Get details about each input tensor.
         */
        getInputDetails() {
          this.ensureNotDeleted();
          return this.inputDetails;
        }
        /**
         * Get details about each output tensor.
         */
        getOutputDetails() {
          this.ensureNotDeleted();
          return this.outputDetails;
        }
        async run(input) {
          this.ensureNotDeleted();
          const inputArray = this.inputsToArray(input);
          const { inputsOnAccelerator, cleanup } = await this.ensureInputsOnAccelerator(inputArray);
          let outputArray;
          try {
            outputArray = await this.runWithArray(inputsOnAccelerator);
          } finally {
            cleanup();
          }
          if (Array.isArray(input) || input instanceof Tensor) {
            return outputArray;
          } else {
            return this.outputsToRecord(outputArray);
          }
        }
        inputsToArray(input) {
          if (Array.isArray(input)) {
            if (input.length !== this.inputDetails.length) {
              throw new Error(
                `run() called with ${input.length} inputs, but signature expects ${this.inputDetails.length} inputs`
              );
            }
            return input;
          }
          if (input instanceof Tensor) {
            if (this.inputDetails.length !== 1) {
              throw new Error(
                `run() called with a single tensor, but signature expects ${this.inputDetails.length} inputs`
              );
            }
            return [input];
          }
          const inputArray = [];
          for (const inputDetails of this.inputDetails) {
            if (!(inputDetails.name in input)) {
              throw new Error(
                `run() called with input record that is missing input ${inputDetails.name} with index ${inputDetails.index}`
              );
            }
            inputArray.push(input[inputDetails.name]);
          }
          return inputArray;
        }
        outputsToRecord(output) {
          const outputRecord = {};
          for (let i = 0; i < this.outputDetails.length; i++) {
            outputRecord[this.outputDetails[i].name] = output[i];
          }
          return outputRecord;
        }
        /**
         * Ensures that all input tensors are on the correct accelerator. Copies any
         * tensors that are not on the correct accelerator.
         *
         * @param inputs The input tensors to be passed to the signature. They must
         *     be in the same order and quantity as the input details.
         * @return A promise that resolves to a list of input tensors that are on the
         *     correct accelerator, and a cleanup function that deletes any tensors
         *     that were copied.
         */
        async ensureInputsOnAccelerator(inputs) {
          const toDelete = [];
          const inputsOnAccelerator = [];
          const inputDetails = this.getInputDetails();
          if (inputs.length !== inputDetails.length) {
            throw new Error(`ensureInputsOnAccelerator() called with ${inputs.length} inputs, but signature expects ${inputDetails.length} inputs`);
          }
          for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const bufferType = input.getBufferType();
            const supportedBufferTypes = inputDetails[i].supportedBufferTypes;
            if (supportedBufferTypes.size === 0) {
              throw new Error(`Tensor ${inputDetails[i].name} with index ${inputDetails[i].index} has no supported buffer types.`);
            }
            if (supportedBufferTypes.has(bufferType)) {
              inputsOnAccelerator.push(input);
            } else {
              const newBufferType = supportedBufferTypes.values().next().value;
              const copy = await input.copyTo(newBufferType);
              toDelete.push(copy);
              inputsOnAccelerator.push(copy);
            }
          }
          return {
            inputsOnAccelerator,
            cleanup: () => {
              for (const tensor of toDelete) {
                tensor.delete();
              }
            }
          };
        }
        async runWithArray(input) {
          for (let i = 0; i < input.length; i++) {
            const inputTensor = input[i];
            const expectedRankedTensorType = this.liteRtModel.getInputTensorType(this.signatureIndex, i);
            const inputRequirements = this.liteRtCompiledModel.getInputBufferRequirements(
              this.signatureIndex,
              i
            );
            getGlobalLiteRt().liteRtWasm.checkTensorBufferCompatible(
              inputTensor.liteRtTensorBuffer,
              expectedRankedTensorType,
              inputRequirements
            );
            expectedRankedTensorType.delete();
            inputRequirements.delete();
          }
          const outputTensorBuffers = await this.liteRtCompiledModel.run(
            this.signatureIndex,
            input.map((tensor) => tensor.liteRtTensorBuffer)
          );
          return outputTensorBuffers.map(
            (tensorBuffer) => new Tensor(tensorBuffer, this.options.environment)
          );
        }
        get deleted() {
          return this.deletedInternal;
        }
        ensureNotDeleted() {
          if (this.deleted) {
            throw new Error(
              "CompiledModelSignatureRunner is deleted and cannot be used."
            );
          }
        }
        delete() {
          if (this.deletedInternal) {
            return;
          }
          this.deletedInternal = true;
          this.liteRtSimpleSignature.delete();
        }
      };
      CompiledModel = class {
        constructor(model, liteRtCompiledModel, options, onDelete) {
          this.model = model;
          this.liteRtCompiledModel = liteRtCompiledModel;
          this.options = options;
          this.onDelete = onDelete;
          const numSignatures = model.liteRtModel.getNumSignatures();
          const compiledModelSignatureRunners = {};
          for (let i = 0; i < numSignatures; i++) {
            const compiledModelSignatureRunner = new CompiledModelSignatureRunner(
              i,
              model.liteRtModel,
              liteRtCompiledModel,
              options
            );
            compiledModelSignatureRunners[compiledModelSignatureRunner.key] = compiledModelSignatureRunner;
          }
          this.compiledModelSignatureRunners = Object.freeze(compiledModelSignatureRunners);
          this.defaultSignature = Object.values(this.signatures)[0];
          this.key = this.defaultSignature.key;
        }
        defaultSignature;
        compiledModelSignatureRunners;
        key;
        deletedInternal = false;
        get signatures() {
          this.ensureNotDeleted();
          return this.compiledModelSignatureRunners;
        }
        getInputDetails() {
          this.ensureNotDeleted();
          return this.defaultSignature.getInputDetails();
        }
        getOutputDetails() {
          this.ensureNotDeleted();
          return this.defaultSignature.getOutputDetails();
        }
        async run(inputOrSignatureName, maybeInput) {
          this.ensureNotDeleted();
          const [signature, input] = this.parseRunInputs(inputOrSignatureName, maybeInput);
          return await signature.run(input);
        }
        parseRunInputs(inputOrSignatureName, maybeInput) {
          let signature;
          let input;
          if (typeof inputOrSignatureName === "string") {
            signature = this.signatures[inputOrSignatureName];
            if (!signature) {
              throw new Error(
                `No signature named ${inputOrSignatureName} found in model.`
              );
            }
            if (!maybeInput) {
              throw new Error(
                `No input provided for signature ${inputOrSignatureName}`
              );
            }
            input = maybeInput;
          } else {
            signature = this.defaultSignature;
            input = inputOrSignatureName;
          }
          return [signature, input];
        }
        get deleted() {
          return this.deletedInternal;
        }
        ensureNotDeleted() {
          if (this.deleted) {
            throw new Error("CompiledModel is deleted and cannot be used.");
          }
        }
        get isFullyAccelerated() {
          this.ensureNotDeleted();
          return this.liteRtCompiledModel.isFullyAccelerated();
        }
        delete() {
          if (this.deletedInternal) {
            return;
          }
          this.deletedInternal = true;
          this.liteRtCompiledModel.delete();
          this.model.delete();
          for (const signatureRunner of Object.values(
            this.compiledModelSignatureRunners
          )) {
            signatureRunner.delete();
          }
          this.onDelete();
        }
      };
      Model = class {
        constructor(liteRtModel, onDelete) {
          this.liteRtModel = liteRtModel;
          this.onDelete = onDelete;
        }
        delete() {
          this.liteRtModel.delete();
          this.onDelete();
        }
      };
      WASM_RELAXED_SIMD_CHECK = new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        5,
        1,
        96,
        0,
        1,
        123,
        3,
        2,
        1,
        0,
        10,
        15,
        1,
        13,
        0,
        65,
        1,
        253,
        15,
        65,
        2,
        253,
        15,
        253,
        128,
        2,
        11
      ]);
      WASM_THREADS_CHECK = new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        4,
        1,
        96,
        0,
        0,
        3,
        2,
        1,
        0,
        5,
        4,
        1,
        3,
        1,
        1,
        10,
        11,
        1,
        9,
        0,
        65,
        0,
        254,
        16,
        2,
        0,
        26,
        11
      ]);
      WASM_FEATURE_VALUES = {
        "relaxedSimd": void 0,
        "threads": void 0,
        "jspi": void 0,
        "webnn": void 0
      };
      WASM_FEATURE_CHECKS = {
        "relaxedSimd": () => {
          if (WASM_FEATURE_VALUES.relaxedSimd === void 0) {
            WASM_FEATURE_VALUES.relaxedSimd = tryWasm(WASM_RELAXED_SIMD_CHECK);
          }
          return WASM_FEATURE_VALUES.relaxedSimd;
        },
        "threads": () => {
          if (WASM_FEATURE_VALUES.threads === void 0) {
            try {
              if (typeof MessageChannel !== "undefined") {
                new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
              }
              WASM_FEATURE_VALUES.threads = tryWasm(WASM_THREADS_CHECK);
            } catch (e) {
              WASM_FEATURE_VALUES.threads = Promise.resolve({ supported: false, error: e });
            }
          }
          return WASM_FEATURE_VALUES.threads;
        },
        "jspi": () => {
          if (WASM_FEATURE_VALUES.jspi === void 0) {
            const supported = isJspiSupported();
            WASM_FEATURE_VALUES.jspi = Promise.resolve({
              supported,
              error: supported ? void 0 : new Error("JSPI is not supported")
            });
          }
          return WASM_FEATURE_VALUES.jspi;
        },
        "webnn": () => {
          if (WASM_FEATURE_VALUES.webnn === void 0) {
            const supported = isWebNnSupported();
            WASM_FEATURE_VALUES.webnn = Promise.resolve({
              supported,
              error: supported ? void 0 : new Error("WebNN is not supported")
            });
          }
          return WASM_FEATURE_VALUES.webnn;
        }
      };
      LiteRt = class {
        liteRtWasm;
        defaultEnvironment;
        objectsToDelete = /* @__PURE__ */ new Set();
        constructor(wasmModule) {
          this.liteRtWasm = wasmModule;
          this.liteRtWasm.setupLogging();
        }
        setDefaultEnvironment(environment) {
          this.defaultEnvironment = environment;
        }
        getDefaultEnvironment() {
          if (!this.defaultEnvironment) {
            throw new Error("Default environment is not set.");
          }
          return this.defaultEnvironment;
        }
        setWebGpuDevice(device) {
          const oldEnvironment = this.getDefaultEnvironment();
          this.setDefaultEnvironment(new Environment({
            ...oldEnvironment.options,
            webGpuDevice: device
          }));
        }
        getWebGpuDevice() {
          return this.getDefaultEnvironment().webGpuDevice;
        }
        /**
         * Registers an object to be deleted when this LiteRt instance is deleted.
         * Internal use only.
         */
        _registerObjectForDeletion(object) {
          this.objectsToDelete.add(object);
        }
        /**
         * Unregisters an object from being deleted when this LiteRt instance is
         * deleted. Internal use only.
         */
        _unregisterObjectForDeletion(object) {
          this.objectsToDelete.delete(object);
        }
        /**
         * Loads and compiles a LiteRt model.
         *
         * @param model The model data. This can be a string (the model url), a URL
         *     object, a Uint8Array (the model bytes), or a
         *     ReadableStreamDefaultReader (for streaming model loading).
         * @param compileOptions The options for compiling the model. This includes
         *     the accelerator to use ('webgpu' or 'wasm') and the WebGPU device
         *     (for direct GPU model inputs / outputs).
         * @returns A promise that resolves to the CompiledModel.
         */
        async loadAndCompile(model, compileOptions = {}) {
          let modelData;
          if (typeof model === "string" || model instanceof URL) {
            modelData = await urlToUint8Array(model);
          } else if (model instanceof Uint8Array) {
            modelData = model;
          } else if (model instanceof ReadableStreamDefaultReader) {
            modelData = await readableStreamDefaultReaderToUint8Array(model);
          } else {
            throw new Error("Unsupported model type.");
          }
          const environment = compileOptions.environment ?? this.getDefaultEnvironment();
          const accelerator = compileOptions.accelerator ?? (environment.webGpuDevice ? "webgpu" : "wasm");
          const isWebGpu = accelerator === "webgpu";
          if (isWebGpu && !environment.webGpuDevice) {
            throw new Error(
              "WebGPU was requested but no WebGPU device is set in the environment."
            );
          }
          const filledCompileOptions = fillCompileOptions(
            compileOptions,
            environment,
            this.liteRtWasm.getThreadCount()
          );
          const ptr = this.liteRtWasm._malloc(modelData.byteLength);
          this.liteRtWasm.HEAPU8.set(modelData, ptr);
          const wasmModel = this.liteRtWasm.loadModel(
            filledCompileOptions.environment.liteRtEnvironment,
            ptr,
            modelData.byteLength
          );
          const wasmCompiledModel = await this.liteRtWasm.compileModel(
            filledCompileOptions.environment.liteRtEnvironment,
            wasmModel,
            filledCompileOptions
          );
          const loadedModel2 = new Model(wasmModel, () => {
            this.liteRtWasm._free(ptr);
          });
          const compiledModel = new CompiledModel(
            loadedModel2,
            wasmCompiledModel,
            filledCompileOptions,
            () => {
              this.objectsToDelete.delete(compiledModel);
            }
          );
          this.objectsToDelete.add(compiledModel);
          const isWebNn = accelerator === "webnn";
          const acceleratorRequested = isWebGpu || isWebNn;
          if (acceleratorRequested && !compiledModel.isFullyAccelerated) {
            if (isJspiSupported()) {
              console.warn(
                `%c[LiteRT]%c Model not fully compiled for ${accelerator}. Partially delegating to WASM execution.`,
                "background: #FFA000; color: black; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
                "font-weight: bold;"
              );
            } else {
              console.warn(
                `%c[LiteRT]%c Model not fully compiled for ${accelerator} on non-JSPI browser. Falling back to WASM execution.`,
                "background: #D32F2F; color: white; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
                "color: #D32F2F; font-weight: bold;"
              );
              compiledModel.delete();
              const fallbackCompileOptions = {
                ...compileOptions,
                accelerator: "wasm"
              };
              return this.loadAndCompile(modelData, fallbackCompileOptions);
            }
          }
          return compiledModel;
        }
        delete() {
          for (const object of this.objectsToDelete) {
            object.delete();
          }
        }
      };
      WASM_JS_FILE_NAME = "litert_wasm_internal.js";
      WASM_JS_COMPAT_FILE_NAME = "litert_wasm_compat_internal.js";
      WASM_JS_THREADED_FILE_NAME = "litert_wasm_threaded_internal.js";
      WASM_JS_JSPI_FILE_NAME = "litert_wasm_jspi_internal.js";
      compilationLock = Promise.resolve();
      registerCopyFunctions();
    }
  });

  // src/invoker/invoker.js
  var Invoker = class {
    /**
     * Constructs an Invoker instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Sends an HTTP request using the Fetch API.
     *
     * @param {InvokeOptions} opts - Request options including path/URL, query params, and fetch options.
     * @param {string} [opts.url] - The full URL to request. If omitted, defaults to `${baseUrl}/${path}`.
     * @param {string} [opts.path] - The path to append to the baseUrl if `url` is not provided.
     * @param {Record<string, any>} [opts.query] - Key-value pairs to append as query parameters.
     * @param {*} [opts.json] - JSON-serializable body data. If provided, sets Content-Type header to application/json and serializes to body.
     * Credentials are always set to "include" so the session cookie is sent. Note that `opts`
     * is modified (credentials, and headers/body when `json` is given). An HTTP error status
     * does not throw; check `ok` on the returned Response.
     * @returns {Promise<Response>} A promise that resolves to the fetch Response.
     * @throws {TypeError} If the network request fails (from fetch).
     */
    async invoke(opts) {
      let url = opts.url || `${this._services.config().baseUrl}/${opts.path}`;
      if (opts.query) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(opts.query)) {
          if (value === void 0 || value === null) {
            continue;
          }
          for (const item of Array.isArray(value) ? value : [value]) {
            search.append(key, String(item));
          }
        }
        const queryString = search.toString();
        if (queryString) {
          url = url + (url.includes("?") ? "&" : "?") + queryString;
        }
      }
      if (opts.json) {
        const headers = new Headers(opts.headers);
        headers.set("Content-Type", "application/json");
        opts.headers = headers;
        opts.body = JSON.stringify(opts.json);
      }
      opts.credentials = "include";
      const resp = await fetch(url, opts);
      return resp;
    }
  };

  // src/auth/auth.js
  var Auth = class {
    /**
     * Constructs an Auth client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Redirects the browser to the login page, passing the current URL (encoded)
     * as `backurl` so the user returns to this page after signing in.
     * Navigates away from the page; code after the call may not run.
     * @private
     * @returns {void}
     */
    #redirectToLogin() {
      const backurl = location.href;
      const encoded = encodeURIComponent(backurl);
      const loginUrl = `${this._services.config().baseUrl}/api/decsuite/auth/login?backurl=${encoded}`;
      location = loginUrl;
    }
    /**
     * Fetches the current authenticated user profile (`GET api/auth/me`).
     * Does not redirect; use {@link Auth#requireUser} to force a login.
     * @returns {Promise<UserProfile|null>} The user profile data, or null if the
     *   server returns no user.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    async user() {
      const resp = await this._services.invoker().invoke({
        path: `api/auth/me`
      });
      const user = await resp.json();
      return user;
    }
    /**
     * Fetches the current user, redirecting the browser to the login page when
     * there is none. The login page sends the user back to the current URL
     * afterwards.
     * @returns {Promise<UserProfile|null>} The user profile data, or null when the
     *   browser is being redirected to login.
     * @throws {Error} If the network request fails or the response body is not valid JSON.
     */
    async requireUser() {
      var user = await this.user();
      if (!user) {
        this.#redirectToLogin();
        return null;
      }
      return user;
    }
  };

  // src/errors.js
  var I6Error = class _I6Error extends Error {
    /**
     * @param {string} message - Human readable description.
     * @param {Object} [details]
     * @param {I6ErrorCode} [details.code] - Failure kind. Defaults to "http" when a status is given.
     * @param {number} [details.status] - HTTP status code, when the server answered.
     * @param {*} [details.body] - Error body of the response (parsed JSON, or raw text).
     * @param {*} [details.cause] - The underlying error, if any.
     */
    constructor(message, { code, status, body, cause } = {}) {
      super(message, cause === void 0 ? void 0 : { cause });
      this.name = "I6Error";
      this.code = code ?? (status === void 0 ? void 0 : "http");
      this.status = status;
      this.body = body;
    }
    /**
     * Builds an "http" error from a failed generated-client result ({status, error}).
     * @param {string} message
     * @param {{status: number, error?: *}} result
     * @returns {I6Error}
     */
    static fromResult(message, result) {
      return new _I6Error(`${message} with status ${result.status}`, {
        code: "http",
        status: result.status,
        body: result.error
      });
    }
  };

  // src/ingest/ingest.js
  var Ingest = class {
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Asks ingestz for a signed upload URL (ingestz-get-url API) and uploads a single file to it.
     * @param {UploadParams} params - Upload parameters.
     * @returns {Promise<UploadResult>} Resolves with the ingest id on a successful upload.
     * @throws {I6Error} With code "invalid_argument" if file is not a single File, "http" or
     *   "network" if a request fails. Rejects with an AbortError if `signal` aborts.
     */
    async upload({ dataset, table, partitions, file, onProgress, signal, contentType }) {
      if (!(file instanceof File)) {
        throw new I6Error("file must be a single File.", { code: "invalid_argument" });
      }
      signal?.throwIfAborted();
      const { ingestId, url } = await this.#getUrl({ dataset, table, partitions });
      signal?.throwIfAborted();
      await this.#put(url, file, { onProgress, signal, contentType });
      return { ingestId };
    }
    /**
     * Gets one signed PUT URL from the ingestz-get-url API.
     * @private
     * @param {GetUrlParams} params - Parameters for requesting the upload URL.
     * @returns {Promise<{ingestId: string, url: string}>} The ingest id and the signed PUT URL.
     * @throws {I6Error} If the request fails or no upload URL is returned.
     */
    async #getUrl({ dataset, table, partitions }) {
      const resp = await this._services.apis().ingestzGetUrl({
        params: { dataset },
        payload: { table, partitions, amount: 1 }
      });
      if (!resp.ok) {
        throw I6Error.fromResult("Get upload URL failed", resp);
      }
      const uploads = resp.payload?.uploads;
      if (!uploads?.[0]) {
        throw new I6Error("Get upload URL returned no upload URL.", { code: "no_upload_url" });
      }
      return { ingestId: resp.payload.ingest_id, url: uploads[0] };
    }
    /**
     * Uploads a file to a signed PUT URL using XMLHttpRequest (fetch has no upload progress).
     * @private
     * @param {string} signedPutUrl - The signed URL to PUT the file to.
     * @param {File} file - The file to upload.
     * @param {Pick<UploadParams, "onProgress"|"signal"|"contentType">} opts
     * @returns {Promise<void>} Resolves on a successful upload, rejects on network or HTTP error or abort.
     */
    #put(signedPutUrl, file, { onProgress, signal, contentType }) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const abort = () => xhr.abort();
        const abortError = () => signal?.reason ?? new DOMException("Upload aborted.", "AbortError");
        const done = (fn, arg) => {
          signal?.removeEventListener("abort", abort);
          fn(arg);
        };
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            done(resolve);
          } else {
            done(reject, new I6Error(`Upload failed with status ${xhr.status}`, {
              code: "http",
              status: xhr.status,
              body: xhr.responseText
            }));
          }
        });
        xhr.addEventListener("error", () => {
          done(reject, new I6Error("Network error occurred during upload.", { code: "network" }));
        });
        xhr.addEventListener("abort", () => {
          done(reject, abortError());
        });
        if (onProgress) {
          xhr.upload.addEventListener("progress", (e) => {
            const total = e.lengthComputable ? e.total : file.size;
            onProgress({
              loaded: e.loaded,
              total,
              percent: total > 0 ? e.loaded / total * 100 : 100
            });
          });
        }
        xhr.open("PUT", signedPutUrl, true);
        if (contentType) {
          xhr.setRequestHeader("Content-Type", contentType);
        }
        signal?.addEventListener("abort", abort, { once: true });
        xhr.send(file);
      });
    }
  };

  // src/sdkapis/sdkapis.js
  var Apis = class {
    /**
     * Constructs an Ingest client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszCreateStoreReq} req
     * @returns {Promise<apiDszCreateStoreResp>}
     */
    async dszCreateStore(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/create`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.body = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszCreateIngestionTokenReq} req
     * @returns {Promise<apiDszCreateIngestionTokenResp>}
     */
    async dszCreateIngestionToken(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/create`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszListRecsysTokensReq} req
     * @returns {Promise<apiDszListRecsysTokensResp>}
     */
    async dszListRecsysTokens(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/list`
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszDeleteTokenReq} req
     * @returns {Promise<apiDszDeleteTokenResp>}
     */
    async dszDeleteToken(req) {
      const resp = await this._services.invoker().invoke({
        method: "DELETE",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/token/delete`,
        query: req.query
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.body = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Stream Ingestion
     * 
     * Ingests stream data into a target dataset table.
     * 
     * @param {apiIngestzStreamRelevanceFashionEventReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionEventResp>}
     */
    async ingestzStreamRelevanceFashionEvent(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-event`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.body = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszListIngestionTokensReq} req
     * @returns {Promise<apiDszListIngestionTokensResp>}
     */
    async dszListIngestionTokens(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/ingestiontoken/list`
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszCreateRecsysTokenReq} req
     * @returns {Promise<apiDszCreateRecsysTokenResp>}
     */
    async dszCreateRecsysToken(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/recsystoken/create`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszListDatasetsReq} req
     * @returns {Promise<apiDszListDatasetsResp>}
     */
    async dszListDatasets(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/dsz/datasets`,
        query: req.query
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Get Dataset Signed URLs
     * 
     * Generates presigned URLs for accessing or mutating files in the specified dataset.
     * 
     * @param {apiDszSignedUrlReq} req
     * @returns {Promise<apiDszSignedUrlResp>}
     */
    async dszSignedUrl(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-url`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * List Dataset Tables
     * 
     * Lists files and tables in the specified dataset.
     * 
     * @param {apiDszTableListReq} req
     * @returns {Promise<apiDszTableListResp>}
     */
    async dszTableList(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-list`,
        query: req.query
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiPipezStartReq} req
     * @returns {Promise<apiPipezStartResp>}
     */
    async pipezStart(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/pipe/start/dataset/${encodeURIComponent(String(req.params.dataset))}`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszDomainGetReq} req
     * @returns {Promise<apiDszDomainGetResp>}
     */
    async dszDomainGet(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/solution-domain`,
        query: req.query
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Sample Fraction
     * 
     * Sample API that performs a fraction operation
     * 
     * @param {apiSampleFractionReq} req
     * @returns {Promise<apiSampleFractionResp>}
     */
    async sampleFraction(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/gox/routez/sample/fraction/${encodeURIComponent(String(req.params.numerator))}/${encodeURIComponent(String(req.params.denominator))}`,
        query: req.query,
        headers: req.headers,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Stream Ingestion
     * 
     * Ingests stream data into a target dataset table.
     * 
     * @param {apiIngestzStreamRelevanceFashionCatalogReq} req
     * @returns {Promise<apiIngestzStreamRelevanceFashionCatalogResp>}
     */
    async ingestzStreamRelevanceFashionCatalog(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/stream/relevance-fashion-catalog`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.body = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Get Model Signed URLs
     * 
     * Generates presigned URLs for accessing model files in the specified dataset.
     * 
     * @param {apiDszModelGetReq} req
     * @returns {Promise<apiDszModelGetResp>}
     */
    async dszModelGet(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/model/dataset/${encodeURIComponent(String(req.params.dataset))}/signed-get/${encodeURIComponent(String(req.params.model_name))}`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszListStoresReq} req
     * @returns {Promise<apiDszListStoresResp>}
     */
    async dszListStores(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/list`
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Get Ingestion Upload URLs
     * 
     * Generates presigned PUT URLs and an ingestion token for uploading files into a target dataset table and partitions.
     * 
     * @param {apiIngestzGetUrlReq} req
     * @returns {Promise<apiIngestzGetUrlResp>}
     */
    async ingestzGetUrl(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ingest/dataset/${encodeURIComponent(String(req.params.dataset))}/get-url`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.payload = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * Get Dataset Table File
     * 
     * Get table file by redirecting to its signed URL.
     * 
     * @param {apiDszTableGetReq} req
     * @returns {Promise<apiDszTableGetResp>}
     */
    async dszTableGet(req) {
      const resp = await this._services.invoker().invoke({
        method: "GET",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/table-file/{path...}`
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.body = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
    /**
     * 
     * 
     * 
     * 
     * @param {apiDszDomainSelectReq} req
     * @returns {Promise<apiDszDomainSelectResp>}
     */
    async dszDomainSelect(req) {
      const resp = await this._services.invoker().invoke({
        method: "POST",
        path: `api/ds/dataset/${encodeURIComponent(String(req.params.dataset))}/store/solution-domain`,
        json: req.payload
      });
      const result = { status: resp.status, ok: resp.ok };
      if (resp.ok) {
        result.body = await resp.json();
      }
      if (!resp.ok) {
        const text = await resp.text();
        try {
          result.error = JSON.parse(text);
        } catch {
          result.error = text;
        }
      }
      return result;
    }
  };
  var SdkFuncs = class {
    /**
     * Constructs an SdkFuncs instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * @param {sdkFuncProductRelevanceFashionFbtReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionFbtOutput>}
     */
    async productRelevanceFashionFbtV1(req) {
      const infer = this._services.infer();
      const ret = await infer.run({
        dataset: req.input.dataset,
        modelName: "relevance-fashion-fbt",
        params: req.input,
        partitions: { "version": "v1", ...req.partitions }
      });
      return ret;
    }
    /**
     * @param {sdkFuncProductRelevanceFashionDashFunnelReq} req
     * @returns {Promise<sdkFuncProductRelevanceFashionDashFunnelOutput>}
     */
    async productRelevanceFashionDashFunnelV1(req) {
      console.log(req);
      return {};
    }
  };

  // src/internal/fs/fs.js
  var base = "i6/fs";
  var readText = async (dir, fileName) => (await (await dir.getFileHandle(fileName)).getFile()).text();
  var writeFile = async (dir, fileName, data) => {
    const writable = await (await dir.getFileHandle(fileName, { create: true })).createWritable();
    await writable.write(data);
    await writable.close();
  };
  var baseDir = async () => {
    let dir = await navigator.storage.getDirectory();
    for (const segment of base.split("/")) {
      dir = await dir.getDirectoryHandle(segment);
    }
    return dir;
  };
  var FS = class {
    /**
     * Removes the versions older than version.txt, and the whole file if it is left empty.
     * Without version.txt no version is removed.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @returns {Promise<void>}
     */
    async cleanFile(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      try {
        const parent = await baseDir();
        const dir = await parent.getDirectoryHandle(opts.name);
        const released = await readText(dir, "version.txt").then((v) => "v" + v, () => null);
        for await (const [entryName, entry] of dir.entries()) {
          if (released && entry.kind === "directory" && entryName < released) {
            await dir.removeEntry(entryName, { recursive: true });
          }
        }
        for await (const _ of dir.entries()) return;
        await parent.removeEntry(opts.name);
      } catch (e) {
        if (e.name !== "NotFoundError") throw e;
      }
    }
    /**
     * Cleans all files, see cleanFile.
     * @returns {Promise<void>}
     */
    async clean() {
      try {
        const names = [];
        for await (const [entryName, entry] of (await baseDir()).entries()) {
          if (entry.kind === "directory") names.push(entryName);
        }
        for (const name of names) {
          await this.cleanFile({ name });
        }
      } catch (e) {
        if (e.name !== "NotFoundError") throw e;
      }
    }
    /**
     * Resolves a version of a file.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} [opts.version] - defaults to the content of version.txt
     * @returns {Promise<FileRef|null>} a new full FileRef, or null if it does not exist.
     */
    async get(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      try {
        const dir = await (await baseDir()).getDirectoryHandle(opts.name);
        const version = opts.version || await readText(dir, "version.txt");
        const versionDir = await dir.getDirectoryHandle("v" + version);
        return {
          name: opts.name,
          version,
          etag: await readText(versionDir, "etag.txt")
        };
      } catch (e) {
        if (e.name === "NotFoundError") return null;
        throw e;
      }
    }
    /**
     * Creates a new version, unless the latest version already has this etag.
     * The new version is not released.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.etag - required
     * @param {Blob|BufferSource|string} [opts.data] - content, required when a new version is created
     * @returns {Promise<FileRef>} a new full FileRef.
     */
    async create(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.etag) throw new TypeError("fs: opts.etag is required");
      let dir = await navigator.storage.getDirectory();
      for (const segment of [...base.split("/"), opts.name]) {
        dir = await dir.getDirectoryHandle(segment, { create: true });
      }
      let latest = null;
      for await (const [entryName, entry] of dir.entries()) {
        if (entry.kind === "directory" && entryName.startsWith("v") && (!latest || entryName > latest)) latest = entryName;
      }
      if (latest && await readText(await dir.getDirectoryHandle(latest), "etag.txt").catch(() => null) === opts.etag) {
        return { name: opts.name, version: latest.substring(1), etag: opts.etag };
      }
      if (opts.data === void 0) throw new TypeError("fs: opts.data is required to create a new version");
      const version = (/* @__PURE__ */ new Date()).toISOString();
      const versionDir = await dir.getDirectoryHandle("v" + version, { create: true });
      await writeFile(versionDir, "etag.txt", opts.etag);
      return { name: opts.name, version, etag: opts.etag };
    }
    /**
     * Returns the bin file path, full (with base). Does not check that it exists, see get.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<string>} e.g. "i6/fs/{name}/v{version}/blob.bin"
     */
    async resolve(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      return `${base}/${opts.name}/v${opts.version}/blob.bin`;
    }
    /**
     * Reads the content (blob.bin) of a version.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required
     * @returns {Promise<Uint8Array>} the bytes of the file.
     * @throws {DOMException} NotFoundError if the version or its blob does not exist.
     */
    async read(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      let dir = await navigator.storage.getDirectory();
      for (const segment of [...base.split("/"), opts.name, "v" + opts.version]) {
        dir = await dir.getDirectoryHandle(segment);
      }
      const file = await (await dir.getFileHandle("blob.bin")).getFile();
      return new Uint8Array(await file.arrayBuffer());
    }
    /**
     * Makes a version the current one (version.txt), then cleans the older versions.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must exist
     * @returns {Promise<FileRef>} a new full FileRef of the released version.
     */
    async release(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      const ref = await this.get(opts);
      if (!ref) throw new Error(`fs: version ${opts.version} of ${opts.name} does not exist`);
      await writeFile(await (await baseDir()).getDirectoryHandle(opts.name), "version.txt", opts.version);
      await this.cleanFile(opts);
      return ref;
    }
    /**
     * Removes a version that was never released (e.g. its download failed). Does nothing if it does not exist.
     * @param {Object} opts
     * @param {string} opts.name - required
     * @param {string} opts.version - required, must not be the released one
     * @returns {Promise<void>}
     */
    async discard(opts) {
      if (!opts || !opts.name) throw new TypeError("fs: opts.name is required");
      if (!opts.version) throw new TypeError("fs: opts.version is required");
      try {
        const dir = await (await baseDir()).getDirectoryHandle(opts.name);
        if (await readText(dir, "version.txt").catch(() => null) === opts.version) {
          throw new Error(`fs: version ${opts.version} of ${opts.name} is the released one`);
        }
        await dir.removeEntry("v" + opts.version, { recursive: true });
      } catch (e) {
        if (e.name !== "NotFoundError") throw e;
      }
    }
  };
  var fs = new FS();

  // src/internal/downloader/downloader.js
  var Downloader = class {
    /**
     * Downloads the file by name if necessary (checking etag): sends a HEAD request, and
     * if the etag differs from the released version, streams the body into a new version
     * and releases it.
     * @param {Object} opts
     * @param {string} opts.name - required, name to store the file under (see fs.js)
     * @param {string} opts.url - required, URL of the file; must answer HEAD with an etag
     * @returns {Promise<FileRef>} the FileRef of the up-to-date file (basically to get the version)
     * @throws {TypeError} If name or url is missing.
     * @throws {Error} If the HEAD or GET request fails, or the HEAD response has no etag.
    */
    async update(opts) {
      if (!opts || !opts.name) throw new TypeError("downloader: opts.name is required");
      if (!opts.url) throw new TypeError("downloader: opts.url is required");
      const head = await fetch(opts.url, { method: "HEAD" });
      if (!head.ok) throw new Error(`downloader: HEAD ${opts.url} failed (${head.status})`);
      const etag = head.headers.get("etag");
      if (!etag) throw new Error("downloader: no etag in HEAD response");
      const current = await fs.get({ name: opts.name });
      if (current && current.etag === etag) return current;
      const ref = await fs.create({ name: opts.name, etag, data: "" });
      let success = false;
      try {
        const response = await fetch(opts.url);
        if (!response.ok) throw new Error(`downloader: GET ${opts.url} failed (${response.status})`);
        let dir = await navigator.storage.getDirectory();
        for (const segment of (await fs.resolve(ref)).split("/")) {
          dir = segment === "blob.bin" ? await dir.getFileHandle(segment, { create: true }) : await dir.getDirectoryHandle(segment);
        }
        await response.body.pipeTo(await dir.createWritable());
        success = true;
      } finally {
        if (!success) {
          await fs.discard(ref).catch(() => {
          });
        }
      }
      return fs.release(ref);
    }
  };
  var downloader = new Downloader();

  // src/internal/assets/assets.js
  function partitionsKey(partitions) {
    return Object.entries(partitions).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => encodeURIComponent(`${key}=${value}`)).join("-");
  }
  function isPartitions(partitions) {
    return !!partitions && typeof partitions === "object" && !Array.isArray(partitions) && Object.values(partitions).every((v) => typeof v === "string");
  }
  async function downloadFile(name, url) {
    try {
      const ref = await downloader.update({ name, url });
      if (globalThis.I6_DEBUG) console.log(`assets: ${name} is ready`, ref);
      return ref;
    } catch (cause) {
      throw new I6Error(`could not get ${url}: ${cause.message}`, { code: "asset", cause });
    }
  }

  // src/internal/sqlitez/sqlitez.js
  var SQLJS_VERSION = "1.14.2";
  var SQLJS_WASM_URL = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;
  var SQLITE_HEADER = "SQLite format 3\0";
  var sqlJs = null;
  function loadSqlJs() {
    sqlJs ??= Promise.resolve().then(() => __toESM(require_sql_wasm_browser(), 1)).then((m) => (m.default || m)({ locateFile: (file) => SQLJS_WASM_URL + file }));
    return sqlJs;
  }
  var SqliteConn = class {
    /**
     * Use `sqlitez.open`, not this constructor.
     * @param {Object} db - The sql.js database.
     */
    constructor(db) {
      this.db = db;
    }
    /**
     * Closes the connection, freeing the database. Closing twice is fine.
     * @returns {Promise<void>}
     */
    async close() {
      if (!this.db) return;
      this.db.close();
      this.db = null;
    }
    /**
     * Runs a query and returns its rows.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query (never concatenate them).
     * @returns {Promise<SqliteRow[]>} The rows (empty array when none), each one an object by column name.
     * @throws {TypeError} If opts.query is missing.
     * @throws {I6Error} With code "query" if the connection is closed or sqlite rejects the query.
     */
    async query(opts) {
      if (!opts || !opts.query) throw new TypeError("sqlitez: opts.query is required");
      const db = this.alive();
      let stmt;
      try {
        stmt = db.prepare(opts.query);
        if (opts.params) {
          stmt.bind(opts.params);
        }
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        return rows;
      } catch (cause) {
        throw new I6Error(`sqlitez: query failed: ${cause.message}`, { code: "query", cause });
      } finally {
        if (stmt) stmt.free();
      }
    }
    /**
     * Runs a statement that returns no data (INSERT, UPDATE, CREATE, ...). Only the memory copy changes.
     * @param {Object} opts
     * @param {string} opts.query - required, the SQL; use `?` for values.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the query.
     * @returns {Promise<void>}
     * @throws {TypeError} If opts.query is missing.
     * @throws {I6Error} With code "query" if the connection is closed or sqlite rejects the statement.
     */
    async update(opts) {
      if (!opts || !opts.query) throw new TypeError("sqlitez: opts.query is required");
      const db = this.alive();
      try {
        db.run(opts.query, opts.params);
      } catch (cause) {
        throw new I6Error(`sqlitez: update failed: ${cause.message}`, { code: "query", cause });
      }
    }
    /**
     * Runs a query stored in the `namedqueries` table of the sqlite (columns `name` and `query`).
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query.
     * @param {SqliteValue[]} [opts.params] - values bound, in order, to the `?` of the stored query.
     * @returns {Promise<SqliteRow[]>} The rows of the stored query, like `query`.
     * @throws {TypeError} If opts.name is missing.
     * @throws {I6Error} With code "query" if the connection is closed, there is no such table or named query, or the query fails.
     */
    async namedQuery(opts) {
      if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
      const found = await this.query({ query: "SELECT query FROM namedqueries WHERE name = ?", params: [opts.name] });
      if (found.length === 0) {
        throw new I6Error(`sqlitez: no named query "${opts.name}"`, { code: "query" });
      }
      return this.query({ query: String(found[0].query), params: opts.params });
    }
    /**
     * Like `namedQuery`, but with JSON in and JSON out: each value of `opts.params`
     * is bound as a JSON string to the positional `?1`, `?2`, ... of the stored query, in order (read them in SQL with
     * `json_extract(?1, '$.field')`, `json_each(?2)`, ...). The stored query must return a row with a column `ret`
     * holding a JSON string. That JSON is parsed and returned.
     * The stored query must have a placeholder for every value, otherwise sqlite rejects the bind ("column index out of range").
     * @param {Object} opts
     * @param {string} opts.name - required, the `name` of the stored query (see `namedQuery`).
     * @param {Array<*>} [opts.params] - JSON-serializable values, bound in order as `?1`, `?2`, ... Default: none.
     * @returns {Promise<*>} The parsed `ret` of the first row, or null if there is no row or `ret` is null.
     * @throws {TypeError} If opts.name is missing or opts.params is not an array.
     * @throws {I6Error} With code "query" if `namedQuery` fails, the rows have no `ret` column, or `ret` is not valid JSON.
     */
    async namedJsonQuery(opts) {
      if (!opts || !opts.name) throw new TypeError("sqlitez: opts.name is required");
      if (opts.params !== void 0 && !Array.isArray(opts.params)) throw new TypeError("sqlitez: opts.params must be an array");
      const rows = await this.namedQuery({ name: opts.name, params: (opts.params ?? []).map((value) => JSON.stringify(value ?? null)) });
      if (rows.length === 0) return null;
      if (!("ret" in rows[0])) {
        throw new I6Error(`sqlitez: named query "${opts.name}" returned no "ret" column`, { code: "query" });
      }
      if (rows[0].ret === null) return null;
      try {
        return JSON.parse(rows[0].ret);
      } catch (cause) {
        throw new I6Error(`sqlitez: "ret" of named query "${opts.name}" is not valid JSON: ${cause.message}`, { code: "query", cause });
      }
    }
    /**
     * @private
     * @returns {Object} The sql.js database.
     * @throws {I6Error} With code "query" if the connection is closed.
     */
    alive() {
      if (!this.db) throw new I6Error("sqlitez: the connection is closed", { code: "query" });
      return this.db;
    }
  };
  var Sqlitez = class {
    /**
     * Opens a sqlite file of the browser file system into memory.
     * @param {Object} opts
     * @param {string} opts.path - required, OPFS path of the file (what `fs.resolve` returns for a downloaded file).
     * @returns {Promise<SqliteConn>} The connection. The caller must `close()` it.
     * @throws {TypeError} If opts.path is missing.
     * @throws {I6Error} With code "asset" if the file cannot be read or is not a sqlite file.
     */
    async open(opts) {
      if (!opts || !opts.path) throw new TypeError("sqlitez: opts.path is required");
      let bytes;
      try {
        const segments = opts.path.split("/");
        const fileName = segments.pop();
        let dir = await navigator.storage.getDirectory();
        for (const segment of segments) dir = await dir.getDirectoryHandle(segment);
        const file = await (await dir.getFileHandle(fileName)).getFile();
        bytes = new Uint8Array(await file.arrayBuffer());
      } catch (cause) {
        throw new I6Error(`sqlitez: could not read ${opts.path}: ${cause.message}`, { code: "asset", cause });
      }
      if (new TextDecoder().decode(bytes.subarray(0, 16)) !== SQLITE_HEADER) {
        throw new I6Error(`sqlitez: ${opts.path} is not a sqlite file`, { code: "asset" });
      }
      const SQL = await loadSqlJs();
      return new SqliteConn(new SQL.Database(bytes));
    }
  };
  var sqlitez = new Sqlitez();

  // src/infer/litert.js
  var LITERT_VERSION = "2.5.3";
  var LITERT_WASM_URL = `https://cdn.jsdelivr.net/npm/@litertjs/core@${LITERT_VERSION}/wasm/`;
  var DTYPE_CTORS = { float32: Float32Array, int32: Int32Array, uint8: Uint8Array };
  var loadedModel = null;
  async function loadModel(opts) {
    const key = `${opts.ref.name}@${opts.ref.version}`;
    if (loadedModel?.key === key) return loadedModel.compiled;
    const bytes = await fs.read(opts.ref);
    if (new TextDecoder().decode(bytes.subarray(4, 8)) !== "TFL3") {
      throw new I6Error(`infer: ${opts.ref.name} is not a tflite file`, { code: "asset" });
    }
    const litert = await Promise.resolve().then(() => (init_dist2(), dist_exports));
    const loading = litert.getGlobalLiteRtPromise();
    if (loading) await loading;
    else await litert.loadLiteRt(opts.wasmUrl ?? LITERT_WASM_URL);
    const compiled = await litert.loadAndCompile(bytes, { accelerator: "wasm" });
    if (loadedModel) loadedModel.compiled.delete();
    loadedModel = { key, litert, compiled };
    return compiled;
  }
  function describeModel(model) {
    const describe = (d) => ({ name: d.name, dtype: d.dtype, shape: Array.from(d.shape) });
    return { inputs: model.getInputDetails().map(describe), outputs: model.getOutputDetails().map(describe) };
  }
  function toTensorData(name, input, modelShape) {
    const invalid = (msg) => new I6Error(`infer: input "${name}" ${msg}`, { code: "invalid_argument" });
    const { data, shape } = input;
    if (!Array.isArray(data)) throw invalid("has no data array");
    if (!Array.isArray(shape)) throw invalid("has no shape");
    if (shape.length !== modelShape.length || shape.some((n, i) => modelShape[i] !== -1 && modelShape[i] !== n)) {
      throw invalid(`has shape [${shape}], the model needs [${modelShape}]`);
    }
    const size = shape.reduce((a, n) => a * n, 1);
    if (data.length !== size) throw invalid(`has ${data.length} values, its shape [${shape}] needs ${size}`);
    return { flat: data, shape: [...shape] };
  }
  async function runModel(model, inputs) {
    const tensors = {};
    let raw = {};
    try {
      for (const detail of model.getInputDetails()) {
        const input = inputs?.[detail.name];
        if (!input) throw new I6Error(`infer: input "${detail.name}" is missing`, { code: "invalid_argument" });
        const { flat, shape } = toTensorData(detail.name, input, Array.from(detail.shape));
        tensors[detail.name] = new loadedModel.litert.Tensor(new DTYPE_CTORS[detail.dtype](flat), shape);
      }
      raw = await model.run(tensors);
      const outputs = {};
      for (const [name, tensor] of Object.entries(raw)) outputs[name] = await tensor.data();
      return outputs;
    } finally {
      Object.values(raw).forEach((t) => t.delete());
      Object.values(tensors).forEach((t) => t.delete());
    }
  }

  // src/infer/infer.js
  var DEFAULT_LIMIT = 20;
  var FILES = { sqlite: "sqlite.bin", tflite: "tflite.bin" };
  var debug = (...args) => {
    if (globalThis.I6_DEBUG) console.log("infer:", ...args);
  };
  var Infer = class {
    /**
     * Constructs an Infer client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Runs the model for the given params and returns what the output query gives.
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<*>} The `ret` of the named query `model-${modelName}-output`.
     * @throws {I6Error} With code "invalid_argument" if opts is malformed or the model inputs do not fit the model,
     *   "asset" if a download fails, "model" if loading or running the model fails, "query" if the sqlite fails.
     */
    async run(opts) {
      validate(opts);
      const { modelName, params } = opts;
      const queryName = (kind) => `model-${modelName}-${kind}`;
      const urls = await this._assetUrls(opts);
      const cacheName = (kind) => `infer-${modelName}-${partitionsKey(opts.partitions)}-${kind}`;
      const [sqliteRef, tfliteRef] = await Promise.all([
        downloadFile(cacheName("sqlite"), urls.sqlite),
        downloadFile(cacheName("tflite"), urls.tflite)
      ]);
      const conn = await sqlitez.open({ path: await fs.resolve(sqliteRef) });
      try {
        const [inputs, compiled] = await Promise.all([
          conn.namedJsonQuery({ name: queryName("input"), params: [params] }),
          loadModel({ ref: tfliteRef, wasmUrl: opts.litertWasm })
        ]);
        if (!inputs || typeof inputs !== "object") throw new I6Error(`infer: ${queryName("input")} returned no model inputs`, { code: "query" });
        debug("input query returned", Object.keys(inputs), "model", describeModel(compiled));
        const outputs = await runModel(compiled, inputs);
        const result = await conn.namedJsonQuery({ name: queryName("output"), params: outputQueryParams(outputs, opts) });
        debug("output query returned", result);
        return result;
      } finally {
        await conn.close();
      }
    }
    /**
     * Finds where the model files are: the signed URLs of the model API, unless opts has both URLs (tests).
     * @private
     * @param {InferOptions} opts - Inference options.
     * @returns {Promise<{sqlite: string, tflite: string}>} Download URLs of the files.
     * @throws {I6Error} With code "asset" if the API gave no URL for a file.
     */
    async _assetUrls(opts) {
      if (opts.sqliteUrl) return { sqlite: opts.sqliteUrl, tflite: opts.tfliteUrl };
      const { modelName, partitions, dataset } = opts;
      const resp = await this._services.apis().dszModelGet({
        params: { dataset, model_name: modelName },
        payload: { model_version: opts.partitions.version, model_partitions: partitions }
      });
      const byName = Object.fromEntries((resp.payload?.urls ?? []).map((file) => [file.name, file.url]));
      const missing = Object.values(FILES).find((name) => !byName[name]);
      if (missing) {
        throw new I6Error(`infer: the model api gave no "${missing}" file: ${JSON.stringify(resp.error ?? Object.keys(byName))}`, { code: "asset" });
      }
      return { sqlite: byName[FILES.sqlite], tflite: byName[FILES.tflite] };
    }
  };
  function validate(opts) {
    for (const key of ["modelName", "dataset"]) {
      if (!opts || !opts[key]) throw new I6Error(`infer: opts.${key} is required`, { code: "invalid_argument" });
    }
    if (!isPartitions(opts.partitions)) {
      throw new I6Error("infer: opts.partitions must be an object of string values", { code: "invalid_argument" });
    }
    if (opts.params === void 0) throw new I6Error("infer: opts.params is required", { code: "invalid_argument" });
    if (opts.limit !== void 0 && !(Number.isInteger(opts.limit) && opts.limit > 0)) {
      throw new I6Error("infer: opts.limit must be a positive integer", { code: "invalid_argument" });
    }
    if (!opts.sqliteUrl !== !opts.tfliteUrl) {
      throw new I6Error("infer: opts.sqliteUrl and opts.tfliteUrl go together", { code: "invalid_argument" });
    }
  }
  function outputQueryParams(outputs, opts) {
    const named = Object.entries(outputs).map(([name, values]) => [name, { values: Array.from(values) }]);
    return [Object.fromEntries(named), opts.limit ?? DEFAULT_LIMIT];
  }

  // src/dash/dash.js
  var SQLITE_FILE = "sqlite.bin";
  var debug2 = (...args) => {
    if (globalThis.I6_DEBUG) console.log("dash:", ...args);
  };
  var Dash = class {
    /**
     * Constructs a Dash client instance.
     * @param {Services} services - The services manager instance.
     */
    constructor(services) {
      this._services = services;
    }
    /**
     * Downloads the dash sqlite (cached by etag), runs the named query `dash-${dashName}` with `params` and returns its result.
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<*>} The `ret` of the named query.
     * @throws {I6Error} With code "invalid_argument" if opts is malformed, "asset" if the download fails,
     *   "query" if the sqlite fails.
     */
    async query(opts) {
      validate2(opts);
      const url = await this._sqliteUrl(opts);
      const ref = await downloadFile(`dash-${opts.dashName}-${partitionsKey(opts.partitions)}-sqlite`, url);
      const conn = await sqlitez.open({ path: await fs.resolve(ref) });
      try {
        const name = `dash-${opts.dashName}`;
        const result = await conn.namedJsonQuery({ name, params: [opts.params] });
        debug2(`${name} returned`, result);
        return result;
      } finally {
        await conn.close();
      }
    }
    /**
     * Finds where the dash sqlite is: the signed URL of the model API (like Infer), unless opts has `sqliteUrl` (tests).
     * @private
     * @param {DashOptions} opts - Dash options.
     * @returns {Promise<string>} Download URL of the sqlite.
     * @throws {I6Error} With code "asset" if the API gave no URL.
     */
    async _sqliteUrl(opts) {
      if (opts.sqliteUrl) return opts.sqliteUrl;
      const { dashName, partitions, dataset } = opts;
      const resp = await this._services.apis().dszModelGet({
        params: { dataset, model_name: dashName },
        payload: { model_version: partitions.version, model_partitions: partitions }
      });
      const url = (resp.payload?.urls ?? []).find((file) => file.name === SQLITE_FILE)?.url;
      if (!url) throw new I6Error(`dash: the api gave no "${SQLITE_FILE}" file: ${JSON.stringify(resp.error ?? null)}`, { code: "asset" });
      return url;
    }
  };
  function validate2(opts) {
    for (const key of ["dashName", "dataset"]) {
      if (!opts || !opts[key]) throw new I6Error(`dash: opts.${key} is required`, { code: "invalid_argument" });
    }
    if (!isPartitions(opts.partitions)) {
      throw new I6Error("dash: opts.partitions must be an object of string values", { code: "invalid_argument" });
    }
    if (opts.params === void 0) throw new I6Error("dash: opts.params is required", { code: "invalid_argument" });
  }

  // src/services/services.js
  var Services = class {
    /**
     * Constructs a Services instance.
     * @param {I6SdkConfig} config - Configuration object for the SDK services.
     */
    constructor(config) {
      this._dispatcher = new EventTarget();
      this._config = config;
    }
    /**
     * Returns the SDK configuration.
     * @returns {I6SdkConfig} The configuration object.
     */
    config() {
      return this._config;
    }
    /**
     * Registers an event listener on the internal event dispatcher.
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt, fn) {
      this._dispatcher.addEventListener(evt, fn);
    }
    /**
     * Creates and returns an Invoker service instance.
     * @returns {Invoker} An instance of the Invoker client.
     */
    invoker() {
      const ret = new Invoker(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth() {
      const ret = new Auth(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest() {
      const ret = new Ingest(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Infer service instance.
     * @returns {Infer} An instance of the Infer client.
     */
    infer() {
      const ret = new Infer(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns a Dash service instance.
     * @returns {Dash} An instance of the Dash client.
     */
    dash() {
      const ret = new Dash(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
     * Creates and returns an Apis service instance.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis() {
      const ret = new Apis(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
    /**
    * Creates and returns a Funcs service instance.
    * @returns {SdkFuncs} An instance of the generated SdkFuncs client.
    */
    funcs() {
      const ret = new SdkFuncs(this);
      if (ret.prepare) {
        ret.prepare();
      }
      return ret;
    }
  };

  // src/index.js
  var DEFAULT_CONFIG = {
    baseUrl: "https://decsuite.sandbox.rs.infinity6.ai"
    // baseUrl: "http://localhost:9021",
  };
  var I6Sdk = class {
    /**
     * Constructs an instance of the i6 SDK.
     * @param {I6SdkConfig} [config] - Configuration options for the SDK.
     */
    constructor(config) {
      this._service = new Services(this._config = {
        ...DEFAULT_CONFIG,
        ...config
      });
    }
    /**
     * Returns an Ingest service instance.
     * @returns {Ingest} An instance of the Ingest client.
     */
    ingest() {
      return this._service.ingest();
    }
    /**
     * Returns an Infer service instance, which runs an i6 model in the browser and returns the result.
     * @returns {Infer} An instance of the Infer client.
     */
    infer() {
      return this._service.infer();
    }
    /**
     * Returns a Dash service instance, which queries an i6 dash in the browser and returns the result.
     * @returns {Dash} An instance of the Dash client.
     */
    dash() {
      return this._service.dash();
    }
    /**
     * Returns an Auth service instance.
     * @returns {Auth} An instance of the Auth client.
     */
    auth() {
      return this._service.auth();
    }
    /**
     * Returns the Apis service instance, one typed method per i6 server API.
     * Each call resolves with `{status, ok, payload?, error?}` and does not throw on an HTTP error.
     * @returns {Apis} An instance of the generated Apis client.
     */
    apis() {
      return this._service.apis();
    }
    /**
     * Returns the Funcs service instance.
     * @returns {SdkFuncs} An instance of the generated Apis client.
     */
    funcs() {
      return this._service.funcs();
    }
    /**
     * Registers an event listener on the SDK's internal event dispatcher (an EventTarget).
     * @param {string} evt - The event type or name to listen for.
     * @param {EventListenerOrEventListenerObject|Function} fn - The callback function or event listener object invoked when the event occurs.
     * @returns {void}
     */
    bind(evt, fn) {
      this._service.bind(evt, fn);
    }
  };
  I6Sdk.I6Error = I6Error;
  window.I6Sdk = I6Sdk;
})();
//# sourceMappingURL=i6sdk-web.js.map
