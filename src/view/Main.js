import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router';
import {Layout, Menu, Icon} from 'antd';

import constant from '../util/constant';
import './Style.css';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: false,
            openKeys: [],
            selectedKeys: [],
            menu: constant.menu
        }
    }

    componentDidMount() {
        var open_key = [];
        var selected_key = [];

        if (typeof (this.state.menu[0].children) === 'undefined') {
            for (let i = 0; i < this.state.menu.length; i++) {
                if (this.state.menu[i].category_value === '/' + this.props.routes[2].path) {
                    open_key = [this.state.menu[i].category_id];
                    selected_key = [this.state.menu[i].category_id];

                    break;
                }
            }
        } else {
            for (let i = 0; i < this.state.menu.length; i++) {
                for (var k = 0; k < this.state.menu[i].children.length; k++) {
                    if (this.state.menu[i].children[k].category_value === '/' + this.props.routes[2].path) {
                        open_key = [this.state.menu[i].category_id];
                        selected_key = [this.state.menu[i].children[k].category_id];

                        break;
                    }
                }
            }
        }

        this.setState({
            openKeys: open_key,
            selectedKeys: selected_key
        });
    }

    componentWillUnmount() {

    }

    handleOpenChange(openKeys) {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        var nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }

        this.setState({
            openKeys: nextOpenKeys
        });
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
                    <Sider className="sider">
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
                                typeof (this.state.menu[0].children) === 'undefined' ?
                                    this.state.menu.map(function (item) {
                                        return (
                                            <Menu.Item key={item.category_id}>
                                                <Link to={item.category_value}>
                                                    <Icon type={item.category_image} />
                                                    {item.category_name}
                                                </Link>
                                            </Menu.Item>
                                        )
                                    })
                                    :
                                    this.state.menu.map(function (item) {
                                        return (
                                            <SubMenu key={item.category_id}
                                                     title={<span><Icon
                                                         className={'anticon ' + item.category_remark}/><span
                                                         className="nav-text">{item.category_name}</span></span>}>
                                                {
                                                    item.children.map(function (children) {
                                                        return (
                                                            <Menu.Item key={children.category_id}><Link
                                                                to={children.category_value}>{children.category_name}</Link></Menu.Item>
                                                        )
                                                    })
                                                }
                                            </SubMenu>
                                        )
                                    })
                            }
                        </Menu>
                    </Sider>
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
