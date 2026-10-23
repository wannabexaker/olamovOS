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
  // Named so it is a region landmark (axe: all content inside landmarks).
  <StyledSeo aria-labelledby="seo-heading">
    <h1 id="seo-heading">{route.h1 || "Olamov OS"}</h1>
    {route.description && <p>{route.description}</p>}
    {route.category && <p>Category: {route.category}</p>}
    <SeoSiteLinks />
  </StyledSeo>
);

export default SeoContent;
