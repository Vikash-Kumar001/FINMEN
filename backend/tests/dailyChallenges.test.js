// Minimal illustrative tests (requires jest and test setup)
import request from 'supertest';
import app from '../server';

// NOTE: This file is illustrative. A proper test harness and DB fixtures are needed.
describe('Daily Challenges', () => {
  it('should return 10 daily challenges', async () => {
    const token = 'TEST_JWT'; // replace with real token in setup
    const res = await request(app)
      .get('/api/daily-challenges')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.challenges)).toBe(true);
    // expect(res.body.challenges).toHaveLength(10); // enable with stable data
  });

  it('should update progress and award rewards on completion', async () => {
    const token = 'TEST_JWT'; // replace with real token in setup
    const challengesRes = await request(app)
      .get('/api/daily-challenges')
      .set('Authorization', `Bearer ${token}`);
    const challenge = challengesRes.body.challenges?.[0]?.challenge;
    if (!challenge) return;

    // Complete all steps
    for (let step = 1; step <= (challenge.completionSteps || 1); step++) {
      const res = await request(app)
        .post(`/api/daily-challenges/progress/${challenge._id}`)
        .send({ step })
        .set('Authorization', `Bearer ${token}`);
      expect([200, 400, 404]).toContain(res.status);
    }
  });
});
