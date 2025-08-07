const express = require('express');
const router = express.Router();
const Project = require('./../models/projectModel');

router.get('/', async (req, res) => {
  try {
    const project = await Project.findOne({ name: 'incident-app' });

    if (!project) {
      // First time init
      const newProject = await Project.create({ name: 'incident-app', views: 1 });
      return res.json({ views: newProject.views });
    }

    project.views += 1;
    await project.save();

    res.json({ views: project.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
