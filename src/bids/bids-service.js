'use strict';

const BidsService = {
  addBid(db, newBid) {
    return db
      .insert(newBid)
      .into('bids')
      .returning('*')
      .then(([bid]) => bid);
  },
  getBidsByUser(db, user_id) {
    return db
      .select('*')
      .from('bids')
      .where ( {user_id} );
  },
  getBidsByProject(db, project_id) {
    return db
      .select('*')
      .from('bids')
      .where( {project_id});
  },
  getBidsForUserProjects(db, user_id) {
    return db
      .select('bids.*') 
      .from('bids')
      .join('projects', function() {
        this.on('bids.project_id', '=', 'projects.id');
      })
      .where('owner_id', user_id);
  }
};

module.exports = BidsService;