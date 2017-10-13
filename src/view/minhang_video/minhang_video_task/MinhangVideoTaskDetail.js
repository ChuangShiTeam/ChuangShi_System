import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message} from 'antd';

import constant from '../../../util/constant';
import notification from '../../../util/notification';
import http from '../../../util/http';

class MinhangVideoTaskDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            video_id: '',
            task_list: [],
            video_task_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_video_task_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                video_id: data.video_id,
                task_list: data.task_list
            });
        });

        notification.on('notification_minhang_video_task_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                video_id: data.video_id,
                task_list: data.task_list,
                video_task_id: data.video_task_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_video_task_detail_add', this);

        notification.remove('notification_minhang_video_task_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/video/task/find',
            data: {
                video_task_id: this.state.video_task_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    task_id: data.task_id,
                    video_task_time: data.video_task_time
                });

                this.setState({
                    system_version: data.system_version
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }

            values.video_task_id = this.state.video_task_id;
            values.system_version = this.state.system_version;
            values.video_id = this.state.video_id;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/video/task/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_video_task_index_load', {});

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
            action: '',
            video_id: '',
            task_list: [],
            video_task_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'视频任务详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
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
                            constant.action === 'system' ?
                                <Row>
                                    <Col span={8}>
                                        <FormItem hasFeedback {...{
                                            labelCol: {span: 6},
                                            wrapperCol: {span: 18}
                                        }} className="content-search-item" label="应用名称">
                                            {
                                                getFieldDecorator('app_id', {
                                                    rules: [{
                                                        required: true,
                                                        message: constant.required
                                                    }],
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
                                </Row>
                                :
                                ''
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="任务">
                                    {
                                        getFieldDecorator('task_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择任务">
                                                {
                                                    this.state.task_list.map(function (item) {
                                                        return (
                                                            <Option key={item.task_id}
                                                                    value={item.task_id}>{item.task_name}</Option>
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
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="视频触发任务时间(秒)">
                                    {
                                        getFieldDecorator('video_task_time', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={99999} placeholder={constant.placeholder + '视频触发任务时间(秒)'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MinhangVideoTaskDetail.propTypes = {};

MinhangVideoTaskDetail = Form.create({})(MinhangVideoTaskDetail);

export default connect(({minhang_video_task}) => ({minhang_video_task}))(MinhangVideoTaskDetail);