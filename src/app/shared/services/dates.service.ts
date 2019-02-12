import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DatesService {

  days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  day = (date?: Date) => {
    const day = date ? moment(date).weekday() : moment().weekday()

    switch (day) {
      case 0:
        return 'sunday'
      case 1:
        return 'monday'
      case 2:
        return 'tuesday'
      case 3:
        return 'wednesday'
      case 4:
        return 'thursday'
      case 5:
        return 'friday'
      case 6:
        return 'saturday'
    }
  }


  constructor() { }

  time = (time1) => {
    time1 = time1 || new Date()
    return {
      diff: (time2) => {
        let value = moment(time1).diff(moment(time2), 'seconds')
        if (value < 0) {
          value = -value
        }

        return value
      },

      span: (time2?: any) => {
        let value = 0;

        if (typeof time1 === 'number' && !time2) {
          value = time1
        } else {
          const date = moment()

          const timeA = date
            .set('hour', moment(time1).get('hour'))
            .set('minute', moment(time1).get('minute'))
            .set('second', moment(time1).get('second'))
            .set('millisecond', moment(time1).get('millisecond')).toDate()

          const timeB = date
            .set('hour', moment(time2).get('hour'))
            .set('minute', moment(time2).get('minute'))
            .set('second', moment(time2).get('second'))
            .set('millisecond', moment(time2).get('millisecond')).toDate()

          value = moment(timeA).diff(moment(timeB), 'minutes')
        }

        if (value < 0) {
          value = -value
        }

        let hours = value / 60

        hours = parseInt(hours.toFixed(2))
        const minutes = value - hours * 60;
        let hoursText = '00'
        let minutesText = '00'

        if (hours < 10) {
          hoursText = `0${hours}`
        } else {
          hoursText = `${hours}`

        }

        if (minutes < 10) {
          minutesText = `0${minutes}`
        } else {
          minutesText = `${minutes}`
        }
        return `${hoursText}:${minutesText}`

      },
      lt: (time2) => {
        if (!time2 || (!time1 && !time2)) {
          return false
        }

        if (!time1) {
          return true
        }

        const date = new Date()

        const timeA = moment(date)
          .set('hour', moment(time1).hour())
          .set('minute', moment(time1).minutes())
          .set('second', moment(time1).seconds())

        const timeB = moment(date)
          .set('hour', moment(time2).hour())
          .set('minute', moment(time2).minutes())
          .set('second', moment(time2).seconds())

        return (timeA.isBefore(timeB, 's'))
      },
      gt: (time2) => {
        if (!time2 || (!time1 && !time2)) {
          return false
        }

        if (!time1) {
          return true
        }

        const date = new Date()

        const timeA = moment(date)
          .set('hour', moment(time1).hour())
          .set('minute', moment(time1).minutes())
          .set('second', moment(time1).seconds())

        const timeB = moment(date)
          .set('hour', moment(time2).hour())
          .set('minute', moment(time2).minutes())
          .set('second', moment(time2).seconds())

        return (timeA.isAfter(timeB, 's'))
      }
    }
  }

  date = (date1) => {
    date1 = date1 || new Date()
    return {
      diff: (date2) => {
        const day1 = moment(date1).startOf('day')
        const day2 = moment(date2).startOf('day')
        let value = moment(day1).diff(day2, 'd')
        if (value < 0) {
          value = -value
        }

        return value + 1
      },
      day: () => {
        return this.day(date1)
      },
      bod: () => {
        return moment(date1).startOf('day').toDate()
      },

      bom: () => {
        return moment(date1).startOf('month').toDate()
      },
      previousWeek: () => {
        return moment(date1).subtract(7, 'days').startOf('day').toDate()
      },
      previousBod: () => {
        return moment(date1).subtract(1, 'day').startOf('day').toDate()
      },
      nextBod: () => {
        return moment(date1).add(1, 'day').startOf('day').toDate()
      },
      nextWeek: () => {
        return moment(date1).add(7, 'days').startOf('day').toDate()
      },
      eod: () => {
        return moment(date1).endOf('day').toDate()
      },
      eom: () => {
        return moment(date1).endOf('month').toDate()
      },
      add: (days) => {
        return moment(date1).add(days, 'day').toDate()
      },
      subtract: (days) => {
        return moment(date1).subtract(days, 'day').toDate()
      },
      setTime: (time) => {
        return moment(date1)
          .set('hour', moment(time).get('hour'))
          .set('minute', moment(time).get('minute'))
          .set('second', moment(time).get('second'))
          .set('millisecond', moment(time).get('millisecond')).toDate()
      },

      isSame: (date2) => {
        return moment(date1).startOf('day').isSame(moment(date2).startOf('day'))
      },

      isFuture: () => {
        return moment(date1).isAfter(new Date());
      },

      isPast: () => {
        return moment(date1).isBefore(new Date(), 'date')
      },
      isBetween: (from, till) => {
        return moment(date1).isBetween(moment(from), moment(till), 'day', '[]')
      },

      toString: (format) => {
        format = format || 'dddd, MMMM Do YYYY'
        return moment(date1).format('dddd, MMMM Do YYYY')
      },

      serialize: () => {
        return moment(date1).toDate().toISOString()
      }
    }
  }

}
