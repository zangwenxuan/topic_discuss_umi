import React, { Component } from "react";
import { Layout, Menu, Icon, Avatar, Row, Col } from "antd";
import Link from "umi/link";
import router from "umi/router";
import styles from "./Header.less";
import { connect } from "dva";

import LoginModal from "../components/LoginModal";
import NoticeIcon from "../components/NoticeIcon";

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
    const {dispatch} = this.props
    dispatch({
      type: "user/showLoginModal"
    })
  };

  hideLogin = () => {
    const {dispatch} = this.props
    dispatch({
      type: "user/hiddenLoginModal"
    })
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

  logout = () => {
    const { dispatch } = this.props;
    const { ws } = this.state;
    ws.close();
    this.setState({
      user: undefined,
      ws: undefined
    });
    dispatch({
      type: "user/logout"
    });
  };

  onItemClick = item => {
    const { itemClick } = this.state;
    if (!itemClick) {
      return;
    }
    if (item.type === 10) {
      router.push(`/chat/${item.uid}`);
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
    if (type === "关注") {
      router.push(`/index?tab=subscribe`);
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

  changeLoginVisible = () => {
    this.setState({
      loginVisible: false
    });
  };

  personalCard = ({ nickname }) => {
    return (
      <div style={{ paddingTop: "30px" }} className={styles.card}>
        <p style={{ textAlign: "center" }}>{nickname}</p>
        <div className={styles.headerMenu}>
          <Row>
            <Col span={12}>
              <Link to={"/pc"}>
                <p style={{ textAlign: "center" }}>
                  <Icon type={"user"} />
                  个人中心
                </p>
              </Link>
            </Col>
            <Col span={12}>
              <Link to={"/bindmail"}>
                <p style={{ textAlign: "center" }}>
                  <Icon type={"mail"} />
                  更换邮箱
                </p>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Link to={"/setpassword"}>
                <p style={{ textAlign: "center" }}>
                  <Icon type={"lock"} />
                  修改密码
                </p>
              </Link>
            </Col>
            <Col span={12}>
              <a onClick={this.logout}>
                <p style={{ textAlign: "center" }}>
                  <Icon type={"logout"} />
                  退出登录
                </p>
              </a>
            </Col>
          </Row>
        </div>
      </div>
    );
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
      user: { currentUser = {}, loginModalVisible }
    } = this.props;
    const { nickname = null, avatar = null } = currentUser;
    return (
      <Header className={styles.header}>
        <LoginModal
          changeVisible={this.hideLogin}
          visible={loginModalVisible}
          onCancel={this.hideLogin}
        />
        <div className={styles.main}>
          <Link to="/">
            <span className={`${styles.action}`}>
              <Icon
                type="home"
                style={{ fontSize: "24px", color: "#08c", marginLeft: "10px" }}
              />
            </span>
          </Link>
          <div className={styles.right}>
           {/* <span size="small" style={{ marginRight: "5px" }}>
              <Search
                className={`${styles.action} ${styles.search}`}
                placeholder={"输入任何你想搜索的内容"}
                onSearch={value => {
                  console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={value => this.search(value)}
              />
            </span>*/}
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
                  showViewMore={false}
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
            <span className={styles.popCard}>
              <span className={` ${styles.account}`}>
                <Link to={"/pc"}>
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    alt="avatar"
                    src={
                      avatar == null
                        ? "http://localhost:8080/pic/avatar.png "
                        : `http://localhost:8080/pic/${avatar}`
                    }
                  />
                  {nickname ? null : (
                    <span
                      style={{
                        color: "#fff",
                        margin: "0 auto",
                        fontSize: "small"
                      }}
                      className={styles.spanLogin}
                    >
                      点击登录
                    </span>
                  )}
                </Link>
              </span>
              {!!nickname ? this.personalCard(currentUser) : null}
            </span>
          </div>
        </div>
      </Header>
    );
  }
}

export default HeaderPanel;
