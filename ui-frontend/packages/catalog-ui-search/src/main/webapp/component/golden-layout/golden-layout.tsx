import * as React from 'react'
import MRC from '../../react-component/marionette-region-container'
import Paper from '@material-ui/core/Paper'
const GoldenLayoutView = require('./golden-layout.view.js')

type Props = {
  selectionInterface: any
  width: any
  closed: boolean
}

export const GoldenLayout = ({ selectionInterface, width, closed }: Props) => {
  // @ts-expect-error ts-migrate(6133) FIXME: 'setGoldenlayoutInstance' is declared but its valu... Remove this comment to see the full error message
  const [goldenlayoutInstance, setGoldenlayoutInstance] = React.useState(
    new GoldenLayoutView({
      selectionInterface,
      configName: 'goldenLayout',
    })
  )

  React.useEffect(
    () => {
      if (goldenlayoutInstance.goldenLayout) goldenlayoutInstance.updateSize()
    },
    [width, closed]
  )

  React.useEffect(() => {
    setTimeout(() => {
      if (goldenlayoutInstance.goldenLayout) goldenlayoutInstance.updateSize()
    }, 1000)
  }, [])

  return (
    <Paper className="h-full w-full" elevation={1}>
      <MRC view={goldenlayoutInstance} style={{ background: 'inherit' }} />
    </Paper>
  )
}
