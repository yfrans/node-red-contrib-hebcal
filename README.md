# node-red-contrib-hebcal
Hebrew calendar helper for Node-Red.

This package is based on [@hebcal/core](https://www.npmjs.com/package/@hebcal/core) but not related to the original package in any way.

## Usage
This package contains two nodes:
- hebcal-event
- is-holiday

### hebcal-event
This node send event when holiday (or Shabbat) starts / ends. The payload contains the information about the holiday raising this event:

```{ issurMelacha: Boolean, holiday: { name: String, from: Date, to: Date } }```

### is-holiday
Checks if *now* is holiday (issurMelacha === true), return the status on two outputs (regular / issur-melacha).

## Configuration
In order to determine the correct holiday start / end values this package uses latitaude, longitude and "is-israel" flag (based on @hebcal/core constructor).