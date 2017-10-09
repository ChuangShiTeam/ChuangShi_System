import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, InputNumber, message, Icon} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class MinhangTaskDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            key_list: [],
            task_id: '',
            task: {},
            question: {},
            location_list: [],
            task_type: 'QUESTION',
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_task_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                key_list: data.key_list
            });
        });

        notification.on('notification_minhang_task_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                task_id: data.task_id,
                key_list: data.key_list
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_task_detail_add', this);

        notification.remove('notification_minhang_task_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/task/find',
            data: {
                task_id: this.state.task_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    key_id: data.key_id,
                    task_name: data.task_name,
                    task_type: data.task_type,
                    task_sort: data.task_sort,
                    task_description: data.task_description,
                });

                this.setState({
                    task: data,
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

            values.task_id = this.state.task_id;
            values.system_version = this.state.system_version;
            values.task_type = this.state.task_type;
            if (this.state.task_type === 'LOCATION') {
                values.locationList = [];
                for (let index = 0; index < values.locationKeys.length; index ++) {
                    if (!values['location_title-' + index]) {
                        message.warn('请完善标记位置信息！');
                        return;
                    }
                    var location = {
                        location_id: values['location_id-' + index],
                        location_title: values['location_title-' + index],
                        location_sort: index
                    };

                    values.locationList.push(location);
                    delete values['location_id-' + index];
                    delete values['location_title-' + index];
                }
            }

            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/task/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_task_index_load', {});

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
            task_id: '',
            system_version: ''
        });

        this.props.form.resetFields();
    }

    handleChangeType(value) {
        this.setState({
            task_type: value
        });
    }

    removeLocation = (index) => {
        const { form } = this.props;
        const locationKeys = form.getFieldValue('locationKeys');
        if (locationKeys.length === 1) {
            return;
        }
        form.setFieldsValue({
            locationKeys: locationKeys.filter((key, i) => i !== index)
        });
    };

    addLocation = () => {
        const { form } = this.props;
        const locationKeys = form.getFieldValue('locationKeys');

        const nextKeys = locationKeys.concat({
            location_id: null,
            location_name : null
        });
        form.setFieldsValue({
            locationKeys: nextKeys
        });
    };

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const { TextArea } = Input;
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 22, offset: 2 }
            }
        };
        this.state.location_list.length === 0?
            getFieldDecorator('locationKeys', { initialValue: [{
                location_id: null,
                location_title : null
            }] }):
            getFieldDecorator('locationKeys', { initialValue: this.state.location_list });
        const locationKeys = getFieldValue('locationKeys');
        const locationFormItems = locationKeys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    className="content-search-item"
                    required={false}
                    key={index}
                >
                    {getFieldDecorator(`location_id-${index}`,
                        { initialValue: k.location_id })
                    }
                    {getFieldDecorator(`location_title-${index}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "请输入位置标题"
                        }], initialValue: k.location_title
                    })(
                        <Input placeholder="位置标题" style={{ width: '60%', marginRight: 8 }}/>
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={locationKeys.length === 1}
                        onClick={() => this.removeLocation(index)}
                    />
                </FormItem>
            );
        });

        return (
            <Modal title={'详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
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
                                </Row>
                                :
                                ''
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="钥匙编号">
                                    {
                                        getFieldDecorator('key_id', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Select allowClear placeholder="请选择钥匙">
                                                {
                                                    this.state.key_list.map(function (item) {
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
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="任务名称">
                                    {
                                        getFieldDecorator('task_name', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <Input type="text" placeholder={constant.placeholder + '任务名称'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="任务类型">
                                    <Select allowClear placeholder="请选择任务类型" value={this.state.task_type} onChange={this.handleChangeType.bind(this)}>
                                        <Option key={'QUESTION'} value={'QUESTION'}>答题</Option>
                                        <Option key={'LOCATION'} value={'LOCATION'}>标记位置</Option>
                                        <Option key={'PICTURE'} value={'PICTURE'}>上传图片</Option>
                                        <Option key={'RECORD'} value={'RECORD'}>上传录音</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.task_type === 'QUESTION'?null:null
                        }
                        {
                            this.state.task_type === 'LOCATION'?
                                <span>
                                    <Row>
                                        <Col span={24}>
                                            {locationFormItems}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayoutWithOutLabel} className="form-item">
                                                <Button type="dashed" onClick={this.addLocation} style={{ width: '60%' }}>
                                                <Icon type="plus" /> 添加标记位置
                                                </Button>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </span>
                                :null
                        }
                        {
                            this.state.action === 'update'?<Row>
                                <Col span={8}>
                                    <FormItem hasFeedback {...{
                                        labelCol: {span: 6},
                                        wrapperCol: {span: 18}
                                    }} className="form-item" label="钥匙二维码">
                                        <div className="clearfix">
                                            <img alt="example" style={{ height: '200px' }}
                                                 src={constant.host + this.state.task.task_qrcode_url}/>
                                        </div>
                                    </FormItem>
                                </Col>
                            </Row>:null
                        }
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="排序">
                                    {
                                        getFieldDecorator('task_sort', {
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
                        <Row>
                            <Col span={8}>
                                <FormItem hasFeedback {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18}
                                }} className="form-item" label="任务简介">
                                    {
                                        getFieldDecorator('task_description', {
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '任务简介'} onPressEnter={this.handleSubmit.bind(this)}/>
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

MinhangTaskDetail.propTypes = {};

MinhangTaskDetail = Form.create({})(MinhangTaskDetail);

export default connect(({minhang_task}) => ({minhang_task}))(MinhangTaskDetail);