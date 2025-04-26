'use client';

import { CircleAlert, Loader, Trash } from 'lucide-react';
import React from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';

type Props = {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void;
  confirmFn: () => void;
  title?: string;
  description?: string;
  btnText?: string;
  isLoading: boolean;
  disable?: boolean;
  isIconBtn: boolean;
};

const DeleteConfirmationDialog = ({
  confirmFn,
  title = 'Are you sure',
  description = 'Are you sure want to continue? This action cannot be undone.',
  btnText = 'Delete',
  isLoading,
  open,
  setOpen,
  disable = false,
  isIconBtn = false
}: Props) => {
  return (
    <Dialog
      modal
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {isIconBtn ? (
          <Button
            size='icon'
            disabled={disable}
            className='cursor-pointer bg-red-500 text-white hover:bg-red-600'
          >
            <Trash />
          </Button>
        ) : (
          <Button
            disabled={disable}
            className='dark:bg-background flex w-full justify-start rounded-sm bg-white !px-2 !py-1 text-red-500 hover:cursor-pointer hover:bg-red-100 dark:text-red-800 dark:hover:bg-red-950/90'
          >
            <Trash />
            {btnText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='flex flex-col items-center'>
          <CircleAlert
            size={30}
            className='animate-bounce text-red-500'
          />
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='text-center'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type='button'
            onClick={() => setOpen(false)}
            variant='destructive'
            className='hover:cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={confirmFn}
            className='bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'
          >
            {isLoading && <Loader className='animate-spin' />}
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
