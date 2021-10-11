import { lazy } from "react";

const Employee = lazy(() => import("../pages/Employee/Employee"));
const Order = lazy(() => import("../pages/Marketing/Order"));
const Support = lazy(() => import("../pages/Support/Support"));
const Collect = lazy(() => import("../pages/Logistic/Collect"));
const Return = lazy(() => import("../pages/Logistic/Return"));
const Delivery = lazy(() => import("../pages/Courier/Delivery"));
const Pickup = lazy(() => import("../pages/Courier/Pickup"));
const Report = lazy(() => import("../pages/Report/Report"));
const CreateOrder = lazy(() => import("../pages/Marketing/CreateOrder"));
const EditOrder = lazy(() => import("../pages/Marketing/EditOrder"));
const TrackTrace = lazy(() => import("../components/TrackAndTrace/TrackTrace"));
const PickEmployee = lazy(() =>
  import("../components/StatusLogs/PickEmployee")
);
const UpdateStatus = lazy(() =>
  import("../components/StatusLogs/UpdateStatus")
);
const EditPassword = lazy(() => import("../pages/Authentication/EditPassword"));
const PickSupport = lazy(() => import("../pages/Support/PickSupport"));

const routes = [
  {
    path: "/employee",
    component: Employee,
    roles: ["super_admin"],
  },
  {
    path: "/marketing",
    component: Order,
    roles: ["super_admin", "admin_marketing", "staff_marketing"],
  },
  {
    path: "/support",
    component: Support,
    roles: ["super_admin", "admin_support", "staff_support"],
  },
  {
    path: "/:type/pick-employee/:id",
    component: PickSupport,
    roles: [
      "super_admin",
      "admin_logistic",
      "staff_logistic",
      "admin_courier",
      "staff_courier",
      "admin_support",
      "staff_support",
    ],
  },
  {
    path: "/marketing/new-order",
    component: CreateOrder,
    roles: ["super_admin", "admin_marketing", "staff_marketing"],
  },
  {
    path: "/marketing/edit-order/:id",
    component: EditOrder,
    roles: ["super_admin", "admin_marketing", "staff_marketing"],
  },
  {
    path: "/logistic/to-collect",
    component: Collect,
    roles: ["super_admin", "admin_logistic", "staff_logistic"],
  },
  {
    path: "/logistic/to-return",
    component: Return,
    roles: ["super_admin", "admin_logistic", "staff_logistic"],
  },
  {
    path: "/courier/to-deliver",
    component: Delivery,
    roles: [
      "super_admin",
      "admin_courier",
      "staff_courier",
      "admin_marketing",
      "staff_marketing",
    ],
  },
  {
    path: "/courier/to-pickup",
    component: Pickup,
    roles: [
      "super_admin",
      "admin_courier",
      "staff_courier",
      "admin_marketing",
      "staff_marketing",
    ],
  },
  {
    path: "/report",
    component: Report,
    roles: [
      "super_admin",
      "admin_marketing",
      "staff_marketing",
      "admin_logistic",
      "staff_logistic",
      "admin_courier",
      "staff_courier",
      "admin_support",
      "staff_support",
      "finance",
    ],
  },
  {
    path: "/update-password/:id",
    component: EditPassword,
    roles: [
      "super_admin",
      "admin_marketing",
      "staff_marketing",
      "admin_logistic",
      "staff_logistic",
      "admin_courier",
      "staff_courier",
    ],
  },
  {
    path: "/track-trace/:id",
    component: TrackTrace,
    roles: [
      "super_admin",
      "admin_marketing",
      "staff_marketing",
      "admin_logistic",
      "staff_logistic",
      "admin_courier",
      "staff_courier",
    ],
  },
  {
    path: "/pick-employee/:id/:type",
    component: PickEmployee,
    roles: [
      "super_admin",
      "admin_logistic",
      "staff_logistic",
      "admin_courier",
      "staff_courier",
    ],
  },
  {
    path: "/update-status/:status_name/:order_id/:id",
    component: UpdateStatus,
    roles: [
      "super_admin",
      "admin_logistic",
      "staff_logistic",
      "admin_courier",
      "staff_courier",
    ],
  },
];

export default routes;
