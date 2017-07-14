import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import BillDetail from './BillDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class BillIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.bill.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            bill_name: this.props.bill.bill_name
        });

        this.handleLoad();

        notification.on('notification_bill_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_bill_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'bill/fetch',
                    data: {
                        app_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            let app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            let bill_name = this.props.form.getFieldValue('bill_name');

            this.props.dispatch({
                type: 'bill/fetch',
                data: {
                    app_id: app_id,
                    bill_name: bill_name,
                    page_index: 1
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/bill/' + constant.action + '/list',
            data: {
                app_id: this.props.bill.app_id,
                bill_name: this.props.bill.bill_name,
                page_index: this.props.bill.page_index,
                page_size: this.props.bill.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'bill/fetch',
                    data: {
                        total: data.total,
                        list: data.list
                    }
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
            this.props.dispatch({
                type: 'bill/fetch',
                data: {
                    page_index: page_index
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleChangeSize(page_index, page_size) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'bill/fetch',
                data: {
                    page_index: page_index,
                    page_size: page_size
                }
            });

            resolve();
        }.bind(this)).then(function () {
            this.handleLoad();
        }.bind(this));
    }

    handleAdd() {
        notification.emit('notification_bill_detail_add', {});
    }

    handleEdit(bill_id) {
        notification.emit('notification_bill_detail_edit', {
            bill_id: bill_id
        });
    }

    handleDel(bill_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/bill/' + constant.action + '/delete',
            data: {
                bill_id: bill_id,
                system_version: system_version
            },
            success: function (data) {
                message.success(constant.success);

                this.handleLoad();
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const columns = [{
            title: '用户名称',
            dataIndex: 'user_name'
        }, {
            title: '账单类型',
            dataIndex: 'bill_type'
        }, {
            width: 100,
            title: '账单图片',
            dataIndex: 'bill_image',
            render: (text, record, index) => (
                <div className="clearfix">
                    <img alt="example" style={{ width: '100%' }} src={record.bill_image}/>
                </div>
            )
        }, {
            title: '账单名称',
            dataIndex: 'bill_name'
        }, {
            title: '账单金额',
            dataIndex: 'bill_amount'
        }, {
            title: '是否收入',
            dataIndex: 'bill_is_income',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.bill_is_income ? '收入' : '支出'}
                </div>
            )
        }, {
            title: '账单时间',
            dataIndex: 'bill_time'
        }, {
            title: '账单流程',
            dataIndex: 'bill_flow',
            render: (text, record, index) => (
                <span>{record.bill_flow == "COMPLETE" ? '已完成' : ''}</span>
            )
        }, {
            title: '账单状态',
            dataIndex: 'bill_status',
            render: (text, record, index) => (
                <div className="clearfix">
                    {record.bill_status ? '正常' : '异常'}
                </div>
            )
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.bill_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.bill.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.bill.page_index,
            pageSize: this.props.bill.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
                        {
                            constant.action === 'system' ?
                                <Col span={8}>
                                    <FormItem hasFeedback {...{
                                        labelCol: {span: 6},
                                        wrapperCol: {span: 18}
                                    }} className="content-search-item" label="应用名称">
                                        {
                                            getFieldDecorator('app_id', {
                                                initialValue: ''
                                            })(
                                                <Select allowClear placeholder="请选择应用">
                                                    {
                                                        this.props.bill.app_list.map(function (item) {
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
                                :
                                ''
                        }
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="账单名称">
                                {
                                    getFieldDecorator('bill_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入账单名称"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="bill_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.bill.list} pagination={pagination}
                       bordered/>
                <BillDetail/>
            </QueueAnim>
        );
    }
}

BillIndex.propTypes = {};

BillIndex = Form.create({})(BillIndex);

export default connect(({bill}) => ({
    bill
}))(BillIndex);