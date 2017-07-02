import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Input, Table, message} from 'antd';

import GuangqiCustomerDetail from './GuangqiCustomerDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class GuangqiCustomerIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            customer_name: this.props.guangqi_customer.customer_name
        });

        this.handleLoad();

        notification.on('notification_guangqi_customer_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_customer_index_load', this);
    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'guangqi_customer/fetch',
                data: {
                    customer_name: this.props.form.getFieldValue('customer_name'),
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
            url: '/guangqi/customer/admin/list',
            data: {
                customer_name: this.props.guangqi_customer.customer_name,
                page_index: this.props.guangqi_customer.page_index,
                page_size: this.props.guangqi_customer.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_customer/fetch',
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
                type: 'guangqi_customer/fetch',
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
                type: 'guangqi_customer/fetch',
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
        notification.emit('notification_guangqi_customer_detail_add', {});
    }

    handleEdit(customer_id) {
        notification.emit('notification_guangqi_customer_detail_edit', {
            customer_id: customer_id
        });
    }

    handleDel(customer_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/guangqi/customer/admin/delete',
            data: {
                customer_id: customer_id,
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

    handleExcel() {
        window.open(constant.host + '/guangqi/export')
    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '姓名',
            dataIndex: 'customer_name'
        }, {
            width: 100,
            title: '电话',
            dataIndex: 'customer_phone'
        }, {
            width: 100,
            title: '省份',
            dataIndex: 'customer_province'
        }, {
            width: 100,
            title: '城市',
            dataIndex: 'customer_city'
        }, {
            width: 250,
            title: '经销商',
            dataIndex: 'costomer_dealer'
        }, {
            width: 130,
            title: '时间',
            dataIndex: 'system_create_time'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.customer_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.guangqi_customer.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.guangqi_customer.page_index,
            pageSize: this.props.guangqi_customer.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">留资管理</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="file-excel" size="default"
                                onClick={this.handleExcel.bind(this)}>导出中奖名单</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="客户姓名">
                                {
                                    getFieldDecorator('customer_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入客户姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="customer_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.guangqi_customer.list} pagination={pagination}
                       bordered/>
                <GuangqiCustomerDetail/>
            </QueueAnim>
        );
    }
}

GuangqiCustomerIndex.propTypes = {};

GuangqiCustomerIndex = Form.create({})(GuangqiCustomerIndex);

export default connect(({guangqi_customer}) => ({guangqi_customer}))(GuangqiCustomerIndex);