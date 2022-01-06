export default ({ app, route, redirect }) => {
  if (!app.$fire.auth.currentUser) {
    switch (route.name) {
      case "signin":
        break;

      default:
        return redirect("/signin");
    }
  } else {
    switch (route.name) {
      case "signin":
        return redirect("/");

      default:
        break;
    }
  }
};
