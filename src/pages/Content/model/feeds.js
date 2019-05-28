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
        payload: { ...res, tab: "index" }
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
        payload: { ...res, tab: "subscribe" }
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
        payload: { ...res, tab: payload }
      });
    },
    *selectHotTheme(_,{call,put}){
      const res = yield call(request.fetch,"get","feed/selectHotTheme")
      yield put({
        type: "updateHotTheme",
        payload: res
      })
    },
    *searchTheme({payload},{call,put}){
      const res = yield call(request.fetch,"get",`feed/searchTheme?theme=${payload}`)
      console.log(res)
      yield put({
        type: "updateSearchTheme",
        payload: res
      })
    },
    *searchUser({payload},{call,put}){
      const res = yield call(request.fetch,"get",`feed/searchUser?nickname=${payload}`)
      yield put({
        type: "updateSearchUser",
        payload: res
      })
    },
    *submitFeed({ payload }, { call, put }) {
      const res = yield call(request.fetch, "post", "/content/sendFeed", payload);
    }
  },
  reducers: {
    freshFeedList(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    addFeed(state,{payload}){

    },
    addFeedList(state, { payload }) {
      const {
        tab,
        likeNum,
        likeList,
        keepNum,
        keepList,
        messageNum,
        contentList
      } = payload;
      let feed = !!state[tab] ? state[tab] : {};
      feed = {
        page: !!feed.page
          ? contentList.length !== 0
            ? feed.page + 1
            : feed.page
          : 1,
        likeNum: !!feed.likeNum ? feed.likeNum.concat(likeNum) : likeNum,
        likeList: !!feed.likeList ? feed.likeList.concat(likeList) : likeList,
        keepNum: !!feed.keepNum ? feed.keepNum.concat(keepNum) : keepNum,
        keepList: !!feed.keepList ? feed.keepList.concat(keepList) : keepList,
        messageNum: !!feed.messageNum
          ? feed.messageNum.concat(messageNum)
          : messageNum,
        contentList: !!feed.contentList
          ? feed.contentList.concat(contentList)
          : contentList
      };
      state[tab] = feed;
      return {
        ...state,
        noMoreFeed: contentList.length === 0
        /* page: state.page + 1,
        likeNum: !!state.likeNum ? state.likeNum.concat(likeNum) : likeNum,
        likeList: !!state.likeList ? state.likeList.concat(likeList) : likeList,
        keepNum: !!state.keepNum ? state.keepNum.concat(keepNum) : keepNum,
        keepList: !!state.keepList ? state.keepList.concat(keepList) : keepList,
        messageNum: !!state.messageNum
          ? state.messageNum.concat(messageNum)
          : messageNum,
        contentList: !!state.contentList
          ? state.contentList.concat(contentList)
          : contentList*/
      };
    },
    updateHotTheme(state,{payload}){
      return {
        ...state,
        hotThemeList: payload
      }
    },
    updateSearchTheme(state,{payload}){
      return {
        ...state,
        searchThemeList:payload
      }
    },
    updateSearchUser(state,{payload}){
      return {
        ...state,
        searchUserList: payload
      }
    }
  }
};
