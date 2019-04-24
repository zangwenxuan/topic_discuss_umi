import React, { Component } from "react";
import { Card, Avatar, Icon, Tabs, List, Row, Col } from "antd";
import { StickyContainer, Sticky } from "react-sticky";
import { connect } from "dva";
import router from "umi/router";
import styles from "./index.less";

import UserList from "../../components/UserList";
import FeedList from "../../components/FeedList";
import LoginModal from "../../components/LoginModal";

const { Meta } = Card;
const TabPane = Tabs.TabPane;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar
        {...props}
        style={{ ...style, zIndex: 1, background: "#fff" }}
      />
    )}
  </Sticky>
);
@connect(({ user, feed, loading, personal }) => ({
  user,
  feed,
  personal,
  personalFeedLoading: loading.effects['feed/selectPersonalFeed'],
  personalMasterLoading: loading.effects['PersonalMaster'],
  personalKeepLoading: loading.effects['PersonalKeep.js']
}))
class PersonalCenter extends Component {
  state = {
    ws: undefined,
    loginVisible: false,
    uid: undefined,
    isSelf: false,
    tabKey: '1'
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    const {
      dispatch,
      match: { params },
      user: { currentUser },
      location:{query:{key}}
    } = this.props;
    const isLogin = localStorage.getItem("token");
    if (!params.uid) {
      if (!!currentUser) {
        router.push({pathname:`/personal/${currentUser.uid}`,query:{key}});
      } else if (!isLogin) {
        router.push("/login");
      }
      return;
    }
    this.setState({
      uid: params.uid,
      isSelf: !!currentUser && currentUser.uid === params.uid,
      tabKey: this.props.location.query.key || "1"
    });
    dispatch({
      type: "personal/initPersonalCenter",
      payload: params.uid
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      match: { params },
      user: { currentUser },
      location:{query:{key}}
    } = this.props;
    if (!params.uid) {
      if (!!currentUser) {
        router.push({pathname:`/personal/${currentUser.uid}`,query:{key}});
      }
    }
    if(!!params.uid && params.uid !== this.state.uid) {
      this.setState({
        uid: params.uid,
        tabKey: "1"
      })
    }

    if(prevProps.user.currentUser !== currentUser){
      this.setState({
        isSelf: !!currentUser && params.uid === currentUser.uid
      })
    }
  }

  onDeleteClick = item => {
    const { dispatch } = this.props;
    dispatch({
      type: "personal/deleteFeed",
      payload: { feedId: item.feedId }
    });
  };

  handleTabClick = key => {
    const { dispatch } = this.props;
    const { uid } = this.state;
    if (key === "1") {
      dispatch({
        type: "feed/selectPersonalFeed",
        payload: uid
      });
      this.setState({
        tabKey: "1"
      })
    }
    if (key === "2") {

      dispatch({
        type: "feed/selectPersonalMaster",
        payload: uid
      });
      this.setState({
        tabKey: "2"
      })
    }
    if (key === "3") {

      dispatch({
        type: "feed/selectPersonalKeep",
        payload: uid
      });
      this.setState({
        tabKey: "3"
      })
    }
    if (key === "4") {

      dispatch({
        type: "personal/getPersonalFollower",
        payload: uid
      });
      this.setState({
        tabKey: "4"
      })
    }
    if (key === "5") {

      dispatch({
        type: "personal/getPersonalFollowing",
        payload: uid
      });
      this.setState({
        tabKey: "5"
      })
    }
  };

  render() {
    const {personal:{ userList, masterNum = 0, followerNum = 0 },personalKeepLoading,personalFeedLoading,personalMasterLoading} = this.props;
    const {isSelf} = this.state
    return (
      <div>
        <LoginModal
          onCancel={() => {
            this.setState({ loginVisible: false });
          }}
          visible={this.state.loginVisible}
        />
        <Card style={{ width: "100%", height: "100px" }}>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title="Card title"
            description="This is the description"
          />
        </Card>
        <StickyContainer>
          <Tabs
          /*  defaultActiveKey={this.props.location.query.key || "1"}*/
            onChange={key => this.handleTabClick(key)}
            renderTabBar={renderTabBar}
            className={styles.tabs}
            activeKey={this.state.tabKey}
            style={{ marginTop: "1px" }}
          >
            <TabPane tab="发布" key={1}>
              <FeedList showClose={isSelf} onCloseClick={this.onDeleteClick} listLoading={personalFeedLoading} />
            </TabPane>
            <TabPane tab="订阅" key={2}>
              <FeedList listLoading={personalMasterLoading} />
            </TabPane>
            <TabPane tab="收藏" key={3}>
              <FeedList  listLoading={personalKeepLoading}/>
            </TabPane>
            <TabPane tab={`关注：${masterNum}`} key={4}>
              <UserList data={userList} />
            </TabPane>
            <TabPane tab={`粉丝：${followerNum}`} key={5}>
              <UserList data={userList} />
            </TabPane>
          </Tabs>
        </StickyContainer>
      </div>
    );
  }
}

export default PersonalCenter;
