import request from "../../../utils/requests";
export default {
  namespace: "userManager",
  state: {},
  effects: {
    *selectAll(_,{call,put}){
      const res = yield call(request.fetch,"get","/admin/selectAllUser")
      yield put({
        type: "updateUser",
        payload: res
      })
    },
    *deleteUser({payload},{call,put}){
      const res = yield call(request.fetch,"delete","/admin/deleteUser",payload)
      yield put({
        type: "deleteFromUserList",
        payload: res
      })
    }
  },
  reducers: {
    updateUser(state,{payload}){
      return {
        ...state,
        userList: payload
      }
    },
    deleteFromUserList(state,{payload}){
      return{
        ...state,
        userList: state.userList.filter(u=>u.uid!==payload)
      }
    }
  }
};
