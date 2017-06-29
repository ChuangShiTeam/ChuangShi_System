export default {
    host: 'http://localhost:8080',
    // host: 'http://api.chuangshi.nowui.com',
    // action: 'system',
    action: 'admin',
    index: 'feijiu/recommend/customer/index',
    platform: 'Admin',
    version: '1.0.0',
    page_size: 10,
    operation: '操作',
    search: '搜索',
    find: '查看',
    add: '新增',
    edit: '修改',
    del: '删除',
    load: '正在加载中..',
    success: '操作成功',
    error: '网络有问题',
    popconfirm_title: '您确定要删除该数据吗?',
    popconfirm_ok: '确定',
    popconfirm_cancel: '取消',
    required: '不能为空',
    placeholder: '请输入',
    detail_width: 1080,
    // name: '上海星销信息技术有限公司',
    // app_id: 'de6e1787ae4a47cda2c9a0223c766a73',
    // menu: [
    //     {
    //         'category_name': '系统管理',
    //         'category_id': 'f9ba71d091a04d7ea953de029ba149ba',
    //         'children': [
    //             {
    //                 'category_name': '应用信息',
    //                 'category_id': 'b1c7435a909548c58161ef2a3634dafe',
    //                 'category_remark': '',
    //                 'category_value': '/app/index'
    //             },
    //             {
    //                 'category_name': '分类信息',
    //                 'category_id': '7cba0ea44bbe40ea94f7a9f2258e3050',
    //                 'category_remark': '',
    //                 'category_value': '/category/index'
    //             },
    //             {
    //                 'category_name': '菜单信息',
    //                 'category_id': '7cba0ea44bbe40ea94f7a9f2258e3051',
    //                 'category_remark': '',
    //                 'category_value': '/menu/index'
    //             },
    //             {
    //                 'category_name': 'API信息',
    //                 'category_id': '7cba0ea44bbe40ea94f7a9f2258e3052',
    //                 'category_remark': '',
    //                 'category_value': '/api/index'
    //             },
    //             {
    //                 'category_name': '文件信息',
    //                 'category_id': '7cba0ea44bbe40ea94f7a9f2258e3053',
    //                 'category_remark': '',
    //                 'category_value': '/file/index'
    //             },
    //             {
    //                 'category_name': '用户信息',
    //                 'category_id': '7cba0ea44bbe40ea94f7a9f2258e3054',
    //                 'category_remark': '',
    //                 'category_value': '/user/index'
    //             },
    //             {
    //                 'category_name': '请求信息',
    //                 'category_id': '7cba0ea44bbe40ea94f7a9f2258e3055',
    //                 'category_remark': '',
    //                 'category_value': '/http/index'
    //             },
    //             {
    //                 'category_name': 'SQL信息',
    //                 'category_id': '0505425dfafd44f98582193ba4d9eb48',
    //                 'category_remark': '',
    //                 'category_value': '/sql/index'
    //             },
    //             {
    //                 'category_name': '异常信息',
    //                 'category_id': '59f117da6cf442ffab5913f8749004fe',
    //                 'category_remark': '',
    //                 'category_value': '/exception/index'
    //             },
    //             {
    //                 'category_name': '代码生成',
    //                 'category_id': '31ed411b3b634d4f806ac979572a44dc',
    //                 'category_remark': '',
    //                 'category_value': '/code/index'
    //             }
    //         ],
    //         'category_remark': 'anticon-setting',
    //         'category_value': ''
    //     }
    // ],
    // name: '广汽三菱欧蓝德活动管理后台',
    // app_id: 'b0f1cf1b4705403ea4e2567c7d860f33',
    // menu: [
    //     {
    //         'category_id': 'f9ba71d091a04d7ea953de029ba149ba',
    //         'category_name': '留资管理',
    //         'category_image': 'message',
    //         'category_value': '/guangqi/customer/index'
    //     },
    //     {
    //         'category_id': '31ed411b3b634d4f806ac979572a44dc',
    //         'category_name': '奖品管理',
    //         'category_image': 'gift',
    //         'category_value': '/guangqi/prize/index'
    //     }
    // ],
    // name: '久飞财富快速贷款管理后台',
    // app_id: 'd49579df8f8342699657335868f90561',
    // menu: [
    //     {
    //         'category_id': 'f9ba71d091a04d7ea953de029ba149ba',
    //         'category_name': '申请资料管理',
    //         'category_image': 'message',
    //         'category_value': '/feijiu/fast/customer/index'
    //     }
    // ],
    name: '久飞财富推荐贷款管理后台',
    app_id: 'd49579df8f8342699657335868f90561',
    menu: [
        {
            'category_id': 'f9ba71d091a04d7ea953de029ba149ba',
            'category_name': '申请资料管理',
            'category_image': 'message',
            'category_value': '/feijiu/recommend/customer/index'
        },
        {
            'category_id': '31ed411b3b634d4f806ac979572a44dc',
            'category_name': '商品管理',
            'category_image': 'gift',
            'category_value': '/feijiu/recommend/product/index'
        }
    ],
};
