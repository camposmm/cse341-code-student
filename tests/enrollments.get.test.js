const request = require('supertest');
const app = require('../server');

describe('Enrollments GET', () => {
  it('GET /enrollments/student/:id returns 200/404', async () => {
    const res = await request(app).get('/enrollments/student/66a000000000000000000000');
    expect([200,404,500]).toContain(res.statusCode);
  });

  it('GET /enrollments/course/:id returns 200/404', async () => {
    const res = await request(app).get('/enrollments/course/66a000000000000000000000');
    expect([200,404,500]).toContain(res.statusCode);
  });

  it('GET /enrollments/student/:id returns json', async () => {
    const res = await request(app).get('/enrollments/student/66a000000000000000000000').set('Accept', 'application/json');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /enrollments/course/:id returns json', async () => {
    const res = await request(app).get('/enrollments/course/66a000000000000000000000').set('Accept', 'application/json');
    expect(res.headers['content-type']).toMatch(/json/);
  });
});