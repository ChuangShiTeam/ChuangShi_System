import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import XietongArticleDetail from './XietongArticleDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class XietongArticleIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.article.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            article_name: this.props.article.article_name,
        });

        this.handleLoad();

        this.handleLoadArticleCategory();

        notification.on('notification_article_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_article_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'article/fetch',
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

            let article_name = this.props.form.getFieldValue('article_name');

            this.props.dispatch({
                type: 'article/fetch',
                data: {
                    app_id: app_id,
                    article_name: article_name,
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
            url: '/' + constant.action + '/article/list',
            data: {
                app_id: this.props.article.app_id,
                article_name: this.props.article.article_name,
                page_index: this.props.article.page_index,
                page_size: this.props.article.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'article/fetch',
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

    handleLoadArticleCategory() {
        http.request({
            url: '/' + constant.action + '/article/category/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'article/fetch',
                    data: {
                        article_category_list: data
                    }
                });
            }.bind(this),
            complete: function () {

            }
        });
    }

    handleChangeIndex(page_index) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'article/fetch',
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
                type: 'article/fetch',
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
        notification.emit('notification_article_detail_add', {});
    }

    handleEdit(article_id) {
        notification.emit('notification_article_detail_edit', {
            article_id: article_id
        });
    }

    handleDel(article_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/article/delete',
            data: {
                article_id: article_id,
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

    handlePublish(article_id) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/xietong/article/publish',
            data: {
                article_id: article_id
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
            title: '文章名称',
            dataIndex: 'article_name'
        }, {
            width: 150,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.handleEdit.bind(this, record.article_id)}>{constant.edit}</a>
                    <span className="divider"/>
                    /*<a onClick={this.handlePublish.bind(this, record.article_id)}>发布</a>
                    <span className="divider"/>*/
                    <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                                  cancelText={constant.popconfirm_cancel}
                                  onConfirm={this.handleDel.bind(this, record.article_id, record.system_version)}>
                        <a>{constant.del}</a>
                    </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.article.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.article.page_index,
            pageSize: this.props.article.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">文章信息</div>
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
                                                        this.props.article.app_list.map(function (item) {
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
                            }} className="content-search-item" label="文章名称">
                                {
                                    getFieldDecorator('article_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入文章名称"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="article_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.article.list} pagination={pagination}
                       bordered/>
                <XietongArticleDetail/>
            </QueueAnim>
        );
    }
}

XietongArticleIndex.propTypes = {};

XietongArticleIndex = Form.create({})(XietongArticleIndex);

export default connect(({article}) => ({
    article
}))(XietongArticleIndex);