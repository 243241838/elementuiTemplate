import ajax from '@utils/config';
//这个action会被传入一个Object，这个Object里面可能有很多的方法和属性，而你只需要commit方法
const actions = {
    SETUSER({commit}, {user}){
        commit('SET_USER',user);
    },
    SETTOKEN({commit}, {token}){
        commit('SET_TOKEN',token);
    },
    ADDROUTER({commit}, {addRouter}){
        commit('ADD_ROUTER',addRouter);
    },
    SETISCOLLAPSE({commit}, {isCollapse}){
        commit('SET_COLLAPSE',isCollapse);
    },
    SETISWMAIN({commit}, {wmain}){
        commit('SET_COLLAPSE',wmain);
    },
}
export default actions;