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

// @ts-expect-error ts-migrate(6133) FIXME: 'EnumInput' is declared but its value is never rea... Remove this comment to see the full error message
import EnumInput from '../inputs/enum-input'
import { isDirectionalSort } from './sort-selection-helpers'
import { SortItemType, Option } from './sort-selections'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Swath from '../../component/swath/swath'

type Props = {
  sortItem: SortItemType
  attributeOptions: Option[]
  directionOptions: Option[]
  updateAttribute: (attribute: string) => void
  updateDirection: (direction: string) => void
  onRemove: () => void
  showRemove?: boolean
}

const SortItem = ({
  sortItem,
  attributeOptions,
  directionOptions,
  updateAttribute,
  updateDirection,
  onRemove,
  showRemove,
}: Props) => (
  <>
    <div>
      <Grid container direction="row" wrap="nowrap" alignItems="center">
        <Grid item className="w-full">
          <Autocomplete
            fullWidth
            options={attributeOptions}
            getOptionLabel={option => option.label}
            getOptionSelected={(option, value) => option.value === value.value}
            // @ts-expect-error ts-migrate(6133) FIXME: 'e' is declared but its value is never read.
            onChange={(e, newValue) => {
              const newProperty = newValue.value
              updateAttribute(newProperty)
            }}
            disableClearable
            value={sortItem.attribute}
            renderInput={params => <TextField {...params} variant="outlined" />}
          />
        </Grid>
        {showRemove ? (
          <Grid item className="pl-2">
            <Button onClick={onRemove} variant="text" color="primary">
              Remove
            </Button>
          </Grid>
        ) : null}
      </Grid>
      {isDirectionalSort(sortItem.attribute.value) ? (
        <Grid
          container
          alignItems="stretch"
          direction="row"
          wrap="nowrap"
          className="pt-2"
        >
          <Grid item>
            <Swath className="w-1 h-full" />
          </Grid>
          <Grid item className="w-full pl-2">
            <Autocomplete
              fullWidth
              options={directionOptions}
              getOptionLabel={option => option.label}
              getOptionSelected={(option, value) =>
                option.value === value.value
              }
              // @ts-expect-error ts-migrate(6133) FIXME: 'e' is declared but its value is never read.
              onChange={(e, newValue) => {
                const newProperty = newValue.value
                updateDirection(newProperty)
              }}
              disableClearable
              value={directionOptions.find(
                option => option.value === sortItem.direction
              )}
              renderInput={params => (
                <TextField {...params} variant="outlined" />
              )}
            />
          </Grid>
        </Grid>
      ) : null}
    </div>
  </>
)

export default SortItem
