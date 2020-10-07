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
import { DateRangeInput, IDateRangeInputProps } from '@blueprintjs/datetime'
import { formatDate, parseDate } from './date'
import { ValueTypes } from '../filter-builder/filter.structure'
import { MuiOutlinedInputBorderClasses } from '../theme/theme'
import useTimeZonedDate from './useTimeZonedDate'

type Props = {
  value: ValueTypes['during']
  onChange: (value: ValueTypes['during']) => void
  /**
   * Override if you absolutely must
   */
  BPDateRangeProps?: IDateRangeInputProps
}

const validateShape = ({ value, onChange }: Props) => {
  if (
    value === undefined ||
    value.start === undefined ||
    value.end === undefined
  ) {
    onChange({
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    })
  }
}

export const DateRangeField = ({
  value,
  onChange,
  BPDateRangeProps,
}: Props) => {
  const startDateValue = useTimeZonedDate(value.start)
  const endDateValue = useTimeZonedDate(value.end)

  React.useEffect(() => {
    validateShape({ value, onChange, BPDateRangeProps })
  }, [])

  return (
    <DateRangeInput
      allowSingleDayRange
      endInputProps={{
        fill: true,
        className: MuiOutlinedInputBorderClasses,
      }}
      startInputProps={{
        fill: true,
        className: MuiOutlinedInputBorderClasses,
      }}
      className="where"
      closeOnSelection={false}
      formatDate={formatDate}
      onChange={([start, end]) => {
        if (onChange) {
          onChange({
            start: start ? start.toISOString() : '',
            end: end ? end.toISOString() : '',
          })
        }
      }}
      parseDate={parseDate}
      shortcuts
      timePrecision="minute"
      value={[startDateValue, endDateValue]}
      {...BPDateRangeProps}
    />
  )
}
