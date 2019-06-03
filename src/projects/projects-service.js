'use strict';

const ProjectsService = {
  addProject(db, newProject) {
    return db
      .insert(newProject)
      .into('projects')
      .returning('*')
      .then(([project]) => project);
  },
  getProjects(db, owner_id) {
    return db
      .select('*')
      .from('projects')
      .where ( {owner_id} );
  }
};

module.exports = ProjectsService;