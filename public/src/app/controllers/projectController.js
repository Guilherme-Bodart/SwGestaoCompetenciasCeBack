const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
      const project = await Project.find().populate(['tasks']);
      return res.send({ project })

    } catch (err) {
      return res.status(400).send({ error: 'Erro em carregar os projetos'})
    }
});

router.get('/tasks', async (req, res) => {
  try {
      const tasks = await Task.find().sort('title')
      return res.send({ tasks })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega as tarefas'})
  }
});

router.get('/title', async (req, res) => {
  try {
      const projetos = await Project.find({},{title:1}).sort('title')
      return res.send({ projetos })

  } catch (err) {
      return res.status(400).send({ error: 'Erro em carrega os projetos'})
  }
});

router.get('/:projectId', async (req, res) => {
  try {

    const project = await Project.findById(req.params.projectId).populate(['tasks']);

    return res.send({ project })

  } catch (err) {
    return res.status(400).send({ error: 'Erro em carrega o projeto'})
  }
});


router.post('/', async (req, res) => {
    try {

      const { title, about, tasks, team, endedAt, token} = req.query
      if (token === undefined || token === '' || title === undefined || about === undefined){
        title, about, tasks, team, endedAt, token = req.body
      }

      const project = await Project.create({ title, about, responsible: req.userId, team, endedAt})
        
      await project.save()
              return res.send({ project })

    } catch (err) {
        return res.status(400).send({ error: 'Erro em criar novo projeto'})
    }
});

router.put('/:projectId', async (req, res) => {
  
  try{
    let title, about, team
    let titleTask, assignedTo, aboutTask, frontend, banco, backend, category, subcategory, finishedAt
    if(req.body.title===undefined){
      title = req.query.title
      about = req.query.about
      team = req.query.team
      titleTask = req.query.titleTask
      assignedTo = req.query.assignedTo
      aboutTask = req.query.aboutTask
      frontend = req.query.frontend
      banco = req.query.banco
      backend = req.query.backend
      category = req.query.category
      subcategory = req.query.subcategory
      finishedAt = req.query.finishedAt
    }
    if (req.query.title===undefined){
      title = req.body.title
      about = req.body.about
      team = req.body.team
      titleTask = req.body.titleTask
      assignedTo = req.body.assignedTo
      aboutTask = req.body.aboutTask
      frontend = req.body.frontend
      banco = req.body.banco
      backend = req.body.backend
      category = req.body.category
      subcategory = req.body.subcategory
      finishedAt = req.body.finishedAt
    }
    const task = {title:titleTask, assignedTo, about:aboutTask, frontend,banco,backend,category,subcategory,finishedAt}

    const project = await Project.findByIdAndUpdate(req.params.projectId,
       {title, about, team}, {new: true})
    const projectTask = await new Task({ ...task, project: project._id})
    await projectTask.save()

    project.tasks.push(projectTask)
    await project.save()

    return res.send({project})
  }
  catch(err){
      return res.status(400).send({error:"Erro em criar novo projeto"})
  }
});

router.delete('/:projectId', async (req, res) => {
    try {
      if(req.params.projectId){
      await Project.findByIdAndDelete(req.params.projectId);
      }
      else{
        await Project.findByIdAndDelete(req.query.projectId);
      }
  
      return res.send({ })
  
    } catch (err) {
        return res.status(400).send({ error: 'Erro em deletar o projeto'})
    }  
});

module.exports = app => app.use('/projects', router);
