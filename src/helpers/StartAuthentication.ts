export default () => {
  // ? Window size from https://github.com/cory2067/osumod/blob/cd33683a15472d8e79b30ed93689e92fa158ec99/client/src/components/modules/LoginButton.js#L17

  const width = 600;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const _window = window.open(
    "https://osu.ppy.sh/oauth/authorize?response_type=code&redirect_uri=http://localhost:3000/api/validate&client_id=15092&scope=identify",
    "",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
    scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
    height=${height}, top=${top}, left=${left}`
  );

  _window.addEventListener("message", (ev) => {
    console.log(ev.data);

    localStorage["user_login"] = JSON.stringify(ev.data);

    location.reload();
  });
};
