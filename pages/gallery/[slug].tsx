import { type GetStaticPaths, type GetStaticProps } from "next";
import { memo } from "react";
import OlamovDesktop from "components/pages/OlamovDesktop";
import RouteSeo from "components/pages/seo/RouteSeo";
import {
  type PublicRoute,
  getRouteByPath,
  getRouteSlug,
  getRoutesByPrefix,
} from "utils/publicRoutes";

type GalleryRouteProps = {
  route: PublicRoute;
};

const GalleryRoute = ({ route }: GalleryRouteProps): React.ReactElement => (
  <>
    <RouteSeo route={route} />
    <OlamovDesktop />
  </>
);

export const getStaticPaths: GetStaticPaths = () => ({
  fallback: false,
  paths: getRoutesByPrefix("/gallery/").map((route) => ({
    params: { slug: getRouteSlug(route) },
  })),
});

export const getStaticProps: GetStaticProps<GalleryRouteProps> = ({
  params,
}) => {
  const route = getRouteByPath(`/gallery/${String(params?.slug)}`);

  return route ? { props: { route } } : { notFound: true };
};

export default memo(GalleryRoute);
