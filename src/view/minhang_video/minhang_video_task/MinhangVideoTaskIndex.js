import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Table, Popconfirm, message} from 'antd';

import MinhangVideoTaskDetail from './MinhangVideoTaskDetail';
import constant from '../../../util/constant';
import notification from '../../../util/notification';
import validate from '../../../util/validate';
import http from '../../../util/http';

class MinhangVideoTaskIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.minhang_video_task.app_id
            });

            this.handleLoadApp();
        }

        this.handleLoad();
        this.handleLoadTask();

        notification.on('notification_minhang_video_task_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_video_task_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_video_task/fetch',
                    data: {
                        app_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleLoadTask() {
        http.request({
            url: '/' + constant.action + '/minhang/task/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_video_task/fetch',
                    data: {
                        task_list: data
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
                type: 'minhang_video_task/fetch',
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
            url: '/' + constant.action + '/minhang/video/task/list',
            data: {
                app_id: this.props.minhang_video_task.app_id,
                video_id: this.props.params.video_id,
                page_index: this.props.minhang_video_task.page_index,
                page_size: this.props.minhang_video_task.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_video_task/fetch',
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
                type: 'minhang_video_task/fetch',
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
                type: 'minhang_video_task/fetch',
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
        notification.emit('notification_minhang_video_task_detail_add', {
            video_id: this.props.params.video_id,
            task_list: this.props.minhang_video_task.task_list
        });
    }

    handleEdit(video_task_id) {
        notification.emit('notification_minhang_video_task_detail_edit', {
            video_task_id: video_task_id,
            video_id: this.props.params.video_id,
            task_list: this.props.minhang_video_task.task_list
        });
    }

    handleDel(video_task_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/video/task/delete',
            data: {
                video_task_id: video_task_id,
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
            title: '视频触发任务时间(秒)',
            dataIndex: 'video_task_time'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.video_task_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.video_task_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.minhang_video_task.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.minhang_video_task.page_index,
            pageSize: this.props.minhang_video_task.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">视频任务信息</div>
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
                                                        this.props.minhang_video_task.app_list.map(function (item) {
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
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="video_task_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.minhang_video_task.list} pagination={pagination}
                       bordered/>
                <MinhangVideoTaskDetail/>
            </QueueAnim>
        );
    }
}

MinhangVideoTaskIndex.propTypes = {};

MinhangVideoTaskIndex = Form.create({})(MinhangVideoTaskIndex);

export default connect(({minhang_video_task}) => ({
    minhang_video_task
}))(MinhangVideoTaskIndex);