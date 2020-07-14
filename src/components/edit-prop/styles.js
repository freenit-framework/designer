const center = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}


export default {
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
