import api from "../../utils/requests";
export default {
  namespace: "feed",
  state: {
    contentList: []
  },
  effects: {
    *selectMyMaster(action, { call, put }) {
      const res = yield call(api.fetch, "get", "/user/selectMyMaster");
      if (res.code == "0") {
        yield put({
          type: "showContentList",
          payload: res.res
        });
      }
    },
    *selectMyFeed(action, { call, put }) {
      const res = yield call(api.fetch, "get", "/user/selectMyFeed");
      if (res.code == "0") {
        yield put({
          type: "showContentList",
          payload: res.res
        });
      }
    },
    *selectMyKeep(action, { call, put }) {
      const res = yield call(api.fetch, "get", "/user/selectMyKeep");
      if (res.code == "0") {
        yield put({
          type: "showContentList",
          payload: res.res
        });
      }
    },
    *freshFeed({ payload }, { call }) {
      yield call(api.fetch, "post", "/content/freshFeed", payload);
    },
    *submit({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "post",
        "/content/sendFeed",
        payload
      );
      if (res.code == "0") {
        yield put({
          type: "getContentList"
        });
      }
    },
    *getContentListByTheme({ payload }, { call, put, select }) {
      const user = yield select(state => state.user.user);
      let url = `/user/selectContentByTheme?themeName=${payload}`;
      if (user) {
        url = `/user/selectContentByTheme?themeName=${payload}&uid=${user.uid}`;
      }
      const res = yield call(api.fetch, "get", url);
      if (res.code == "0") {
        yield put({
          type: "showContentList",
          payload: res.res
        });
      }
    },
    *getContentList({ payload }, { call, put, select }) {
      const user = yield select(state => state.user.user);
      let url = "/user/selectAllContent";
      if (user) {
        url = `/user/selectAllContent?uid=${user.uid}`;
      }
      const res = yield call(api.fetch, "get", url);
      if (res.code == "0") {
        yield put({
          type: "showContentList",
          payload: res.res
        });
      }
    }
  },
  reducers: {
    showContentList(state, { payload }) {
      const {
        contentList,
        keepNum,
        keepList,
        likeNum,
        likeList,
        messageNum
      } = payload;
      return {
        ...state,
        contentList,
        keepList,
        keepNum,
        likeList,
        likeNum,
        messageNum
      };
    },
    showThemeContentList(state, { payload }) {
      return { ...state, contentList: payload };
    }
  }
};
