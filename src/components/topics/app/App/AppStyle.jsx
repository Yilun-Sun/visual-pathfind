import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  main: {
    width: '100vw',
    height: '100vh',
  },
  navigation: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    bottom: '0px',
  },
  content: {
    position: 'absolute',
    left: '0px',
    right: '0px',
    top: '0px',
    bottom: '0px',
    backgroundColor: '#e9eaef',
  },
});

export default { useStyles };
