import { memo, useMemo } from "react";
import Head from "next/head";
import { useFaviconAndTitle } from "components/pages/hooks/useFaviconAndTitle";
import { useCursor } from "components/pages/hooks/useCursor";
import desktopIcons from "public/.index/desktopIcons.json";
import { HIGH_PRIORITY_ELEMENT, PACKAGE_DATA } from "utils/constants";
import {
  getExtension,
  getMimeType,
  imageSrcs,
  isDynamicIcon,
} from "utils/functions";

const { alias, author, description } = PACKAGE_DATA;
const SEO_KEYWORDS = [
  "Olamov",
  "Olamov OS",
  "OlamovOS",
  "Olamov Universe",
  "purple retro desktop",
  "browser operating system",
  "Windows 1994 style",
  "retro web OS",
  "systems intelligence experiments",
].join(", ");

const Metadata: FC = () => {
  const { title, Favicon } = useFaviconAndTitle();
  const CustomCursor = useCursor();
  const PreloadIcons = useMemo(
    () =>
      desktopIcons.map((icon) => {
        const isSubIcon = icon.includes("/16x16/");
        const dynamicIcon = !isSubIcon && isDynamicIcon(icon);
        const extension = getExtension(icon);

        return (
          <link
            key={icon}
            as="image"
            href={dynamicIcon || isSubIcon ? undefined : icon}
            imageSrcSet={
              dynamicIcon
                ? imageSrcs(icon, 48, extension)
                : isSubIcon
                  ? imageSrcs(icon.replace("16x16/", ""), 16, extension)
                  : undefined
            }
            rel="preload"
            type={getMimeType(extension)}
            {...HIGH_PRIORITY_ELEMENT}
          />
        );
      }),
    []
  );

  return (
    <Head>
      <title>{title}</title>
      {Favicon}
      <meta
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, interactive-widget=resizes-content"
        name="viewport"
      />
      <link href={author.url} rel="canonical" />
      <meta content={alias} name="application-name" />
      <meta content={description} name="description" />
      <meta content={SEO_KEYWORDS} name="keywords" />
      <meta content="index, follow" name="robots" />
      <meta content={alias} property="og:title" />
      <meta content="website" property="og:type" />
      <meta content={author.url} property="og:url" />
      <meta content={alias} property="og:site_name" />
      <meta
        content={`${author.url}/Users/Public/Pictures/olamov-default.png`}
        property="og:image"
      />
      <meta content={description} property="og:description" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content={alias} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta
        content={`${author.url}/Users/Public/Pictures/olamov-default.png`}
        name="twitter:image"
      />
      <link
        href={`${author.url}/rss.xml`}
        rel="alternate"
        title={`RSS Feed for ${alias}`}
        type="application/rss+xml"
      />
      {PreloadIcons}
      {CustomCursor}
    </Head>
  );
};

export default memo(Metadata);
