import "../../styles/PathVisualizer.css";

export type NodeProps = {
    distance?: number;
    prevNode?: NodeProps | null;
    isWall: boolean;
    isStart: boolean;
    isEnd: boolean;
    isVisited: boolean;
    isShortestPath: boolean;
    row: number;
    col: number;
    onMouseEnter?: (row: number, col: number) => void;
    onMouseDown?: (row: number, col: number) => void;
    onMouseLeave?: (row: number, col: number) => void;
    onMouseUp?: (row: number, col: number) => void;
};

const Node = ({
    isWall,
    isStart,
    isEnd,
    isVisited,
    isShortestPath,
    row,
    col,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onMouseLeave,
}: NodeProps) => {
    const special = isStart
        ? "start"
        : isEnd
        ? "end"
        : isWall
        ? "wall"
        : isShortestPath
        ? "path"
        : isVisited
        ? "visited"
        : "";
    return (
        <td
            draggable={false}
            className={"node_" + special}
            id={`${row}-${col}`}
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={() => onMouseDown && onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter && onMouseEnter(row, col)}
            onMouseLeave={() => onMouseLeave && onMouseLeave(row, col)}
            onMouseUp={() => onMouseUp && onMouseUp(row, col)}
        ></td>
    );
};

export default Node;
