import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, message, Upload, Icon, Spin, Pagination} from 'antd';

import constant from '../util/constant';
import storage from '../util/storage';
import notification from '../util/notification';
import http from '../util/http';

class ImageHelp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            is_show: false,
            is_preview: false,
            image: '',
            list: [],
            page_index: 1,
            page_size: 1,
            total: 0
        }
    }

    componentDidMount() {
        notification.on('notification_image_help_' + this.props.name + '_show', this, function (data) {
            var width = Math.floor((document.documentElement.clientWidth - 200 - 30) / 106);
            var height = Math.floor((document.documentElement.clientHeight - 200 - 30 - 30) / 106);

            this.setState({
                is_show: true,
                page_size: width * height
            }, function () {
                this.handleLoad(1);
            });
        });
    }

    componentWillUnmount() {
        notification.remove('notification_image_help_' + this.props.name + '_show', this);
    }

    handleOpen() {
        this.setState({
            is_show: true
        });

        // if (this.state.list.length > 0) {
        //   return;
        // }

        this.handleLoad(1);
    }

    handleLoad(page_index) {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/file/image/list',
            data: {
                file_name: '',
                page_index: page_index,
                page_size: this.state.page_size
            },
            success: function (data) {
                let list = [];

                for (let i = 0; i < data.list.length; i++) {
                    list.push({
                        file_id: data.list[i].file_id,
                        file_path: data.list[i].file_path,
                        status: false,
                        select: false
                    });
                }

                this.setState({
                    list: list,
                    page_index: page_index,
                    total: data.total
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleBeforeUpload(file) {
        let result = true;

        if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {

        } else {
            message.error('图片格式不对');

            result = false;
        }

        if (file.size > 1024 * 1024 * 2) {
            message.error('图片大小超过2M');

            result = false;
        }

        return result;
    }

    handleCancel() {
        let list = [];

        for (let i = 0; i < this.state.list.length; i++) {
            let item = this.state.list[i];

            list.push({
                file_id: item.file_id,
                file_path: item.file_path,
                status: false,
                select: false
            });
        }

        this.setState({
            is_show: false,
            list: list
        });
    }

    handleCancelPreview() {
        this.setState({
            is_preview: false
        });
    }

    handlePreview(file_id) {
        let file_path = '';
        for (let i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i].file_id === file_id) {
                file_path = this.state.list[i].file_path;
            }
        }

        this.setState({
            image: constant.host + file_path,
            is_preview: true
        });
    }

    handleClick(file_id) {
        let list = [];

        for (let i = 0; i < this.state.list.length; i++) {
            let item = this.state.list[i];

            if (item.file_id === file_id) {
                item.select = !item.select;
            }

            list.push({
                file_id: item.file_id,
                file_path: item.file_path,
                status: item.status,
                select: item.select
            });
        }

        this.setState({
            list: list
        });
    }

    handleMouseOver(file_id) {
        let list = [];

        for (let i = 0; i < this.state.list.length; i++) {
            let item = this.state.list[i];

            list.push({
                file_id: item.file_id,
                file_path: item.file_path,
                status: item.file_id === file_id,
                select: item.select
            });
        }

        this.setState({
            list: list
        });
    }

    handleMouseOut(file_id) {
        let list = [];

        for (let i = 0; i < this.state.list.length; i++) {
            let item = this.state.list[i];

            list.push({
                file_id: item.file_id,
                file_path: item.file_path,
                status: false,
                select: item.select
            });
        }

        this.setState({
            list: list
        });
    }

    handleSubmit() {
        let list = [];

        let index = 0;

        for (let i = 0; i < this.state.list.length; i++) {
            let item = this.state.list[i];

            if (item.select) {
                if (index < this.props.limit || this.props.limit === 0) {
                    index++;

                    if (this.props.type !== '') {
                        item.file_path = item.file_path.substring(0, item.file_path.lastIndexOf("/")) + "/" + this.props.type + "/" + item.file_path.substring(item.file_path.lastIndexOf("/") + 1);
                    }

                    list.push({
                        file_id: item.file_id,
                        file_path: item.file_path,
                        status: false,
                        select: item.select
                    });
                }
            }
        }

        notification.emit('notification_image_help_' + this.props.name + '_Submit', list);

        this.handleCancel();
    }

    handleChange(info) {
        if (info.file.status === 'done') {
            if (info.file.response.code === 200) {
                message.success(constant.success);
            } else {
                message.error(info.file.response.message);
            }

            this.setState({
                is_load: false
            });

            this.handleLoad(1);
        } else if (info.file.status === 'uploading') {
            this.setState({
                is_load: true
            });
        } else if (info.file.status === 'error') {
            message.error(info.file.name + ' file upload failed');
        }
    }

    handlePaginationChange(page, pageSize) {
        this.handleLoad(page);
    }

    render() {
        const props = {
            name: 'file',
            multiple: true,
            showUploadList: false,
            action: constant.host + '/admin/file/upload',
            accept: 'image/jpg,image/jpeg,image/png',
            headers: {
                'app_id': constant.app_id,
                'token': storage.getToken(),
                'platform': constant.platform,
                'version': constant.version
            },
            onChange: this.handleChange.bind(this)
        };

        return (
            <Modal title={'我的图片'} maskClosable={false} width={document.documentElement.clientWidth - 200} className="modal"
                   visible={this.state.is_show} onCancel={this.handleCancel.bind(this)}
                   footer={[
                       <div key="normal" style={{float: 'left', marginLeft: 10}}>
                           <Upload {...props}>
                               <Button type="ghost" loading={this.state.is_load}>
                                   <Icon type="cloud-upload"/>上传图片
                               </Button>
                           </Upload>
                       </div>,
                       <Button key="back" type="ghost" size="default" icon="cross-circle"
                               onClick={this.handleCancel.bind(this)}>关闭</Button>,
                       <Button key="submit" type="primary" size="default" icon="check-circle"
                               loading={this.state.is_load}
                               onClick={this.handleSubmit.bind(this)}>确定</Button>
                   ]}
            >

                <Spin spinning={this.state.is_load}>
                    {
                        this.state.list.map(function (item) {
                            const mask = item.status || item.select ? "item-mask item-mask-active" : "item-mask";
                            return (
                                <div key={item.file_id} className="item">
                                    <div className="item-image"
                                         style={{backgroundImage: 'url(' + constant.host + item.file_path + ')'}}></div>
                                    <div onMouseOver={this.handleMouseOver.bind(this, item.file_id)}
                                         onMouseOut={this.handleMouseOut.bind(this, item.file_id)}>
                                        <div className={mask} onClick={this.handleClick.bind(this, item.file_id)}></div>
                                        <i className="anticon anticon-eye-o item-preview-icon"
                                           style={{display: item.status && !item.select ? 'inline' : 'none'}}
                                           onClick={this.handlePreview.bind(this, item.file_id)}/>
                                        <i className="anticon anticon-delete item-remove-icon"
                                           style={{display: item.status && !item.select ? 'inline' : 'none'}}/>
                                        <i className="anticon anticon-check-circle-o item-check-icon"
                                           style={{display: item.select ? 'inline' : 'none'}}
                                           onClick={this.handlePreview.bind(this)}/>
                                    </div>
                                </div>
                            )
                        }.bind(this))
                    }
                    <div style={{float: 'left', width: '100%', textAlign: 'right'}}>
                        <Pagination current={this.state.page_index} pageSize={this.state.page_size}
                                    total={this.state.total}
                                    onChange={this.handlePaginationChange.bind(this)}/>
                    </div>
                </Spin>
                <Modal visible={this.state.is_preview} footer={null} onCancel={this.handleCancelPreview.bind(this)}>
                    <div className="item-image" style={{backgroundImage: 'url(' + this.state.image + ')'}}></div>
                </Modal>
            </Modal>
        );
    }
}

ImageHelp.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    limit: PropTypes.number.isRequired
};

ImageHelp.defaultProps = {
    type: ''
};

export default ImageHelp;
