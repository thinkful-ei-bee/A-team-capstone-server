'use strict';

const CommentsService = {
  addComment(db, newComment) {
    return db
      .insert(newComment)
      .into('comments')
      .returning('*')
      .then(([comment]) => comment);
  },
  getCommentsByUser(db, author_id) {
    return db
      .select('comments.id', 'project_id', 'date_created', 'content', 'project_name')
      .from('comments')
      .join('projects', function() {
        this.on('projects.id', '=', 'comments.project_id');
      })
      .where ('author_id', author_id );
  },
  getCommentsByProject(db, project_id) {
    return db
      .select('comments.*', 'username')
      .from('comments')
      .join('users', function() {
        this.on('comments.author_id', '=', 'users.id');
      })
      .where( {project_id});
  },
  getCommentsForUserProjects(db, user_id) {
    return db
      .select('comments.*') 
      .from('comments')
      .join('projects', function() {
        this.on('comments.project_id', '=', 'projects.id');
      })
      .where('owner_id', user_id);
  },
  getProjectsOpenForComments(db, owner_id) {
    return db
      .select('id')
      .from('projects')
      .where({owner_id})
      .then(arr => {
        return db
          .select('project_id as id')
          .from('usersProjectCollaboration')
          .where('collaborator_id', '=', owner_id)
          .then(arr2 => {
            const objArr = arr.concat(arr2);
            const idArr = objArr.map(ele => ele.id);
            return idArr;
          });
      });       
  }
};

module.exports = CommentsService;