export default function (type) {
  switch (type) {
    case 'login' : return loginLinks
    case 'advanced' : return advancedFunctions
  }
}

const loginLinks = [
  {
    title: '返回主页',
    caption: '返回主菜单,点击工具栏页面名称也可以返回',
    icon: 'home',
    link: 'main'
  },
  {
    title: '返回登录页',
    caption: '返回登陆页面',
    icon: 'login',
    link: '/'
  }
]

const advancedFunctions = [
  {
    title: '图书管理',
    caption: '管理图书的基本信息',
    icon: 'book',
    link: 'BookManage'
  },
  {
    title: '系统日志',
    caption: '查看图书馆系统的日志',
    icon: 'speaker_notes',
    link: 'Log'
  }
]
