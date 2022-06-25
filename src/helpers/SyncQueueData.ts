export default (user: any) => {
  if (user._id == -1) return;

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
        if (data.status != 200)
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
        if (data.status != 200) return window.alert(`${data.message}`);

        // ? For some reason, JSON.parse returns a string??
        let loginData = JSON.parse(localStorage.getItem("user_login"));

        Object.assign(loginData, {
          isBn: data.data.isBn,
          hasQueue: data.data.hasQueue,
        });

        localStorage["user_login"] = JSON.stringify(loginData);
      });
  }
};
