import request from "../../../utils/requests";

export default {
  namespace: "personalKeep",
  state: {},
  effects: {
    *selectFeed({ payload }, { call, put }) {
      const res = yield call(request.fetch, "get", `/feed/selectKeep?uid=${payload}`);
      yield put({
        type: "showFeedList",
        payload: res
      });
    }
  },
  reducers: {
    showFeedList(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
