import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.yby.zone',
  lang: 'zh-CN',
  title: '小于同学的异世界',
  subtitle: '我只知道一件事，那就是我一无所知。',
  author: {
    name: 'Boyang Yu/Okysu',
    avatar: 'https://yby-zone.obs.cn-east-3.myhuaweicloud.com/avatar.png',
  },
  description: '为吾为枝，余地三尺，以己为棋，胜天半子。',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/Okysu',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: 'E-Mail',
      link: 'mailto:yby@ecanse.com',
      icon: 'i-ri-mail-line',
      color: '#ea4335',
    },
    {
      name: 'MVP Community',
      link: 'https://mvp.microsoft.com/zh-CN/studentambassadors/profile/1cba6b30-3e38-4959-9863-c8cd7ee9e133',
      icon: 'i-ri-microsoft-line',
      color: 'var(--va-c-text)',
    },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '支付宝',
        url: 'https://cdn.yunyoujun.cn/img/donate/alipay-qrcode.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: 'https://cdn.yunyoujun.cn/img/donate/qqpay-qrcode.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: 'https://cdn.yunyoujun.cn/img/donate/wechatpay-qrcode.jpg',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
})
