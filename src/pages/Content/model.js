import api from "../../utils/requests";
export default {
  namespace: "feed",
  state: {
    contentList: []
  },
  effects: {
    *selectPersonalMaster({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/user/selectPersonalMaster?uid=${payload}`
      );
      yield put({
        type: "showContentList",
        payload: res.res
      });
    },
    *selectPersonalFeed({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/user/selectPersonalFeed?uid=${payload}`
      );
      yield put({
        type: "showContentList",
        payload: res.res
      });
    },
    *selectPersonalKeep({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/user/selectPersonalKeep?uid=${payload}`
      );
      yield put({
        type: "showContentList",
        payload: res.res
      });
    },
    *freshFeed({ payload }, { call }) {
      yield call(api.fetch, "post", "/content/freshFeed", payload);
    },
    *like({ payload }, { call, put }) {
      yield call(api.fetch, "post", "/content/like", payload);
    },
    *keep({ payload }, { call, put }) {
      yield call(api.fetch, "post", "/content/keep", payload);
    },
    *submit({ payload }, { call, put }) {
      const res = yield call(api.fetch, "post", "/content/sendFeed", payload);
      yield put({
        type: "getContentList"
      });
    },
    *getContentListByTheme({ payload }, { call, put }) {
      let url = `/user/selectContentByTheme?themeName=${payload}`;
      const res = yield call(api.fetch, "get", url);
      yield put({
        type: "showContentList",
        payload: res.res
      });
    },
    *getContentList({ payload }, { call, put }) {
      let url = "/user/selectAllContent";
      const res = yield call(api.fetch, "get", url);
      yield put({
        type: "showContentList",
        payload: res.res
      });
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
        payload,
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
