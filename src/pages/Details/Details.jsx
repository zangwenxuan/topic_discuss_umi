import React, { Component } from "react";
import {
  Card,
  Icon,
  Avatar,
  Button,
  Input,
  Row,
  Col,
  Tag,
  Tooltip
} from "antd";
import { withRouter } from "react-router";
import { connect } from "dva";
import styles from "./index.less";
import Zmage from "../../components/ContentImgs";
import Link from "umi/link";

import Editor from "../../components/Editor";
import CommentList from "../../components/CommentList";

const { Meta } = Card;
const TextArea = Input.TextArea;

class Details extends Component {
  componentDidMount() {
    const { match, getContentDetails } = this.props;
    const { params } = match;
    getContentDetails(params.feedId);
    this.setState({
      feedId: params.feedId
    });
  }
  componentDidUpdate = prevProps => {
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
      console.log(this.state);
    }
    const { match, getContentDetails } = this.props;
    const { params } = match;
    if(params.feedId && params.feedId !== this.state.feedId) {
      getContentDetails(params.feedId);
      this.setState({
        feedId: params.feedId
      });
    }
  };
  componentWillUnmount() {
    const { freshByFeedId } = this.props;
    const { isKeep, isLiked, feedId } = this.state;
      const payload = {
        isLiked,
        isKeep,
        feedId
      };
      freshByFeedId(payload);
  }

  state = {
    feedId: "",
    visible: false,
    isLiked: false,
    isKeep: false,
    likeNum: "",
    keepNum: "",
    messageNum: ""
  };
  onChange = e => {
    this.setState({
      commentValue: e.target.value
    });
  };
  handleLikeChange = () => {
    const { isLiked, likeNum } = this.state;
    this.setState({
      likeNum: isLiked ? likeNum - 1 : likeNum + 1,
      isLiked: !isLiked
    });
  };
  handleKeepChange = () => {
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
    const { user, postComment } = this.props;
    const { visible } = this.state;
    const payload = {
      sendContentFeedId: this.state.feedId,
      userUid: user.user.uid,
      comCon: value,
      time: new Date().getTime()
    };
    postComment(payload);
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
  render() {
    const { details, Loading, submitting, user, postCommentReply } = this.props;
    const { feedId, visible } = this.state;
    const { contentDetails = {}, commentUserList = {} } = details;
    const { picList = {}, themeList = {} } = contentDetails;
    const commentList = {
      feedId,
      user,
      postCommentReply,
      dataSource: commentUserList
    };
    console.log(details);
    return (
      <div>
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
                  contentDetails.avatar == ""
                    ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                    : `http://localhost:8080/pic/${contentDetails.avatar}`
                }
              />
            }
            title={contentDetails.nickname}
            description={this.showTags(themeList)}
          />
          <font size="4" color="black" style={{marginLeft:"45px"}}>{contentDetails.content}</font>
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

function mapStateToProps({ user, details, loading }) {
  return {
    details,
    user,
    Loading: loading.effects["details/getContentDetails"],
    submitting: loading.effects["details/postComment"]
  };
}
function mapDispatchToProps(dispatch) {
  return {
    freshByFeedId: payload => {
      dispatch({
        type: "details/freshByFeedId",
        payload
      });
    },
    getContentDetails: id => {
      dispatch({
        type: "details/getContentDetails",
        payload: id
      });
    },
    postComment: payload => {
      dispatch({
        type: "details/postComment",
        payload
      });
    },
    postCommentReply: payload => {
      dispatch({
        type: "details/postCommentReply",
        payload
      });
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Details)
);
