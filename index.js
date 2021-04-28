const meow = require('meow');
const utc = require('dayjs/plugin/utc.js');
const timezone = require('dayjs/plugin/timezone.js');
const dayjs = require('dayjs');
dayjs.extend(utc);
dayjs.extend(timezone);
const { convertTimeZone } = require('./lib/index.js');

const FORMAT_ISO = 'YYYY-MM-DDTHH:mm:ssZ';
const FORMAT_ISO_NO_ZONE = 'YYYY-MM-DDTHH:mm:ss';
const FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm:ss'

const cli = meow(`tzc`, {
  flags: {
    timezone: {
      type: 'string',
      alias: 'z',
      default: dayjs.tz.guess(),
    },
    time: {
      type: 'string',
      alias: 't',
      default: dayjs().toISOString(),
    },
    format: {
      type: 'string',
      alias: 'f',
      default: FORMAT_ISO,
    },
    alfred: {
      type: 'boolean',
      alias: 'a',
      default: false,
    },
  },
});

const time = cli.input[0] || cli.flags.time;
const tz = cli.input[1] || cli.flags.timezone;
const format = cli.input[2] || cli.flags.format;

// console.log(convertTimeZone(cli.flags.time, cli.flags.timezone));
if (cli.flags.alfred) {
  const resultIso = convertTimeZone(time, tz, FORMAT_ISO);
  const resultIsoNoZone = convertTimeZone(time, tz, FORMAT_ISO_NO_ZONE);
  const resultDateTime = convertTimeZone(time, tz, FORMAT_DATE_TIME);
  let items = [];
  if (format !== FORMAT_ISO) {
    const resultFormat = convertTimeZone(time, tz, format);
    items = [
      {
        title: resultFormat,
        subtitle: `${format}`,
        arg: resultFormat,
      },
    ]
  }

  items = [
    ...items,
    {
      title: resultIso,
      subtitle: 'ISO 8601',
      arg: resultIso,
    },
    {
      title: resultIsoNoZone,
      subtitle: 'ISO 8601 (No Timezone)',
      arg: resultIsoNoZone,
    },
    {
      title: resultDateTime,
      subtitle: 'Date time',
      arg: resultDateTime,
    },
  ];
  process.stdout.write(JSON.stringify({ items }));
} else {
  process.stdout.write(convertTimeZone(time, tz, format));
}