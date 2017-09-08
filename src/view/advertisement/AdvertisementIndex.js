import React, {Component} from 'react';
import {connect} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import AdvertisementDetail from './AdvertisementDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class AdvertisementIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.advertisement.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            advertisement_category_code: this.props.advertisement.advertisement_category_code,
            advertisement_title: this.props.advertisement.advertisement_title,
        });

        this.handleLoad();

        notification.on('notification_advertisement_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_advertisement_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'advertisement/fetch',
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

            let advertisement_category_code = this.props.form.getFieldValue('advertisement_category_code');
            let advertisement_title = this.props.form.getFieldValue('advertisement_title');

            this.props.dispatch({
                type: 'advertisement/fetch',
                data: {
                    app_id: app_id,
                    advertisement_category_code: advertisement_category_code,
                    advertisement_title: advertisement_title,
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
            url: '/' + constant.action + '/advertisement/list',
            data: {
                app_id: this.props.advertisement.app_id,
                advertisement_category_code: this.props.advertisement.advertisement_category_code,
                advertisement_title: this.props.advertisement.advertisement_title,
                page_index: this.props.advertisement.page_index,
                page_size: this.props.advertisement.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'advertisement/fetch',
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
                type: 'advertisement/fetch',
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
                type: 'advertisement/fetch',
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
        notification.emit('notification_advertisement_detail_add', {});
    }

    handleEdit(advertisement_id) {
        notification.emit('notification_advertisement_detail_edit', {
            advertisement_id: advertisement_id
        });
    }

    handleDel(advertisement_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/advertisement/delete',
            data: {
                advertisement_id: advertisement_id,
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
            title: '广告分类编码',
            dataIndex: 'advertisement_category_code'
        }, {
            title: '广告标题',
            dataIndex: 'advertisement_title'
        }, {
            title: '广告位置',
            dataIndex: 'advertisement_position'
        }, {
            title: '广告图片',
            dataIndex: 'advertisement_image_file',
            render: (text, record, index) => (
                text?<span>
                  <img alt="example" style={{width: 100}} src={constant.host + text.file_path} />
                </span>:null
            )
        }, {
            title: '广告链接',
            dataIndex: 'advertisement_link'
        }, {
            title: '是否浮动广告',
            dataIndex: 'advertisement_is_float',
            render: (text, record, index) => (
                text?'是':'否'
            )
        }, {
            title: '排序',
            dataIndex: 'advertisement_sort'
        }, {
            width: 100,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleEdit.bind(this, record.advertisement_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.advertisement_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.advertisement.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.advertisement.page_index,
            pageSize: this.props.advertisement.page_size,
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
                                                        this.props.advertisement.app_list.map(function (item) {
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
                            }} className="content-search-item" label="广告分类编码">
                                {
                                    getFieldDecorator('advertisement_category_code', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入广告分类编码" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem hasFeedback {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} className="content-search-item" label="广告标题">
                                {
                                    getFieldDecorator('advertisement_title', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入广告标题" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="advertisement_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.advertisement.list} pagination={pagination}
                       bordered/>
                <AdvertisementDetail/>
            </QueueAnim>
        );
    }
}

AdvertisementIndex.propTypes = {};

AdvertisementIndex = Form.create({})(AdvertisementIndex);

export default connect(({advertisement}) => ({
    advertisement
}))(AdvertisementIndex);