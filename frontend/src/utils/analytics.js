import api from './api';

class Analytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.flushInterval = null;
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generic event tracker
  async track(eventName, metadata = {}, eventCategory = 'action') {
    try {
      await api.post('/api/analytics/events', {
        eventName,
        eventCategory,
        metadata: {
          ...metadata,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics should never break the app
    }
  }

  // Batch track multiple events
  async trackBatch(events) {
    try {
      await api.post('/api/analytics/events/batch', {
        events: events.map(event => ({
          ...event,
          metadata: {
            ...event.metadata,
            sessionId: this.sessionId,
          },
        })),
      });
    } catch (error) {
      console.error('Analytics batch tracking error:', error);
    }
  }

  // Queue events for batch sending
  queue(eventName, metadata = {}, eventCategory = 'action') {
    this.eventQueue.push({
      eventName,
      eventCategory,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      },
    });

    // Auto-flush if queue gets too large
    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  // Flush queued events
  async flush() {
    if (this.eventQueue.length === 0) return;

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await this.trackBatch(eventsToSend);
    } catch (error) {
      console.error('Analytics flush error:', error);
    }
  }

  // Start auto-flush interval
  startAutoFlush(intervalMs = 30000) {
    this.stopAutoFlush();
    this.flushInterval = setInterval(() => {
      this.flush();
    }, intervalMs);
  }

  // Stop auto-flush interval
  stopAutoFlush() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  // ============= SPECIFIC EVENT TRACKERS =============

  // Track overview view
  async trackOverviewView(school_id, campus_id = 'all') {
    try {
      await api.post('/api/analytics/events/overview-view', {
        school_id,
        campus_id,
      });
    } catch (error) {
      console.error('Error tracking overview view:', error);
    }
  }

  // Track approval action
  async trackApprovalAction(assignment_id, action, template_id = null, item_type = 'assignment') {
    try {
      await api.post('/api/analytics/events/approval-action', {
        assignment_id,
        template_id,
        item_type,
        action, // 'approved', 'rejected', 'requested_changes'
      });
    } catch (error) {
      console.error('Error tracking approval action:', error);
    }
  }

  // Track template creation
  async trackTemplateCreate(template_id, template_type, template_category) {
    try {
      await api.post('/api/analytics/events/template-create', {
        template_id,
        template_type,
        template_category,
      });
    } catch (error) {
      console.error('Error tracking template creation:', error);
    }
  }

  // ============= ADDITIONAL TRACKING METHODS =============

  // Track page view
  trackPageView(pageName, metadata = {}) {
    this.track(`page.${pageName}.view`, metadata, 'view');
  }

  // Track button click
  trackClick(elementName, metadata = {}) {
    this.track(`click.${elementName}`, metadata, 'action');
  }

  // Track form submission
  trackFormSubmit(formName, metadata = {}) {
    this.track(`form.${formName}.submit`, metadata, 'action');
  }

  // Track export action
  trackExport(exportType, format, metadata = {}) {
    this.track(`export.${exportType}`, { ...metadata, format }, 'export');
  }

  // Track error
  trackError(errorType, errorMessage, metadata = {}) {
    this.track(`error.${errorType}`, { ...metadata, errorMessage }, 'system');
  }

  // Track performance
  trackPerformance(metricName, value, metadata = {}) {
    this.track(`performance.${metricName}`, { ...metadata, value }, 'system');
  }
}

// Create singleton instance
const analytics = new Analytics();

// Start auto-flush
analytics.startAutoFlush();

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analytics.flush();
  });
}

export default analytics;

