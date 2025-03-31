import React from 'react';

import AcceptInvitation from './_accept-invitation';

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const page = async ({ searchParams }: Props) => {
  const { token, exp, email, teamId, teamName } = await searchParams;
  return (
    <div>
      <AcceptInvitation
        token={token}
        email={email}
        exp={exp}
        teamId={teamId}
        teamName={teamName}
      />
    </div>
  );
};

export default page;
