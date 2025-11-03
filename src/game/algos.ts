export function mergeSort(array: number[]): void {
    const temp = new Array(array.length);
    _mergeSort(array, temp, 0, array.length - 1);
}

function _mergeSort(
    array: number[],
    temp: number[],
    start: number,
    end: number
): void {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    _mergeSort(array, temp, start, mid);
    _mergeSort(array, temp, mid + 1, end);

    let i = start;
    let j = mid + 1;
    let k = start;

    while (i <= mid && j <= end) {
        if (array[i] <= array[j]) {
            temp[k++] = array[i++];
        } else {
            temp[k++] = array[j++];
        }
    }

    while (i <= mid) {
        temp[k++] = array[i++];
    }

    while (j <= end) {
        temp[k++] = array[j++];
    }

    for (let x = start; x <= end; x++) {
        array[x] = temp[x];
    }
}
