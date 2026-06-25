const USER_KEY = "user";
const AUTH_CHANGE_EVENT = "auth:changed";

const canUseStorage = () => typeof localStorage !== "undefined";

const safeParse = (value, fallback = null) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const getUser = () => {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  return safeParse(raw, null);
};

const notifyAuthChange = (user) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGE_EVENT, {
      detail: { user },
    })
  );
};

const setUser = (user) => {
  if (!canUseStorage() || !user) return null;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange(user);
  return user;
};

const removeUser = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(USER_KEY);
  notifyAuthChange(null);
};

const isLogin = () => Boolean(getUser());

export {
  AUTH_CHANGE_EVENT,
  USER_KEY,
  getUser,
  setUser,
  removeUser,
  isLogin,
};
