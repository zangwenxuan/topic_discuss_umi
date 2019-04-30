import React, { Component } from "react";
import { List, Avatar, Popover, Button, Spin, Divider } from "antd";
import { connect } from "dva";
import Link from "umi/link";
import PersonalCard from "../PersonalCard";
import styles from "./index.less";

@connect(({user, globalFeed, loading }) => ({
  user,
  globalFeed,
  cardLoading: loading.effects["global/queryUser"]
}))
class UserList extends Component {
  state = {
    userList: undefined,
    listLen: 0
  };
  static defaultProps = {
    follower: false
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { data } = this.props;
    if (!!data && prevProps.data !== data) {
      this.setState({
        userList: data.map(({ followed, user }) => ({ ...user, followed })),
        listLen: data.length
      });
    }
  }

  cancelFollow = payload => {
    let { userList, listLen } = this.state;
    this.setState({
      userList: userList.map(({ followed, ...u }) =>
        u.uid === payload.master
          ? { followed: false, ...u }
          : { followed, ...u }
      ),
      listLen: listLen - 1
    });
    const { dispatch } = this.props;
    dispatch({
      type: "globalFeed/cancelFollow",
      payload
    });
  };
  newFollow = payload => {
    let { userList, listLen } = this.state;
    this.setState({
      userList: userList.map(({ followed, ...u }) =>
        u.uid === payload.master ? { followed: true, ...u } : { followed, ...u }
      ),
      listLen: listLen + 1
    });
    const { dispatch } = this.props;
    dispatch({
      type: "globalFeed/newFollow",
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
    const { userList, listLen } = this.state;
    const { globalFeed, cardLoading, follower, loading,user:{currentUser={}} } = this.props;
    const popProps = {
      currentUid:currentUser.uid,
      ...globalFeed,
      cardLoading,
      newFollow: this.newFollow,
      cancelFollow: this.cancelFollow
    };
    return (
      <div>
        <Spin spinning={loading}>
          <Divider orientation="left">
            {follower ? `关注数：${listLen}` : `粉丝数：${listLen}`}
          </Divider>
          <List
            size={"large"}
            className={styles.list}
            dataSource={userList}
            renderItem={item => (
              <List.Item
                actions={[
                  <this.AttentionButton uid={item.uid} />,
                  <Link to={`/chat/${item.uid}`}>
                    <Button>私信</Button>
                  </Link>
                ]}
              >
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
                              : `http://localhost:8080/pic/${item.avatar}`
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
                  description={item.signature || "Ta还没有填写简介。。。。。。"}
                />
              </List.Item>
            )}
          />
        </Spin>
      </div>
    );
  }
}

export default UserList;
