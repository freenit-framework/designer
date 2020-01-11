import React from 'react'
import { withStore } from 'freenit'
import DnD from 'components/dnd'
import styles from './styles'


class Display extends React.Component {
  object2Components = (tree, store) => {
    const style = store.selected.key === tree.key
      ? ({
        ...tree.props.style,
        border: '1px dashed red',
      }) : { ...tree.props.style }
    return (
      <DnD key={tree.key} identity={tree.key}>
        <tree.component
          {...tree.props}
          style={style}
          onClick={(event) => {
            event.stopPropagation()
            store.onClick(tree)
          }}
        >
          {tree.key}
          {tree.text}
          {tree.children.map(el => this.object2Components(el, store))}
        </tree.component>
      </DnD>
    )
  }

  render() {
    const { design } = this.props.store
    const content = this.object2Components(design.tree, design)
    return (
      <div style={styles.root}>
        {content}
      </div>
    )
  }
}

export default withStore(Display)
