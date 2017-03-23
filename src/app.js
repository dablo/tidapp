import { WebAPI } from './web-api';

export class App {
  static inject() { return [WebAPI]; }

  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    config.title = 'Contacts';
    config.addPipelineStep('authorize', AuthorizeStep)
    config.map([
      { route: ['', 'login'], moduleId: 'login', title: 'login' },
      { route: 'tidrapport/:id', moduleId: 'tid-rapport', name: 'tidrapport', settings: { auth: true } },
    ]);

    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      var isLoggedIn = true;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}