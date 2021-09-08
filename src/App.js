import React, { lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import { AuthProvider } from "./context/Auth";
import { PrivateRoute } from "./routes/PrivateRoute";

const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() =>
  import("./pages/Authentication/CreateAccount")
);
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <AuthProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/create-account" component={CreateAccount} />
            <PrivateRoute path="/forgot-password" component={ForgotPassword} />
            <Route path="/app" component={Layout} />
            <Redirect exact from="/" to="/login" />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
