function generateFairSchedule(startDate, endDate, teammates, jobs) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateList = getDates(start, end);
    const schedule = [];
    const lastAssignment = {};
  
    jobs.forEach(job => {
      lastAssignment[job.name] = {};
      teammates.forEach(teammate => {
        lastAssignment[job.name][teammate] = -Infinity;
      });
    });
  
    dateList.forEach((date, dateIndex) => {
      const dailyJobs = [];
      const assignedToday = new Set();
  
      jobs.forEach(job => {
        for (let i = 0; i < job.assigneesPerDay; i++) {
          const availableAssignees = job.assignees.filter(assignee => 
            !assignedToday.has(assignee) && 
            (dateIndex - lastAssignment[job.name][assignee] > job.assignees.length - 1)
          );
  
          let chosenAssignee;
          if (availableAssignees.length === 0) {
            chosenAssignee = job.assignees.find(assignee => !assignedToday.has(assignee));
          } else {
            chosenAssignee = availableAssignees.reduce((a, b) => 
              lastAssignment[job.name][a] < lastAssignment[job.name][b] ? a : b
            );
          }
  
          lastAssignment[job.name][chosenAssignee] = dateIndex;
          assignedToday.add(chosenAssignee);
          dailyJobs.push({ name: job.name, assignee: chosenAssignee });
        }
      });
  
      schedule.push({
        date: date.toISOString().split('T')[0],
        jobs: dailyJobs
      });
    });
  
    return schedule;
  }
  
  function getDates(start, end) {
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
  
  module.exports = generateFairSchedule;