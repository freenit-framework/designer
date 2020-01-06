export default function getStyles(theme, height) {
  const styles = {
    ...theme,

    root: {
      minHeight: height,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },

    small: {
      fontSize: '25px',
      marginTop: 10,
      color: 'rgb(80, 80, 80)',
    },

    link: {
      color: 'white',
    },

    freenit: {
      height: 70,
      width: 290,
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      fontSize: 36,
      marginTop: 40,
    },
  }
  return styles
}
