# ��Ŀ����ģ�壬����vue����Ŀ����ʹ�ÿ���.
# package.json 某些字段
# dependencies 可选字段，指示当前包所依赖的其他包。  生产时的要用的包 -save
# main 可选字段。这个字段的值是你程序主入口模块的ID。如果其他用户需要你的包，当用户调用require()方法时，返回的就是这个模块的导出（exports）。    开发是要用的包 --save-dev
#"devDependencies" 可选字段。如果只需要下载使用某些模块，而不下载这些模块的测试和文档框架，放在这个下面比较不错。   
# "scripts" 可选字段，object。Key是生命周期事件名，value是在事件点要跑的命令。参考npm-scripts。    
# "bugs" 可选字段，问题追踪系统的URL或邮箱地址；npm bugs用的上。    
# "homepage" 可选字段，没有http://等带协议前缀的URL。


# resetElement.less  可能和elementui内部有冲突，建议换名字
# 引入eacharts, 修改scss文件webapck报错，暂无解决方法