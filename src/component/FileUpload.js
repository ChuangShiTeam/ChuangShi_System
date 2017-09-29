import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, message, Upload, Icon} from 'antd';

import constant from '../util/constant';
import storage from '../util/storage';

class FileUpload extends Component {
	constructor(props) {
		super(props);

		this.state = {
			is_load: false,
			fileList: []
		}
	}

	componentDidMount() {

	}

	componentWillUnmount() {
		this.handleReset();
	}

	handleGetValue() {
		let fileList = this.state.fileList.map(file => {
			return {
				file_id: file.uid,
				file_name: file.name,
				file_path: file.url
			}
		});
		return fileList;
	}

	handleSetValue(data) {
		let array = [];
		for (let i = 0; i < data.length; i++) {
			array.push({
				uid: data[i].file_id,
				name: data[i].file_name,
				url: constant.host + data[i].file_path,
				status: 'done'
			});
		}

		this.setState({
			fileList: array
		});
	}

	handleBeforeUpload = (file, fileList) => {
		if (!(this.props.limit === 0) && this.props.limit < fileList.length + this.state.fileList.length) {
			message.error(`文件上传数量限制为${this.props.limit}个！`);
			return false;
		}

		if (file.size > 1024 * 1024 * this.props.size) {
			message.error(`文件大小超过${this.props.size}M！`);

			return false;
		}

		return true;
	};

	handleChange = (info) => {
		let fileList = info.fileList;
		if (info.file.status === 'done') {
			if (info.file.response.code === 200) {
				message.success(constant.success);
				fileList = fileList.map((file) => {
					if (file.response) {
						file.url = constant.host + file.response.data[0].file_path;
						file.uid = file.response.data[0].file_id;
					}
					return file;
				});

			} else {
				message.error(info.file.response.message);
			}

			this.setState({
				is_load: false
			});
		} else if (info.file.status === 'uploading') {
			this.setState({
				is_load: true
			});
		} else if (info.file.status === 'error') {
			this.setState({
				is_load: false
			});
			message.error(info.file.name + ' 文件上传失败！');
		}
		fileList = fileList.filter((file) => {
			if (file.response) {
				return file.response.code === 200;
			}
			return true;
		});
		this.setState({ fileList });
	};

	handlePreview = (file) => {
		return true;
	};

	handleReset() {
		this.setState({
			is_load: false,
			fileList: []
		});
	}

	render() {
		const props = {
			name: 'file',
			multiple: true,
			action: constant.host + '/admin/file/upload',
			accept: this.props.type,
			headers: {
				'app_id': constant.app_id,
				'token': storage.getToken(),
				'platform': constant.platform,
				'version': constant.version
			},
			onChange: this.handleChange.bind(this),
			beforeUpload: this.handleBeforeUpload,
			fileList: this.state.fileList
		};

		return (
			<Upload {...props}>
				<Button loading={this.state.is_load}>
					<Icon type="upload" /> 上传(文件大小不超过{this.props.size}M)
				</Button>
			</Upload>
		);
	}
}

FileUpload.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string,
	size: PropTypes.number,
	limit: PropTypes.number
};

FileUpload.defaultProps = {
	type: '',
	limit: 0,
	size: 2
};

export default FileUpload;
