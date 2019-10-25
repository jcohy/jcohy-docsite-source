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
          type: 'normal',
        },
      ],
    },
    introduction: {
      title: 'jcohy-docs',
      desc: '开源产品的简单介绍，提供一些该产品的优点、特性描述等',
      img: '/img/architecture.png',
    },
    features: {
      title: '文档一栏',
      list: [
        {
          img: 'https://camo.githubusercontent.com/665cd3023f474934dc543bcdf24ee43886603b66/68747470733a2f2f737072696e672e696f2f696d672f686f6d65706167652f69636f6e2d737072696e672d6672616d65776f726b2e737667',
          title: 'Spring Framework',
          link: '/zh-cn/docs/springframework/demo.html',
          content: '该项目为 Spring Framework文档翻译项目，基于 Spring 5.1.3 的官方文档进行翻译。',
        },
        {
          img: 'https://camo.githubusercontent.com/9bbd26c5adc811135c879b0905a7d24b1f9e21bc/68747470733a2f2f737072696e672e696f2f696d672f686f6d65706167652f69636f6e2d737072696e672d626f6f742e737667',
          title: 'SpringBoot',
          link: '/zh-cn/docs/springboot/demo.html',
          content: '该项目为 Spring Boot 文档翻译项目，基于 Spring Boot 2.1.5 的官方文档进行翻译。',
        },
        {
          img: 'https://camo.githubusercontent.com/a70844b8d75a2a1d5f20eeffb4732e67760981ad/68747470733a2f2f6e67696e782e6f72672f6e67696e782e706e67',
          title: 'Nginx',
          link: '/zh-cn/docs/nginx/demo.html',
          content: 'Nginx 官方文档中文翻译版',
        },
        {
          img: '/img/feature_hogh.png',
          title: 'Microservices',
          link: '/zh-cn/docs/microservices/demo.html',
          content: '本书是 Chris Richardson 和 Floyd Smith 联合编写的微服务电子书 Designing and Deploying Microservices 的中文译本，其从不同角度全面介绍了微服务：微服务的优点与缺点、API 网关、进程间通信（IPC）、服务发现、事件驱动数据管理、微服务部署策略、重构单体。',
        },
        // {
        //   img: '/img/feature_runtime.png',
        //   title: '特性5',
        //   content: '特性5的简单概括',
        // },
        // {
        //   img: '/img/feature_maintenance.png',
        //   title: '特性6',
        //   content: '特性6的简单概括',
        // },
      ],
    },
    start: {
      title: '快速开始',
      desc: '简单描述',
      img: '/img/quick_start.png',
      button: {
        text: '阅读更多',
        link: '/zh-cn/docs/demo.html',
      },
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
    introduction: {
      title: 'introduction title',
      desc: 'some introduction of your product',
      img: '/img/architecture.png',
    },
    features: {
      title: 'Documentation List',
      list: [
        {
          img: 'https://camo.githubusercontent.com/665cd3023f474934dc543bcdf24ee43886603b66/68747470733a2f2f737072696e672e696f2f696d672f686f6d65706167652f69636f6e2d737072696e672d6672616d65776f726b2e737667',
          title: 'Spring Framework',
          link: '/zh-cn/docs/springframework/demo.html',
          content: '该项目为 Spring Framework文档翻译项目，基于 Spring 5.1.3 的官方文档进行翻译。',
        },
        {
          img: 'https://camo.githubusercontent.com/9bbd26c5adc811135c879b0905a7d24b1f9e21bc/68747470733a2f2f737072696e672e696f2f696d672f686f6d65706167652f69636f6e2d737072696e672d626f6f742e737667',
          title: 'SpringBoot',
          link: '/zh-cn/docs/springboot/demo.html',
          content: '该项目为 Spring Boot 文档翻译项目，基于 Spring Boot 2.1.5 的官方文档进行翻译。',
        },
        {
          img: 'https://camo.githubusercontent.com/a70844b8d75a2a1d5f20eeffb4732e67760981ad/68747470733a2f2f6e67696e782e6f72672f6e67696e782e706e67',
          title: 'Nginx',
          link: '/zh-cn/docs/nginx/demo.html',
          content: 'Nginx 官方文档中文翻译版',
        },
        {
          img: '/img/feature_hogh.png',
          title: 'Microservices',
          link: '/zh-cn/docs/microservices/demo.html',
          content: '本书是 Chris Richardson 和 Floyd Smith 联合编写的微服务电子书 Designing and Deploying Microservices 的中文译本，其从不同角度全面介绍了微服务：微服务的优点与缺点、API 网关、进程间通信（IPC）、服务发现、事件驱动数据管理、微服务部署策略、重构单体。',
        },
        // {
        //   img: '/img/feature_runtime.png',
        //   title: '特性5',
        //   content: '特性5的简单概括',
        // },
        // {
        //   img: '/img/feature_maintenance.png',
        //   title: '特性6',
        //   content: '特性6的简单概括',
        // },
      ],
    },
    start: {
      title: 'Quick start',
      desc: 'some description text',
      img: '/img/quick_start.png',
      button: {
        text: 'READ MORE',
        link: '/en-us/docs/demo.html',
      },
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
