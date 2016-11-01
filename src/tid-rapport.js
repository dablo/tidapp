import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPI } from './web-api';
import { ContactUpdated, ContactViewed } from './messages';
import { areEqual } from './utility';
import { Period, Tidrapport, Tid, Dag, Kollega } from './tidrapport';
import Clipboard from 'clipboard';


export class ContactDetail {
  static inject = [WebAPI, EventAggregator];

  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
  }

  månader = [
    { id: 0, name: 'Januari' },
    { id: 1, name: 'Februari' },
    { id: 2, name: 'Mars' },
    { id: 3, name: 'April' },
    { id: 4, name: 'Maj' },
    { id: 5, name: 'Juni' },
    { id: 6, name: 'Juli' },
    { id: 7, name: 'Augusti' },
    { id: 8, name: 'September' },
    { id: 9, name: 'Oktober' },
    { id: 10, name: 'November' },
    { id: 11, name: 'December' },
  ];

  rapportText = '';

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    var clipboard = new Clipboard('.copyButton');
    clipboard.on('success', function (e) {
      console.log(e);
    });
    clipboard.on('error', function (e) {
      console.log(e);
    });

    return this.api.getContactDetails(params.id).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.initTidrapport();
      this.tidrapport.kollega = new Kollega(contact.firstName + ' ' + contact.lastName, contact.firstName + '.' + contact.lastName + '@aptitud.se')
      this.ea.publish(new ContactViewed(this.contact));
      this.rapportText = '';
    });

  }

  initTidrapport() {
    this.tidrapport = new Tidrapport();
    this.tidrapport.period = new Period();

    this.nyTid = new Tid();
    this.nyVabDag = new Dag();
    this.nySjukDag = new Dag();
    this.nySemesterDag = new Dag();
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
  }

  save() {
    // this.api.saveContact(this.contact).then(contact => {
    //   this.contact = contact;
    //   this.routeConfig.navModel.setTitle(contact.firstName);
    //   this.originalContact = JSON.parse(JSON.stringify(contact));
    //   this.ea.publish(new ContactUpdated(this.contact));
    // });

    this.uppdateraRapport();
  }

  uppdateraRapport() {
    this.rapportText = this.tidrapport.format();
  }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.contact)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new ContactViewed(this.contact));
      }

      return result;
    }

    return true;
  }

  addTid() {
    this.tidrapport.addTid(new Tid(this.nyTid.kund, this.nyTid.projekt, this.nyTid.timmar, this.nyTid.timpris));
    this.uppdateraRapport();
  }

  addVabDag() {
    this.tidrapport.addVab(new Dag(nyVabDag.datum, nyVabDag.kommentar));
    this.uppdateraRapport();
  }

  addSjukDag() {
    this.tidrapport.addSjukDag(new Dag(nySjukDag.datum, nySjukDag.kommentar));
    this.uppdateraRapport();
  }

  addSemesterDag() {
    this.tidrapport.addSemester(new Dag(nySemesterDag.datum, nySemesterDag.kommentar));
    this.uppdateraRapport();
  }
}