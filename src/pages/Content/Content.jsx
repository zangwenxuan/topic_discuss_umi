import React, { Component } from "react";
import {
  Avatar,
  Collapse,
  Card,
  Tabs,
  Icon,
  Input,
  Row,
  Col,
  Popover,
  Tag,
  BackTop,
  Select,
  List
} from "antd";
import { connect } from "dva";
import Link from "umi/link";
import router from "umi/router";
import ClassNames from "classnames";
import styles from "./index.less";

import LoginFrom from "../../components/LoginForm";
import LoginModal from "../../components/LoginModal";
import EditorFeed from "../../components/EditorFeed";
import FeedList from "../../components/FeedList";
import PersonalCard from "../../components/PersonalCard";
import { Sticky, StickyContainer } from "react-sticky";

const Panel = Collapse.Panel;
const Meta = Card.Meta;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const InputGroup = Input.Group;
const Option = Select.Option;

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

@connect(({ user, feed, feeds, loading, globalFeed }) => ({
  user,
  feeds,
  globalFeed,
  indexLoading: loading.effects["feeds/selectIndex"],
  subscribeLoading: loading.effects["feeds/selectSubscribe"],
  themeLoading: loading.effects["feeds/selectByTheme"],
  cardLoading: loading.effects["global/queryUser"]
}))
class ContentPanel extends Component {
  state = {
    themeName: "",
    loginVisible: false,
    activeKey: "index",
    tabList: [],
    isLogin: false,
    searchClassName: ClassNames(styles.searchHidden),
    searchType: "theme"
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
        type: "feeds/selectIndex"
      });
    } else {
      this.handleTabChange(query.key);
    }

    //获取热门标签
    dispatch({
      type: "feeds/selectHotTheme"
    });
    // 挂载滚动监听
    window.addEventListener("scroll", this.bindScroll);
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

  componentWillUnmount() {
    // 移除滚动监听
    window.removeEventListener("scroll", this.bindScroll);
  }

  bindScroll = event => {
    const {
      moreLoading,
      feeds: { noMoreFeed }
    } = this.props;
    // 滚动的高度
    const scrollTop =
      (event.srcElement ? event.srcElement.documentElement.scrollTop : false) ||
      window.pageYOffset ||
      (event.srcElement ? event.srcElement.body.scrollTop : 0);
    // 视窗高度
    const clientHeight =
      (event.srcElement && event.srcElement.documentElement.clientHeight) ||
      document.body.clientHeight;
    // 页面高度
    const scrollHeight =
      (event.srcElement && event.srcElement.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    // 距离页面底部的高度
    const height = scrollHeight - scrollTop - clientHeight;
    // 判断距离页面底部的高度
    if (height <= 1000) {
      // 判断执行回调条件
      if (!moreLoading && !noMoreFeed) {
        // 执行回调
        this.moreFeed();
      }
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
        type: "feeds/selectIndex"
      });
      return;
    }
    if (tab === "subscribe") {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      dispatch({
        type: "feeds/selectSubscribe"
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
      type: "feeds/selectByTheme",
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

  showLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/showLoginModal"
    });
  };

  addTag = (e, title) => {
    e.preventDefault();
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
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

  moreFeed = () => {
    const {
      dispatch,
      indexLoading,
      subscribeLoading,
      themeLoading
    } = this.props;
    const { activeKey } = this.state;
    if (!indexLoading && !subscribeLoading && !themeLoading) {
      if (activeKey === "index") {
        dispatch({
          type: "feeds/selectIndex"
        });
      } else if (activeKey === "subscribe") {
        dispatch({
          type: "feeds/selectSubscribe"
        });
      } else {
        dispatch({
          type: "feeds/selectByTheme",
          payload: activeKey
        });
      }
    }
  };

  showHotTags = themeList => {
    if (themeList.length === 0) {
      return (
        <div style={{ minHeight: "100px", lineHeight: "100px" }}>
          <p style={{ fontSize: "20px", textAlign: "center" }}>
            暂时还没有任何圈子哦！
          </p>
        </div>
      );
    }
    const tags = themeList.map((t, index) => (
      <Link to={`/index?tab=${t}`} key={index}>
        <Popover overlayClassName={styles.popTag} content={this.tagPop(t)}>
          <Tag className={styles.tag} color={this.randomColor()}>
            {t}
            <Icon style={{ marginLeft: "5px" }} type="fire" />
          </Tag>
        </Popover>
      </Link>
    ));
    return <div style={{ lineHeight: "22px" }}>{tags}</div>;
  };

  searchTags = themeList => {
    if (themeList.length === 0) {
      return (
        <div style={{ minHeight: "100px", lineHeight: "100px" }}>
          <p style={{ fontSize: "20px", textAlign: "center" }}>
            暂时还没有任何相关圈子哦！
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

  handleSearch = value => {
    const { dispatch } = this.props;
    const { searchType } = this.state;
    this.setState({
      searchClassName: ClassNames(styles.searchShow)
    });
    if (searchType === "theme") {
      dispatch({
        type: "feeds/searchTheme",
        payload: value
      });
    } else {
      dispatch({
        type: "feeds/searchUser",
        payload: value
      });
    }

    console.log(value);
  };

  handleSelectChange = value => {
    this.setState({
      searchType: value
    });
  };

  newFollow = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: "globalFeed/newFollow",
      payload
    });
  };

  cancelFollow = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: "globalFeed/cancelFollow",
      payload
    });
  };

  queryUser = (visible, authorId) => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: "globalFeed/queryUser",
        payload: authorId
      });
    }
  };
  render() {
    const { activeKey, isLogin, tabList, searchType } = this.state;
    const {
      feeds,
      loading,
      globalFeed,
      cardLoading,
      user: { currentUser = {} }
    } = this.props;
    const feed = feeds[activeKey];
    const {
      noMoreFeed,
      hotThemeList = [],
      searchThemeList = [],
      searchUserList
    } = feeds;
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
    const popProps = {
      currentUid: currentUser.uid,
      ...globalFeed,
      cardLoading,
      newFollow: this.newFollow,
      cancelFollow: this.cancelFollow
    };
    return (
      <div style={{ width: "1200px" }}>
        <BackTop />
        <LoginModal
          visible={this.state.loginVisible}
          onCancel={() => this.setState({ loginVisible: false })}
        />
        <Row gutter={8}>
          <Col span={17}>
            <Collapse bordered={false} style={{ marginBottom: "2px" }}>
              <Panel key={1} header={"点这里发布帖子和大家一起讨论吧"}>
                {/* <Editor />*/}
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
            <FeedList
              feed={feed}
              listLoading={loading}
              tagPop={this.tagPop}
              moreFeed={this.moreFeed}
              showPage={false}
            />
            <p style={{ textAlign: "center", fontSize: "18px" }}>
              {noMoreFeed ? "抱歉，没有更多动态了哦" : "正在加载......"}
            </p>
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
            <div className={styles.tags}>
              <span style={{ fontSize: "20px", color: "#989090" }}>热门:</span>
              {this.showHotTags(hotThemeList)}
            </div>
            <div>
              <InputGroup style={{ display: "flex" }} compact>
                <Select defaultValue="theme" onChange={this.handleSelectChange}>
                  <Option value="theme">圈子</Option>
                  <Option value="user">用户</Option>
                </Select>
                <Search
                  style={{ width: "100%" }}
                  placeholder="搜索圈子或者用户"
                  onSearch={value => this.handleSearch(value)}
                />
              </InputGroup>
              <div className={this.state.searchClassName}>
                {searchType === "theme" ? (
                  <div style={{ background: "#fff", padding: "10px" }}>
                    {this.searchTags(searchThemeList)}
                  </div>
                ) : (
                  <List
                    size={"small"}
                    pagination={{ hideOnSinglePage: true }}
                    dataSource={searchUserList}
                    itemLayout="horizontal"
                    style={{ background: "#fff" }}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Popover
                              overlayClassName={styles.pop}
                              placement={"rightTop"}
                              onVisibleChange={visible =>
                                this.queryUser(visible, item.uid)
                              }
                              content={<PersonalCard {...item} {...popProps} />}
                            >
                              <Link to={`/pc/${item.uid}`}>
                                <Avatar
                                  size={50}
                                  src={
                                    item.avatar == null
                                      ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                                      : `http://localhost:8080/pic/${
                                          item.avatar
                                        }`
                                  }
                                />
                              </Link>
                            </Popover>
                          }
                          title={
                            <Link to={`/pc/${item.uid}`}>
                              <span>{item.nickname}</span>
                            </Link>
                          }
                          description={
                            item.signature || "Ta还没有填写简介。。。。。。"
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ContentPanel;
