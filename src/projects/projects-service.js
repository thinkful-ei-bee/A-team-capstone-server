'use strict';
const xss = require('xss');

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
  },
  deleteProject(db, id) {
    return db('projects')
      .where({ id } )
      .del();
  },
  updateProject(db, id, updates) {
    return db('projects')
      .where( { id } )
      .update(updates);
  },
  serializeProjects(projects) {
    return projects.map(project => this.serializeProject(project));
  },
  serializeProject(project) {
    return {
      id: project.id,
      owner_id: project.owner_id,
      project_name: xss(project.project_name),
      created_at: project.created_at,
      project_description: xss(project.project_description),
      languages: xss(project.languages),
      requirements: xss(project.requirements),
      deadline: project.deadline,
      openPositions: project.openPositions,
      openForBids: project.openForBids
    };
  }
};

module.exports = ProjectsService;