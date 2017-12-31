import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import GuangqiNewYearCustomerDetail from './GuangqiNewYearCustomerDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class GuangqiNewYearCustomerIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.guangqi_new_year_customer.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            new_year_customer_car_model: this.props.guangqi_new_year_customer.new_year_customer_car_model,
            new_year_customer_name: this.props.guangqi_new_year_customer.new_year_customer_name,
            new_year_customer_phone: this.props.guangqi_new_year_customer.new_year_customer_phone,
            new_year_customer_province: this.props.guangqi_new_year_customer.new_year_customer_province,
            new_year_customer_city: this.props.guangqi_new_year_customer.new_year_customer_city,
            new_year_customer_dealer: this.props.guangqi_new_year_customer.new_year_customer_dealer,
            new_year_customer_from: this.props.guangqi_new_year_customer.new_year_customer_from,
        });

        this.handleLoad();

        notification.on('notification_guangqi_new_year_customer_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_new_year_customer_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_new_year_customer/fetch',
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
            var app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            let new_year_customer_car_model = this.props.form.getFieldValue('new_year_customer_car_model');
            let new_year_customer_name = this.props.form.getFieldValue('new_year_customer_name');
            let new_year_customer_phone = this.props.form.getFieldValue('new_year_customer_phone');
            let new_year_customer_province = this.props.form.getFieldValue('new_year_customer_province');
            let new_year_customer_city = this.props.form.getFieldValue('new_year_customer_city');
            let new_year_customer_dealer = this.props.form.getFieldValue('new_year_customer_dealer');
            let new_year_customer_from = this.props.form.getFieldValue('new_year_customer_from');

            this.props.dispatch({
                type: 'guangqi_new_year_customer/fetch',
                data: {
                    app_id: app_id,
                    new_year_customer_car_model: new_year_customer_car_model,
                    new_year_customer_name: new_year_customer_name,
                    new_year_customer_phone: new_year_customer_phone,
                    new_year_customer_province: new_year_customer_province,
                    new_year_customer_city: new_year_customer_city,
                    new_year_customer_dealer: new_year_customer_dealer,
                    new_year_customer_from: new_year_customer_from,
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
            url: '/' + constant.action + '/guangqi/new/year/customer/list',
            data: {
                app_id: this.props.guangqi_new_year_customer.app_id,
                new_year_customer_car_model: this.props.guangqi_new_year_customer.new_year_customer_car_model,
                new_year_customer_name: this.props.guangqi_new_year_customer.new_year_customer_name,
                new_year_customer_phone: this.props.guangqi_new_year_customer.new_year_customer_phone,
                new_year_customer_province: this.props.guangqi_new_year_customer.new_year_customer_province,
                new_year_customer_city: this.props.guangqi_new_year_customer.new_year_customer_city,
                new_year_customer_dealer: this.props.guangqi_new_year_customer.new_year_customer_dealer,
                new_year_customer_from: this.props.guangqi_new_year_customer.new_year_customer_from,
                page_index: this.props.guangqi_new_year_customer.page_index,
                page_size: this.props.guangqi_new_year_customer.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_new_year_customer/fetch',
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
                type: 'guangqi_new_year_customer/fetch',
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
                type: 'guangqi_new_year_customer/fetch',
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
        notification.emit('notification_guangqi_new_year_customer_detail_add', {});
    }

    handleEdit(new_year_customer_id) {
        notification.emit('notification_guangqi_new_year_customer_detail_edit', {
            new_year_customer_id: new_year_customer_id
        });
    }

    handleDel(new_year_customer_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/new/year/customer/delete',
            data: {
                new_year_customer_id: new_year_customer_id,
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
            title: '车型',
            dataIndex: 'new_year_customer_car_model'
        }, {
            title: '客户姓名',
            dataIndex: 'new_year_customer_name'
        }, {
            title: '手机号码',
            dataIndex: 'new_year_customer_phone'
        }, {
            title: '省份',
            dataIndex: 'new_year_customer_province'
        }, {
            title: '城市',
            dataIndex: 'new_year_customer_city'
        }, {
            title: '城市地址',
            dataIndex: 'new_year_customer_address'
        }, {
            title: '门店',
            dataIndex: 'new_year_customer_dealer'
        }, {
            title: '来源',
            dataIndex: 'new_year_customer_from'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.new_year_customer_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.new_year_customer_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.guangqi_new_year_customer.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.guangqi_new_year_customer.page_index,
            pageSize: this.props.guangqi_new_year_customer.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">客户信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this)}>{constant.add}</Button>
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
                                                        this.props.guangqi_new_year_customer.app_list.map(function (item) {
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
                            }} className="content-search-item" label="车型">
                                {
                                    getFieldDecorator('new_year_customer_car_model', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入车型" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="客户姓名">
                                {
                                    getFieldDecorator('new_year_customer_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入客户姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="手机号码">
                                {
                                    getFieldDecorator('new_year_customer_phone', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入手机号码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="省份">
                                {
                                    getFieldDecorator('new_year_customer_province', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入省份" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="城市">
                                {
                                    getFieldDecorator('new_year_customer_city', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入城市" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="门店">
                                {
                                    getFieldDecorator('new_year_customer_dealer', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入门店" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="来源">
                                {
                                    getFieldDecorator('new_year_customer_from', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入来源" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="new_year_customer_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.guangqi_new_year_customer.list} pagination={pagination}
                       bordered/>
                <GuangqiNewYearCustomerDetail/>
            </QueueAnim>
        );
    }
}

GuangqiNewYearCustomerIndex.propTypes = {};

GuangqiNewYearCustomerIndex = Form.create({})(GuangqiNewYearCustomerIndex);

export default connect(({guangqi_new_year_customer}) => ({
    guangqi_new_year_customer
}))(GuangqiNewYearCustomerIndex);