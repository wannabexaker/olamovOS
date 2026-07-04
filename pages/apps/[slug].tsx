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

type AppRouteProps = {
  route: PublicRoute;
};

const AppRoute = ({ route }: AppRouteProps): React.ReactElement => (
  <>
    <RouteSeo route={route} />
    <OlamovDesktop />
  </>
);

export const getStaticPaths: GetStaticPaths = () => ({
  fallback: false,
  paths: getRoutesByPrefix("/apps/").map((route) => ({
    params: { slug: getRouteSlug(route) },
  })),
});

export const getStaticProps: GetStaticProps<AppRouteProps> = ({ params }) => {
  const route = getRouteByPath(`/apps/${String(params?.slug)}`);

  return route ? { props: { route } } : { notFound: true };
};

export default memo(AppRoute);
