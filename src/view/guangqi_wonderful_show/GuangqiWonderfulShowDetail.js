import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, InputNumber, Select, message} from 'antd';

import InputImage from '../../component/InputImage';
import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class GuangqiWonderfulShowDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            wonderful_show_id: '',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_guangqi_wonderful_show_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save'
            });
        });

        notification.on('notification_guangqi_wonderful_show_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                wonderful_show_id: data.wonderful_show_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_wonderful_show_detail_add', this);

        notification.remove('notification_guangqi_wonderful_show_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/wonderful/show/find',
            data: {
                wonderful_show_id: this.state.wonderful_show_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                let wonderful_show_cover_picture = [];
                if (data.wonderful_show_cover_picture_file !== null) {
                    wonderful_show_cover_picture.push(data.wonderful_show_cover_picture_file);
                }
                this.refs.wonderful_show_cover_picture.handleSetValue(wonderful_show_cover_picture);

                this.props.form.setFieldsValue({
                    wonderful_show_sort: data.wonderful_show_sort,
                    wonderful_show_video: data.wonderful_show_video
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

            let file_list = this.refs.wonderful_show_cover_picture.handleGetValue();
            if (file_list.length === 0) {
                values.wonderful_show_cover_picture = '';
            } else {
                values.wonderful_show_cover_picture = file_list[0].file_id;
            }

            values.wonderful_show_id = this.state.wonderful_show_id;
            values.system_version = this.state.system_version;

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/guangqi/wonderful/show/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_guangqi_wonderful_show_index_load', {});

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
            wonderful_show_id: '',
            system_version: ''
        });

        this.refs.wonderful_show_cover_picture.handleReset();
        this.props.form.resetFields();
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        return (
            <Modal title={'精彩展示详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                                            this.props.guangqi_wonderful_show.app_list.map(function (item) {
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
                                }} className="form-item" label="封面图片">
                                    <InputImage name="wonderful_show_cover_picture" limit={1} aspect={90 / 60} ref="wonderful_show_cover_picture"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="视频">
                                    {
                                        getFieldDecorator('wonderful_show_video', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '视频'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="排序">
                                    {
                                        getFieldDecorator('wonderful_show_sort', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: 0
                                        })(
                                            <InputNumber min={0} max={999} placeholder={constant.placeholder + '排序'} onPressEnter={this.handleSubmit.bind(this)}/>
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

GuangqiWonderfulShowDetail.propTypes = {};

GuangqiWonderfulShowDetail = Form.create({})(GuangqiWonderfulShowDetail);

export default connect(({guangqi_wonderful_show}) => ({guangqi_wonderful_show}))(GuangqiWonderfulShowDetail);