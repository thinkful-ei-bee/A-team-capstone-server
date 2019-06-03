'use strict';

const ProjectsService = {
  addProject(db, newProject) {
    return db
      .insert(newProject)
      .into('Projects')
      .returning('*')
      .then(([project]) => project);
  }
};

module.exports = ProjectsService;