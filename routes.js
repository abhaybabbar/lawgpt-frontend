import { useEffect } from "react";
import { useRouter } from "next/router";
import Home from "./pages";
import Login from "./pages/login";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token");
    console.log(token);
    console.log("this is being user");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return <Component {...rest} />;
};

const routes = [
  {
    path: "/",
    component: PrivateRoute,
    exact: true,
    routes: [
      {
        path: "/home",
        component: Home,
        exact: true,
      },
    ],
  },
  {
    path: "/loginpage",
    component: Login,
    exact: true,
  },
];

export default routes;
