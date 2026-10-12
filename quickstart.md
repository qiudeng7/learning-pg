# quickstart

用 docker compose 启动一个pg

```yaml
services:
  pg:
    image: postgres:18-alpine
    # 只设密码，user / database 都用镜像默认的 postgres
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  pgdata:
```


## 通过 sdk 或 cli 访问

cli 用 psql，进容器连（镜像自带）：

```bash
docker compose exec pg psql -U postgres
```

进去后用元命令看库和表：

```sql
\l        -- 列出数据库
\dt       -- 列出当前库的表
\d users  -- 看 users 表结构
```

然后可以随便跑点 sql 语句。

sdk连接可以参考demo里的例子，大概像这样

```ts
const pool = new Pool({ connectionString: 'postgres://postgres:postgres@localhost:5432/postgres' })
const db = drizzle(pool, { schema })
```

### webui dashboard

drizzle 提供了 dashboard

```bash
cd demo && pnpm db:studio  # drizzle 自带，http://localhost:4983
```

不过这个 dashboard 不像是用来运维的，更像开发调试的。

运维的话有两个方向，一个是浏览数据库对象、管理角色和权限、运行 SQL的，可以选择通用一些的dbx、dbeaver这种；另一种是性能监控，PostgreSQL 数据库指标可以通过 postgres_exporter 等采集器接入 Prometheus，再由 Grafana 展示。

## 配置 pg


pg 的设置有不同的作用范围：

1. pg 的配置文件 `postgresql.conf` 是实例级别：大部分参数 reload 生效，还有一些要重启。
2. `ALTER SYSTEM` 同样作用于实例，也是 reload（或重启）后生效。
   1. 这个修改会应用到 postgresql.auto.conf，优先级高于上面的配置文件
3. `ALTER DATABASE` 语句可以修改数据库级别，对新连接生效；
4. `ALTER ROLE` 语句修改用户级别，对新连接生效
5. `SET` 语句修改当前 session
6. `SET LOCAL` 修改当前 transaction

除了这几个，还有启动命令参数、连接时的 PGOPTIONS，后面会按使用场景介绍。


先看配置文件在哪:

```bash
$ docker compose exec pg psql -U postgres -c "SHOW config_file;"
                  config_file                  
-----------------------------------------------
 /var/lib/postgresql/18/docker/postgresql.conf
(1 row)
```

再看 pg 目前有哪些设置:
```bash
$ docker compose exec pg psql -U postgres -c "SELECT name, setting, context FROM pg_settings LIMIT 10;"
            name            |  setting   |  context   
----------------------------+------------+------------
 allow_alter_system         | on         | sighup
 allow_in_place_tablespaces | off        | superuser
 allow_system_table_mods    | off        | superuser
 application_name           | psql       | user
 archive_cleanup_command    |            | sighup
 archive_command            | (disabled) | sighup
 archive_library            |            | sighup
 archive_mode               | off        | postmaster
 archive_timeout            | 0          | sighup
 array_nulls                | on         | user
(10 rows)
```

`context` 那一列就是生效档位：`internal`=不可改，`postmaster`=必须重启，`sighup`=reload 生效，`superuser`=超级用户可改，`user`=会话内 `SET`。



## 插件

pg 能装很多扩展，暂时知道这个点就行，后续再深入了解。

```sql
SELECT name FROM pg_available_extensions ORDER BY name;  -- 能装啥
CREATE EXTENSION IF NOT EXISTS pgcrypto;                 -- 装一个
SELECT * FROM pg_extension;                              -- 装了啥
```

