export default (user: any) => {
  if (user._id == -1) return;

  fetch("/api/queues/sync", {
    method: "post",
    headers: {
      authorization: user.account_token,
    },
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.status != 200)
        return window.alert(`We can't sync your queue!
        ${data.message}`);
    });
};
