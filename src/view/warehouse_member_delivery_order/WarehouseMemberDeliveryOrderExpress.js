import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import express_code from "../../util/express_code";

class WarehouseMemberDeliveryOrderExpress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            member_delivery_order: {}
        }
    }

    componentDidMount() {
        notification.on('notification_warehouse_member_delivery_order_express', this, function (data) {

            this.props.form.setFieldsValue({
                express_receiver_name: data.member_delivery_order.member_delivery_order_receiver_name,
                express_receiver_mobile: data.member_delivery_order.member_delivery_order_receiver_mobile,
                express_receiver_province: data.member_delivery_order.member_delivery_order_receiver_province,
                express_receiver_city: data.member_delivery_order.member_delivery_order_receiver_city,
                express_receiver_area: data.member_delivery_order.member_delivery_order_receiver_area,
                express_receiver_address: data.member_delivery_order.member_delivery_order_receiver_address,
                express_shipper_code: data.member_delivery_order.member_delivery_order_express_shipper_code
            });

            this.setState({
                member_delivery_order: data.member_delivery_order,
                is_show: true,
                action: 'express/save'
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_warehouse_member_delivery_order_express', this);
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            values.member_delivery_order_id = this.state.member_delivery_order.member_delivery_order_id;
            this.setState({
                is_load: true
            });

            http.request({
                url: '/member/delivery/order/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_warehouse_member_delivery_order_detail_view_load', {});

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
            member_delivery_order: {}
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={<h3>填写快递单</h3>} maskClosable={false} width={document.documentElement.clientWidth - 200}
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
                                }} className="form-item" label="快递公司">
                                    {
                                        getFieldDecorator('express_shipper_code', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select
                                                showSearch
                                                placeholder="选择快递公司"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {
                                                    express_code.map((item, index) => <Option value={item.value} key={index}>{item.label}</Option>)
                                                }
                                            </Select>
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
                                            }, {
                                                min: 6,
                                                message: '快递单号长度不能少于6位'
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
                                }} className="form-item" label="寄件费（运费）">
                                    {
                                        getFieldDecorator('express_cost', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <InputNumber min={0} placeholder={constant.placeholder + '请输入寄件费（运费）'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="备注">
                                    {
                                        getFieldDecorator('express_remark', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4} placeholder={constant.placeholder + '备注'} onPressEnter={this.handleSubmit.bind(this)}/>
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

WarehouseMemberDeliveryOrderExpress.propTypes = {};

WarehouseMemberDeliveryOrderExpress = Form.create({})(WarehouseMemberDeliveryOrderExpress);

export default WarehouseMemberDeliveryOrderExpress;