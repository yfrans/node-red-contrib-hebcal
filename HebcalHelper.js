const { HebrewCalendar, Location } = require('@hebcal/core');
const { EventEmitter } = require('events');

class HebcalHelper extends EventEmitter {
    constructor(lng, lat, il) {
        super();

        this._holidays = null;
        this._issurMelachaStarted = null;
        this._interval = null;
        this._buildYear = null;

        this._options = {
            isHebrewYear: false,
            candlelighting: true,
            location: new Location(lng, lat, il)
        };
    }

    issurMelachaStatus() {
        return !!this._issurMelachaStarted;
    }

    stopHolidayCheckInterval() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        this._holidays = null;
    }

    startHolidayCheckInterval() {
        if (this._interval) {
            return;
        }

        this.generateHolidaysIfNeeded();

        let now = new Date();
        this.checkHoliday(now);

        this._interval = setTimeout(() => {
            this.startHolidayCheckInterval();
        }, 1000);
    }

    getNextHoliday(date = null) {
        this.generateHolidaysIfNeeded();

        let now = date || new Date();
        let found = null;
        for (var i = 0; i < this._holidays.length && !found; i++) {
            if (this._holidays[i].to <= now) {
                if (this._holidays.length > i + 1) {
                    if (this._holidays[i + 1].from >= now) {
                        found = this._holidays[i + 1];
                    }
                }
            }
        }
        return found;
    }

    checkHoliday(date, emit = true) {
        this.generateHolidaysIfNeeded();

        let found = this._holidays.find(d => d.from <= date && d.to >= date);
        if (found) {
            if (emit) {
                this.setIssurMelacha(found);
            }
            return true;
        } else {
            if (emit) {
                this.setIssurMelacha();
            }
            return false;
        }
    }

    generateHolidaysIfNeeded() {
        if (!this._holidays) {
            this.generateHolidays();
            return;
        }

        // Just in case this script is running for too long without any reboot, rebuild the holidays storage
        if (this._buildYear > 0 && (new Date().getFullYear() - this._buildYear < 0)) {
            this.generateHolidays();
            return;
        }
    }

    generateHolidays() {
        this._buildYear = new Date().getFullYear();

        const events1 = HebrewCalendar.calendar({ ...this._options, year: new Date().getFullYear() });
        const events2 = HebrewCalendar.calendar({ ...this._options, year: new Date().getFullYear() + 1 });
        const events = events1.concat(events2);
        
        this._holidays = [];
        
        let lightingIndex = -1;
        for (const ev of events) {
            if (['Candle lighting', 'Havdalah'].includes(ev.getDesc())) {
                if (ev.getDesc() === 'Candle lighting' && lightingIndex === -1) {
                    this._holidays.push({
                        from: ev.eventTime,
                        name: ev.linkedEvent ? ev.linkedEvent.getDesc() : 'Shabbat'
                    });
                    lightingIndex = this._holidays.length - 1;
                } else if (ev.getDesc() === 'Havdalah') {
                    this._holidays[lightingIndex].to = ev.eventTime;
                    lightingIndex = -1;
                }
            }
        }
    }

    setIssurMelacha(date) {
        if (date) {
            if (this._issurMelachaStarted === date) {
                return;
            }
            this._issurMelachaStarted = date;
            this.emit('issur-melacha', true, this._issurMelachaStarted);
        } else {
            if (this._issurMelachaStarted) {
                this.emit('issur-melacha', false, this._issurMelachaStarted);
                this._issurMelachaStarted = null;
            }
        }
    }
}

module.exports = HebcalHelper;