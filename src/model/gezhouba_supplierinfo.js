import constant from '../util/constant';

export default {

    namespace: 'gezhouba_supplierinfo',

    state: {
        app_id: '',
        app_list: [],
        supplier_name: '',
        supplier_address: '',
        supplier_tel: '',
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};