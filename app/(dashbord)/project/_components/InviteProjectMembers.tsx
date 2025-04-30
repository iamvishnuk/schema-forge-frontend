import { useMutation } from '@tanstack/react-query';
import { Check, Copy, HelpCircle, Send } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MultipleSelector from '@/components/ui/multiple-selector';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { inviteProjectMemberMutationFn } from '@/lib/api';

type Props = { projectId: string; inviteToken: string };

const InviteProjectMembers = ({ inviteToken, projectId }: Props) => {
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/project/invite/${inviteToken}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: inviteProjectMemberMutationFn
  });

  const handleInvite = async () => {
    mutate(
      { projectId, emails },
      {
        onSuccess: () => {
          toast.success('Members invited successfully');
          setEmails([]);
        },
        onError: () => {
          toast.error('Failed to invite members');
        }
      }
    );
  };

  return (
    <Card className='mt-8'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Invite Link</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                >
                  <HelpCircle className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent className='max-w-sm'>
                <p>
                  When users open this link, they will automatically join your
                  project as a viewer (read-only access). You can change their
                  role later in the project settings.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Share this link to allow others to join this project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex gap-2'>
          <Input
            value={inviteLink}
            readOnly
            className='font-mono text-sm'
            disabled
          />
          <Button
            variant='secondary'
            className='btn-primary text-white'
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className='mr-1 h-4 w-4' />
            ) : (
              <Copy className='mr-1 h-4 w-4' />
            )}
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </div>
        <div className='mt-5 flex items-center gap-2'>
          <MultipleSelector
            className=''
            creatable
            placeholder='Enter the email and press enter'
            onChange={(value) => setEmails(value.map((v) => v.value))}
            options={[]}
            value={emails.map((tag) => ({ label: tag, value: tag }))}
          />
          <Button
            className='btn-primary text-white'
            disabled={isPending || emails.length === 0}
            onClick={handleInvite}
          >
            <Send />
            Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteProjectMembers;
