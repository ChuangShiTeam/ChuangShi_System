import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message} from 'antd';

import InputHtml from '../../component/InputHtml';
import InputImage from '../../component/InputImage';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class MinhangTimelineDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            timeline_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_timeline_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_minhang_timeline_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                timeline_id: data.timeline_id
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_timeline_detail_add', this);

        notification.remove('notification_minhang_timeline_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/timeline/find',
            data: {
                timeline_id: this.state.timeline_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }
                let timeline_image = [];
                if (data.timeline_image_file !== null) {
                    timeline_image.push(data.timeline_image_file);
                }
                this.refs.timeline_image.handleSetValue(timeline_image);
                this.refs.timeline_description.handleSetValue(data.timeline_description);
                this.props.form.setFieldsValue({
                    timeline_year: data.timeline_year
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

            values.timeline_id = this.state.timeline_id;
            values.system_version = this.state.system_version;

            let file_list = this.refs.timeline_image.handleGetValue();
            if (file_list.length === 0) {
                values.timeline_image = '';
            } else {
                values.timeline_image = file_list[0].file_id;
            }
            values.timeline_description = this.refs.timeline_description.handleGetValue();

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/timeline/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_timeline_index_load', {});

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
            timeline_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
        this.refs.timeline_image.handleReset();
        this.refs.timeline_description.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'时间轴详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.minhang_timeline.app_list.map(function (item) {
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
                                }} className="form-item" label="年份">
                                    {
                                        getFieldDecorator('timeline_year', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '年份'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="图片">
                                    <InputImage name="timeline_image" limit={1} aspect={90 / 60} ref="timeline_image"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 2},
                                    wrapperCol: {span: 22}
                                }} className="form-item" label="描述">
                                    <InputHtml name="timeline_description" ref="timeline_description"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MinhangTimelineDetail.propTypes = {};

MinhangTimelineDetail = Form.create({})(MinhangTimelineDetail);

export default connect(({minhang_timeline}) => ({minhang_timeline}))(MinhangTimelineDetail);