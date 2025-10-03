import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
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
