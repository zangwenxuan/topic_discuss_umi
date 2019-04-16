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
    {
      path: "/login",
      component: "login"
    },
    {
      path: "/register",
      component: "user/register"
    },
    {
      path: "/",
      component: "../layout",
      routes: [
        { path: "/", redirect: "/content" },
        { path: "/test", component: "InfiniteListExample/InfiniteListExample" },
        { path: "/personal", component: "PersonalCenter" },
        {
          path: "/chatRom/:uid",
          component: "ChatRom/chatRom",
          authority: "user"
        },
        { path: "/content", component: "./Content/content" },
        { path: "/content/:themeName", component: "./Content/content" },
        { path: "/details/:feedId", component: "details" }
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
