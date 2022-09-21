$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat =function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() +1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y +'-'+ m +'-'+ d + '' + hh +':' + mm +':'+ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0'+ n
    }

    // 定义一个查询的参数对象
    var q = {
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }

    initTable()

    initCate()

    // 获取列表数据的方法
    function initTable() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用分页的方法
                rederPage(res.total)
            }
        })
    }

     // 初始化文章分类的方法
     function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                // 调用模板引擎分类的可选项
               var htmlStr = template('tpl-cate',res)
               $('[name=cate_id]').html(htmlStr)
               // 通知layui重新渲染表单区域的UI结构
               form.render()
            }
         })
     }

     // 为筛选表单绑定 submit 事件
     $('#form-serach').on('submit',function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state =$('[name=state]').val()
        q.cate_id = cate_id
        q.state = state

        // 重新渲染
        initTable()
     })

     // 定义渲染分页的方法
     function rederPage(total) {
        // console.log(total);

        // 调用laypage.render（）方法来渲染分页结构
        laypage.render({
            elem:'pageBox', // 分页容器id
            count:total,   // 总数据条数
            limit:q.pagesize, // 每页显示数据条数
            curr:q.pagenum, // 指定默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            //分页发生切换的时候，触发 jump 回调
            jump:function (obj,first) {
                console.log(first);
                // console.log(obj.curr);
                q.pagenum = obj.curr

                // 把最新的条目数赋值到pagesize属性中
                q.pagesize = obj.limit

                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
     }

     // 通过代理形式为删除事件绑定点击事件处理函数
     $('tbody').on('click','btn-delete',function () {

        var len = $('.btn-delete').length

        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成后，需要判断这一页中是否还有剩余的数据，没有让页码值减一，在重新调用initTable() 
                    if (len === 1) {
                        // 如果len等于1，说明删除后没有没有数据
                        //页码值最小必须是1
                        q.pagenum =  q.pagenum ===1 ? 1:q.pagenum-1
                    }
                    initTable() 
                }
            })
            layer.close(index);
          });
     })
})
