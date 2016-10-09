define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);

    this.message = 'Hello World!';
  };
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('tidrapport',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Tidrapport = exports.Tidrapport = function () {
        function Tidrapport(kollega, period) {
            _classCallCheck(this, Tidrapport);

            this.kollega = kollega;
            this.period = period;
            this.projektTider = [];
            this.vabDagar = [];
            this.sjukDagar = [];
            this.semesterDagar = [];
        }

        Tidrapport.prototype.addTid = function addTid(tid) {
            this.projektTider.push(tid);
        };

        Tidrapport.prototype.removeTid = function removeTid(tid) {
            var index = this.projektTider.findIndex(tid);
            if (index !== -1) this.projektTider.splice(tid);
        };

        Tidrapport.prototype.addVab = function addVab(dag) {
            this.vabDagar.push(dag);
        };

        Tidrapport.prototype.removeVab = function removeVab(dag) {
            var index = this.vabDagar.findIndex(dag);
            if (index !== -1) this.vabDagar.splice(dag);
        };

        Tidrapport.prototype.addSjukDag = function addSjukDag(dag) {
            this.sjukDagar.push(dag);
        };

        Tidrapport.prototype.removeSjukDag = function removeSjukDag(dag) {
            var index = this.sjukDagar.findIndex(dag);
            if (index !== -1) this.sjukDagar.splice(dag);
        };

        Tidrapport.prototype.addSemester = function addSemester(dag) {
            this.semesterDagar.push(dag);
        };

        Tidrapport.prototype.removeSemester = function removeSemester(dag) {
            var index = this.semesterDagar.findIndex(dag);
            if (index !== -1) this.semesterDagar.splice(dag);
        };

        Tidrapport.prototype.summaFaktura = function summaFaktura() {
            return this.projektTider.reduce(function (a, b) {
                return a + b.summa();
            }, 0);
        };

        Tidrapport.prototype.summaTimmar = function summaTimmar() {
            return this.projektTider.reduce(function (a, b) {
                return a + b.timmar;
            }, 0);
        };

        Tidrapport.prototype.format = function format() {
            var rapport = '';

            rapport += 'Kollega             Period\n';
            rapport += (this.kollega.namn + '                    ').substring(0, 20) + this.period.format() + '\n\n';

            rapport += 'Kund           Projekt        Timmar    Pris      Summa\n';
            this.projektTider.forEach(function (tid) {
                rapport += tid.format() + '\n';
            });

            rapport += '--------------------------------------------------------\n';
            rapport += 'Totalt                        ' + (this.summaTimmar() + '          ').slice(0, 10) + '          ' + this.summaFaktura() + '\n';

            rapport += '\nSjuk\n';
            this.sjukDagar.forEach(function (dag) {
                rapport += dag.format() + '\n';
            });

            rapport += '\nVAB\n';
            this.vabDagar.forEach(function (dag) {
                rapport += dag.format() + '\n';
            });

            rapport += '\nSemester\n';
            this.semesterDagar.forEach(function (dag) {
                rapport += dag.format() + '\n';
            });

            return rapport;
        };

        return Tidrapport;
    }();

    var Dag = exports.Dag = function () {
        function Dag(datum, kommentar) {
            _classCallCheck(this, Dag);

            this.datum = datum;
            this.kommentar = kommentar;
        }

        Dag.prototype.format = function format() {
            return this.datum.toISOString().slice(0, 10) + ' ' + this.kommentar;
        };

        return Dag;
    }();

    var Kollega = exports.Kollega = function Kollega(namn, email) {
        _classCallCheck(this, Kollega);

        this.namn = namn;
        this.email = email;
    };

    var Period = exports.Period = function () {
        function Period(år, månad) {
            _classCallCheck(this, Period);

            this.år = år;
            this.månad = månad;
        }

        Period.prototype.format = function format() {
            var firstDay = new Date(this.år, this.månad - 1, 1);
            var lastDay = new Date(this.år, this.månad - 1 + 1, 0);

            return firstDay.toISOString().slice(0, 10) + ' - ' + lastDay.toISOString().slice(0, 10);
        };

        return Period;
    }();

    var Tid = exports.Tid = function () {
        function Tid(kund, projekt, timmar, timpris) {
            _classCallCheck(this, Tid);

            this.kund = kund;
            this.projekt = projekt;
            this.timmar = timmar;
            this.timpris = timpris;
        }

        Tid.prototype.summa = function summa() {
            return this.timmar * this.timpris;
        };

        Tid.prototype.format = function format() {
            var result = '';
            result += (this.kund + '               ').substring(0, 15);
            result += (this.projekt + '               ').substring(0, 15);
            result += (this.timmar + '          ').substring(0, 10);
            result += (this.timpris + '          ').substring(0, 10);
            result += (this.summa() + '          ').substring(0, 10);
            return result;
        };

        return Tid;
    }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <h1>${message}</h1>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map