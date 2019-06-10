import request from "../../../utils/requests";

export default {
  namespace: "feeds",
  state: {
    noMoreFeed: false
  },
  effects: {
    *selectIndex({ payload }, { call, put, select }) {
      const feed = yield select(state =>
        !!state.feeds.index ? state.feeds.index : {}
      );
      const { page } = feed;
      let res;
      if (!page) {
        res = yield call(request.fetch, "get", `/feed/selectFeedPage?page=0`);
      } else {
        res = yield call(
          request.fetch,
          "get",
          `/feed/selectFeedPage?page=${page}`
        );
      }
      yield put({
        type: "addFeedList",
        payload: { feedList: res, tab: "index" }
      });
    },
    *selectSubscribe(_, { call, put, select }) {
      const feed = yield select(state =>
        !!state.feeds.subscribe ? state.feeds.subscribe : {}
      );
      const { page } = feed;
      let res;
      if (!page) {
        res = yield call(
          request.fetch,
          "get",
          `/feed/selectSubscribePage?page=0`
        );
      } else {
        res = yield call(
          request.fetch,
          "get",
          `/feed/selectSubscribePage?page=${page}`
        );
      }
      yield put({
        type: "addFeedList",
        payload: { feedList: res, tab: "subscribe" }
      });
    },
    *selectByTheme({ payload }, { call, put, select }) {
      const feed = yield select(state =>
        !!state.feeds[payload] ? state.feeds[payload] : {}
      );
      const { page } = feed;
      let res;
      if (!page) {
        res = yield call(
          request.fetch,
          "get",
          `feed/selectThemePage?themeName=${payload}&page=0`
        );
      } else {
        res = yield call(
          request.fetch,
          "get",
          `feed/selectThemePage?themeName=${payload}&page=${page}`
        );
      }
      yield put({
        type: "addFeedList",
        payload: { feedList: res, tab: payload }
      });
    },
    *selectHotTheme(_, { call, put }) {
      const res = yield call(request.fetch, "get", "feed/selectHotTheme");
      yield put({
        type: "updateHotTheme",
        payload: res
      });
    },
    *searchTheme({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `feed/searchTheme?theme=${payload}`
      );
      console.log(res);
      yield put({
        type: "updateSearchTheme",
        payload: res
      });
    },
    *searchUser({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `feed/searchUser?nickname=${payload}`
      );
      yield put({
        type: "updateSearchUser",
        payload: res
      });
    },
    *submitFeed({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "post",
        "/content/sendFeed",
        payload
      );
      yield put({
        type: "addFeed",
        payload: res
      });
      yield put({
        type: "user/getCurrentUser"
      });
    },
    *like({ payload }, { call, put }) {
      const res = yield call(request.fetch, "post", "/content/like", payload);
      yield put({
        type: "updateFeedLike",
        payload: res
      });
      yield put({
        type: "personalKeep/updateFeedLike",
        payload: res
      });
      yield put({
        type: "personalFeed/updateFeedLike",
        payload: res
      });
    },
    *keep({ payload }, { call, put }) {
      const res = yield call(request.fetch, "post", "/content/keep", payload);
      yield put({
        type: "updateFeedKeep",
        payload: res
      });
      yield put({
        type: "personalKeep/updateFeedKeep",
        payload: res
      });
      yield put({
        type: "personalFeed/updateFeedKeep",
        payload: res
      });
    }
  },
  reducers: {
    freshFeedList(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    addFeed(state, { payload }) {
      let indexFeed = [payload];
      return {
        ...state,
        index: {
          ...state.index,
          feedList: indexFeed.concat(state.index.feedList)
        }
      };
    },
    addFeedList(state, { payload }) {
      const { tab, feedList } = payload;
      let feed = !!state[tab] ? state[tab] : {};
      feed = {
        page: !!feed.page
          ? feedList.length !== 0
            ? feed.page + 1
            : feed.page
          : 1,
        feedList: !!feed.feedList ? feed.feedList.concat(feedList) : feedList
      };
      state[tab] = feed;
      return {
        ...state,
        noMoreFeed: feedList.length === 0
      };
    },
    updateHotTheme(state, { payload }) {
      return {
        ...state,
        hotThemeList: payload
      };
    },
    updateSearchTheme(state, { payload }) {
      return {
        ...state,
        searchThemeList: payload
      };
    },
    updateSearchUser(state, { payload }) {
      return {
        ...state,
        searchUserList: payload
      };
    },
    updateFeedLike(state, { payload }) {
      let tabList = (
        JSON.parse(sessionStorage.getItem("tabList")) || []
      ).concat([
        { key: "index", title: "index" },
        { key: "subscribe", title: "subscribe" }
      ]);
      tabList.forEach(
        tab =>
          state[tab.key] &&
          (state[tab.key].feedList = state[tab.key].feedList.map(f => {
            if (f.feedId === payload) {
              f.likeNum = f.like ? f.likeNum - 1 : f.likeNum + 1;
              f.like = !f.like;
            }
            return f;
          }))
      );
      return {
        ...state
      };
    },
    updateFeedKeep(state, { payload }) {
      let tabList = (
        JSON.parse(sessionStorage.getItem("tabList")) || []
      ).concat([
        { key: "index", title: "index" },
        { key: "subscribe", title: "subscribe" }
      ]);
      tabList.forEach(
        tab =>
          state[tab.key] &&
          (state[tab.key].feedList = state[tab.key].feedList.map(f => {
            if (f.feedId === payload) {
              f.keepNum = f.keep ? f.keepNum - 1 : f.keepNum + 1;
              f.keep = !f.keep;
            }
            return f;
          }))
      );
      return {
        ...state
      };
    }
  }
};
