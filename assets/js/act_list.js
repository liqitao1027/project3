$(function(){
    var layer=layui.layer
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
    
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
    
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
    
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
      }
    //   补零
      function padZero(n) {
        return n > 9 ? n : '0' + n
      }
    var q= {
        pagenum: 1,
        pagesiez: 2,
        cate_id:'',
        state:''
    }
    initCate()
    initTable()
    function initTable() {
        $.ajax({
            method:'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('获取文章列表失败！')
              }
              // 使用模板引擎渲染页面的数据
              var htmlStr = template('tpl-table', res)
              $('tbody').html(htmlStr)
              renderPage(res.total)
            }
        })
    }
    
   
    // 初始化文章分类的方法
    function initCate() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('获取分类数据失败！')
          }
          // 调用模板引擎渲染分类的可选项
          var htmlStr = template('tpl-cate', res)
          $('[name=cate_id]').html(htmlStr)
          // 通过 layui 重新渲染表单区域的UI结构
          form.render()
        }
      })
    }
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
          elem: 'pageBox', // 分页容器的 Id
          count: total, // 总数据条数
          limit: q.pagesize, // 每页显示几条数据
          curr: q.pagenum,// 设置默认被选中的分页
          layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
          limits: [2, 3, 5, 10],
          jump: function(obj , first) {
            // console.log(obj.curr)
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            q.pagenum = obj.curr
            // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
            q.pagesize = obj.limit
            if (!first) {
                initTable()
              }
          }
        })
    }
    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的 id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
          $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
               // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
              initTable()
            }
          })
          layer.close(index)
        })
    })
})