import React, { Component } from "react";
import { List, Avatar, Comment, Icon, Tooltip, Input, message } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import Link from "umi/link";
import styles from "./index.less";
import Editor from "../Editor";

const TextArea = Input.TextArea;
const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

export default class CommentList extends Component {
  state = {
    visible: false,
    commentId: null,
    toUserId: null,
    toUserNickname: null
  };
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextState !== this.state) {
      return true;
    }
    return this.props.dataSource !== nextProps.dataSource;
  }

  showEditor = ({ commentId, fromUserId, fromUserNickname }) => {
    this.setState({
      commentId,
      toUserId: fromUserId || null,
      toUserNickname: fromUserNickname || null,
      visible: true
    });
  };
  submit = value => {
    const { postCommentReply, feedId, showLogin } = this.props;
    if (!sessionStorage.getItem("isLogin")) {
      showLogin();
      return;
    }
    const { toUserId, commentId } = this.state;
    const payload = {
      commentReply: {
        toUserId: toUserId || null,
        commentId,
        repCon: value,
        repTime: new Date().getTime(),
        repType: toUserId ? 1 : 0
      },
      feedId
    };
    postCommentReply(payload);
    this.setState({
      commentId: null,
      visible: false,
      toUserId: null,
      toUserNickname: null
    });
    message.success("评论发送成功！");
  };
  render() {
    const { dataSource } = this.props;
    const { visible, commentId, toUserNickname } = this.state;
    const reply = `回复${toUserNickname}：`;
    const CommentTop = ({ children, record }) => (
      <Comment
        key={record.commentId}
        actions={[
          <span>
            {moment().subtract(1, "days") < record.time
              ? moment(record.time).fromNow()
              : moment(record.time).format(dateFormat)}
          </span>,
          <span>
            <Icon type="message" onClick={() => this.showEditor(record)} />
          </span>
        ]}
        avatar={
          <Avatar
            src={
              record.avatar == null
                ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                : `http://localhost:8080/pic/${record.avatar}`
            }
          />
        }
        author={<Link to={`/pc/${record.fromUserId}`}>{record.nickname}</Link>}
        content={record.comCon}
      >
        {children}
      </Comment>
    );
    const commentChildren = itemList => {
      return itemList.map((item, index) => (
        <Comment
          key={index}
          actions={[
            <span>
              {moment().subtract(1, "days") < item.repTime
                ? moment(item.repTime).fromNow()
                : moment(item.repTime).format(dateFormat)}
            </span>,
            <span>
              <Icon type="message" onClick={() => this.showEditor(item)} />
            </span>
          ]}
          avatar={
            <Avatar
              src={
                item.avatar == null
                  ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                  : `http://localhost:8080/pic/${item.avatar}`
              }
            />
          }
          author={
            <Link to={`/pc/${item.fromUserId}`}>{item.fromUserNickname}</Link>
          }
          content={
            item.repType === 0 ? (
              item.repCon
            ) : (
              <span>
                回复
                <Link to={`/pc/${item.toUserId}`}>{`@${
                  item.toUserNickname
                }`}</Link> :{item.repCon}
              </span>
            )
          }
        />
      ));
    };

    return (
      <List
        className={styles.main}
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={item => (
          <List.Item>
            <CommentTop record={item}>
              {JSON.stringify(item.commentReplyList) === "{}"
                ? null
                : commentChildren(item.commentReplyList)}
              {visible == true && commentId == item.commentId ? (
                toUserNickname ? (
                  <Editor onSubmit={this.submit} placeholder={reply} />
                ) : (
                  <Editor onSubmit={this.submit} />
                )
              ) : null}
            </CommentTop>
          </List.Item>
        )}
      />
    );
  }
}
