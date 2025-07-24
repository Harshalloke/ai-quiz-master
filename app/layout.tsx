import './globals.css';
import { Inter } from 'next/font/google';
import Layout from '../components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Quiz Master AI - AI-Powered Quizzes',
  description: 'Master any topic with AI-generated quizzes tailored to your learning needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
