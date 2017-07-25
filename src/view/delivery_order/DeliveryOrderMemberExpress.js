import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, Table, InputNumber} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import express_code from "../../util/express_code";

class DeliveryOrderMemberExpress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            delivery_order_id: '',
            delivery_order_product_sku_list: [],
            warehouse_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_delivery_order_express', this, function (data) {
            this.setState({
                is_show: true,
                action: 'express',
                delivery_order_id: data.delivery_order_id
            }, function () {
                this.handleLoad();
            });
        });
        this.handleLoadWarehouse();
    }

    componentWillUnmount() {
        notification.remove('notification_delivery_order_express', this);

    }

    handleLoadWarehouse() {
        http.request({
            url: '/warehouse/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.setState({
                    warehouse_list: data
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/delivery/order/' + constant.action + '/find',
            data: {
                delivery_order_id: this.state.delivery_order_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }
                this.props.form.setFieldsValue({
                    user_name: data.delivery_order.user_name,
                    delivery_order_total_quantity: data.delivery_order.delivery_order_total_quantity,
                    delivery_order_receiver_name: data.delivery_order.delivery_order_receiver_name,
                    delivery_order_receiver_mobile: data.delivery_order.delivery_order_receiver_mobile,
                    delivery_order_receiver_province: data.delivery_order.delivery_order_receiver_province,
                    delivery_order_receiver_city: data.delivery_order.delivery_order_receiver_city,
                    delivery_order_receiver_area: data.delivery_order.delivery_order_receiver_area,
                    delivery_order_receiver_address: data.delivery_order.delivery_order_receiver_address,
                    express_pay_way: data.delivery_order.delivery_order_express_pay_way,
                    express_shipper_code: data.delivery_order.delivery_order_express_shipper_code
                });

                this.setState({
                    delivery_order_product_sku_list: data.delivery_order_product_sku_list
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

            this.setState({
                is_load: true
            });
            values.delivery_order_id = this.state.delivery_order_id;
            http.request({
                url: '/delivery/order/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_delivery_order_index_load', {});

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
            delivery_order_id: '',
            delivery_order_product_sku_list: []
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            width: 150,
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            width: 150,
            title: '数量',
            dataIndex: 'product_sku_quantity'
        }];

        return (
            <Modal title={'填写快递单'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                        <h3>发货信息</h3>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员名称">
                                    {
                                        getFieldDecorator('user_name', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="数量">
                                    {
                                        getFieldDecorator('delivery_order_total_quantity', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人">
                                    {
                                        getFieldDecorator('delivery_order_receiver_name', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人手机">
                                    {
                                        getFieldDecorator('delivery_order_receiver_mobile', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人省">
                                    {
                                        getFieldDecorator('delivery_order_receiver_province', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人市">
                                    {
                                        getFieldDecorator('delivery_order_receiver_city', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货人区">
                                    {
                                        getFieldDecorator('delivery_order_receiver_area', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="收货详细地址">
                                    {
                                        getFieldDecorator('delivery_order_receiver_address', {
                                            initialValue: ''
                                        })(
                                            <Input type="text" disabled={true}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Table
                            rowKey="product_sku_id"
                            className="margin-top"
                            loading={this.state.is_load} columns={columns}
                            dataSource={this.state.delivery_order_product_sku_list} pagination={false}
                            bordered/>
                        <h3>仓库信息</h3>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="content-search-item" label="仓库名称">
                                    {
                                        getFieldDecorator('warehouse_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择仓库">
                                                {
                                                    this.state.warehouse_list.map(function (item) {
                                                        return (
                                                            <Option key={item.warehouse_id}
                                                                    value={item.warehouse_id}>{item.warehouse_name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <h3>快递单信息</h3>
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
                        </Row>
                        <Row>
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
                                            <Input type="text" placeholder={constant.placeholder + '快递单号'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="快递支付类型">
                                    {
                                        getFieldDecorator('express_pay_way', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select
                                                placeholder="选择快递支付类型"
                                            >
                                                <Option value="自己付">自己付</Option>
                                                <Option value="到付">到付</Option>
                                                <Option value="月结">月结</Option>
                                                <Option value="第三方支付">第三方支付</Option>
                                            </Select>
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

DeliveryOrderMemberExpress.propTypes = {};

DeliveryOrderMemberExpress = Form.create({})(DeliveryOrderMemberExpress);

export default DeliveryOrderMemberExpress;