import React, { Component } from "react";
import { Card, Icon, Avatar, Tag, Tooltip, message } from "antd";
import { connect } from "dva";
import router from "umi/router";
import styles from "./index.less";
import Zmage from "../../components/ContentImgs";
import Link from "umi/link";
import BraftEditor from "braft-editor";

import PersonalCard from "../../components/PersonalCard";
import Editor from "../../components/Editor";
import CommentList from "../../components/CommentList";

const { Meta } = Card;

@connect(({ user, details, loading }) => ({
  details,
  user,
  Loading: loading.effects["details/getContentDetails"],
  submitting: loading.effects["details/postComment"]
}))
class Details extends Component {
  state = {
    feedId: "",
    visible: false,
    isLiked: false,
    isKeep: false,
    likeNum: "",
    keepNum: "",
    messageNum: ""
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const {
      match: { params },
      dispatch
    } = this.props;
    if (!params.feedId) {
      router.replace("/index");
      return;
    }
    dispatch({
      type: "details/getContentDetails",
      payload: params.feedId
    });
    this.setState({
      feedId: params.feedId
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
    if (prevProps.details !== this.props.details) {
      const {
        isLiked,
        isKeep,
        likeNum,
        keepNum,
        messageNum
      } = this.props.details;
      this.setState({
        isKeep,
        isLiked,
        likeNum,
        keepNum,
        messageNum
      });
    }
    const { match, dispatch } = this.props;
    const { params } = match;
    if (!!params.feedId && params.feedId !== this.state.feedId) {
      dispatch({
        type: "details/getContentDetails",
        payload: params.feedId
      });
      this.setState({
        feedId: params.feedId
      });
    }
  }
  onChange = e => {
    this.setState({
      commentValue: e.target.value
    });
  };
  showLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "user/showLoginModal"
    });
  };
  handleLikeChange = () => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch } = this.props;
    const { feedId } = this.state;
    dispatch({
      type: "feeds/like",
      payload: {feedId}
    });
    const { isLiked, likeNum } = this.state;
    this.setState({
      likeNum: isLiked ? likeNum - 1 : likeNum + 1,
      isLiked: !isLiked
    });
  };
  handleKeepChange = () => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch } = this.props;
    const { feedId } = this.state;
    dispatch({
      type: "feeds/keep",
      payload: {feedId}
    });
    const { isKeep, keepNum } = this.state;
    this.setState({
      keepNum: isKeep ? keepNum - 1 : keepNum + 1,
      isKeep: !isKeep
    });
  };
  showComment = () => {
    this.setState({
      visible: true
    });
  };
  IconText = ({ onClick, type, value }) => {
    const { isLiked, isKeep, likeNum, keepNum, messageNum } = this.state;
    let status = false;
    let num = "";
    if (type == "like-o") {
      status = isLiked;
      num = likeNum;
    } else if (type == "star-o") {
      status = isKeep;
      num = keepNum;
    } else {
      num = messageNum;
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
  submit = value => {
    if (!sessionStorage.getItem("isLogin")) {
      this.showLogin();
      return;
    }
    const { dispatch } = this.props;
    const { visible } = this.state;
    if (!value) {
      message.error("评论内容不能为空！");
      return;
    }
    const payload = {
      sendContentFeedId: this.state.feedId,
      comCon: value,
      time: new Date().getTime()
    };
    dispatch({
      type: "details/postComment",
      payload
    });
    this.setState({
      visible: !visible
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
  showTags = themeList => {
    if (JSON.stringify(themeList) === "{}") {
      return <div />;
    }
    const tags = themeList.map((t, index) => (
      <Link to={`/index?tab=${t}`} key={index}>
        <Tag className={styles.tag} color={this.randomColor()}>
          {t}
        </Tag>
      </Link>
    ));
    return <div>{tags}</div>;
  };
  postCommentReply = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: "details/postCommentReply",
      payload
    });
  };
  render() {
    const { details, Loading, submitting, user } = this.props;
    const { feedId, visible } = this.state;
    const { contentDetails = {}, commentUserList = {} } = details;
    const { picList = {}, themeList = {} } = contentDetails;
    const commentList = {
      feedId,
      postCommentReply: this.postCommentReply,
      dataSource: commentUserList,
      showLogin: this.showLogin
    };
    const content = !!contentDetails.content ? contentDetails.content : "{}";
    return (
      <div style={{ width: "1000px", margin: "0 auto" }}>
        <Card
          className={styles.card}
          actions={[
            <this.IconText
              value="收藏"
              type="star-o"
              onClick={this.handleKeepChange}
            />,
            <this.IconText
              value="喜欢"
              type="like-o"
              onClick={this.handleLikeChange}
            />,
            <this.IconText
              value="评论"
              type="message"
              onClick={this.showComment}
            />
          ]}
        >
          <Meta
            avatar={
              <Avatar
                src={
                  contentDetails.avatar == null
                    ? "http://localhost:8080/pic/avatar.png"
                    : `http://localhost:8080/pic/${contentDetails.avatar}`
                }
              />
            }
            title={
              <Link to={`/pc/${contentDetails.authorId}`}>
                {contentDetails.nickname}
              </Link>
            }
            description={this.showTags(themeList)}
          />
          <div
            size="4"
            color="black"
            style={{ fontSize: "20px", marginLeft: "50px" }}
          >
            <div
              className="braft-output-content"
              dangerouslySetInnerHTML={{
                __html: BraftEditor.createEditorState(
                  JSON.parse(content)
                ).toHTML()
              }}
            />
          </div>
          <Zmage imageUrls={picList} />
        </Card>
        {visible ? (
          <Editor onSubmit={this.submit} submitting={submitting} />
        ) : null}
        {JSON.stringify(commentUserList) === "{}" ? null : (
          <CommentList {...commentList} />
        )}
      </div>
    );
  }
}

export default Details;
