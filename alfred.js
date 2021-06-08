const TimeZoneConverter = require('./lib/index.js');

const timeZoneConverter = new TimeZoneConverter();
timeZoneConverter.setParamsFromCli();
let items = [];

if (!timeZoneConverter.hasTime()) {
  const result = timeZoneConverter.getResult();
  items = [
    ...items,
    {
      title: result,
      subtitle: 'Current time',
      arg: result,
      autocomplete: 'now',
      variables: {
        time: timeZoneConverter.time,
        result: timeZoneConverter.getResult(),
        // timeZone: timeZoneConverter.timeZone,
        // fromTimeZone: timeZoneConverter.fromTimeZone,
        // format: timeZoneConverter.format,
      },
      text: {
        copy: result,
        largetype: result,
      },
    },
  ];
}
if (timeZoneConverter.hasTime() && !timeZoneConverter.hasTimeZone()) {
  items = [
    ...items,
    ...TimeZoneConverter.getTimeZones()
      .map((timeZone) => {
        const tzc = new TimeZoneConverter()
        const result = TimeZoneConverter.convertTimeZone(timeZoneConverter.time, timeZone);
        return {
          title: result,
          subtitle: timeZone,
          arg: timeZone,
          autocomplete: timeZone,
          variables: {
            time: timeZoneConverter.time,
            timeZone: timeZone,
            result: timeZoneConverter.getResult(),
          },
          text: {
            copy: result,
            largetype: result,
          },
        };
      }, [])
  ];
}
if (timeZoneConverter.hasTime() && timeZoneConverter.hasTimeZone() && !timeZoneConverter.hasFormat()) {
  items = [
    ...items,
    ...TimeZoneConverter.getDefaultFormats()
      .map((info) => {
        const result = timeZoneConverter.getResult(info.format);
        return {
          title: result,
          subtitle: `${info.name} ${info.format}`,
          arg: info.format,
          autocomplete: info.name,
          variables: {
            time: timeZoneConverter.time,
            timeZone: timeZoneConverter.timeZone,
            format: info.format,
            result: result,
          },
          text: {
            copy: result,
            largetype: result,
          },
        }
      })
  ]
}

if (timeZoneConverter.hasTime() && timeZoneConverter.hasTimeZone() && timeZoneConverter.hasFormat()) {
  const result = timeZoneConverter.getResult();
  items = [
    {
      title: result,
      subtitle: `${timeZoneConverter.time} -> ${timeZoneConverter.timeZone} -> ${timeZoneConverter.format}`,
      arg: result,
      autocomplete: true,
      variables: {
        time: timeZoneConverter.time,
        timeZone: timeZoneConverter.timeZone,
        format: info.format,
        result: result,
      },
      text: {
        copy: result,
        largetype: result,
      },
    }
  ];
}


//
// if (!timeZoneConverter.hasTimeZone()) {
//   items = [
//     ...items,
//     ...TimeZoneConverter.getTimeZones()
//       .map((timeZone) => {
//         return {
//           title: TimeZoneConverter.convertTimeZone(timeZoneConverter.time, timeZone),
//           subtitle: timeZone,
//           arg: timeZone,
//           autocomplete: timeZone,
//           variables: {
//             time: timeZoneConverter.time,
//             timeZone,
//             q: timeZoneConverter.cli.input.join(' '),
//           },
//           mods: {
//             yo: {
//               valid: true,
//               arg: 'he',
//               subtitle: 'gooo',
//             }
//           },
//         };
//       })
//   ];
// }
//
// items = [
//   ...items,
//   ...TimeZoneConverter.getDefaultFormats()
//     .map((format) => {
//       return {
//         title: format.name,
//         subtitle: timeZoneConverter.getResult(format.format),
//         arg: timeZoneConverter.getResult(format.format),
//         autocomplete: format.name,
//         variables: {
//           time: timeZoneConverter.time,
//           timeZone: timeZoneConverter.timeZone,
//           format: format.format,
//           finish: true,
//         },
//       };
//     })
// ];
// console.log(items);
process.stdout.write(JSON.stringify({ items }));

// const  items = [
//     ...items,
//     {
//       title: resultIso,
//       subtitle: 'ISO 8601',
//       arg: resultIso,
//       autocomplete: 'ISO 8601',
//       variables,
//     },
//     {
//       title: resultIsoNoZone,
//       subtitle: 'ISO 8601 (No Timezone)',
//       arg: resultIsoNoZone,
//       variables,
//     },
//     {
//       title: resultDateTime,
//       subtitle: 'Date time',
//       arg: resultDateTime,
//       variables,
//     },
//   ];

// process.stdout.write(timeZoneConverter.convert());