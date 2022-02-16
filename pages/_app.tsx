import type { AppProps } from "next/app";

import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import { RecoilRoot } from "recoil";

import ErrorBoundary from "components/error-boundary";

import "styles/app.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="shell.how - How this shell command works?"
        description="Explain shell commands using next-generation autocomplete from Fig.io"
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://www.shell.how/",
          site_name: "shell.how",
          images: [
            {
              url: "https://www.shell.how/og.jpg",
              width: 1200,
              height: 627,
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <ThemeProvider attribute="class">
        <RecoilRoot>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}
