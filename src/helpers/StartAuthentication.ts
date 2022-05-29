export default () => {
  const _window = window.open(
    "https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=http://localhost:3000/api/validate&client_id=15092&scope=identify"
  );

  if (_window) {
    _window.addEventListener("message", (ev) => {
      console.log(ev.data);

      localStorage["user_login"] = JSON.stringify(ev.data);

      window.location.reload();
      _window.close();
    });
  }
};
