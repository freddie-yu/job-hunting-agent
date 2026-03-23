<div align="center">

# 🎯 每日求职 Agent — 澳大利亚

**[English](./README.md) · [中文](./README_CN.md)**

</div>

<div align="center">

<!-- Tech Stack Badges -->
![n8n](https://img.shields.io/badge/n8n-工作流自动化-EA4B71?style=flat&logo=n8n&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude%20AI-Anthropic-D97757?style=flat&logo=anthropic&logoColor=white)
![Apify](https://img.shields.io/badge/Apify-LinkedIn%20抓取-00B7EC?style=flat&logo=apify&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google%20Drive-简历存储-4285F4?style=flat&logo=googledrive&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail-SMTP%20发送-EA4335?style=flat&logo=gmail&logoColor=white)

</div>

> 面向澳大利亚就业市场的自动化每日求职与 AI 智能匹配系统。

本项目是一个 n8n 工作流，每个工作日早晨自动搜索 LinkedIn 最新职位，通过 Claude AI 从 5 个维度对每个职位与您的简历匹配度进行打分，并将排名前 15 的最佳匹配机会以精美的 HTML 邮件报告形式发送到您的邮箱。

---

## 📋 目录

- [架构概览](#架构概览)
- [所需账号](#所需账号)
- [预估运行费用](#预估运行费用)
- [部署步骤（10 步）](#部署步骤10-步)
- [Config 节点变量说明](#config-节点变量说明)
- [评分模型](#评分模型)
- [项目结构](#项目结构)
- [常见问题与故障排查](#常见问题与故障排查)
- [自定义指南](#自定义指南)
- [免责声明](#免责声明)
- [📞 支持 & 联系](#-支持--联系)

---

## 架构概览

工作流遵循 8 阶段、16 节点的流水线，每个工作日 07:30 AEST 自动运行。

---

### 系统架构

<div align="center">

<img src="assets/system-architecture.png" alt="系统架构" width="780"/>

</div>

---

### 数据流

<div align="center">

<img src="assets/pipeline-flow.gif" alt="数据流 — 逐阶段数据流" width="720"/>

*端到端数据流：从定时触发到 Gmail 送达*

</div>

> **阶段说明：** ① 触发 & 配置 → ② CV 预处理 → ③ LinkedIn 数据采集 → ④ AI 输入准备 → ⑤ AI 评分 → ⑥ 解析 & 合并 → ⑦ 排序 & 筛选 → ⑧ 发送邮件

---

## 所需账号

开始部署前，请确保您已注册以下服务：

| # | 服务 | 用途 | 免费套餐 | 注册链接 |
|---|------|------|----------|----------|
| 1 | **n8n** | 工作流自动化引擎 | ✅ 自托管免费；云端从 $20/月 | [n8n.io](https://n8n.io) |
| 2 | **Apify** | 通过 `bebity/linkedin-jobs-scraper` 抓取 LinkedIn 职位 | ✅ 每月 $5 免费额度 | [apify.com](https://apify.com) |
| 3 | **Google Cloud** | Google Drive API（简历获取）+ Gmail API（邮件发送） | ✅ 免费套餐足够使用 | [console.cloud.google.com](https://console.cloud.google.com) |
| 4 | **Anthropic** | Claude AI API，用于职位与简历匹配评分 | ❌ 按用量计费（~$0.15/次） | [platform.claude.com](https://platform.claude.com/) |

---

## 预估运行费用

| 组件 | 每次费用 | 月费（22 个工作日） |
|------|---------|-------------------|
| Apify（抓取 100 个职位） | ~$0.05 – $0.10 | ~$1.10 – $2.20 |
| Claude API（评分约 50 个职位） | ~$0.10 – $0.20 | ~$2.20 – $4.40 |
| Google APIs | 免费 | 免费 |
| n8n（自托管） | 免费 | 免费 |
| **合计** | **~$0.15 – $0.30** | **~$3.30 – $6.60** |

---

## 部署步骤（10 步）

### 第 1 步：安装并启动 n8n

选择以下任一安装方式：

**方式 A — Docker（推荐）**

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE=Australia/Sydney \
  -e TZ=Australia/Sydney \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

**方式 B — npm 全局安装**

```bash
npm install -g n8n
export GENERIC_TIMEZONE=Australia/Sydney
n8n start
```

**方式 C — n8n 云端**

在 [app.n8n.cloud](https://app.n8n.cloud) 注册，无需安装。

启动后，通过 `http://localhost:5678`（或您的云端 URL）访问 n8n 编辑器。

---

### 第 2 步：创建 Google Cloud 项目并启用 API

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 点击 **选择项目** → **新建项目**
   - 项目名称：`job-agent`（或任意名称）
3. 导航至 **APIs & Services → 库**
4. 搜索并**启用**以下 API：
   - **Google Drive API**
   - **Gmail API**
5. 导航至 **APIs & Services → 凭据**
6. 点击 **+ 创建凭据** → **OAuth 2.0 客户端 ID**
   - 应用类型：**Web 应用**
   - 名称：`n8n Job Agent`
   - 已授权的重定向 URI：添加 `http://localhost:5678/rest/oauth2-credential/callback`（如远程托管请替换为实际的 n8n URL）
7. 点击**创建**并记录 **Client ID** 和 **Client Secret**
8. 导航至 **OAuth 同意屏幕**
   - 用户类型：**外部**（如使用 Google Workspace 可选内部）
   - 填写必填字段（应用名称、用户支持邮箱）
   - 添加权限范围：`https://www.googleapis.com/auth/drive.readonly` 和 `https://mail.google.com/`
   - 将您的邮箱添加为测试用户（应用处于测试模式时）

---

### 第 3 步：设置 Apify 账号与 Actor

1. 在 [apify.com](https://apify.com) 注册
2. 前往 **账号 → 设置 → Integrations**
3. 复制您的 **Personal API Token** 并妥善保存
4. 前往 Apify Store 搜索 **bebity/linkedin-jobs-scraper**
   - URL：[https://apify.com/bebity/linkedin-jobs-scraper](https://apify.com/bebity/linkedin-jobs-scraper)
5. 点击 **Try for free** 将其添加到您的 actors
6. 确认您有足够的额度（$5 免费套餐足够初始测试）

---

### 第 4 步：获取 Anthropic Claude API Key

1. 在 [platform.claude.com/](https://platform.claude.com/) 注册
2. 导航至 **Settings → API Keys**
3. 点击 **Create Key**
   - 名称：`n8n-job-agent`
4. 复制 API Key（以 `sk-ant-api03-...` 开头）并妥善保存
5. 导航至 **Settings → Billing**
   - 添加付款方式
   - 建议设置每月消费上限（如 $10）

---

### 第 5 步：将简历上传至 Google Drive

1. 确保您的简历为**文本型 PDF 格式**
   - ✅ 从 Word、Google Docs 或 LaTeX 导出
   - ❌ 扫描件 PDF 无法使用（无法提取文字）
2. 将 PDF 上传到 Google Drive
3. 右键文件 → **共享** → **常规访问** → **知道链接的任何人**（查看者）
   - 也可单独共享给 Google 服务账号邮箱
4. 从 URL 中复制 **File ID**：
   ```
   https://drive.google.com/file/d/[这里是您的文件ID]/view
   ```
   例如：URL 为 `https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqR/view`，则 File ID 为 `1aBcDeFgHiJkLmNoPqR`

---

### 第 6 步：配置 n8n 凭据

在 n8n 编辑器中，前往 **☰ 菜单 → Credentials**，创建以下四组凭据：

#### 6a. Google Drive OAuth2

| 字段 | 值 |
|------|-----|
| **凭据类型** | Google Drive OAuth2 API |
| **Client ID** | _（来自第 2 步）_ |
| **Client Secret** | _（来自第 2 步）_ |

点击 **Sign in with Google** 完成 OAuth 授权流程。

#### 6b. Gmail OAuth2

| 字段 | 值 |
|------|-----|
| **凭据类型** | Gmail OAuth2 API |
| **Client ID** | _（同第 2 步）_ |
| **Client Secret** | _（同第 2 步）_ |

点击 **Sign in with Google** 授权 Gmail 访问。

#### 6c. Apify API Token

| 字段 | 值 |
|------|-----|
| **凭据类型** | Header Auth |
| **Name** | `Authorization` |
| **Value** | `Bearer YOUR_APIFY_API_TOKEN` |

将 `YOUR_APIFY_API_TOKEN` 替换为第 3 步获取的 token。

#### 6d. Claude API Key

| 字段 | 值 |
|------|-----|
| **凭据类型** | Header Auth |
| **Name** | `x-api-key` |
| **Value** | `YOUR_CLAUDE_API_KEY` |

将 `YOUR_CLAUDE_API_KEY` 替换为第 4 步获取的 API Key。

---

### 第 7 步：导入工作流

1. 在 n8n 编辑器中，点击 **☰ 菜单 → Import from File**
2. 选择本项目中的 `workflow/job_agent.json` 文件
3. 工作流将自动打开，包含所有 16+ 个节点和连接配置
4. 确认工作流布局正确（节点应从左到右排列）

---

### 第 8 步：更新 Config 节点变量

1. 双击 **Config** 节点（工作流中第二个节点）
2. 按您的设置编辑 JSON 输出：

```json
{
  "GOOGLE_DRIVE_FILE_ID": "您在第5步获取的实际文件ID",
  "LINKEDIN_SEARCH_KEYWORDS": "Software Engineer,Backend Developer,Full Stack Developer",
  "LINKEDIN_LOCATION": "Australia",
  "RECIPIENT_EMAIL": "your.actual.email@gmail.com",
  "TOP_N_JOBS": 15,
  "AI_BATCH_SIZE": 5,
  "MIN_OVERALL_SCORE": 0,
  "EXCLUDE_KEYWORDS": "intern,junior,graduate,trainee"
}
```

根据您的目标职位调整搜索关键词和排除关键词。

---

### 第 9 步：将凭据绑定到节点

双击以下各节点，从下拉菜单中选择对应凭据：

| 节点名称 | 需选择的凭据 |
|----------|------------|
| **RetrieveCV** | Google Drive OAuth2 |
| **LinkedIn** | Apify API Token（Header Auth） |
| **Fetch Dataset** | Apify API Token（Header Auth） |
| **Score the Job** | Claude API Key（Header Auth） |
| **Send Email** | Gmail OAuth2 |
| **Send Empty Notification** | Gmail OAuth2 |

---

### 第 10 步：测试与激活

1. **手动测试运行**
   - 点击顶部工具栏的 **Execute Workflow** 按钮（▶️）
   - 等待工作流完成（通常需要 2–5 分钟）
   - 点击各节点查看输出数据
   - 验证各阶段输出：
     - `RetrieveCV`：应显示 PDF 二进制数据
     - `Extract from File`：应显示提取的文本内容
     - `LinkedIn`：应显示 Apify 运行响应
     - `NormalizeData`：应显示标准化的职位对象
     - `Score the Job`：应显示 Claude API 响应
     - `Build Email HTML`：应显示 HTML 字符串
     - `Send Email`：应显示成功确认

2. **检查收件箱**
   - 您应收到每日职位报告邮件
   - 确认邮件正常渲染（分数、进度条、按钮）

3. **激活工作流**
   - 将右上角的 **Active** 开关拨到 **ON**
   - 工作流将在每个工作日 07:30 AEST 自动运行

4. **监控执行记录**
   - 前往 **☰ 菜单 → Executions** 查看历史运行记录
   - 失败的执行将显示详细错误信息以供调试

---

## Config 节点变量说明

| 变量 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `GOOGLE_DRIVE_FILE_ID` | string | — | 简历 PDF 文件的 Google Drive File ID |
| `LINKEDIN_SEARCH_KEYWORDS` | string | — | 逗号分隔的搜索关键词（如 `"Software Engineer,Backend Developer"`） |
| `LINKEDIN_LOCATION` | string | `"Australia"` | 地理搜索区域 |
| `RECIPIENT_EMAIL` | string | — | 接收每日报告的邮箱地址 |
| `TOP_N_JOBS` | number | `15` | 报告中包含的最高评分职位数量 |
| `AI_BATCH_SIZE` | number | `5` | 每次 AI 评分 API 调用的职位数（建议 3–5） |
| `MIN_OVERALL_SCORE` | number | `0` | 最低分数阈值（低于此分数的职位将从报告中排除） |
| `EXCLUDE_KEYWORDS` | string | `""` | 逗号分隔的排除关键词（与职位标题匹配） |

---

## 评分模型

每个职位从 5 个加权维度进行评估：

| 维度 | 权重 | 衡量内容 |
|------|------|----------|
| `technical_skills_match` | 35% | 技术栈、工具、证书与简历技能的匹配度 |
| `experience_level_match` | 25% | 工作年限、资历级别、岗位复杂度 |
| `language_requirements` | 15% | 英语水平要求、其他语言需求 |
| `industry_domain_fit` | 15% | 行业背景与目标职位的相关性 |
| `location_visa_compatibility` | 10% | 工作签证、地点、远程/混合办公兼容性 |

**综合评分公式：**

```
overall_score = (technical × 0.35) + (experience × 0.25) + (language × 0.15) 
              + (industry × 0.15) + (location × 0.10)
```

**推荐行动映射：**

| 行动 | 条件 |
|------|------|
| 🚀 `apply_now`（立即申请） | 综合分 ≥ 80 且无重大红旗 |
| 👍 `worth_applying`（值得申请） | 综合分 ≥ 60 且无重大红旗 |
| ⏸️ `low_priority`（低优先级） | 综合分 < 60 或存在重大红旗 |

---

## 项目结构

```
daily-job-agent/
│
├── workflow/
│   └── job_agent.json              # 完整的 n8n 工作流 JSON（导入此文件）
│
├── scripts/
│   ├── score_jobs.js               # AI 评分预处理 & JSON Schema 验证
│   ├── build_email.js              # HTML 邮件模板构建器（表格布局）
│   └── normalize_linkedin.js       # LinkedIn 数据清洗 & 标准化
│
├── config/
│   ├── example.env                 # 环境变量参考（含注释）
│   └── ai_prompt.txt               # Claude AI 系统提示词（可编辑）
│
└── README.md                       # 本文档文件
```

---

## 常见问题与故障排查

### 常规问题

**Q：工作流首次运行失败，应该先检查什么？**

A：最常见的问题是凭据配置错误。在 n8n 编辑器中：
1. 检查每个使用凭据的节点（RetrieveCV、LinkedIn、Fetch Dataset、Score the Job、Send Email）
2. 点击节点 → 确认凭据已选择并显示绿色对勾
3. 对于 Google 凭据，可能需要点击"Sign in with Google"重新授权
4. 查看 **Executions** 页面获取具体错误信息

---

### LinkedIn / Apify 问题

**Q：Apify 返回空结果（找到 0 个职位）**

A：可能原因：
- **搜索关键词过窄**：尝试更宽泛的词（如用 "Developer" 代替 "Senior Kotlin Backend Developer"）
- **LinkedIn 反爬措施**：Apify 代理可能被临时封锁，等待 1 小时后重试
- **Actor 订阅**：确保已在 Apify Store 订阅 `bebity/linkedin-jobs-scraper`
- **额度不足**：在 [console.apify.com/billing](https://console.apify.com/billing) 检查账户余额
- **日期过滤**：`datePosted: "past-24h"` 在某些日子可能过滤掉所有职位，测试时可改为 `"past-week"`

**Q：如何将 RapidAPI 作为 LinkedIn 数据的备用方案？**

A：如果 Apify 不可用，可切换到 RapidAPI LinkedIn Jobs Search API：
1. 在 [rapidapi.com](https://rapidapi.com/jaypat87/api/linkedin-jobs-search) 注册
2. 将 LinkedIn 节点的 URL 替换为：`https://linkedin-jobs-search.p.rapidapi.com/`
3. 更新 Header Auth 凭据：
   - 添加 header `X-RapidAPI-Key`：您的 RapidAPI key
   - 添加 header `X-RapidAPI-Host`：`linkedin-jobs-search.p.rapidapi.com`
4. 调整请求体以匹配 RapidAPI 的期望格式
5. NormalizeData 节点应能自动处理不同字段名

---

### AI 评分问题

**Q：收到 Claude API 的 "429 Too Many Requests" 错误**

A：表示已触发速率限制。解决方案：
- **减小批次大小**：在 Config 节点中将 `AI_BATCH_SIZE` 从 5 改为 3
- **添加延迟**：在 `SplitInBatches` 和 `Score the Job` 之间插入一个 **Wait** 节点（2 秒）
- **使用更便宜的模型**：在 Score the Job 节点中将 `claude-sonnet-4-20250514` 换为 `claude-3-5-haiku-20241022`
- 工作流包含自动重试逻辑，临时性 429 错误可能自行恢复

**Q：AI 返回无效 JSON — 分数缺失或格式错误**

A：`Parse and Merge Scores` 节点包含自动 JSON 修复：
- 移除 Markdown 代码围栏（` ```json `）
- 修复末尾逗号
- 用默认分数 50 填充缺失维度
- 使用明确公式重新计算 overall_score
- 如某职位完全解析失败，将被跳过（不出现在报告中）

**Q：分数似乎不准确，或过于宽松/严格**

A：可以微调 AI 行为：
1. 编辑 `config/ai_prompt.txt` 中的系统提示词
2. 更新 `Score the Job` 节点请求体中的提示词
3. 常见调整：
   - 添加您希望更高权重的特定技能
   - 明确说明您的签证状态
   - 添加行业背景以提升领域匹配精度
4. 也可调整 `MIN_OVERALL_SCORE` 以过滤低置信度匹配

---

### CV / Google Drive 问题

**Q：PDF 文本提取返回乱码或空内容**

A：这种情况发生在图片型或扫描型 PDF 上：
- **解决方案**：确保简历为**文本型 PDF**（从 Word、Google Docs、LaTeX 等导出）
- **测试**：在 PDF 阅读器中尝试选中/复制文字。如果无法选中，则为图片型 PDF
- **转换**：如果是图片 PDF，可用 [Google Docs](https://docs.google.com) 打开（会自动 OCR），然后重新导出为 PDF

**Q：Google Drive 返回 "File not found" 错误**

A：请检查：
1. Config 节点中的 `GOOGLE_DRIVE_FILE_ID` 正确（无多余空格）
2. 文件已与 n8n 凭据中连接的 Google 账号共享
3. 如使用服务账号，需将文件共享给服务账号的邮箱地址
4. 文件未被移入回收站

---

### 邮件问题

**Q：成功运行后未收到邮件**

A：请检查：
1. **Gmail 已发送文件夹**：邮件应出现在发件人的已发送文件夹中
2. **垃圾邮件文件夹**：检查收件人的垃圾/垃圾邮件文件夹
3. **RECIPIENT_EMAIL**：确认 Config 节点中的邮箱地址正确
4. **Gmail OAuth**：OAuth token 可能已过期 — 在 n8n Credentials 中重新授权
5. **Gmail 发送限制**：免费 Gmail 账号每日发送上限为 500 封邮件

**Q：邮件在 Outlook 中显示异常**

A：邮件模板使用基于表格的布局以确保最大兼容性。但 Outlook 存在已知渲染问题：
- 工作流包含针对 Outlook 的 MSO 条件注释
- Emoji 进度条在所有客户端应能正常渲染
- 背景渐变在 Outlook 中可能退化为纯色（这是正常现象）

---

### 性能与调度问题

**Q：可以更改运行时间吗？**

A：可以。双击 **Schedule Trigger** 节点并调整：
- **Hour**：从 7 改为您偏好的小时（以 n8n 服务器时区为准）
- **Minute**：从 30 改为您偏好的分钟
- **Days**：当前设置 `1-5` 表示周一至周五，改为 `*` 则每天运行

**Q：工作流运行时间过长**

A：典型执行时间为 2–5 分钟。如果更长：
- 将 LinkedIn 节点的 `rows` 从 100 减少到 50
- 将 `AI_BATCH_SIZE` 从 5 减少到 3（API 调用次数减少，但每次请求更大）
- 提高 `MIN_OVERALL_SCORE` 以提前跳过低潜力职位的评分
- 检查 Apify 运行是否超时（增加 `waitForFinish` 参数）

**Q：如何手动测试运行工作流？**

A：直接点击 n8n 编辑器工具栏中的 **Execute Workflow** 按钮（▶️）即可。手动执行时 Schedule Trigger 节点会被绕过。

---

## 自定义指南

### 添加更多搜索地点

编辑 LinkedIn 节点的请求体以包含多个地点：

```json
{
  "searchQueries": ["Software Engineer"],
  "location": "Sydney, Australia",
  "locationList": ["Sydney", "Melbourne", "Brisbane", "Perth"],
  "datePosted": "past-24h",
  "rows": 100
}
```

### 更换 AI 模型

在 **Score the Job** 节点中修改请求体中的 `model` 字段：

| 模型 | 速度 | 质量 | 费用 |
|------|------|------|------|
| `claude-sonnet-4-20250514` | 中等 | 最佳 | ~$0.015/1K tokens |
| `claude-3-5-haiku-20241022` | 快速 | 良好 | ~$0.001/1K tokens |

### 添加 Slack 通知

1. 在 `Send Email` 节点后添加 **Slack** 节点
2. 配置您的 Slack Webhook URL
3. 发送摘要消息："🎯 今日找到 {N} 个职位。最佳匹配：{title} at {company}（{score} 分）"

### 将结果存储到 Google Sheets

1. 在 `Rank and Top N` 节点后添加 **Google Sheets** 节点
2. 配置为向追踪电子表格追加行
3. 适合长期分析趋势

---

## 免责声明

⚠️ **重要提示：**

1. **AI 准确性**：评分是基于简历与职位描述文本匹配的 AI 估算，不保证实际适合度。申请前请务必仔细阅读职位要求。

2. **LinkedIn 服务条款**：本工具使用 Apify 的商业抓取基础设施，通过合规代理网络运行。但用户有责任确保其使用行为符合所在司法管辖区 LinkedIn 服务条款的规定。

3. **数据隐私**：您的简历文本将发送至 Anthropic Claude API 进行处理。请在 [anthropic.com/privacy](https://www.anthropic.com/privacy) 查阅 Anthropic 的数据处理政策。本工作流不会永久存储任何简历数据。

4. **不会自动投递简历**：本工具不会代您提交职位申请，仅用于识别和评分匹配机会。

---

## 📞 支持 & 联系

有任何问题或建议，随时联系 cunliangyu19@gmail.com 或在项目仓库中创建问题。
