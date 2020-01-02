const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}


export default {
  root: {
    ...center,
    height: '100vh',
    width: '100vw',
  },

  content: {
    minHeight: 300,
    minWidth: 300,
  },

  form: {
    ...center,
    flexDirection: 'column',
  },
}
