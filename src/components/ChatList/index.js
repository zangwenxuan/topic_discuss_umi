import React, { Component } from "react";
import { List, Divider } from "antd";
import styles from "./index.less";
import moment from "moment";
import "moment/locale/zh-cn";
import Bubble from "../../components/ChatBubble";

const rdom = require("react-dom");
const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

export default class ChatList extends Component {
  state={
  }
  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(nextProps === this.props){
      return false;
    }
    return true
  }

  componentDidUpdate() {
    this.scrollToFooter("DidUpdate");
  }
  scrollToFooter = (e) => {
    const {shouldScroll,changeStatus} =this.props
    if(shouldScroll) {
      let anchorElement = document.getElementById("footer");
      if (anchorElement) {
        anchorElement.scrollIntoView();
        /*changeStatus();*/
      }
    }
  }

  handleScroll = e => {
    const ele = rdom.findDOMNode(this);
    if (e.nativeEvent.deltaY <= 0) {
      /* scrolling up */
      if (ele.scrollTop <= 0) {
        console.log(ele.scrollTop);
        console.log("**********");
      }
    }
  };

  render() {
    const { guestAvatar, uid, avatar, msgList } = this.props;
    let lastMessage = 0
    return (
      <div className={styles.main}>
        <List
          footer={<div id="footer"/>}
          onWheel={e => {
            this.handleScroll(e);
          }}
          pagination={false}
          split={false}
          dataSource={msgList || []}
          renderItem={item => {
            let bubbleProps = {
              lastMessage:lastMessage,
              time:item.time
            };
            if (uid === item.fromUserId) {
              bubbleProps = {...bubbleProps, avatar, isSelf: true, message: item.message };
            } else {
              bubbleProps = {
                ...bubbleProps,
                avatar: guestAvatar,
                isSelf: false,
                message: item.message
              };
            }
            lastMessage = item.time
            return (
              <List.Item>
                <Bubble {...bubbleProps} />
              </List.Item>
            );
          }}
        />
      </div>
    );
  }
}
