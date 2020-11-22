const center = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}


const styles = {
  form: {
    ...center,
    width: 'calc(100% - 40px)',
    flexDirection: 'column',
    padding: 20,
  },

  buttons: {
    marginTop: 10,
  },

  file: {
    ...center,
    flexDirection: 'column',
  },

  input: {
    display: 'none',
  },
}


export default styles
