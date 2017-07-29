export default {
  contains(arr, obj) {
    let i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  }
};


export function coverEval(fn) {
  var Fn = Function;  //一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)();
};
