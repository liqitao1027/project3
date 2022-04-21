$(function() {
    var form = layui.form


    form.verify ({
        nickname: function(value) {
            if (value.length > 6) {
              return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
          }
   
    })
})

    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success: function(res) {
                if(res.status!==0) {
                    return layer.message('获取用户基本信息成功！')
                }
               
                // form.val（）快熟表单赋值
                form.val('formUserInfo',res.data)  
            }    
    }) 
    }
$('#btnReset').on('click',function(e) {
    e.preventDefault()
       initUserInfo()
})
$('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
