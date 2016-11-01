import {WebAPI} from './web-api';

export class App {
  static inject() { return [WebAPI]; }

  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router){
    config.title = 'Contacts';
    config.map([
      { route: '',                moduleId: 'login',   title: 'login'},
      { route: 'tidrapport/:id',  moduleId: 'tid-rapport',    name: 'tidrapport' },
    ]);

    this.router = router;
  }
}