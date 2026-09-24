// // leet code 1 problmem

// const number = [2, 7, 11, 15];
// const target = 9;
// let Index = [];

// const returnIndex = () => {
//     for (let i = 0; i < number.length; i++) {
//         for (let j = i + 1; j < number.length; j++) {
//             let sum = number[i] + number[j];
//             if (sum === target) {
//                 Index.push(i, j);
//                 return Index;
//             }
//         }
//     }
// };

// const index = returnIndex();
// console.log('index', index);

// // leet code 2 problmem for based on array concept

// let array1 = [2, 4, 3]
// let array2 = [5, 6, 4]
// let result = []
// let cerry = 0
// const sumOfArray = () => {
//     for (let i = array1.length - 1; i >= 0; i--) {
//         let num = array2[i]
//         let sum = array1[i] + num + cerry
//         if (sum >= 10) {
//             let digit = sum % 10;
//             cerry = Math.floor(sum / 10);
//             result.push(digit)
//         }
//         else {
//             cerry = 0
//             result.push(sum)
//         }
//     }

//     return result
// }

// let sumArrayResult = sumOfArray()
// console.log('index', sumArrayResult);

// problem number 26
// let number = [1, 1, 2, 2, 3]

// let number = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
// let unicCount = 0
// const sortArry = () => {
//   for (let i = 0; i < number.length; i++) {
//     if (number[i] != number[i + 1]) {
//       number[unicCount] = number[i]
//       unicCount++
//     }
//   }
// }

// let resultSorrtArray = sortArry()
// console.log('index', unicCount, number);


// problem number 27 leet code 
// let nums = [0, 1, 2, 2, 3, 0, 4, 2]
// let value = 2
// let unicCount = 0

// for (let i = 0; i < nums.length; i++) {
//   if (nums[i] != value) {
//     nums[unicCount] = nums[i]
//     unicCount++
//   }
// }

// console.log('index', unicCount, nums);


// problem number 35 leet code 

// const num = [1, 3, 5, 6]
// const target = 2
// var searchInsert = function (nums, target) {
//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] >= target) {
//       return i
//     }
//   }

//   return nums.length
// }


// let serch = searchInsert(num, target);
// console.log('index', serch);

// problem number 66 leet code 

// let array = [[1, 3], [2, 6], [8, 10], [15, 18]]
// let result = []
// const mergeArray = () => {
//   for (let i = 0; i < array.length; i++) {
//     for (let j = 0; j < array[i].length; j++) {

//       console.log(array[i][j])
//     }

//   }
// }

// console.log('index', mergeArray(array))