import request from "../../../utils/requests";
export default {
  namespace: "personalFeed",
  state: {},
  effects: {
    *selectPersonalFeed({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "get",
        `feed/selectPersonalFeed?uid=${payload}`
      );
      yield put({
        type: "showFeedList",
        payload: res
      });
    },
    *deleteFeed({ payload }, { call, put }) {
      yield call(request.fetch, "delete", "/feed/deleteFeed", payload);
      yield put({
        type: "deleteFromList",
        payload: payload.feedId
      });
    }
  },
  reducers: {
    showFeedList(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    deleteFromList(state, { payload }) {
      let contentList = []
      state.contentList.forEach(c => {
        if (c.feedId !== payload) {
          contentList.push(c);
        }
      });
      console.log(contentList)
      return { ...state, contentList };
    }
  }
};
