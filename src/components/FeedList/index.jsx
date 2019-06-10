import React from "react";
import {
  Avatar,
  Icon,
  List,
  message,
  Popover,
  Tag,
  Tooltip,
  Spin,
  Skeleton,
  Popconfirm
} from "antd";
import styles from "./index.less";
import Zmage from "../../components/ContentImgs";
import moment from "moment";
import classNames from "classnames";
import "moment/locale/zh-cn";
import Link from "umi/link";
import BraftEditor from "braft-editor";
import "braft-editor/dist/output.css";

import Editor from "../../components/Editor";
import PersonalCard from "../../components/PersonalCard";
import { connect } from "dva";

const rdom = require("react-dom");
const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

@connect(({ user, globalFeed, loading }) => ({
  user,
  globalFeed,
  cardLoading: loading.effects["globalFeed/queryUser"],
  likeLoading: loading.effects["feeds/like"],
  keepLoading: loading.effects["feeds/keep"]
}))
class FeedList extends React.Component {
  state = {
    visible: false,
    feedId: "",
    commentValue: "",
    themeName: "",
    showPage: true
  };

  static defaultProps = {
    keep: false,
    showClose: false,
    clickItem: false,
    tagPop: () => {}
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !(nextProps === this.props && nextState === this.state);
  }

  IconText = ({ type, text, value, onClick, feedId }) => {
    const {
      feed: { feedList = [] },
      likeLoading,
      keepLoading
    } = this.props;
    let status = false;
    let num = "";
    let loading = false;
    if (type === "like-o") {
      loading = !!likeLoading;
      status = feedList.some(l => l.feedId === feedId && l.like);
      feedList.forEach(l => {
        if (l.feedId === feedId) num = l.likeNum;
      });
    } else if (type === "star-o") {
      loading = !!keepLoading;
      status = feedList.some(l => l.feedId === feedId && l.keep);
      feedList.forEach(l => {
        if (l.feedId === feedId) num = l.keepNum;
      });
    } else {
      feedList.forEach(l => {
        if (l.feedId === feedId) num = l.commentNum;
      });
    }
    return (
      <Spin spinning={loading}>
        <span onClick={onClick}>
          <Tooltip title={status !== true ? value : `取消${value}`}>
            <Icon
              type={type}
              theme={status === true ? "filled" : "outlined"}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          {num}
        </span>
      </Spin>
    );
  };

  showComment = id => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      feedId: id
    });
  };

  showLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/showLoginModal"
    });
  };

  handleLikeChange = feedId => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch, likeLoading } = this.props;
    if (likeLoading) return;
    dispatch({
      type: "feeds/like",
      payload: { feedId }
    });
  };

  handleKeepChange = feedId => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch, keepLoading } = this.props;
    if (keepLoading) return;
    dispatch({
      type: "feeds/keep",
      payload: { feedId }
    });
  };

  onChange = e => {
    this.setState({
      commentValue: e.target.value
    });
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

  insertTag = (e, title) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: "user/insertUserTheme",
      payload: title
    });
  };

  tagPop = title => {
    return (
      <div>
        <a onClick={e => this.insertTag(e, title)}>
          <Icon type="plus" />
          添加到我的圈子
        </a>
      </div>
    );
  };

  showTags = ({ themeList }) => {
    const { tagPop } = this.props;
    const tags = themeList.map((t, index) => (
      <Link to={`/index?tab=${t}`} key={index}>
        <Popover overlayClassName={styles.popTag} content={tagPop(t)}>
          <Tag className={styles.tag} color={this.randomColor()}>
            {t}
          </Tag>
        </Popover>
      </Link>
    ));
    return <div>{tags}</div>;
  };

  submit = value => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch } = this.props;
    const payload = {
      sendContentFeedId: this.state.feedId,
      comCon: value,
      time: new Date().getTime()
    };
    dispatch({
      type: "details/postComment",
      payload: payload
    });
    this.setState({
      feedId: "",
      visible: false,
      commentValue: ""
    });
    message.success("评论发送成功！");
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

  extra = item => {
    const { showClose, keep, onCloseClick } = this.props;
    if (showClose) {
      if (!keep) {
        return (
          <Tooltip title={"删除"}>
            <Popconfirm onConfirm={() => onCloseClick(item)} title={"是否确认删除？"} okText={"确认"} cancelText={"取消"}>
            <a href={"#"} ><Icon type={"close"} /></a>
            </Popconfirm>
          </Tooltip>
        );
      } else {
        return (
          <Tooltip title={"取消收藏"}>
            <Icon type={"close"} onClick={() => onCloseClick(item, keep)} />
          </Tooltip>
        );
      }
    }
    /*return <div className={styles.more}><Icon style={{fontSize:"20px"}} type="more"></Icon></div>;*/
  };

  handleScroll = e => {
    const ele = rdom.findDOMNode(this);
    console.log(ele);
    if (e.nativeEvent.deltaY <= 0) {
      /* scrolling up */
      if (ele.scrollTop <= 0) {
        console.log(ele.scrollTop);
        console.log("**********");
      }
    }
  };

  more = () => {
    const { moreFeed } = this.props;
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    //滚动条滚动距离
    let scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    //窗口可视范围高度
    let clientHeight =
      window.innerHeight ||
      Math.min(
        document.documentElement.clientHeight,
        document.body.clientHeight
      );
    if (clientHeight + scrollTop >= scrollHeight) {
      moreFeed();
    }
  };

  render() {
    const {
      feed = {},
      globalFeed,
      cardLoading,
      listLoading,
      user: { currentUser = {} },
      showPage
    } = this.props;
    const { feedList = [] } = feed;
    const popProps = {
      currentUid: currentUser.uid,
      ...globalFeed,
      cardLoading,
      newFollow: this.newFollow,
      cancelFollow: this.cancelFollow
    };
    const { visible, feedId } = this.state;
    let listClass;
    feedList.length !== 0
      ? (listClass = classNames(styles.list))
      : (listClass = classNames(styles.nullList));
    return (
      <Spin spinning={!!listLoading}>
        <List
          className={listClass}
          itemLayout="vertical"
          size="large"
          pagination={
            showPage && {
              onChange: page => {
                console.log(page);
              },
              pageSize: 10,
              hideOnSinglePage: true
            }
          }
          dataSource={feedList}
          renderItem={item => (
            <div>
              <List.Item
                style={{
                  backgroundColor: "#fff",
                  marginBottom: "5px",
                  padding: "24px"
                }}
                key={item.feedId}
                actions={[
                  <this.IconText
                    type="star-o"
                    value="收藏"
                    feedId={item.feedId}
                    onClick={() => this.handleKeepChange(item.feedId)}
                  />,
                  <this.IconText
                    type="like-o"
                    value="喜欢"
                    feedId={item.feedId}
                    onClick={() => this.handleLikeChange(item.feedId)}
                  />,
                  <this.IconText
                    type="message"
                    value="回复"
                    feedId={item.feedId}
                    onClick={() => this.showComment(item.feedId)}
                  />,
                  <span>
                    发布于
                    {moment().subtract(1, "days") < item.releaseTime
                      ? moment(item.releaseTime).fromNow()
                      : moment(item.releaseTime).format(dateFormat)}
                  </span>
                ]}
                extra={this.extra(item)}
              >
                <Skeleton loading={!!listLoading}>
                  <List.Item.Meta
                    avatar={
                      <Popover
                        overlayClassName={styles.pop}
                        onVisibleChange={visible =>
                          this.queryUser(visible, item.authorId)
                        }
                        content={<PersonalCard {...item} {...popProps} />}
                      >
                        <Link to={`/pc/${item.authorId}`}>
                          <Avatar
                            size={40}
                            src={
                              item.avatar == null
                                ? "http://localhost:8080/pic/avatar.png "
                                : `http://localhost:8080/pic/${item.avatar}`
                            }
                          />
                        </Link>
                      </Popover>
                    }
                    title={
                      <Link to={`/pc/${item.authorId}`}>
                        <span style={{ color: "#fb7299" }}>
                          {item.nickname}
                        </span>
                      </Link>
                    }
                    description={this.showTags(item)}
                  />
                  <Link
                    className={styles.linkContent}
                    to={`/details/${item.feedId}`}
                  >
                    <div color="black" size="4" style={{ marginLeft: "50px" }}>
                      <div
                        className="braft-output-content"
                        dangerouslySetInnerHTML={{
                          __html: BraftEditor.createEditorState(
                            JSON.parse(item.content)
                          ).toHTML()
                        }}
                      />
                    </div>
                  </Link>
                  <Zmage imageUrls={item.picList} />
                </Skeleton>
              </List.Item>
              {visible && feedId === item.feedId ? (
                <Editor onChange={this.onChange} onSubmit={this.submit} />
              ) : (
                <div />
              )}
            </div>
          )}
        />
      </Spin>
    );
  }
}

export default FeedList;
