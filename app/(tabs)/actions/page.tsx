import type { Metadata } from 'next';
import { Actions, type SheetId, type Stage } from '@/components/screens/Actions';

export const metadata: Metadata = { title: 'Actions · CredCare' };

const SHEETS: SheetId[] = ['pay', 'autopay', 'upload', 'dispute'];
const STAGES: Stage[] = ['processing', 'failed', 'success', 'uploading', 'uploadError', 'submitted', 'holding', 'released', 'toastError'];
const VIEWS = ['tasks', 'loans', 'empty'] as const;
type View = (typeof VIEWS)[number];

export default async function Page({ searchParams }: { searchParams: Promise<{ sheet?: string; stage?: string; view?: string }> }) {
  const q = await searchParams;
  return (
    <Actions
      key={`${q.sheet}-${q.stage}-${q.view}`}
      sheet={SHEETS.includes(q.sheet as SheetId) ? (q.sheet as SheetId) : undefined}
      stage={STAGES.includes(q.stage as Stage) ? (q.stage as Stage) : undefined}
      view={VIEWS.includes(q.view as View) ? (q.view as View) : 'tasks'}
    />
  );
}
