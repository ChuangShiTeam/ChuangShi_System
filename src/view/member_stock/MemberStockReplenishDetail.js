import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message, Table} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class MemberStockReplenishDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            is_view: false,
            action: '',
            stock_replenish_id: '',
            stock_replenish_product_sku_list: [],
            user_id: '',
            selectedRowKeys: [],
            user_name: '',
            total: 0,
            page_index: 1,
            page_size: 7,
            list: []
        }
    }

    componentDidMount() {
        notification.on('notification_member_stock_replenish_detail_view', this, function (data) {
            this.setState({
                is_show: true,
                is_view: true,
                stock_replenish_id: data.stock_replenish_id
            });
            this.handleLoad(data.stock_replenish_id);
        });

        notification.on('notification_member_stock_replenish_detail_save', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
            this.handleLoadMember();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_member_stock_replenish_detail_view', this);
        notification.remove('notification_member_stock_replenish_detail_save', this);
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
                    stock_replenish_action: data.stock_replenish.stock_replenish_action,
                    user_name: data.stock_replenish.user_name
                })
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            let user_name = this.props.form.getFieldValue('user_name');

            this.setState({
                user_name: user_name,
                page_index: 1
            });
            resolve();
        }.bind(this)).then(function () {
            this.handleLoadMember();
        }.bind(this));
    }

    handleLoadMember() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/member/list',
            data: {
                app_id: this.state.app_id,
                user_name: this.state.user_name,
                page_index: this.state.page_index,
                page_size: this.state.page_size
            },
            success: function (data) {
                this.setState({
                    total: data.total,
                    list: data.list
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleChangeIndex(page_index) {
        new Promise(function (resolve, reject) {
            this.setState({
                page_index: page_index
            });
            resolve();
        }.bind(this)).then(function () {
            this.handleLoadMember();
        }.bind(this));
    }

    handleChangeSize(page_index, page_size) {
        new Promise(function (resolve, reject) {
            this.setState({
                page_index: page_index,
                page_size: page_size
            });
            resolve();
        }.bind(this)).then(function () {
            this.handleLoadMember();
        }.bind(this));
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            if (!this.state.user_id) {
                message.warn('请选择会员');
                return;
            }
            values.object_id = this.state.user_id;
            values.stock_replenish_product_sku_list = [
                {
                    product_sku_id: this.props.member_stock_replenish.product_list[0].productSkuList[0].product_sku_id,
                    product_sku_quantity: values.stock_replenish_quantity
                }
            ];
            delete values.stock_replenish_quantity;
            values.stock_replenish_type = this.props.member_stock_replenish.stock_replenish_type;
            this.setState({
                is_load: true
            });

            http.request({
                url: '/stock/replenish/' + constant.action + '/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_member_stock_replenish_index_load', {});

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
            stock_replenish_product_sku_list: [],
            user_id: '',
            selectedRowKeys: [],
            user_name: '',
            total: 0,
            page_index: 1,
            page_size: 7,
            list: []
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columnsMember = [{
            title: '名称',
            dataIndex: 'user_name'
        }];

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    user_id: selectedRows[0].user_id,
                    selectedRowKeys: selectedRowKeys
                });
            },onSelect: (record, selected, selectedRows) => {
                if (record.user_id === this.state.user_id) {
                    this.setState({
                        user_id: '',
                        selectedRowKeys: []
                    });
                }
            },
            selectedRowKeys: this.state.selectedRowKeys,
            type: 'radio'
        };

        const pagination = {
            size: 'defalut',
            total: this.state.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.state.page_index,
            pageSize: this.state.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        const columnsProductSku = [{
            width: 150,
            title: '商品名称',
            dataIndex: 'product_name'
        }, {
            width: 150,
            title: '数量',
            dataIndex: 'product_sku_quantity'
        }];

        return (
            <Modal title={'会员报损报溢明细'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                        {
                            this.state.is_view?
                                null
                                :
                                <span>
                                    <Row key="0" className="content-title">
                                        <Col span={8}>
                                            <div className="">会员信息</div>
                                        </Col>
                                        <Col span={16} className="content-button">
                                            <Button type="default" icon="search" size="default" className="margin-right"
                                                    loading={this.state.is_load}
                                                    onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                                        </Col>
                                    </Row>
                                    <Row className="content-search margin-top">
                                        <Col span={8}>
                                            <FormItem hasFeedback {...{
                                                labelCol: {span: 6},
                                                wrapperCol: {span: 18}
                                            }} className="content-search-item" label="名称">
                                                {
                                                    getFieldDecorator('user_name', {
                                                        initialValue: ''
                                                    })(
                                                        <Input type="text" placeholder="请输入名称" onPressEnter={this.handleSearch.bind(this)}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                        </Col>
                                    </Row>
                                    <Table key="2"
                                           rowKey="member_id"
                                           className="margin-top"
                                           rowSelection={rowSelection}
                                           loading={this.state.is_load} columns={columnsMember}
                                           dataSource={this.state.list} pagination={pagination}
                                           bordered/>
                                </span>
                        }
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
                                loading={this.state.is_load} columns={columnsProductSku}
                                dataSource={this.state.stock_replenish_product_sku_list} pagination={false}
                                bordered/>:null
                        }
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MemberStockReplenishDetail.propTypes = {};

MemberStockReplenishDetail = Form.create({})(MemberStockReplenishDetail);

export default connect(({member_stock_replenish}) => ({member_stock_replenish}))(MemberStockReplenishDetail);