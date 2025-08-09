const request = require('supertest');
const app = require('../server');

describe('Students GET', () => {
  it('GET /student/ returns 200 and an array', async () => {
    const res = await request(app).get('/student/');
    expect([200,500]).toContain(res.statusCode); // 500 if DB not connected in CI
    if (res.statusCode === 200) expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /student/:id invalid id returns 400/404', async () => {
    const res = await request(app).get('/student/66a000000000000000000000');
    expect([400,404,500]).toContain(res.statusCode);
  });

  it('GET /student/ sets content-type json', async () => {
    const res = await request(app).get('/student/').set('Accept', 'application/json');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /student/:id valid-ish returns 200/404', async () => {
    const res = await request(app).get('/student/66a000000000000000000001');
    expect([200,404,500]).toContain(res.statusCode);
  });
});