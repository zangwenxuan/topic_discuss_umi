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
        feedList: payload
      };
    },
    updateFeedLike(state, { payload }) {
      let { feedList } = state;
      feedList = feedList && feedList.map(f => {
        if (f.feedId === payload) {
          f.likeNum = f.like ? f.likeNum - 1 : f.likeNum + 1;
          f.like = !f.like;
        }
        return f;
      });
      return{
        ...state,
        feedList
      };
    },
    updateFeedKeep(state, { payload }) {
      let { feedList } = state;
      feedList = feedList && feedList.map(f => {
        if (f.feedId === payload) {
          f.keepNum = f.keep ? f.keepNum - 1 : f.keepNum + 1;
          f.keep = !f.keep;
        }
        return f;
      });
      return{
        ...state,
        feedList
      };
    },
  }
};
