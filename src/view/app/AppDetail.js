import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Switch, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class AppDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            app_id: '',
            system_version: '',
            app_is_create_warehouse: false
        }
    }

    componentDidMount() {
        notification.on('notification_app_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_app_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                app_id: data.app_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_app_detail_add', this);

        notification.remove('notification_app_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/app/' + constant.action + '/find',
            data: {
                app_id: this.state.app_id
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    app_name: data.app_name,
                    app_secret: data.app_secret,
                    wechat_app_id: data.wechat_app_id,
                    wechat_app_secret: data.wechat_app_secret,
                    wechat_mch_id: data.wechat_mch_id,
                    wechat_mch_key: data.wechat_mch_key,
                    wechat_token: data.wechat_token,
                    wechat_encoding_aes_key: data.wechat_encoding_aes_key,
                    app_is_create_warehouse: data.app_is_create_warehouse,
                    app_is_delivery: data.app_is_delivery,
                    app_is_audit_member: data.app_is_audit_member,
                    app_is_commission: data.app_is_commission,
                    app_commission_level: data.app_commission_level
                });

                this.setState({
                    system_version: data.system_version,
                    app_is_create_warehouse: data.app_is_create_warehouse
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            values.app_id = this.state.app_id;
            values.system_version = this.state.system_version;
            console.log('values', values);
            this.setState({
                is_load: true
            });

            http.request({
                url: '/app/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_app_index_load', {});

                    this.handleCancel();
                }.bind(this),
                complete: function () {
                    this.setState({
                        is_load: false
                    });
                }.bind(this)
            });
        });
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            action: '',
            app_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'应用详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
            >
                <Spin spinning={this.state.is_load}>
                    <form>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="app_name">
                                    {
                                        getFieldDecorator('app_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'app_name'}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="app_secret">
                                    {
                                        getFieldDecorator('app_secret', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'app_secret'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="wechat_app_id">
                                    {
                                        getFieldDecorator('wechat_app_id', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'wechat_app_id'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="wechat_app_secret">
                                    {
                                        getFieldDecorator('wechat_app_secret', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'wechat_app_secret'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="wechat_mch_id">
                                    {
                                        getFieldDecorator('wechat_mch_id', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'wechat_mch_id'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="wechat_mch_key">
                                    {
                                        getFieldDecorator('wechat_mch_key', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'wechat_mch_key'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="wechat_token">
                                    {
                                        getFieldDecorator('wechat_token', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'wechat_token'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="wechat_encoding_aes_key">
                                    {
                                        getFieldDecorator('wechat_encoding_aes_key', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + 'wechat_encoding_aes_key'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否建仓库">
                                    {
                                        getFieldDecorator('app_is_create_warehouse', {
                                            valuePropName: 'checked',
                                            initialValue: false
                                        })(
                                            <Switch disabled={this.state.app_is_create_warehouse}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否发货">
                                    {
                                        getFieldDecorator('app_is_delivery', {
                                            valuePropName: 'checked',
                                            initialValue: false
                                        })(
                                            <Switch />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否审核会员">
                                    {
                                        getFieldDecorator('app_is_audit_member', {
                                            valuePropName: 'checked',
                                            initialValue: false
                                        })(
                                            <Switch />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="是否分成">
                                    {
                                        getFieldDecorator('app_is_commission', {
                                            valuePropName: 'checked',
                                            initialValue: false
                                        })(
                                            <Switch />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="参与分成的上级层数">
                                    {
                                        getFieldDecorator('app_commission_level', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '参与分成的上级层数'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

AppDetail.propTypes = {};

AppDetail = Form.create({})(AppDetail);

export default connect(({app}) => ({app}))(AppDetail);