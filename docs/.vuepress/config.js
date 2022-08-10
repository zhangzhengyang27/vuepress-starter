module.exports = {
    lang: 'zh-CN',
    base: "/vuepress/",
    title: '开发者，你好！',
    description: '这是我的第一个 VuePress 站点',
    // 在移动端，搜索框在获得焦点时会放大，并且在失去焦点后可以左右滚动，这可以通过设置元来优化。
    head: [
        ['meta', {name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no'}],
        // 引入css样式
        // ["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" }],
        // 引入js脚本
        // ["script", { src: "scripts/demo.js" }]
    ],
    theme: 'reco', // 引用reco的主题插件
    themeConfig: {
        // 指定type:'blog'
        type: 'blog',
        // 导航栏左侧可以显示logo, 需要以下配置
        logo: '/img/logo.jpeg',
        // 头像
        authorAvatar: '/img/logo.jpeg',
        nav: require("./nav"),
        sidebar: require("./sidebar"),
        // 子侧边栏是否打开,在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
        subSidebar: 'auto',
        sidebarDepth: 5,
        lastUpdated: '最后更新时间',
        search: true,
        searchMaxSuggestoins: 10,
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页 ！',
        // 博客配置   写文章时要添加分类和标签
        blogConfig: {
            // nav: [
            //     {text: 'TimeLine', link: '/timeline/', icon: 'reco-date'}
            // ],
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: 'Category' // 默认文案 “分类”
            },
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: 'Tag'      // 默认文案 “标签”
            },
            socialLinks: [     // 信息栏展示社交信息
                {icon: 'reco-github', link: 'https://github.com/recoluan'},
                {icon: 'reco-npm', link: 'https://www.npmjs.com/~reco_luan'}
            ]
        },
        // 备案信息配置
        // record: 'ICP 备案文案',
        // recordLink: 'ICP 备案指向链接',
        // cyberSecurityRecord: '公安部备案文案',
        // cyberSecurityLink: '公安部备案指向链接',
        // 项目开始时间，只填写年份
        startYear: '2022',
        author: 'zhengzhengyang',
        huawei: true,
        friendLink: [
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
            {
                title: '午后南杂',
                desc: 'Enjoy when you can, and endure when you must.',
                email: 'recoluan@qq.com',
                link: 'https://www.recoluan.com'
            }
        ],
        // 404 腾讯公益网页 false关闭
        noFoundPageByTencent: false,
        mode: 'light', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
        modePicker: true,// 默认 true，false 不显示模式调节按钮，true 则显示
        locales: {
            '/': {
                recoLocales: {
                    homeBlog: {
                        article: '美文', // 默认 文章
                        tag: '标识', // 默认 标签
                        category: '类别', // 默认 分类
                        friendLink: '友链' // 默认 友情链接
                    },
                    pagation: {
                        prev: '上一页',
                        next: '下一页',
                        go: '前往',
                        jump: '跳转至'
                    }
                }
            }
        },

    },
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
}
