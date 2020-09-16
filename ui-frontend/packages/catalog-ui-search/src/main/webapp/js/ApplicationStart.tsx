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

// @ts-expect-error ts-migrate(6133) FIXME: '$' is declared but its value is never read.
const $ = require('jquery')
import BaseApp from '../component/app/base-app'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
const user = require('../component/singletons/user-instance.js')
import { providers as Providers } from '../extension-points/providers'

function attemptToStart() {
  if (user.fetched) {
    ReactDOM.render(
      <Providers>
        <BaseApp />
      </Providers>,
      document.querySelector('#router')
    )
  } else if (!user.fetched) {
    user.once('sync', () => {
      attemptToStart()
    })
  }
}

attemptToStart()
