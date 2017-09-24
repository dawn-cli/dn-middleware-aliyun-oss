# dn-middleware-aliyun-oss

这是一个 Dawn 阿里云OSS中件间，可以用此中件间将打包好的静态资源推送到阿里云对象存储中。

## 示例
```yml
  - name: aliyun-oss
    accessKeyId: accessKeyId
    accessKeySecret: accessKeySecret
    bucket: bucket名称
    region: 接入点地域，例如oss-cn-hangzhou
    ossPath: 发布到oss上的路径
    target: 本地的静态资源路径，默认为./build
```

注意：
- oss路径默认增加版本好，版本号为package.json中的version字段
- 发布为覆盖式发布