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
      .select('bids.id', 'project_id', 'bid', 'project_name', 'project_description', 'languages', 'requirements', 'deadline', 'openPositions')
      .from('bids')
      .join('projects', function() {
        this.on('projects.id', '=', 'bids.project_id');
      })
      .where ('bids.user_id', user_id );
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
  },
  removeBid(db, id) {
    return db('bids')
      .where( { id } )
      .del();
  }
};

module.exports = BidsService;