import React, { Component } from "react";
import {
  Avatar,
  Collapse,
  Card,
  Tabs,
  Icon,
  Row,
  Col,
  Popover,
  Tag,
  BackTop
} from "antd";
import { connect } from "dva";
import Link from "umi/link";
import router from "umi/router";
import styles from "./index.less";

import LoginFrom from "../../components/LoginForm";
import LoginModal from "../../components/LoginModal";
import EditorFeed from "../../components/EditorFeed";
import List from "../../components/FeedList";
import { Sticky, StickyContainer } from "react-sticky";

const Panel = Collapse.Panel;
const Meta = Card.Meta;
const TabPane = Tabs.TabPane;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar
        closable={true}
        {...props}
        style={{ ...style, zIndex: 1, background: "#fff" }}
      />
    )}
  </Sticky>
);

@connect(({ user, feed, indexFeed, loading }) => ({
  user,
  feed,
  indexFeed,
  loading: loading.effects["indexFeed/selectFeed"]
}))
class ContentPanel extends Component {
  state = {
    themeName: "",
    loginVisible: false,
    activeKey: "index",
    tabList: [],
    isLogin: false
  };

  componentDidMount = () => {
    this.setState({
      tabList: JSON.parse(sessionStorage.getItem("tabList")) || []
    });
    const {
      user: { currentUser },
      location: { query },
      dispatch
    } = this.props;
    this.setState({
      isLogin: !!currentUser
    });
    if (!query.key) {
      dispatch({
        type: "indexFeed/selectIndex"
      });
    } else {
      this.handleTabChange(query.key);
    }
  };

  componentDidUpdate = prevProps => {
    const {
      user: { currentUser },
      location: { query }
    } = this.props;
    const { activeKey } = this.state;
    if (prevProps.user.currentUser !== currentUser) {
      this.setState({
        isLogin: !!currentUser
      });
    }
    if (!currentUser && !!query.tab && query.tab === "subscribe") {
      router.push("/index");
      return;
    }
    if (!!query.tab && query.tab !== activeKey) {
      this.handleTabChange(query.tab);
    }
    if (!query.tab && activeKey !== "index") {
      this.handleTabChange("index");
    }
  };

  handleTabChange = tab => {
    const {
      dispatch,
      user: { currentUser }
    } = this.props;
    this.setState({
      activeKey: tab
    });
    if (tab === "index") {
      dispatch({
        type: "indexFeed/selectIndex"
      });
      return;
    }
    if (tab === "subscribe") {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      dispatch({
        type: "indexFeed/selectSubscribe"
      });
      return;
    }
    this.addTab(tab);
  };

  handleTabClick = key => {
    if (key === "index") {
      router.push("/index");
      return;
    }
    if (key === "subscribe") {
      router.push({ pathname: "/index", query: { tab: "subscribe" } });
    }
  };

  addTab = themName => {
    const { dispatch } = this.props;
    let { tabList } = this.state;
    const isTabExits = tabList.some(pane => pane.key === themName);
    if (!isTabExits) {
      tabList = tabList.concat({
        title: themName,
        key: themName
      });
      this.setState({
        tabList
      });
      sessionStorage.setItem("tabList", JSON.stringify(tabList));
    }
    dispatch({
      type: "indexFeed/selectByTheme",
      payload: themName
    });
  };

  removeTab = key => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.tabList.forEach((pane, i) => {
      if (pane.key === key) {
        lastIndex = i - 1;
      }
    });
    const tabList = this.state.tabList.filter(pane => pane.key !== key);
    if (tabList.length && activeKey === key) {
      if (lastIndex >= 0) {
        activeKey = tabList[lastIndex].key;
      } else {
        activeKey = tabList[0].key;
      }
    }
    if (tabList.length === 0) {
      activeKey = "index";
    }
    this.setState({ tabList });
    sessionStorage.setItem("tabList", JSON.stringify(tabList));
    router.push({ pathname: "/index", query: { tab: activeKey } });
  };

  handleClick = key => {
    if (key === "index") {
      router.push("/index");
      return;
    }
    if (key === "subscribe") {
      router.push({ pathname: "/index", query: { tab: "subscribe" } });
      return;
    }
    router.push({ pathname: "/index", query: { tab: key } });
  };

  CloseIcon = key => {
    return (
      <div>
        <span onClick={() => this.handleClick(key)}>{key}</span>
        <Icon
          onClick={() => this.removeTab(key)}
          className={styles.icon}
          type={"close"}
        />
      </div>
    );
  };

  tagPop = title => {
    const {
      user: { currentUser = {} }
    } = this.props;
    const { themeList = [] } = currentUser;

    return (
      <div>
        {themeList.some(t => t === title) ? (
          <a onClick={e => this.cancelTag(e, title)}>
            <Icon type="minus-circle" />
            退出圈子
          </a>
        ) : (
          <a onClick={e => this.addTag(e, title)}>
            <Icon type="plus" />
            添加到我的圈子
          </a>
        )}
      </div>
    );
  };

  randomColor = () => {
    const colorItem = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ];
    let color = "#";
    let random;
    for (let i = 0; i < 6; i++) {
      random = parseInt(Math.random() * 16);
      color += colorItem[random];
    }
    return color;
  };

  addTag = (e, title) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: "user/addTag",
      payload: { themeName: title }
    });
  };

  cancelTag = (e, title) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: "user/cancelTag",
      payload: { themeName: title }
    });
  };

  showTags = themeList => {
    if (themeList.length === 0) {
      return (
        <div style={{ minHeight: "100px", lineHeight: "100px" }}>
          <p style={{ fontSize: "20px", textAlign: "center" }}>
            你还没有加入任何圈子哦！
          </p>
        </div>
      );
    }
    const tags = themeList.map((t, index) => (
      <Link to={`/index?tab=${t}`} key={index}>
        <Popover overlayClassName={styles.popTag} content={this.tagPop(t)}>
          <Tag className={styles.tag} color={this.randomColor()}>
            {t}
          </Tag>
        </Popover>
      </Link>
    ));
    return <div style={{ lineHeight: "22px" }}>{tags}</div>;
  };
  render() {
    const {
      indexFeed,
      loading,
      user: { currentUser = {} }
    } = this.props;
    const {
      themeList,
      uid,
      cover,
      signature,
      avatar,
      nickname,
      followerNum,
      followingNum,
      feedNum
    } = currentUser;
    const { activeKey, isLogin, tabList } = this.state;
    return (
      <div>
        <BackTop/>
        <LoginModal
          visible={this.state.loginVisible}
          onCancel={() => this.setState({ loginVisible: false })}
        />
        <Row>
          <Col span={17}>
            <Collapse bordered={false} style={{ marginBottom: "2px" }}>
              <Panel key={1} header={"点这里发布帖子和大家一起讨论吧"}>
                <EditorFeed />
              </Panel>
            </Collapse>
            <StickyContainer>
              <Tabs
                activeKey={activeKey}
                onChange={key => this.handleTabClick(key)}
                renderTabBar={renderTabBar}
                className={styles.tab}
                style={{ marginTop: "1px" }}
              >
                {isLogin && <TabPane tab={"订阅"} key={"subscribe"} />}
                <TabPane tab={"推荐"} key={"index"} />
                {tabList.map(pane => (
                  <TabPane tab={this.CloseIcon(pane.title)} key={pane.key} />
                ))}
              </Tabs>
            </StickyContainer>
            <List feed={indexFeed} listLoading={loading} tagPop={this.tagPop} />
          </Col>
          <Col span={7}>
            {!!nickname ? (
              <div className={styles.card}>
                <Card
                  cover={
                    <img
                      style={{ width: "100%" }}
                      alt="example"
                      src={
                        cover === null
                          ? "http://localhost:8080/pic/cover.jpg"
                          : `http://localhost:8080/pic/${cover}`
                      }
                    />
                  }
                  bordered={false}
                  actions={[
                    <Link to={`/pc/${uid}/release`}>
                      <p>发帖:</p>
                      <p style={{ color: "black" }}>{feedNum}</p>
                    </Link>,
                    <Link to={`/pc/${uid}/follower`}>
                      <p>关注:</p>
                      <p style={{ color: "black" }}>{followingNum}</p>
                    </Link>,
                    <Link to={`/pc/${uid}/following`}>
                      <p>粉丝:</p>
                      <p style={{ color: "black" }}>{followerNum}</p>
                    </Link>
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar
                        size={"large"}
                        src={
                          avatar === null
                            ? "http://localhost:8080/pic/avatar.png"
                            : `http://localhost:8080/pic/${avatar}`
                        }
                      />
                    }
                    title={<span style={{ color: "#fb7299" }}>{nickname}</span>}
                    description={
                      <span className={styles.signature}>{signature}</span>
                    }
                  />
                </Card>
                <div className={styles.tags}>
                  <span style={{ fontSize: "20px", color: "#989090" }}>
                    我的圈子:
                  </span>
                  {this.showTags(themeList)}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#fff",
                  marginLeft: "5px",
                  borderRadius: "5px"
                }}
              >
                <LoginFrom />
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ContentPanel;
