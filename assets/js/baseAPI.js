// 每次调用的时候，会先调用这个函数
// 在这个函数里可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function(options){
    //在发起真正的Ajax之前，统一拼接请求的根路径
    options.url='http://www.liulongbin.top:3007'+ options.url
    console.log(options.url);
})