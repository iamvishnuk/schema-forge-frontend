import { Send } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

type Props = {};

const InviteMemberModel = ({}: Props) => {
  return (
    <Button className='bg-blue-600 text-white hover:cursor-pointer hover:bg-blue-700'>
      <Send />
      Invite
    </Button>
  );
};

export default InviteMemberModel;
