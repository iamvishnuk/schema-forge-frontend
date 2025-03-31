import React from 'react';

import TeamDetailsPage from './_components/TeamDetailsPage';

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div>
      <TeamDetailsPage teamId={id} />
    </div>
  );
};

export default page;
