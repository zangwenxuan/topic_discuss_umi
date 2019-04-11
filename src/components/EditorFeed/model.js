import api from "../utils/requests";
export default {
  namespace: "sendFeed",
  state: {
  },
  effects: {
    *submit({payload},{call,put}){
      console.log(payload)
    },
  },
  reducers: {

  }
};
