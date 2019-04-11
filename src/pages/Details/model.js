import api from "../../utils/requests";
export default {
  namespace: "details",
  state: {},
  effects: {
    *freshByFeedId({payload},{call,put,select}){
      yield call(api.fetch,"post","/content/freshByFeedId",payload)
    },
    *getContentDetails({ payload }, { call, put }) {
      let url =  `/content/details?feedId=${payload}`
      const res = yield call(
        api.fetch,
        "get",
        url
      );
      if (res.code == "0") {
        yield put({
          type: "showContentDetails",
          payload: res.res
        });
      }
    },
    *freshComment({payload},{call,put}){
      const res = yield call(api.fetch,"get",`/content/freshComment?feedId=${payload}`)
      if (res.code == "0") {
        yield put({
          type: "changeCommentList",
          payload: res.res
        });
      }
    },
    *postComment({ payload }, { call, put }) {
      const res = yield call(
        api.fetch,
        "post",
        "/content/postComment",
        payload
      );
      if (res.code == "0") {
        yield put({
          type: "changeCommentList",
          payload: res.res
        });
      }
    },
    *postCommentReply({payload},{call,put}){
      const res = yield call(api.fetch,"post","/content/postCommentReply",payload.commentReply)
      if (res.code == "0") {
        yield put({
          type: "freshComment",
          payload: payload.feedId
        });
      }
    }
  },
  reducers: {
    showContentDetails(state, { payload }) {
      const {isLiked,isKeep,contentDetails,commentUserList,likeNum,keepNum,messageNum} = payload
      return {
        ...state,
        contentDetails,
        commentUserList,
        isKeep,
        isLiked,
        likeNum,
        keepNum,
        messageNum
      };
    },
    changeCommentList(state, { payload }) {
      return { ...state, commentUserList: payload };
    }
  }
};
