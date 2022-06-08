export default () => {
  delete localStorage["user_login"];
  window.location.pathname = "/";
};
