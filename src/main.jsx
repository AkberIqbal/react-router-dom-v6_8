import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/errorPage";

import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import { action as destroyAction } from "./routes/destroy";
import EditContact, { action as editAction } from "./routes/edit";

import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import Index from "./routes/index";

const browserRoutesAsObject = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            // comes here via fetcher.form method="post"
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            // this is the submit action
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>,
          },
        ],
      },
    ],
  },
];
const browserRoutesAsJSXElements = createRoutesFromElements(
  <Route
    path="/"
    element={<Root />}
    loader={rootLoader}
    action={rootAction}
    errorElement={<ErrorPage />}
  >
    <Route errorElement={<ErrorPage />}>
      <Route index element={<Index />} />
      <Route
        path="contacts/:contactId"
        element={<Contact />}
        loader={contactLoader}
        action={contactAction}
      />
      <Route
        path="contacts/:contactId/edit"
        element={<EditContact />}
        loader={contactLoader}
        action={editAction}
      />
      <Route path="contacts/:contactId/destroy" action={destroyAction} />
    </Route>
  </Route>
);

const router = createBrowserRouter(
  browserRoutesAsObject || browserRoutesAsJSXElements
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
