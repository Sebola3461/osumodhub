export default (user: any) => {
  if (user._id == "-1") return;

  if (user.hasQueue) {
    syncQueue();
    syncUser();
  } else {
    syncUser();
  }

  function syncQueue() {
    fetch("/api/queues/sync", {
      method: "post",
      headers: {
        authorization: user.account_token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status != 200 && data.status != 404)
          return window.alert(`We can't sync your queue!\n${data.message}`);
      });
  }

  function syncUser() {
    fetch("/api/users/sync", {
      method: "post",
      headers: {
        authorization: user.account_token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status != 200 && data.status != 404)
          return window.alert(`${data.message}`);

        let loginData = JSON.parse(localStorage["user_login"]);

        loginData.hasQueue = data.data.hasQueue;
        loginData.isBn = data.data.isBn;

        //localStorage["user_login"] = JSON.stringify(loginData);
      });
  }
};
