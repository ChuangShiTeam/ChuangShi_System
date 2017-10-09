import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import MinhangQuestionDetail from './MinhangQuestionDetail';
import constant from '../../../util/constant';
import notification from '../../../util/notification';
import validate from '../../../util/validate';
import http from '../../../util/http';

class MinhangQuestionIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.minhang_question.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            question_title: this.props.minhang_question.question_title,
            question_type: this.props.minhang_question.question_type,
        });

        this.handleLoad();

        notification.on('notification_minhang_question_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_question_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_question/fetch',
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

            let question_title = this.props.form.getFieldValue('question_title');
            let question_type = this.props.form.getFieldValue('question_type');

            this.props.dispatch({
                type: 'minhang_question/fetch',
                data: {
                    app_id: app_id,
                    question_title: question_title,
                    question_type: question_type,
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
            url: '/' + constant.action + '/minhang/question/list',
            data: {
                app_id: this.props.minhang_question.app_id,
                task_id: this.props.params.task_id,
                question_title: this.props.minhang_question.question_title,
                question_type: this.props.minhang_question.question_type,
                page_index: this.props.minhang_question.page_index,
                page_size: this.props.minhang_question.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_question/fetch',
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
                type: 'minhang_question/fetch',
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
                type: 'minhang_question/fetch',
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
        notification.emit('notification_minhang_question_detail_add', {
            task_id: this.props.params.task_id
        });
    }

    handleEdit(question_id) {
        notification.emit('notification_minhang_question_detail_edit', {
            question_id: question_id,
            task_id: this.props.params.task_id
        });
    }

    handleDel(question_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/question/delete',
            data: {
                question_id: question_id,
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
            title: '题目标题',
            dataIndex: 'question_title'
        }, {
            title: '题目类型',
            dataIndex: 'question_type',
            render: (text, record, index) => (
                <span>
                    {text === 'RADIO'?'单选题':text === 'CHECKBOX'?'多选题':text === 'GAP_FILLING'?'填空题':''}
                </span>
            )
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.question_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.question_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.minhang_question.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.minhang_question.page_index,
            pageSize: this.props.minhang_question.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">信息</div>
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
                                :
                                ''
                        }
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="题目标题">
                                {
                                    getFieldDecorator('question_title', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入题目标题" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="题目类型">
                                {
                                    getFieldDecorator('question_type', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选择题目类型">
                                            <Option key={'RADIO'} value={'RADIO'}>单选题</Option>
                                            <Option key={'CHECKBOX'} value={'CHECKBOX'}>多选题</Option>
                                            <Option key={'GAP_FILLING'} value={'GAP_FILLING'}>填空题</Option>
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
                       rowKey="question_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.minhang_question.list} pagination={pagination}
                       bordered/>
                <MinhangQuestionDetail/>
            </QueueAnim>
        );
    }
}

MinhangQuestionIndex.propTypes = {};

MinhangQuestionIndex = Form.create({})(MinhangQuestionIndex);

export default connect(({minhang_question}) => ({
    minhang_question
}))(MinhangQuestionIndex);