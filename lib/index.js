const utc = require('dayjs/plugin/utc.js');
const timezone = require('dayjs/plugin/timezone.js');
const advancedFormat = require('dayjs/plugin/advancedFormat.js');
const dayjs = require('dayjs');
const meow = require('meow');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

class TimeZoneConverter {
  static FORMAT_ISO = 'YYYY-MM-DDTHH:mm:ssZ';
  static FORMAT_ISO_NO_ZONE = 'YYYY-MM-DDTHH:mm:ss';
  static FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
  static FORMAT_DATE_SLASH = 'YYYY/MM/DD';
  static FORMAT_TIME = 'HH:mm:ss';
  static FORMAT_UNIX_TIMESTAMP = 'X'

  static getDefaultFormats() {
    return [
      {
        name: 'ISO8601',
        format: this.FORMAT_ISO,
      },
      {
        name: 'ISO8601(without timezone)',
        format: this.FORMAT_ISO_NO_ZONE,
      },
      {
        name: 'MySQL DateTime',
        format: this.FORMAT_DATE_TIME,
      },
      {
        name: 'TIME',
        format: this.FORMAT_TIME,
      },
      {
        name: 'Unix Timestamp',
        format: this.FORMAT_UNIX_TIMESTAMP,
      },
    ];
  };

  static getTimeZones() {
    return [
      'UTC',
      'Asia/Tokyo',
      'Asia/Manila',
    ];
  };

  static convertTimeZone(time, timeZone, format = TimeZoneConverter.FORMAT_ISO) {
    return dayjs(time).tz(timeZone).format(format);
  }

  static convertTimeZoneFromTo(time, fromTimeZone, toTimeZone, format = TimeZoneConverter.FORMAT_ISO) {
    return dayjs.tz(time.replace(/\+(?:\d{4}|\d{2}:\d{2})$/, ''), fromTimeZone).tz(toTimeZone).format(format);
  }

  constructor(time = '', timeZone = '', format = '') {
    this.time = time;
    this.timeZone = timeZone;
    this.format = format;
    this.fromTimeZone = null;
    this.cli = null;
  }

  setTime(time) {
    if ((typeof time === 'string' && /^[0-9]+$/.test(time))) {
      this.time = dayjs.unix(parseInt(time, 10)).toISOString();
    } else {
      this.time = time;
    }
    return this;
  }

  setFromTimeZone(timeZone) {
    this.fromTimeZone = timeZone;
    return this;
  }

  setTimeZone(timeZone) {
    this.timeZone = timeZone;
    return this;
  }

  setFormat(format) {
    this.format = format;
    return this;
  }

  setParamsFromCli() {
    this.cli = meow(`tzc`, {
      flags: {
        time: {
          type: 'string',
          default: '',
        },
        fromTimeZone: {
          type: 'string',
          alias: ''
        },
        timeZone: {
          type: 'string',
          default: '',
        },
        format: {
          type: 'string',
          default: '',
        },
      },
    });

    // const time = cli.input[0] || cli.flags.time;
    // const timeZone = cli.input[1] || cli.flags.timezone;
    // const format = cli.input[2] || cli.flags.format;
    // this.inputs = {
    //   time,
    //   timeZone,
    //   format,
    //   isAlfredMode: cli.flags.alfred,
    // };
    // let fromTimeZone = '';

    if (this.cli.input.length) {
      if (this.hasTime()) {
        this.setTime(this.cli.input[0] === 'now' ? dayjs().toISOString() : this.cli.input[0]);
        this.setTimeZone(dayjs.tz.guess());
        this.setFormat(this.cli.flags.format);
      }
      if (this.hasTimeZone()) {
        this.setTimeZone(this.cli.input[1]);
      }
      if (this.hasFromTimeZone()) {
        this.setFromTimeZone(this.cli.input[1]);
        this.setTimeZone(this.cli.input[2]);
      }
    } else {
      const time = this.cli.flags.time === 'now' ? dayjs().toISOString() : this.cli.flags.time;
      this.setTime(time || dayjs().toISOString())
        .setTimeZone(this.cli.flags.timezone || dayjs.tz.guess())
        .setFormat(this.cli.flags.format);
      if (this.cli.flags.fromTimeZone) {
        this.setFromTimeZone(this.cli.flags.fromTimeZone);
      }
    }
    if (this.hasFormat()) {
      this.setFormat(this.cli.flags.format);
    } else {
      this.setFormat(TimeZoneConverter.FORMAT_ISO);
    }
  }

  hasTime() {
    return this.cli.input.length >= 1 || this.cli.flags.time;
  }

  hasTimeZone() {
    return this.cli.input.length >= 2  || this.cli.flags.timeZone;
  }

  hasFromTimeZone() {
    return this.cli.input.length >= 3 || this.cli.flags.fromTimeZone;
  }

  hasFormat() {
    return this.cli.flags.format;
  }

  getResult(format = null) {
    if (this.hasFromTimeZone()) {
      return TimeZoneConverter.convertTimeZoneFromTo(this.time, this.fromTimeZone, this.timeZone, format || this.format);
    } else {
      return TimeZoneConverter.convertTimeZone(this.time, this.timeZone, format || this.format);
    }
  }

  clone() {
    return new TimeZoneConver(this.time, );
  }
}

module.exports = TimeZoneConverter;

//
// module.exports = {
//   convertTimeZone(time, timezone, format = 'YYYY-MM-DDTHH:mm:ssZ') {
//     return dayjs(time).tz(timezone).format(format);
//   },
//   getTimeZone(time) {
//     return dayjs(time).format('Z');
//   },
//   parseCliInput() {
//     const cli = meow(`tzc`, {
//       flags: {
//         timezone: {
//           type: 'string',
//           alias: 'z',
//           default: dayjs.tz.guess(),
//         },
//         time: {
//           type: 'string',
//           alias: 't',
//           default: dayjs().toISOString(),
//         },
//         format: {
//           type: 'string',
//           alias: 'f',
//           default: FORMAT_ISO,
//         },
//         alfred: {
//           type: 'boolean',
//           alias: 'a',
//           default: false,
//         },
//       },
//     });
//
//     const time = cli.input[0] || cli.flags.time;
//     const tz = cli.input[1] || cli.flags.timezone;
//     const format = cli.input[2] || cli.flags.format;
//     return {
//       time,
//       tz,
//       format,
//       isAlfredMode: cli.flags.alfred,
//     };
//   },
// };
