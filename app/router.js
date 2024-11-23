import EmberRouter from "@ember/routing/router";
import config from "project-2-big-chungus/config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route("test");
  this.route("date");
  this.route("day", { path: "/date/:date_id" });
  this.route("addactivity", { path: "/addactivity/:date_id" });
});
