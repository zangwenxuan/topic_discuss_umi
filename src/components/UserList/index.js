import React, { Component } from "react";
import { List, Avatar, Popover, Button, Spin } from "antd";
import { connect } from "dva";
import Link from "umi/link";
import PersonalCard from "../PersonalCard";
import styles from "./index.less";

@connect(({ global, loading, personal }) => ({
  global,
  personal,
  cardLoading: loading.effects["global/queryUser"]
}))
class UserList extends Component {
  state = {
    userList: undefined
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.personal.userList !== this.props.personal.userList) {
      const { userList } = this.props.personal;
      this.setState({
        userList: userList.map(({ followed, user }) => ({ ...user, followed }))
      });
    }
  }

  cancelFollow = payload => {
    let { userList } = this.state;
    this.setState({
      userList: userList.map(({ followed, ...u }) =>
        u.uid === payload.master
          ? { followed: false, ...u }
          : { followed, ...u }
      )
    });
    const { dispatch } = this.props;
    dispatch({
      type: "global/cancelFollow",
      payload
    });
  };
  newFollow = payload => {
    let { userList } = this.state;
    this.setState({
      userList: userList.map(({ followed, ...u }) =>
        u.uid === payload.master ? { followed: true, ...u } : { followed, ...u }
      )
    });
    const { dispatch } = this.props;
    dispatch({
      type: "global/newFollow",
      payload
    });
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
  freshFeed = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: "feed/freshFeed",
      payload
    });
  };
  AttentionButton = ({ uid }) => {
    const { userList } = this.state;
    let status;
    if (!!userList) {
      status = userList.some(u => u.uid === uid && u.followed);
    }
    if (status) {
      return (
        <Button
          ghost
          type="primary"
          onClick={() => this.cancelFollow({ master: uid })}
        >
          取消关注
        </Button>
      );
    }
    return (
      <Button type="primary" onClick={() => this.newFollow({ master: uid })}>
        关注
      </Button>
    );
  };
  render() {
    const { userList } = this.state;
    console.log(userList)
    const { global, cardLoading } = this.props;
    const popProps = {
      ...global,
      cardLoading,
      newFollow: this.newFollow,
      cancelFollow: this.cancelFollow
    };
    return (
      <div>
        <List
          size={"large"}
          className={styles.list}
          dataSource={userList}
          renderItem={item => (
            <List.Item
              actions={[
                <this.AttentionButton uid={item.uid} />,
                <Link to={`/chatRom/${item.uid}`}>
                  <Button>私信</Button>
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Popover
                    placement={"rightTop"}
                    onVisibleChange={visible =>
                      this.queryUser(visible, item.uid)
                    }
                    content={<PersonalCard {...item} {...popProps} />}
                  >
                    <Avatar
                      size={50}
                      src={
                        item.avatar == null
                          ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                          : `http://localhost:8080/pic/${item.avatar}`
                      }
                    />
                  </Popover>
                }
                title={<span>{item.nickname}</span>}
                description={"Ta还没有填写简介。。。。。。"}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default UserList;
