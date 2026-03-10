import { getAllProposals } from '@/lib/proposals';
import AllPageClient from './AllPageClient';

export default async function AllPage() {
  const proposals = await getAllProposals();
  return <AllPageClient proposals={proposals} />;
}
