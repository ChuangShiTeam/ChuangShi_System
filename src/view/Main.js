import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router';
import {Layout, Menu, Icon, Spin} from 'antd';

import constant from '../util/constant';
import http from '../util/http';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_load: false,
            collapsed: false,
            openKeys: [],
            selectedKeys: [],
            menu: []
        }
    }

    componentDidMount() {
        this.handleLoad();
    }

    componentWillUnmount() {

    }

    handleLoad() {
        this.setState({
            is_load: true
        });

        http.request({
            url: '/' + constant.action + '/menu/list',
            data: {},
            success: function (data) {
                let open_key = [];
                let selected_key = [];

                for (let i = 0; i < data.length; i++) {
                    for (let k = 0; k < data[i].children.length; k++) {
                        console.log(data[i].children[k].menu_url);
                        if (data[i].children[k].menu_url === '/' + this.props.routes[2].path) {
                            open_key = [data[i].menu_id];
                            selected_key = [data[i].children[k].menu_id];

                            break;
                        }
                    }
                }

                this.setState({
                    menu: data,
                    openKeys: open_key,
                    selectedKeys: selected_key
                });
            }.bind(this),
            complete: function () {
                this.setState({
                    is_load: false
                });
            }.bind(this)
        });
    }

    handleOpenChange(openKeys) {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }

        this.setState({
            openKeys: nextOpenKeys
        });

        // this.setState({
        //     openKeys: openKeys
        // });
    }

    getAncestorKeys = (key) => {
        const map = {
            sub3: []
        };
        return map[key] || [];
    }

    handleClick(item) {
        this.setState({
            selectedKeys: [item.key]
        });
    }

    handleLogout() {
        this.props.dispatch(routerRedux.push({
            pathname: '/login',
            query: {}
        }));
    }

    render() {
        const {Header, Sider, Content} = Layout;
        const {SubMenu} = Menu;

        return (
            <Layout>
                <Header className="header">
                    <h1 className="title">{constant.name}</h1>
                    <Link onClick={this.handleLogout.bind(this)}><Icon type="poweroff" className="logout"/></Link>
                </Header>
                <Layout>
                    {constant.is_show_menu ?
                        <Sider className="sider">
                            <Spin spinning={this.state.is_load}>
                                <Menu
                                    mode="inline"
                                    className="menu"
                                    openKeys={this.state.openKeys}
                                    selectedKeys={this.state.selectedKeys}
                                    onOpenChange={this.handleOpenChange.bind(this)}
                                    onClick={this.handleClick.bind(this)}
                                    style={{height: document.documentElement.clientHeight - 64}}
                                >
                                    {
                                        this.state.menu.map(function (item) {
                                            return (
                                                constant.is_tree_menu ?
                                                    <SubMenu key={item.menu_id}
                                                             title={<span><Icon type={item.menu_image}/><span
                                                                 className="nav-text">{item.menu_name}</span></span>}>
                                                        {
                                                            item.children.map(function (children) {
                                                                return (
                                                                    <Menu.Item key={children.menu_id}><Link
                                                                        to={children.menu_url}><Icon
                                                                        type="database"/>{children.menu_name}
                                                                    </Link></Menu.Item>
                                                                )
                                                            })
                                                        }
                                                    </SubMenu>
                                                    :
                                                    <Menu.Item key={item.menu_id}><Link to={item.menu_url}><Icon
                                                        type="database"/>{item.menu_name}</Link></Menu.Item>
                                            )
                                        })
                                    }
                                </Menu>
                            </Spin>
                        </Sider>
                        :
                        ""
                    }
                    <Layout className="layout">
                        <Content style={{
                            background: '#ffffff',
                            padding: 10,
                            margin: 0,
                            minHeight: document.documentElement.clientHeight - 64 - 20
                        }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

Main.propTypes = {};

export default connect(() => ({}))(Main);
