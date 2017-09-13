import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import PageDetail from './PageDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class PageIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.page.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            page_name: this.props.page.page_name,
        });

        this.handleLoad();

        notification.on('notification_page_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_page_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'page/fetch',
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

            let page_name = this.props.form.getFieldValue('page_name');

            this.props.dispatch({
                type: 'page/fetch',
                data: {
                    app_id: app_id,
                    page_name: page_name,
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
            url: '/' + constant.action + '/page/list',
            data: {
                app_id: this.props.page.app_id,
                page_name: this.props.page.page_name,
                page_index: this.props.page.page_index,
                page_size: this.props.page.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'page/fetch',
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
                type: 'page/fetch',
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
                type: 'page/fetch',
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
        notification.emit('notification_page_detail_add', {});
    }

    handleEdit(page_id) {
        notification.emit('notification_page_detail_edit', {
            page_id: page_id
        });
    }

    handleAllWrite() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/page/all/write',
            data: {

            },
            success: function (data) {
                message.success(constant.success);
            },
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleWrite(page_id) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/page/write',
            data: {
                page_id: page_id
            },
            success: function (data) {
                message.success(constant.success);
            },
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleDel(page_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/page/delete',
            data: {
                page_id: page_id,
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
            title: '单页名称',
            dataIndex: 'page_name'
        }, {
            title: '单页模板',
            dataIndex: 'page_template'
        }, {
            title: '单页地址',
            dataIndex: 'page_url'
        }, {
            title: '单页排序',
            dataIndex: 'page_sort'
        }, {
            width: 135,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.page_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <a onClick={this.handleWrite.bind(this, record.page_id)}>生成</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.page_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.page.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.page.page_index,
            pageSize: this.props.page.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">单页信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="export" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleAllWrite.bind(this)}>全部生成</Button>
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
                                                        this.props.page.app_list.map(function (item) {
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
                            }} className="content-search-item" label="单页名称">
                                {
                                    getFieldDecorator('page_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入单页名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="page_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.page.list} pagination={pagination}
                       bordered/>
                <PageDetail/>
            </QueueAnim>
        );
    }
}

PageIndex.propTypes = {};

PageIndex = Form.create({})(PageIndex);

export default connect(({page}) => ({
    page
}))(PageIndex);