import routesData from "utils/seoRoutes.json";

export type PublicRouteKind = "app" | "game" | "gallery" | "home";

export type PublicRoute = {
  app?: string;
  category?: string;
  description?: string;
  h1?: string;
  image?: boolean;
  kind: PublicRouteKind;
  path: string;
  title?: string;
  url?: string;
};

export const PUBLIC_ROUTES = routesData as PublicRoute[];

const stripPath = (path: string): string =>
  path.replace(/\.html$/, "").replace(/\/+$/, "") || "/";

const stripSlashes = (value: string): string => value.replace(/^\/+/, "");

export const getRouteByPath = (path: string): PublicRoute | undefined =>
  PUBLIC_ROUTES.find((route) => route.path === stripPath(path));

export const getRoutesByPrefix = (prefix: string): PublicRoute[] =>
  PUBLIC_ROUTES.filter((route) => route.path.startsWith(prefix));

export const getRouteSlug = (route: PublicRoute): string =>
  route.path.split("/").pop() || "";

// Maps a legacy "?app=" / "?url=" query URL to its clean canonical equivalent.
export const findCleanEquivalent = (
  params: URLSearchParams
): string | undefined => {
  const app = params.get("app");
  const url = params.get("url");

  if (app) {
    const match = PUBLIC_ROUTES.find(
      (route) => route.app?.toLowerCase() === app.toLowerCase()
    );

    if (match) return match.path;
  }

  if (url) {
    const normalized = stripSlashes(decodeURIComponent(url));
    const match = PUBLIC_ROUTES.find(
      (route) => route.url && stripSlashes(route.url) === normalized
    );

    if (match) return match.path;
  }

  return undefined;
};
