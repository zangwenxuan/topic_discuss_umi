import api from "../../utils/requests";
export default {
  namespace: "details",
  state: {},
  effects: {
    *freshByFeedId({ payload }, { call, put, select }) {
      yield call(api.fetch, "post", "/content/freshByFeedId", payload);
    },
    *getContentDetails({ payload }, { call, put }) {
      let url = `/content/details?feedId=${payload}`;
      const res = yield call(api.fetch, "get", url);
      yield put({
        type: "showContentDetails",
        payload: res
      });
    },
    *freshComment({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "get",
        `/content/freshComment?feedId=${payload}`
      );
      yield put({
        type: "changeCommentList",
        payload: res
      });
    },
    *postComment({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "post",
        "/content/postComment",
        payload
      );
      yield put({
        type: "changeCommentList",
        payload: res
      });
    },
    *postCommentReply({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "post",
        "/content/postCommentReply",
        payload.commentReply
      );
      yield put({
        type: "freshComment",
        payload: payload.feedId
      });
    }
  },
  reducers: {
    showContentDetails(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    changeCommentList(state, { payload }) {
      return { ...state, commentUserList: payload };
    }
  }
};
