import type { Metadata } from "next";
import './globals.css'
import 'ol/ol.css';
import {PrimeReactProvider} from "primereact/api";
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'openlayers-style-editor/dist/openlayers-style-editor.css';

const seoTags = [
  "OpenLayers Style Editor",
  "Map Styling Tool",
  "OpenLayers Map Customization",
  "OpenLayers Layer Styling",
  "Layer Style Editor",
  "OpenLayers",
  "Web Map Styling",
  "Geospatial Visualization Tool"
];

export const metadata: Metadata = {
  title: "OpenLayers Style Editor - This Style Editor for OpenLayers ",
  description: "This Style Editor for OpenLayers allows the user to change the style of layers. This editor was inspired in both QGIS and ArcMap editors.",
  keywords: seoTags,
  authors: [{ name: "LAND IT Team", url: "https://land-it.github.io" }],
  creator: "LAND IT Team",  
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://land-it.github.io/openlayers-style-editor/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <PrimeReactProvider>
        {children}
      </PrimeReactProvider>
      </body>
    </html>
  );
}
