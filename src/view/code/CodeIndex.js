import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Form, Row, Col, Button, Input, Table, message} from 'antd';

import constant from '../../util/constant';
import http from '../../util/http';

class CodeIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            table_name: this.props.code.table_name
        });

        this.handleLoad();
    }

    componentWillUnmount() {

    }

    handleSearch() {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'code/fetch',
                data: {
                    table_name: this.props.form.getFieldValue('table_name'),
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
            url: '/code/' + constant.action + '/list',
            data: {
                table_name: this.props.code.table_name
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'code/fetch',
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
                type: 'code/fetch',
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
                type: 'code/fetch',
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

    }

    handleEdit(table_name) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/code/' + constant.action + '/save',
            data: {
                table_name: table_name
            },
            success: function (data) {
                message.success("操作成功");
            },
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleDelete(code_id) {

    }

    render() {
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '数据库名称',
            dataIndex: 'table_name'
        }, {
            width: 90,
            title: '操作',
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.table_name)}>执行</a>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.code.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.code.page_index,
            pageSize: this.props.code.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">代码生成</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="primary" icon="search" size="default" className=""
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>搜索</Button>
                    </Col>
                </Row>
                <Form key="1" className="content-search margin-top">
                    <Row>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="名称">
                                {
                                    getFieldDecorator('table_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="table_name"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.code.list} pagination={pagination}
                       bordered/>
            </QueueAnim>
        );
    }
}

CodeIndex.propTypes = {};

CodeIndex = Form.create({})(CodeIndex);

export default connect(({code}) => ({code}))(CodeIndex);
