import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, InputNumber, Select, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class MemberStockReplenishDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            stock_in_id: '',
            stock_in_product_sku_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_member_stock_replenish_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                stock_in_id: data.stock_in_id
            });
            this.handleLoad(data.stock_in_id);
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_replenish_detail_view', this);
    }

    handleLoad(stock_in_id) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/stock/in/' + constant.action + '/find',
            data: {
                stock_in_id: stock_in_id,
            },
            success: function (data) {
                this.setState({
                    stock_in_product_sku_list: data.stock_in_product_sku_list
                });
                this.props.form.setFieldsValue({
                    warehouse_id: data.stock_in.warehouse_id,
                    stock_in_quantity: data.stock_in.stock_in_quantity
                })
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
            stock_in_id: '',
            stock_in_product_sku_list: []
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
            <Modal title={'公司入库单明细'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>
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
                                            initialValue: ''
                                        })(
                                            <Select allowClear>
                                                {
                                                    this.props.member_stock_replenish.warehouse_list.map(function (item) {
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
                                        getFieldDecorator('stock_in_quantity', {
                                            initialValue: 0
                                        })(
                                            <InputNumber />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Table
                            rowKey="product_sku_id"
                            className="margin-top"
                            loading={this.state.is_load} columns={columns}
                            dataSource={this.state.stock_in_product_sku_list} pagination={false}
                            bordered/>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MemberStockReplenishDetail.propTypes = {};

MemberStockReplenishDetail = Form.create({})(MemberStockReplenishDetail);

export default connect(({member_stock_replenish}) => ({member_stock_replenish}))(MemberStockReplenishDetail);