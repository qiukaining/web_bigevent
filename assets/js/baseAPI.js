// 每次调用的时候，会先调用这个函数
// 在这个函数里可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(options){
    //在发起真正的Ajax之前，统一拼接请求的根路径
    options.url='http://www.liulongbin.top:3007'+ options.url

    // 统一为有权限的接口，设置 headers 请求头
    // 请求头配置对象
    if (options.url.indexOf('/my/') !== -1) {
        options.headers={
            Authorization:localStorage.getItem('token') || ''
        } 
    }
    // 全局统一挂载 complete 回调函数
    // 不论成功还是失败，最终都会调用 complete回调函数
    options.complete=function(res){
        // console.log('ok');
        // console.log(res);
        // 在 complete 回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 1.强制清空token
            localStorage.removeItem('token')
            // 2.强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})