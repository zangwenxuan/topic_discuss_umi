import request from "../../../utils/requests";
import { message } from "antd";
export default {
  namespace: "feedManager",
  state: {},
  effects: {
    *selectAll(_, { call, put }) {
      const res = yield call(request.fetch, "get", "/admin/selectAllFeed");
      yield put({
        type: "updateFeed",
        payload: res
      });
    },
    *deleteFeed({ payload }, { call, put }) {
      const res = yield call(
        request.fetch,
        "delete",
        "/admin/deleteFeed",
        payload
      );
      yield put({
        type: "deleteFromFeedList",
        payload: res
      });
    }
  },
  reducers: {
    updateFeed(state, { payload }) {
      return {
        ...state,
        feedList: payload
      };
    },
    deleteFromFeedList(state, { payload }) {
      message.success("删除成功！");
      return {
        ...state,
        feedList: state.feedList.filter(f => f.feedId !== payload)
      };
    }
  }
};
