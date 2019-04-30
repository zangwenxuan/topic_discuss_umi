import React, { Component } from "react";
import { Row, Col } from "antd";
import Zmage from "react-zmage";
import styles from "./index.less";
import api from "../../utils/getImage";

export default class ContentImgs extends Component {
  image_0 = () => <div className={styles.none} />;
  image_1 = list => (
    <div style={{height:"400px",overflow:"hidden",marginTop:"30px"}}>
      <Row gutter={1} style={{marginTop:"1px",overflow:"hidden"}}>
        <Col span={14} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_2 = list => (
    <div className={styles.main} >
      <Row gutter={1} style={{maxHeight:"400px",marginTop:"1px",overflow:"hidden"}}>
        <Col span={9} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={9}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_3 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row} >
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_4 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row}>
        <Col span={18} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[3]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_5 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row}>
        <Col span={9} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={9}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[3]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[4]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_6 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[3]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[4]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[5]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_7 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row}>
        <Col span={18} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[3]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[4]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[5]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[6]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_8 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row}>
        <Col span={9} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={9}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[3]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[4]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[5]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[6]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[7]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  image_9 = list => (
    <div className={styles.main}>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[0]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[1]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[2]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[3]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[4]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[5]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
      <Row gutter={1} className={styles.row}>
        <Col span={6} offset={3}>
          <Zmage
            className={styles.image}
            src={list[6]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[7]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
        <Col span={6}>
          <Zmage
            className={styles.image}
            src={list[8]}
            backdrop="rgba(255,255,255,0.3)"
          />
        </Col>
      </Row>
    </div>
  );
  imageList = list => {
    const imageList = list;
    /*const imageList = request.getImg(list);*/
    switch (imageList.length) {
      case 0:
        return this.image_0();
      case 1:
        return this.image_1(imageList);
      case 2:
        return this.image_2(imageList);
      case 3:
        return this.image_3(imageList);
      case 4:
        return this.image_4(imageList);
      case 5:
        return this.image_5(imageList);
      case 6:
        return this.image_6(imageList);
      case 7:
        return this.image_7(imageList);
      case 8:
        return this.image_8(imageList);
      case 9:
        return this.image_9(imageList);
      default:
        return null;
    }
  };
  render() {
    const { imageUrls } = this.props;
    return <div>{this.imageList(imageUrls)}</div>;
  }
}
