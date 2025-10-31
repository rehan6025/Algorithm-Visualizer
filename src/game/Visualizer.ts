export class Visualizer {
    private size = 10;
    arr: number[] = [];
    constructor(size: number) {
        this.size = size;
    }

    generateArray(): number[] {
        this.arr = [];
        for (let i = 0; i < this.size; i++) {
            this.arr.push(this.generateRandomNum(5, 300));
        }
        return this.arr;
    }

    generateRandomNum(min: number, max: number): number {
        return Math.ceil(Math.random() * (max - min) + min);
    }

    bubbleSort(array = this.arr): number[][] {
        const frames: number[][] = [];
        for (let i = array.length - 1; i >= 0; i--) {
            let flag: boolean = false;
            for (let j = 0; j <= i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    array[j] = array[j] + array[j + 1];
                    array[j + 1] = array[j] - array[j + 1];
                    array[j] = array[j] - array[j + 1];

                    flag = true;
                }
                frames.push([...array]);
            }
            if (flag === false) {
                break;
            }
        }

        return frames;
    }
}
