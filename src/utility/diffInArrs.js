export function diffInArrs(arr1, arr2, ...compParameters) {
  const res = {
    add: [],
    delete: [],
    edit: [],
  };
  for (let i = 0, i2 = 0; i < Math.max(arr2.length, arr1.length); i++, i2++) {
    // console.log("outer");
    if (i > arr1.length - 1) {
      res.add.push(arr2[i2]);
      continue;
    }
    if (i2 > arr2.length - 1) {
      res.delete.push(arr1[i]);
      continue;
    }
    for (let j = 0; j < compParameters.length; j++) {
      //   console.log("inner");
      if (arr1[i][compParameters[j]] !== arr2[i2][compParameters[j]]) {
        if (compParameters[j] === "taskGlobalId") {
          for (
            ;
            i < arr1.length &&
            arr1[i][compParameters[j]] !== arr2[i2][compParameters[j]];
            i++
          ) {
            // console.log("innest");
            res.delete.push(arr1[i]);
          }
          i--;
        } else if (compParameters[j] === "name") {
          res.edit.push(arr2[i2]);
        }
      }
    }
  }
  return res;
}

const test1 = [
  { name: "Test1", taskGlobalId: "4c4ae910-40f7-40fa-8697-1defbd362ec3" },
  { name: "Test2", taskGlobalId: "edbf4ef0-8aa3-4b1b-b48b-186a58b525ad" },
  { name: "Test2", taskGlobalId: "edbf4ef0-8aa3-4b1b-b48b-186a58b525aa" },
];
const test2 = [
  { name: "Test1", taskGlobalId: "4c4ae910-40f7-40fa-8697-1defbd362ec3" },
  { name: "Test2", taskGlobalId: "edbf4ef0-8aa3-4b1b-b48b-186a58b525ad" },
];
// console.log(diffInArrs(test1, test2, "taskGlobalId", "name"));
