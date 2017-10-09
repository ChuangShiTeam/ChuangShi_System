import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message} from 'antd';

import InputHtml from '../../component/InputHtml';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';
import validate from '../../util/validate';

class MinhangPartySongDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            party_song_id: '',
            system_version: '',
            task_list: []
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_party_song_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                task_list: data.task_list
            });
        });

        notification.on('notification_minhang_party_song_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                party_song_id: data.party_song_id,
                task_list: data.task_list
            }, function () {
                setTimeout(function () {
                    this.handleLoad();
                }.bind(this), 300);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_party_song_detail_add', this);

        notification.remove('notification_minhang_party_song_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/party/song/find',
            data: {
                party_song_id: this.state.party_song_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.refs.party_song_content.handleSetValue(validate.unescapeHtml(data.party_song_content));
                this.props.form.setFieldsValue({
                    task_id: data.task_id,
                    party_song_content: data.party_song_content,
                    party_song_url: data.party_song_url
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

            values.party_song_id = this.state.party_song_id;
            values.system_version = this.state.system_version;
            values.party_song_content = this.refs.party_song_content.handleGetValue();

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/party/song/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_party_song_index_load', {});

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
            party_song_id: '',
            system_version: '',
            task_list: []
        });

        this.props.form.resetFields();
        this.refs.party_song_content.handleReset();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'党歌详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.minhang_party_song.app_list.map(function (item) {
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
                                }} className="form-item" label="语音地址">
                                    {
                                        getFieldDecorator('party_song_url', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '语音地址'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="内容">
                                    <InputHtml name="party_song_content" ref="party_song_content"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MinhangPartySongDetail.propTypes = {};

MinhangPartySongDetail = Form.create({})(MinhangPartySongDetail);

export default connect(({minhang_party_song}) => ({minhang_party_song}))(MinhangPartySongDetail);