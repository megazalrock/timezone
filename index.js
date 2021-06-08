const TimeZoneConverter = require('./lib/index.js');

const timeZoneConverter = new TimeZoneConverter();
timeZoneConverter.setParamsFromCli();

process.stdout.write(timeZoneConverter.getResult());
