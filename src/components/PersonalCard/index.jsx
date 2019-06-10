import React from "react";
import { Tooltip, Avatar, Card, Button, Spin, Ellipsis, Divider } from "antd";
import styles from "./index.less";
import Link from "umi/link";

const { Meta } = Card;

const personalCard = ({
  currentUid,
  authorId,
  uid,
  avatar,
  signature,
  cover,
  nickname,
  followerNum,
  followingNum,
  feedNum,
  cardLoading,
  followed,
  newFollow,
  cancelFollow
}) => {
  const isSelf = currentUid === uid || currentUid === authorId;
  const buttonTrue = (
    <Button
      disabled={isSelf}
      type="primary"
      onClick={() => newFollow({ master: uid || authorId })}
    >
      关注
    </Button>
  );
  const buttonFalse = (
    <Button
      ghost
      type="primary"
      onClick={() => cancelFollow({ master: uid || authorId })}
    >
      取消关注
    </Button>
  );
  return (
    <Spin spinning={!!cardLoading}>
      <div className={styles.card}>
        <Card
          cover={
            <img
              style={{ width: "100%" }}
              alt="example"
              src={
                cover === null
                  ? "http://localhost:8080/pic/cover.jpg"
                  : `http://localhost:8080/pic/${cover}`
              }
            />
          }
          bordered={false}
          actions={[
            followed ? buttonFalse : buttonTrue,
            <Link to={`/chat/${uid || authorId}`}>
              <Button disabled={isSelf}>私信</Button>
            </Link>
          ]}
        >
          <Meta
            avatar={
              <Link to={`/pc/${uid || authorId}`}>
                <Avatar
                  size={50}
                  src={
                    avatar == null
                      ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      : `http://localhost:8080/pic/${avatar}`
                  }
                />
              </Link>
            }
            title={
              <Link style={{ color: "#fb7299" }} to={`/pc/${uid || authorId}`}>
                {nickname}
              </Link>
            }
            description={
              <div>
                <span>{`发帖：${feedNum || 0}`}</span>
                <Divider type="vertical" />
                <span>{`粉丝：${followerNum || 0}`}</span>
                <Divider type="vertical" />
                <span>{`关注：${followingNum || 0}`}</span>
              </div>
            }
          />
          <p className={styles.signature}>{signature}</p>
        </Card>
      </div>
    </Spin>
  );
};
export default personalCard;
