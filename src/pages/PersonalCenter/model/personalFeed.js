import request from "../../../utils/requests";
import { message } from "antd"
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
        feedList: payload
      };
    },
    deleteFromList(state, { payload }) {
      let feedList = [];
      state.feedList.forEach(c => {
        if (c.feedId !== payload) {
          feedList.push(c);
        }
      });
      message.success("删除成功！")
      return { ...state, feedList };
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
