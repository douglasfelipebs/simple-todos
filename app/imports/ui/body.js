import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks';

import './body.html';
import './task.js';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.body.onCreated(function () {
  const self = this;
  self.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks () {
    const instance = Template.instance();
    const selector = {};
    if (instance.state.get('hideCompleted')) {
      selector.checked = { $ne: true };
    }

    const text = instance.state.get('textSearch');
    if (text) {
      selector.text = { $regex: text, $options: 'gi' };
    }
    // Otherwise, return all of the tasks
    return Tasks.find(selector, { sort: { previsao: 1 } });
  },
  incompleteCount () {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit #formInsert': function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const previsao = new Date(target.previsao.value);

    if (!Meteor.user()) {
      return 'nao_logado';
    }

    // Insert a task into the collection
    Meteor.call('tasks.insert', { text, previsao });

    // Clear form
    target.text.value = '';
    target.previsao.value = '';
  },
  'input [name=search]': function (event, instance) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const search = event.target.value;

    if (search) {
      instance.state.set('textSearch', search);
    } else {
      instance.state.set('textSearch', false);
    }
  },
  'change .hide-completed input' (event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});