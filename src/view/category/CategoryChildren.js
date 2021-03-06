import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Row, Col, Button, Table, Popconfirm, message} from 'antd';

import constant from '../../util/constant';
import notification from '../../util/notification';
import http from '../../util/http';

class CategoryChirldren extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            action: '',
            category_id: '',
            app_id: '',
            parent_id: '',
            category_name: '',
            category_type: '',
            system_version: '',
            children: [],
            expandedRowKeys: []
        }
    }

    componentDidMount() {
        notification.on('notification_category_children_load', this, function (data) {
            this.handleLoad();
        });

        notification.on('notification_category_children_edit', this, function (data) {
            this.setState({
                is_show: true,
                action: 'update',
                category_id: data.category_id
            }, function () {
                this.handleLoad();
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_category_children_load', this);

        notification.remove('notification_category_children_edit', this);
    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/category/' + constant.action + '/children/find',
            data: {
                category_id: this.state.category_id
            },
            success: function (data) {
                let expandedRowKeys = this.checkChildren(data.children);

                this.setState({
                    app_id: data.app_id,
                    category_name: data.category_name,
                    category_type: data.category_type,
                    children: data.children,
                    expandedRowKeys: expandedRowKeys
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });

            }.bind(this)
        });
    }

    checkChildren(list) {
        let expandedRowKeys = [];

        for (let i = 0; i < list.length; i++) {
            expandedRowKeys.push(list[i].category_id);

            if (list[i].children) {
                expandedRowKeys = expandedRowKeys.concat(this.checkChildren(list[i].children));
            }
        }

        return expandedRowKeys;
    }

    handleAdd(category_id) {
        notification.emit('notification_category_detail_add', {
            is_children: true,
            app_id: this.state.app_id,
            parent_id: category_id,
            category_type: this.state.category_type
        });
    }

    handleEdit(category_id) {
        notification.emit('notification_category_detail_edit', {
            is_children: true,
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

    handleExpand() {

    }

    handleSubmit() {
        this.handleCancel();
    }

    handleCancel() {
        this.setState({
            is_load: false,
            is_show: false,
            is_children: false,
            action: '',
            category_id: '',
            parent_id: '',
            system_version: ''
        });
    }

    render() {
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
            title: constant.action,
            dataIndex: '',
            render: (text, record, index) => (
                <span>
                  <a onClick={this.handleAdd.bind(this, record.category_id)}>{constant.add}</a>
                  <span className="divider"/>
                  <a onClick={this.handleEdit.bind(this, record.category_id)}>{constant.edit}</a>
                  <span className="divider"/>
                  <Popconfirm zIndex={2} title={constant.popconfirm_title} okText={constant.popconfirm_ok}
                              cancelText={constant.popconfirm_cancel}
                              onConfirm={this.handleDel.bind(this, record.category_id, record.system_version)}>
                    <a>{constant.del}</a>
                  </Popconfirm>
                </span>
            )
        }];

        return (
            <Modal title={'分类详情'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal" zIndex={1}
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
            >
                <Row key="0" className="content-title">
                    <Col span={8}>
                        <div className="">{this.state.category_name}</div>
                    </Col>
                    <Col span={16} className="content-button">
                        <Button type="default" icon="search" size="default" className="margin-right"
                                loading={this.state.is_load}
                                onClick={this.handleLoad.bind(this)}>{constant.search}</Button>
                        <Button type="primary" icon="plus-circle" size="default"
                                onClick={this.handleAdd.bind(this, this.state.category_id)}>{constant.add}</Button>
                    </Col>
                </Row>
                <Table rowKey="category_id"
                       size="middle"
                       className="margin-top"
                       expandedRowKeys={this.state.expandedRowKeys}
                       onExpand={this.handleExpand.bind(this)}
                       columns={columns}
                       dataSource={this.state.children}
                       pagination={false}
                       bordered/>
            </Modal>
        );
    }
}

CategoryChirldren.propTypes = {};

export default connect(({category}) => ({category}))(CategoryChirldren);