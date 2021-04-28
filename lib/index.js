const utc = require('dayjs/plugin/utc.js');
const timezone = require('dayjs/plugin/timezone.js');
const dayjs = require('dayjs');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
  convertTimeZone(time, timezone, format = 'YYYY-MM-DDTHH:mm:ssZ') {
    return dayjs(time).tz(timezone).format(format);
  },
  getTimeZone(time) {
    return dayjs(time).format('Z');
  }
};
