import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message, DatePicker} from 'antd';
import moment from 'moment';

import InputHtml from '../../../component/InputHtml';
import constant from '../../../util/constant';
import notification from '../../../util/notification';
import http from '../../../util/http';
import validate from '../../../util/validate';

class MinhangTimelineEventDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            task_list: [],
            timeline_id: '',
            timeline_event_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_timeline_event_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                task_list: data.task_list,
                timeline_id: data.timeline_id
            });
        });

        notification.on('notification_minhang_timeline_event_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                timeline_event_id: data.timeline_event_id,
                task_list: data.task_list,
                timeline_id: data.timeline_id
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_timeline_event_detail_add', this);

        notification.remove('notification_minhang_timeline_event_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/timeline/event/find',
            data: {
                timeline_event_id: this.state.timeline_event_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }
                this.refs.timeline_event_content.handleSetValue(validate.unescapeHtml(data.timeline_event_content));

                this.props.form.setFieldsValue({
                    task_id: data.task_id,
                    timeline_event_time: data.timeline_event_time?moment(data.timeline_event_time):null,
                    timeline_event_title: data.timeline_event_title
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

            values.timeline_event_id = this.state.timeline_event_id;
            values.system_version = this.state.system_version;
            values.timeline_id = this.state.timeline_id;
            values.timeline_event_content = this.refs.timeline_event_content.handleGetValue();
            values.timeline_event_time = values.timeline_event_time.format('YYYY-MM-DD');
            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/timeline/event/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_timeline_event_index_load', {});

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
            task_list: [],
            time_line_id: '',
            timeline_event_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
        this.refs.timeline_event_content.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;
        const { TextArea } = Input;

        return (
            <Modal title={'事件详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.minhang_timeline_event.app_list.map(function (item) {
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
                                }} className="form-item" label="时间">
                                    {
                                        getFieldDecorator('timeline_event_time', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <DatePicker />
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
                                }} className="form-item" label="事件标题">
                                    {
                                        getFieldDecorator('timeline_event_title', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '事件标题'} onPressEnter={this.handleSubmit.bind(this)}/>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="事件内容">
                                    <InputHtml name="timeline_event_content" ref="timeline_event_content"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MinhangTimelineEventDetail.propTypes = {};

MinhangTimelineEventDetail = Form.create({})(MinhangTimelineEventDetail);

export default connect(({minhang_timeline_event}) => ({minhang_timeline_event}))(MinhangTimelineEventDetail);