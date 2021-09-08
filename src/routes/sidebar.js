const routes = [
  {
    path: "/app/marketing",
    icon: "CaseIcon",
    name: "Marketing",
  },
  {
    icon: "CardsIcon",
    name: "Logistic",
    routes: [
      {
        path: "/app/logistic/to-collect",
        name: "Collect",
      },
      {
        path: "/app/logistic/to-return",
        name: "Return",
      },
    ],
  },
  {
    icon: "GithubIcon",
    name: "Courier",
    routes: [
      {
        path: "/app/courier/to-deliver",
        name: "Delivery",
      },
      {
        path: "/app/courier/to-pickup",
        name: "Pickup",
      },
    ],
  },
  {
    path: "/app/report",
    icon: "FormsIcon",
    name: "Report",
  },
  {
    path: "/app/employee",
    icon: "PeopleIcon",
    name: "Employee",
  },

  // {
  //   icon: "PagesIcon",
  //   name: "Pages",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/login",
  //       name: "Login",
  //     },
  //     {
  //       path: "/create-account",
  //       name: "Create account",
  //     },
  //     {
  //       path: "/forgot-password",
  //       name: "Forgot password",
  //     },
  //     {
  //       path: "/app/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/app/blank",
  //       name: "Blank",
  //     },
  //   ],
  // },
];

export default routes;
