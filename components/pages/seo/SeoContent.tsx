import SeoSiteLinks from "components/pages/seo/SeoSiteLinks";
import StyledSeo from "components/pages/seo/StyledSeo";
import { type PublicRoute } from "utils/publicRoutes";

type SeoContentProps = {
  route: PublicRoute;
};

// Real, indexable HTML rendered alongside the desktop shell for each route:
// an <h1>, a description, an optional category, and internal links for crawl
// discovery. (The route image is surfaced via og:image and the image sitemap.)
const SeoContent: FC<SeoContentProps> = ({ route }) => (
  <StyledSeo>
    <h1>{route.h1 || "Olamov OS"}</h1>
    {route.description && <p>{route.description}</p>}
    {route.category && <p>Category: {route.category}</p>}
    <SeoSiteLinks />
  </StyledSeo>
);

export default SeoContent;
