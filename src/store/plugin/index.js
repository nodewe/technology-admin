export default Store=>{
    let userInfo = localStorage.getItem('userInfo');
    if(userInfo){
        userInfo = JSON.parse(userInfo);
        Store.dispatch('saveUserInfo',userInfo)
    }
}