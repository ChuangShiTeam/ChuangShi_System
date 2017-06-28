import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TinyMCE from 'react-tinymce';

import ImageHelp from './ImageHelp'
import constant from '../util/constant';
import notification from '../util/notification';

var editor;

class InputHtml extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: ''
    }
  }

  componentDidMount() {
    notification.on('notification_image_help_' + this.props.name + '_Submit', this, function (data) {
      var html = '';

      for (var i = 0; i < data.length; i++) {
        html += '<img src="' + constant.host + data[i].file_path + '" />';
      }

      this.editor.insertContent(html);
    });
  }

  componentWillUnmount() {
    notification.remove('notification_image_help_' + this.props.name + '_Submit', this);

    this.editor.remove();
  }

  handleSetValue(content) {
    this.editor.setContent(content);
  }

  handleGetValue() {
    return this.editor.getContent();
  }

  handleReset() {
    this.handleSetValue("");
  }

  handleSubmitReturn(list) {
    var html = '';

    for (var i = 0; i < list.length; i++) {
      html += '<img src="' + constant.host + list[i].file_path + '" />';
    }

    this.editor.insertContent(html);
  }

  render() {

    return (
      <div>
        <TinyMCE
          config={{
            menubar: false,
            border_width: 1,
            convert_urls: false,
            statusbar: false,
            elementpath: false,
            visual: false,
            keep_values: false,
            show_system_default_font: false,
            forced_root_block: 'div',
            plugins: 'code image imagetools autoresize media preview',
            imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
            toolbar: 'fontselect fontsizeselect | bold italic underline strikethrough removeformat | alignleft aligncenter alignright | media | mybutton image | code | preview',
            setup: function (editor) {
              this.editor = editor;

              editor.addButton('mybutton', {
                icon: 'mce-ico mce-i-browse',
                tooltip: 'Insert image',
                onclick: function () {
                  notification.emit('notification_image_help_' + this.props.name + '_show', {});
                }.bind(this)
              });
            }.bind(this)
          }}
        />
        <ImageHelp name={this.props.name} type={'original'} limit={0} ref="image"/>
      </div>
    );
  }
}

InputHtml.propTypes = {
  name: PropTypes.string.isRequired
};

export default InputHtml;
