import OlamovDesktop from "components/pages/OlamovDesktop";
import SeoContent from "components/pages/seo/SeoContent";
import { getRouteByPath, type PublicRoute } from "utils/publicRoutes";

const HOME_ROUTE = getRouteByPath("/") as PublicRoute;

const Index: FC = () => (
  <>
    <OlamovDesktop />
    <SeoContent route={HOME_ROUTE} />
  </>
);

export default Index;
