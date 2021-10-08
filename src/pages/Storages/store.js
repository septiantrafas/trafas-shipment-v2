import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "./employeesSlice";
import ordersReducer from "./ordersSlice";
import orderlogsReducer from "./orderlogsSlice";
import reportsReducer from "./reportsSlice";
import supportsReducer from "./supportsSlice";

export default configureStore({
  reducer: {
    employees: employeesReducer,
    orders: ordersReducer,
    orderlogs: orderlogsReducer,
    reports: reportsReducer,
    supports: supportsReducer,
  },
});
