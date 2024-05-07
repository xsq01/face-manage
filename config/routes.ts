export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'}
    ]
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/man',
    name: '用户管理页',
    icon: 'icon-gerenxinxi',
    access: 'canUser',
    component: './Man',  //这里会展示这个Admin页面的信息，因为下面就包含了
    routes: [
      // {component: './404'},
      {path: '/man/user_face', name: "人脸信息",  component: './Man/UserFace'},
      {path: '/man/user_import', name: "基本信息导入",  component: './Man/UserImport'},
      {path: '/man/monitor', name: "实时监控", component: './Man/Monitor'},
      {path: '/man/user_detail',component:'./Man/UserDetail'},
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',  //这里会展示这个Admin页面的信息，因为下面就包含了
    routes: [
      {path: '/admin/user-manage', name: '用户管理', component: './Admin/UserManage'},
      {path: '/admin/user_detail',component:'./Admin/UserDetail'},
      {component: './404'},
    ],
  },
  {icon: 'table', path: '/list', component: './TableList'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
