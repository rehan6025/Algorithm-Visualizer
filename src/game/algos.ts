export function mergeSort(array: number[]): number[] {
    for (let i = array.length - 1; i >= 0; i--) {
        let flag: boolean = false;
        for (let j = 0; j <= i - 1; j++) {
            if (array[j] > array[j + 1]) {
                array[j] = array[j] + array[j + 1];
                array[j + 1] = array[j] - array[j + 1];
                array[j] = array[j] - array[j + 1];

                flag = true;
            }
        }
        if (flag === false) {
            break;
        }
    }

    return array;
}
