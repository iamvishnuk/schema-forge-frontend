import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Props = {};

const ProjectTeamManagement = ({}: Props) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
          <CardDescription>
            Share this link to allow others to join this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex gap-2'>
            <Input
              value='https://schema-builder.app/invite/project-123456'
              readOnly
              className='font-mono text-sm'
            />
            <Button variant='secondary'>Copy Link</Button>
          </div>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='default-role'>Default Role for New Members</Label>
              <Select defaultValue='Viewer'>
                <SelectTrigger
                  id='default-role'
                  className='w-[130px]'
                >
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Editor'>Editor</SelectItem>
                  <SelectItem value='Viewer'>Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className='text-muted-foreground mt-2 text-xs'>
              Anyone who joins via the invite link will be assigned this role by
              default.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTeamManagement;
