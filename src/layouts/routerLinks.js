export default function (type) {
  switch (type) {
    case 'login' : return loginLinks
    case 'basic' : return basicFunctions
    case 'advanced' : return advancedFunctions
  }
}

const loginLinks = [
  {
    title: '返回主页',
    caption: '返回主菜单,点击工具栏Logo也可以实现相同效果',
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
const basicFunctions = [
  {
    title: '辅助理架',
    caption: '获取盘点结果，辅助图书理架工作',
    icon: 'fact_check',
    link: 'AssistCheck'
  },
  {
    title: '图书下架',
    caption: '将书籍批量从通用平台中下架',
    icon: 'remove_shopping_cart',
    link: 'BooksDownShelf'
  },
  {
    title: '首书定位',
    caption: '将架位与图书的索书号进行绑定',
    icon: 'format_list_numbered_rtl',
    link: 'ShelfRelocation'
  },
  {
    title: '书架手动盘点',
    caption: '手动对一列书架内的图书进行盘点工作',
    icon: 'person_search',
    link: 'ShelfInventory'
  },
  {
    title: '强制定位',
    caption: '将图书的位置信息与书架进行绑定',
    icon: 'vertical_align_top',
    link: 'BookRelocation'
  },
  {
    title: '图书移库',
    caption: '在Alpha平台移库后，需要在此操作变更通用平台中的图书架位信息',
    icon: 'multiple_stop',
    link: 'BooksTransfer'
  },
  {
    title: '图书信息',
    caption: '查询图书的基础信息或盘点信息',
    icon: 'book',
    link: 'Book'
  },
  {
    title: '首书采集',
    caption: '采集新场馆的书架ID和首书信息，生成Excel报表',
    icon: 'ballot',
    link: 'BookInitCollector'
  }
]

const advancedFunctions = [
  {
    title: '图书管理',
    caption: '管理图书的基本信息',
    icon: 'book',
    link: 'BookManage'
  }
]
