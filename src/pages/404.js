import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    linkElement={Link}
    desc={'抱歉，你要访问的页面不存在'}
    backText={'回到主页'}
  />
);

export default 404
