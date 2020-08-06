import { Template } from 'meteor/templating';
import { check } from 'meteor/check';
import moment from 'moment';

Template.registerHelper('formataDataBrasileira', function (data){
  check(data, Date);
  return moment(data).utc().format('DD/MM/YYYY');
});