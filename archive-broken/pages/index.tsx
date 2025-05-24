// pages/index.tsx
import dynamic from 'next/dynamic';

const QuillHero = dynamic(() => import('../components/quillhero/quillhero'), {
  ssr: false, // Prevents rendering on the server
});

import VolunteerForm from '../components/volunteerform';

export default function Home() {
  return (
    <div>
      <QuillHero />
      <VolunteerForm />
    </div>
  );
}