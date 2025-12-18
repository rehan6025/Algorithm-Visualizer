import { PriorityQueue } from "@datastructures-js/priority-queue";
import type { NodeProps } from "../../components/Path/Node";

const isInsideGrid = ({
    i,
    j,
    grid,
}: {
    i: number;
    j: number;
    grid: NodeProps[][];
}): boolean => {
    return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
};

export const dijkstra = async ({
    grid,
    startNode,
    endNode,
}: {
    grid: NodeProps[][];
    startNode: NodeProps;
    endNode: NodeProps;
}) => {
    const arr = grid.map((row) => row.map((n) => ({ ...n })));
    const shortestPath = [];
    const visitedNodes = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[0].length; j++) {
            arr[i][j].distance = Infinity;
            arr[i][j].prevNode = null;
            arr[i][j].isVisited = false;
            arr[i][j].isShortestPath = false;
        }
    }

    let pq = new PriorityQueue(
        (a: NodeProps, b: NodeProps) => a.distance! - b.distance!
    );

    arr[startNode.row][startNode.col].distance = 0;
    pq.enqueue(arr[startNode.row][startNode.col]);

    let dx = [1, 0, -1, 0];
    let dy = [0, 1, 0, -1];

    while (!pq.isEmpty()) {
        let cell = pq.dequeue();
        if (cell?.row === endNode.row && cell.col === endNode.col) break;
        if (cell == null) continue;

        // check all directions, if valid and not visited, continue;
        if (arr[cell!.row][cell!.col].isVisited) continue;
        arr[cell!.row][cell!.col].isVisited = true;
        visitedNodes.push({ row: cell.row, col: cell.col });

        for (let i = 0; i < 4; i++) {
            let nr = cell.row + dx[i];
            let nc = cell.col + dy[i];

            if (!isInsideGrid({ i: nr, j: nc, grid: arr })) continue;
            if (arr[nr][nc].isWall) continue;

            let newDist = cell.distance! + 1;

            if (newDist < arr[nr][nc].distance!) {
                arr[nr][nc].distance = newDist;
                arr[nr][nc].prevNode = cell;
                pq.enqueue(arr[nr][nc]);
            }
        }
    }
    let n = arr[endNode.row][endNode.col];
    while (n !== null) {
        n.isShortestPath = true;
        shortestPath.push({ row: n.row, col: n.col });
        if (n.prevNode === null) break;
        //@ts-ignore
        n = n.prevNode;
    }

    return { shortestPath, visitedNodes };
};
