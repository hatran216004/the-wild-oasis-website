import Header from './_components/Header';
import '@/app/_styles/globals.css';
import { Josefin_Sans } from 'next/font/google';
import ReservationProvider from './_components/ReservationContext';
import { Toaster } from 'react-hot-toast';

const jose_fin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata = {
  title: {
    template: 'The Wild Oasis | %s',
    default: 'Welcome to The Wild Oasis'
  },
  description:
    'Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${jose_fin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 3000
            },
            error: {
              duration: 5000
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: '#fff',
              color: '#000'
            }
          }}
        />
      </body>
    </html>
  );
}
