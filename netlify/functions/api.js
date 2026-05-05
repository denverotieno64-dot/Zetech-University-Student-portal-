exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  const path = event.queryStringParameters?.route || '';
  const body = event.body ? JSON.parse(event.body) : {};

  const DB = {
    users: [
      { id: 1, reg_number: 'STU001', full_name: 'John Mwangi', email: 'john@zetech.ac.ke', password: 'password123', role: 'student', program: 'Computer Science' },
      { id: 2, reg_number: 'STU002', full_name: 'Mary Wanjiku', email: 'mary@zetech.ac.ke', password: 'password123', role: 'student', program: 'Business' }
    ],
    schools: [
      { id: 1, name: 'School of Business & Economics', code: 'SOBE' },
      { id: 2, name: 'School of ICT & Engineering', code: 'SITE' },
      { id: 3, name: 'School of Hospitality', code: 'SHAS' },
      { id: 4, name: 'School of Education', code: 'SESS' }
    ],
    courses: [
      { id: 1, course_code: 'CSC101', course_name: 'Computer Science', school_id: 2, credits: 3, description: 'Fundamentals of computing' },
      { id: 2, course_code: 'BUS101', course_name: 'Business Management', school_id: 1, credits: 3, description: 'Management principles' },
      { id: 3, course_code: 'HOS101', course_name: 'Hospitality Intro', school_id: 3, credits: 3, description: 'Hospitality basics' },
      { id: 4, course_code: 'EDU101', course_name: 'Educational Psychology', school_id: 4, credits: 3, description: 'Psychology in education' }
    ],
    enrollments: [
      { student_id: 1, course_id: 1, grade: 78 },
      { student_id: 1, course_id: 2, grade: null }
    ],
    announcements: [
      { id: 1, title: 'Welcome!', content: 'Welcome to Zetech Digital School', created_at: '2025-03-01' }
    ]
  };

  if (event.httpMethod === 'POST' && path === 'login') {
    const user = DB.users.find(u => u.reg_number === body.reg_number && u.password === body.password);
    if (user) return { statusCode: 200, headers, body: JSON.stringify({ success: true, user }) };
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid credentials' }) };
  }

  if (event.httpMethod === 'GET' && path === 'dashboard') {
    return { statusCode: 200, headers, body: JSON.stringify({ courses: 2, pending_assignments: 1, gpa: 3.5 }) };
  }

  if (event.httpMethod === 'GET' && path === 'my-courses') {
    const courses = DB.enrollments.map(e => ({ ...DB.courses.find(c => c.id === e.course_id), grade: e.grade }));
    return { statusCode: 200, headers, body: JSON.stringify(courses) };
  }

  if (event.httpMethod === 'GET' && path === 'courses') {
    const courses = DB.courses.map(c => ({ ...c, school_name: DB.schools.find(s => s.id === c.school_id)?.name }));
    return { statusCode: 200, headers, body: JSON.stringify(courses) };
  }

  if (event.httpMethod === 'GET' && path === 'grades') {
    const grades = DB.enrollments.filter(e => e.grade).map(e => {
      const c = DB.courses.find(c => c.id === e.course_id);
      return { course_code: c?.course_code, course_name: c?.course_name, grade: e.grade, letter_grade: e.grade >= 70 ? 'A' : 'B' };
    });
    return { statusCode: 200, headers, body: JSON.stringify(grades) };
  }

  if (event.httpMethod === 'GET' && path === 'announcements') {
    return { statusCode: 200, headers, body: JSON.stringify(DB.announcements) };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
};
