import React, { Component } from "react";
import { Layout, Menu, Icon, Avatar, Dropdown } from "antd";
import Link from "umi/link";
import router from "umi/router";
import styles from "./Header.less";
import { connect } from "dva";

import LoginModal from "../components/LoginModal";
import NoticeIcon from "../components/NoticeIcon";
import Search from "../components/HeaderSrarch";

const { Header } = Layout;

@connect(({ user, loading }) => ({
  user,
  chatNoticeClear: loading.effects["user/clearReadStatus"]
}))
class HeaderPanel extends Component {
  state = {
    itemClick: true,
    visible: false,
    loginVisible: false,
    user: undefined,
    ws: undefined
  };

  componentDidMount() {
    const {
      dispatch,
      user: { currentUser }
    } = this.props;
    if (!currentUser) {
      const token = localStorage.getItem("token");
      if (!!token) {
        dispatch({
          type: "user/getCurrentUser"
        });
      }
    }
    if (!!currentUser) {
      this.webSocket();
      dispatch({
        type: "user/getNotice"
      });
      dispatch({
        type: "user/getChatNotice"
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      user: { currentUser },
      dispatch
    } = this.props;
    if (
      !!currentUser &&
      prevProps.user.currentUser !== this.props.user.currentUser
    ) {
      this.webSocket();
      dispatch({
        type: "user/getNotice"
      });
    }
  }

  componentWillUnmount() {
    const { ws } = this.state;
    if (ws) {
      ws.close();
    }
  }

  webSocket = () => {
    let { ws } = this.state;
    const {
      user: { currentUser },
      dispatch
    } = this.props;
    if (!currentUser) {
      return null;
    }
    const wsUrl = `ws://localhost:8080/websocket/${currentUser.uid}`;
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
        if (msgJson.MsgCode === "999999") {
          //多设备在线的异常发生时;
          window.location.href = "/#/";
        } else if (msgJson.MsgCode === "555555") {
          //用户退出系统的时候;
          ws.close();
          window.location.href = "/#/";
        }
        dispatch({
          type: "user/getChatNotice"
        });
      };
      ws.onclose = function(e) {
        console.log("ws 连接关闭了");
      };
    }
  };

  search = value => {
    console.log(value);
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeNoticeReadState",
      payload: id
    });
  };

  showLogin = () => {
    this.setState({
      loginVisible: true
    });
  };

  onNoticeVisibleChange = visible => {
    const { dispatch } = this.props;
    if (visible) {
      dispatch({
        type: "user/getNotice"
      });
    } else {
      dispatch({
        type: "user/changeNoticeStatus"
      });
    }
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === "userCenter") {
      router.push("/personal");
    }
    if (key === "logout") {
      const { ws } = this.state;
      ws.close();
      this.setState({
        user: undefined,
        ws: undefined
      });
      dispatch({
        type: "user/logout"
      });
    }
    if (key === "login") {
      this.showLogin();
    }
  };

  onItemClick = item => {
    const { itemClick } = this.state;
    if (!itemClick) {
      return;
    }
    if (item.type === 10) {
      router.push(`/chatRom/${item.uid}`);
    } else if (item.type !== 4 && item.type !== -3) {
      router.push(`/details/${item.feedId}`);
    }
  };

  handleChatClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/updateChatStatus",
      payload: { netFriend: id }
    });
  };

  handleCloseClick = uid => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/deleteChatNote",
      payload: { uid }
    });
  };

  handleTabChange = key => {
    if (key === "关注/.0") {
      console.log(key);
    }
  };

  countUnreadChat = list => {
    let count = 0;
    list.forEach(l => {
      count += l.count;
    });
    return count;
  };

  handleLoginSubmit = user => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/checkUser",
      payload: user
    });
  };

  onNoticeClear = type => {
    const { dispatch, chatNoticeClear } = this.props;
    if (type === "私信") {
      this.setState({
        loading: chatNoticeClear
      });
      dispatch({
        type: "user/clearReadStatus"
      });
    }

    /*dispatch({
      type: 'global/clearNotices',
      payload: type,
    });*/
  };

  onNoticeViewMore = type => {
    const { dispatch } = this.props;
    if (type === "私信") {
      dispatch({
        type: "user/clearChatNotes"
      });
    }
  };

  getNotice = () => {
    const {
      unreadFeedNotice = [],
      unreadSubscribeNotice = [],
      historyFeedNotice = [],
      historySubscribeNotice = [],
      chatNotice = []
    } = this.props.user;
    let feedNotice = unreadFeedNotice;
    let subscribeNotice = unreadSubscribeNotice;
    if (historyFeedNotice.length !== 0) {
      feedNotice = [...unreadFeedNotice, [], ...historyFeedNotice];
    }
    if (historySubscribeNotice.length !== 0) {
      subscribeNotice = [
        ...unreadSubscribeNotice,
        [],
        ...historySubscribeNotice
      ];
    }
    return {
      unreadSubscribeNotice,
      unreadFeedNotice,
      subscribeNotice,
      feedNotice,
      chatNotice
    };
  };

  render() {
    const {
      unreadSubscribeNotice,
      unreadFeedNotice,
      subscribeNotice,
      feedNotice,
      chatNotice
    } = this.getNotice();
    const {
      user: { currentUser = {} }
    } = this.props;
    const { nickname = null, avatar = null } = currentUser;
    const menu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.handleMenuClick}
      >
        <Menu.Item key="userCenter">
          <Icon type="user" />
          个人中心
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          个人设置
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          触发报错
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const logoutMenu = (
      <Menu
        className={styles.menu}
        selectedKeys={[]}
        onClick={this.handleMenuClick}
      >
        <Menu.Item key="login">
          <Icon type="user" />
          登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Header className={styles.header}>
        <LoginModal
          onCancel={() => {
            this.setState({ loginVisible: false });
          }}
          visible={this.state.loginVisible}
        />
        <div className={styles.main}>
          <Link to="/">
            <span className={`${styles.action} ${styles.account}`}>
              <Icon
                type="home"
                style={{ fontSize: "24px", color: "#08c", marginLeft: "10px" }}
              />
            </span>
            <span
              className={`${styles.action} ${styles.account}`}
              style={{ marginLeft: "30px" }}
            >
              推荐
            </span>
          </Link>
          <div className={styles.right}>
            <span size="small" style={{ marginRight: "5px" }}>
              <Search
                className={`${styles.action} ${styles.search}`}
                placeholder={"输入任何你想搜索的内容"}
                onSearch={value => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={value => this.search(value)}
              />
            </span>
            {nickname ? (
              <NoticeIcon
                onTabChange={e => this.handleTabChange(e)}
                className={styles.action}
                count={
                  unreadSubscribeNotice.length +
                  unreadFeedNotice.length +
                  this.countUnreadChat(chatNotice)
                }
                onClear={this.onNoticeClear}
                onViewMore={this.onNoticeViewMore}
                handleChatClick={this.handleChatClick}
                onItemClick={(item, tabProps) => {
                console.log(item, tabProps); // eslint-disable-line
                  this.onItemClick(item, tabProps);
                }}
                onPopupVisibleChange={this.onNoticeVisibleChange}
              >
                <NoticeIcon.Tab
                  showClear
                  count={unreadSubscribeNotice.length}
                  list={subscribeNotice}
                  title="关注"
                  emptyText="没有最新消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  count={unreadFeedNotice.length}
                  list={feedNotice}
                  title="通知"
                  emptyText="没有最新消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                  showViewMore
                />
                <NoticeIcon.Tab
                  clearLoading={this.props.chatNoticeClear}
                  onCloseClick={this.handleCloseClick}
                  clearClose
                  showClear
                  count={this.countUnreadChat(chatNotice)}
                  list={chatNotice}
                  title="私信"
                  emptyText="没有最新私信"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                  showViewMore
                />
              </NoticeIcon>
            ) : null}
            <Dropdown overlay={nickname ? menu : logoutMenu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  alt="avatar"
                  src={
                    avatar == null
                      ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                      : `http://localhost:8080/pic/${avatar}`
                  }
                />
                <span>{nickname || ""}</span>
              </span>
            </Dropdown>
          </div>
        </div>
      </Header>
    );
  }
}

export default HeaderPanel;
