/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import { DateInput, IDateInputProps } from '@blueprintjs/datetime'
// @ts-ignore Can't find type declarations, but they exist
import moment from 'moment-timezone'
import { MuiOutlinedInputBorderClasses } from '../theme/theme'
import useTimeZonedDate, { ACCEPTABLE_DATE_FORMAT } from './useTimeZonedDate'

const user = require('../singletons/user-instance')

/**
 * Date doesn't hold any timezone information,
 * but has the correct date information at this point.
 * It does not have the right offset, so we need to add it
 */
export const formatDate = (date: Date) => {
  const momentDate = moment(date)

  if (!momentDate.isValid()) {
    return ''
  }

  const format = user.getDateFormat()
  const timezone = user.getTimeZone()
  const timezoneOffset = moment(date)
    .tz(timezone)
    .utcOffset()

  return momentDate.utcOffset(timezoneOffset, true).format(format)
}

export const parseDate = (input?: string) => {
  try {
    const timeZone = user.getTimeZone()
    const format = user.getDateFormat()
    if (!input) {
      return null
    }
    const date = moment.tz(
      input.substring(0, input.length - 1),
      format,
      timeZone
    )
    if (date.isValid()) {
      return new Date(
        moment(input)
          .tz(user.getTimeZone())
          .format(ACCEPTABLE_DATE_FORMAT)
      )
    }
    return null
  } catch (err) {
    return null
  }
}

type DateFieldProps = {
  value: string
  onChange: (value: string) => void
  /**
   * Override if you absolutely must
   */
  BPDateProps?: IDateInputProps
}

const validateShape = ({ value, onChange }: DateFieldProps) => {
  if (parseDate(value) === null) {
    onChange(new Date().toISOString())
  }
}

export const DateField = ({ value, onChange, BPDateProps }: DateFieldProps) => {
  const dateValue = useTimeZonedDate(value)

  React.useEffect(() => {
    validateShape({ onChange, value })
  }, [])

  return (
    <DateInput
      className={MuiOutlinedInputBorderClasses}
      closeOnSelection={false}
      fill
      formatDate={formatDate}
      onChange={(selectedDate, isUserChange) => {
        if (onChange && selectedDate && isUserChange)
          onChange(selectedDate.toISOString())
      }}
      parseDate={parseDate}
      placeholder={'M/D/YYYY'}
      shortcuts
      timePrecision="minute"
      value={dateValue}
      {...BPDateProps}
    />
  )
}
