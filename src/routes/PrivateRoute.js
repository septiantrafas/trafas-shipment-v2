import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/Auth";

export function PrivateRoute({ component: Component, roles, ...rest }) {
  const { user, userRole } = useAuth();
  let rctUser = userRole?.role ?? "admin_marketing";
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }
        if (roles && roles.indexOf(rctUser) === -1) {
          return <Redirect to="/app" />;
        }
        return <Component {...props} />;
      }}
    />
  );
}
