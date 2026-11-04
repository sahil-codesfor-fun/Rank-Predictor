import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { LayoutShell } from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'Indian College & Rank Predictor 2027 | JEE Main, Advanced, NEET, CUET, CLAT',
  description:
    'Free high-accuracy Indian College & Rank Predictor for JEE Main, JEE Advanced, NEET UG, CUET UG, and CLAT UG. Incorporating JoSAA / MCC cutoffs, Home State Quota eligibility, and category multipliers.',
  keywords: [
    'JEE Main Rank Predictor 2027',
    'JEE Advanced College Predictor',
    'NEET UG Rank Predictor',
    'CUET College Predictor DU',
    'CLAT NLU Cutoff Predictor',
    'JoSAA Choice Filling',
    'Home State Quota',
  ],
  authors: [{ name: 'Rank Predictor Platform' }],
  metadataBase: new URL('https://rank-predictor.in'),
  openGraph: {
    title: 'Indian College & Rank Predictor 2027',
    description:
      'Predict your competitive exam ranks and check JoSAA/MCC college admission probability instantly.',
    siteName: 'RankPredictor India',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}

