import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Icon} from 'antd';

import CertificateImageDetail from './CertificateImageDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class CertificateImageIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            user_id: '',
            system_version: '',
            certificate: {},
            certificateImageWXList: [],
            certificateImageOtherList: []
        }
    }

    componentDidMount() {
        notification.on('notification_certificate_image_list', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                user_id: data.user_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_certificate_image_list', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/certificate/' + constant.action + '/find',
            data: {
                user_id: this.state.user_id
            },
            success: function (data) {
                this.setState({
                    certificate: data.certificate,
                    certificateImageWXList: data.certificateImageWXList,
                    certificateImageOtherList: data.certificateImageOtherList
                })
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleAdd(type) {
        notification.emit('notification_certificate_image_detail_add',
            {
                "type": type,
                "user_id": this.state.user_id
            }
        );
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            user_id: '',
            system_version: '',
            certificate_image_list: []
        });
    }

    render() {
        const FormItem = Form.Item;

        return (
            <Modal title={'授权详情'} maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleCancel.bind(this)}>确定</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        <h2>基本信息</h2>
                        <br/>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员名称">
                                    {this.state.certificate.user_name}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="授权编号">
                                    {this.state.certificate.certificate_number}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否支付">
                                    {this.state.certificate.certificate_is_pay ?
                                        <Icon type="check-circle-o" style={{fontSize: 16, color: 'green'}}/>
                                        :
                                        <Icon type="close-circle-o" style={{fontSize: 16, color: 'red'}}/>
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="授权开始时间">
                                    {this.state.certificate.certificate_start_date}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="授权结束时间">
                                    {this.state.certificate.certificate_end_date}
                                </FormItem>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col span={8}>
                                <h2>微信平台授权</h2>
                            </Col>
                            <Col span={16} className="content-button">
                                <Button type="primary" icon="plus-circle" size="default"
                                        className="margin-right"
                                        onClick={this.handleAdd.bind(this, 'wx')}>添加授权</Button>
                            </Col>
                        </Row>
                        <Row>
                            {
                                this.state.certificateImageWXList.map(function (item, index) {
                                    return (
                                        <Col key={index} span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="">
                                                <div className="clearfix">
                                                    <img alt="example" style={{ height: '200px' }}
                                                         src={constant.host+item.file_original_path}/>
                                                </div>
                                            </FormItem>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                        <br/>
                        <Row>
                            <Col span={8}>
                                <h2>其他平台授权</h2>
                            </Col>
                            <Col span={16} className="content-button">
                                <Button type="primary" icon="plus-circle" size="default"
                                        className="margin-right"
                                        onClick={this.handleAdd.bind(this, 'other')}>添加授权</Button>
                            </Col>
                        </Row>
                        <Row>
                            {
                                this.state.certificateImageOtherList.map(function (item, index) {
                                    return (
                                        <Col key={index} span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="form-item" label="授权书">
                                                <div className="clearfix">
                                                    <img alt="example" style={{ height: '200px' }}
                                                         src={constant.host+item.file_original_path}/>
                                                </div>
                                            </FormItem>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </form>
                </Spin>
                <CertificateImageDetail/>
            </Modal>
        );
    }
}

CertificateImageIndex.propTypes = {};

CertificateImageIndex = Form.create({})(CertificateImageIndex);

export default CertificateImageIndex;