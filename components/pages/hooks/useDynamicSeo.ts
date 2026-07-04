import { useEffect, useState } from "react";
import { PACKAGE_DATA } from "utils/constants";
import { findCleanEquivalent, getRouteByPath } from "utils/publicRoutes";

const { author } = PACKAGE_DATA;
const HOME_CANONICAL = `${author.url}/`;

type DynamicSeo = {
  canonical: string;
  robots: string;
};

const DEFAULT_SEO: DynamicSeo = {
  canonical: HOME_CANONICAL,
  robots: "index, follow",
};

// Resolves canonical + robots on the client. Clean routes self-canonicalize;
// legacy "?app=" / "?url=" query URLs become noindex and point their canonical
// at the clean equivalent so they consolidate instead of duplicating.
export const useDynamicSeo = (): DynamicSeo => {
  const [seo, setSeo] = useState<DynamicSeo>(DEFAULT_SEO);

  useEffect(() => {
    const { pathname, search } = window.location;
    const route = getRouteByPath(pathname);

    if (route) {
      setSeo({
        canonical:
          route.path === "/" ? HOME_CANONICAL : `${author.url}${route.path}`,
        robots: "index, follow",
      });

      return;
    }

    const params = new URLSearchParams(search);

    if (params.has("app") || params.has("url")) {
      const equivalent = findCleanEquivalent(params);

      setSeo({
        canonical: equivalent ? `${author.url}${equivalent}` : HOME_CANONICAL,
        robots: "noindex, follow",
      });

      return;
    }

    setSeo(DEFAULT_SEO);
  }, []);

  return seo;
};
