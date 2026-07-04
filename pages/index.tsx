import { memo } from "react";
import OlamovDesktop from "components/pages/OlamovDesktop";
import SeoContent from "components/pages/seo/SeoContent";
import { type PublicRoute, getRouteByPath } from "utils/publicRoutes";

const HOME_ROUTE = getRouteByPath("/") as PublicRoute;

const Index = (): React.ReactElement => (
  <>
    <OlamovDesktop />
    <SeoContent route={HOME_ROUTE} />
  </>
);

export default memo(Index);
