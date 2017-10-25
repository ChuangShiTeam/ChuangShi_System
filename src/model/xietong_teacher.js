import constant from '../util/constant';

export default {

    namespace: 'xietong_teacher',

    state: {
        app_id: '',
        app_list: [],
        organization_id: '',
        organization_list: [],
        teacher_name: '',
        teacher_number: '',
        teacher_category: '',
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