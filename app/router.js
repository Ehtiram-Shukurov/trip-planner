import EmberRouter from '@ember/routing/router';
import config from 'project-2-big-chungus/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('destination');
  this.route('date-picker');
  this.route('date', function () {
    this.route('detail', {
      path: '/:date_id',
    });

    this.route('index', {
      path: '/',
    });
  });
  this.route('addactivity', { path: '/addactivity/:date_id' });
  this.route('result');

  this.route('notFound', { path: '/*path' });

  this.route('memory', {
    path: '/memory/:id',
  });

  this.route('home');
});
