import React, { Component } from "react";
import { List, Avatar, Comment, Icon, Tooltip, Input, message } from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
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
  showEditor = ({ commentId, fromUserId, fromUserNickname }) => {
    this.setState({
      commentId,
      toUserId: fromUserId || null,
      toUserNickname: fromUserNickname || null,
      visible: true
    });
  };
  submit = value => {
    console.log("submit");
    const { user, postCommentReply, feedId } = this.props;
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
            <Icon type="message" onClick={this.showEditor.bind(this, record)} />
          </span>
        ]}
        avatar={
          <Avatar src={record.avatar==""?"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png ":`http://localhost:8080/pic/${record.avatar}` }/>
        }
        author={<a href="https://ant.design">{record.nickname}</a>}
        content={record.comCon}
      >
        {children}
      </Comment>
    );
    const commentChildren = itemList => {
      return itemList.map((item, index) => (
        <div>
          <Comment
            key={index}
            actions={[
              <span>
                {moment().subtract(1, "days") < item.repTime
                  ? moment(item.repTime).fromNow()
                  : moment(item.repTime).format(dateFormat)}
              </span>,
              <span>
                <Icon
                  type="message"
                  onClick={this.showEditor.bind(this, item)}
                />
              </span>
            ]}
            avatar={
              <Avatar src={item.avatar==""?"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png ":`http://localhost:8080/pic/${item.avatar}` }/>
            }
            author={<a href="https://ant.design">{item.fromUserNickname}</a>}
            content={
              item.repType === 0
                ? item.repCon
                : `回复${item.toUserNickname}：${item.repCon}`
            }
          />
        </div>
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
