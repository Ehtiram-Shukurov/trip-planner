import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { later } from '@ember/runloop';

export default class DatePickerController extends Controller {
  @service database;
  @service router;
  @tracked litepicker;
  @tracked today = new Date();
  @tracked startDate = new Date();
  @tracked endDate = null;
  @tracked dates = [];

  constructor() {
    super(...arguments);
    window.addEventListener('resize', this.handleResize);
  }

  @action
  registerAPI(litepicker) {
    this.litepicker = litepicker;
    this.today.setHours(0, 0, 0, 0);
    this.litepicker.setOptions({
      minDate: this.today,
    });

    const formatDate = (date) => {
      if (!date) return 'Not selected';
      const options = { day: '2-digit', month: 'long', year: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    this.litepicker.on('selected', (startDate, endDate) => {
      const startDateDisplay = document.querySelector('#startDateDisplay span');
      const endDateDisplay = document.querySelector('#endDateDisplay span');

      const start = startDate?.dateInstance || null;
      const end = endDate?.dateInstance || null;

      startDateDisplay.textContent = formatDate(start);
      endDateDisplay.textContent = formatDate(end);
    });

    later(() => {
      let input = document.querySelector('.litepicker-container input');
      input.style = 'display: none';
    }, 50);
  }

  @action
  onDateChanged(startDate, endDate) {
    this.dates = [];
    if (
      startDate.dateInstance < this.today ||
      endDate.dateInstance < this.today
    ) {
      alert('Date has already passed.');
      document.querySelector('#ember77').value = '';

      this.litepicker.clearSelection();
      this.litepicker.gotoDate(this.today);

      return;
    }

    this.startDate = startDate;
    this.endDate = endDate;

    let currentDate = new Date(this.startDate.dateInstance);

    //gets the range of dates from startDate to endDate
    while (currentDate <= this.endDate.dateInstance) {
      this.dates.push(new Date(currentDate.getTime()));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  @action
  async validateAndNavigate() {
    if (!this.dates.length) {
      alert('Please enter a valid date range.');
      return;
    }

    await this.database.addDays(
      this.startDate.dateInstance,
      this.endDate.dateInstance,
      this.model,
    );

    this.router.transitionTo('date', this.model);
  }

  get isMobile() {
    // code below from https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
}
