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
import ExtensionPoints from '../../../extension-points'
import React from 'react'
import union from 'lodash/union'
const lightboxInstance = require('../../lightbox/lightbox.view.instance.js')
import {
  Button,
  buttonTypeEnum,
} from '../../../react-component/presentation/button'
const user = require('catalog-ui-search/src/main/webapp/component/singletons/user-instance.js')
const properties = require('catalog-ui-search/src/main/webapp/js/properties.js')
const Marionette = require('marionette')
const Backbone = require('backbone')
const CustomElements = require('../../../js/CustomElements.js')
const TableVisibility = require('./table-visibility.view')
const TableRearrange = require('./table-rearrange.view')
const ResultsTableView = require('../../table/results/table-results.view.js')
const ResultFormCollection = require('../../result-form/result-form-collection-instance')

const filterAttributesWithResultForm = (
  attributes,
  resultTemplateAttributes
) => {
  const defaultAttributes = [
    'id',
    'title',
    'metacard-type',
    'metacard-tags',
    'source-id',
  ]
  const filteredAttributes = attributes.filter(attribute =>
    resultTemplateAttributes.includes(attribute)
  )
  return union(filteredAttributes, defaultAttributes).sort()
}
const filteredAttributesModel = Backbone.Model.extend({
  defaults: {
    filteredAttributes: [],
  },
})

const defaultTableColumns = properties.defaultTableColumns.map(attr =>
  attr.toLowerCase()
)

const setDefaultColumns = filteredAttributes => {
  const hasSelectedColumns = user
    .get('user')
    .get('preferences')
    .get('hasSelectedColumns')
  const availableAttributes = filteredAttributes
    .get('filteredAttributes')
    .map(attr => attr.toLowerCase())
  const validDefaultColumns = defaultTableColumns.filter(column =>
    availableAttributes.includes(column)
  )

  if (
    !hasSelectedColumns &&
    availableAttributes.length &&
    validDefaultColumns.length
  ) {
    const hiddenAttributes = availableAttributes.filter(
      attr => !defaultTableColumns.includes(attr)
    )
    user
      .get('user')
      .get('preferences')
      .set('columnHide', hiddenAttributes)
  }
}

module.exports = Marionette.LayoutView.extend({
  tagName: CustomElements.register('table-viz'),
  template() {
    return (
      <React.Fragment>
        <div className="table-empty">
          <h3>Please select a result set to display the table.</h3>
        </div>
        <div className="table-visibility" />
        <div className="table-rearrange" />
        <div className="table-options">
          <Button
            buttonType={buttonTypeEnum.neutral}
            fadeUntilHover
            onClick={this.startRearrange.bind(this)}
            text="Rearrange Column"
            icon="fa fa-columns"
          />
          <Button
            buttonType={buttonTypeEnum.neutral}
            fadeUntilHover
            onClick={this.startVisibility.bind(this)}
            text="Hide/Show Columns"
            icon="fa fa-eye"
          />
          <Button
            buttonType={buttonTypeEnum.neutral}
            text="Export"
            fadeUntilHover
            onClick={this.openExportModal.bind(this)}
            icon="fa fa-share"
          />
        </div>
        <div className="tables-container" />
      </React.Fragment>
    )
  },
  openExportModal() {
    lightboxInstance.model.updateTitle('Export Results')
    lightboxInstance.model.open()
    lightboxInstance.showContent(
      <ExtensionPoints.tableExport
        selectionInterface={this.options.selectionInterface}
        filteredAttributes={this.filteredAttributes.get('filteredAttributes')}
      />
    )
  },
  regions: {
    table: {
      selector: '.tables-container',
    },
    tableVisibility: {
      selector: '.table-visibility',
      replaceElement: true,
    },
    tableRearrange: {
      selector: '.table-rearrange',
      replaceElement: true,
    },
  },
  initialize(options) {
    if (!options.selectionInterface) {
      throw 'Selection interface has not been provided'
    }
    this.resultForms = ResultFormCollection.getCollection()
    this.listenTo(
      this.resultForms,
      'change',
      this.filterActiveSearchResultsAttributes
    )

    this.filteredAttributes = new filteredAttributesModel()
    this.filterActiveSearchResultsAttributes()

    setDefaultColumns(this.filteredAttributes)

    this.listenTo(
      this.options.selectionInterface,
      'reset:activeSearchResults add:activeSearchResults',
      this.handleEmpty
    )
    this.listenTo(
      this.options.selectionInterface,
      'change:activeSearchResultsAttributes',
      this.filterActiveSearchResultsAttributes
    )
  },
  filterActiveSearchResultsAttributes() {
    const currentQuery = this.options.selectionInterface.getCurrentQuery()
    const resultFormName = currentQuery ? currentQuery.get('detail-level') : ''
    const selectedResultTemplate = this.resultForms.findWhere({
      title: resultFormName,
    })
    let filteredAttributes = this.options.selectionInterface.getActiveSearchResultsAttributes()

    if (selectedResultTemplate) {
      const attrs = this.options.selectionInterface.getActiveSearchResultsAttributes()
      filteredAttributes = filterAttributesWithResultForm(
        attrs,
        selectedResultTemplate.get('descriptors')
      )
    }
    this.filteredAttributes.set('filteredAttributes', filteredAttributes)
    this.render()
  },
  handleEmpty() {
    this.$el.toggleClass(
      'is-empty',
      this.options.selectionInterface.getActiveSearchResults().length === 0
    )
  },
  onRender() {
    this.handleEmpty()
    this.table.show(
      new ResultsTableView({
        selectionInterface: this.options.selectionInterface,
        filteredAttributes: this.filteredAttributes,
      })
    )
  },
  startRearrange() {
    this.$el.toggleClass('is-rearranging')
    this.tableRearrange.show(
      new TableRearrange({
        selectionInterface: this.options.selectionInterface,
        filteredAttributes: this.filteredAttributes,
      }),
      {
        replaceElement: true,
      }
    )
  },
  startVisibility() {
    this.$el.toggleClass('is-visibilitying')
    this.tableVisibility.show(
      new TableVisibility({
        selectionInterface: this.options.selectionInterface,
        filteredAttributes: this.filteredAttributes,
      }),
      {
        replaceElement: true,
      }
    )
  },
})
