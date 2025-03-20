import React, { Suspense } from 'react';

import VerifyMfa from './_VerifyMfa';

const page = () => {
  return (
    <Suspense>
      <VerifyMfa />
    </Suspense>
  );
};

export default page;
