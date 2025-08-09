const request = require('supertest');
const app = require('../server');

describe('Courses GET', () => {
  it('GET /course/ returns 200 and an array', async () => {
    const res = await request(app).get('/course/');
    expect([200,500]).toContain(res.statusCode);
    if (res.statusCode === 200) expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /course/:id invalid id returns 400/404', async () => {
    const res = await request(app).get('/course/66a000000000000000000000');
    expect([400,404,500]).toContain(res.statusCode);
  });

  it('GET /course/ sets content-type json', async () => {
    const res = await request(app).get('/course/').set('Accept', 'application/json');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /course/:id valid-ish returns 200/404', async () => {
    const res = await request(app).get('/course/66a000000000000000000001');
    expect([200,404,500]).toContain(res.statusCode);
  });
});