import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-HK">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <meta property="og:title" content="Villain Hitting (打小人) - Alan's OS" />
        <meta property="og:description" content="Traditional villain hitting game. Part of Alan's OS - a web-based operating system." />
        <meta property="og:image" content="https://alanh0vx.github.io/villainhitting/title.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://alanh0vx.github.io/villainhitting/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://alanh0vx.github.io/villainhitting/title.png" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
