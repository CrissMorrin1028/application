import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Definir las fuentes locales
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Definir metadatos globales
export const metadata: Metadata = {
  title: 'Gestor de Archivos Word',
  description: 'Aplicación para cargar y manejar archivos Word con formularios dinámicos',
};

// Layout global
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Aquí puedes añadir un header global si lo necesitas */}
        <main>{children}</main> 
        {/* El componente 'children' contendrá el contenido de cada página */}
      </body>
    </html>
  );
}
