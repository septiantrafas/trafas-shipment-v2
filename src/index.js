import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/tailwind.output.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import { Provider } from "react-redux";
import store from "./pages/Storages/store";

ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences>
        <Provider store={store}>
          <App />
        </Provider>
      </Windmill>
    </Suspense>
  </SidebarProvider>,
  document.getElementById("root")
);
