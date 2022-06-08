export default (user: any) => {
  fetch("/api/queues/new", {
    method: "post",
    headers: {
      authorization: user.account_token,
    },
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.status == 200)
        return (window.location.pathname = `/queue/${user._id}`);
    });
};
