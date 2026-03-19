/**
 * build_email.js
 * n8n Code 节点内的 HTML 邮件构建逻辑
 * 完整 HTML 模板（内联样式，兼容主流邮件客户端）
 * 
 * 输入: 排序后的 Top N 职位数组
 * 输出: { subject: string, html: string }
 * 
 * 兼容性: Gmail, Outlook, Apple Mail, Yahoo Mail
 * 特性: 深色模式支持, table 布局, 内联样式
 */

// ==========================================
// 在 n8n Code 节点中使用以下代码
// ==========================================

const items = $input.all();
const config = $('Config').first().json;
const runDate = config.RUN_DATE || new Date().toISOString().split('T')[0];

// ==========================================
// 检查是否无职位（发送空通知）
// ==========================================
if (items.length === 0 || 
    (items.length === 1 && (items[0].json._no_jobs || items[0].json._no_scored_jobs))) {
  
  const emptyHtml = buildEmptyNotificationEmail(runDate, config);
  return [{ json: { 
    subject: `📋 Daily Job Report | ${runDate} | No new matches`, 
    html: emptyHtml 
  }}];
}

const jobs = items.map(i => i.json);
const totalJobs = jobs.length;

// ==========================================
// 工具函数
// ==========================================

/**
 * 根据分数返回对应颜色
 * 90+ 绿色, 70-89 黄色, <70 红色
 */
function getScoreColor(score) {
  if (score >= 90) return '#22c55e';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}

/**
 * 根据分数返回背景色（浅色版本，用于进度条背景）
 */
function getScoreBgColor(score) {
  if (score >= 90) return '#dcfce7';
  if (score >= 70) return '#fef3c7';
  return '#fee2e2';
}

/**
 * 生成推荐行动标签 HTML
 */
function getActionBadge(action) {
  const badges = {
    'apply_now': {
      bg: '#22c55e', 
      text: '🚀 APPLY NOW', 
      border: '#16a34a'
    },
    'worth_applying': {
      bg: '#3b82f6', 
      text: '👍 WORTH APPLYING', 
      border: '#2563eb'
    },
    'low_priority': {
      bg: '#9ca3af', 
      text: '⏸️ LOW PRIORITY', 
      border: '#6b7280'
    }
  };
  
  const badge = badges[action] || badges['low_priority'];
  return `<span style="display:inline-block;background:${badge.bg};color:#ffffff;padding:4px 14px;border-radius:12px;font-size:11px;font-weight:bold;letter-spacing:0.5px;border:1px solid ${badge.border};">${badge.text}</span>`;
}

/**
 * 生成 emoji 进度条（适合邮件客户端显示）
 * @param {number} score - 0-100 的分数
 * @param {string} label - 维度标签
 * @returns {string} HTML 表格行
 */
function buildDimensionRow(score, label, rationale) {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  const color = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
  const bar = color.repeat(filled) + '⚪'.repeat(empty);
  
  // 简短的 rationale 提示
  const tip = rationale ? ` — ${rationale}` : '';
  
  return `
    <tr>
      <td style="padding:3px 0;font-size:12px;color:#6b7280;white-space:nowrap;" width="160">${label}</td>
      <td style="padding:3px 0;font-size:12px;font-family:monospace;" width="180">${bar}</td>
      <td style="padding:3px 0;font-size:13px;font-weight:bold;color:${getScoreColor(score)};text-align:right;" width="40">${score}</td>
    </tr>`;
}

/**
 * HTML 特殊字符转义（防止 XSS 和显示异常）
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 格式化日期显示
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Recent';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  } catch {
    return dateStr.split('T')[0] || 'Recent';
  }
}

// ==========================================
// 构建单个职位卡片
// ==========================================
function buildJobCard(job, rank) {
  const scoreColor = getScoreColor(job.overall_score);
  const scoreBg = getScoreBgColor(job.overall_score);
  const progressWidth = Math.min(Math.max(job.overall_score, 0), 100);
  const scores = job.scores || {};
  
  // 亮点 HTML
  const highlightsHtml = (job.match_highlights || [])
    .slice(0, 3)
    .map(h => `
      <tr>
        <td style="padding:2px 0;font-size:13px;color:#059669;line-height:1.4;">
          ✅ ${escapeHtml(h)}
        </td>
      </tr>`)
    .join('');
  
  // 红旗 HTML
  const redFlagsHtml = (job.red_flags || []).length > 0
    ? job.red_flags.map(f => `
      <tr>
        <td style="padding:2px 0;font-size:13px;color:#dc2626;line-height:1.4;">
          ⚠️ ${escapeHtml(f)}
        </td>
      </tr>`).join('')
    : '';
  
  return `
    <!-- 职位卡片 #${rank} -->
    <tr>
      <td style="padding:6px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" 
               style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;border-collapse:separate;"
               class="card-bg">
          
          <!-- 卡片头部: 标题 + 分数 -->
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- 左侧: 职位信息 -->
                  <td style="vertical-align:top;">
                    <span style="display:inline-block;background:#f3f4f6;color:#6b7280;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:bold;">#${rank}</span>
                    <h3 style="margin:4px 0 4px;font-size:16px;color:#1f2937;font-weight:bold;line-height:1.3;" class="text-dark">
                      ${escapeHtml(job.title)}
                    </h3>
                    <p style="margin:0;font-size:14px;color:#4b5563;font-weight:600;" class="text-dark">
                      🏢 ${escapeHtml(job.company)}
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
                      <tr>
                        <td style="font-size:12px;color:#9ca3af;padding-right:12px;" class="text-muted">
                          📍 ${escapeHtml(job.location)}
                        </td>
                        <td style="font-size:12px;color:#9ca3af;padding-right:12px;" class="text-muted">
                          🕐 ${formatDate(job.posted_date)}
                        </td>
                      </tr>
                    </table>
                    <p style="margin:3px 0 0;font-size:12px;color:#9ca3af;" class="text-muted">
                      💰 ${escapeHtml(job.salary_range || 'Not specified')}
                    </p>
                  </td>
                  
                  <!-- 右侧: 分数和标签 -->
                  <td width="130" style="text-align:center;vertical-align:top;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="text-align:center;">
                          <div style="font-size:36px;font-weight:bold;color:${scoreColor};line-height:1;">
                            ${job.overall_score}
                          </div>
                          <div style="font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">
                            Match Score
                          </div>
                          <div style="margin-top:8px;">
                            ${getActionBadge(job.recommended_action)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Overall 进度条 -->
          <tr>
            <td style="padding:10px 20px 6px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
                           style="background:#f3f4f6;border-radius:4px;overflow:hidden;">
                      <tr>
                        <td style="width:${progressWidth}%;height:8px;background:${scoreColor};border-radius:4px;">
                        </td>
                        <td style="height:8px;">
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- 五维度评分明细 -->
          <tr>
            <td style="padding:4px 20px 10px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${buildDimensionRow(
                    scores.technical_skills_match?.score || 0, 
                    '🔧 Technical Skills',
                    scores.technical_skills_match?.rationale
                  )}
                ${buildDimensionRow(
                    scores.experience_level_match?.score || 0, 
                    '📊 Experience',
                    scores.experience_level_match?.rationale
                  )}
                ${buildDimensionRow(
                    scores.language_requirements?.score || 0, 
                    '🗣️ Language',
                    scores.language_requirements?.rationale
                  )}
                ${buildDimensionRow(
                    scores.industry_domain_fit?.score || 0, 
                    '🏢 Industry Fit',
                    scores.industry_domain_fit?.rationale
                  )}
                ${buildDimensionRow(
                    scores.location_visa_compatibility?.score || 0, 
                    '📍 Location/Visa',
                    scores.location_visa_compatibility?.rationale
                  )}
              </table>
            </td>
          </tr>
          
          <!-- 分隔线 -->
          <tr>
            <td style="padding:0 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid #f3f4f6;font-size:1px;height:1px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          
          <!-- 亮点和红旗 -->
          <tr>
            <td style="padding:10px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${highlightsHtml}
                ${redFlagsHtml}
              </table>
            </td>
          </tr>
          
          <!-- 查看职位按钮 -->
          <tr>
            <td style="padding:6px 20px 16px;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="background:#0077b5;border-radius:6px;">
                    <a href="${escapeHtml(job.linkedin_url)}" 
                       target="_blank" 
                       style="display:inline-block;color:#ffffff;padding:10px 28px;text-decoration:none;font-size:14px;font-weight:bold;font-family:Arial,sans-serif;">
                      🔗 View on LinkedIn
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>`;
}

// ==========================================
// 构建空通知邮件
// ==========================================
function buildEmptyNotificationEmail(runDate, config) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Daily Job Report - No Matches</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" 
               style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e;color:#ffffff;padding:30px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:bold;">📋 Daily Job Report</h1>
              <p style="margin:5px 0 0;opacity:0.8;font-size:14px;">${runDate}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:40px 30px;text-align:center;">
              <p style="font-size:48px;margin:0 0 16px;">🔍</p>
              <h2 style="color:#374151;margin:0 0 12px;font-size:20px;">No New Matching Jobs Today</h2>
              <p style="color:#6b7280;line-height:1.6;font-size:14px;margin:0 0 20px;">
                The automated agent searched for positions matching your profile 
                in the Australian job market over the past 24 hours but found no new matches.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" align="center" 
                     style="background:#f9fafb;border-radius:8px;margin:0 auto;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="color:#6b7280;font-size:13px;margin:0 0 4px;">
                      🔑 <strong>Search keywords:</strong> ${escapeHtml(config.LINKEDIN_SEARCH_KEYWORDS || 'N/A')}
                    </p>
                    <p style="color:#6b7280;font-size:13px;margin:0;">
                      📍 <strong>Location:</strong> ${escapeHtml(config.LINKEDIN_LOCATION || 'Australia')}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                The agent will search again tomorrow at 07:30 AEST.
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">
                🤖 Powered by AI Job Agent
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ==========================================
// 构建完整邮件
// ==========================================

// 计算汇总统计
const applyNowCount = jobs.filter(j => j.recommended_action === 'apply_now').length;
const worthCount = jobs.filter(j => j.recommended_action === 'worth_applying').length;
const avgScore = (jobs.reduce((s, j) => s + (j.overall_score || 0), 0) / jobs.length).toFixed(1);
const topScore = Math.max(...jobs.map(j => j.overall_score || 0));

// 生成所有职位卡片
const jobCardsHtml = jobs.map((job, i) => buildJobCard(job, i + 1)).join('\n');

// 完整邮件 HTML
const fullHtml = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Daily Job Report - ${runDate}</title>
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  
  <style type="text/css">
    /* 深色模式支持 */
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #111827 !important; }
      .card-bg { background-color: #1f2937 !important; border-color: #374151 !important; }
      .text-dark { color: #f3f4f6 !important; }
      .text-muted { color: #9ca3af !important; }
      .section-bg { background-color: #1a1a2e !important; }
      .divider { border-color: #374151 !important; }
    }
    
    /* Outlook 特殊处理 */
    [data-ogsc] .card-bg { background-color: #1f2937 !important; }
    [data-ogsc] .text-dark { color: #f3f4f6 !important; }
    
    /* 移动端自适应 */
    @media only screen and (max-width: 660px) {
      .email-container { width: 100% !important; }
      .stack-column { display: block !important; width: 100% !important; }
    }
  </style>
</head>

<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f3f4f6;-webkit-font-smoothing:antialiased;" class="email-body">

  <!-- 预览文本（邮件列表中显示） -->
  <div style="display:none;font-size:1px;color:#f3f4f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Found ${totalJobs} matching jobs | Top score: ${topScore} | ${applyNowCount} recommended to apply now
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;" class="email-body">
    <tr>
      <td align="center" style="padding:16px;">
        
        <!-- 主容器 -->
        <table width="640" cellpadding="0" cellspacing="0" border="0" 
               style="max-width:640px;width:100%;" class="email-container">
          
          <!-- ============ Banner 头部 ============ -->
          <tr>
            <td style="background-color:#1a1a2e;color:#ffffff;padding:28px 24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:bold;letter-spacing:-0.5px;">
                🎯 Daily Job Report
              </h1>
              <p style="margin:6px 0 0;font-size:14px;opacity:0.8;">
                ${runDate} · Australian Job Market
              </p>
              
              <!-- 统计数据行 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                <tr>
                  <td width="25%" style="text-align:center;padding:8px;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" 
                           style="background:rgba(255,255,255,0.1);border-radius:8px;width:100%;">
                      <tr>
                        <td style="padding:10px 8px;text-align:center;">
                          <div style="font-size:28px;font-weight:bold;line-height:1;">${totalJobs}</div>
                          <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Matched</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="25%" style="text-align:center;padding:8px;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" 
                           style="background:rgba(34,197,94,0.2);border-radius:8px;width:100%;">
                      <tr>
                        <td style="padding:10px 8px;text-align:center;">
                          <div style="font-size:28px;font-weight:bold;color:#86efac;line-height:1;">${applyNowCount}</div>
                          <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Apply Now</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="25%" style="text-align:center;padding:8px;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" 
                           style="background:rgba(59,130,246,0.2);border-radius:8px;width:100%;">
                      <tr>
                        <td style="padding:10px 8px;text-align:center;">
                          <div style="font-size:28px;font-weight:bold;color:#93c5fd;line-height:1;">${worthCount}</div>
                          <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Worth It</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="25%" style="text-align:center;padding:8px;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center" 
                           style="background:rgba(255,255,255,0.1);border-radius:8px;width:100%;">
                      <tr>
                        <td style="padding:10px 8px;text-align:center;">
                          <div style="font-size:28px;font-weight:bold;line-height:1;">${avgScore}</div>
                          <div style="font-size:10px;opacity:0.7;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Avg Score</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- ============ 职位卡片区域 ============ -->
          <tr>
            <td style="background-color:#f9fafb;padding:8px 0;" class="section-bg">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${jobCardsHtml}
              </table>
            </td>
          </tr>
          
          <!-- ============ 底部 Footer ============ -->
          <tr>
            <td style="background-color:#ffffff;padding:24px 30px;border-top:1px solid #e5e7eb;border-radius:0 0 12px 12px;text-align:center;" class="card-bg divider">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;" class="text-muted">
                      📊 This report was automatically generated on ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })} AEST
                    </p>
                    <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;line-height:1.5;" class="text-muted">
                      ⚠️ <strong>Disclaimer:</strong> Scores are AI-generated estimates based on CV-to-JD matching. 
                      Always review job requirements carefully before applying. 
                      The AI may not have access to all relevant information.
                    </p>
                    <p style="margin:8px 0 0;font-size:11px;color:#b0b0b0;">
                      🤖 Powered by Claude AI + n8n Automation
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        <!-- /主容器 -->
        
      </td>
    </tr>
  </table>

</body>
</html>`;

// 构建邮件主题
const subject = `🎯 Daily Job Report | ${runDate} | Found ${totalJobs} matching jobs`;

return [{ json: { subject, html: fullHtml } }];
