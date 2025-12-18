import React, { useEffect, useRef, useState } from "react";
import Node, { type NodeProps } from "../components/Path/Node";
import "../styles/PathVisualizer.css";
import Button from "../components/Button";
import { dijkstra } from "../game/algorithms/Dijkstra";

//testing git

const PathPage: React.FC = () => {
    const [grid, setGrid] = useState<NodeProps[][]>([]);
    const [startNode, setStartNode] = useState<NodeProps>();
    const speedRef = useRef(0);
    const [algo, setAlgo] = useState("dijkstra");
    const [endNode, setEndNode] = useState<NodeProps>();
    const [running, setRunning] = useState(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const [movingstart, setmovingstart] = useState<boolean>(false);
    const [movingend, setmovingend] = useState<boolean>(false);
    const cancelRef = useRef(false);

    const speedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        speedRef.current = Number(e.target.value);
    };

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
            setStartNode(grid[row][col]);
        }
        if (movingend) {
            setmovingend(false);
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map((r) => r.map((n) => ({ ...n })));
                newGrid[row][col].isEnd = true;
                return newGrid;
            });
            setEndNode(grid[row][col]);
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
    const visDijkstra = async () => {
        setRunning(true);
        cancelRef.current = false;
        setGrid((old) => {
            const copy = old.map((row) =>
                row.map((n) => ({
                    ...n,
                    isShortestPath: false,
                    isVisited: false,
                }))
            );

            return copy;
        });

        const gridCopy = grid.map((row) => row.map((node) => ({ ...node })));
        const res = await dijkstra({
            grid: gridCopy,
            startNode: startNode!,
            endNode: endNode!,
        });
        for (let i = 0; i < res.visitedNodes.length; i++) {
            await new Promise((r) => setTimeout(r, speedRef.current));
            if (cancelRef.current) return;

            setGrid((old) => {
                const copy = old.map((row) => row.map((n) => ({ ...n })));
                const v = res.visitedNodes[i];
                copy[v.row][v.col].isVisited = true;
                return copy;
            });
        }

        for (let i = 0; i < res.shortestPath.length; i++) {
            await new Promise((r) => setTimeout(r, speedRef.current + 20));
            if (cancelRef.current) return;

            setGrid((old) => {
                const copy = old.map((row) => row.map((n) => ({ ...n })));
                copy[res.shortestPath[i].row][
                    res.shortestPath[i].col
                ].isShortestPath = true;

                return copy;
            });
        }

        setRunning(false);
    };

    const visAlgo = async () => {
        if (algo === "dijkstra") {
            visDijkstra();
        } else if (algo === "a*") {
        }
    };

    const handleResetBoard = async () => {
        cancelRef.current = true;
        setRunning(false);
        makeGrid();
        await new Promise((resolve) => setTimeout(resolve, 20));
        cancelRef.current = false;
    };

    const handleAlgoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgo(e.target.value);
    };

    return (
        <div className="flex flex-col gap-8 relative h-screen w-screen">
            <div className="text-white flex gap-x-2">
                <h1 className="px-5 py-3 text-xl bg-accent">Path Finder</h1>
                <Button disabled={running} onClick={visAlgo}>
                    Visualize!
                </Button>

                <Button onClick={handleResetBoard}>Reset Board</Button>
                <select
                    id="speed"
                    className="border-none"
                    onChange={speedChange}
                >
                    <option value="0" className="bg-black text-white">
                        Fast
                    </option>
                    <option value="40" className="bg-black text-white">
                        Average
                    </option>
                    <option value="100" className="bg-black text-white">
                        Slow
                    </option>
                </select>
                <select
                    id="algorithm"
                    className="border-none"
                    onChange={handleAlgoChange}
                >
                    <option value="dijkstra" className="bg-black text-white">
                        Dijkstra's Algorithm
                    </option>
                    <option value="a*" className="bg-black text-white">
                        A* Algorithm
                    </option>
                </select>
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
