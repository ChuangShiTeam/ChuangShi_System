import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import express_code from "../../util/express_code";

class MemberStockOutExpress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            stock_id: '',
            stock_type: '',
            stock_product_sku_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_member_stock_out_express', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                stock_id: data.stock_id,
                stock_type: data.stock_type
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_out_express', this);

    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/member/stock/' + constant.action + '/find',
            data: {
                stock_id: this.state.stock_id,
                stock_type: this.state.stock_type
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    user_name: data.stock.user_name,
                    stock_quantity: data.stock.stock_quantity,
                    stock_receiver_name: data.stock.stock_receiver_name,
                    stock_receiver_mobile: data.stock.stock_receiver_mobile,
                    stock_receiver_province: data.stock.stock_receiver_province,
                    stock_receiver_city: data.stock.stock_receiver_city,
                    stock_receiver_area: data.stock.stock_receiver_area,
                    stock_receiver_address: data.stock.stock_receiver_address,
                    express_pay_way: data.stock.stock_express_pay_way,
                    express_shipper_code: data.stock.stock_express_shipper_code
                });

                this.setState({
                    stock_product_sku_list: data.stock_product_sku_list
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
            values.stock_id = this.state.stock_id;
            http.request({
                url: '/express/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_member_stock_out_index_load', {});

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
            stock_id: '',
            stock_type: '',
            stock_product_sku_list: []
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
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="会员名称">
                                    {
                                        getFieldDecorator('user_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
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
                                }} className="form-item" label="数量">
                                    {
                                        getFieldDecorator('stock_quantity', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text"/>
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
                                        getFieldDecorator('stock_receiver_name', {
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
                                        getFieldDecorator('stock_receiver_mobile', {
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
                                        getFieldDecorator('stock_receiver_province', {
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
                                        getFieldDecorator('stock_receiver_city', {
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
                                        getFieldDecorator('stock_receiver_area', {
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
                                        getFieldDecorator('stock_receiver_address', {
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
                            dataSource={this.state.stock_product_sku_list} pagination={false}
                            bordered/>
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
                                <FormItem {...{
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

MemberStockOutExpress.propTypes = {};

MemberStockOutExpress = Form.create({})(MemberStockOutExpress);

export default MemberStockOutExpress;