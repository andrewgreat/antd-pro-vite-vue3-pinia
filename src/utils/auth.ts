function getCurrentAuthority() {
  return ["admin"];
}

 function check(authority: any) {
  const current = getCurrentAuthority();
  return current.some((item) => authority.includes(item));
}

function isLogin() {
  const current = getCurrentAuthority();
  return current && current[0] !== "guest";
}

export { getCurrentAuthority, check, isLogin } 