import React from "react";
import { Tooltip, Avatar, Card, Button, Spin } from "antd";
import styles from "./index.less";
import Link from "umi/link";

const { Meta } = Card;

const personalCard = ({
  authorId,
  avatar,
  nickname,
  queryUser,
  followUser,
  followerNum,
  feedNum,
  cardLoading,
  isFollowed,
  newFollow,
  cancelFollow,
  freshChatNotice
}) => {
  const buttonTrue = (
    <Button type="primary" onClick={newFollow.bind(this, { master: authorId })}>
      关注
    </Button>
  );
  const buttonFalse = (
    <Button
      ghost
      type="primary"
      onClick={cancelFollow.bind(this, { master: authorId })}
    >
      取消关注
    </Button>
  );
  return (
    <Spin spinning={cardLoading}>
      <Card
        bordered={false}
        actions={[
          isFollowed ? buttonFalse : buttonTrue,
          <Link to={`/chatRom/${authorId}`} onClick={freshChatNotice}>
            <Button>私信</Button>
          </Link>
        ]}
      >
        <Meta
          avatar={
            <Avatar
              size="large"
              src={
                avatar == ""
                  ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  : `http://localhost:8080/pic/${avatar}`
              }
            />
          }
          title={nickname}
          description={`粉丝:${followerNum || 0} | 发帖数:${feedNum || 0}`}
        />
      </Card>
    </Spin>
  );
};
export default personalCard;
