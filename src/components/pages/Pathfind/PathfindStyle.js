const topNavBarHeight = '64px';
const leftToolboxWidth = '200px';

const toolBoxColor = '#828282';
const defaultBackgroundColor = '#FCFAF2';

const styles = {
    main: {
        width: '100vw',
        height: '100vh',
        backgroundColor: defaultBackgroundColor,
    },
    title: {
        flexGrow: 1,
    },
    top_navigation_bar: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        right: '0px',
        height: topNavBarHeight,
        backgroundColor: toolBoxColor,
    },
    left_tool_box: {
        position: 'absolute',
        left: '0px',
        width: leftToolboxWidth,
        top: topNavBarHeight,
        bottom: '0px',
        // backgroundColor: toolBoxColor,
    },
    main_canvas: {
        position: 'absolute',
        left: leftToolboxWidth,
        right: '0px',
        top: topNavBarHeight,
        bottom: '0px',
        backgroundColor: 'green',
    },
    canvas_cell: {
        position: 'absolute',
        top: '0px',
        backgroundColor: 'red',
        // border: 'solid 1px black',
        width: '20px',
        height: '20px',
        // '&:hover': {
        //   background: 'blue',
        // },
    },
    canvas_cell_created: {
        position: 'absolute',
        top: '0px',
        backgroundColor: 'blue',
        // border: 'solid 1px black',
        width: '20px',
        height: '20px',
        animationName: '$jumpOut',
        animationDuration: '0.3s',
        animationTimingFunction: 'ease-out',
        animationDelay: '0',
        animationDirection: 'alternate',
        animationIterationCount: '1',
        animationFillMode: 'forwards',
        animationPlayState: 'running',
    },
    canvas_cell_test: {
        position: 'absolute',
        top: '0px',
        backgroundColor: 'green',
        border: 'solid 1px black',
        width: '20px',
        height: '20px',
    },
    hoverButton: {
        extend: 'button',
        background: 'yellow',
        '&:active': {
            background: 'red',
        },
    },
    '@keyframes jumpOut': {
        '0%': {
            transform: 'scale(.3)',
            backgroundColor: 'rgb(12, 53, 71)',
        },
        '50%': {
            transform: 'scale(1.2)',
            backgroundColor: 'rgb(12, 53, 71)',
        },
        '100%': {
            transform: 'scale(1.0)',
            backgroundColor: 'rgb(12, 53, 71)',
        },
    },
};

export default styles;