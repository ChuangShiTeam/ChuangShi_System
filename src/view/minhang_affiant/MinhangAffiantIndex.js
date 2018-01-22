import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import MinhangAffiantDetail from './MinhangAffiantDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class MinhangAffiantIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.minhang_affiant.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            affiant_name: this.props.minhang_affiant.affiant_name,
        });

        this.handleLoad();

        notification.on('notification_minhang_affiant_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_minhang_affiant_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_affiant/fetch',
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

            let affiant_name = this.props.form.getFieldValue('affiant_name');

            this.props.dispatch({
                type: 'minhang_affiant/fetch',
                data: {
                    app_id: app_id,
                    affiant_name: affiant_name,
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
            url: '/' + constant.action + '/minhang/affiant/list',
            data: {
                app_id: this.props.minhang_affiant.app_id,
                affiant_name: this.props.minhang_affiant.affiant_name,
                page_index: this.props.minhang_affiant.page_index,
                page_size: this.props.minhang_affiant.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'minhang_affiant/fetch',
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
                type: 'minhang_affiant/fetch',
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
                type: 'minhang_affiant/fetch',
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
        notification.emit('notification_minhang_affiant_detail_add', {});
    }

    handleEdit(affiant_id) {
        notification.emit('notification_minhang_affiant_detail_edit', {
            affiant_id: affiant_id
        });
    }

    handleDel(affiant_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/minhang/affiant/delete',
            data: {
                affiant_id: affiant_id,
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
            title: '姓名',
            dataIndex: 'affiant_name'
        }, {
            title: '头像',
            dataIndex: 'affiant_avatar_file',
            render: (text, record, index) => (
                record.affiant_avatar_file?
                    <div className="clearfix">
                        <img alt="example" style={{ height: '83px' }} src={constant.host + record.affiant_avatar_file.file_original_path}/>
                    </div>:null
            )
        }, {
            title: '性别',
            dataIndex: 'affiant_sex'
        }, {
            title: '出身年月',
            dataIndex: 'affiant_birthday'
        }, {
            title: '排序',
            dataIndex: 'affiant_sort'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.affiant_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.affiant_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.minhang_affiant.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.minhang_affiant.page_index,
            pageSize: this.props.minhang_affiant.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">领誓人信息</div>
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
                                                        this.props.minhang_affiant.app_list.map(function (item) {
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
                            }} className="content-search-item" label="姓名">
                                {
                                    getFieldDecorator('affiant_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入姓名" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="affiant_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.minhang_affiant.list} pagination={pagination}
                       bordered/>
                <MinhangAffiantDetail/>
            </QueueAnim>
        );
    }
}

MinhangAffiantIndex.propTypes = {};

MinhangAffiantIndex = Form.create({})(MinhangAffiantIndex);

export default connect(({minhang_affiant}) => ({
    minhang_affiant
}))(MinhangAffiantIndex);