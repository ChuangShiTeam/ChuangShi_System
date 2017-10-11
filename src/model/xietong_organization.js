import constant from '../util/constant';

export default {

    namespace: 'xietong_organization',

    state: {
        app_id: '',
        app_list: [],
        organization_name: '',
        organization_code: '',
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