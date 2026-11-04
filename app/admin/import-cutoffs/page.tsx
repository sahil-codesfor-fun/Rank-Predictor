import { Metadata } from 'next';
import { CutoffImporter } from '@/components/CutoffImporter';

export const metadata: Metadata = {
  title: 'Admin CSV Cutoff Importer | RankPredictor India',
  description: 'Bulk import official JoSAA, MCC, and Consortium of NLUs closing ranks via CSV.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminImportCutoffsPage() {
  return (
    <div className="py-6">
      <CutoffImporter />
    </div>
  );
}

