try {
  console.log('Testing requires...');
  require('./models/Task');
  console.log('models/Task ok');
  require('./ai/taskPlanner');
  console.log('ai/taskPlanner ok');
  require('./middleware/auth.middleware');
  console.log('middleware/auth.middleware ok');
  require('./models/Project');
  console.log('models/Project ok');
  require('./routes/aiTask.routes');
  console.log('routes/aiTask.routes ok');
  require('./routes/task.routes');
  console.log('routes/task.routes ok');
  console.log('All requires passed.');
} catch (error) {
  console.error('Require failed:', error);
}
