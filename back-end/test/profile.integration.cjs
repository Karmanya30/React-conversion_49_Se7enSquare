// Run after npm run build. Uses an isolated temporary DB and the real HTTP controllers/guards.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'se7ensquare-profile-'));
process.chdir(temp);
process.env.NODE_ENV = 'production';
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require(path.join(root, 'dist/app.module'));
const { db, hashPassword, saveDb } = require(path.join(root, 'dist/common/utils/in-memory-db'));
const { FileLoggerService } = require(path.join(root, 'dist/common/logger/file-logger.service'));

async function run() {
  const roles = ['user', 'user', 'moderator', 'admin', 'owner', 'organizer', 'community_manager', 'user'];
  const users = roles.map((role, i) => ({ id: 9000 + i, username: `profile_${i}`, email: `profile_${i}@test.invalid`,
    firstName: `Profile${i}`, lastName: 'Test', bio: 'Profile test biography', phone: '1234567890', role, status: 'active',
    authProvider: i === 7 ? 'google' : 'local', ...(i === 7 ? { googleId: 'test-google-id' } : { passwordHash: hashPassword('Testpass123') }) }));
  db.users.push(...users);
  db.communities.push({ id: 9000, name: 'Profile tests', description: 'Profile privacy tests', tags: ['test'], ownerId: 9000, visibility: 'public' });
  db.memberships.push(...[9000, 9001].map((userId, i) => ({ id: 9000 + i, userId, communityId: 9000, joinedAt: new Date().toISOString() })));
  db.posts.push({ id: 9000, title: 'Profile activity', content: 'Test post', authorId: 9000, communityId: 9000 });
  db.reports.push({ id: 9000, reporterId: 9001, targetType: 'user', targetId: 9000, reason: 'Test report', status: 'pending' });
  saveDb();
  const app = await NestFactory.create(AppModule, { logger: false });
  const logger = app.get(FileLoggerService);
  logger.log = logger.error = logger.warn = () => {};
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const serve = process.argv.includes('--serve');
  if (serve) {
    const express = require('express');
    const dist = path.resolve(root, '../front-end/react-app/dist');
    app.use(express.static(dist));
    for (const route of ['/login', '/profile-settings', '/profile-settings.html', '/owner-dashboard', '/dashboard']) {
      app.use(route, (req, res) => res.sendFile(path.join(dist, 'index.html')));
    }
  }
  await app.listen(serve ? 3100 : 0, '127.0.0.1');
  const base = await app.getUrl();
  let checks = 0;
  async function request(endpoint, viewer = 0, method = 'GET', body, expected = 200) {
    const headers = viewer === null ? {} : { 'x-user-id': String(users[viewer].id), 'x-role': users[viewer].role };
    if (body !== undefined && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const response = await fetch(`${base}/api${endpoint}`, { method, headers,
      ...(body === undefined ? {} : { body: body instanceof FormData ? body : JSON.stringify(body) }) });
    const data = await response.json();
    assert.equal(response.status, expected, `${method} ${endpoint}: ${JSON.stringify(data)}`);
    checks++;
    return data;
  }
  try {
    await request('/users/me', null, 'GET', undefined, 401);
    await request('/auth/change-password', null, 'POST', { new: 'Updated123', confirm: 'Updated123' }, 401);
    let me = await request('/users/me');
    assert.equal(me.hasPassword, true); assert(!('passwordHash' in me)); assert(!('allowDMs' in me.privacy));
    for (const bio of ['bad', 'x'.repeat(161), '']) await request('/users/me', 0, 'PATCH', { bio }, 400);
    await request('/users/me', 0, 'PATCH', { username: null }, 400);
    await request('/users/me', 0, 'PATCH', { privacy: { searchEngine: true } }, 400);
    await request('/users/me', 0, 'PATCH', { avatar: 'data:image/png;base64,abc' }, 400);
    const upload = new FormData();
    upload.append('file', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV0cAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'avatar.png');
    const uploaded = await request('/uploads', 4, 'POST', upload, 201);
    assert.match(uploaded.fileUrl, /^\/uploads\//);
    assert.equal((await fetch(base + uploaded.fileUrl)).status, 200);
    me = await request('/users/me', 0, 'PATCH', { firstName: 'Updated', bio: 'Updated profile biography', avatar: uploaded.fileUrl });
    assert.equal(me.firstName, 'Updated'); assert.equal(me.avatar, uploaded.fileUrl);
    const member = (await request('/users?communityId=9000', 1)).find(u => u.id === 9000);
    assert.equal(member.fullName, 'Updated Test'); assert.equal(member.avatar, uploaded.fileUrl);
    for (const [toggle, field] of [['showEmail', 'email'], ['showPhone', 'phone'], ['showActivity', 'activity']]) {
      for (const enabled of [false, true]) {
        await request('/users/me', 0, 'PATCH', { privacy: { [toggle]: enabled } });
        for (const viewer of [1, 2]) {
          const other = await request('/users/9000', viewer);
          assert.equal(field in other, enabled, `${toggle} viewer ${viewer}`);
          const memberView = (await request('/users?communityId=9000', viewer)).find(u => u.id === 9000);
          assert.equal(field in memberView, enabled);
        }
        for (const [viewer, suffix] of [[2, '?reportId=9000'], [3, '']]) {
          const privileged = await request('/users/9000' + suffix, viewer);
          assert.equal(privileged.email, users[0].email);
          assert.equal(privileged.phone, users[0].phone);
        }
      }
    }
    await request('/users/me', 0, 'PATCH', { privacy: { profileVisibility: 'members' } });
    assert.equal((await request('/users/9000', 1)).firstName, 'Updated');
    assert.equal((await request('/users/9000', 2)).profileRestricted, true);
    await request('/users/me', 0, 'PATCH', { privacy: { profileVisibility: 'private' } });
    for (const viewer of [1, 2]) {
      const hidden = await request('/users/9000', viewer);
      assert.equal(hidden.profileRestricted, true); assert(!('avatar' in hidden)); assert(!('email' in hidden));
    }
    assert.equal((await request('/users/9000?reportId=9000', 2)).firstName, 'Updated');
    assert.equal((await request('/users/9000?reportId=999999', 2)).profileRestricted, true);
    const adminView = await request('/users/9000', 3);
    assert.equal(adminView.firstName, 'Updated'); assert.equal(adminView.fullName, 'Updated Test');
    await request('/users/me', 0, 'PATCH', { privacy: { profileVisibility: 'public', appearInSearch: false, showEmail: false } });
    for (const viewer of [1, 2]) assert(!(await request('/users?search=profile_0', viewer)).some(u => u.id === 9000));
    assert((await request('/users?search=profile_0', 3)).some(u => u.id === 9000));
    assert((await request('/users?search=profile_0&reportId=9000', 2)).some(u => u.id === 9000));
    assert((await request('/users?communityId=9000', 1)).some(u => u.id === 9000));
    await request('/users/me', 0, 'PATCH', { privacy: { appearInSearch: true } });
    assert((await request('/users?search=profile_0', 1)).some(u => u.id === 9000));
    assert(!(await request('/users?search=' + encodeURIComponent(users[0].email), 1)).some(u => u.id === 9000));
    for (const body of [
      { current: 'wrong', new: 'Updated123', confirm: 'Updated123' },
      { current: 'Testpass123', new: 'short1', confirm: 'short1' },
      { current: 'Testpass123', new: 'abcdefgh', confirm: 'abcdefgh' },
      { current: 'Testpass123', new: '12345678', confirm: '12345678' },
      { current: 'Testpass123', new: 'Updated123', confirm: 'mismatch1' },
      { current: 'Testpass123', new: 'Testpass123', confirm: 'Testpass123' },
    ]) await request('/auth/change-password', 0, 'POST', body, 400);
    await request('/auth/change-password', 0, 'POST', { current: 'Testpass123', new: 'Updated123', confirm: 'Updated123' }, 201);
    await request('/auth/login', null, 'POST', { login: 'profile_0', password: 'Testpass123' }, 401);
    await request('/auth/login', null, 'POST', { login: 'profile_0', password: 'Updated123' }, 201);
    assert.equal((await request('/users/me', 7)).hasPassword, false);
    await request('/auth/change-password', 7, 'POST', { new: 'Google123', confirm: 'Google123' }, 201);
    assert.equal((await request('/users/me', 7)).hasPassword, true);
    const application = { experienceNote: 'Organised several local gaming events.', games: 'Chess', organisations: 'Campus club', pastEventLinks: ['https://example.com/event'], expectedTournamentSize: 32, rulesAgreement: true, userId: 9001 };
    for (const viewer of [2, 3, 4, 5, 6]) await request('/organisers/apply', viewer, 'POST', application, 403);
    await request('/organisers/apply', 0, 'POST', { ...application, rulesAgreement: false }, 400);
    const org = await request('/organisers/apply', 0, 'POST', application, 201);
    assert.equal(org.userId, 9000); assert.equal(org.games, 'Chess');
    await request('/organisers/apply', 0, 'POST', application, 400);
    await request(`/organisers/${org.id}`, 3, 'PATCH', { status: 'rejected', rejectionReason: 'Please provide more experience.' });
    assert.match((await request('/organisers/profile?userId=9001', 0)).rejectionReason, /experience/);
    const retry = await request('/organisers/apply', 0, 'POST', application, 201);
    await request(`/organisers/${retry.id}`, 3, 'PATCH', { status: 'verified' });
    users[0].role = 'organizer';
    assert.equal((await request('/organisers/profile', 0)).status, 'verified');
    const quiz = await request('/moderator-certification/quiz', 1);
    assert.equal(quiz.length, 5); assert(quiz.every(q => !('answerIndex' in q)));
    const statement = { why: 'I want to help keep community events fair.', timeZone: 'Asia/Kolkata', weeklyHours: 8 };
    const quizBody = { answers: [1, 1, 2, 0, 1], statement, userId: 9000 };
    for (const viewer of [2, 3, 4]) await request('/moderator-certification/apply', viewer, 'POST', quizBody, 403);
    await request('/moderator-certification/apply', 1, 'POST', { ...quizBody, answers: [0] }, 400);
    await request('/moderator-certification/apply', 1, 'POST', { ...quizBody, answers: [9, 9, 9, 9, 9] }, 400);
    await request('/moderator-certification/apply', 1, 'POST', { answers: quizBody.answers }, 400);
    const failed = await request('/moderator-certification/apply', 1, 'POST', { ...quizBody, answers: [0, 0, 0, 1, 0] }, 201);
    assert.equal(failed.status, 'rejected'); assert.equal(failed.passMark, 70);
    const passed = await request('/moderator-certification/apply', 1, 'POST', quizBody, 201);
    assert.equal(passed.userId, 9001); assert.equal(passed.quizScore, 100); assert.deepEqual(passed.statement, statement); assert.deepEqual(passed.answers, quizBody.answers);
    await request('/moderator-certification/apply', 1, 'POST', quizBody, 400);
    await request(`/moderator-certification/${passed.id}`, 3, 'PATCH', { status: 'certified' });
    users[1].role = 'moderator';
    assert.equal((await request('/moderator-certification/status', 1)).status, 'certified');
    const stored = JSON.parse(fs.readFileSync(path.join(temp, 'db.json'))).db.users.find(u => u.id === 9000);
    assert.equal(stored.privacy.appearInSearch, true); assert.equal(stored.firstName, 'Updated');
    console.log(`Profile integration: ${checks} HTTP checks passed (users, moderator, admin, owner, organizer, community manager, Google-only).`);
    if (serve) { console.log(`UI test server: ${base}; owner login profile_4 / Testpass123`); return; }
  } finally {
    if (!serve) await app.close();
  }
}
run().catch(err => { console.error(err); process.exit(1); });
