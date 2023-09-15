import React from 'react';
import { Button, Checkbox, Form, Input, message, Row, Col, Divider } from 'antd';

const LoginView = (props) => {
  return (
    <div>
      <Row style={{ height: '100vh' }}>
        <Col span={14}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {props.backImage}
          </div>
          <div style={{ width: 1, height: '60vh', marginTop: '20vh', border: '1px solid #efefef', position: 'absolute', top: 0, right: 0 }} />
        </Col>
        <Col span={10} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto', width: 400, border: '1px solid #efefef', borderRadius: 12, padding: '48px 0' }}>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 48 }}>{props.title}</h1>
            {props.form}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default LoginView;