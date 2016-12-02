define('app',['exports', './web-api'], function (exports, _webApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    App.inject = function inject() {
      return [_webApi.WebAPI];
    };

    function App(api) {
      _classCallCheck(this, App);

      this.api = api;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Contacts';
      config.map([{ route: '', moduleId: 'login', title: 'login' }, { route: 'tidrapport/:id', moduleId: 'tid-rapport', name: 'tidrapport' }]);

      this.router = router;
    };

    return App;
  }();
});
define('contact-detail',['exports', 'aurelia-event-aggregator', './web-api', './messages', './utility'], function (exports, _aureliaEventAggregator, _webApi, _messages, _utility) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactDetail = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _class, _temp;

  var ContactDetail = exports.ContactDetail = (_temp = _class = function () {
    function ContactDetail(api, ea) {
      _classCallCheck(this, ContactDetail);

      this.api = api;
      this.ea = ea;
    }

    ContactDetail.prototype.activate = function activate(params, routeConfig) {
      var _this = this;

      this.routeConfig = routeConfig;

      return this.api.getContactDetails(params.id).then(function (contact) {
        _this.contact = contact;
        _this.routeConfig.navModel.setTitle(contact.firstName);
        _this.originalContact = JSON.parse(JSON.stringify(contact));
        _this.ea.publish(new _messages.ContactViewed(_this.contact));
      });
    };

    ContactDetail.prototype.save = function save() {
      var _this2 = this;

      this.api.saveContact(this.contact).then(function (contact) {
        _this2.contact = contact;
        _this2.routeConfig.navModel.setTitle(contact.firstName);
        _this2.originalContact = JSON.parse(JSON.stringify(contact));
        _this2.ea.publish(new _messages.ContactUpdated(_this2.contact));
      });
    };

    ContactDetail.prototype.canDeactivate = function canDeactivate() {
      if (!(0, _utility.areEqual)(this.originalContact, this.contact)) {
        var result = confirm('You have unsaved changes. Are you sure you wish to leave?');

        if (!result) {
          this.ea.publish(new _messages.ContactViewed(this.contact));
        }

        return result;
      }

      return true;
    };

    _createClass(ContactDetail, [{
      key: 'canSave',
      get: function get() {
        return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
      }
    }]);

    return ContactDetail;
  }(), _class.inject = [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator], _temp);
});
define('contact-list',['exports', 'aurelia-event-aggregator', './web-api', './messages'], function (exports, _aureliaEventAggregator, _webApi, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class, _temp;

  var ContactList = exports.ContactList = (_temp = _class = function () {
    function ContactList(api, ea) {
      var _this = this;

      _classCallCheck(this, ContactList);

      this.api = api;
      this.contacts = [];

      ea.subscribe(_messages.ContactViewed, function (msg) {
        return _this.select(msg.contact);
      });
      ea.subscribe(_messages.ContactUpdated, function (msg) {
        var id = msg.contact.id;
        var found = _this.contacts.find(function (x) {
          return x.id === id;
        });
        Object.assign(found, msg.contact);
      });
    }

    ContactList.prototype.created = function created() {
      var _this2 = this;

      this.api.getContactList().then(function (contacts) {
        return _this2.contacts = contacts;
      });
    };

    ContactList.prototype.select = function select(contact) {
      this.selectedId = contact.id;
      return true;
    };

    return ContactList;
  }(), _class.inject = [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator], _temp);
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
define('login',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Login = exports.Login = function () {
    function Login() {
      _classCallCheck(this, Login);

      this.message = "Logga in";
      this.CLIENT_ID = '700644107821-v054i5qmree3l9lt84vfbhq5k9t2f35q.apps.googleusercontent.com';
      this.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
    }

    Login.prototype.activate = function activate(params, routeConfig) {
      this.routeConfig = routeConfig;
    };

    Login.prototype.checkAuth = function checkAuth() {
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
    };

    Login.prototype.handleAuthResult = function handleAuthResult(authResult) {
      var authorizeDiv = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        authorizeDiv.style.display = 'none';

        debugger;
      } else {
        authorizeDiv.style.display = 'inline';
      }
    };

    Login.prototype.handleAuthClick = function handleAuthClick(event) {
      gapi.auth.authorize({ client_id: CLIENT_ID, scope: SCOPES, immediate: false }, handleAuthResult);
      return false;
    };

    Login.prototype.loadGmailApi = function loadGmailApi() {
      gapi.client.load('gmail', 'v1', listLabels);
    };

    Login.prototype.listLabels = function listLabels() {
      var request = gapi.client.gmail.users.labels.list({
        'userId': 'me'
      });

      request.execute(function (resp) {
        var labels = resp.labels;
        appendPre('Labels:');

        if (labels && labels.length > 0) {
          for (i = 0; i < labels.length; i++) {
            var label = labels[i];
            appendPre(label.name);
          }
        } else {
          appendPre('No Labels found.');
        }
      });
    };

    Login.prototype.appendPre = function appendPre(message) {
      var pre = document.getElementById('output');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    };

    return Login;
  }();
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
    aurelia.use.standardConfiguration().plugin('aurelia-bootstrap-datepicker').feature('resources');

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
define('messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ContactUpdated = exports.ContactUpdated = function ContactUpdated(contact) {
    _classCallCheck(this, ContactUpdated);

    this.contact = contact;
  };

  var ContactViewed = exports.ContactViewed = function ContactViewed(contact) {
    _classCallCheck(this, ContactViewed);

    this.contact = contact;
  };
});
define('no-selection',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NoSelection = exports.NoSelection = function NoSelection() {
    _classCallCheck(this, NoSelection);

    this.message = "Please Select a Contact.";
  };
});
define('tid-rapport',['exports', 'aurelia-event-aggregator', './web-api', './messages', './utility', './tidrapport', 'clipboard'], function (exports, _aureliaEventAggregator, _webApi, _messages, _utility, _tidrapport, _clipboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactDetail = undefined;

  var _clipboard2 = _interopRequireDefault(_clipboard);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _class, _temp;

  var ContactDetail = exports.ContactDetail = (_temp = _class = function () {
    function ContactDetail(api, ea) {
      _classCallCheck(this, ContactDetail);

      this.månader = [{ id: 0, name: 'Januari' }, { id: 1, name: 'Februari' }, { id: 2, name: 'Mars' }, { id: 3, name: 'April' }, { id: 4, name: 'Maj' }, { id: 5, name: 'Juni' }, { id: 6, name: 'Juli' }, { id: 7, name: 'Augusti' }, { id: 8, name: 'September' }, { id: 9, name: 'Oktober' }, { id: 10, name: 'November' }, { id: 11, name: 'December' }];
      this.rapportText = '';

      this.api = api;
      this.ea = ea;
    }

    ContactDetail.prototype.activate = function activate(params, routeConfig) {
      var _this = this;

      this.routeConfig = routeConfig;

      var clipboard = new _clipboard2.default('.copyButton');
      clipboard.on('success', function (e) {
        console.log(e);
      });
      clipboard.on('error', function (e) {
        console.log(e);
      });

      return this.api.getContactDetails(params.id).then(function (contact) {
        _this.contact = contact;
        _this.routeConfig.navModel.setTitle(contact.firstName);
        _this.originalContact = JSON.parse(JSON.stringify(contact));
        _this.initTidrapport();
        _this.tidrapport.kollega = new _tidrapport.Kollega(contact.firstName + ' ' + contact.lastName, contact.firstName + '.' + contact.lastName + '@aptitud.se');
        _this.ea.publish(new _messages.ContactViewed(_this.contact));
        _this.rapportText = '';
      });
    };

    ContactDetail.prototype.initTidrapport = function initTidrapport() {
      this.tidrapport = new _tidrapport.Tidrapport();
      this.tidrapport.period = new _tidrapport.Period();

      this.nyTid = new _tidrapport.Tid();
      this.nyDag = new _tidrapport.Dag();
    };

    ContactDetail.prototype.save = function save() {

      this.uppdateraRapport();
    };

    ContactDetail.prototype.uppdateraRapport = function uppdateraRapport() {
      this.rapportText = this.tidrapport.format();
    };

    ContactDetail.prototype.canDeactivate = function canDeactivate() {
      if (!(0, _utility.areEqual)(this.originalContact, this.contact)) {
        var result = confirm('You have unsaved changes. Are you sure you wish to leave?');

        if (!result) {
          this.ea.publish(new _messages.ContactViewed(this.contact));
        }

        return result;
      }

      return true;
    };

    ContactDetail.prototype.addTid = function addTid() {
      this.tidrapport.addTid(new _tidrapport.Tid(this.nyTid.kund, this.nyTid.projekt, this.nyTid.timmar, this.nyTid.timpris));
      this.uppdateraRapport();
    };

    ContactDetail.prototype.removeTid = function removeTid(tid) {
      this.tidrapport.removeTid(tid);
      this.uppdateraRapport();
    };

    ContactDetail.prototype.addVabdag = function addVabdag() {
      this.tidrapport.addVab(new _tidrapport.Dag(this.nyDag.dag));
      this.uppdateraRapport();
    };

    ContactDetail.prototype.removeVabdag = function removeVabdag(dag) {
      this.tidrapport.removeVab(dag);
      this.uppdateraRapport();
    };

    ContactDetail.prototype.addSjukdag = function addSjukdag() {
      this.tidrapport.addSjukDag(new _tidrapport.Dag(this.nyDag.dag));
      this.uppdateraRapport();
    };

    ContactDetail.prototype.removeSjukdag = function removeSjukdag(dag) {
      this.tidrapport.removeSjukDag(dag);
      this.uppdateraRapport();
    };

    ContactDetail.prototype.addSemesterdag = function addSemesterdag() {
      this.tidrapport.addSemester(new _tidrapport.Dag(this.nyDag.dag));
      this.uppdateraRapport();
    };

    ContactDetail.prototype.removeSemesterdag = function removeSemesterdag(dag) {
      this.tidrapport.removeSemester(dag);
      this.uppdateraRapport();
    };

    ContactDetail.prototype.nyDagDateChanged = function nyDagDateChanged(datum) {
      debugger;
    };

    _createClass(ContactDetail, [{
      key: 'canSave',
      get: function get() {
        return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
      }
    }]);

    return ContactDetail;
  }(), _class.inject = [_webApi.WebAPI, _aureliaEventAggregator.EventAggregator], _temp);
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
            var index = this.projektTider.findIndex(function (x) {
                return x.projekt === tid.projekt && x.kund === tid.kund && x.timmar === tid.timmar && x.timpris === tid.timpris;
            });

            if (index !== -1) this.projektTider.splice(index);
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
            return this.projektTider.map(function (x) {
                return x.summa();
            }).reduce(function (a, b) {
                return a + b;
            }, 0);
        };

        Tidrapport.prototype.summaTimmar = function summaTimmar() {
            return this.projektTider.map(function (x) {
                return parseInt(x.timmar);
            }).reduce(function (a, b) {
                return a + b;
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
        function Dag() {
            var dag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var kommentar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            _classCallCheck(this, Dag);

            this.dag = dag;
            this.kommentar = kommentar;
        }

        Dag.prototype.format = function format() {
            return this.dag + ' ' + this.kommentar;
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

            var now = new Date();

            if (år > 0) {
                this.lastDay = new Date(år, månad + 1, 0);
                this.firstDay = new Date(år, (månad + 12) % 12, 1);
            } else {

                if (now.getDate() < 10) {
                    this.lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
                    this.firstDay = new Date(now.getFullYear(), (now.getMonth() - 1 + 12) % 12, 1);
                } else {
                    this.lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    this.firstDay = new Date(now.getFullYear(), (now.getMonth() + 12) % 12, 1);
                }
            }
        }

        Period.prototype.formatDate = function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        Period.prototype.format = function format() {
            return this.formatDate(this.firstDay) + ' - ' + this.formatDate(this.lastDay);
        };

        return Period;
    }();

    var Tid = exports.Tid = function () {
        function Tid() {
            var kund = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var projekt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var timmar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var timpris = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

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
define('utility',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.areEqual = areEqual;
	function areEqual(obj1, obj2) {
		return Object.keys(obj1).every(function (key) {
			return obj2.hasOwnProperty(key) && obj1[key] === obj2[key];
		});
	};
});
define('web-api',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var latency = 400;
  var id = 0;

  function getId() {
    return ++id;
  }

  var contacts = [{
    id: getId(),
    firstName: 'David',
    lastName: 'Blomberg',
    email: 'david.blomberg@aptitud.se',
    phoneNumber: '0733-099990'
  }, {
    id: getId(),
    firstName: 'Anders',
    lastName: 'Löwenborg',
    email: 'anders.lowenborg@aptitud.se',
    phoneNumber: '0733-099990'
  }, {
    id: getId(),
    firstName: 'Tomas',
    lastName: 'Näslund',
    email: 'tomas.naslund@aptitud.se',
    phoneNumber: '0733-099990'
  }, {
    id: getId(),
    firstName: 'Åsa',
    lastName: 'Liljegren',
    email: 'asa.liljegren@aptitud.se',
    phoneNumber: '0733-099990'
  }, {
    id: getId(),
    firstName: 'Håkan',
    lastName: 'Alexander',
    email: 'hakan.alexander@aptitud.se',
    phoneNumber: '867-5309'
  }];

  var WebAPI = exports.WebAPI = function () {
    function WebAPI() {
      _classCallCheck(this, WebAPI);

      this.isRequesting = false;
    }

    WebAPI.prototype.getContactList = function getContactList() {
      var _this = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var results = contacts.map(function (x) {
            return {
              id: x.id,
              firstName: x.firstName,
              lastName: x.lastName,
              email: x.email
            };
          });
          resolve(results);
          _this.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.getContactDetails = function getContactDetails(id) {
      var _this2 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var found = contacts.filter(function (x) {
            return x.id == id;
          })[0];
          resolve(JSON.parse(JSON.stringify(found)));
          _this2.isRequesting = false;
        }, latency);
      });
    };

    WebAPI.prototype.saveContact = function saveContact(contact) {
      var _this3 = this;

      this.isRequesting = true;
      return new Promise(function (resolve) {
        setTimeout(function () {
          var instance = JSON.parse(JSON.stringify(contact));
          var found = contacts.filter(function (x) {
            return x.id == contact.id;
          })[0];

          if (found) {
            var index = contacts.indexOf(found);
            contacts[index] = instance;
          } else {
            instance.id = getId();
            contacts.push(instance);
          }

          _this3.isRequesting = false;
          resolve(instance);
        }, latency);
      });
    };

    return WebAPI;
  }();
});
define('resources/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./elements/loading-indicator']);
  }
});
define('resources/elements/loading-indicator',['exports', 'nprogress', 'aurelia-framework'], function (exports, _nprogress, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LoadingIndicator = undefined;

  var nprogress = _interopRequireWildcard(_nprogress);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoadingIndicator = exports.LoadingIndicator = (0, _aureliaFramework.decorators)((0, _aureliaFramework.noView)(['nprogress/nprogress.css']), (0, _aureliaFramework.bindable)({ name: 'loading', defaultValue: false })).on(function () {
    function _class() {
      _classCallCheck(this, _class);
    }

    _class.prototype.loadingChanged = function loadingChanged(newValue) {
      if (newValue) {
        nprogress.start();
      } else {
        nprogress.done();
      }
    };

    return _class;
  }());
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n  <require from=\"./contact-list\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Tidapp</span>\n      </a>\n    </div>\n  </nav>\n\n  <loading-indicator loading.bind=\"router.isNavigating || api.isRequesting\"></loading-indicator>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <contact-list class=\"col-md-4\"></contact-list>\n      <router-view class=\"col-md-8\"></router-view>\n    </div>\n  </div>\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n"; });
define('text!contact-detail.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"panel panel-primary\">\r\n    <div class=\"panel-heading\">\r\n      <h3 class=\"panel-title\">Profile</h3>\r\n    </div>\r\n    <div class=\"panel-body\">\r\n      <form role=\"form\" class=\"form-horizontal\">\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">First Name</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"first name\" class=\"form-control\" value.bind=\"contact.firstName\">\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">Last Name</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"last name\" class=\"form-control\" value.bind=\"contact.lastName\">\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">Email</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"email\" class=\"form-control\" value.bind=\"contact.email\">\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label class=\"col-sm-2 control-label\">Phone Number</label>\r\n          <div class=\"col-sm-10\">\r\n            <input type=\"text\" placeholder=\"phone number\" class=\"form-control\" value.bind=\"contact.phoneNumber\">\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"button-bar\">\r\n    <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\r\n  </div>\r\n</template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"contact-list\">\r\n    <ul class=\"list-group\">\r\n      <li repeat.for=\"contact of contacts\" class=\"list-group-item ${contact.id === $parent.selectedId ? 'active' : ''}\">\r\n        <a route-href=\"route: tidrapport; params.bind: {id:contact.id}\" click.delegate=\"$parent.select(contact)\">\r\n          <h4 class=\"list-group-item-heading\">${contact.firstName} ${contact.lastName}</h4>\r\n          <p class=\"list-group-item-text\">${contact.email}</p>\r\n        </a>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</template>"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\r\n  <script type=\"text/javascript\">\r\n      // Your Client ID can be retrieved from your project in the Google\r\n      // Developer Console, https://console.developers.google.com\r\n      var CLIENT_ID = '700644107821-v054i5qmree3l9lt84vfbhq5k9t2f35q.apps.googleusercontent.com';\r\n\r\n      var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];\r\n\r\n      /**\r\n       * Check if current user has authorized this application.\r\n       */\r\n      function checkAuth() {\r\n        gapi.auth.authorize(\r\n          {\r\n            'client_id': CLIENT_ID,\r\n            'scope': SCOPES.join(' '),\r\n            'immediate': true\r\n          }, handleAuthResult);\r\n      }\r\n\r\n      /**\r\n       * Handle response from authorization server.\r\n       *\r\n       * @param {Object} authResult Authorization result.\r\n       */\r\n      function handleAuthResult(authResult) {\r\n        var authorizeDiv = document.getElementById('authorize-div');\r\n        if (authResult && !authResult.error) {\r\n          // Hide auth UI, then load client library.\r\n          authorizeDiv.style.display = 'none';\r\n          loadGmailApi();\r\n        } else {\r\n          // Show auth UI, allowing the user to initiate authorization by\r\n          // clicking authorize button.\r\n          authorizeDiv.style.display = 'inline';\r\n        }\r\n      }\r\n\r\n      /**\r\n       * Initiate auth flow in response to user clicking authorize button.\r\n       *\r\n       * @param {Event} event Button click event.\r\n       */\r\n      function handleAuthClick(event) {\r\n        gapi.auth.authorize(\r\n          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},\r\n          handleAuthResult);\r\n        return false;\r\n      }\r\n\r\n      /**\r\n       * Load Gmail API client library. List labels once client library\r\n       * is loaded.\r\n       */\r\n      function loadGmailApi() {\r\n        gapi.client.load('gmail', 'v1', listLabels);\r\n      }\r\n\r\n      /**\r\n       * Print all Labels in the authorized user's inbox. If no labels\r\n       * are found an appropriate message is printed.\r\n       */\r\n      function listLabels() {\r\n        var request = gapi.client.gmail.users.labels.list({\r\n          'userId': 'me'\r\n        });\r\n\r\n        request.execute(function(resp) {\r\n          var labels = resp.labels;\r\n          appendPre('Labels:');\r\n\r\n          if (labels && labels.length > 0) {\r\n            for (i = 0; i < labels.length; i++) {\r\n              var label = labels[i];\r\n              appendPre(label.name)\r\n            }\r\n          } else {\r\n            appendPre('No Labels found.');\r\n          }\r\n        });\r\n      }\r\n\r\n      /**\r\n       * Append a pre element to the body containing the given message\r\n       * as its text node.\r\n       *\r\n       * @param {string} message Text to be placed in pre element.\r\n       */\r\n      function appendPre(message) {\r\n        var pre = document.getElementById('output');\r\n        var textContent = document.createTextNode(message + '\\n');\r\n        pre.appendChild(textContent);\r\n      }\r\n\r\n    </script>\r\n    <script src=\"https://apis.google.com/js/client.js?onload=checkAuth\">\r\n    </script>\r\n  <div class=\"no-selection text-center\">\r\n    <h2>${message}</h2>\r\n    <div id=\"authorize-div\" style=\"display: none\">\r\n      <span>Authorize access to Gmail API</span>\r\n      <!--Button for the user to click to initiate auth sequence -->\r\n      <button id=\"authorize-button\" onclick=\"handleAuthClick(event)\">\r\n        Authorize\r\n      </button>\r\n    </div>\r\n\r\n  </div>\r\n</template>"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"no-selection text-center\">\r\n    <h2>${message}</h2>\r\n  </div>\r\n</template>"; });
define('text!tid-rapport.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div class=\"panel panel-primary\">\r\n\t\t<div class=\"panel-heading\">\r\n\t\t\t<h3 class=\"panel-title\">Tidrapport |> ${contact.firstName} ${contact.lastName}</h3>\r\n\t\t</div>\r\n\t\t<div class=\"panel-body\">\r\n\t\t\t<form role=\"form\" class=\"form-horizontal\">\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<label class=\"col-sm-3\">Kollega</label>\r\n\t\t\t\t\t<label class=\"col-sm-3\">Period</label>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<label class=\"col-sm-3\">${contact.firstName} ${contact.lastName}</label>\r\n\t\t\t\t\t<label class=\"col-sm-9\">${tidrapport.period.format()}</label>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<label class=\"col-sm-2\">Kund</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">Projekt</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">Timmar</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">Pris</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">Summa</label>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div class=\"row\" repeat.for=\"timmar of tidrapport.projektTider\">\r\n\t\t\t\t\t<label class=\"col-sm-2\">${timmar.kund}</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">${timmar.projekt}</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">${timmar.timmar}</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">${timmar.timpris}</label>\r\n\t\t\t\t\t<label class=\"col-sm-2\">${timmar.summa()}</label>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" click.delegate=\"removeTid(timmar)\">Ta bort</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<input type=\"text\" placeholder=\"kund\" class=\"form-control\" value.bind=\"nyTid.kund\">\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<input type=\"text\" placeholder=\"projekt\" class=\"form-control\" value.bind=\"nyTid.projekt\">\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<input type=\"text\" placeholder=\"timmar\" class=\"form-control\" value.bind=\"nyTid.timmar\">\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<input type=\"text\" placeholder=\"pris\" class=\"form-control\" value.bind=\"nyTid.timpris\">\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" click.delegate=\"addTid()\">Lägg till</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<label class=\"col-sm-2\">Frånvaro</label>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t\t<!--<div class=\"form-group\" repeat.for=\"dag of tidrapport.sjukDagar\">\r\n\t\t\t\t\t<label class=\"col-sm-2\">${dag.format()}</label>\r\n\t\t\t\t\t<button type=\"button\" class=\"close\" click.deletgate=\"removeSjukDag(dag)\">Ta bort</button>\r\n\t\t\t\t</div>-->\r\n\r\n\t\t\t\t<div class=\"form-group\">\r\n\t\t\t\t\t<div class=\"col-sm-4\">\r\n\t\t\t\t\t\t<input type=\"text\" placeholder=\"datum\" class=\"form-control\" value.bind=\"nyDag.dag\">\r\n\t\t\t\t\t\t<bootstrap-datepicker value.bind=\"'yyyy-mm-dd'\" dp-options.bind=\"dpOptions\" changedate.delegate=\"nyDagDateChanged($event)\"></bootstrap-datepicker>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" click.delegate=\"addSjukdag()\">Sjukdag</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" click.delegate=\"addVabdag()\">VAB</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"col-sm-2\">\r\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-default\" click.delegate=\"addSemesterdag()\">Semester</button>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\r\n\t\t\t</form>\r\n\t\t\t<pre id=\"rapport\">${rapportText}</pre>\r\n\t\t</div>\r\n\t</div>\r\n\r\n\t<div class=\"button-bar\">\r\n\t\t<button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Maila direkt</button>\r\n\t\t<!-- Trigger -->\r\n\t\t<button class=\"btn btn-success copyButton\" data-clipboard-target=\"#rapport\" disabled.bind=\"!rapportText\">Kopiera rapport</button>\r\n\t</div>\r\n\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map