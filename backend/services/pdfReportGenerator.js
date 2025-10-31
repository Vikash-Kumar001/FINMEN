import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFReportGenerator {
  constructor() {
    this.defaultBranding = {
      primaryColor: '#8B5CF6', // Purple
      secondaryColor: '#10B981', // Green
      fontFamily: 'Helvetica',
      logoUrl: null
    };
  }

  // Generate CSR Report PDF
  async generateCSRReport(reportData, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Generate PDF content
        this.generateReportContent(doc, reportData, options);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate report content
  generateReportContent(doc, reportData, options) {
    const branding = { ...this.defaultBranding, ...options.branding };
    
    // Cover Page
    this.generateCoverPage(doc, reportData, branding);
    
    // Table of Contents
    this.generateTableOfContents(doc, reportData);
    
    // Executive Summary
    this.generateExecutiveSummary(doc, reportData, branding);
    
    // Key Metrics
    this.generateKeyMetrics(doc, reportData, branding);
    
    // Schools and Students Reached
    this.generateSchoolsStudentsSection(doc, reportData, branding);
    
    // Completion Rates
    this.generateCompletionRatesSection(doc, reportData, branding);
    
    // Learning Improvements
    this.generateLearningImprovementsSection(doc, reportData, branding);
    
    // Certificates Issued
    this.generateCertificatesSection(doc, reportData, branding);
    
    // Financial Metrics
    this.generateFinancialMetricsSection(doc, reportData, branding);
    
    // NEP Competency Mapping
    this.generateNEPMappingSection(doc, reportData, branding);
    
    // Recommendations and Next Steps
    this.generateRecommendationsSection(doc, reportData, branding);
    
    // Footer on each page
    this.addPageNumbers(doc);
  }

  // Cover Page
  generateCoverPage(doc, reportData, branding) {
    // Header with logo
    doc.rect(0, 0, doc.page.width, 100)
       .fill(branding.primaryColor);
    
    doc.fillColor('white')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('CSR Impact Report', 50, 30, { align: 'center' });
    
    doc.fontSize(16)
       .text(reportData.reportTitle, 50, 60, { align: 'center' });
    
    // Report period
    doc.fillColor('black')
       .fontSize(14)
       .font('Helvetica')
       .text(`Period: ${this.formatDate(reportData.period.startDate)} - ${this.formatDate(reportData.period.endDate)}`, 
             50, 120, { align: 'center' });
    
    // Organization info
    doc.text(`Organization: ${reportData.organizationName}`, 50, 150, { align: 'center' });
    
    // Key highlights box
    doc.rect(50, 200, doc.page.width - 100, 200)
       .stroke(branding.primaryColor);
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor(branding.primaryColor)
       .text('Key Highlights', 60, 220);
    
    const highlights = reportData.content.keyHighlights || [];
    highlights.forEach((highlight, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('black')
         .text(`• ${highlight}`, 60, 250 + (index * 20));
    });
    
    // Generated date
    doc.fontSize(10)
       .fillColor('gray')
       .text(`Generated on: ${new Date().toLocaleDateString()}`, 50, doc.page.height - 100, { align: 'center' });
  }

  // Table of Contents
  generateTableOfContents(doc, reportData) {
    doc.addPage();
    
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('black')
       .text('Table of Contents', 50, 50);
    
    const sections = [
      'Executive Summary',
      'Key Metrics Overview',
      'Schools & Students Reached',
      'Completion Rates',
      'Learning Improvements',
      'Certificates Issued',
      'Financial Metrics',
      'NEP Competency Mapping',
      'Recommendations & Next Steps'
    ];
    
    sections.forEach((section, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${index + 1}. ${section}`, 70, 100 + (index * 25));
    });
  }

  // Executive Summary
  generateExecutiveSummary(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Executive Summary', branding);
    
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('black')
       .text(reportData.content.executiveSummary || reportData.generateExecutiveSummary(), 50, 100, {
         width: doc.page.width - 100,
         align: 'justify'
       });
  }

  // Key Metrics Overview
  generateKeyMetrics(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Key Metrics Overview', branding);
    
    const metrics = reportData.metrics;
    const yStart = 100;
    
    // Schools and Students
    this.addMetricBox(doc, 'Schools Reached', metrics.schoolsReached.totalSchools, yStart, branding);
    this.addMetricBox(doc, 'Students Reached', metrics.studentsReached.totalStudents, yStart + 80, branding);
    this.addMetricBox(doc, 'Completion Rate', `${metrics.completionRates.overallCompletionRate}%`, yStart + 160, branding);
    this.addMetricBox(doc, 'Average Improvement', `${metrics.learningImprovements.averageImprovement}%`, yStart + 240, branding);
    this.addMetricBox(doc, 'Certificates Issued', metrics.certificates.totalIssued, yStart + 320, branding);
    this.addMetricBox(doc, 'Spend per Student', `₹${metrics.financialMetrics.spendPerStudent}`, yStart + 400, branding);
  }

  // Schools and Students Section
  generateSchoolsStudentsSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Schools & Students Reached', branding);
    
    const schoolsData = reportData.metrics.schoolsReached;
    const studentsData = reportData.metrics.studentsReached;
    
    // Schools by Region
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Schools by Region', 50, 100);
    
    schoolsData.schoolsByRegion.forEach((region, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${region.region}: ${region.count} schools (${region.percentage}%)`, 70, 130 + (index * 20));
    });
    
    // Students by Grade
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Students by Grade', 50, 250);
    
    studentsData.studentsByGrade.forEach((grade, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Grade ${grade.grade}: ${grade.count} students (${grade.percentage}%)`, 70, 280 + (index * 20));
    });
  }

  // Completion Rates Section
  generateCompletionRatesSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Completion Rates', branding);
    
    const completionData = reportData.metrics.completionRates;
    
    // Overall completion rate
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`Overall Completion Rate: ${completionData.overallCompletionRate}%`, 50, 100);
    
    // Completion by Campaign
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Completion by Campaign', 50, 150);
    
    completionData.completionByCampaign.forEach((campaign, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${campaign.campaignName}: ${campaign.completionRate}% (${campaign.completedParticipants}/${campaign.totalParticipants})`, 
               70, 180 + (index * 20));
    });
  }

  // Learning Improvements Section
  generateLearningImprovementsSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Learning Improvements', branding);
    
    const improvementsData = reportData.metrics.learningImprovements;
    
    // Average improvement
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`Average Improvement: ${improvementsData.averageImprovement}%`, 50, 100);
    
    // Improvements by Pillar
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Improvements by Learning Pillar', 50, 150);
    
    improvementsData.improvementsByPillar.forEach((pillar, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${pillar.pillar}: ${pillar.improvementPercentage}% improvement (${pillar.studentsAssessed} students)`, 
               70, 180 + (index * 20));
    });
  }

  // Certificates Section
  generateCertificatesSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Certificates Issued', branding);
    
    const certificatesData = reportData.metrics.certificates;
    
    // Total certificates
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`Total Certificates Issued: ${certificatesData.totalIssued}`, 50, 100);
    
    // Certificates by Type
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Certificates by Type', 50, 150);
    
    certificatesData.certificatesByType.forEach((type, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${type.type}: ${type.count} (${type.percentage}%)`, 70, 180 + (index * 20));
    });
    
    // Certificates by Module
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Certificates by Module', 50, 300);
    
    certificatesData.certificatesByModule.forEach((module, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${module.module}: ${module.count} (${module.percentage}%)`, 70, 330 + (index * 20));
    });
  }

  // Financial Metrics Section
  generateFinancialMetricsSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Financial Metrics', branding);
    
    const financialData = reportData.metrics.financialMetrics;
    
    // Key financial metrics
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`Total Spend: ₹${financialData.totalSpend.toLocaleString()}`, 50, 100);
    
    doc.fontSize(14)
       .text(`Spend per Student: ₹${financialData.spendPerStudent}`, 50, 130);
    
    doc.text(`HealCoins Distributed: ${financialData.healCoinsDistributed.toLocaleString()}`, 50, 160);
    
    doc.text(`Budget Utilization: ${financialData.budgetUtilization}%`, 50, 190);
    
    doc.text(`Cost per Completion: ₹${financialData.costPerCompletion}`, 50, 220);
    
    // Spend by Category
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Spend by Category', 50, 280);
    
    financialData.spendByCategory.forEach((category, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${category.category}: ₹${category.amount.toLocaleString()} (${category.percentage}%)`, 
               70, 310 + (index * 20));
    });
  }

  // NEP Mapping Section
  generateNEPMappingSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'NEP Competency Mapping', branding);
    
    const nepData = reportData.nepMapping;
    
    // Coverage summary
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(`NEP Competency Coverage: ${nepData.coveragePercentage}%`, 50, 100);
    
    doc.fontSize(14)
       .text(`Competencies Covered: ${nepData.competenciesCovered}/${nepData.totalCompetencies}`, 50, 130);
    
    // Coverage by Grade
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Coverage by Grade', 50, 180);
    
    nepData.competenciesByGrade.forEach((grade, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Grade ${grade.grade}: ${grade.coveragePercentage}% (${grade.coveredCompetencies}/${grade.totalCompetencies})`, 
               70, 210 + (index * 20));
    });
  }

  // Recommendations Section
  generateRecommendationsSection(doc, reportData, branding) {
    doc.addPage();
    
    this.addSectionHeader(doc, 'Recommendations & Next Steps', branding);
    
    // Recommendations
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Recommendations', 50, 100);
    
    const recommendations = reportData.content.recommendations || [];
    recommendations.forEach((rec, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${index + 1}. ${rec}`, 70, 130 + (index * 25), {
           width: doc.page.width - 120
         });
    });
    
    // Next Steps
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Next Steps', 50, 300);
    
    const nextSteps = reportData.content.nextSteps || [];
    nextSteps.forEach((step, index) => {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`${index + 1}. ${step}`, 70, 330 + (index * 25), {
           width: doc.page.width - 120
         });
    });
  }

  // Helper Methods
  addSectionHeader(doc, title, branding) {
    doc.rect(0, 0, doc.page.width, 40)
       .fill(branding.primaryColor);
    
    doc.fillColor('white')
       .fontSize(18)
       .font('Helvetica-Bold')
       .text(title, 50, 15);
  }

  addMetricBox(doc, label, value, y, branding) {
    const boxWidth = 200;
    const boxHeight = 60;
    const x = 50;
    
    doc.rect(x, y, boxWidth, boxHeight)
       .stroke(branding.primaryColor);
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor(branding.primaryColor)
       .text(label, x + 10, y + 10);
    
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('black')
       .text(value, x + 10, y + 30);
  }

  addPageNumbers(doc) {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(10)
         .fillColor('gray')
         .text(`Page ${i + 1}`, doc.page.width - 100, doc.page.height - 30);
    }
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export default new PDFReportGenerator();
