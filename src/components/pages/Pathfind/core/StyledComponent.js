import { createUseStyles } from 'react-jss'

function StyledComponent({ styleMap, children }) {
    return children(createUseStyles(styleMap));
}

export default StyledComponent;