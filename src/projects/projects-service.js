'use strict';

const ProjectsService = {
  addProject(db, newProject) {
    return db
      .insert(newProject)
      .into('Projects')
      .returning('*')
      .then(([project]) => project);
  },
  getProjects(db, owner_id) {
    return db
      .select('*')
      .from('Projects')
      .where ( {owner_id} );
  }
};

module.exports = ProjectsService;