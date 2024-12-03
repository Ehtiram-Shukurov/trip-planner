import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DatePickerController extends Controller {
  @tracked
  litepicker;
  @tracked
  today = new Date();

  @tracked
  startDate = new Date();
  @tracked
  endDate = null;

  @tracked
  isMobile = window.innerWidth <= 767;

  constructor() {
    super(...arguments);
    window.addEventListener('resize', this.handleResize);
  }

  @action
  registerAPI(litepicker) {
    this.litepicker = litepicker;

    this.today.setHours(0, 0, 0, 0); // Ensure we use the date part only, no time component
    this.litepicker.setOptions({
      minDate: this.today, // Allow today's date to be selectable
    });
  }

  @action
  show() {
    this.litepicker.show();
  }

  @action
  onDateChanged(startDate, endDate) {
    this.startDate = startDate;
    this.endDate = endDate;

    let dates = [];
    let currentDate = new Date(startDate.dateInstance);

    //gets the range of dates from startDate to endDate
    while (currentDate <= endDate.dateInstance) {
      dates.push(new Date(currentDate.getTime()));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(dates);
  }

  @action
  handleResize() {
    this.isMobile = window.innerWidth <= 767;
  }
}
