/**
 * normalize_linkedin.js
 * LinkedIn 数据清洗和标准化逻辑
 * 
 * 用于: NormalizeData 节点 (node-07)
 * 
 * 输入: Apify LinkedIn Jobs Scraper 原始返回数据
 * 输出: 统一格式的职位对象数组
 * 
 * 兼容以下 Apify Actor 输出格式:
 * - bebity/linkedin-jobs-scraper (主要)
 * - apify/linkedin-scraper (备选)
 * - RapidAPI LinkedIn Jobs Search (备选)
 */

// ==========================================
// 在 n8n Code 节点中使用以下代码
// ==========================================

const rawItems = $input.all();
const config = $('Config').first().json;

try {
  // ==========================================
  // 1. 提取原始职位数据
  // ==========================================
  let rawJobs = [];
  
  for (const item of rawItems) {
    const data = item.json;
    
    // 格式 1: 数组形式（Apify dataset API 返回）
    if (Array.isArray(data)) {
      rawJobs = rawJobs.concat(data);
    }
    // 格式 2: 单个职位对象（逐条返回）
    else if (data && (data.title || data.jobTitle || data.positionName)) {
      rawJobs.push(data);
    }
    // 格式 3: 嵌套在 items 字段中
    else if (data && Array.isArray(data.items)) {
      rawJobs = rawJobs.concat(data.items);
    }
    // 格式 4: Apify run 结果中的 dataset
    else if (data && data.defaultDatasetId) {
      // 这种情况应该在 Fetch Dataset 节点中处理
      console.log('跳过 Apify run metadata（应在前置节点处理）');
    }
  }
  
  // ==========================================
  // 2. 无职位数据处理
  // ==========================================
  if (rawJobs.length === 0) {
    console.log('LinkedIn 返回 0 条职位数据');
    return [{ json: { _no_jobs: true, config: config } }];
  }
  
  console.log(`原始数据: ${rawJobs.length} 条职位`);
  
  // ==========================================
  // 3. 字段标准化映射
  // ==========================================
  
  /**
   * 从多个可能的字段名中提取值
   * @param {Object} obj - 源对象
   * @param {string[]} fieldNames - 可能的字段名列表（优先级从高到低）
   * @param {*} defaultValue - 默认值
   * @returns {*} 提取的值
   */
  function extractField(obj, fieldNames, defaultValue = '') {
    for (const name of fieldNames) {
      // 支持嵌套字段（如 "company.name"）
      const parts = name.split('.');
      let value = obj;
      for (const part of parts) {
        value = value?.[part];
        if (value === undefined || value === null) break;
      }
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return defaultValue;
  }
  
  /**
   * 提取并标准化 Job ID
   */
  function extractJobId(job, index) {
    // 尝试多种 ID 来源
    const id = extractField(job, [
      'id',
      'jobId', 
      'entityUrn',
      'trackingUrn',
      'jobPostingId',
      'externalId'
    ], null);
    
    if (id) {
      // 如果是 URN 格式，提取数字部分
      const urnMatch = String(id).match(/(\d{5,})/);
      if (urnMatch) return urnMatch[1];
      return String(id);
    }
    
    // 从 URL 提取 ID
    const url = extractField(job, ['url', 'jobUrl', 'link', 'applyUrl'], '');
    const urlMatch = url.match(/\/view\/(\d+)/);
    if (urlMatch) return urlMatch[1];
    
    // 生成唯一 ID
    return `gen-${Date.now()}-${index}`;
  }
  
  /**
   * 提取并标准化薪资信息
   */
  function extractSalary(job) {
    // 直接薪资字段
    const salary = extractField(job, [
      'salary',
      'salaryInfo',
      'salaryRange',
      'compensationInfo',
      'remunerationData'
    ], null);
    
    if (salary) {
      // 对象格式薪资
      if (typeof salary === 'object') {
        const min = salary.min || salary.minimumAmount || salary.from || '';
        const max = salary.max || salary.maximumAmount || salary.to || '';
        const currency = salary.currency || salary.currencyCode || 'AUD';
        const period = salary.period || salary.payPeriod || 'per year';
        
        if (min || max) {
          const minStr = min ? `${currency} ${Number(min).toLocaleString()}` : '';
          const maxStr = max ? `${currency} ${Number(max).toLocaleString()}` : '';
          if (minStr && maxStr) return `${minStr} - ${maxStr} ${period}`;
          return `${minStr || maxStr} ${period}`;
        }
      }
      
      // 字符串格式薪资
      if (typeof salary === 'string' && salary.trim().length > 0) {
        return salary.trim();
      }
    }
    
    // 从描述中尝试提取薪资信息
    const desc = extractField(job, ['description', 'descriptionText'], '');
    const salaryRegex = /(?:AUD|A?\$)\s*[\d,]+(?:\s*[-–to]+\s*(?:AUD|A?\$)?\s*[\d,]+)?(?:\s*(?:per|p\.a\.|pa|annually|per annum|per year|k))?/gi;
    const salaryMatch = desc.match(salaryRegex);
    if (salaryMatch) {
      return salaryMatch[0].trim();
    }
    
    return 'Not specified';
  }
  
  /**
   * 清理和截断职位描述
   * 移除 HTML 标签，保留纯文本
   */
  function cleanDescription(rawDesc) {
    if (!rawDesc) return '';
    
    let text = String(rawDesc);
    
    // 移除 HTML 标签
    text = text.replace(/<[^>]*>/g, ' ');
    
    // 解码 HTML 实体
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#\d+;/g, '');
    
    // 移除多余空白
    text = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    
    return text;
  }
  
  /**
   * 标准化日期格式
   */
  function normalizeDate(dateInput) {
    if (!dateInput) return new Date().toISOString();
    
    // 已经是 ISO 格式
    if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}/)) {
      return dateInput;
    }
    
    // Unix 时间戳（毫秒）
    if (typeof dateInput === 'number' && dateInput > 1000000000000) {
      return new Date(dateInput).toISOString();
    }
    
    // Unix 时间戳（秒）
    if (typeof dateInput === 'number' && dateInput > 1000000000) {
      return new Date(dateInput * 1000).toISOString();
    }
    
    // 相对时间文本（如 "2 days ago", "1 hour ago"）
    if (typeof dateInput === 'string') {
      const relativeMatch = dateInput.match(/(\d+)\s*(hour|day|week|month|minute)/i);
      if (relativeMatch) {
        const amount = parseInt(relativeMatch[1]);
        const unit = relativeMatch[2].toLowerCase();
        const now = new Date();
        
        switch (unit) {
          case 'minute': now.setMinutes(now.getMinutes() - amount); break;
          case 'hour': now.setHours(now.getHours() - amount); break;
          case 'day': now.setDate(now.getDate() - amount); break;
          case 'week': now.setDate(now.getDate() - amount * 7); break;
          case 'month': now.setMonth(now.getMonth() - amount); break;
        }
        return now.toISOString();
      }
      
      // 尝试直接解析
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
    
    return new Date().toISOString();
  }
  
  /**
   * 构建 LinkedIn URL
   */
  function buildLinkedInUrl(job, jobId) {
    const url = extractField(job, [
      'jobUrl',
      'url', 
      'link',
      'shareUrl',
      'applyUrl'
    ], '');
    
    if (url && url.includes('linkedin.com')) {
      return url;
    }
    
    // 从 ID 构建 URL
    if (jobId && !jobId.startsWith('gen-')) {
      return `https://www.linkedin.com/jobs/view/${jobId}`;
    }
    
    return url || '#';
  }
  
  // ==========================================
  // 4. 执行标准化
  // ==========================================
  const normalizedJobs = rawJobs.map((job, index) => {
    const jobId = extractJobId(job, index);
    const description = cleanDescription(
      extractField(job, [
        'description', 
        'descriptionText', 
        'jobDescription',
        'descriptionHtml'
      ], '')
    );
    
    return {
      // 核心标识
      job_id: jobId,
      
      // 职位基本信息
      title: extractField(job, [
        'title', 
        'jobTitle', 
        'positionName',
        'name'
      ], 'Unknown Title').trim(),
      
      company: extractField(job, [
        'companyName',
        'company',
        'company.name',
        'organizationName',
        'employer'
      ], 'Unknown Company').trim(),
      
      location: extractField(job, [
        'location',
        'formattedLocation',
        'jobLocation',
        'geoLocation',
        'city'
      ], 'Australia').trim(),
      
      // 时间和薪资
      posted_date: normalizeDate(
        extractField(job, [
          'postedAt',
          'listedAt', 
          'publishedAt',
          'postedDate',
          'createdAt',
          'listDate'
        ], null)
      ),
      
      salary_range: extractSalary(job),
      
      // URL
      linkedin_url: buildLinkedInUrl(job, jobId),
      
      // 描述
      description: description,
      description_snippet: description.substring(0, 300).trim() + 
                           (description.length > 300 ? '...' : ''),
      
      // 附加信息
      seniority_level: extractField(job, [
        'seniorityLevel',
        'experienceLevel',
        'level',
        'careerLevel'
      ], ''),
      
      employment_type: extractField(job, [
        'employmentType',
        'contractType',
        'jobType',
        'workType'
      ], ''),
      
      industry: extractField(job, [
        'industry',
        'industries',
        'sector'
      ], ''),
      
      applicants_count: parseInt(
        extractField(job, [
          'applicantsCount',
          'numberOfApplicants',
          'applicantCount'
        ], 0)
      ) || 0,
      
      // 附加标记
      _source: 'linkedin_apify',
      _normalized_at: new Date().toISOString()
    };
  });
  
  // ==========================================
  // 5. 数据质量检查
  // ==========================================
  const qualityChecked = normalizedJobs.filter(job => {
    // 必须有标题
    if (!job.title || job.title === 'Unknown Title') {
      console.log(`跳过无标题职位: ${job.job_id}`);
      return false;
    }
    
    // 描述不能太短（无法有效评分）
    if (job.description.length < 30) {
      console.log(`跳过描述过短的职位: ${job.title} (${job.description.length} chars)`);
      return false;
    }
    
    return true;
  });
  
  console.log(`标准化完成: ${rawJobs.length} → ${qualityChecked.length} 条有效职位`);
  
  if (qualityChecked.length === 0) {
    return [{ json: { _no_jobs: true, config: config } }];
  }
  
  // 返回标准化后的数据（附带 config 供后续节点使用）
  return qualityChecked.map(job => ({ 
    json: { ...job, config: config } 
  }));
  
} catch (error) {
  console.log('LinkedIn 数据标准化失败:', error.message);
  return [{ json: { _error: error.message, _no_jobs: true, config: config } }];
}
