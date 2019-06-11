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
      .select('bids.*', 'username', 'user_description', 'image') 
      .from('bids')
      .join('projects', function() {
        this.on('bids.project_id', '=', 'projects.id');
      })
      .join('users', function() {
        this.on('bids.user_id', '=', 'users.id');
      })
      .where('owner_id', user_id);
  },
  removeBid(db, id) {
    return db('bids')
      .where( { id } )
      .del();
  },
  getBidById(db, id) {
    return db('bids')
      .where( { id } )
      .first();
  },
  acceptBid(db, id) {
    return db('bids')
      .where( { id } )
      .update({status: 'accepted'});
  },
  declineBid(db, id) {
    return db('bids')
      .where( { id } )
      .update({status: 'declined'});
  },
  updateStatus(db, id, newStatus) {
    return db('bids')
      .where( { id } )
      .update({ status: newStatus });
  }
};

module.exports = BidsService;