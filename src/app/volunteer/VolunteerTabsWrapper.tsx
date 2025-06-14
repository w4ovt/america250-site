'use client';

import React, { useState } from 'react';
import VolunteerTabs from '@/components/VolunteerTabs';

// --- Client-side wrapper for VolunteerTabs with PIN logic ---
export default function VolunteerTabsWrapper() {
  const [volunteerInfo, setVolunteerInfo] = useState<{
    name: string;
    callsign: string;
    state: string;
    isAdmin: boolean;
  } | null>(null);
  const [locked, setLocked] = useState(false);

  // -- No handleRemovePin or onRemovePin passed here --

  // You may add your PIN entry/authentication logic here

  return (
    <VolunteerTabs
      volunteerInfo={volunteerInfo}
      locked={locked}
      // REMOVE onRemovePin!
    />
  );
}
