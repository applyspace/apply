import { InterviewsHub } from '@/components/interviews/InterviewsHub';
import { readInterviews, toInterviewItems } from '@/lib/interviews';
import { parseCalendarView, parseInterviewLayout } from '@/lib/interviewsHub';

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string | string[]; view?: string | string[] }>;
}) {
  const { layout, view } = await searchParams;
  const interviews = await readInterviews();

  return (
    <InterviewsHub
      interviews={toInterviewItems(interviews)}
      nowIso={new Date().toISOString()}
      initialLayout={parseInterviewLayout(layout)}
      initialCalendarView={parseCalendarView(view)}
    />
  );
}
