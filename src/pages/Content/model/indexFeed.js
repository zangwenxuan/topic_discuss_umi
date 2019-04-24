import request from "../../../utils/requests";

export default {
  namespace: "indexFeed",
  state: {},
  effects: {
    *selectIndex({ payload }, { call, put }) {
      const res = yield call(request.fetch, "get", "/feed/selectIndexFeed");
      yield put({
        type: "freshFeedList",
        payload: res
      });
    },
    *selectSubscribe(aciton, { call, put }) {
      const res = yield call(request.fetch, "get", "/feed/selectSubscribeFeed");
      yield put({
        type: "freshFeedList",
        payload: res
      });
    },
    *selectByTheme({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `feed/selectFeedByTheme?themeName=${payload}`
      );
      yield put({
        type: "freshFeedList",
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
    }
  }
};
