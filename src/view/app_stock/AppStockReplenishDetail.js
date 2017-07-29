import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, InputNumber, Select, Table, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class AppStockReplenishDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            is_view: false,
            action: '',
            stock_replenish_id: '',
            stock_replenish_product_sku_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_app_stock_replenish_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                is_view: true,
                stock_replenish_id: data.stock_replenish_id
            });
            this.handleLoad(data.stock_replenish_id);
        });

        notification.on('notification_app_stock_replenish_detail_save', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_app_stock_replenish_detail_view', this);
        notification.remove('notification_app_stock_replenish_detail_save', this);
    }

    handleLoad(stock_replenish_id) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/stock/replenish/' + constant.action + '/find',
            data: {
                stock_replenish_id: stock_replenish_id,
            },
            success: function (data) {
                this.setState({
                    stock_replenish_product_sku_list: data.stock_replenish_product_sku_list
                });
                this.props.form.setFieldsValue({
                    warehouse_id: data.stock_replenish.warehouse_id,
                    stock_replenish_quantity: data.stock_replenish.stock_replenish_quantity,
                    stock_replenish_action: data.stock_replenish.stock_replenish_action
                })
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
            values.object_id = this.state.app_id;
            values.stock_replenish_product_sku_list = [
                {
                    product_sku_id: this.props.app_stock_replenish.product_list[0].productSkuList[0].product_sku_id,
                    product_sku_quantity: values.stock_replenish_quantity
                }
            ];
            delete values.stock_replenish_quantity;
            values.stock_replenish_type = this.props.app_stock_replenish.stock_replenish_type;
            this.setState({
                is_load: true
            });

            http.request({
                url: '/stock/replenish/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_app_stock_replenish_index_load', {});

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
            is_view: false,
            action: '',
            stock_replenish_id: '',
            stock_replenish_product_sku_list: []
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
            <Modal title={'公司报损报溢明细'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={this.state.is_view?[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>
                   ]:[
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
                                <FormItem {...{
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
                                            <Select allowClear>
                                                {
                                                    this.props.app_stock_replenish.warehouse_list.map(function (item) {
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
                        <Row>
                            <Col span={8}>
                                <FormItem {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="数量">
                                    {
                                        getFieldDecorator('stock_replenish_quantity', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={1} max={99999}/>
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
                                }} className="content-search-item" label="报损/报溢">
                                    {
                                        getFieldDecorator('stock_replenish_action', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear>
                                                <Option key={'BREAKAGE'} value={'BREAKAGE'}>报损</Option>
                                                <Option key={'OVERFLOW'} value={'OVERFLOW'}>报溢</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.is_view?<Table
                                rowKey="product_sku_id"
                                className="margin-top"
                                loading={this.state.is_load} columns={columns}
                                dataSource={this.state.stock_replenish_product_sku_list} pagination={false}
                                bordered/>:null
                        }
                    </form>
                </Spin>
            </Modal>
        );
    }
}

AppStockReplenishDetail.propTypes = {};

AppStockReplenishDetail = Form.create({})(AppStockReplenishDetail);

export default connect(({app_stock_replenish}) => ({app_stock_replenish}))(AppStockReplenishDetail);