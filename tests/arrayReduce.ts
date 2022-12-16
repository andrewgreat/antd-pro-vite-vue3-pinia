const replacer = {
  "6px 6px 0 0": "6px 6px 0 0",
  "6px": "6px",
  "0 0 6px 6px": "0 0 6px 6px",
  "6px 0 0 0": "6px 0 0 0",
  "0 6px 0 0": "0 6px 0 0",
  "6px 0 0 6px": "6px 0 0 6px",
  "0 6px 6px 0": "0 6px 6px 0",
};

const defaultOpt = {
  primaryColor: "rgb(32, 151, 243)",
  otherColor: {
    layoutHeaderBackground: "rgb(103, 59, 183)",
    alertSuccessBgColor: "#52c41a",
  },
  radius: 4,
};

const otherColor = defaultOpt.otherColor;
const otherColorReplacer = Object.entries(otherColor).reduce((tol, key) => {
  return { ...tol, [key[1]]: key[1] };
}, {});
// console.log("otherColorReplacer", otherColorReplacer);

const radius = defaultOpt.radius;
const targetReplacer = Object.keys(replacer).reduce((tol, key) => {
  // console.log("tol...", tol);
  // console.log("key...", [key]);
  return { ...tol, [key]: key.replace(/6px/g, `${radius}px`) };
}, {});

// console.log("targetReplacer", targetReplacer);

function createOption(theme) {
  let themeOptions = {
    primaryColor: theme.primaryColor,
  };
  // 颜色板--切换一个非主题色
  if (theme.otherColor) {
    themeOptions = Object.assign(themeOptions, {
      gradientReplacer: Object.entries(theme.otherColor).reduce((tol, key) => {
        return { ...tol, [key[0]]: key[1] };
      }, {}),
    });
  }
  if (theme.radius) {
    themeOptions = Object.assign(themeOptions, {
      targetValueReplacer: Object.keys(replacer).reduce((tol, key) => {
        return { ...tol, [key]: key.replace(/6px/g, `${theme.radius}px`) };
      }, {}),
    });
  }
  console.log("themeOptions", themeOptions);
}

createOption(defaultOpt);
