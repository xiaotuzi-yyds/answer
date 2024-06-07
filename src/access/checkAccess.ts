import ACCESS_ENUM from "@/access/accessEnum";

const checkAccess = (
  loginUser: API.LoginUserVO,
  needAccess = ACCESS_ENUM.NOT_LOGIN
) => {
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (
    (needAccess === ACCESS_ENUM.USER || needAccess === ACCESS_ENUM.ADMIN) &&
    loginUserAccess === ACCESS_ENUM.NOT_LOGIN
  ) {
    return false;
  }
  if (
    needAccess === ACCESS_ENUM.ADMIN &&
    loginUserAccess === ACCESS_ENUM.USER
  ) {
    return false;
  }
  return true;
};

export default checkAccess;
