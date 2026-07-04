import { memo, useState } from "react";
import StyledExternalApp from "components/apps/ExternalApp/StyledExternalApp";
import { getProjectByAppId } from "components/apps/MyProjects/projects";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import StyledLoading from "components/system/Apps/StyledLoading";

declare module "react" {
  interface IframeHTMLAttributes<T> extends React.HTMLAttributes<T> {
    credentialless?: "credentialless";
  }
}

// olamov.com runs under COEP: credentialless, so a cross-origin subdomain can
// only be embedded as a `credentialless` iframe (no cookies are sent, which is
// exactly the public/anonymous view a showcase should present).
const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-read; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture; web-share";

const ExternalApp: FC<ComponentProcessProps> = ({ id }) => {
  const [loaded, setLoaded] = useState(false);
  const project = getProjectByAppId(id);
  const supportsCredentialless =
    typeof window !== "undefined" &&
    "credentialless" in HTMLIFrameElement.prototype;

  return (
    <StyledExternalApp>
      {!loaded && <StyledLoading />}
      {project ? (
        <iframe
          allow={IFRAME_ALLOW}
          credentialless={supportsCredentialless ? "credentialless" : undefined}
          onLoad={() => setLoaded(true)}
          referrerPolicy="strict-origin-when-cross-origin"
          src={project.url}
          title={project.name}
          allowFullScreen
        />
      ) : undefined}
    </StyledExternalApp>
  );
};

export default memo(ExternalApp);
