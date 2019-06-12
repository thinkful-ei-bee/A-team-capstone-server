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
      .select('*')
      .from('usersProjectCollaboration')
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
        this.on('projects.owner_id', '=', 'users.id');
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