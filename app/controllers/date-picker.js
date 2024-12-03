import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class DatePickerController extends Controller {
    @service router;
    @tracked litepicker;
    @tracked today = new Date()
    @tracked startDate = new Date();
    @tracked endDate = null;
    @tracked isMobile = window.innerWidth <= 767;
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

        document.querySelector('#ember77').placeholder = "YYYY-MM-DD - YYYY-MM-DD";
    }


    @action
    onDateChanged(startDate, endDate) {
        if (startDate.dateInstance < this.today || endDate.dateInstance < this.today) {
            alert("Date has already passed.")
            document.querySelector('#ember77').value = '';
            this.dates = [];
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

        console.log(this.dates);
    }

    @action
    handleResize() {
        this.isMobile = window.innerWidth <= 767;
    }

    @action
    async validateAndNavigate(){
        if(!this.dates.length) {
            alert('Please enter a valid date range.')
            return;
        }
        this.router.transitionTo("date");
    }
}
