import React, {Component} from "react";
import {connect} from "dva";
import QueueAnim from "rc-queue-anim";
import {Row, Col, Button, Form, Select, Input, message} from "antd";
import constant from "../../util/constant";
import notification from "../../util/notification";
import validate from "../../util/validate";
import http from "../../util/http";

class CacheIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false
        }
    }

    componentDidMount() {
        if (constant.action === 'system') {
            this.props.form.setFieldsValue({
                app_id: this.props.supplier.app_id
            });

            this.handleLoadApp();
        }

        //this.handleLoad();

        notification.on('notification_cache_index_load', this, function (data) {
            this.handleLoad();
        });
    }

    componentWillUnmount() {
        notification.remove('notification_cache_index_load', this);
    }

    handleLoadApp() {
        http.request({
            url: '/app/' + constant.action + '/all/list',
            data: {},
            success: function (data) {
                this.props.dispatch({
                    type: 'cache/fetch',
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

            let user_name = this.props.form.getFieldValue('user_name');

            this.props.dispatch({
                type: 'cache/fetch',
                data: {
                    app_id: app_id,
                    user_name: user_name,
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
            url: '/cache/' + constant.action + '/list',
            data: {
                app_id: this.props.supplier.app_id,
                user_name: this.props.supplier.user_name,
                page_index: this.props.supplier.page_index,
                page_size: this.props.supplier.page_size
            },
            success: function (data) {
                this.props.dispatch({
                    type: 'cache/fetch',
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
                type: 'supplier/fetch',
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
                type: 'supplier/fetch',
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
        notification.emit('notification_cache_detail_add', {});
    }

    handleEdit(cache_id) {
        notification.emit('notification_cache_detail_edit', {
            cache_id: cache_id
        });
    }

    handleDel(cache_id, system_version) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/cache/' + constant.action + '/delete',
            data: {
                cache_id: cache_id,
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

    handleRemoveAllCache() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/remove/all/cache',
            data: {},
            success: function (data) {
                message.success(constant.success);

                //this.handleLoad().bind(this);
            },
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleRefreshAccessToken() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/refresh/access/token',
            data: {},
            success: function (data) {
                message.success(constant.success);

                //this.handleLoad().bind(this);
            },
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

        return (
            <QueueAnim>
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">缓存信息</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="primary" icon="plus-circle" size="default" className="margin-right"
                                onClick={this.handleRemoveAllCache.bind(this,)}>清空缓存</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleRefreshAccessToken.bind(this,)}>刷新token</Button>
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
                                                        this.props.supplier.app_list.map(function (item) {
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
                                    getFieldDecorator('user_name', {
                                        initialValue: ''
                                    })(
                                        <Input type="text" placeholder="请输入名称"
                                               onPressEnter={this.handleSearch.bind(this)}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                        </Col>
                    </Row>
                </Form>
            </QueueAnim>
        );
    }
}

CacheIndex.propTypes = {};

CacheIndex = Form.create({})(CacheIndex);

export default connect(({cache}) => ({
    cache
}))(CacheIndex);