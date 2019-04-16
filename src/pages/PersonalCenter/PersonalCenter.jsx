import React, { Component } from "react";
import { Card, Avatar, Icon, Tabs, List, Row, Col } from "antd";
import { StickyContainer, Sticky } from "react-sticky";
import { connect } from "dva";
import styles from "./index.less";

import UserList from "../../components/UserList";
import FeedList from "../../components/FeedList";

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
  loading
}))
class PersonalCenter extends Component {
  state = {
    ws: undefined
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "personal/initPersonalCenter"
    });
  }

  handleButtonClick = () => {
    const { dispatch, user } = this.props;
    dispatch({
      type: "websocket/sendMessage",
      payload: user.user
    });
  };

  operations = () => {
    return (
      <div>
        <span style={{ marginRight: "10px" }}>关注：1000</span>|
        <span style={{ marginRight: "10px", marginLeft: "10px" }}>
          粉丝：1000
        </span>
      </div>
    );
  };

  onDeleteClick = item => {
    const {dispatch} = this.props
    dispatch({
      type: "personal/deleteFeed",
      payload: {feedId:item.feedId}
    })
  }

  handleTabClick = key => {
    console.log(key);
    const { dispatch } = this.props;
    if (key === "1") {
      dispatch({
        type: "feed/selectMyFeed"
      });
    }
    if (key === "2") {
      dispatch({
        type: "feed/selectMyKeep"
      });
    }
    if (key === "3") {
      dispatch({
        type: "personal/getMyFollower"
      });
    }
    if (key === "4") {
      dispatch({
        type: "personal/getMyFollowing"
      });
    }
  };
  render() {
    const { userList, masterNum = 0, followerNum = 0 } = this.props.personal;
    return (
      <div>
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
            /*tabBarExtraContent={this.operations()}*/
            defaultActiveKey="1"
            onChange={key => this.handleTabClick(key)}
            renderTabBar={renderTabBar}
            className={styles.tabs}
            style={{ marginTop: "1px" }}
          >
            <TabPane tab="我发布的" key={1}>
              <FeedList showClose onCloseClick={this.onDeleteClick} />
            </TabPane>
            <TabPane tab="我收藏的" key={2}>
              <FeedList />
            </TabPane>
            <TabPane tab={`关注：${masterNum}`} key={3}>
              <UserList data={userList} />
            </TabPane>
            <TabPane tab={`粉丝：${followerNum}`} key={4}>
              <UserList data={userList} />
            </TabPane>
          </Tabs>
        </StickyContainer>
      </div>
    );
  }
}

export default PersonalCenter;
