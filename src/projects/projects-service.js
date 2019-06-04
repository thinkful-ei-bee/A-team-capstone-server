'use strict';

const ProjectsService = {
  addProject(db, newProject) {
    return db
      .insert(newProject)
      .into('projects')
      .returning('*')
      .then(([project]) => project);
  },
  getProjectsFromId(db, owner_id) {
    return db
      .select('*')
      .from('projects')
      .where ( {owner_id} );
  },
  getAllProjects(db) {
    return db
      .select('*')
      .from('projects');
  }
};

module.exports = ProjectsService;