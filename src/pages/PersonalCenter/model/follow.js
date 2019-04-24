import request from "../../../utils/requests"

export default {
  namespace: "follow",
  state:{},
  effects:{
    *selectFollower({payload},{call,put}){
      const res = yield call(request.fetch,"get",`/follow/queryFollower?uid=${payload}`)
      yield put({
        type: "showFollowerList",
        payload: res
      })
    },
    *selectFollowing({payload},{call,put}){
      const res = yield call(request.fetch,"get",`/follow/queryFollowing?uid=${payload}`)
      yield put({
        type: "showFollowingList",
        payload: res
      })
    }
  },
  reducers:{
    showFollowerList(state,{payload}){
      return {...state,followerList:payload}
    },
    showFollowingList(state,{payload}){
      return {...state,followingList:payload}
    }
  }
}
