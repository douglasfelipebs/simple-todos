// This code only runs on the server
import { Meteor } from "meteor/meteor";
import { Tasks } from '../tasks';

Meteor.publish('tasks', function () {
  return Tasks.find({
    $or: [
      { private: { $ne: true } },
      { owner: this.userId },
    ],
  });
});