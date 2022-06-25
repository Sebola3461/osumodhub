export default (user: any) => {
  fetch("/api/queues/new", {
    method: "post",
    headers: {
      authorization: user.account_token,
    },
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.status == 200) {
        const loginData = JSON.parse(localStorage["user_login"]);
        loginData.hasQueue = true;
        localStorage["user_login"] = JSON.stringify(loginData);

        window.location.pathname = `/queue/${user._id}`;
      }
    });
};
