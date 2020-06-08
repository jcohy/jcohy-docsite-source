// 全局的一些配置
export default {
    rootPath: '', // 发布到服务器的根目录，需以/开头但不能有尾/，如果只有/，请填写空字符串
    port: 8080, // 本地开发服务器的启动端口
    domain: 'www.jcohy.com', // 站点部署域名，无需协议和path等
    defaultSearch: 'google', // 默认搜索引擎，baidu或者google
    defaultLanguage: 'zh-cn',
    'en-us': {
        pageMenu: [
            {
                key: 'home', // 用作顶部菜单的选中
                text: 'HOME',
                link: '/en-us/index.html',
            },
            {
                key: 'blog',
                text: 'BLOG',
                link: '/en-us/blog/index.html',
            },
            {
                key: 'open resource',
                text: 'OPEN RESOURCE',
                link: '/en-us/open/index.html',
            },
            {
                key: 'resource.js',
                text: 'RESOURCE',
                link: '/en-us/resource/index.html',
            },
            {
                key: 'community',
                text: 'COMMUNITY',
                link: '/en-us/community/index.html',
            },
        ],
        user: {
            email: 'jia_chao23@126.com',
            github: 'https://www.github.com/jiachao23',
        },
        documentation: {
            title: 'Documentation',
            list: [
                {
                    text: 'Spring Framework',
                    link: '/en-us/springframework',
                },
            ],
        },
        resources: {
            title: 'Resources',
            list: [
                {
                    text: 'Blog',
                    link: '/zh-cn/blog/index.html',
                },
                {
                    text: 'Community',
                    link: '/zh-cn/community/index.html',
                },
            ],
        },
        copyright: 'Copyright © 2018 www.jcohy.com',
    },
    'zh-cn': {
        pageMenu: [
            {
                key: 'home',
                text: '首页',
                link: '/zh-cn/index.html',
            },
            {
                key: 'blog',
                text: '博客',
                link: '/zh-cn/blog/index.html',
            },
            {
                key: 'open resource',
                text: '开源项目',
                link: '/zh-cn/open/index.html',
            },
            {
                key: 'resource',
                text: '资源',
                link: '/zh-cn/resource/index.html',
            },
            {
                key: 'community',
                text: '社区',
                link: '/zh-cn/community/index.html',
            },
        ],
        user: {
            email: 'jia_chao23@126.com',
            github: 'https://www.github.com/jiachao23',
        },
        documentation: {
            title: '文档',
            list: [
                {
                    text: 'Spring Framework 中文参考文档',
                    link: 'http://docs.jcohy.com/zh-cn/spring-framework/5.2.4.RELEASE/index.html',
                    target: '_blank',
                },
                {
                    text: 'Spring Boot 中文参考文档',
                    link: 'http://121.36.198.246/docs/spring-boot/2.2.5.RELEASE/html5/zh-cn/',
                    target: '_blank',
                },
                {
                    text: 'Spring Security 中文参考文档',
                    link: 'http://121.36.198.246/docs/spring-security/5.3.0.RELEASE/html5/zh-cn/',
                    target: '_blank',
                },
            ],
        },
        resources: {
            title: '资源',
            list: [
                {
                    text: '博客',
                    link: '/zh-cn/blog/index.html',
                },
                {
                    text: '开源项目',
                    link: '/zh-cn/open/index.html',
                },
            ],
        },
        copyright: 'Copyright © 2019 www.jcohy.com',
    },
};
