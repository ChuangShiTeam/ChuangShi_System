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

export function compress(source) {
  if (source) {
    let rep = /\n+/g;
    let repone = /<!--.*?-->/ig;
    let reptwo = /\/\*.*?\*\//ig;
    let reptree = /[ ]+</ig;
    let sourceZero = source.replace(rep,"");
    let sourceOne = sourceZero.replace(repone,"");
    let sourceTwo = sourceOne.replace(reptwo,"");
    let sourceTree = sourceTwo.replace(reptree,"<");
    return sourceTree;
  }
  return source;
}
