import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import QueueAnim from 'rc-queue-anim';
import {Row, Col, Button, Form, Select, Input, Table, Popconfirm, message} from 'antd';

import GuangqiGameAreaDetail from './GuangqiGameAreaDetail';
import constant from '../../util/constant';
import notification from '../../util/notification';
import validate from '../../util/validate';
import http from '../../util/http';

class GuangqiGameAreaIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
            app_id: this.props.guangqi_game_area.app_id
            });

            this.handleLoadApp();
        }

        this.props.form.setFieldsValue({
            game_area_name: this.props.guangqi_game_area.game_area_name,
        });

        this.handleLoad();

        notification.on('notification_guangqi_game_area_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_guangqi_game_area_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/' + constant.action + '/app/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_game_area/fetch',
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

            let game_area_name = this.props.form.getFieldValue('game_area_name');

            this.props.dispatch({
                type: 'guangqi_game_area/fetch',
                data: {
                    app_id: app_id,
                    game_area_name: game_area_name,
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
            url: '/' + constant.action + '/guangqi/game/area/list',
            data: {
                app_id: this.props.guangqi_game_area.app_id,
                game_area_name: this.props.guangqi_game_area.game_area_name,
                page_index: this.props.guangqi_game_area.page_index,
                page_size: this.props.guangqi_game_area.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'guangqi_game_area/fetch',
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
                type: 'guangqi_game_area/fetch',
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
                type: 'guangqi_game_area/fetch',
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
        notification.emit('notification_guangqi_game_area_detail_add', {});
    }

    handleEdit(game_area_id) {
        notification.emit('notification_guangqi_game_area_detail_edit', {
            game_area_id: game_area_id
        });
    }

    handleDel(game_area_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/guangqi/game/area/delete',
            data: {
                game_area_id: game_area_id,
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

    handleUpload(game_area_id) {
        this.props.dispatch(routerRedux.push({
            pathname: '/guangqi/game/area/detail/' + game_area_id,
            query: {}
        }));
    }

    render() {
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {getFieldDecorator} = this.props.form;

        const columns = [{
            title: '名称',
            dataIndex: 'game_area_name'
        }, {
            title: '封面图片',
            dataIndex: 'game_area_cover_picture',
            render: (text, record, index) => (
                record.game_area_cover_picture_file?
                    <div className="clearfix">
                        <img alt="example" style={{ height: '83px' }} src={constant.host + record.game_area_cover_picture_file.file_original_path}/>
                    </div>:null
            )
        }, {
            title: '排序',
            dataIndex: 'game_area_sort'
        }, {
            width: 180,
            title: constant.operation,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                    <a onClick={this.handleEdit.bind(this, record.game_area_id)}>{constant.edit}</a>
                    <span className="divider"/>
                    <a onClick={this.handleUpload.bind(this, record.game_area_id)}>上传资料</a>
                    <span className="divider"/>
                    <Popconfirm title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.game_area_id, record.system_version)}>
                        <a>{constant.del}</a>
                    </Popconfirm>
                </span>
            )
        }];

        const pagination = {
            size: 'defalut',
            total: this.props.guangqi_game_area.total,
            showTotal: function (total, range) {
                return '总共' + total + '条数据';
            },
            current: this.props.guangqi_game_area.page_index,
            pageSize: this.props.guangqi_game_area.page_size,
            showSizeChanger: true,
            onShowSizeChange: this.handleChangeSize.bind(this),
            onChange: this.handleChangeIndex.bind(this)
        };

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">赛区风采信息</div>
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
                                                        this.props.guangqi_game_area.app_list.map(function (item) {
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
                            }} className="content-search-item" label="名称">
                                {
                                    getFieldDecorator('game_area_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入名称" onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
                <Table key="2"
                       rowKey="game_area_id"
                       className="margin-top"
                       loading={this.state.is_load} columns={columns}
                       dataSource={this.props.guangqi_game_area.list} pagination={pagination}
                       bordered/>
                <GuangqiGameAreaDetail/>
            </QueueAnim>
        );
    }
}

GuangqiGameAreaIndex.propTypes = {};

GuangqiGameAreaIndex = Form.create({})(GuangqiGameAreaIndex);

export default connect(({guangqi_game_area}) => ({
    guangqi_game_area
}))(GuangqiGameAreaIndex);