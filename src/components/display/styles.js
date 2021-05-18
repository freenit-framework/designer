const styles = {
  mobile: {
    width: '375px',
    height: '667px',
    maxHeight: '667px',
    overflowY: 'scroll',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },

  tablet: {
    display: 'block',
    width: '960px',
    height: '600px',
    maxHeight: '600px',
    overflowY: 'scroll',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },

  desktop: {
    width: '100%',
    minHeight: 'calc(100vh - 4px)',
    backgroundColor: '#fff',
    alignSelf: 'top',
  },

  root: {
    display: 'flex',
    backgroundColor: '#eee',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 2px)',
    width: '100%',
  },
}
styles.default = styles.desktop

export default styles
