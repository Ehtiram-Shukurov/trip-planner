import Controller from '@ember/controller';
import { htmlSafe } from '@ember/template';

export default class MemoryIndexController extends Controller {

    getAnimationDelay(index) {
        const delay = index * 0.1; // Calculate delay based on index
        return htmlSafe(`animation-delay: ${delay}s;`);
      }
}
