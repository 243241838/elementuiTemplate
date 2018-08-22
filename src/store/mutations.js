const mutations = {
    SET_USER: (state, user) => {
        state.user = user;
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    ADD_ROUTER: (state, addRouter) => {
        state.addRouter = addRouter;
    },
    SET_COLLAPSE: (state, isCollapse) => {
        state.isCollapse = !isCollapse;
    },
    SET_WAIN: (state, wmain) => {
        state.wmain = wmain;
    }
}
export default mutations;