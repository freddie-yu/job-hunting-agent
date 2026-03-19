/**
 * score_jobs.js
 * n8n Code 节点内的评分预处理逻辑
 * 用于: Prepare AI Input 和 Parse and Merge Scores 节点
 * 
 * 功能:
 * 1. JSON Schema 定义和验证
 * 2. 批次构造
 * 3. overall_score 显式加权计算
 * 4. AI 输出解析和修复
 */

// ==========================================
// 1. 评分维度定义（权重固定不可更改）
// ==========================================
const SCORING_DIMENSIONS = {
  technical_skills_match: {
    weight: 0.35,
    label: 'Technical Skills Match',
    description: 'Compare required tech stack, tools, certifications against demonstrated skills'
  },
  experience_level_match: {
    weight: 0.25,
    label: 'Experience Level Match',
    description: 'Compare years of experience, seniority level, role complexity'
  },
  language_requirements: {
    weight: 0.15,
    label: 'Language Requirements',
    description: 'English proficiency and additional language requirements'
  },
  industry_domain_fit: {
    weight: 0.15,
    label: 'Industry Domain Fit',
    description: 'Relevance of industry background to target role domain'
  },
  location_visa_compatibility: {
    weight: 0.10,
    label: 'Location & Visa Compatibility',
    description: 'Australian work rights, location proximity, remote/hybrid fit'
  }
};

// 验证权重总和为1.0
const totalWeight = Object.values(SCORING_DIMENSIONS)
  .reduce((sum, dim) => sum + dim.weight, 0);
if (Math.abs(totalWeight - 1.0) > 0.001) {
  throw new Error(`权重总和异常: ${totalWeight}, 应为 1.0`);
}

// ==========================================
// 2. JSON Schema 验证函数
// ==========================================

/**
 * 验证单个评分对象是否符合 Schema
 * @param {Object} scoreObj - AI 返回的评分对象
 * @returns {{ valid: boolean, errors: string[], fixed: Object }}
 */
function validateAndFixScoreObject(scoreObj) {
  const errors = [];
  const fixed = JSON.parse(JSON.stringify(scoreObj)); // 深拷贝

  // 验证 job_id
  if (!fixed.job_id) {
    errors.push('缺少 job_id 字段');
  } else {
    fixed.job_id = String(fixed.job_id); // 确保是字符串
  }

  // 验证 scores 对象
  if (!fixed.scores || typeof fixed.scores !== 'object') {
    errors.push('缺少 scores 对象');
    fixed.scores = {};
  }

  // 验证每个维度
  for (const [dimName, dimDef] of Object.entries(SCORING_DIMENSIONS)) {
    if (!fixed.scores[dimName]) {
      errors.push(`缺少评分维度: ${dimName}`);
      // 自动修复：设置默认值 50 分
      fixed.scores[dimName] = {
        score: 50,
        weight: dimDef.weight,
        rationale: 'Dimension not evaluated by AI - default score assigned'
      };
    } else {
      const dim = fixed.scores[dimName];
      
      // 验证分数范围
      if (typeof dim.score !== 'number' || isNaN(dim.score)) {
        errors.push(`${dimName} 分数不是数字: ${dim.score}`);
        dim.score = parseInt(dim.score) || 50;
      }
      dim.score = Math.max(0, Math.min(100, Math.round(dim.score))); // 限制在 0-100 并取整
      
      // 强制使用固定权重（防止 AI 修改权重）
      dim.weight = dimDef.weight;
      
      // 验证 rationale
      if (typeof dim.rationale !== 'string') {
        dim.rationale = '';
      }
      // 截断过长的 rationale
      if (dim.rationale.length > 200) {
        dim.rationale = dim.rationale.substring(0, 197) + '...';
      }
    }
  }

  // 验证 match_highlights
  if (!Array.isArray(fixed.match_highlights)) {
    errors.push('match_highlights 不是数组');
    fixed.match_highlights = [];
  }
  fixed.match_highlights = fixed.match_highlights
    .filter(h => typeof h === 'string' && h.trim().length > 0)
    .slice(0, 3); // 最多3条

  // 验证 red_flags
  if (!Array.isArray(fixed.red_flags)) {
    errors.push('red_flags 不是数组');
    fixed.red_flags = [];
  }
  fixed.red_flags = fixed.red_flags
    .filter(f => typeof f === 'string' && f.trim().length > 0);

  // 验证 recommended_action
  const validActions = ['apply_now', 'worth_applying', 'low_priority'];
  if (!validActions.includes(fixed.recommended_action)) {
    errors.push(`无效的 recommended_action: ${fixed.recommended_action}`);
    // 根据总分自动推断
    const overall = calculateOverallScore(fixed.scores);
    if (overall >= 80) fixed.recommended_action = 'apply_now';
    else if (overall >= 60) fixed.recommended_action = 'worth_applying';
    else fixed.recommended_action = 'low_priority';
  }

  // 显式计算 overall_score（覆盖 AI 可能的错误计算）
  fixed.overall_score = calculateOverallScore(fixed.scores);

  return {
    valid: errors.length === 0,
    errors,
    fixed
  };
}

// ==========================================
// 3. Overall Score 显式计算（加权平均）
// ==========================================

/**
 * 计算加权总分
 * 公式: overall_score = Σ(score_i × weight_i) for all dimensions
 * @param {Object} scores - 各维度评分对象
 * @returns {number} 加权总分，保留1位小数
 */
function calculateOverallScore(scores) {
  let weightedSum = 0;
  
  for (const [dimName, dimDef] of Object.entries(SCORING_DIMENSIONS)) {
    const score = scores[dimName]?.score || 0;
    const weight = dimDef.weight; // 始终使用固定权重
    
    weightedSum += score * weight;
  }
  
  // 保留1位小数
  return Math.round(weightedSum * 10) / 10;
}

// ==========================================
// 4. AI 输出 JSON 安全解析
// ==========================================

/**
 * 安全解析 AI 返回的 JSON 文本
 * 处理常见的 AI 输出格式问题
 * @param {string} rawText - AI 返回的原始文本
 * @returns {Object|Array|null} 解析后的对象
 */
function safeParseAIJson(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  
  let text = rawText.trim();
  
  // 移除 markdown 代码块包裹
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*\n?/, '').replace(/\n?\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*\n?/, '').replace(/\n?\s*```$/, '');
  }
  
  // 移除可能的前导文字（如 "Here is the evaluation:"）
  const jsonStart = text.indexOf('[');
  const objStart = text.indexOf('{');
  if (jsonStart > 0 || objStart > 0) {
    const start = Math.min(
      jsonStart >= 0 ? jsonStart : Infinity,
      objStart >= 0 ? objStart : Infinity
    );
    text = text.substring(start);
  }
  
  // 移除可能的尾部文字
  const lastBracket = text.lastIndexOf(']');
  const lastBrace = text.lastIndexOf('}');
  const end = Math.max(lastBracket, lastBrace);
  if (end > 0 && end < text.length - 1) {
    text = text.substring(0, end + 1);
  }
  
  // 尝试直接解析
  try {
    return JSON.parse(text);
  } catch (e) {
    // 修复常见错误
  }
  
  // 修复尾部逗号
  text = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  
  // 修复单引号（部分 AI 可能使用单引号）
  // 这是一个简化处理，可能有边界情况
  try {
    return JSON.parse(text);
  } catch (e) {
    // 最后尝试
  }
  
  // 尝试逐行修复
  try {
    // 移除注释行
    text = text.replace(/\/\/.*$/gm, '');
    // 移除控制字符
    text = text.replace(/[\x00-\x1F\x7F]/g, (match) => {
      if (match === '\n' || match === '\r' || match === '\t') return match;
      return '';
    });
    return JSON.parse(text);
  } catch (e) {
    console.log('JSON 解析完全失败:', e.message);
    return null;
  }
}

// ==========================================
// 5. Prompt 构建函数
// ==========================================

/**
 * 为一批职位构建 AI 评分的 user prompt
 * @param {string} cvText - 简历文本
 * @param {Array} jobs - 本批次的职位列表
 * @returns {string} 完整的 user message
 */
function buildScoringPrompt(cvText, jobs) {
  let prompt = `CANDIDATE CV:\n${cvText}\n\n---\n\nJOBS TO EVALUATE:\n`;
  
  jobs.forEach((job, index) => {
    prompt += `\nJOB ${index + 1}:\n`;
    prompt += `Job ID: ${job.job_id}\n`;
    prompt += `Title: ${job.title}\n`;
    prompt += `Company: ${job.company}\n`;
    prompt += `Location: ${job.location}\n`;
    prompt += `Seniority: ${job.seniority_level || 'Not specified'}\n`;
    prompt += `Type: ${job.employment_type || 'Not specified'}\n`;
    prompt += `Description:\n${job.description}\n`;
    prompt += `---\n`;
  });
  
  prompt += `\nEvaluate ALL ${jobs.length} jobs above. `;
  prompt += `Return a JSON array with one scoring object per job. `;
  prompt += `Output ONLY the JSON array, no other text.`;
  
  return prompt;
}

// ==========================================
// 6. 批次处理函数
// ==========================================

/**
 * 将职位列表分成指定大小的批次
 * @param {Array} jobs - 所有职位
 * @param {number} batchSize - 每批数量
 * @returns {Array} 批次数组
 */
function createBatches(jobs, batchSize = 5) {
  const batches = [];
  for (let i = 0; i < jobs.length; i += batchSize) {
    batches.push(jobs.slice(i, i + batchSize));
  }
  return batches;
}

// ==========================================
// 7. 合并评分和元数据
// ==========================================

/**
 * 将 AI 评分结果与原始职位元数据合并
 * @param {Object} scoreObj - 验证后的评分对象
 * @param {Object} jobMeta - 原始职位元数据
 * @returns {Object} 合并后的完整对象
 */
function mergeScoreAndMeta(scoreObj, jobMeta) {
  return {
    // 元数据字段
    job_id: scoreObj.job_id,
    title: jobMeta?.title || 'Unknown',
    company: jobMeta?.company || 'Unknown',
    location: jobMeta?.location || 'Australia',
    posted_date: jobMeta?.posted_date || new Date().toISOString(),
    salary_range: jobMeta?.salary_range || 'Not specified',
    linkedin_url: jobMeta?.linkedin_url || '#',
    description_snippet: jobMeta?.description_snippet || '',
    
    // 评分字段
    overall_score: scoreObj.overall_score,
    recommended_action: scoreObj.recommended_action,
    scores: scoreObj.scores,
    match_highlights: scoreObj.match_highlights,
    red_flags: scoreObj.red_flags
  };
}

// ==========================================
// 导出（供 n8n Code 节点使用）
// ==========================================
// 注意: n8n Code 节点中直接使用这些函数，不需要 module.exports
// 将上述函数定义复制到对应的 Code 节点中即可

// 使用示例（在 n8n Code 节点中）:
/*
const items = $input.all();
const cvData = $('MapResume').first().json;
const config = $('Config').first().json;

// 1. 构建批次
const jobs = items.map(i => i.json);
const batches = createBatches(jobs, config.AI_BATCH_SIZE);

// 2. 为每个批次构建 prompt
const batchOutputs = batches.map((batch, idx) => ({
  json: {
    batch_index: idx,
    prompt: buildScoringPrompt(cvData.cv_text, batch),
    jobs_meta: batch
  }
}));

return batchOutputs;
*/

// 验证使用示例:
/*
const aiResponse = safeParseAIJson(rawAiText);
if (!aiResponse) throw new Error('AI 输出解析失败');

const scoreArray = Array.isArray(aiResponse) ? aiResponse : [aiResponse];
const results = [];

for (const score of scoreArray) {
  const { valid, errors, fixed } = validateAndFixScoreObject(score);
  if (errors.length > 0) {
    console.log(`职位 ${score.job_id} 验证修复: ${errors.join('; ')}`);
  }
  
  const jobMeta = findJobMeta(fixed.job_id); // 根据实际数据源查找
  results.push(mergeScoreAndMeta(fixed, jobMeta));
}

return results.map(r => ({ json: r }));
*/
