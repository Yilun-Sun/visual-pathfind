(this["webpackJsonpvisual-pathfind"]=this["webpackJsonpvisual-pathfind"]||[]).push([[0],{56:function(e,t,o){e.exports=o(73)},61:function(e,t,o){},62:function(e,t){},64:function(e,t){},73:function(e,t,o){"use strict";o.r(t);var n=o(0),a=o.n(n),i=o(18),r=o.n(i),s=(o(61),o(7)),l=o(45),c=o(46),u=o(51),h=o(50),d={main:{width:"100vw",height:"100vh",backgroundColor:"#FCFAF2"},title:{flexGrow:1},top_navigation_bar:{position:"absolute",left:"0px",top:"0px",right:"0px",height:"64px",backgroundColor:"#828282"},left_tool_box:{position:"absolute",left:"0px",width:"160px",top:"64px",bottom:"0px"},main_canvas:{position:"absolute",left:"160px",right:"0px",top:"64px",bottom:"0px",backgroundColor:"green"},canvas_cell:{position:"absolute",top:"0px",backgroundColor:"red",width:"20px",height:"20px"},canvas_cell_created:{position:"absolute",top:"0px",backgroundColor:"blue",width:"20px",height:"20px",animationName:"$jumpOut",animationDuration:"0.3s",animationTimingFunction:"ease-out",animationDelay:"0",animationDirection:"alternate",animationIterationCount:"1",animationFillMode:"forwards",animationPlayState:"running"},canvas_cell_test:{position:"absolute",top:"0px",backgroundColor:"green",border:"solid 1px black",width:"20px",height:"20px"},hoverButton:{extend:"button",background:"yellow","&:active":{background:"red"}},"@keyframes jumpOut":{"0%":{transform:"scale(.3)",backgroundColor:"rgb(12, 53, 71)"},"50%":{transform:"scale(1.2)",backgroundColor:"rgb(12, 53, 71)"},"100%":{transform:"scale(1.0)",backgroundColor:"rgb(12, 53, 71)"}}},f=o(16),p=o.n(f),v=o(49);var g=function(e){var t=e.styleMap;return(0,e.children)(Object(v.a)(t))},m=o(101),w=o(95),C=o(35),b=o(100),N=o(97),y=o(102),E=o(98),D=o(99),k=o(96),M=o(48),x=o.n(M),R=o(34);function S(e,t,o,n,a){var i=z(e,t,o,n,a),r=i[t][o],s=i[n][a],l=[];r.distance=0;for(var c=function(e){var t,o=[],n=Object(R.a)(e);try{for(n.s();!(t=n.n()).done;){var a,i=t.value,r=Object(R.a)(i);try{for(r.s();!(a=r.n()).done;){var s=a.value;o.push(s)}}catch(l){r.e(l)}finally{r.f()}}}catch(l){n.e(l)}finally{n.f()}return o}(i);c.length;){P(c);var u=c.shift();if(!u.isWall){if(u.distance===1/0)return[l,null];if(u.isVisited=!0,l.push(u),u===s)return[l,j(s)];I(u,i)}}}function P(e){e.sort((function(e,t){return e.distance-t.distance}))}function I(e,t){var o,n=function(e,t){var o=[],n=e.col,a=e.row;a>0&&o.push(t[a-1][n]);a<t.length-1&&o.push(t[a+1][n]);n>0&&o.push(t[a][n-1]);n<t[0].length-1&&o.push(t[a][n+1]);return o.filter((function(e){return!e.isVisited}))}(e,t),a=Object(R.a)(n);try{for(a.s();!(o=a.n()).done;){var i=o.value;i.distance=e.distance+1,i.previousNode=e}}catch(r){a.e(r)}finally{a.f()}}var z=function(e,t,o,n,a){for(var i=[],r=0;r<e.length;r++){for(var s=[],l=0;l<e[0].length;l++){var c="wall"===e[r][l];s.push(F(c,l,r,t,o,n,a))}i.push(s)}return i},F=function(e,t,o,n,a,i,r){return{col:t,row:o,isStart:o===n&&t===a,isFinish:o===i&&t===r,distance:1/0,isVisited:!1,isWall:e,previousNode:null}};function j(e){for(var t=[],o=e;null!==o;)t.unshift(o),o=o.previousNode;return t}var G=function(e){Object(u.a)(o,e);var t=Object(h.a)(o);function o(){var e;return Object(l.a)(this,o),(e=t.call(this)).resetCanvas=function(){console.log("resized, resetting canvas"),p.a.setup(e.canvas),e.grid=e.getInitialNodes(),e.getInitialCanvasNodes(),e.setUpInitStartFinishNodeInView(),e.initStartAndFinishNodeIfHave(),e.needInitCanvas=!1},e.onMouseDown=function(t){var o=t.point.x,n=t.point.y,a=e.state.nodeSize,i=Math.floor(n/a),r=Math.floor(o/a);"start"===e.grid[i][r]||"finish"===e.grid[i][r]?(e.onMouseDownNodeType=e.grid[i][r],e.specialNodesProps.onDragSpecial=!0):(e.onMouseDownNodeType="",e.specialNodesProps.onDragSpecial=!1),e.isCoorsChange(i,r)&&(e.mouseDownOnce=!0),e.onMouseDrag(t)},e.onMouseDrag=function(t){var o=t.point.x,n=t.point.y,a=e.canvas.width,i=e.canvas.height,r=e.state.nodeSize,s=Math.floor(n/r),l=Math.floor(o/r),c=e.brush,u=!0;if(!(o>a||o<0||n>i||n<0)&&e.grid[s][l]&&e.grid[s][l]!==c.type){var h=e.specialNodesProps;switch(c.type){case"start":h.hasStart?u=!1:(h.hasStart=!0,h.startRow=s,h.startCol=l);break;case"finish":h.hasFinish?u=!1:(h.hasFinish=!0,h.finishRow=s,h.finishCol=l)}if("start"!==e.onMouseDownNodeType&&"finish"!==e.onMouseDownNodeType||(h.onDragSpecial=!0),e.specialNodesProps.onDragSpecial){if(u=!1,"start"===e.onMouseDownNodeType)e.canvasNodeGroup.children["".concat(h.startRow,"-").concat(h.startCol)].fillColor=c.brushDict.empty,h.startRow===s&&h.startCol===l||(e.grid[h.startRow][h.startCol]="empty",e.grid[s][l]="start",h.startRow=s,h.startCol=l,e.onDrawAlgo&&e.printDijkstra());else if("finish"===e.onMouseDownNodeType){e.canvasNodeGroup.children["".concat(h.finishRow,"-").concat(h.finishCol)].fillColor=c.brushDict.empty,h.finishRow===s&&h.finishCol===l||(e.grid[h.finishRow][h.finishCol]="empty",e.grid[s][l]="finish",h.finishRow=s,h.finishCol=l,e.onDrawAlgo&&e.printDijkstra())}e.canvasNodeGroup.children["".concat(s,"-").concat(l)].fillColor=c.brushDict[e.onMouseDownNodeType]}if(u){"start"!==c.type&&"start"===e.grid[s][l]?(h.startRow=-1,h.startCol=-1,h.hasStart=!1):"finish"!==c.type&&"finish"===e.grid[s][l]&&(h.finishRow=-1,h.finishCol=-1,h.hasFinish=!1),e.grid[s][l]=c.type;var d=e.canvasNodeGroup.children["".concat(s,"-").concat(l)];d.fillColor=c.color,e.animateNode(d)}(e.isCoorsChange(s,l)||e.mouseDownOnce)&&(e.mouseDownOnce=!1,e.onDrawAlgo&&e.printDijkstra())}},e.setUpInitStartFinishNodeInView=function(){var t=e.canvas.width,o=e.canvas.height;if(t>400&&o>400){var n=e.getNodeIndexAtPosition(t,o);e.specialNodesProps={startRow:Math.floor(n[0]/2),startCol:Math.floor(n[1]/3),finishRow:Math.floor(n[0]/2),finishCol:Math.floor(2*n[1]/3),hasStart:!0,hasFinish:!0},e.grid[e.specialNodesProps.startRow][e.specialNodesProps.startCol]="start",e.grid[e.specialNodesProps.finishRow][e.specialNodesProps.finishCol]="finish"}else e.specialNodesProps={startRow:-1,startCol:-1,finishRow:-1,finishCol:-1,hasStart:!1,hasFinish:!1,lastRow:-1,lastCol:-1}},e.getNodeIndexAtPosition=function(t,o){var n=e.canvas.width,a=e.canvas.height,i=e.state.nodeSize;return[Math.floor(a/i),Math.floor(n/i)]},e.initStartAndFinishNodeIfHave=function(){var t=e.specialNodesProps.hasStart,o=e.specialNodesProps.hasFinish,n=e.specialNodesProps.startRow,a=e.specialNodesProps.startCol,i=e.specialNodesProps.finishRow,r=e.specialNodesProps.finishCol;t&&(e.canvasNodeGroup.children["".concat(n,"-").concat(a)].fillColor=e.brush.brushDict.start,e.grid[n][a]="start");o&&(e.canvasNodeGroup.children["".concat(i,"-").concat(r)].fillColor=e.brush.brushDict.finish,e.grid[i][r]="finish")},e.isCoorsChange=function(t,o){var n=e.specialNodesProps;return(n.lastRow!==t||n.lastCol!==o)&&(n.lastRow=t,n.lastCol=o,console.log("coors change"),!0)},e.animateNode=function(t){var o=t.fillColor;t.fillColor="yellow",t.tween({size:e.state.nodeSize+5,fillColor:"#fffc4f"},{easing:"easeInOutCubic",duration:200}).then((function(){t.tweenTo({size:e.state.nodeSize-e.gridLineWidth,fillColor:o},300)}))},e.getInitialNodes=function(){for(var t=e.state.nodeSize,o=Math.ceil(e.canvas.height/t),n=Math.ceil(e.canvas.width/t),a=[],i=0;i<o;i++){for(var r=[],s=0;s<n;s++)r.push("empty");a.push(r)}return a},e.getInitialCanvasNodes=function(){for(var t=new f.Group,o=e.state.nodeSize,n=e.gridLineWidth,a=Math.ceil(e.canvas.height/o),i=Math.ceil(e.canvas.width/o),r=0;r<a;r++)for(var s=0;s<i;s++){var l=new f.Shape.Rectangle({fillColor:"white",center:[s*o+o/2,r*o+o/2],size:o-n,name:"".concat(r,"-").concat(s)});if(t.addChild(l),0===r||0===s){var c=new f.PointText(new f.Point(s*o+o/2,r*o+o/2));c.justification="center",c.fillColor="grey",c.content=0===r?s:r,t.addChild(c)}}e.canvasNodeGroup=t},e.resetCanvasGridSize=function(){for(var t=e.state.nodeSize,o=e.gridLineWidth,n=Math.ceil(e.canvas.height/t),a=Math.ceil(e.canvas.width/t),i=0;i<n;i++)for(var r=0;r<a;r++){if(e.canvasNodeGroup.children["".concat(i,"-").concat(r)])e.canvasNodeGroup.children["".concat(i,"-").concat(r)].size=t-o}},e.setBrush=function(t){["empty","wall","start","finish"].includes(t)&&e.brush.setType(t)},e.printDijkstra=function(){console.log("printDijkstra");var t=e.specialNodesProps;if(t.hasStart&&t.hasFinish){for(var o=S(e.grid,t.startRow,t.startCol,t.finishRow,t.finishCol),n=o[0],a=o[1],i=0;i<e.grid.length;i++)for(var r=0;r<e.grid[0].length;r++){e.canvasNodeGroup.children["".concat(i,"-").concat(r)].fillColor=e.brush.brushDict[e.grid[i][r]]}null!==n?n.forEach((function(o){var n=e.canvasNodeGroup.children["".concat(o.row,"-").concat(o.col)];o.row===t.startRow&&o.col===t.startCol||o.row===t.finishRow&&o.col===t.finishCol||(n.fillColor="#3A8FB7")})):console.log("visitedNodesInOrder is null"),null!==a?a.forEach((function(o){var n=e.canvasNodeGroup.children["".concat(o.row,"-").concat(o.col)];o.row===t.startRow&&o.col===t.startCol||o.row===t.finishRow&&o.col===t.finishCol||(n.fillColor="#d6ff75")})):console.log("nodesInShortestPathOrder is null")}else console.log("missing start or finish node")},e.animateAlgorithm=function(){e.onDrawAlgo=!0,e.printDijkstra()},e.state={nodeSize:40},e.brush={type:"wall",color:"black",brushDict:{empty:"white",wall:"black",start:"#20e82a",finish:"red"},setType:function(e){this.type=e,this.color=this.brushDict[e],console.log(this.color)}},e.grid=[],e.gridRows=20,e.gridCols=40,e.backgroundColor="white",e.gridLineColor="#777777",e.gridLineWidth=1,e.canvasNodeGroup=void 0,e.needInitCanvas=!0,e.onMouseDownNodeType="",e.mouseDownOnce=!1,e.onDrawAlgo=!1,e.specialNodesProps={startRow:-1,startCol:-1,finishRow:-1,finishCol:-1,hasStart:!1,hasFinish:!1,onDragSpecial:!1},e}return Object(c.a)(o,[{key:"componentDidMount",value:function(){var e=this;p.a.setup(this.canvas),p.a.tools.forEach((function(e){return e.remove()}));var t=new f.Tool;t.onMouseDrag=function(t){e.onMouseDrag(t)},t.onMouseDown=function(t){e.onMouseDown(t)},p.a.view.onResize=function(){e.resetCanvas()},this.resetCanvas()}},{key:"handleMouseUp",value:function(){console.log("up")}},{key:"test1",value:function(){console.log("test1:"),console.log(this.specialNodesProps)}},{key:"test2",value:function(){console.log("test2:"),this.gridLineWidth=0,this.resetCanvasGridSize()}},{key:"render",value:function(){var e=this;return a.a.createElement(g,{styleMap:d},(function(t){var o=t(e.props);return a.a.createElement("div",{className:o.main},a.a.createElement("div",{className:o.top_navigation_bar,id:"top_navigation_bar"},a.a.createElement(m.a,{position:"static"},a.a.createElement(w.a,null,a.a.createElement(k.a,{edge:"start",color:"inherit","aria-label":"menu"},a.a.createElement(x.a,null)),a.a.createElement(C.a,{variant:"h6",className:o.title},"Interactive Visualized Pathfinder")))),a.a.createElement("div",{className:o.left_tool_box},a.a.createElement(N.a,{component:"nav","aria-label":"main mailbox folders"},a.a.createElement(y.a,{button:!0,onClick:function(){return e.brushColor=e.brushColor===e.gridLineColor?"blue":e.gridLineColor}},a.a.createElement(E.a,{primary:"changeColor"})),a.a.createElement(y.a,{button:!0,onClick:function(){return console.log(e.grid)}},a.a.createElement(E.a,{primary:"show nodes"})),a.a.createElement(y.a,{button:!0},a.a.createElement(E.a,{primary:"do something"}))),a.a.createElement(D.a,null),a.a.createElement(N.a,{component:"nav","aria-label":"secondary mailbox folders"},a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.test1()}},"Props")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.animateAlgorithm()}},"Dijk")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.test2()}},"TEST2")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.setBrush("start")}},"start")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.setBrush("finish")}},"finish")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.setBrush("wall")}},"wall")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.setBrush("empty")}},"empty")),a.a.createElement(y.a,null,a.a.createElement(b.a,{variant:"outlined",onClick:function(){return e.resetCanvas()}},"reset")))),a.a.createElement("div",{className:o.main_canvas},a.a.createElement("canvas",{resize:"true",style:{width:"100%",height:"100%",backgroundColor:e.gridLineColor},ref:function(t){e.canvas=t}})))}))}}]),o}(n.Component),O=function(){return a.a.createElement("div",null,a.a.createElement(G,null))},_=function(){return a.a.createElement(s.d,null,a.a.createElement(s.b,{path:"/visual-pathfinder"},a.a.createElement(O,null)),a.a.createElement(s.b,{path:"/"},a.a.createElement(s.a,{to:"/visual-pathfinder"})))},T=o(36);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(T.a,null,a.a.createElement(_,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[56,1,2]]]);
//# sourceMappingURL=main.350fedac.chunk.js.map