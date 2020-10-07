import React, { useState } from 'react'
import moment from 'moment-timezone'
const user = require('../singletons/user-instance')

// Need Date to accept moment's format
export const ACCEPTABLE_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss'

const useTimeZonedDate = (value: string) => {
  const [timeZoneApplied, setTimeZoneApplied] = useState(false)
  const [dateValue, setDateValue] = useState<Date>()

  React.useEffect(() => {
    if (value) {
      if (timeZoneApplied) {
        setDateValue(new Date(value))
      } else {
        setDateValue(
          new Date(
            moment(value).tz(user.getTimeZone()).format(ACCEPTABLE_DATE_FORMAT)
          )
        )
        setTimeZoneApplied(true)
      }
    }
  }, [value])

  return dateValue
}

export default useTimeZonedDate
