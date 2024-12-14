import EmberRouter from '@ember/routing/router';
import config from 'project-2-big-chungus/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('destination', { path: '/destination/:trip_id' });
  this.route('date-picker', { path: '/date-picker/:trip_id' });
  this.route('date', function () {
    this.route('detail', {
      path: '/:trip_id/:date_id',
    });

    this.route('index', {
      path: '/:trip_id',
    });
  });

  this.route('addactivity', { path: '/addactivity/:trip_id/:date_id' });
  this.route('editactivity', {
    path: '/editactivity/:trip_id/:date_id/:activity_id',
  });
  this.route('result');

  this.route('notFound', { path: '/*path' });

  this.route('memory', function () {
    this.route('journal', {
      path: '/:trip_id/:date_id',
    });

    this.route('index', {
      path: '/:trip_id',
    });
  });

  this.route('index', { path: '/' });
  this.route('home');
  this.route('edittrip', { path: '/edittrip/:trip_id' });
});
