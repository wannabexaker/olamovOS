/* eslint-disable @next/next/no-html-link-for-pages */
// Plain <a> (not next/link) is intentional here: clean routes must do a full
// navigation so the desktop reloads and useUrlLoader opens the target app.
// next/link client-side navigation would not re-run that mount-only loader.
import { PUBLIC_ROUTES } from "utils/publicRoutes";

const SeoSiteLinks: FC = () => (
  <nav aria-label="Olamov OS pages">
    <ul>
      <li>
        <a href="/">Olamov OS — Home</a>
      </li>
      {PUBLIC_ROUTES.filter((route) => route.kind !== "home").map((route) => (
        <li key={route.path}>
          <a href={route.path}>{route.h1 || route.path}</a>
        </li>
      ))}
    </ul>
  </nav>
);

export default SeoSiteLinks;
