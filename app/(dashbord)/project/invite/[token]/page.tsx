import React from 'react';

import InviteAcceptPage from './_Invite-accept-page';

type Props = {
  params: Promise<{ token: string }>;
};

const page = async ({ params }: Props) => {
  const { token } = await params;
  return <InviteAcceptPage token={token} />;
};

export default page;
