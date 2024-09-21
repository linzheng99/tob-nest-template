## 本地开发

* 安装依赖
```ssh
pnpm install
```

* 服务启动
```ssh
# 启动MySql服务
docker compose --env-file .env --env-file .env.development run -d --service-ports mysql
# 启动Redis服务
docker compose --env-file .env --env-file .env.development run -d --service-ports redis
```

* 项目启动
```ssh
pnpm dev
```

* 打包
```ssh
pnpm build
```

## 快速启动
* 启动镜像
```ssh
pnpm docker:up
```

* 关闭镜像
```ssh
pnpm docker:down
```

## Task
* 拦截器
	- [x] 成功数据的转换拦截器
	- [x] 异常请求的拦截器
	- [x] 业务逻辑的拦截器
* shared
	- [x] mysql
	- [x] redis
* 文档
	- [x] swagger
* 模块
	- [x] User
	- [x] Menu
	- [x] Auth
	- [x] Role
* 日志
	- [x] Logger
