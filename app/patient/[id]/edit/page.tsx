import { notFound } from 'next/navigation';

export function generateStaticParams() {
  // Mock patient IDs for static generation
  const patientIds = ['1', '2', '3', '4'];
  return patientIds.map((id) => ({
    id: id,
  }));
}

export default function EditPatientPage({ params }: { params: { id: string } }) {
  // Since this is a static export, we need to handle client-side routing
  // For now, we'll redirect to a client-side component or show a message
  notFound(); // This will show the 404 page
}
