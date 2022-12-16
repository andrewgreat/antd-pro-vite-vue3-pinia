import setCustomTheme from "@setCustomTheme";
import Color from "color";

/**
const ThemeOpt = {
  primaryColor: "rgb(32, 151, 243)",
  otherColor: {
    "#F7D06B": "rgb(103, 59, 183)",
  },
  radius: {
    "0 0 6px 6px": "0 0 4px 4px",
    "0 6px 0 0": "0 4px 0 0",
    "0 6px 6px 0": "0 4px 4px 0",
    "6px": "4px",
    "6px 0 0 0": "4px 0 0 0",
    "6px 0 0 6px": "4px 0 0 4px",
    "6px 6px 0 0": "4px 4px 0 0",
  },
};
 */

export interface ThemeType {
  primaryColor: string;
  otherColor?: {
    layoutHeaderBackground?: string;
    // 对应less变量 @alert-success-bg-color 的值，让它单独切换，不跟随主题色
    alertSuccessBgColor?: string;
  }; //其他非主题色
  radius?: string; //圆角
}

interface ThemeOptType {
  primaryColor: string;
  targetValueReplacer?: object;
  gradientReplacer?: {
    // [layoutHeaderBackground]?: string,
    // [alertSuccessBgColor]?: string,
  };
}

// 分析 targetValueReplacer 得到一组值是可以通过 "6px" 替换的
const replacer = {
  "6px 6px 0 0": "6px 6px 0 0",
  "6px": "6px",
  "0 0 6px 6px": "0 0 6px 6px",
  "6px 0 0 0": "6px 0 0 0",
  "0 6px 0 0": "0 6px 0 0",
  "6px 0 0 6px": "6px 0 0 6px",
  "0 6px 6px 0": "0 6px 6px 0",
};

export function changeTheme(theme: ThemeType) {
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

  setCustomTheme({
    Color,
    ...themeOptions,
  });
}
