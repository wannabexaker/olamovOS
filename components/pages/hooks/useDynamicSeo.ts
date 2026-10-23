import { useSyncExternalStore } from "react";
import { PACKAGE_DATA } from "utils/constants";
import { findCleanEquivalent, getRouteByPath } from "utils/publicRoutes";

const { author } = PACKAGE_DATA;
const HOME_CANONICAL = `${author.url}/`;
const INDEX = "index, follow";
const NO_INDEX = "noindex, follow";

type DynamicSeo = {
  canonical: string;
  robots: string;
};

// Snapshots must be stable primitives, so the pair travels as one string.
const SEPARATOR = "\n";
const serialize = ({ canonical, robots }: DynamicSeo): string =>
  `${canonical}${SEPARATOR}${robots}`;
const DEFAULT_SNAPSHOT = serialize({
  canonical: HOME_CANONICAL,
  robots: INDEX,
});

// Clean routes self-canonicalize; legacy "?app=" / "?url=" query URLs become
// noindex and point their canonical at the clean equivalent so they
// consolidate instead of duplicating.
const resolveSeo = (pathname: string, search: string): DynamicSeo => {
  const params = new URLSearchParams(search);

  // Checked before the route lookup: "/" always matches the home route, so a
  // legacy "/?app=..." URL would otherwise be treated as the indexable home.
  if (params.has("app") || params.has("url")) {
    const equivalent = findCleanEquivalent(params);

    return {
      canonical: equivalent ? `${author.url}${equivalent}` : HOME_CANONICAL,
      robots: NO_INDEX,
    };
  }

  const route = getRouteByPath(pathname);

  if (route) {
    return {
      canonical:
        route.path === "/" ? HOME_CANONICAL : `${author.url}${route.path}`,
      robots: INDEX,
    };
  }

  return { canonical: HOME_CANONICAL, robots: INDEX };
};

const getSnapshot = (): string =>
  serialize(resolveSeo(window.location.pathname, window.location.search));

// The static export and the hydration pass render the site default; the
// client value replaces it right after, without a hydration mismatch.
const getServerSnapshot = (): string => DEFAULT_SNAPSHOT;

const subscribe = (onChange: () => void): (() => void) => {
  window.addEventListener("popstate", onChange);

  return () => window.removeEventListener("popstate", onChange);
};

export const useDynamicSeo = (): DynamicSeo => {
  const [canonical, robots] = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  ).split(SEPARATOR);

  return { canonical, robots };
};
