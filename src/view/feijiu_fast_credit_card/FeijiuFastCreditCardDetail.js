import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import InputImage from '../../component/InputImage';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class FeijiuFastCreditCardDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            credit_card_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_feijiu_fast_credit_card_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_feijiu_fast_credit_card_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                credit_card_id: data.credit_card_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_feijiu_fast_credit_card_detail_add', this);

        notification.remove('notification_feijiu_fast_credit_card_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/feijiu/fast/credit/card/find',
            data: {
                credit_card_id: this.state.credit_card_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    credit_card_name: data.credit_card_name,
                    credit_card_link: data.credit_card_link,
                    credit_card_content: data.credit_card_content,
                    credit_card_sort: data.credit_card_sort,
                });

                let credit_card_image = [];
                if (data.credit_card_image_file !== '') {
                    credit_card_image.push(data.credit_card_image_file);
                }
                this.refs.credit_card_image.handleSetValue(credit_card_image);

                this.setState({
                    system_version: data.system_version
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

            values.credit_card_id = this.state.credit_card_id;
            values.system_version = this.state.system_version;

            let file_list = this.refs.credit_card_image.handleGetValue();
            if (file_list.length === 0) {
                values.credit_card_image = '';
            } else {
                values.credit_card_image = file_list[0].file_id;
            }

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/feijiu/fast/credit/card/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_feijiu_fast_credit_card_index_load', {});

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
            credit_card_id: '',
            system_version: ''
        });

        this.props.form.resetFields();

        this.refs.credit_card_image.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                        {
                            constant.action === 'system' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="content-search-item" label="应用名称">
                                            {
                                                getFieldDecorator('app_id', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
                                                    initialValue: ''
                                                })(
                                                    <Select allowClear placeholder="请选择应用">
                                                        {
                                                            this.props.feijiu_fast_credit_card.app_list.map(function (item) {
                                                                return (
                                                                    <Option key={item.app_id}
                                                                            value={item.app_id}>{item.app_name}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                :
                                ''
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="信用卡名称">
                                    {
                                        getFieldDecorator('credit_card_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '信用卡名称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-image-item form-required-item" label="信用卡图片">
                                    <InputImage name="credit_card_image" limit={1} ref="credit_card_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="信用卡链接">
                                    {
                                        getFieldDecorator('credit_card_link', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '信用卡链接'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="信用卡介绍">
                                    {
                                        getFieldDecorator('credit_card_content', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4} placeholder={constant.placeholder + '信用卡介绍'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row><Row>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="form-item" label="信用卡排序">
                                {
                                    getFieldDecorator('credit_card_sort', {
                                        rules: [{
                                            required: true,
                                            message: constant.required
                                        }],
                                        initialValue: 0
                                    })(
                                        <InputNumber min={0} max={999} placeholder={constant.placeholder + '信用卡排序'} onPressEnter={this.handleSubmit.bind(this)}/>
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

FeijiuFastCreditCardDetail.propTypes = {};

FeijiuFastCreditCardDetail = Form.create({})(FeijiuFastCreditCardDetail);

export default connect(({feijiu_fast_credit_card}) => ({feijiu_fast_credit_card}))(FeijiuFastCreditCardDetail);