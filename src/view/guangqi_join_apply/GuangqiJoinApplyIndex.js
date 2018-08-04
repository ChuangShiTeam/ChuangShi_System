import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import GuangqiJoinApplyDetail from './GuangqiJoinApplyDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class GuangqiJoinApplyIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.guangqi_join_apply.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            join_apply_customer_name: this.props.guangqi_join_apply.join_apply_customer_name,
            join_apply_customer_phone: this.props.guangqi_join_apply.join_apply_customer_phone,
        });

        this.handleLoad();

        notification.on('notification_guangqi_join_apply_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_join_apply_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_join_apply/fetch',
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

            let join_apply_customer_name = this.props.form.getFieldValue('join_apply_customer_name');
            let join_apply_customer_phone = this.props.form.getFieldValue('join_apply_customer_phone');

            this.props.dispatch({
                type: 'guangqi_join_apply/fetch',
                data: {
                    app_id: app_id,
                    join_apply_customer_name: join_apply_customer_name,
                    join_apply_customer_phone: join_apply_customer_phone,
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
            url: '/' + constant.action + '/guangqi/join/apply/list',
            data: {
                app_id: this.props.guangqi_join_apply.app_id,
                join_apply_customer_name: this.props.guangqi_join_apply.join_apply_customer_name,
                join_apply_customer_phone: this.props.guangqi_join_apply.join_apply_customer_phone,
                page_index: this.props.guangqi_join_apply.page_index,
                page_size: this.props.guangqi_join_apply.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_join_apply/fetch',
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
                type: 'guangqi_join_apply/fetch',
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
                type: 'guangqi_join_apply/fetch',
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
        notification.emit('notification_guangqi_join_apply_detail_add', {});
    }

    handleEdit(join_apply_id) {
        notification.emit('notification_guangqi_join_apply_detail_edit', {
            join_apply_id: join_apply_id
        });
    }

    handleDel(join_apply_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/join/apply/delete',
            data: {
                join_apply_id: join_apply_id,
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
        window.open(constant.host + '/admin/guangqi/join/apply/all/export')
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '客户姓名',
            dataIndex: 'join_apply_customer_name'
        }, {
            title: '手机号码',
            dataIndex: 'join_apply_customer_phone'
        }, {
            title: '邮箱',
            dataIndex: 'join_apply_customer_email'
        }, {
            title: '意向城市',
            dataIndex: 'join_apply_city'
        }, {
            title: '投资金额',
            dataIndex: 'join_apply_investment'
        }, {
            title: '申请时间',
            dataIndex: 'system_create_time'
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.guangqi_join_apply.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.guangqi_join_apply.page_index,
            pageSize: this.props.guangqi_join_apply.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">加盟申请信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="file-excel" size="default" className="margin-right"
                                onClick={this.handleExcel.bind(this)}>导出加盟申请</Button>
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
                                                        this.props.guangqi_join_apply.app_list.map(function (item) {
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
                            }} className="content-search-item" label="客户姓名">
                                {
                                    getFieldDecorator('join_apply_customer_name', {
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
                                    getFieldDecorator('join_apply_customer_phone', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入手机号码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="join_apply_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.guangqi_join_apply.list} pagination={pagination}
                       bordered/>
                <GuangqiJoinApplyDetail/>
            </QueueAnim>
        );
    }
}

GuangqiJoinApplyIndex.propTypes = {};

GuangqiJoinApplyIndex = Form.create({})(GuangqiJoinApplyIndex);

export default connect(({guangqi_join_apply}) => ({
    guangqi_join_apply
}))(GuangqiJoinApplyIndex);