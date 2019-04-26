let data = [];
let clomuns = [];

data[0].couresList.forEach(c => {
  clomuns.push({
    title: c.couresName,
    dataIndex: c.couresName,
    key: c.couresName
  });
});

const dataSource = data.map(user => {
  const { courseList, studentId, teacherId, year } = user;
  let userData = { studentId, teacherId, year };
  courseList.forEach(c => (userData[c.courseName] = c.courseSorce));
  return userData;
});
