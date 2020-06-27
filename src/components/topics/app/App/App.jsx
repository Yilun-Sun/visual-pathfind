import React from 'react';
import AppStyle from './AppStyle';

const App = (content) => {
  const style = AppStyle.useStyles();
  return (
    <div className={style.main}>
      <div className={style.content}>{content}</div>
    </div>
  );
};

export default App;
