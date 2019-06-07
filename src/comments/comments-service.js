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
      .select('*')
      .from('comments')
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
  }
};

module.exports = CommentsService;