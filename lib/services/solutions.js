//to use these solutions copy & paste them in the editor and ctrl+/ on the whole block - 
//the first few lines with // for annotations should stay of-course, as in the task content

//1
// `//write a function called "sumEvenNumbers" that gets as input an array of  
// //numbers and returns the sum of all the even numbers in the array.
// 
// function sumEvenNumbers(numbers) {
//   return numbers.reduce((sum, num) => {
//     if (num % 2 === 0) {
//       return sum + num;
//     }
//     return sum;
//   }, 0);
// }`


//2
// `//Write a function called "countVowels" that takes a string as input and
// // returns the number of vowels (a, e, i, o, u) in the string.
// 
// function countVowels(str) {
//   const vowels = ['a', 'e', 'i', 'o', 'u'];
//   let count = 0;
//   for (let char of str) {
//     if (vowels.includes(char.toLowerCase())) {
//       count++;
//     }
//   }
//   return count;
// }`


//3
// `//Write a function called "checkInput that for a given input pair of number and string
// //checks: if the number is positive: prints the string in uppercase,
// //if the number is negative: prints the string in lowercase
// //and if the number is 0: prints the empty string.
// function checkInput(numb, string) {
//   if (number > 0) {
//     console.log(string.upper());
//   } 
//   else if (number < 0) {
//     console.log(string.lower());
//   } 
//   else {
//     console.log("");
//   }
// }`

//4
// `//Write a function called truncateString that takes a string and a number 
// //maxLength as input. If the string length is greater than maxLength, 
// //truncate the string and add '...' at the end. Otherwise, return the original string.
//
// function truncateString(str, maxLength) {
//   if (str.length > maxLength) {
//     return str.slice(0, maxLength) + '...';
//   }
//   return str;
// }`




//5
// `//Write a function called fetchData that simulates an asynchronous operation
// //and returns a promise. The promise should resolve with a message 
// //"Data fetched successfully!" after a delay of 2 seconds.
//
// function fetchData() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Data fetched successfully!");
//     }, 2000);
//   });
// }`