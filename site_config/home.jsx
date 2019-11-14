import React from 'react';

export default {
  'zh-cn': {
    brand: {
      brandName: 'jcohy-docs',
      briefIntroduction: '主要收集网上各种技术文档，翻译文档，网站等各类资源。如果涉及到版权侵权，还望告知作者。',
      buttons: [
        {
          text: '立即开始',
          link: '/zh-cn/docs/Overview.html',
          type: 'primary',
        },
        {
          text: '查看Github',
          link: 'https://github.com/jiachao23',
          type: 'primary',
        },
      ],
    },
    users: {
      title: '用户',
      desc: <span>简单描述</span>,
      list: [
        '/img/jcohy.png',
      ],
    },
  },
  'en-us': {
    brand: {
      brandName: 'jcohy-docs',
      briefIntroduction: 'It mainly collects various technical documents, translation documents, websites and other resources on the Internet. If copyright infringement is involved, the author is also expected to be notified.',
      buttons: [
        {
          text: 'Quick Start',
          link: '/en-us/docs/Overview.html',
          type: 'primary',
        },
        {
          text: 'View on Github',
          link: 'https://github.com/jiachao23',
          type: 'normal',
        },
      ],
    },
    users: {
      title: 'users',
      desc: <span>some description</span>,
      list: [
        '/img/users_alibaba.png',
      ],
    },
  },
};
