import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class DateDetailController extends Controller {
  @service database;
  @service router;
  @action
  async deleteActivity(activity_id) {
    if (confirm('Are you sure you want to delete this activity?')) {
      await this.database.deleteActivity(
        this.model.trip_id,
        this.model.date_id,
        activity_id,
      );
      this.router.refresh();
    }
  }
}
