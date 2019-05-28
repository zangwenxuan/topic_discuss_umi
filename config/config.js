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
    { path: "/admin", component: "Admin/Admin" ,
      routes: [
        {path: "/admin",redirect: "/admin/usermanager"},
        {path: "/admin/usermanager",component: "Admin/UserList"},
        {path: "/admin/feedmanager",component: "Admin/FeedManager"},
      ]
    },
    {
      path: "/",
      component: "../layout",
      routes: [
        { path: "/", redirect: "/index" },
        { path: "/index", component: "Content/Content" },
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
        { path: "/pc", component: "PersonalCenter/PersonalCenter" },
        {
          path: "/pc/:uid",
          component: "PersonalCenter/PersonalCenter",
          routes: [
            { path: "/pc/:uid/", component: "PersonalCenter/AccountInfo" },
            {
              path: "/pc/:uid/release",
              component: "PersonalCenter/PersonalFeed"
            },
            { path: "/pc/:uid/keep", component: "PersonalCenter/PersonalKeep" },
            { path: "/pc/:uid/follower", component: "PersonalCenter/Follower" },
            {
              path: "/pc/:uid/following",
              component: "PersonalCenter/Following"
            }
          ]
        },
        { path: "/chat", component: "ChatRom/ChatRom" },
        { path: "/chat/:uid", component: "ChatRom/ChatRom" },
        { path: "/details", component: "Details/Details" },
        { path: "/details/:feedId", component: "Details/Details" },
        { path: "/setpassword", component: "SetPassword/SetPassword" },
        { path: "/bindmail", component: "BindMail/BindMail" },
        { path: "/test", component: "test" },
        { path: "/search", component: "Search/Search" },
        { component: "./Exception/404" }
      ]
    },

  ],
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  }
};
