import React, { Component } from "react";
import { Tooltip, List, Avatar, Input, Divider, Button, Col, Row } from "antd";
import { connect } from "dva";
import router from "umi/router";
import styles from "./index.less";

import ChatList from "../../components/ChatList";

const TextArea = Input.TextArea;
const rdom = require("react-dom");
require("core-js");

@connect(({ user, chatMsg, loading }) => ({
  user,
  chatMsg,
  submitting: loading.effects["chatMsg/getAllMessage"]
}))
class MsgPopPage extends Component {
  state = {
    guestId: undefined,
    guestAvatar: undefined,
    guestNickname: undefined,
    value: "",
    shouldScroll: true,
    msgList: [],
    currentUser: undefined,
    ws: undefined
  };

  componentWillUnmount() {
    const { ws } = this.state;
    if (ws) {
      ws.close();
    }
  }

  componentWillMount() {}

  componentDidMount = () => {
    const isLogin = sessionStorage.getItem("isLogin");
    if (!isLogin) {
      router.push("/login");
      return;
    }
    const {
      dispatch,
      match,
      user: { currentUser }
    } = this.props;
    const { params } = match;
    this.webSocket(currentUser.uid, params.uid);
    dispatch({
      type: "chatMsg/getAllMessage",
      payload: params.uid
    });
    this.setState({
      guestId: params.uid,
      currentUser
    });
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.chatMsg.guest !== this.props.chatMsg.guest) {
      const { guest } = this.props.chatMsg;
      this.setState({
        guestAvatar: guest.avatar,
        guestNickname: guest.nickname
      });
    }
    if (prevProps.chatMsg.msgList !== this.props.chatMsg.msgList) {
      const { msgList } = this.props.chatMsg;
      this.setState({
        msgList
      });
    }
    const { guestId, ws } = this.state;
    const { dispatch, match } = this.props;
    const { params } = match;
    if (guestId && guestId !== params.uid) {
      if (ws) {
        ws.close();
      }
      this.webSocket(params.uid);
      this.setState({
        guestId: params.uid
      });
      dispatch({
        type: "chatMsg/getAllMessage",
        payload: params.uid
      });
    }
  }

  webSocket = (currentUserId, id) => {
    let { ws } = this.state;
    const wsUrl = `ws://localhost:8080/websocket/${currentUserId}${id}`;
    if (!ws) {
      ws = new WebSocket(wsUrl);
      this.setState({
        ws
      });
      ws.onopen = function(e) {
        console.log("连接上 ws 服务端了");
      };
      ws.onmessage = msg => {
        console.log("接收服务端发过来的消息: %o", msg);
        let msgJson = JSON.parse(msg.data);
        if (msgJson.MsgCode == "999999") {
          //多设备在线的异常发生时;
          window.location.href = "/#/";
        } else if (msgJson.MsgCode == "555555") {
          //用户退出系统的时候;
          ws.close();
          window.location.href = "/#/";
        }
        const { msgList } = this.state;
        this.setState({
          msgList: [
            ...msgList,
            { toUserId: currentUserId, message: msgJson.content }
          ]
        });
        console.log(msgJson);
      };
      ws.onclose = function(e) {
        console.log("ws 连接关闭了");
        console.log(e);
      };
    }
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
      shouldScroll: false
    });
  };

  handleClick = () => {
    const { value, guestId, msgList, currentUser } = this.state;
    const { dispatch } = this.props;
    if (value === "") {
      return null;
    }
    this.setState({
      value: "",
      shouldScroll: true,
      msgList: [...msgList, { fromUserId: currentUser.uid, message: value }]
    });
    dispatch({
      type: "chatMsg/sendMessage",
      payload: {
        toUserId: guestId,
        message: value
      }
    });
  };

  changeScrollStatus = () => {
    this.setState({
      shouldScroll: false
    });
  };

  handleScroll = e => {
    const ele = rdom.findDOMNode(this);
    if (e.nativeEvent.deltaY <= 0) {
      /* scrolling up */
      if (ele.scrollTop <= 0) {
        console.log(ele.scrollTop);
        console.log("**********");
        /*e.preventDefault();*/
      }
    }
    /* else
    {
      /!* scrolling down *!/
      if(ele.scrollTop + ele.clientHeight >= ele.scrollHeight) {
        e.preventDefault();
      }
    }*/
  };

  render() {
    const {
      guestAvatar,
      value,
      shouldScroll,
      msgList = {},
      currentUser = {}
    } = this.state;
    const { avatar = {}, uid = {} } = currentUser;
    const chatProps = {
      msgList: msgList,
      guestAvatar,
      uid,
      avatar,
      changeStatus: this.changeScrollStatus,
      shouldScroll
    };
    return (
      <div className={styles.main}>
        <ChatList {...chatProps} />
        <Row gutter={8} className={styles.row}>
          <Col span={22}>
            <TextArea
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  this.handleClick();
                }
              }}
              rows="3"
              value={value}
              onChange={this.handleChange}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={2}>
            <Button
              htmlType="submit"
              style={{
                float: "right",
                height: "70px",
                width: "100%",
                textAlign: "center"
              }}
              onClick={this.handleClick}
            >
              发送
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MsgPopPage;
