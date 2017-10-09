import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Form, Row, Col, Spin, Button, Input, Select, message,Icon} from 'antd';

import constant from '../../../util/constant';
import notification from '../../../util/notification';
import http from '../../../util/http';

class MinhangQuestionDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            question_id: '',
            task_id: '',
            question_type: 'GAP_FILLING',
            question_option_list: [],
            question_answer_list: [],
            system_version: ''
        }
    }

    componentDidMount() {
        notification.on('notification_minhang_question_detail_add', this, function (data) {
            this.setState({
                is_show: true,
                action: 'save',
                task_id: data.task_id
            });
        });

        notification.on('notification_minhang_question_detail_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                question_id: data.question_id,
                task_id: data.task_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_question_detail_add', this);

        notification.remove('notification_minhang_question_detail_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/question/find',
            data: {
                question_id: this.state.question_id
            },
            success: function (data) {
                if (constant.action === 'system') {
                    this.props.form.setFieldsValue({
                        app_id: data.app_id
                    });
                }

                this.props.form.setFieldsValue({
                    task_id: data.task_id,
                    question_title: data.question_title
                });

                this.setState({
                    question_option_list: data.question_option_list,
                    question_answer_list: data.question_answer_list,
                    question_type: data.question_type,
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

            values.question_id = this.state.question_id;
            values.system_version = this.state.system_version;
            values.task_id = this.state.task_id;
            values.question_type = this.state.question_type;
            values.question_option_list = [];
            if (this.state.question_type !== 'GAP_FILLING') {
                for (let index = 0; index < values.optionKeys.length; index ++) {
                    if (!values['question_option_key-' + index]
                        || !values['question_option_value-' + index]) {
                        message.warn('请完善题目选项信息！');
                        return;
                    }
                    var question_option = {
                        question_option_id: values['question_option_id-' + index],
                        question_option_key: values['question_option_key-' + index],
                        question_option_value: values['question_option_value-' + index],
                        question_option_sort: index
                    };

                    values.question_option_list.push(question_option);
                    delete values['question_option_id-' + index];
                    delete values['question_option_key-' + index];
                    delete values['question_option_value-' + index];
                }
            }
            values.question_answer_list = [];
            for (let index = 0; index < values.answerKeys.length; index ++) {
                if (!values['question_answer-' + index]) {
                    message.warn('请完善题目答案信息！');
                    return;
                }
                var question_answer = {
                    question_answer_id: values['question_answer_id-' + index],
                    question_answer: values['question_answer-' + index]
                };

                values.question_answer_list.push(question_answer);
                delete values['question_answer_id-' + index];
                delete values['question_answer-' + index];
            }
            this.setState({
                is_load: true
            });

            http.request({
                url: '/' + constant.action + '/minhang/question/' + this.state.action,
                data: values,
                success: function (data) {
                    message.success(constant.success);

                    notification.emit('notification_minhang_question_index_load', {});

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
            question_id: '',
            task_id: '',
            question_type: 'GAP_FILLING',
            question_option_list: [],
            question_answer_list: [],
            system_version: ''
        });

        this.props.form.resetFields();
    }

    removeOption = (index) => {
        const { form } = this.props;
        const optionKeys = form.getFieldValue('optionKeys');
        if (optionKeys.length === 1) {
            return;
        }
        form.setFieldsValue({
            optionKeys: optionKeys.filter((key, i) => i !== index)
        });
    };

    addOption = () => {
        const { form } = this.props;
        const optionKeys = form.getFieldValue('optionKeys');

        const nextKeys = optionKeys.concat({
            question_option_id: null,
            question_option_key : null,
            question_option_value : null
        });
        form.setFieldsValue({
            optionKeys: nextKeys
        });
    };

    removeAnswer = (index) => {
        const { form } = this.props;
        const answerKeys = form.getFieldValue('answerKeys');
        if (answerKeys.length === 1) {
            return;
        }
        form.setFieldsValue({
            answerKeys: answerKeys.filter((key, i) => i !== index)
        });
    };

    addAnswer = () => {
        const { form } = this.props;
        const answerKeys = form.getFieldValue('answerKeys');

        const nextKeys = answerKeys.concat({
            question_answer_id: null,
            question_answer : null
        });
        form.setFieldsValue({
            answerKeys: nextKeys
        });
    };

    handleChangeType(value) {
        console.log('value', value);
        this.setState({
            question_type: value
        });
    }

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
        this.state.question_option_list.length === 0?
            getFieldDecorator('optionKeys', { initialValue: [{
                question_option_id: null,
                question_option_key : null,
                question_option_value : null
            }] }):
            getFieldDecorator('optionKeys', { initialValue: this.state.question_option_list });
        const optionKeys = getFieldValue('optionKeys');
        const optionFormItems = optionKeys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    className="content-search-item"
                    required={false}
                    key={index}
                >
                    {getFieldDecorator(`question_option_id-${index}`,
                        { initialValue: k.question_option_id })
                    }
                    {getFieldDecorator(`question_option_key-${index}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "请输入选项标识"
                        }], initialValue: k.question_option_key
                    })(
                        <Input placeholder="选项标识" style={{ width: '10%', marginRight: 8 }}/>
                    )}
                    {getFieldDecorator(`question_option_value-${index}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "请输入选项内容"
                        }], initialValue: k.question_option_value
                    })(
                        <Input placeholder="选项内容" style={{ width: '50%', marginRight: 8 }}/>
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={optionKeys.length === 1}
                        onClick={() => this.removeOption(index)}
                    />
                </FormItem>
            );
        });

        this.state.question_answer_list.length === 0?
            getFieldDecorator('answerKeys', { initialValue: [{
                question_answer_id: null,
                question_answer : null,
            }] }):
            getFieldDecorator('answerKeys', { initialValue: this.state.question_answer_list });
        const answerKeys = getFieldValue('answerKeys');
        const answerFormItems = answerKeys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    className="content-search-item"
                    required={false}
                    key={index}
                >
                    {getFieldDecorator(`question_answer_id-${index}`,
                        { initialValue: k.question_answer_id })
                    }
                    {getFieldDecorator(`question_answer-${index}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "请输入题目答案"
                        }], initialValue: k.question_answer
                    })(
                        <TextArea rows={4} placeholder="题目答案" style={{ width: '60%', marginRight: 8 }}/>
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={answerKeys.length === 1}
                        onClick={() => this.removeAnswer(index)}
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
                                                            this.props.minhang_question.app_list.map(function (item) {
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
                                }} className="form-item" label="题目标题">
                                    {
                                        getFieldDecorator('question_title', {
                                            rules: [{
                                                required: true,
                                                message: constant.required
                                            }],
                                            initialValue: ''
                                        })(
                                            <TextArea rows={4} placeholder={constant.placeholder + '题目标题'} onPressEnter={this.handleSubmit.bind(this)}/>
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
                                }} className="form-item" label="题目类型">
                                    <Select allowClear placeholder="请选择题目类型" value={this.state.question_type} onChange={this.handleChangeType.bind(this)}>
                                        <Option key={'RADIO'} value={'RADIO'}>单选题</Option>
                                        <Option key={'CHECKBOX'} value={'CHECKBOX'}>多选题</Option>
                                        <Option key={'GAP_FILLING'} value={'GAP_FILLING'}>填空题</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            this.state.question_type !== 'GAP_FILLING'?
                                <span>
                                    <Row>
                                        <Col span={24}>
                                            {optionFormItems}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <FormItem {...formItemLayoutWithOutLabel} className="form-item">
                                                <Button type="dashed" onClick={this.addOption} style={{ width: '60%' }}>
                                                <Icon type="plus" /> 添加题目选项
                                                </Button>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </span>:null
                        }
                        <span>
                            <Row>
                                <Col span={24}>
                                    {answerFormItems}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...formItemLayoutWithOutLabel} className="form-item">
                                        <Button type="dashed" onClick={this.addAnswer} style={{ width: '60%' }}>
                                        <Icon type="plus" /> 添加题目答案
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </span>
                    </form>
                </Spin>
            </Modal>
        );
    }
}

MinhangQuestionDetail.propTypes = {};

MinhangQuestionDetail = Form.create({})(MinhangQuestionDetail);

export default connect(({minhang_question}) => ({minhang_question}))(MinhangQuestionDetail);