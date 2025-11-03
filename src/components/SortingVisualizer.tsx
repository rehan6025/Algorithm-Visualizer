import { useEffect, useRef, useState } from "react";

// const bubbleSortFrames = (array: number[]): number[][] => {
//     const arr = [...array];
//     const frames: number[][] = [];

//     for (let i = arr.length - 1; i >= 0; i--) {
//         let swapped = false;
//         for (let j = 0; j < i; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//                 swapped = true;
//             }
//             frames.push([...arr]);
//         }
//         if (!swapped) break;
//     }

//     return frames;
// };

const SortingVisualizer = () => {
    const [array, setArray] = useState<number[]>([]);
    const [isSorting, setIsSorting] = useState(false);
    const [active, setActive] = useState<number[]>([]);
    const [sortedEle, setSortedEle] = useState<number[]>([]);
    // const [frames, setFrames] = useState<number[][]>([]);
    const [size, setSize] = useState<number>(75);
    const [speed, setSpeed] = useState<number>(175);
    const [minim, setMinim] = useState<number>();
    const MAX_SPEED = 350;
    const cancelRef = useRef(false);

    const generateArray = (size: number): number[] => {
        return Array.from({ length: size }, () =>
            Math.ceil(Math.random() * (300 - 5) + 5)
        );
    };

    async function bubbleSort(array: number[]) {
        setSortedEle([]);

        for (let i = array.length - 1; i >= 0; i--) {
            let flag: boolean = false;
            for (let j = 0; j <= i - 1; j++) {
                setActive([j, j + 1]);

                await new Promise((resolve) => {
                    setTimeout(resolve, speed);
                });
                if (cancelRef.current) return array;

                if (array[j] > array[j + 1]) {
                    await new Promise((resolve) => {
                        setTimeout(resolve, speed);
                    });
                    if (cancelRef.current) return array;

                    array[j] = array[j] + array[j + 1];
                    array[j + 1] = array[j] - array[j + 1];
                    array[j] = array[j] - array[j + 1];

                    flag = true;
                    setArray([...array]);
                }
                await new Promise((resolve) => {
                    setTimeout(resolve, speed);
                });
                if (cancelRef.current) return array;
                setArray([...array]);
            }
            setSortedEle((prev) => [...prev, i]);
            if (flag === false) {
                break;
            }
        }
        for (let k = 0; k < array.length; k++) {
            if (!sortedEle.includes(k)) {
                setSortedEle((prev) => [...prev, k]);
            }
        }

        setActive([]);
        return array;
    }

    async function selectionSort(array: number[]) {
        setSortedEle([]);
        setMinim(-1);
        for (let i = 0; i < array.length; i++) {
            let mini = i;

            if (cancelRef.current) return;
            setMinim(i);
            for (let j = i + 1; j < array.length; j++) {
                setActive([i, j]);
                await new Promise((resolve) => {
                    setTimeout(resolve, speed + 10);
                });
                if (cancelRef.current) return;
                if (array[j] < array[mini]) {
                    mini = j;
                    setMinim(j);
                }
            }
            await new Promise((resolve) => {
                setTimeout(resolve, speed + 10);
            });
            if (cancelRef.current) return;
            if (mini != i) {
                array[i] = array[mini] + array[i];
                array[mini] = array[i] - array[mini];
                array[i] = array[i] - array[mini];
                await new Promise((resolve) => {
                    setTimeout(resolve, speed + 10);
                });
                if (cancelRef.current) return;
            }
            await new Promise((resolve) => {
                setTimeout(resolve, speed + 10);
            });
            setSortedEle((prev) => [...prev, i]);
        }
    }

    async function mergeSort(array: number[]) {
        const temp = new Array(array.length);
        await _mergeSort(array, temp, 0, array.length - 1);
    }

    async function _mergeSort(
        array: number[],
        temp: number[],
        start: number,
        end: number
    ) {
        setActive([]);
        if (start >= end) return;

        const mid = Math.floor((start + end) / 2);

        await _mergeSort(array, temp, start, mid);
        await _mergeSort(array, temp, mid + 1, end);

        let i = start;
        let j = mid + 1;
        let k = start;

        while (i <= mid && j <= end) {
            if (array[i] <= array[j]) {
                temp[k++] = array[i++];
            } else {
                temp[k++] = array[j++];
            }
            await new Promise((resolve) => {
                setTimeout(resolve, speed);
            });

            setActive([i, j]);
        }

        while (i <= mid) {
            temp[k++] = array[i++];
            setActive([i]);
        }

        while (j <= end) {
            temp[k++] = array[j++];
            setActive([j]);
        }

        for (let x = start; x <= end; x++) {
            setActive([x]);
            array[x] = temp[x];
            await new Promise((resolve) => {
                setTimeout(resolve, speed);
            });
        }

        setActive([]);
    }

    // useEffect(() => {
    //     if (frames.length === 0) return;

    //     setIsSorting(true);
    //     frames.forEach((frame, index) => {
    //         setTimeout(() => {
    //             setArray(frame);

    //             if (index === frames.length - 1) {
    //                 setSortedEle(Array.from(Array(frame.length).keys()));
    //                 setIsSorting(false);
    //             }
    //         }, index * 300);
    //     });
    // }, [frames]);

    useEffect(() => {
        generateNewArray();
    }, []);

    useEffect(() => {
        generateNewArray();
    }, [size, setSize]);

    const generateNewArray = () => {
        cancelRef.current = true;
        setActive([]);

        const newArray: number[] = generateArray(size);
        setArray(newArray);
        setIsSorting(false);
        setSortedEle([]);
        setMinim(-1);
    };

    return (
        <div className="flex flex-col items-center w-full h-[80vh] overflow-hidden p-2">
            <div className="flex items-end justify-center w-full h-full bg-light-background rounded-md overflow-hidden">
                {array.map((size, index) => (
                    <span
                        key={index}
                        style={{ height: `${size}px` }}
                        className={`${
                            sortedEle.includes(index)
                                ? "bg-orange-400"
                                : minim === index
                                ? "bg-amber-50"
                                : active.includes(index)
                                ? "bg-green-400"
                                : "bg-teal-500"
                        } w-1 ml-1 transition-all duration-75 `}
                    ></span>
                ))}
            </div>
            <input
                type="range"
                min={4}
                max={150}
                id="size"
                onChange={(e) => {
                    setSize(Number(e.target.value));
                }}
                disabled={isSorting}
            />
            <label htmlFor="size" className="text-light-text">
                Size
            </label>
            <input
                type="range"
                min={0}
                max={350}
                id="speed"
                onChange={(e) => {
                    setSpeed(MAX_SPEED - Number(e.target.value));
                }}
                disabled={isSorting}
            />
            <label htmlFor="speed" className="text-light-text">
                Speed
            </label>
            <button
                className="px-4 py-2 bg-light-background text-light-text rounded"
                onClick={generateNewArray}
            >
                Randomize
            </button>
            <button
                className="px-4 py-2 bg-light-background text-light-text rounded"
                onClick={async () => {
                    cancelRef.current = false;
                    setIsSorting(true);

                    await bubbleSort(array);

                    setIsSorting(false);
                }}
                disabled={isSorting}
            >
                Bubble Sort
            </button>
            {/* <button
                onClick={() => {
                    setFrames(bubbleSortFrames(array));
                }}  
            >
                new bubble sort
            </button> */}

            <button
                className="px-4 py-2 bg-light-background text-light-text rounded"
                onClick={async () => {
                    cancelRef.current = false;
                    setIsSorting(true);
                    await selectionSort(array);
                    setIsSorting(false);
                }}
            >
                Selection Sort
            </button>
            <button
                className="px-4 py-2 bg-light-background text-light-text rounded"
                onClick={async () => {
                    cancelRef.current = false;
                    setIsSorting(true);
                    await mergeSort(array);
                    setIsSorting(false);
                }}
            >
                Merge Sort
            </button>
        </div>
    );
};

export default SortingVisualizer;
