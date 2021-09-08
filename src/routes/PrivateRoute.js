import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/Auth";

export function PrivateRoute({ component: Component, roles, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }
        return <Component {...props} />;
      }}
    />
  );
}
