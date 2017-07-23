import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class ExpressDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            express_id: '',
            system_version: '',
            trade: {}
        }
    }

    componentDidMount() {
        notification.on('notification_express_detail_add', this, function (data) {

            this.props.form.setFieldsValue({
                express_receiver_name: data.trade.trade_receiver_name,
                express_receiver_mobile: data.trade.trade_receiver_mobile,
                express_receiver_province: data.trade.trade_receiver_province,
                express_receiver_city: data.trade.trade_receiver_city,
                express_receiver_area: data.trade.trade_receiver_area,
                express_receiver_address: data.trade.trade_receiver_address,
            });

            this.setState({
                trade: data.trade,
                is_show: true,
                action: 'save'
            });
            console.log("trade ", data.trade)
        });

        notification.on('notification_express_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                express_id: data.express_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_express_detail_add', this);

        notification.remove('notification_express_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/express/' + constant.action + '/find',
            data: {
                express_id: this.state.express_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    trade_id: data.trade_id,
                    stock_id: data.stock_id,
                    express_receiver_user_id: data.express_receiver_user_id,
                    express_sender_user_id: data.express_sender_user_id,
                    express_shipper_code: data.express_shipper_code,
                    express_no: data.express_no,
                    express_type: data.express_type,
                    express_receiver_company: data.express_receiver_company,
                    express_receiver_name: data.express_receiver_name,
                    express_receiver_tel: data.express_receiver_tel,
                    express_receiver_mobile: data.express_receiver_mobile,
                    express_receiver_postcode: data.express_receiver_postcode,
                    express_receiver_province: data.express_receiver_province,
                    express_receiver_city: data.express_receiver_city,
                    express_receiver_area: data.express_receiver_area,
                    express_receiver_address: data.express_receiver_address,
                    express_sender_company: data.express_sender_company,
                    express_sender_name: data.express_sender_name,
                    express_sender_tel: data.express_sender_tel,
                    express_sender_mobile: data.express_sender_mobile,
                    express_sender_postcode: data.express_sender_postcode,
                    express_sender_province: data.express_sender_province,
                    express_sender_city: data.express_sender_city,
                    express_sender_area: data.express_sender_area,
                    express_sender_address: data.express_sender_address,
                    express_cost: data.express_cost,
                    express_is_pay: data.express_is_pay,
                    express_pay_way: data.express_pay_way,
                    express_start_date: data.express_start_date,
                    express_end_date: data.express_end_date,
                    express_logistics: data.express_logistics,
                    express_status: data.express_status,
                    express_remark: data.express_remark
                });

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

            values.express_id = this.state.express_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/express/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_express_index_load', {});

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
            express_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={<h3>发货单</h3>} maskClosable={false} width={document.documentElement.clientWidth - 200}
                   className="modal"
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
                                                            this.props.express.app_list.map(function (item) {
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
                        <br/>
                        <h2>收货人信息</h2>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人">
                                    {
                                        getFieldDecorator('express_receiver_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '收货人'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人手机">
                                    {
                                        getFieldDecorator('express_receiver_mobile', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '收货人手机'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人省">
                                    {
                                        getFieldDecorator('express_receiver_province', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '收货人省'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="收货人市">
                                    {
                                        getFieldDecorator('express_receiver_city', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '收货人市'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人区">
                                    {
                                        getFieldDecorator('express_receiver_area', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '收货人区'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货详细地址">
                                    {
                                        getFieldDecorator('express_receiver_address', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '收货详细地址'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <br/>
                        <h2>快递信息</h2>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递公司编码">
                                    {
                                        getFieldDecorator('express_shipper_code', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '快递公司编码'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递单号">
                                    {
                                        getFieldDecorator('express_no', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '快递单号'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递类型">
                                    {
                                        getFieldDecorator('express_type', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '快递类型'}
                                                   onPressEnter={this.handleSubmit.bind(this)}/>
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

ExpressDetail.propTypes = {};

ExpressDetail = Form.create({})(ExpressDetail);

export default connect(({express}) => ({express}))(ExpressDetail);