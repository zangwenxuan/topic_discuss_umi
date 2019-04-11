import React from "react";
import {Avatar, Icon, List, message, Popover, Tag, Tooltip} from "antd";
import styles from "./index.less";
import Zmage from "../../components/ContentImgs";
import moment from "moment";
import "moment/locale/zh-cn";
import Link from "umi/link";

import Editor from "../../components/Editor";
import PersonalCard from "../../components/PersonalCard";
import {routerRedux, withRouter} from "dva/router";
import {connect} from "dva";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

class FeedList extends React.Component {
  state = {
    dataSource:[],
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
  componentDidMount = ()=> {
    const { getContentList, match, getContentListByTheme } = this.props;
    const { params } = match;
    if (!params.themeName) {
      getContentList();
    } else {
      getContentListByTheme(params.themeName);
      console.log(this.props)
      this.setState({
        themeName: params.themeName
      });
    }
  }
  componentDidUpdate = prevProps => {
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
    const { match, getContentListByTheme } = this.props;
    const { themeName } = this.state;
    const { params } = match;
    if (params.themeName && themeName !== params.themeName) {
      getContentListByTheme(params.themeName);
      this.setState({
        themeName: params.themeName
      });
    }
  };
  componentWillUnmount() {
    const { likeList, keepList } = this.state;
    const { freshFeed, user } = this.props;
    let payload;
    if (!user.user) {
      payload = {
        likeList,
        keepList
      };
    } else {
      payload = {
        likeList,
        keepList,
        uid: user.user.uid
      };
    }
    freshFeed(payload);
    console.log("开始销毁");
  }
  IconText = ({ type, text, value, onClick, feedId }) => {
    const { likeList, keepList, likeNum, keepNum, messageNum } = this.state;
    let status = false;
    let num = "";
    if (type == "like-o") {
      status =
        JSON.stringify(likeList) !== "[]"
          ? likeList.some(l => l.feedId == feedId && l.isLiked)
          : false;
      JSON.stringify(likeNum) !== "[]"
        ? likeNum.forEach(l => {
          if (l.feedId == feedId) num = l.num;
        })
        : "";
    } else if (type == "star-o") {
      status =
        JSON.stringify(keepList) !== "[]"
          ? keepList.some(k => k.feedId == feedId && k.isKeep)
          : false;
      JSON.stringify(keepNum) !== "[]"
        ? keepNum.forEach(l => {
          if (l.feedId == feedId) num = l.num;
        })
        : "";
    } else {
      JSON.stringify(messageNum) !== "[]"
        ? messageNum.forEach(l => {
          if (l.feedId == feedId) num = l.num;
        })
        : "";
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
    const { likeList, likeNum } = this.state;
    let list = likeList;
    let num = likeNum;
    console.log(likeList.map(l => l.feedId));
    if (!likeList.map(l => l.feedId).some(f => f === feedId)) {
      list.push({ feedId, isLiked: true });
      num = likeNum.map(l => {
        if (l.feedId == feedId) {
          return { feedId, num: l.num + 1 };
        } else return l;
      });
    } else {
      let isLiked = false;
      list = likeList.map(l => {
        if (l.feedId == feedId) {
          isLiked = l.isLiked;
          return { feedId, isLiked: !l.isLiked };
        }
        return l;
      });
      num = likeNum.map(l => {
        if (l.feedId == feedId) {
          return { feedId, num: isLiked ? l.num - 1 : l.num + 1 };
        }
        return l;
      });
    }
    console.log(`${likeNum}****${likeList}`);
    this.setState({
      likeNum: num,
      likeList: list
    });
  };
  handleKeepChange = feedId => {
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
      <Link to={`/content/${t}`} key={index}>
        <Tag className={styles.tag} color={this.randomColor()}>
          {t}
        </Tag>
      </Link>
    ));
    return (
      <div>
        <h5 style={{ marginRight: 8, display: "inline" }}>标签:</h5>
        {tags}
      </div>
    );
  };
  submit = value => {
    const { user, postComment } = this.props;
    const payload = {
      sendContentFeedId: this.state.feedId,
      comCon: value,
      time: new Date().getTime()
    };
    postComment(payload);
    this.setState({
      feedId: "",
      visible: false,
      commentValue: ""
    });
    message.success("评论发送成功！");
  };
  queryUser = (visible, authorId) => {
    if (visible) {
      this.props.queryUser(authorId);
    }
  };
  render() {
    const {
      feed,
      global,
      queryUser,
      cardLoading,
      newFollow,
      cancelFollow,
      freshChatNotice
    } = this.props;
    const popProps = {
      ...global,
      freshChatNotice,
      queryUser,
      cardLoading,
      newFollow,
      cancelFollow
    };
    const { visible, feedId } = this.state;
    return (
      <List
        className={styles.list}
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 10
        }}
        dataSource={feed.contentList}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={item => (
          <div>
            <List.Item
              key={item.feedId}
              actions={[
                <this.IconText
                  type="star-o"
                  value="收藏"
                  feedId={item.feedId}
                  onClick={this.handleKeepChange.bind(this, item.feedId)}
                />,
                <this.IconText
                  type="like-o"
                  value="喜欢"
                  feedId={item.feedId}
                  onClick={this.handleLikeChange.bind(this, item.feedId)}
                />,
                <this.IconText
                  type="message"
                  value="回复"
                  feedId={item.feedId}
                  onClick={this.showComment.bind(this, item.feedId)}
                />,
                <span>
                发布于
                  {moment().subtract(1, "days") < item.releaseTime
                    ? moment(item.releaseTime).fromNow()
                    : moment(item.releaseTime).format(dateFormat)}
              </span>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Popover
                    onVisibleChange={visible =>
                      this.queryUser(visible, item.authorId)
                    }
                    content={<PersonalCard {...item} {...popProps} />}
                  >
                    <Avatar
                      src={
                        item.avatar == ""
                          ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                          : `http://localhost:8080/pic/${item.avatar}`
                      }
                    />
                  </Popover>
                }
                title={<span>
                  {item.nickname}</span>
                }
                description={this.showTags(item)}
              />
              <Link to={`/details/${item.feedId}`}><font color="black" size="4" style={{marginLeft:"50px"}} >{item.content}</font></Link>
              <Zmage imageUrls={item.picList}/>
            </List.Item>
            {visible == true && feedId == item.feedId ? (
              <Editor onChange={this.onChange} onSubmit={this.submit}/>
            ) : (
              <div/>
            )}
          </div>
        )}
      />
    );
  }
}

function mapStateToProps({ user, feed, global, loading }) {
  return {
    feed,
    user,
    global,
    Loading: loading.effects["feed/getContentList"],
    cardLoading: loading.effects["global/queryUser"]
  };
}
function mapDispatchToProps(dispatch) {
  return {
    freshChatNotice: () => {
      dispatch({
        type: "user/getChatNotice"
      })
    },
    cancelFollow: payload => {
      dispatch({
        type: "global/cancelFollow",
        payload
      });
    },
    newFollow: payload => {
      dispatch({
        type: "global/newFollow",
        payload
      });
    },
    queryUser: payload => {
      dispatch({
        type: "global/queryUser",
        payload
      });
    },
    freshFeed: payload => {
      dispatch({
        type: "feed/freshFeed",
        payload
      });
    },
    getContentListByTheme: payload => {
      dispatch({
        type: "feed/getContentListByTheme",
        payload: payload
      });
    },
    getContentList: () => {
      dispatch({
        type: "feed/getContentList"
      });
    },
    postComment: payload => {
      dispatch({
        type: "details/postComment",
        payload: payload
      });
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FeedList)
);

