import constant from '../util/constant';

export default {

    namespace: 'xietong_signup_junior',

    state: {
        app_id: '',
        app_list: [],
        student_name: '',
        id_no: '',
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