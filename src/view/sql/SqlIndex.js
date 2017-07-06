import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Table, message} from 'antd';

import SqlDetail from './SqlDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class SqlIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            app_id: this.props.sql.app_id
        });

        this.handleLoad();

        this.handleLoadApp();

        notification.on('notification_sql_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_sql_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'sql/fetch',
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

            this.props.dispatch({
                type: 'sql/fetch',
                data: {
                    app_id: app_id,
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
            url: '/sql/' + constant.action + '/list',
            data: {
                app_id: this.props.sql.app_id,
                page_index: this.props.sql.page_index,
                page_size: this.props.sql.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'sql/fetch',
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
                type: 'sql/fetch',
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
                type: 'sql/fetch',
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
        notification.emit('notification_sql_detail_add', {});
    }

    handleEdit(sql_id) {
        notification.emit('notification_sql_detail_edit', {
            sql_id: sql_id
        });
    }

    handleDel(sql_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/sql/' + constant.action + '/delete',
            data: {
                sql_id: sql_id,
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
            title: '数据表',
            dataIndex: 'sql_table'
        }, {
            width: 200,
            title: '动作',
            dataIndex: 'sql_action'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.sql_id)}>{constant.find}</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.sql.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.sql.page_index,
            pageSize: this.props.sql.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">SQL信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="primary" icon="search" size="default"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
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
                                                this.props.sql.app_list.map(function (item) {
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
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="sql_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.sql.list} pagination={pagination}
                       bordered/>
                <SqlDetail/>
            </QueueAnim>
        );
    }
}

SqlIndex.propTypes = {};

SqlIndex = Form.create({})(SqlIndex);

export default connect(({sql}) => ({sql}))(SqlIndex);