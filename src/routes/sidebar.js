const roles = [
  {
    role: "super_admin",
    routes: [
      {
        path: "/app/marketing",
        icon: "CaseIcon",
        name: "Marketing",
      },
      {
        path: "/app/support",
        icon: "BellIcon",
        name: "Support",
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
    ],
  },
  {
    role: "admin_marketing",
    routes: [
      {
        path: "/app/marketing",
        icon: "CaseIcon",
        name: "Marketing",
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
    ],
  },
  {
    role: "admin_logistic",
    routes: [
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
        path: "/app/report",
        icon: "FormsIcon",
        name: "Report",
      },
    ],
  },
  {
    role: "admin_courier",
    routes: [
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
    ],
  },
  {
    role: "staff_marketing",
    routes: [
      {
        path: "/app/marketing",
        icon: "CaseIcon",
        name: "Marketing",
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
    ],
  },
  {
    role: "staff_logistic",
    routes: [
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
        path: "/app/report",
        icon: "FormsIcon",
        name: "Report",
      },
    ],
  },
  {
    role: "staff_courier",
    routes: [
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
    ],
  },

  {
    role: "admin_support",
    routes: [
      {
        path: "/app/support",
        icon: "BellIcon",
        name: "Support",
      },
      {
        path: "/app/report",
        icon: "FormsIcon",
        name: "Report",
      },
    ],
  },
  {
    role: "staff_support",
    routes: [
      {
        path: "/app/support",
        icon: "BellIcon",
        name: "Support",
      },
      {
        path: "/app/report",
        icon: "FormsIcon",
        name: "Report",
      },
    ],
  },
];

export default roles;
