let a = "imagePreviewOperationDisabledColor";
let b = `image-preview-operation-disabled-color`;

function toDashline(str) {
  let tuo = "";
  let arr = str.split("");
  let newArr = arr.map((item) => {
    return item.toUpperCase() === item
      ? (item = "-" + item.toLowerCase())
      : item;
  });
  tuo = newArr.join("");
  return tuo;
}

function toCamel(str) {
  let feng = ``;
  let arr = str.split(`-`);
  let newArr = arr.map((item, idx) => {
    return idx === 0 ? item : item[0].toUpperCase() + item.slice(1);
  });
  feng = newArr.join(``);
  return feng;
}

//驼峰转换下划线
function camelToDashline(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

//下划线转换驼峰
function dashlineToCamel(str) {
  return str.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());
}

console.log(toDashline(a));
console.log(camelToDashline(a));
console.log(toCamel(b));
console.log(dashlineToCamel(b));
