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

type GameRouteProps = {
  route: PublicRoute;
};

const GameRoute = ({ route }: GameRouteProps): React.ReactElement => (
  <>
    <RouteSeo route={route} />
    <OlamovDesktop />
  </>
);

export const getStaticPaths: GetStaticPaths = () => ({
  fallback: false,
  paths: getRoutesByPrefix("/games/").map((route) => ({
    params: { slug: getRouteSlug(route) },
  })),
});

export const getStaticProps: GetStaticProps<GameRouteProps> = ({ params }) => {
  const route = getRouteByPath(`/games/${String(params?.slug)}`);

  return route ? { props: { route } } : { notFound: true };
};

export default memo(GameRoute);
