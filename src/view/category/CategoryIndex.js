import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Table, Popconfirm, message} from 'antd';

import CategoryDetail from './CategoryDetail';
import CategoryChildren from './CategoryChildren';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class CategoryIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        this.props.form.setFieldsValue({
            app_id: this.props.category.app_id
        });

        this.handleLoad();

        this.handleLoadApp();

        notification.on('notification_category_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_category_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'category/fetch',
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
            var app_id = this.props.form.getFieldValue('app_id');
            if (validate.isUndefined(app_id)) {
                app_id = '';
            }

            this.props.dispatch({
                type: 'category/fetch',
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
            url: '/category/' + constant.action + '/list',
            data: {
                app_id: this.props.category.app_id,
                page_index: this.props.category.page_index,
                page_size: this.props.category.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'category/fetch',
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
                type: 'category/fetch',
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
                type: 'category/fetch',
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
        notification.emit('notification_category_detail_add', {
            is_children: false,
            app_id: '',
            parent_id: '',
            category_type: ''
        });
    }

    handleEdit(category_id) {
        notification.emit('notification_category_detail_edit', {
            is_children: false,
            category_id: category_id
        });
    }

    handleEditChirldren(category_id) {
        notification.emit('notification_category_children_edit', {
            is_children: false,
            category_id: category_id
        });
    }

    handleDel(category_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/category/' + constant.action + '/delete',
            data: {
                category_id: category_id,
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
            title: '名称',
            dataIndex: 'category_name'
        }, {
            width: 200,
            title: '键值',
            dataIndex: 'category_key'
        }, {
            width: 200,
            title: '数值',
            dataIndex: 'category_value'
        }, {
            width: 100,
            title: '排序',
            dataIndex: 'category_sort'
        }, {
            width: 135,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.category_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <a onClick={this.handleEditChirldren.bind(this, record.category_id)}>子类</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.category_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.category.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.category.page_index,
            pageSize: this.props.category.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">分类信息</div>
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
                                                this.props.category.app_list.map(function (item) {
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
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="分类类型">
                                {
                                    getFieldDecorator('category_type', {
                                        initialValue: ''
                                    })(
                                        <Select allowClear placeholder="请选分类类型">
                                            <Option key="MENU" value="MENU">菜单</Option>
                                            <Option key="PRODUCT" value="PRODUCT">商品</Option>
                                            <Option key="ARTICLE" value="ARTICLE">文章</Option>
                                            <Option key="EMPLOYEE_ORGANIZATION" value="EMPLOYEE_ORGANIZATION">员工组织架构</Option>
                                            <Option key="MEMBER_ORGANIZATION" value="MEMBER_ORGANIZATION">会员组织架构</Option>
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
                       rowKey="category_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.category.list} pagination={pagination}
                       bordered/>
                <CategoryDetail/>
                <CategoryChildren/>
            </QueueAnim>
        );
    }
}

CategoryIndex.propTypes = {};

CategoryIndex = Form.create({})(CategoryIndex);

export default connect(({category}) => ({category}))(CategoryIndex);