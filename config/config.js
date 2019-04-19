export default {
  singular: true,
  plugins: [
    [
      "umi-plugin-react",
      {
        // 这里暂时还没有添加配置，该插件还不会有作用，我们会在后面的课程按照需求打开相应的配置
        antd: true,
        dva: true
      }
    ]
  ],
  routes: [
    /*{
      path: "/Login",
      component: "Login/Login"
    },*/
    /*{
      path: "/register",
      component: "user/register"
    },*/
    {
      path: "/",
      component: "../layout",
      routes: [
        { path: "/", redirect: "/content" },
        {
          path: "/login",
          component: "Login/Login"
        },
        {
          path: "/register",
          component: "user/register"
        },
        {
          path: "/exception",
          icon: "warning",
          routes: [
            {
              path: "/exception/403",
              name: "not-permission",
              component: "./Exception/403"
            },
            {
              path: "/exception/404",
              name: "not-find",
              component: "./Exception/404"
            },
            {
              path: "/exception/500",
              name: "server-error",
              component: "./Exception/500"
            }
          ]
        },
        { path: "/test", component: "InfiniteListExample/InfiniteListExample" },
        { path: "/personal/:uid", component: "PersonalCenter/PersonalCenter" },
        { path: "/personal", component: "PersonalCenter/PersonalCenter" },
        {
          path: "/chatRom/:uid",
          component: "ChatRom/ChatRom",
          authority: "user"
        },
        { path: "/content", component: "Content/Content" },
        { path: "/content/:themeName", component: "Content/Content" },
        { path: "/details/:feedId", component: "Details/Details" },
        {component: '404'}
      ]
    }
  ],
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  }
};
