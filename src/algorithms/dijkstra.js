// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(oldGrid, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) {
    const grid = modifyGrid(oldGrid, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL)

    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return [visitedNodesInOrder, null];
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return [visitedNodesInOrder, getNodesInShortestPathOrder(finishNode)];
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// const getAllNodesModified = (grid, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) => {
//     const nodes = [];
//     for (let row = 0; row < grid.length; row++) {
//         for (let col = 0; col < grid[0].length; col++) {
//             const isWall = grid[row][col] === 'wall';
//             nodes.push(createNode(isWall, col, row, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL));
//         }
//     }
//     return nodes;
// };

const modifyGrid = (grid, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) => {
    const nodes = [];
    for (let row = 0; row < grid.length; row++) {
        const currentRow = [];
        for (let col = 0; col < grid[0].length; col++) {
            const isWall = grid[row][col] === 'wall';
            currentRow.push(createNode(isWall, col, row, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL));
        }
        nodes.push(currentRow);
    }
    return nodes;
};

const createNode = (isWall, col, row, START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: isWall,
        previousNode: null,
    };
};

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
