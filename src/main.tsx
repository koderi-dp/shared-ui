import { RouterProvider, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BlocksPage } from "./demo/pages/blocks";
import { ChartsPage } from "./demo/pages/charts";
import { DetailPage } from "./demo/pages/detail";
import { OverviewPage } from "./demo/pages/overview";
import { PrimitivesPage } from "./demo/pages/primitives";
import { SettingsPage } from "./demo/pages/settings";
import { RootLayout, ShellLayout } from "./demo/shell";
import "./styles.css";

const rootRoute = createRootRoute({ component: RootLayout });

/** Pathless layout route: everything under it is drawn inside the app shell. */
const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: ShellLayout,
});

const overviewRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/",
  component: OverviewPage,
});
const primitivesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/primitives",
  component: PrimitivesPage,
});
const blocksRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/blocks",
  component: BlocksPage,
});
const chartsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/charts",
  component: ChartsPage,
});
const detailRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/detail/$id",
  component: DetailPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  shellRoute.addChildren([
    overviewRoute,
    primitivesRoute,
    blocksRoute,
    chartsRoute,
    detailRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
