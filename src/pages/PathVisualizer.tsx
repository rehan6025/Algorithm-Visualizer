import React, { useEffect, useState } from "react";
import Node, { type NodeProps } from "../components/Path/Node";
import "../styles/PathVisualizer.css";
import Button from "../components/Button";
import { dijkstra } from "../game/algorithms/Dijkstra";

const PathPage: React.FC = () => {
    const [grid, setGrid] = useState<NodeProps[][]>([]);
    const [startNode, setStartNode] = useState<NodeProps>();
    const [endNode, setEndNode] = useState<NodeProps>();
    const [shortestPath, setshortestPath] = useState<NodeProps[]>([]);
    const [visited, setVisited] = useState<NodeProps[]>([]);
    const [clicked, setClicked] = useState<boolean>(false);
    const [movingstart, setmovingstart] = useState<boolean>(false);
    const [movingend, setmovingend] = useState<boolean>(false);

    const makeGrid = () => {
        let row_size = Math.floor((window.innerHeight - 60) / 27);
        let col_size = Math.floor(window.innerWidth / 27);
        let arr = [];
        for (let i = 0; i < row_size; i++) {
            let row = [];
            for (let j = 0; j < col_size; j++) {
                row.push({
                    row: i,
                    col: j,
                    isVisited: false,
                    isShortestPath: false,
                    isWall: false,

                    isStart: false,
                    isEnd: false,
                });
            }
            arr.push(row);
        }

        let startX = Math.floor(Math.random() * row_size);
        let startY = Math.floor(Math.random() * col_size);
        let endX = Math.floor(Math.random() * row_size);
        let endY = Math.floor(Math.random() * col_size);

        arr[startX][startY].isStart = true;
        arr[endX][endY].isEnd = true;

        setGrid(arr);
        setStartNode(arr[startX][startY]);
        setEndNode(arr[endX][endY]);
    };

    const handleMouseDown = (row: number, col: number) => {
        if (grid[row][col].isStart) {
            setmovingstart(true);
            return;
        }

        if (grid[row][col].isEnd) {
            setmovingend(true);
            return;
        }

        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
            if (!newGrid[row][col].isStart && !newGrid[row][col].isEnd)
                newGrid[row][col].isWall = !newGrid[row][col].isWall;
            return newGrid;
        });
        setClicked(true);
    };

    const handleMouseLeave = (row: number, col: number) => {
        if (movingstart) {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isStart = false;
                return newGrid;
            });
        }
        if (movingend) {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isEnd = false;
                return newGrid;
            });
        }
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (movingstart) {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isStart = true;

                return newGrid;
            });
        }
        if (movingend) {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isEnd = true;

                return newGrid;
            });
        }

        if (clicked) {
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                if (!newGrid[row][col].isStart && !newGrid[row][col].isEnd)
                    newGrid[row][col].isWall = !newGrid[row][col].isWall;
                return newGrid;
            });
        }
    };

    const handleMouseUp2 = (row: number, col: number) => {
        if (movingstart) {
            setmovingstart(false);
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isStart = true;
                return newGrid;
            });
        }
        if (movingend) {
            setmovingend(false);
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isEnd = true;
                return newGrid;
            });
        }
    };

    const handleMouseUp = () => {
        setClicked(false);
    };

    useEffect(() => {
        makeGrid();

        const handleResize = () => {
            makeGrid();
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //NOW - a function that runs Dijkstra on your grid returns visited order + shortest path.
    const visDijkstra = () => {
        const res = dijkstra({
            grid: grid,
            startNode: startNode!,
            endNode: endNode!,
        });

        setVisited(res.visitedNodes);
        setshortestPath(res.shortestPath);

        console.log(res);
    };

    return (
        <div className="flex flex-col gap-8 relative h-screen w-screen">
            <div className="text-white flex gap-x-2">
                <h1 className="px-5 py-3 text-xl bg-accent">Path Finder</h1>
                <Button onClick={visDijkstra}>Visualize!</Button>
            </div>

            <div id="main-grid" className="bg-white h-full w-full">
                <table id="board">
                    <tbody>
                        {grid.map((row, index) => (
                            <tr id={`${index}`} key={index}>
                                {row.map((node, cIndex) => (
                                    <Node
                                        onMouseDown={handleMouseDown}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseUp={handleMouseUp2}
                                        key={cIndex}
                                        isWall={node.isWall}
                                        isStart={node.isStart}
                                        isEnd={node.isEnd}
                                        col={cIndex}
                                        row={index}
                                        isShortestPath={node.isShortestPath}
                                        isVisited={node.isVisited}
                                    />
                                ))}
                            </tr>
                        ))}
                        {/* {rowArray.map((_, index) => (
                            <tr key={index} id={`row-${index}`}>
                                {colArray.map((_, cIndex) => (
                                    <Node isWall={false},  />
                                    // <td   
                                    //     key={index}
                                    //     className="w-5 h-5 border border-blue-500"
                                    //     id={`${index}-${cIndex}`}
                                    // ></td>
                                ))}
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PathPage;
