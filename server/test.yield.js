const school = 'TsinhuaUniversity';

// iterator => next, done
// for (const val of school) {
//     console.log(val);
// }

// Generative function
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const it = gen();

// console.log(it.next().value, it.next().value, it.next().value);

// ID generator
function* idMaker() {
  let index = 100;
  while (true) yield index++;
}

const genId = idMaker();

// for (const val of genId) {
//     if(val > 256) break;
//     console.log(val);
// }

// console.log(
//     genId.next().value, 
//     genId.next().value, 
//     genId.next().value,
//     genId.next().value,
//     genId.next().value,
// );

function* promiseTest(){
    yield Promise.resolve(100);
    yield Promise.resolve('Hello');
    // create timeout
    yield new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Timeout');
        }, 2000);
    });
}
// Async iterator
const promTest = promiseTest();
console.log(await promTest.next().value, await promTest.next().value, await promTest.next().value);

async function* promStringCreator(){
  yield await Promise.resolve('H');
  yield await Promise.resolve('a');
  yield await Promise.resolve('r');
  yield await Promise.resolve('v');
  yield await Promise.resolve('a');
  yield await Promise.resolve('r');
  yield await Promise.resolve('d');
}
let strUniName = '';
async function generate(){
  for await (const val of promStringCreator()){
    strUniName += val;
  }
  console.log(strUniName);
}

generate();
// Output: Harvard