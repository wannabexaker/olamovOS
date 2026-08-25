import Head from "next/head";
import SeoContent from "components/pages/seo/SeoContent";
import { PACKAGE_DATA } from "utils/constants";
import { type PublicRoute } from "utils/publicRoutes";

const { author } = PACKAGE_DATA;
const DEFAULT_OG_IMAGE = `${author.url}/Users/Public/Pictures/olamov-default.png`;

type RouteSeoProps = {
  route: PublicRoute;
};

// Per-route, statically rendered <head> that overrides the global <Metadata />
// defaults (deduped by matching `key` props), plus the crawlable body content.
const RouteSeo: FC<RouteSeoProps> = ({ route }) => {
  const canonical = `${author.url}${route.path}`;
  const title = route.title || "Olamov OS";
  const description = route.description || "";
  // A purpose-built share card wins; gallery routes fall back to the wallpaper
  // itself; everything else uses the site-wide default.
  const ogImage = route.ogImage
    ? `${author.url}${route.ogImage}`
    : route.image && route.url
      ? `${author.url}/${encodeURI(route.url)}`
      : DEFAULT_OG_IMAGE;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta key="description" content={description} name="description" />
        <link key="canonical" href={canonical} rel="canonical" />
        <meta key="robots" content="index, follow" name="robots" />
        <meta key="og:title" content={title} property="og:title" />
        <meta
          key="og:description"
          content={description}
          property="og:description"
        />
        <meta key="og:url" content={canonical} property="og:url" />
        <meta key="og:image" content={ogImage} property="og:image" />
        {route.ogImage && (
          <meta key="og:image:width" content="1200" property="og:image:width" />
        )}
        {route.ogImage && (
          <meta
            key="og:image:height"
            content="630"
            property="og:image:height"
          />
        )}
        <meta key="twitter:title" content={title} name="twitter:title" />
        <meta
          key="twitter:description"
          content={description}
          name="twitter:description"
        />
        <meta key="twitter:image" content={ogImage} name="twitter:image" />
      </Head>
      <SeoContent route={route} />
    </>
  );
};

export default RouteSeo;
