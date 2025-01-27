
import './globals.css';
import Providers from '@/redux/provider.js';
import { Montserrat } from 'next/font/google';



const montserrat = Montserrat({
  subsets: ['latin'], 
  weight: ['400', '500', '700'], 
  variable: '--font-montserrat', 
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` antialiased ${montserrat.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
