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
  Skeleton
} from "antd";
import styles from "./index.less";
import Zmage from "../../components/ContentImgs";
import moment from "moment";
import classNames from "classnames";
import "moment/locale/zh-cn";
import Link from "umi/link";
import router from "umi/router";

import Editor from "../../components/Editor";
import PersonalCard from "../../components/PersonalCard";
import { connect } from "dva";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

@connect(({ user, global, loading }) => ({
  user,
  global,
  Loading: loading.effects["feed/getContentList"],
  cardLoading: loading.effects["global/queryUser"]
}))
class FeedList extends React.Component {
  state = {
    dataSource: [],
    visible: false,
    feedId: "",
    commentValue: "",
    themeName: "",
    keepList: [],
    likeList: [],
    keepNum: [],
    likeNum: [],
    messageNum: []
  };

  static defaultProps = {
    keep: false,
    showClose: false,
    clickItem: false
  };

  componentDidMount() {
    const { feed } = this.props;
    this.setState({
      ...feed
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !(nextProps === this.props && nextState === this.state);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.feed !== this.props.feed) {
      const {
        keepNum,
        keepList,
        likeNum,
        likeList,
        messageNum
      } = this.props.feed;
      this.setState({
        keepNum,
        keepList,
        likeList,
        likeNum,
        messageNum
      });
    }
  }

  IconText = ({ type, text, value, onClick, feedId }) => {
    const { likeList, keepList, likeNum, keepNum, messageNum } = this.state;
    let status = false;
    let num = "";
    if (type === "like-o") {
      status =
        JSON.stringify(likeList) !== "[]"
          ? likeList.some(l => l.feedId === feedId && l.isLiked)
          : false;
      JSON.stringify(likeNum) !== "[]"
        ? likeNum.forEach(l => {
            if (l.feedId === feedId) num = l.num;
          })
        : "";
    } else if (type === "star-o") {
      status =
        JSON.stringify(keepList) !== "[]"
          ? keepList.some(k => k.feedId === feedId && k.isKeep)
          : false;
      JSON.stringify(keepNum) !== "[]"
        ? keepNum.forEach(l => {
            if (l.feedId === feedId) num = l.num;
          })
        : "";
    } else {
      JSON.stringify(messageNum) !== "[]"
        ? messageNum.forEach(l => {
            if (l.feedId === feedId) num = l.num;
          })
        : (num = "");
    }
    return (
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
    );
  };

  showComment = id => {
    this.setState({
      visible: true,
      feedId: id
    });
  };

  handleLikeChange = feedId => {
    if (!sessionStorage.getItem("isLogin")) {
      return;
    }
    const { dispatch } = this.props;
    const { likeList, likeNum } = this.state;
    let list = likeList;
    let num = likeNum;
    if (!likeList.map(l => l.feedId).some(f => f === feedId)) {
      list.push({ feedId, isLiked: true });
      num = likeNum.map(l => {
        if (l.feedId === feedId) {
          return { feedId, num: l.num + 1 };
        } else return l;
      });
    } else {
      let isLiked = false;
      list = likeList.map(l => {
        if (l.feedId === feedId) {
          isLiked = l.isLiked;
          return { feedId, isLiked: !l.isLiked };
        }
        return l;
      });
      num = likeNum.map(l => {
        if (l.feedId === feedId) {
          return { feedId, num: isLiked ? l.num - 1 : l.num + 1 };
        }
        return l;
      });
    }
    this.setState({
      likeNum: num,
      likeList: list
    });
    dispatch({
      type: "feed/like",
      payload: { feedId }
    });
  };

  handleKeepChange = feedId => {
    if (!sessionStorage.getItem("isLogin")) {
      return;
    }
    const { dispatch } = this.props;
    const { keepList, keepNum } = this.state;
    let list = keepList;
    let num = keepNum;
    if (!keepList.map(l => l.feedId).some(f => f == feedId)) {
      list.push({ feedId, isKeep: true });
      num = keepNum.map(l => {
        if (l.feedId == feedId) {
          return { feedId, num: l.num + 1 };
        } else return l;
      });
    } else {
      let isKeep = true;
      list = keepList.map(l => {
        if (l.feedId == feedId) {
          isKeep = l.isKeep;
          return { feedId, isKeep: !isKeep };
        }
        return l;
      });
      num = keepNum.map(l => {
        if (l.feedId == feedId) {
          return { feedId, num: isKeep ? l.num - 1 : l.num + 1 };
        }
        return l;
      });
    }
    this.setState({
      keepNum: num,
      keepList: list
    });
    dispatch({
      type: "feed/keep",
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

  showTags = ({ themeList }) => {
    const tags = themeList.map((t, index) => (
      <Link to={`/index?tab=${t}`} key={index}>
        <Tag className={styles.tag} color={this.randomColor()}>
          {t}
        </Tag>
      </Link>
    ));
    return <div>{tags}</div>;
  };

  submit = value => {
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
        type: "global/queryUser",
        payload: authorId
      });
    }
  };

  newFollow = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/newFollow",
      payload
    });
  };

  cancelFollow = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/cancelFollow",
      payload
    });
  };

  extra = item => {
    const { showClose, keep, onCloseClick } = this.props;
    if (showClose) {
      if (!keep) {
        return (
          <Tooltip title={"删除"}>
            <Icon type={"close"} onClick={() => onCloseClick(item)} />
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
    return null;
  };

  render() {
    const { feed = {}, global, cardLoading, listLoading } = this.props;
    const { contentList = [] } = feed;
    const popProps = {
      ...global,
      cardLoading,
      newFollow: this.newFollow,
      cancelFollow: this.cancelFollow
    };
    const { visible, feedId } = this.state;
    let listClass;
    contentList.length !== 0
      ? (listClass = classNames(styles.list))
      : (listClass = classNames(styles.nullList));
    return (
      <Spin spinning={!!listLoading}>
        <List
          className={listClass}
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 10,
            hideOnSinglePage: true
          }}
          dataSource={contentList}
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
                                ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
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
                  <Link to={`/details/${item.feedId}`}>
                    <font color="black" size="4" style={{ marginLeft: "50px" }}>
                      {item.content}
                    </font>
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
