# ADR-001：MySQL EF Core Provider 选型与版本锁定

- 状态：已接受，待项目负责人确认
- 日期：2026-11-17
- 决策范围：后端持久化层依赖（EF Core 10 + MySQL 8.4 LTS）
- 相关文档：`docs/ARCHITECTURE.md` 第 4 章与第 15 章、`docs/DATABASE.md` 第 8 章

## 1. 背景

技术基线已固定为 ASP.NET Core 10 + EF Core 10 + MySQL 8.4 LTS，且 `docs/ARCHITECTURE.md` 明确要求：

- MySQL Provider 必须明确支持项目采用的 EF Core 主版本；
- 不得为了使用某个 Provider 擅自降级 .NET 或 EF Core；
- 依赖版本必须锁定。

在 EF Core 10（2025-11 发布，LTS）环境下，MySQL Provider 不存在可直接套用的默认答案，因此本阶段作为唯一待验证项单独决策。

调研事实（2026-11-17 核对 NuGet 索引）：

| 候选包 | 最新稳定版 | 声明支持的 EF Core | 许可证 |
|---|---|---|---|
| `Pomelo.EntityFrameworkCore.MySql` | 9.0.0 | 仅 EF Core 9.0.x | MIT |
| `Microting.EntityFrameworkCore.MySql`（Pomelo 更名后的社区维护分支） | 10.0.14 | EF Core [10.0.14, 10.0.999] | MIT |
| `MySql.EntityFrameworkCore`（Oracle 官方） | 10.0.12 | EF Core 10.0.12（另有 11.0.0-preview） | GPL-2.0-only WITH Universal-FOSS-exception-1.0 |

## 2. 决策

采用：

| 包 | 版本 | 说明 |
|---|---|---|
| `Microting.EntityFrameworkCore.MySql` | 10.0.14 | Pomelo 代码库更名后的分支，MIT，基于 MySqlConnector |
| `MySqlConnector` | 2.6.2 | Provider 要求的最低版本，显式锁定防漂移 |
| `Microsoft.EntityFrameworkCore` / `.Relational` / `.Design` | 10.0.14 | 与 Provider 声明的下界一致 |
| `Microsoft.AspNetCore.OpenApi` | 10.0.14 | 与 ASP.NET Core 10 补丁版本对齐 |
| `Microsoft.AspNetCore.Mvc.Testing` | 10.0.14 | 集成测试宿主 |

即：**EF Core 10.0.14 + Microting.EntityFrameworkCore.MySql 10.0.14 + MySqlConnector 2.6.2**，全部精确锁定（不使用 `^`/`*` 范围），`obj/project.assets.json` 与 `package-lock.json` 一并纳入版本控制。

## 3. 备选方案与取舍

### 方案 A：`Pomelo.EntityFrameworkCore.MySql` 9.0.0（否）

- 优点：生态最成熟、文档与社区案例最多、MIT。
- 否决原因：包内声明 `Microsoft.EntityFrameworkCore.Relational [9.0.0, 9.0.999]`，无法与 EF Core 10 共存。要么把 EF Core 降到 9（违反技术基线，且 .NET 10 + EF Core 9 + Design 10 会触发 NU1107/NU1608，运行时 `MissingMethodException`），要么强行抑制警告——两者都不可接受。
- 官方仓库在 EF Core 10 发布后未提供兼容版本，上游维护已停滞。

### 方案 B：`MySql.EntityFrameworkCore` 10.0.12（Oracle 官方，否）

- 优点：数据库厂商官方维护，版本节奏跟随 EF Core；无需依赖社区分支。
- 否决原因（决定性）：许可证为 **GPL-2.0-only WITH Universal-FOSS-exception-1.0**，且 `requireLicenseAcceptance=true`。该例外仅适用于以 FOSS 许可证发布的宿主应用；VERINEX 官网为闭源商业站点，采用该包会引入 GPL 传染性与商业授权（Oracle 商业许可）的法务风险，远超本项目的收益。
- 次要原因：依赖 Oracle 的 `MySql.Data` 连接器，异步实现与连接池行为弱于 MySqlConnector；历史版本在迁移生成与 LINQ 翻译上的坑更多。

### 方案 C：Dapper / 原生 MySqlConnector（否）

- 优点：依赖最少、SQL 完全可控。
- 否决原因：`docs/DATABASE.md` 与 `docs/ARCHITECTURE.md` 已把 EF Core Migrations 作为唯一结构管理方式，改用 Dapper 属于架构变更，且需自行实现迁移、映射与事务边界。

### 方案 D：自行 fork Pomelo 并对齐 EF Core 10（否）

- 优点：完全可控。
- 否决原因：维护成本高（需跟进 EF Core 每个补丁的 breaking change），对单人/小团队不划算；社区已有同源分支可用。

### 为什么不选“锁定 .NET 9 + EF Core 9 + Pomelo 9”

技术上最稳妥，但 `docs/ARCHITECTURE.md` 与 `docs/PRD.md` 已把 ASP.NET Core 10 / EF Core 10 定为基线，降级属于需项目负责人批准的架构变更，且 EF Core 10 为 LTS（支持到 2028-11），长期收益更高。

## 4. 影响

### 正面

- 满足 EF Core 10 + MySQL 8.4 基线，无需降级任何组件。
- MIT 许可证，无 GPL 传染性，闭源商业站点可安全使用。
- 沿用 Pomelo 的 API 与 Fluent 配置写法（`UseMySql` / `MySqlServerVersion` / `ServerVersion`），后续若上游恢复发布或切换官方包，只需替换包名与 `using`，业务代码不变。
- 基于 MySqlConnector，真异步、连接池质量好。

### 负面与风险

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| 社区分支由 Microting 维护，非原 Pomelo 团队 | 长期维护不确定性；重大 EF Core 版本可能滞后 | 已在 `AppDbContext` 中隔离 Provider 接入点；升级 EF Core 前先核对该分支的兼容矩阵；关注上游仓库动态 |
| 包名与命名空间从 `Pomelo.*` 改为 `Microting.*` | 示例代码/文档中的 `using` 需替换 | 仅在 `Program.cs`、测试与 `AppDbContext` 三处出现，已集中 |
| `MySqlConnector` 3.x 已发布，Provider 仅声明 ≥2.6.2 | 误升级可能引入不兼容 | 显式锁定 2.6.2，升级需单独验证 |
| 迁移工具链（`dotnet ef`）与本 Provider 组合需实测 | 生成迁移可能报错 | 下一阶段首次建表时用 `dotnet ef migrations add` 实测；失败则回退到方案 B 评估（需先解决许可证） |

### 退出条件（重新评估的触发点）

1. `Pomelo.EntityFrameworkCore.MySql` 发布 EF Core 10 兼容版本 → 优先迁回上游。
2. Microting 分支连续两个 EF Core 补丁版本未跟进 → 启动重新选型。
3. 项目决定开源（FOSS 许可证发布）→ 可重新评估 Oracle 官方包。

## 5. 验证记录

| 验证项 | 命令 | 结果 |
|---|---|---|
| 依赖还原 | `dotnet restore backend/Verinex.sln` | 见第 6 节执行记录 |
| 后端编译 | `dotnet build backend/Verinex.sln -c Release` | 见第 6 节执行记录 |
| 单元测试（Provider 接线与空模型守卫） | `dotnet test backend/tests/Verinex.UnitTests` | 见第 6 节执行记录 |
| 集成测试（/health/live） | `dotnet test backend/tests/Verinex.IntegrationTests` | 见第 6 节执行记录 |

## 6. 执行记录

本机未安装 .NET SDK，构建与测试在 `mcr.microsoft.com/dotnet/sdk:10.0` 容器内执行（挂载 `backend/` 目录）。实际命令与结果：

```powershell
# 编译（含依赖还原）
docker run --rm -v "C:\...\backend:/src" -w /src mcr.microsoft.com/dotnet/sdk:10.0 `
  dotnet build Verinex.sln -c Release
# => Build succeeded. 0 Warning(s) 0 Error(s)

# 测试
docker run --rm -v "C:\...\backend:/src" -w /src mcr.microsoft.com/dotnet/sdk:10.0 `
  dotnet test Verinex.sln -c Release --no-build
# => Verinex.IntegrationTests: Passed 1 / Failed 0
# => Verinex.UnitTests:        Passed 2 / Failed 0
```

结论：`Microting.EntityFrameworkCore.MySql 10.0.14` + `MySqlConnector 2.6.2` + EF Core `10.0.14` 组合在 .NET 10 下可正常还原、编译，并可通过 `UseMySql` 构建模型（无 NU1608 / NU1107 版本冲突警告）。

> 说明：本节记录的是本阶段实际执行结果；若后续依赖或 SDK 变化，需重新执行并更新本节。首次执行 `dotnet ef migrations add`（下一阶段建表）时需再次确认迁移工具链与 Provider 的兼容性。
