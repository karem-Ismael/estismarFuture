import store from "../store";

export function userCan(doThat) {
  const is_super_user = store?.getState()?.authUser?.user?.is_super_user;
  const privileges = store?.getState()?.authUser?.user?.privileges;

  if (is_super_user === true) {
    return true;
  }
  return privileges.includes(doThat) || doThat === "no.permission";
}
