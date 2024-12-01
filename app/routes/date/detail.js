import Route from '@ember/routing/route';

export default class DateDetailRoute extends Route {
  model(params) {
    const { date_id } = params;

    // Sample for now
    const activities = [
      { time: '10:00 AM', location: 'Park', budget: 'Free' },
      { time: '12:30 PM', location: 'Cafe', budget: '$20' },
      { time: '3:00 PM', location: 'Museum', budget: '$15' },
    ];

    return {
      date: date_id,
      activities,
    };
  }
}
