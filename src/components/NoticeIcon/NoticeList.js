import React from "react";
import { Avatar, List, Divider, Icon, Badge } from "antd";
import Ellipsis from "ant-design-pro/lib/Ellipsis";
import Link from "umi/link";
import classNames from "classnames";
import styles from "./NoticeList.less";
import moment from "moment";
import "moment/locale/zh-cn";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
moment.locale("zh-cn");

function checkType(type) {
  switch (type) {
    case 0:
      return " 点赞了你的帖子";
    case 1:
      return " 收藏了你的帖子";
    case 2:
      return " 回复了你的评论";
    case 3:
      return " 评论了你的帖子";
    case 4:
      return " 关注了你";
    case -1:
      return " 取消了对你的帖子的点赞";
    case -2:
      return " 取消了对你的帖子的收藏";
    case -3:
      return " 取消了对你的关注";
    case 10:
      return " ";
    default:
      return " 发布了";
  }
}

function LinkContent({ item, onItemClick }) {
  if (item.type === 10) {
    return (
      <Link to={`/chatRom/${item.uid}`} onClick={() => onItemClick(item)}>
        <div className={styles.description} title={item.content}>
          <Ellipsis length={15}>{item.content}</Ellipsis>
        </div>
      </Link>
    );
  }
  if (item.type !== 4 && item !== -3) {
    return (
      <Link to={`/details/${item.feedId}`} onClick={() => onItemClick(item)}>
        <div className={styles.description} title={item.content}>
          <Ellipsis length={15}>{item.content}</Ellipsis>
        </div>
      </Link>
    );
  }
  return (
    <div className={styles.description} /* title={item.content}*/>
      <Ellipsis length={30}>{item.content}</Ellipsis>
    </div>
  );
}
export default function NoticeList({
  data = [],
  onClick,
  onClear,
  title,
  locale,
  emptyText,
  emptyImage,
  onItemClick,
  onCloseClick,
  clearLoading,
  onViewMore = null,
  showClear = false,
  showViewMore = true
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <div className={styles.main}>
        <List split={false} className={styles.list} size={"small"}>
          {data.map((item, i) => {
            if (JSON.stringify(item) === "[]") {
              return (
                <div key={i}>
                  <div className={styles.span}>
                    <span>暂时没有新动态了哦！</span>
                  </div>
                  <Divider style={{ fontSize: "11px" }}>历史消息</Divider>
                </div>
              );
            }
            const itemCls = classNames(styles.item, {
              [styles.read]: 0 /*item.read*/
            });
            // eslint-disable-next-line no-nested-ternary
            //此处为用户的头像
            const leftIcon = /*item.avatar ? (
              typeof item.avatar === "string" ?*/ (
                <Badge count={item.type === 10 ? item.count : 0}>
                  {" "}
                  <Avatar
                    className={styles.avatar}
                    src={item.avatar == null
                      ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png "
                      : `http://localhost:8080/pic/${item.avatar}`}
                  />
                </Badge>
              ) /*: (
                <span className={styles.iconElement}>{item.avatar}</span>
              )
            ) : null*/;

            return (
              <List.Item
                className={itemCls}
                key={item.key || i}
                /*onClick={() => onClick(item)}*/
              >
                <List.Item.Meta
                  className={styles.meta}
                  avatar={leftIcon}
                  title={
                    <div className={styles.title}>
                      {`${item.nickname}${checkType(item.type)}`}
                      {/*此处为用户的昵称*/}
                      <div className={styles.extra}>
                        {/*{item.extra}*/}
                        {item.type === 10 && (
                          <Icon onClick={()=>onCloseClick(item.uid)} type="close" />
                        )}
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <LinkContent item={item} onItemClick={onItemClick} />
                      <div className={styles.datetime}>
                        {" "}
                        {moment().subtract(1, "days") < item.time
                          ? moment(item.time).fromNow()
                          : moment(item.time).format(dateFormat)}
                      </div>
                      {/*此处为该通知的创建时间*/}
                    </div>
                  }
                />
              </List.Item>
            );
          })}
        </List>
      </div>
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearLoading === true ? (
              <Icon type="loading" style={{ fontSize: 24 }} spin />
            ) : title === "私信" ? (
              "标为已读"
            ) : (
              "清空"
            )}
          </div>
        ) : null}
        {showViewMore ? (
          <div onClick={()=>onViewMore(title)}>
            {title === "私信" ? "清空" : "更多"}
          </div>
        ) : null}
      </div>
    </div>
  );
}
