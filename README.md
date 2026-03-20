<div align="right">
  🌐 Language / 语言：<a href="#-daily-job-hunting-agent--australia">English</a> &nbsp;|&nbsp; <a href="#-每日求职代理--澳大利亚">中文</a>
</div>

---

# 🎯 Daily Job Hunting Agent — Australia

> Automated daily job search and AI-powered matching system for the Australian job market.

An n8n workflow that automatically searches LinkedIn for new job postings every weekday morning, scores each one against your CV using Claude AI across 5 evaluation dimensions, and delivers a beautifully formatted HTML email report with the top 15 best-matching opportunities.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Required Accounts](#required-accounts)
- [Estimated Running Costs](#estimated-running-costs)
- [Deployment Steps (10 Steps)](#deployment-steps-10-steps)
- [Config Node Variables Reference](#config-node-variables-reference)
- [Scoring Schema](#scoring-schema)
- [Project Structure](#project-structure)
- [FAQ & Troubleshooting](#faq--troubleshooting)
- [Customization Guide](#customization-guide)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Architecture Overview

The workflow follows an 8-stage, 16-node pipeline that runs every weekday at 07:30 AEST.

### Interactive Pipeline Diagram

<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;dark-mode&quot;:&quot;auto&quot;,&quot;toolbar&quot;:&quot;zoom layers tags lightbox&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;embed.diagrams.net\&quot; agent=\&quot;Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36\&quot; version=\&quot;29.6.4\&quot;&gt;\n  &lt;diagram name=\&quot;Page-1\&quot; id=\&quot;page-1\&quot;&gt;\n    &lt;mxGraphModel dx=\&quot;1097\&quot; dy=\&quot;680\&quot; grid=\&quot;1\&quot; gridSize=\&quot;10\&quot; guides=\&quot;1\&quot; tooltips=\&quot;1\&quot; connect=\&quot;1\&quot; arrows=\&quot;1\&quot; fold=\&quot;1\&quot; page=\&quot;1\&quot; pageScale=\&quot;1\&quot; pageWidth=\&quot;1169\&quot; pageHeight=\&quot;827\&quot; math=\&quot;0\&quot; shadow=\&quot;0\&quot;&gt;\n      &lt;root&gt;\n        &lt;mxCell id=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;1\&quot; parent=\&quot;0\&quot; /&gt;\n        &lt;mxCell id=\&quot;2\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#e1f5fe;strokeColor=#0277bd;startSize=30;\&quot; value=\&quot;STAGE 1: Trigger &amp;amp; Config\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;3\&quot; parent=\&quot;2\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#bbdefb;strokeColor=#1976d2;\&quot; value=\&quot;Schedule Trigger&amp;#xa;Cron: 30 7 * * 1-5\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;60\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;4\&quot; parent=\&quot;2\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#bbdefb;strokeColor=#1976d2;\&quot; value=\&quot;Config&amp;#xa;Inject runtime variables\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;240\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;5\&quot; edge=\&quot;1\&quot; parent=\&quot;2\&quot; source=\&quot;3\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;4\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;6\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#e8f5e9;strokeColor=#2e7d32;startSize=30;\&quot; value=\&quot;STAGE 2: CV Retrieval &amp;amp; Preprocessing\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;140\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;7\&quot; parent=\&quot;6\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#388e3c;\&quot; value=\&quot;RetrieveCV&amp;#xa;Google Drive PDF\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;60\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;8\&quot; parent=\&quot;6\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#388e3c;\&quot; value=\&quot;Extract from File&amp;#xa;→ plain text\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;240\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;9\&quot; parent=\&quot;6\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#c8e6c9;strokeColor=#388e3c;\&quot; value=\&quot;MapResume&amp;#xa;Format &amp;amp; extract fields\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;420\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;10\&quot; edge=\&quot;1\&quot; parent=\&quot;6\&quot; source=\&quot;7\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;8\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;11\&quot; edge=\&quot;1\&quot; parent=\&quot;6\&quot; source=\&quot;8\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;9\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;12\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#fff3e0;strokeColor=#ef6c00;startSize=30;\&quot; value=\&quot;STAGE 3: LinkedIn Job Data Collection\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;240\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;13\&quot; parent=\&quot;12\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe0b2;strokeColor=#f57c00;\&quot; value=\&quot;LinkedIn&amp;#xa;Apify API\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;60\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;14\&quot; parent=\&quot;12\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe0b2;strokeColor=#f57c00;\&quot; value=\&quot;Fetch Dataset&amp;#xa;Get results\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;240\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;15\&quot; parent=\&quot;12\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe0b2;strokeColor=#f57c00;\&quot; value=\&quot;NormalizeData&amp;#xa;Standardize fields\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;420\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;16\&quot; parent=\&quot;12\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe0b2;strokeColor=#f57c00;\&quot; value=\&quot;Filter/Dedup&amp;#xa;Keyword + jobId dedup\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;600\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;17\&quot; edge=\&quot;1\&quot; parent=\&quot;12\&quot; source=\&quot;13\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;14\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;18\&quot; edge=\&quot;1\&quot; parent=\&quot;12\&quot; source=\&quot;14\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;15\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;19\&quot; edge=\&quot;1\&quot; parent=\&quot;12\&quot; source=\&quot;15\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;16\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;20\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#fce4ec;strokeColor=#c2185b;startSize=30;\&quot; value=\&quot;BRANCH: Check Empty\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;100\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;340\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;21\&quot; parent=\&quot;20\&quot; style=\&quot;rhombus;whiteSpace=wrap;html=1;fillColor=#f8bbd9;strokeColor=#d81b60;\&quot; value=\&quot;IF Has Jobs?\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;60\&quot; width=\&quot;120\&quot; x=\&quot;300\&quot; y=\&quot;35\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;22\&quot; parent=\&quot;20\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1\&quot; value=\&quot;YES\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;20\&quot; width=\&quot;40\&quot; x=\&quot;430\&quot; y=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;23\&quot; parent=\&quot;20\&quot; style=\&quot;text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1\&quot; value=\&quot;NO\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;20\&quot; width=\&quot;40\&quot; x=\&quot;250\&quot; y=\&quot;30\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;24\&quot; parent=\&quot;20\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffcdd2;strokeColor=#e53935;\&quot; value=\&quot;Build Empty Notification\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;80\&quot; y=\&quot;60\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;25\&quot; parent=\&quot;20\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ef9a9a;strokeColor=#d32f2f;\&quot; value=\&quot;Send Empty Notification\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;140\&quot; x=\&quot;80\&quot; y=\&quot;120\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;26\&quot; edge=\&quot;1\&quot; parent=\&quot;20\&quot; source=\&quot;21\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=0;exitY=0.5;exitDx=0;exitDy=0;\&quot; target=\&quot;24\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;27\&quot; edge=\&quot;1\&quot; parent=\&quot;20\&quot; source=\&quot;24\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;25\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;28\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#f3e5f5;strokeColor=#7b1fa2;startSize=30;\&quot; value=\&quot;STAGE 4: AI Input Preparation\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;460\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;29\&quot; parent=\&quot;28\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#e1bee7;strokeColor=#8e24aa;\&quot; value=\&quot;Prepare AI Input&amp;#xa;Merge CV + JD, construct prompts\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;160\&quot; x=\&quot;200\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;30\&quot; parent=\&quot;28\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#e1bee7;strokeColor=#8e24aa;\&quot; value=\&quot;SplitInBatches&amp;#xa;Process 1 batch at a time\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;160\&quot; x=\&quot;400\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;31\&quot; edge=\&quot;1\&quot; parent=\&quot;28\&quot; source=\&quot;29\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;30\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;32\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#e0f2f1;strokeColor=#00695c;startSize=30;\&quot; value=\&quot;STAGE 5: AI Scoring\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;560\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;33\&quot; parent=\&quot;32\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#b2dfdb;strokeColor=#00897b;\&quot; value=\&quot;Score the Job&amp;#xa;Claude API call with system prompt + CV + batch of JDs\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;200\&quot; x=\&quot;280\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;34\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#fff8e1;strokeColor=#f9a825;startSize=30;\&quot; value=\&quot;STAGE 6: Parse &amp;amp; Merge\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;660\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;35\&quot; parent=\&quot;34\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#ffecb3;strokeColor=#ffa000;\&quot; value=\&quot;Parse and Merge Scores&amp;#xa;Safe JSON parse, Schema validation, weight enforcement, overall_score recalculation, merge with job metadata\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;360\&quot; x=\&quot;200\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;36\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#ede7f6;strokeColor=#5e35b1;startSize=30;\&quot; value=\&quot;STAGE 7: Rank &amp;amp; Slice\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;760\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;37\&quot; parent=\&quot;36\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#d1c4e9;strokeColor=#7e57c2;\&quot; value=\&quot;Rank and Top N&amp;#xa;Sort by overall_score DESC → keep top 15\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;200\&quot; x=\&quot;280\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;38\&quot; parent=\&quot;1\&quot; style=\&quot;swimlane;whiteSpace=wrap;html=1;fillColor=#e3f2fd;strokeColor=#1565c0;startSize=30;\&quot; value=\&quot;STAGE 8: Output &amp;amp; Notification\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;80\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; y=\&quot;860\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;39\&quot; parent=\&quot;38\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#90caf9;strokeColor=#1976d2;\&quot; value=\&quot;Build Email HTML&amp;#xa;Generate rich HTML report with cards\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;200\&quot; x=\&quot;200\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;40\&quot; parent=\&quot;38\&quot; style=\&quot;rounded=1;whiteSpace=wrap;html=1;fillColor=#90caf9;strokeColor=#1976d2;\&quot; value=\&quot;Send Email&amp;#xa;Gmail SMTP delivery\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;50\&quot; width=\&quot;160\&quot; x=\&quot;440\&quot; y=\&quot;45\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;41\&quot; edge=\&quot;1\&quot; parent=\&quot;38\&quot; source=\&quot;39\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;\&quot; target=\&quot;40\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;42\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;9\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;13\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;43\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;16\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;21\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;44\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;21\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;\&quot; target=\&quot;29\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;45\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;30\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;33\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;46\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;33\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;35\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;47\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;35\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;37\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;48\&quot; edge=\&quot;1\&quot; parent=\&quot;1\&quot; source=\&quot;37\&quot; style=\&quot;edgeStyle=orthogonalEdgeStyle;endArrow=classic;flowAnimation=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;\&quot; target=\&quot;39\&quot;&gt;\n          &lt;mxGeometry relative=\&quot;1\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n        &lt;mxCell id=\&quot;49\&quot; parent=\&quot;1\&quot; style=\&quot;text;html=1;strokeColor=#37474f;fillColor=#eceff1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=16;fontStyle=1\&quot; value=\&quot;Daily Job Hunting Agent&amp;#xa;8-Stage Pipeline | 16 Nodes | Runs Weekdays 07:30 AEST\&quot; vertex=\&quot;1\&quot;&gt;\n          &lt;mxGeometry height=\&quot;40\&quot; width=\&quot;720\&quot; x=\&quot;40\&quot; as=\&quot;geometry\&quot; /&gt;\n        &lt;/mxCell&gt;\n      &lt;/root&gt;\n    &lt;/mxGraphModel&gt;\n  &lt;/diagram&gt;\n&lt;/mxfile&gt;\n&quot;}"></div>
<script type="text/javascript" src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>

### Stage-by-Stage Summary

<svg width="100%" viewBox="0 0 680 520" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</marker>
<style>
  text { font-family: sans-serif; fill: #3d3d3a; }
  .th { font-size: 14px; font-weight: 500; }
  .ts { font-size: 12px; font-weight: 400; }
  .arr { stroke: #888780; stroke-width: 1.2; fill: none; }
  .c-amber rect  { fill: #FAEEDA; stroke: #854F0B; }
  .c-amber text  { fill: #633806; }
  .c-gray rect   { fill: #F1EFE8; stroke: #5F5E5A; }
  .c-gray text   { fill: #444441; }
  .c-teal rect   { fill: #E1F5EE; stroke: #0F6E56; }
  .c-teal text   { fill: #085041; }
  .c-blue rect   { fill: #E6F1FB; stroke: #185FA5; }
  .c-blue text   { fill: #0C447C; }
  .c-purple rect { fill: #EEEDFE; stroke: #534AB7; }
  .c-purple text { fill: #3C3489; }
  .c-coral rect  { fill: #FAECE7; stroke: #993C1D; }
  .c-coral text  { fill: #712B13; }
  .c-green rect  { fill: #EAF3DE; stroke: #3B6D11; }
  .c-green text  { fill: #27500A; }
  .band { fill: #f5f4f0; }
  .legend-bg { fill: #f5f4f0; }
</style>
</defs>
<text class="ts" x="40" y="18" fill="#888780">① Trigger &amp; Config</text>
<text class="ts" x="195" y="18" fill="#888780">② CV Preprocessing</text>
<text class="ts" x="370" y="18" fill="#888780">③ LinkedIn Data</text>
<text class="ts" x="570" y="18" fill="#888780">④ AI Input</text>
<rect class="band" x="20" y="28" width="140" height="120" rx="8" opacity="0.7"/>
<rect class="band" x="168" y="28" width="190" height="120" rx="8" opacity="0.7"/>
<rect class="band" x="366" y="28" width="200" height="120" rx="8" opacity="0.7"/>
<rect class="band" x="574" y="28" width="90" height="120" rx="8" opacity="0.7"/>
<g class="c-amber">
  <rect x="30" y="50" width="110" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="85" y="67" text-anchor="middle" dominant-baseline="central">Schedule</text>
  <text class="ts" x="85" y="83" text-anchor="middle" dominant-baseline="central">07:30 Weekdays</text>
</g>
<g class="c-gray">
  <rect x="30" y="108" width="110" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="85" y="124" text-anchor="middle" dominant-baseline="central">Config</text>
</g>
<line x1="140" y1="72" x2="178" y2="72" class="arr" marker-end="url(#arrow)"/>
<g class="c-teal">
  <rect x="178" y="50" width="108" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="232" y="67" text-anchor="middle" dominant-baseline="central">Retrieve CV</text>
  <text class="ts" x="232" y="83" text-anchor="middle" dominant-baseline="central">Google Drive</text>
</g>
<g class="c-teal">
  <rect x="178" y="108" width="108" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="232" y="124" text-anchor="middle" dominant-baseline="central">Extract PDF</text>
</g>
<line x1="232" y1="94" x2="232" y2="106" class="arr" marker-end="url(#arrow)"/>
<line x1="286" y1="72" x2="376" y2="72" class="arr" marker-end="url(#arrow)"/>
<g class="c-blue">
  <rect x="376" y="50" width="90" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="421" y="67" text-anchor="middle" dominant-baseline="central">LinkedIn</text>
  <text class="ts" x="421" y="83" text-anchor="middle" dominant-baseline="central">Past 24h Jobs</text>
</g>
<g class="c-blue">
  <rect x="376" y="108" width="90" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="421" y="124" text-anchor="middle" dominant-baseline="central">Normalize</text>
</g>
<line x1="421" y1="94" x2="421" y2="106" class="arr" marker-end="url(#arrow)"/>
<g class="c-blue">
  <rect x="474" y="50" width="86" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="517" y="67" text-anchor="middle" dominant-baseline="central">Filter &amp;</text>
  <text class="th" x="517" y="83" text-anchor="middle" dominant-baseline="central">Dedup</text>
</g>
<line x1="466" y1="72" x2="472" y2="72" class="arr" marker-end="url(#arrow)"/>
<g class="c-purple">
  <rect x="584" y="50" width="80" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="624" y="67" text-anchor="middle" dominant-baseline="central">Prepare</text>
  <text class="th" x="624" y="83" text-anchor="middle" dominant-baseline="central">AI Input</text>
</g>
<line x1="560" y1="72" x2="582" y2="72" class="arr" marker-end="url(#arrow)"/>
<line x1="20" y1="165" x2="660" y2="165" stroke="#d3d1c7" stroke-width="0.5" stroke-dasharray="4 4"/>
<text class="ts" x="20" y="186" fill="#888780">⑤ AI Scoring</text>
<text class="ts" x="230" y="186" fill="#888780">⑥ Parse &amp; Merge</text>
<text class="ts" x="430" y="186" fill="#888780">⑦ Rank &amp; Filter</text>
<text class="ts" x="565" y="186" fill="#888780">⑧ Send</text>
<rect class="band" x="20" y="196" width="200" height="290" rx="8" opacity="0.7"/>
<rect class="band" x="228" y="196" width="190" height="290" rx="8" opacity="0.7"/>
<rect class="band" x="426" y="196" width="130" height="290" rx="8" opacity="0.7"/>
<rect class="band" x="564" y="196" width="100" height="290" rx="8" opacity="0.7"/>
<path d="M624 94 L624 160 L120 160 L120 210" fill="none" stroke="#b4b2a9" stroke-width="1" marker-end="url(#arrow)"/>
<g class="c-purple">
  <rect x="30" y="210" width="180" height="68" rx="8" stroke-width="0.5"/>
  <text class="th" x="120" y="236" text-anchor="middle" dominant-baseline="central">Score the Job</text>
  <text class="ts" x="120" y="254" text-anchor="middle" dominant-baseline="central">Claude / OpenAI Agent</text>
  <text class="ts" x="120" y="268" text-anchor="middle" dominant-baseline="central">Skills · Experience · Language</text>
</g>
<g class="c-gray">
  <rect x="30" y="292" width="180" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="120" y="308" text-anchor="middle" dominant-baseline="central">Structured Output Parser</text>
</g>
<line x1="120" y1="278" x2="120" y2="290" class="arr" marker-end="url(#arrow)"/>
<line x1="210" y1="308" x2="238" y2="308" class="arr" marker-end="url(#arrow)"/>
<g class="c-teal">
  <rect x="238" y="292" width="170" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="323" y="308" text-anchor="middle" dominant-baseline="central">Parse LLM JSON</text>
</g>
<g class="c-teal">
  <rect x="238" y="340" width="170" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="323" y="357" text-anchor="middle" dominant-baseline="central">Merge Scores</text>
  <text class="ts" x="323" y="373" text-anchor="middle" dominant-baseline="central">+ Job Metadata</text>
</g>
<line x1="323" y1="324" x2="323" y2="338" class="arr" marker-end="url(#arrow)"/>
<line x1="408" y1="362" x2="436" y2="362" class="arr" marker-end="url(#arrow)"/>
<g class="c-coral">
  <rect x="436" y="340" width="110" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="491" y="357" text-anchor="middle" dominant-baseline="central">Rank by</text>
  <text class="th" x="491" y="373" text-anchor="middle" dominant-baseline="central">Score</text>
</g>
<g class="c-coral">
  <rect x="436" y="400" width="110" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="491" y="416" text-anchor="middle" dominant-baseline="central">Top 15 Slice</text>
</g>
<line x1="491" y1="384" x2="491" y2="398" class="arr" marker-end="url(#arrow)"/>
<g class="c-green">
  <rect x="574" y="340" width="80" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="614" y="357" text-anchor="middle" dominant-baseline="central">Build</text>
  <text class="th" x="614" y="373" text-anchor="middle" dominant-baseline="central">Email HTML</text>
</g>
<line x1="546" y1="416" x2="574" y2="362" stroke="#b4b2a9" stroke-width="1" fill="none" marker-end="url(#arrow)"/>
<g class="c-green">
  <rect x="574" y="400" width="80" height="32" rx="8" stroke-width="0.5"/>
  <text class="th" x="614" y="416" text-anchor="middle" dominant-baseline="central">Gmail Send</text>
</g>
<line x1="614" y1="384" x2="614" y2="398" class="arr" marker-end="url(#arrow)"/>
<rect class="legend-bg" x="20" y="450" width="640" height="55" rx="8" opacity="0.6"/>
<text class="ts" x="40" y="468" fill="#888780">Legend</text>
<rect x="40"  y="478" width="14" height="10" rx="2" fill="#EF9F27" stroke="#854F0B" stroke-width="0.5"/>
<text class="ts" x="60"  y="487" fill="#3d3d3a">Trigger &amp; System</text>
<rect x="162" y="478" width="14" height="10" rx="2" fill="#1D9E75" stroke="#0F6E56" stroke-width="0.5"/>
<text class="ts" x="182" y="487" fill="#3d3d3a">CV / Data Processing</text>
<rect x="302" y="478" width="14" height="10" rx="2" fill="#378ADD" stroke="#185FA5" stroke-width="0.5"/>
<text class="ts" x="322" y="487" fill="#3d3d3a">LinkedIn Scraping</text>
<rect x="422" y="478" width="14" height="10" rx="2" fill="#7F77DD" stroke="#534AB7" stroke-width="0.5"/>
<text class="ts" x="442" y="487" fill="#3d3d3a">AI Scoring</text>
<rect x="506" y="478" width="14" height="10" rx="2" fill="#D85A30" stroke="#993C1D" stroke-width="0.5"/>
<text class="ts" x="526" y="487" fill="#3d3d3a">Rank &amp; Filter</text>
<rect x="600" y="478" width="14" height="10" rx="2" fill="#639922" stroke="#3B6D11" stroke-width="0.5"/>
<text class="ts" x="620" y="487" fill="#3d3d3a">Email Output</text>
</svg>

---

## Required Accounts

Before starting deployment, ensure you have accounts with the following services:

| # | Service | Purpose | Free Tier Available | Sign Up Link |
|---|---------|---------|---------------------|--------------|
| 1 | **n8n** | Workflow automation engine | ✅ Self-hosted is free; Cloud from $20/mo | [n8n.io](https://n8n.io) |
| 2 | **Apify** | LinkedIn job scraping via `bebity/linkedin-jobs-scraper` | ✅ $5/mo free credits | [apify.com](https://apify.com) |
| 3 | **Google Cloud** | Google Drive API (CV retrieval) + Gmail API (email sending) | ✅ Free tier covers usage | [console.cloud.google.com](https://console.cloud.google.com) |
| 4 | **Anthropic** | Claude AI API for job-CV scoring | ❌ Pay-per-use (~$0.15/run) | [platform.claude.com](https://platform.claude.com/) |

---

## Estimated Running Costs

| Component | Cost per Run | Monthly (22 workdays) |
|-----------|-------------|----------------------|
| Apify (100 jobs scraped) | ~$0.05 – $0.10 | ~$1.10 – $2.20 |
| Claude API (scoring ~50 jobs) | ~$0.10 – $0.20 | ~$2.20 – $4.40 |
| Google APIs | Free | Free |
| n8n (self-hosted) | Free | Free |
| **Total** | **~$0.15 – $0.30** | **~$3.30 – $6.60** |

---

## Deployment Steps (10 Steps)

### Step 1: Install and Start n8n

Choose one of the following installation methods:

**Option A — Docker (Recommended)**

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

**Option B — npm Global Install**

```bash
npm install -g n8n
export GENERIC_TIMEZONE=Australia/Sydney
n8n start
```

**Option C — n8n Cloud**

Sign up at [app.n8n.cloud](https://app.n8n.cloud) — no installation required.

After starting, access the n8n editor at `http://localhost:5678` (or your cloud URL).

---

### Step 2: Set Up Google Cloud Project & APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select a Project** → **New Project**
   - Project name: `job-agent` (or any name you prefer)
3. Navigate to **APIs & Services → Library**
4. Search for and **Enable** the following APIs:
   - **Google Drive API**
   - **Gmail API**
5. Navigate to **APIs & Services → Credentials**
6. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `n8n Job Agent`
   - Authorized redirect URIs: add `http://localhost:5678/rest/oauth2-credential/callback`
     (replace with your actual n8n URL if hosted remotely)
7. Click **Create** and note down your **Client ID** and **Client Secret**
8. Navigate to **OAuth consent screen**
   - User type: **External** (or Internal if using Google Workspace)
   - Fill in required fields (app name, user support email)
   - Add scopes: `https://www.googleapis.com/auth/drive.readonly` and `https://mail.google.com/`
   - Add your email as a test user (while app is in testing mode)

---

### Step 3: Set Up Apify Account & Actor

1. Sign up at [apify.com](https://apify.com)
2. Go to **Account → Settings → Integrations**
3. Copy your **Personal API Token** and save it securely
4. Go to the Apify Store and find **bebity/linkedin-jobs-scraper**
   - URL: [https://apify.com/bebity/linkedin-jobs-scraper](https://apify.com/bebity/linkedin-jobs-scraper)
5. Click **Try for free** to add it to your actors
6. Verify you have sufficient credits ($5 free tier should cover initial testing)

---

### Step 4: Get Anthropic Claude API Key

1. Sign up at [platform.claude.com/](https://platform.claude.com/)
2. Navigate to **Settings → API Keys**
3. Click **Create Key**
   - Name: `n8n-job-agent`
4. Copy the API key (starts with `sk-ant-api03-...`) and save it securely
5. Navigate to **Settings → Billing**
   - Add a payment method
   - Recommended: set a monthly spending limit (e.g., $10)

---

### Step 5: Upload Your CV to Google Drive

1. Ensure your CV/Resume is in **text-based PDF format**
   - ✅ Exported from Word, Google Docs, or LaTeX
   - ❌ Scanned image PDF will NOT work (text cannot be extracted)
2. Upload the PDF to your Google Drive
3. Right-click the file → **Share** → **General access** → **Anyone with the link** (Viewer)
   - Alternatively, share it specifically with the Google service account email
4. Copy the **File ID** from the URL:
   ```
   https://drive.google.com/file/d/[THIS_IS_YOUR_FILE_ID]/view
   ```
   Example: if URL is `https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqR/view`,
   then File ID is `1aBcDeFgHiJkLmNoPqR`

---

### Step 6: Configure n8n Credentials

In the n8n editor, go to **☰ Menu → Credentials** and create the following four credentials:

#### 6a. Google Drive OAuth2

| Field | Value |
|-------|-------|
| **Credential Type** | Google Drive OAuth2 API |
| **Client ID** | _(from Step 2)_ |
| **Client Secret** | _(from Step 2)_ |

Click **Sign in with Google** and complete the OAuth authorization flow.

#### 6b. Gmail OAuth2

| Field | Value |
|-------|-------|
| **Credential Type** | Gmail OAuth2 API |
| **Client ID** | _(same as Step 2)_ |
| **Client Secret** | _(same as Step 2)_ |

Click **Sign in with Google** and authorize Gmail access.

#### 6c. Apify API Token

| Field | Value |
|-------|-------|
| **Credential Type** | Header Auth |
| **Name** | `Authorization` |
| **Value** | `Bearer YOUR_APIFY_API_TOKEN` |

Replace `YOUR_APIFY_API_TOKEN` with the token from Step 3.

#### 6d. Claude API Key

| Field | Value |
|-------|-------|
| **Credential Type** | Header Auth |
| **Name** | `x-api-key` |
| **Value** | `YOUR_CLAUDE_API_KEY` |

Replace `YOUR_CLAUDE_API_KEY` with the key from Step 4.

---

### Step 7: Import the Workflow

1. In the n8n editor, click **☰ Menu → Import from File**
2. Select the file `workflow/job_agent.json` from this project
3. The workflow will open with all 16+ nodes and connections pre-configured
4. Verify the workflow layout appears correct (nodes should flow left-to-right)

---

### Step 8: Update the Config Node Variables

1. Double-click the **Config** node (second node in the workflow)
2. Edit the JSON output to match your settings:

```json
{
  "GOOGLE_DRIVE_FILE_ID": "YOUR_ACTUAL_FILE_ID_FROM_STEP_5",
  "LINKEDIN_SEARCH_KEYWORDS": "Software Engineer,Backend Developer,Full Stack Developer",
  "LINKEDIN_LOCATION": "Australia",
  "RECIPIENT_EMAIL": "your.actual.email@gmail.com",
  "TOP_N_JOBS": 15,
  "AI_BATCH_SIZE": 5,
  "MIN_OVERALL_SCORE": 0,
  "EXCLUDE_KEYWORDS": "intern,junior,graduate,trainee"
}
```

Adjust the search keywords and exclude keywords to match your target roles.

---

### Step 9: Link Credentials to Nodes

Double-click each of the following nodes and select the correct credential from the dropdown:

| Node Name | Credential to Select |
|-----------|---------------------|
| **RetrieveCV** | Google Drive OAuth2 |
| **LinkedIn** | Apify API Token (Header Auth) |
| **Fetch Dataset** | Apify API Token (Header Auth) |
| **Score the Job** | Claude API Key (Header Auth) |
| **Send Email** | Gmail OAuth2 |
| **Send Empty Notification** | Gmail OAuth2 |

---

### Step 10: Test and Activate

1. **Manual Test Run**
   - Click the **Execute Workflow** button (▶️) in the top toolbar
   - Wait for the workflow to complete (typically 2–5 minutes)
   - Click on each node to inspect its output data
   - Verify the output at each stage:
     - `RetrieveCV`: should show binary PDF data
     - `Extract from File`: should show extracted text
     - `LinkedIn`: should show Apify run response
     - `NormalizeData`: should show standardized job objects
     - `Score the Job`: should show Claude API response
     - `Build Email HTML`: should show HTML string
     - `Send Email`: should show success confirmation

2. **Check Your Inbox**
   - You should receive the daily job report email
   - Verify the email renders correctly (scores, progress bars, buttons)

3. **Activate the Workflow**
   - Toggle the **Active** switch in the top-right corner to **ON**
   - The workflow will now run automatically every weekday at 07:30 AEST

4. **Monitor Executions**
   - Go to **☰ Menu → Executions** to view past runs
   - Failed executions will show error details for debugging

---

## Config Node Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GOOGLE_DRIVE_FILE_ID` | string | — | Your CV PDF file's Google Drive File ID |
| `LINKEDIN_SEARCH_KEYWORDS` | string | — | Comma-separated search keywords (e.g., `"Software Engineer,Backend Developer"`) |
| `LINKEDIN_LOCATION` | string | `"Australia"` | Geographic search region |
| `RECIPIENT_EMAIL` | string | — | Email address to receive the daily report |
| `TOP_N_JOBS` | number | `15` | Number of top-scoring jobs to include in the report |
| `AI_BATCH_SIZE` | number | `5` | Number of jobs per AI scoring API call (3–5 recommended) |
| `MIN_OVERALL_SCORE` | number | `0` | Minimum score threshold (jobs below this are excluded from the report) |
| `EXCLUDE_KEYWORDS` | string | `""` | Comma-separated keywords to exclude (matched against job title) |

---

## Scoring Schema

Each job is evaluated across 5 weighted dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| `technical_skills_match` | 35% | Tech stack, tools, certifications vs. CV skills |
| `experience_level_match` | 25% | Years of experience, seniority, role complexity |
| `language_requirements` | 15% | English proficiency, additional language needs |
| `industry_domain_fit` | 15% | Industry background relevance to the target role |
| `location_visa_compatibility` | 10% | Work rights, location, remote/hybrid compatibility |

**Overall Score Formula:**

```
overall_score = (technical × 0.35) + (experience × 0.25) + (language × 0.15) 
              + (industry × 0.15) + (location × 0.10)
```

**Recommended Action Mapping:**

| Action | Criteria |
|--------|----------|
| 🚀 `apply_now` | Score ≥ 80 with no critical red flags |
| 👍 `worth_applying` | Score ≥ 60 with no critical red flags |
| ⏸️ `low_priority` | Score < 60 or critical red flags present |

---

## Project Structure

```
daily-job-agent/
│
├── workflow/
│   └── job_agent.json              # Complete n8n workflow JSON (import this)
│
├── scripts/
│   ├── score_jobs.js               # AI scoring preprocessing & JSON Schema validation
│   ├── build_email.js              # HTML email template builder (table layout)
│   └── normalize_linkedin.js       # LinkedIn data cleaning & standardization
│
├── config/
│   ├── example.env                 # Environment variables reference with comments
│   └── ai_prompt.txt               # Claude AI system prompt (editable)
│
└── README.md                       # This documentation file
```

---

## FAQ & Troubleshooting

### General Issues

**Q: The workflow fails on the first run — what should I check first?**

A: The most common issues are credential configuration errors. In the n8n editor:
1. Go to each node that uses credentials (RetrieveCV, LinkedIn, Fetch Dataset, Score the Job, Send Email)
2. Click on the node → verify the credential is selected and shows a green checkmark
3. For Google credentials, you may need to re-authorize by clicking "Sign in with Google"
4. Check the **Executions** page for specific error messages

---

### LinkedIn / Apify Issues

**Q: Apify returns empty results (0 jobs found)**

A: Several possible causes:
- **Search keywords too narrow**: Try broader terms (e.g., "Developer" instead of "Senior Kotlin Backend Developer")
- **LinkedIn anti-scraping**: Apify's proxy may have been temporarily blocked. Wait 1 hour and retry
- **Actor subscription**: Ensure you've subscribed to `bebity/linkedin-jobs-scraper` in Apify Store
- **Insufficient credits**: Check your Apify account balance at [console.apify.com/billing](https://console.apify.com/billing)
- **Date filter**: `datePosted: "past-24h"` may filter out all jobs on some days. Try changing to `"past-week"` for testing

**Q: How do I use RapidAPI as a fallback for LinkedIn data?**

A: If Apify is unavailable, you can switch to the RapidAPI LinkedIn Jobs Search API:
1. Sign up at [rapidapi.com](https://rapidapi.com/jaypat87/api/linkedin-jobs-search)
2. Replace the LinkedIn node's URL with: `https://linkedin-jobs-search.p.rapidapi.com/`
3. Update the Header Auth credential:
   - Add header `X-RapidAPI-Key`: your RapidAPI key
   - Add header `X-RapidAPI-Host`: `linkedin-jobs-search.p.rapidapi.com`
4. Adjust the request body to match RapidAPI's expected format
5. The NormalizeData node should handle different field names automatically

---

### AI Scoring Issues

**Q: Getting "429 Too Many Requests" from Claude API**

A: This means you've hit rate limits. Solutions:
- **Reduce batch size**: Change `AI_BATCH_SIZE` from 5 to 3 in the Config node
- **Add delay**: Insert a **Wait** node (2 seconds) between `SplitInBatches` and `Score the Job`
- **Use a cheaper model**: Switch from `claude-sonnet-4-20250514` to `claude-3-5-haiku-20241022` in the Score the Job node
- The workflow includes automatic retry logic, so temporary 429 errors may resolve themselves

**Q: AI returns invalid JSON — scores are missing or malformed**

A: The `Parse and Merge Scores` node includes automatic JSON repair:
- Removes markdown code fences (` ```json `)
- Fixes trailing commas
- Fills in missing dimensions with default score of 50
- Recalculates overall_score using the explicit formula
- If a job completely fails parsing, it is skipped (not included in the report)

**Q: Scores seem inaccurate or too generous/strict**

A: You can fine-tune the AI behavior:
1. Edit the system prompt in `config/ai_prompt.txt`
2. Update the prompt in the `Score the Job` node's request body
3. Common adjustments:
   - Add specific skills you want weighted higher
   - Mention your visa status explicitly
   - Add industry context for better domain matching
4. You can also adjust `MIN_OVERALL_SCORE` to filter out low-confidence matches

---

### CV / Google Drive Issues

**Q: PDF text extraction returns garbage or empty text**

A: This happens with image-based or scanned PDFs:
- **Solution**: Ensure your CV is a **text-based PDF** (created by exporting from Word, Google Docs, LaTeX, or similar)
- **Test**: Open the PDF in a reader and try to select/copy text. If you can't, the PDF is image-based
- **Convert**: If you have an image PDF, use [Google Docs](https://docs.google.com) to open it (OCR will auto-apply), then re-export as PDF

**Q: Google Drive returns "File not found" error**

A: Check the following:
1. The `GOOGLE_DRIVE_FILE_ID` in the Config node is correct (no extra spaces)
2. The file is shared with the Google account connected in n8n credentials
3. If using a service account, share the file with the service account's email address
4. The file hasn't been moved to Trash

---

### Email Issues

**Q: Email not received after a successful run**

A: Check:
1. **Gmail Sent folder**: The email should appear in the sender's Sent folder
2. **Spam folder**: Check the recipient's spam/junk folder
3. **RECIPIENT_EMAIL**: Verify the email address in the Config node is correct
4. **Gmail OAuth**: The OAuth token may have expired — re-authorize in n8n Credentials
5. **Gmail sending limits**: Free Gmail accounts have a daily sending limit of 500 emails

**Q: Email looks broken in Outlook**

A: The email template uses table-based layout for maximum compatibility. However, Outlook has known rendering quirks:
- The workflow includes MSO conditional comments for Outlook compatibility
- Emoji progress bars should render correctly in all clients
- Background gradients may fall back to solid colors in Outlook (this is normal)

---

### Performance & Scheduling Issues

**Q: Can I change the schedule to run at a different time?**

A: Yes. Double-click the **Schedule Trigger** node and adjust:
- **Hour**: Change from 7 to your preferred hour (in the n8n server's timezone)
- **Minute**: Change from 30 to your preferred minute
- **Days**: The current setting `1-5` means Monday–Friday. Change to `*` for every day

**Q: The workflow takes too long to complete**

A: Typical execution time is 2–5 minutes. If it's longer:
- Reduce `rows` in the LinkedIn node from 100 to 50
- Reduce `AI_BATCH_SIZE` from 5 to 3 (fewer API calls but each is larger)
- Increase `MIN_OVERALL_SCORE` to skip scoring low-potential jobs early
- Check if the Apify run is timing out (increase `waitForFinish` parameter)

**Q: How do I run the workflow manually for testing?**

A: Simply click the **Execute Workflow** button (▶️) in the n8n editor toolbar. The Schedule Trigger node is bypassed during manual execution.

---

## Customization Guide

### Adding More Search Locations

Edit the LinkedIn node's request body to include multiple locations:

```json
{
  "searchQueries": ["Software Engineer"],
  "location": "Sydney, Australia",
  "locationList": ["Sydney", "Melbourne", "Brisbane", "Perth"],
  "datePosted": "past-24h",
  "rows": 100
}
```

### Changing the AI Model

In the **Score the Job** node, change the `model` field in the request body:

| Model | Speed | Quality | Cost |
|-------|-------|---------|------|
| `claude-sonnet-4-20250514` | Medium | Best | ~$0.015/1K tokens |
| `claude-3-5-haiku-20241022` | Fast | Good | ~$0.001/1K tokens |

### Adding Slack Notifications

1. Add a **Slack** node after the `Send Email` node
2. Configure with your Slack webhook URL
3. Send a summary message: "🎯 Found {N} jobs today. Top match: {title} at {company} ({score})"

### Storing Results in Google Sheets

1. Add a **Google Sheets** node after `Rank and Top N`
2. Configure to append rows to a tracking spreadsheet
3. Useful for analyzing trends over time

---

## Disclaimer

⚠️ **Important Notices:**

1. **AI Accuracy**: Scores are AI-generated estimates based on text matching between your CV and job descriptions. They are not guarantees of suitability. Always review job requirements carefully before applying.

2. **LinkedIn Terms of Service**: This tool uses Apify's commercial scraping infrastructure which operates through compliant proxy networks. However, users are responsible for ensuring their use complies with LinkedIn's Terms of Service in their jurisdiction.

3. **Data Privacy**: Your CV text is sent to the Anthropic Claude API for processing. Review Anthropic's data handling policies at [anthropic.com/privacy](https://www.anthropic.com/privacy). No CV data is stored permanently by this workflow.

4. **No Application Submission**: This tool does NOT submit job applications on your behalf. It only identifies and scores matching opportunities.

---

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<br/>

---

# 🎯 每日求职代理 — 澳大利亚

> 面向澳大利亚求职市场的自动化每日职位搜索与 AI 智能匹配系统。

这是一个 n8n 工作流，每个工作日早上自动搜索 LinkedIn 最新职位，使用 Claude AI 从 5 个维度将每个职位与你的简历进行匹配评分，并以精美的 HTML 邮件报告形式发送前 15 个最佳匹配机会。

---

## 📋 目录

- [架构概览](#架构概览)
- [所需账号](#所需账号)
- [预估运行成本](#预估运行成本)
- [部署步骤（共 10 步）](#部署步骤共-10-步)
- [Config 节点变量说明](#config-节点变量说明)
- [评分模型](#评分模型)
- [项目结构](#项目结构)
- [常见问题与故障排查](#常见问题与故障排查)
- [自定义指南](#自定义指南)
- [免责声明](#免责声明)
- [许可证](#许可证)

---

## 架构概览

该工作流是一个 8 阶段、16 节点的流水线，每个工作日 07:30 AEST 自动运行。

### 交互式流程图

> 上方两张图表同样适用于中文版，请参考 [Interactive Pipeline Diagram](#interactive-pipeline-diagram) 与 [Stage-by-Stage Summary](#stage-by-stage-summary)。

---

## 所需账号

在开始部署前，请确保已注册以下服务账号：

| # | 服务 | 用途 | 是否有免费套餐 | 注册链接 |
|---|------|------|--------------|---------|
| 1 | **n8n** | 工作流自动化引擎 | ✅ 自托管免费；云端版 $20/月起 | [n8n.io](https://n8n.io) |
| 2 | **Apify** | 通过 `bebity/linkedin-jobs-scraper` 抓取 LinkedIn 职位 | ✅ 每月 $5 免费额度 | [apify.com](https://apify.com) |
| 3 | **Google Cloud** | Google Drive API（简历获取）+ Gmail API（邮件发送） | ✅ 免费额度足够使用 | [console.cloud.google.com](https://console.cloud.google.com) |
| 4 | **Anthropic** | Claude AI API，用于职位-简历评分 | ❌ 按使用量付费（约 $0.15/次） | [platform.claude.com](https://platform.claude.com/) |

---

## 预估运行成本

| 组件 | 每次运行费用 | 每月费用（22 个工作日） |
|------|------------|----------------------|
| Apify（抓取 100 个职位） | ~$0.05 – $0.10 | ~$1.10 – $2.20 |
| Claude API（评分约 50 个职位） | ~$0.10 – $0.20 | ~$2.20 – $4.40 |
| Google APIs | 免费 | 免费 |
| n8n（自托管） | 免费 | 免费 |
| **合计** | **~$0.15 – $0.30** | **~$3.30 – $6.60** |

---

## 部署步骤（共 10 步）

### 第 1 步：安装并启动 n8n

选择以下任意一种安装方式：

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

**方式 C — n8n Cloud**

在 [app.n8n.cloud](https://app.n8n.cloud) 注册，无需本地安装。

启动后，通过 `http://localhost:5678`（或你的云端 URL）访问 n8n 编辑器。

---

### 第 2 步：创建 Google Cloud 项目并启用 API

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 点击 **选择项目** → **新建项目**
   - 项目名称：`job-agent`（或任意名称）
3. 导航至 **API 和服务 → 库**
4. 搜索并**启用**以下 API：
   - **Google Drive API**
   - **Gmail API**
5. 导航至 **API 和服务 → 凭据**
6. 点击 **+ 创建凭据** → **OAuth 2.0 客户端 ID**
   - 应用类型：**Web 应用**
   - 名称：`n8n Job Agent`
   - 已授权的重定向 URI：添加 `http://localhost:5678/rest/oauth2-credential/callback`
     （如使用远程托管，请替换为实际 n8n URL）
7. 点击 **创建**，记录 **客户端 ID** 和 **客户端密钥**
8. 导航至 **OAuth 同意屏幕**
   - 用户类型：**外部**（Google Workspace 用户可选内部）
   - 填写必填字段（应用名称、用户支持邮箱）
   - 添加范围：`https://www.googleapis.com/auth/drive.readonly` 和 `https://mail.google.com/`
   - 将你的邮箱添加为测试用户（应用处于测试模式时）

---

### 第 3 步：设置 Apify 账号与 Actor

1. 在 [apify.com](https://apify.com) 注册
2. 前往 **账户 → 设置 → 集成**
3. 复制 **Personal API Token** 并妥善保存
4. 前往 Apify Store 搜索 **bebity/linkedin-jobs-scraper**
   - 链接：[https://apify.com/bebity/linkedin-jobs-scraper](https://apify.com/bebity/linkedin-jobs-scraper)
5. 点击 **Try for free** 将其添加至你的 Actor 列表
6. 确认账户额度充足（$5 免费额度足够初始测试）

---

### 第 4 步：获取 Anthropic Claude API Key

1. 在 [platform.claude.com/](https://platform.claude.com/) 注册
2. 导航至 **设置 → API Keys**
3. 点击 **创建密钥**
   - 名称：`n8n-job-agent`
4. 复制 API Key（以 `sk-ant-api03-...` 开头）并妥善保存
5. 导航至 **设置 → 账单**
   - 添加付款方式
   - 建议设置月度消费上限（例如 $10）

---

### 第 5 步：将简历上传至 Google Drive

1. 确保简历为**文字版 PDF 格式**
   - ✅ 从 Word、Google Docs 或 LaTeX 导出的 PDF
   - ❌ 扫描版图片 PDF **不可用**（无法提取文字）
2. 将 PDF 上传至 Google Drive
3. 右键文件 → **共享** → **常规访问权限** → **知道链接的任何人**（查看者）
   - 或者，直接共享给 Google 服务账号邮箱
4. 从 URL 中复制**文件 ID**：
   ```
   https://drive.google.com/file/d/[这里是你的文件ID]/view
   ```
   例如：URL 为 `https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqR/view`，
   则文件 ID 为 `1aBcDeFgHiJkLmNoPqR`

---

### 第 6 步：配置 n8n 凭据

在 n8n 编辑器中，前往 **☰ 菜单 → 凭据**，创建以下四个凭据：

#### 6a. Google Drive OAuth2

| 字段 | 值 |
|------|----|
| **凭据类型** | Google Drive OAuth2 API |
| **客户端 ID** | _(来自第 2 步)_ |
| **客户端密钥** | _(来自第 2 步)_ |

点击 **使用 Google 登录** 并完成 OAuth 授权流程。

#### 6b. Gmail OAuth2

| 字段 | 值 |
|------|----|
| **凭据类型** | Gmail OAuth2 API |
| **客户端 ID** | _(同第 2 步)_ |
| **客户端密钥** | _(同第 2 步)_ |

点击 **使用 Google 登录** 并授权 Gmail 访问。

#### 6c. Apify API Token

| 字段 | 值 |
|------|----|
| **凭据类型** | Header Auth |
| **名称** | `Authorization` |
| **值** | `Bearer 你的APIFY_API_TOKEN` |

将 `你的APIFY_API_TOKEN` 替换为第 3 步中获取的 Token。

#### 6d. Claude API Key

| 字段 | 值 |
|------|----|
| **凭据类型** | Header Auth |
| **名称** | `x-api-key` |
| **值** | `你的CLAUDE_API_KEY` |

将 `你的CLAUDE_API_KEY` 替换为第 4 步中获取的 Key。

---

### 第 7 步：导入工作流

1. 在 n8n 编辑器中，点击 **☰ 菜单 → 从文件导入**
2. 选择本项目中的 `workflow/job_agent.json` 文件
3. 工作流将打开，其中所有 16+ 节点和连接均已预配置
4. 确认工作流布局正确（节点应从左到右排列）

---

### 第 8 步：更新 Config 节点变量

1. 双击工作流中的 **Config** 节点（第二个节点）
2. 根据你的设置编辑 JSON 输出：

```json
{
  "GOOGLE_DRIVE_FILE_ID": "你的实际文件ID（来自第5步）",
  "LINKEDIN_SEARCH_KEYWORDS": "Software Engineer,Backend Developer,Full Stack Developer",
  "LINKEDIN_LOCATION": "Australia",
  "RECIPIENT_EMAIL": "your.actual.email@gmail.com",
  "TOP_N_JOBS": 15,
  "AI_BATCH_SIZE": 5,
  "MIN_OVERALL_SCORE": 0,
  "EXCLUDE_KEYWORDS": "intern,junior,graduate,trainee"
}
```

根据你的目标职位调整搜索关键词和排除关键词。

---

### 第 9 步：为节点绑定凭据

双击以下每个节点，从下拉菜单中选择正确的凭据：

| 节点名称 | 需要选择的凭据 |
|---------|-------------|
| **RetrieveCV** | Google Drive OAuth2 |
| **LinkedIn** | Apify API Token (Header Auth) |
| **Fetch Dataset** | Apify API Token (Header Auth) |
| **Score the Job** | Claude API Key (Header Auth) |
| **Send Email** | Gmail OAuth2 |
| **Send Empty Notification** | Gmail OAuth2 |

---

### 第 10 步：测试并激活

1. **手动测试运行**
   - 点击顶部工具栏中的 **执行工作流** 按钮（▶️）
   - 等待工作流完成（通常需要 2–5 分钟）
   - 点击每个节点查看其输出数据
   - 验证各阶段输出：
     - `RetrieveCV`：应显示二进制 PDF 数据
     - `Extract from File`：应显示提取的文字
     - `LinkedIn`：应显示 Apify 运行响应
     - `NormalizeData`：应显示标准化的职位对象
     - `Score the Job`：应显示 Claude API 响应
     - `Build Email HTML`：应显示 HTML 字符串
     - `Send Email`：应显示成功确认

2. **检查收件箱**
   - 你应该收到每日职位报告邮件
   - 验证邮件渲染是否正确（分数、进度条、按钮）

3. **激活工作流**
   - 将右上角的 **激活** 开关切换到 **开**
   - 工作流将从此每个工作日 07:30 AEST 自动运行

4. **监控执行记录**
   - 前往 **☰ 菜单 → 执行记录** 查看历史运行
   - 失败的执行记录将显示错误详情以供调试

---

## Config 节点变量说明

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `GOOGLE_DRIVE_FILE_ID` | string | — | 简历 PDF 文件在 Google Drive 中的文件 ID |
| `LINKEDIN_SEARCH_KEYWORDS` | string | — | 以逗号分隔的搜索关键词（例如 `"Software Engineer,Backend Developer"`） |
| `LINKEDIN_LOCATION` | string | `"Australia"` | 地理搜索范围 |
| `RECIPIENT_EMAIL` | string | — | 接收每日报告的邮箱地址 |
| `TOP_N_JOBS` | number | `15` | 报告中包含的最高评分职位数量 |
| `AI_BATCH_SIZE` | number | `5` | 每次 AI 评分 API 调用处理的职位数量（建议 3–5） |
| `MIN_OVERALL_SCORE` | number | `0` | 最低分数阈值（低于此分数的职位将从报告中排除） |
| `EXCLUDE_KEYWORDS` | string | `""` | 以逗号分隔的排除关键词（与职位标题匹配） |

---

## 评分模型

每个职位从 5 个维度进行加权评分：

| 维度 | 权重 | 评估内容 |
|------|------|---------|
| `technical_skills_match` | 35% | 技术栈、工具、证书与简历技能的匹配度 |
| `experience_level_match` | 25% | 工作年限、职级、岗位复杂度 |
| `language_requirements` | 15% | 英语水平要求、其他语言需求 |
| `industry_domain_fit` | 15% | 行业背景与目标岗位的相关性 |
| `location_visa_compatibility` | 10% | 工作权益、地点、远程/混合办公兼容性 |

**总分计算公式：**

```
overall_score = (technical × 0.35) + (experience × 0.25) + (language × 0.15) 
              + (industry × 0.15) + (location × 0.10)
```

**推荐行动映射：**

| 行动 | 条件 |
|------|------|
| 🚀 `apply_now`（立即申请） | 分数 ≥ 80 且无严重红旗 |
| 👍 `worth_applying`（值得申请） | 分数 ≥ 60 且无严重红旗 |
| ⏸️ `low_priority`（低优先级） | 分数 < 60 或存在严重红旗 |

---

## 项目结构

```
daily-job-agent/
│
├── workflow/
│   └── job_agent.json              # 完整的 n8n 工作流 JSON（导入此文件）
│
├── scripts/
│   ├── score_jobs.js               # AI 评分预处理与 JSON Schema 验证
│   ├── build_email.js              # HTML 邮件模板构建器（表格布局）
│   └── normalize_linkedin.js       # LinkedIn 数据清洗与标准化
│
├── config/
│   ├── example.env                 # 环境变量参考（含注释）
│   └── ai_prompt.txt               # Claude AI 系统提示词（可编辑）
│
└── README.md                       # 本文档
```

---

## 常见问题与故障排查

### 通用问题

**Q：工作流首次运行失败，应该先检查什么？**

A：最常见的问题是凭据配置错误。在 n8n 编辑器中：
1. 前往每个使用凭据的节点（RetrieveCV、LinkedIn、Fetch Dataset、Score the Job、Send Email）
2. 点击节点 → 确认已选择凭据且显示绿色对勾
3. 对于 Google 凭据，可能需要点击"使用 Google 登录"重新授权
4. 查看**执行记录**页面获取具体错误信息

---

### LinkedIn / Apify 问题

**Q：Apify 返回空结果（找到 0 个职位）**

A：可能的原因：
- **搜索关键词过于具体**：尝试更宽泛的词汇（例如用 "Developer" 代替 "Senior Kotlin Backend Developer"）
- **LinkedIn 反爬虫**：Apify 的代理可能被临时封锁，等待 1 小时后重试
- **未订阅 Actor**：确保已在 Apify Store 中订阅 `bebity/linkedin-jobs-scraper`
- **额度不足**：在 [console.apify.com/billing](https://console.apify.com/billing) 检查账户余额
- **日期过滤器**：`datePosted: "past-24h"` 某些天可能过滤掉全部职位，测试时可改为 `"past-week"`

**Q：如何使用 RapidAPI 作为 LinkedIn 数据的备用方案？**

A：如果 Apify 不可用，可以切换到 RapidAPI LinkedIn Jobs Search API：
1. 在 [rapidapi.com](https://rapidapi.com/jaypat87/api/linkedin-jobs-search) 注册
2. 将 LinkedIn 节点的 URL 替换为：`https://linkedin-jobs-search.p.rapidapi.com/`
3. 更新 Header Auth 凭据：
   - 添加请求头 `X-RapidAPI-Key`：你的 RapidAPI Key
   - 添加请求头 `X-RapidAPI-Host`：`linkedin-jobs-search.p.rapidapi.com`
4. 调整请求体以匹配 RapidAPI 的预期格式
5. NormalizeData 节点应能自动处理不同的字段名称

---

### AI 评分问题

**Q：收到 Claude API 的 "429 Too Many Requests" 错误**

A：这表示你已触发速率限制，解决方案：
- **减小批次大小**：将 Config 节点中的 `AI_BATCH_SIZE` 从 5 改为 3
- **添加延迟**：在 `SplitInBatches` 和 `Score the Job` 之间插入 **Wait** 节点（2 秒）
- **使用更便宜的模型**：在 Score the Job 节点中将 `claude-sonnet-4-20250514` 改为 `claude-3-5-haiku-20241022`
- 工作流内置了自动重试逻辑，临时性的 429 错误可能会自动恢复

**Q：AI 返回无效 JSON——分数缺失或格式错误**

A：`Parse and Merge Scores` 节点内置了自动 JSON 修复功能：
- 移除 Markdown 代码围栏（` ```json `）
- 修复尾随逗号
- 用默认分数 50 填充缺失维度
- 使用明确公式重新计算 overall_score
- 如果某个职位完全解析失败，则跳过该职位（不包含在报告中）

**Q：评分不准确，或过于宽松/严格**

A：你可以微调 AI 行为：
1. 编辑 `config/ai_prompt.txt` 中的系统提示词
2. 更新 `Score the Job` 节点请求体中的提示词
3. 常见调整：
   - 添加你希望更高权重的特定技能
   - 明确说明你的签证状态
   - 添加行业背景以提高领域匹配度
4. 你还可以调整 `MIN_OVERALL_SCORE` 来过滤低置信度匹配

---

### 简历 / Google Drive 问题

**Q：PDF 文字提取返回乱码或空文本**

A：这通常发生在图片型或扫描型 PDF 中：
- **解决方案**：确保简历是**文字版 PDF**（从 Word、Google Docs、LaTeX 或类似工具导出）
- **测试方法**：在 PDF 阅读器中打开文件并尝试选择/复制文字，如果无法操作则为图片型 PDF
- **转换方法**：如果是图片 PDF，可用 [Google Docs](https://docs.google.com) 打开（会自动应用 OCR），然后重新导出为 PDF

**Q：Google Drive 返回"文件未找到"错误**

A：检查以下内容：
1. Config 节点中的 `GOOGLE_DRIVE_FILE_ID` 正确（无多余空格）
2. 文件已与 n8n 凭据中连接的 Google 账号共享
3. 如使用服务账号，请将文件共享给该服务账号的邮箱地址
4. 文件未被移至回收站

---

### 邮件问题

**Q：运行成功后未收到邮件**

A：检查：
1. **Gmail 已发送文件夹**：邮件应出现在发件人的已发送文件夹中
2. **垃圾邮件文件夹**：检查收件人的垃圾邮件/垃圾文件夹
3. **RECIPIENT_EMAIL**：确认 Config 节点中的邮箱地址正确
4. **Gmail OAuth**：OAuth Token 可能已过期，在 n8n 凭据中重新授权
5. **Gmail 发送限制**：免费 Gmail 账号每日发送上限为 500 封

**Q：邮件在 Outlook 中显示异常**

A：邮件模板使用基于表格的布局以确保最大兼容性，但 Outlook 有已知渲染问题：
- 工作流已包含针对 Outlook 兼容性的 MSO 条件注释
- 表情符号进度条在所有邮件客户端均应正常渲染
- 背景渐变在 Outlook 中可能回退为纯色（这是正常现象）

---

### 性能与调度问题

**Q：我可以更改运行时间吗？**

A：可以。双击 **Schedule Trigger** 节点并调整：
- **小时**：将 7 改为你偏好的小时（以 n8n 服务器的时区为准）
- **分钟**：将 30 改为你偏好的分钟
- **天数**：当前设置 `1-5` 表示周一至周五，改为 `*` 则每天运行

**Q：工作流运行时间过长**

A：典型执行时间为 2–5 分钟，如果更长：
- 将 LinkedIn 节点的 `rows` 从 100 减少到 50
- 将 `AI_BATCH_SIZE` 从 5 减少到 3（API 调用次数减少，但每次更大）
- 提高 `MIN_OVERALL_SCORE` 以提前跳过低潜力职位
- 检查 Apify 运行是否超时（增大 `waitForFinish` 参数）

**Q：如何手动运行工作流进行测试？**

A：直接点击 n8n 编辑器工具栏中的 **执行工作流** 按钮（▶️）即可。手动执行时 Schedule Trigger 节点会被跳过。

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
2. 使用你的 Slack Webhook URL 进行配置
3. 发送摘要消息："🎯 今日找到 {N} 个职位，最佳匹配：{company} 的 {title}（{score} 分）"

### 将结果存储到 Google Sheets

1. 在 `Rank and Top N` 节点后添加 **Google Sheets** 节点
2. 配置为向追踪表格追加行
3. 有助于分析长期趋势

---

## 免责声明

⚠️ **重要提示：**

1. **AI 准确性**：评分是基于简历与职位描述文本匹配的 AI 估算结果，并不保证适合性。在申请前请务必仔细阅读职位要求。

2. **LinkedIn 服务条款**：本工具使用 Apify 的商业爬取基础设施，通过合规代理网络运行。但用户有责任确保其使用方式符合所在司法管辖区 LinkedIn 的服务条款。

3. **数据隐私**：你的简历文本将被发送至 Anthropic Claude API 进行处理。请在 [anthropic.com/privacy](https://www.anthropic.com/privacy) 查看 Anthropic 的数据处理政策。本工作流不会永久存储任何简历数据。

4. **不提交申请**：本工具**不会**代表你提交职位申请，仅用于识别和评分匹配机会。

---

## 许可证

MIT 许可证

版权所有 (c) 2026

特此免费授予任何获得本软件及其相关文档文件（"软件"）副本的人不受限制地处理本软件的权利，包括但不限于使用、复制、修改、合并、发布、分发、再许可和/或出售软件副本的权利，以及允许向其提供软件的人员这样做，但须符合以下条件：

上述版权声明和本许可声明应包含在本软件的所有副本或重要部分中。

本软件按"原样"提供，不提供任何形式的明示或暗示担保，包括但不限于适销性、特定用途适用性和非侵权性的担保。在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任负责，无论是在合同、侵权或其他方面，由软件或软件的使用或其他交易引起或与之相关。
