'use strict';

const CollaborationService = {
  addCollaboration(db, newCollaboration) {
    return db
      .insert(newCollaboration)
      .into('usersProjectCollaboration')
      .returning('*')
      .then(([collaboration]) => collaboration);
  },
  getCollaborationsByUser(db, collaborator_id) {
    return db
      .select('usersProjectCollaboration.id', 'collaborator_id', 'project_id', 'project_name', 'position')
      .from('usersProjectCollaboration')
      .join('projects', function() {
        this.on('usersProjectCollaboration.project_id', '=', 'projects.id'); 
      })
      .join('users', function() {
        this.on('users.id', '=', 'collaborator_id');
      })
      .where ( {collaborator_id} );
  },
  getCollaborationsByProject(db, project_id) {
    return db
      .select('usersProjectCollaboration.id', 'project_id', 'collaborator_id', 'position', 'username', 'user_description', 'image')
      .from('usersProjectCollaboration')
      .join('projects', function() {
        this.on('usersProjectCollaboration.project_id', '=', 'projects.id'); 
      })
      .join('users', function() {
        this.on('users.id', '=', 'collaborator_id');
      })
      .where( {project_id});
  },
  deleteCollaboration(db, id) {
    return db('usersProjectCollaboration')
      .where( { id } )
      .del();
  },
  getCollaborationById(db, id) {
    return db
      .select('*')
      .from('usersProjectCollaboration')
      .where( { id } )
      .first();
  }
};

module.exports = CollaborationService;