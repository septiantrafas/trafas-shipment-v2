import { lazy } from "react";

const Employee = lazy(() => import("../pages/Employee/Employee"));
const Order = lazy(() => import("../pages/Marketing/Order"));
const Collect = lazy(() => import("../pages/Logistic/Collect"));
const Return = lazy(() => import("../pages/Logistic/Return"));
const Delivery = lazy(() => import("../pages/Courier/Delivery"));
const Pickup = lazy(() => import("../pages/Courier/Pickup"));
const Report = lazy(() => import("../pages/Report/Report"));
const CreateOrder = lazy(() => import("../pages/Marketing/CreateOrder"));
const EditOrder = lazy(() => import("../pages/Marketing/EditOrder"));
const TrackTrace = lazy(() => import("../components/TrackAndTrace/TrackTrace"));

const routes = [
  {
    path: "/employee",
    component: Employee,
  },
  {
    path: "/marketing",
    component: Order,
  },
  {
    path: "/marketing/new-order",
    component: CreateOrder,
  },
  {
    path: "/marketing/edit-order/:id",
    component: EditOrder,
  },
  {
    path: "/logistic/to-collect",
    component: Collect,
  },
  {
    path: "/logistic/to-return",
    component: Return,
  },
  {
    path: "/courier/to-deliver",
    component: Delivery,
  },
  {
    path: "/courier/to-pickup",
    component: Pickup,
  },
  {
    path: "/report",
    component: Report,
  },
  {
    path: "/track-trace/:id",
    component: TrackTrace,
  },
];

export default routes;
