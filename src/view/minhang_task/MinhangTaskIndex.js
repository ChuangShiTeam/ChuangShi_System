import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import MinhangTaskDetail from './MinhangTaskDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class MinhangTaskIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.minhang_task.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            key_id: this.props.minhang_task.key_id,
            task_name: this.props.minhang_task.task_name,
            task_type: this.props.minhang_task.task_type,
        });

        this.handleLoad();
        this.handleLoadKey();

        notification.on('notification_minhang_task_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_task_index_load', this);
    }

    handleLoadKey() {
        http.request({
            url: '/' + constant.action + '/minhang/key/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_task/fetch',
                    data: {
                        key_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_task/fetch',
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

            let key_id = this.props.form.getFieldValue('key_id');
            let task_name = this.props.form.getFieldValue('task_name');
            let task_type = this.props.form.getFieldValue('task_type');

            if (typeof(task_type) === 'undefined') {
                task_type = '';
            }

            this.props.dispatch({
                type: 'minhang_task/fetch',
                data: {
                    app_id: app_id,
                    key_id: key_id,
                    task_name: task_name,
                    task_type: task_type,
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
            url: '/' + constant.action + '/minhang/task/list',
            data: {
                app_id: this.props.minhang_task.app_id,
                key_id: this.props.minhang_task.key_id,
                task_name: this.props.minhang_task.task_name,
                task_type: this.props.minhang_task.task_type,
                page_index: this.props.minhang_task.page_index,
                page_size: this.props.minhang_task.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_task/fetch',
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
                type: 'minhang_task/fetch',
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
                type: 'minhang_task/fetch',
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
        notification.emit('notification_minhang_task_detail_add', {key_list: this.props.minhang_task.key_list});
    }

    handleEdit(task_id) {
        notification.emit('notification_minhang_task_detail_edit', {
            task_id: task_id,
            key_list: this.props.minhang_task.key_list
        });
    }

    handleDel(task_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/task/delete',
            data: {
                task_id: task_id,
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

    handleQuestion(task_id) {
        this.props.dispatch(routerRedux.push({
            pathname: '/minhang/task/question/index/' + task_id,
            query: {}
        }));
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '钥匙名称',
            dataIndex: 'key_name'
        }, {
            title: '屏幕id',
            dataIndex: 'screen_id'
        }, {
            title: '任务名称',
            dataIndex: 'task_name'
        }, {
            title: '任务类型',
            dataIndex: 'task_type',
            render: (text, record, index) => (
                <span>
                    {text === 'QUESTION'?'答题':text === 'PICTURE'?'上传图片':text === 'RECORD'?'上传录音':''}
                </span>
            )
        }, {
            title: '任务二维码',
            dataIndex: 'task_qrcode_url',
            render: (text, record, index) => (
                <div className="clearfix">
                    <img alt="example" style={{ height: '83px' }} src={constant.host + record.task_qrcode_url}/>
                </div>
            )
        }, {
            title: '排序',
            dataIndex: 'task_sort'
        }, {
            width: 200,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.task_id)}>{constant.edit}</a>
                    {
                        record.task_type === 'QUESTION'?<span>
                             <span className="divider"/>
                            <a onClick={this.handleQuestion.bind(this, record.task_id)}>题目管理</a>
                        </span>:null
                    }
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.task_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.minhang_task.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.minhang_task.page_index,
            pageSize: this.props.minhang_task.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">任务信息</div>
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
                                                        this.props.minhang_task.app_list.map(function (item) {
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
                            }} className="content-search-item" label="钥匙">
                                {
                                    getFieldDecorator('key_id', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择钥匙">
                                            {
                                                this.props.minhang_task.key_list.map(function (item) {
                                                    return (
                                                        <Option key={item.key_id}
                                                                value={item.key_id}>{item.key_name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="任务名称">
                                {
                                    getFieldDecorator('task_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入任务名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="任务类型">
                                {
                                    getFieldDecorator('task_type', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择任务类型">
                                            <Option key={'QUESTION'} value={'QUESTION'}>答题</Option>
                                            <Option key={'PICTURE'} value={'PICTURE'}>上传图片</Option>
                                            <Option key={'RECORD'} value={'RECORD'}>上传录音</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="task_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.minhang_task.list} pagination={pagination}
                       bordered/>
                <MinhangTaskDetail/>
            </QueueAnim>
        );
    }
}

MinhangTaskIndex.propTypes = {};

MinhangTaskIndex = Form.create({})(MinhangTaskIndex);

export default connect(({minhang_task}) => ({
    minhang_task
}))(MinhangTaskIndex);