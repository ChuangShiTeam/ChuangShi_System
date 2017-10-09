import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import WebsiteMenuDetail from './WebsiteMenuDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class WebsiteMenuIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.website_menu.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            website_menu_name: this.props.website_menu.website_menu_name,
        });

        this.handleLoad();

        notification.on('notification_website_menu_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_website_menu_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'website_menu/fetch',
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

            let website_menu_name = this.props.form.getFieldValue('website_menu_name');

            this.props.dispatch({
                type: 'website_menu/fetch',
                data: {
                    app_id: app_id,
                    website_menu_name: website_menu_name,
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
            url: '/' + constant.action + '/website/menu/list',
            data: {
                app_id: this.props.website_menu.app_id,
                website_menu_name: this.props.website_menu.website_menu_name
            },
            success: function (data) {
                let expandedRowKeys = this.setExpandedRowKeys(data);

                this.props.dispatch({
                    type: 'website_menu/fetch',
                    data: {
                        list: data,
                        expandedRowKeys: expandedRowKeys
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

    setExpandedRowKeys(list) {
        let expandedRowKeys = [];

        for (let i = 0; i < list.length; i++) {
            expandedRowKeys.push(list[i].website_menu_id);

            if (list[i].children) {
                expandedRowKeys = expandedRowKeys.concat(this.setExpandedRowKeys(list[i].children));
            }
        }

        return expandedRowKeys;
    }

    handleChangeIndex(page_index) {
        new Promise(function (resolve, reject) {
            this.props.dispatch({
                type: 'website_menu/fetch',
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
                type: 'website_menu/fetch',
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

    handleAdd(website_menu_parent_id) {
        notification.emit('notification_website_menu_detail_add', {
            website_menu_parent_id: website_menu_parent_id
        });
    }

    handleEdit(website_menu_id) {
        notification.emit('notification_website_menu_detail_edit', {
            website_menu_id: website_menu_id
        });
    }

    handleDel(website_menu_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/website/menu/delete',
            data: {
                website_menu_id: website_menu_id,
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
            title: '菜单名称',
            dataIndex: 'website_menu_name'
        }, {
            title: '菜单地址',
            dataIndex: 'website_menu_url'
        }, {
            title: '菜单排序',
            dataIndex: 'website_menu_sort'
        }, {
            width: 200,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleAdd.bind(this, record.website_menu_id)}>{constant.add}</a>
                  <span className="divider"/>
                  <a onClick={this.handleEdit.bind(this, record.website_menu_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.website_menu_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">菜单信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleSearch.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this, '')}>{constant.add}</Button>
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
                                                        this.props.website_menu.app_list.map(function (item) {
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
                            }} className="content-search-item" label="菜单名称">
                                {
                                    getFieldDecorator('website_menu_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入菜单名称"
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
                       rowKey="website_menu_id"
                       className="margin-top"
                       expandedRowKeys={this.props.website_menu.expandedRowKeys}
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.website_menu.list} pagination={false}
                       bordered/>
                <WebsiteMenuDetail/>
            </QueueAnim>
        );
    }
}

WebsiteMenuIndex.propTypes = {};

WebsiteMenuIndex = Form.create({})(WebsiteMenuIndex);

export default connect(({website_menu}) => ({
    website_menu
}))(WebsiteMenuIndex);