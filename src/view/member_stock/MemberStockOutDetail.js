import React, {Component} from 'react';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, Table, Switch, InputNumber} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import express_code from "../../util/express_code";

class MemberStockOutDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            stock_id: '',
            stock_product_sku_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_member_stock_out_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                stock_id: data.stock_id
            }, function () {
                this.handleLoadStock();
                this.handleLoadExpress();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_out_detail_view', this);

    }

    handleLoadStock() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/member/stock/' + constant.action + '/find',
            data: {
                stock_id: this.state.stock_id,
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    user_name: data.stock.user_name,
                    stock_quantity: data.stock.stock_quantity
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

    handleLoadExpress() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/express/' + constant.action + '/findByStockId',
            data: {
                stock_id: this.state.stock_id,
            },
            success: function (data) {
                this.props.form.setFieldsValue({
                    express_shipper_code: data.express_shipper_code,
                    express_no: data.express_no,
                    express_pay_way: data.express_pay_way,
                    express_cost: data.express_cost,
                    express_is_pay: data.express_is_pay,
                    express_start_date: data.express_start_date,
                    express_end_date: data.express_end_code,
                    express_logistics: data.express_logistics,
                    express_status: data.express_status,
                    express_receiver_name: data.express_receiver_name,
                    express_receiver_mobile: data.express_receiver_mobile,
                    express_receiver_province: data.express_receiver_province,
                    express_receiver_city: data.express_receiver_city,
                    express_receiver_area: data.express_receiver_area,
                    express_receiver_address: data.express_receiver_address,
                    express_remark: data.express_remark,
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
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
            <Modal title={'发货单详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>
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
                                            initialValue: ''
                                        })(
                                            <Select>
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
                                            initialValue: ''
                                        })(
                                            <Input type="text" />
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
                                            initialValue: ''
                                        })(
                                            <Input type="text" />
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
                                            initialValue: ''
                                        })(
                                            <InputNumber />
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
                                }} className="form-item" label="运费是否支付">
                                    {
                                        getFieldDecorator('express_is_pay', {
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
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="快递发货时间">
                                    {
                                        getFieldDecorator('express_start_date', {
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
                                }} className="form-item" label="快递取货时间">
                                    {
                                        getFieldDecorator('express_end_date', {
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
                                }} className="form-item" label="物流信息">
                                    {
                                        getFieldDecorator('express_logistics', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4}/>
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
                                }} className="form-item" label="状态">
                                    {
                                        getFieldDecorator('express_status', {
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
                                        getFieldDecorator('express_receiver_name', {
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
                                }} className="form-item" label="收货人手机">
                                    {
                                        getFieldDecorator('express_receiver_mobile', {
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
                                }} className="form-item" label="收货人省">
                                    {
                                        getFieldDecorator('express_receiver_province', {
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
                                }} className="form-item" label="收货人市">
                                    {
                                        getFieldDecorator('express_receiver_city', {
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
                                }} className="form-item" label="收货人区">
                                    {
                                        getFieldDecorator('express_receiver_area', {
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
                                }} className="form-item" label="收货人详细地址">
                                    {
                                        getFieldDecorator('express_receiver_address', {
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
                                }} className="form-item" label="备注">
                                    {
                                        getFieldDecorator('express_remark', {
                                            initialValue: ''
                                        })(
                                            <Input type="textarea" rows={4}/>
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

MemberStockOutDetail.propTypes = {};

MemberStockOutDetail = Form.create({})(MemberStockOutDetail);

export default MemberStockOutDetail;