# learning-postgres

学 PostgreSQL，后面简称 pg，我先创建了一个简单的 nest + drizzle + pg 的 demo 项目在 [./demo](./demo/) 目录下，后续按照兴趣来逐渐学习pg。

启动 demo:

```bash
cd demo
# 启动 pg
docker compose up -d
# 初始化表
pnpm db:generate
# 启动服务
pnpm start:dev
```

接口试用:

```bash
# 创建用户
curl -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com"}'

# 查询用户（按 id）
curl http://localhost:3000/users/1

# 删除用户
curl -X DELETE http://localhost:3000/users/1
```
